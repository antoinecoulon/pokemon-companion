"""Relit la documentation officielle d'Emerald Seaglass, en texte.

Emerald Seaglass n'a **pas de code source public** : sa seule source primaire est
un PDF de 8 pages écrit par son auteur. Ce script en extrait le texte, et c'est
la voie à reprendre à chaque nouvelle version du patch.

    curl -s -A "Mozilla/5.0 …" -L -o .cache/seaglass/doc.pdf <mirror>
    python3 scripts/read-seaglass-doc.py .cache/seaglass/doc.pdf

Deux pièges rencontrés, et la raison d'être de ce fichier :

- **le PDF utilise des polices Type0 (CID)**, dont le texte est encodé en chaînes
  hexadécimales qu'il faut passer par la CMap `/ToUnicode` de chaque police. Une
  extraction naïve qui cherche des chaînes `(…)` littérales rend **une chaîne
  vide**, sans erreur ;
- **chaque mot est positionné par son propre `BT…ET`**, y compris chaque glyphe
  des titres. Il n'y a donc aucun espace dans le flux : les fragments se
  recollent à l'heuristique en fin de fichier, où un déplacement sans texte vaut
  un espace.

Sans dépendance, délibérément : ni `pip` ni `poppler` ne sont disponibles dans
cet environnement, et le sitemap d'un wiki n'existe pas ici pour compenser.
Ce n'est pas un script de contenu — il ne génère rien dans `app/data/`, il ne
fait que rendre la source lisible pour une transcription à la main.
"""
import re
import sys
import zlib

path = sys.argv[1] if len(sys.argv) > 1 else '.cache/seaglass/doc.pdf'
data = open(path, 'rb').read()


def objects(buf):
    """Indexe les objets indirects : num -> (dict_brut, flux_décompressé)."""
    found = {}
    for m in re.finditer(rb'(\d+)\s+\d+\s+obj\b(.*?)\bendobj', buf, re.S):
        num = int(m.group(1))
        body = m.group(2)
        stream = None
        s = re.search(rb'stream\r?\n', body)
        if s:
            raw = body[s.end():]
            raw = raw[:raw.rfind(b'endstream')]
            if b'/FlateDecode' in body[:s.start()]:
                try:
                    stream = zlib.decompress(raw)
                except Exception:
                    stream = None
            else:
                stream = raw
        found[num] = (body[:s.start()] if s else body, stream)
    return found


objs = objects(data)


def parse_cmap(text):
    """bfchar / bfrange -> {code: str}."""
    table = {}
    for block in re.findall(rb'beginbfchar(.*?)endbfchar', text, re.S):
        for src, dst in re.findall(rb'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', block):
            table[int(src, 16)] = bytes.fromhex(dst.decode()).decode('utf-16-be', 'replace')
    for block in re.findall(rb'beginbfrange(.*?)endbfrange', text, re.S):
        for lo, hi, dst in re.findall(
            rb'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', block
        ):
            start, end = int(lo, 16), int(hi, 16)
            base = int(dst, 16)
            for i in range(end - start + 1):
                table[start + i] = chr(base + i)
    return table


# Nom de police (/F1…) -> CMap, en suivant /Font << /F1 n 0 R >> puis /ToUnicode.
fonts = {}
for num, (head, _) in objs.items():
    for name, ref in re.findall(rb'/(F\d+|C\d+_\d+|[A-Za-z]\w*)\s+(\d+)\s+0\s+R', head):
        target = objs.get(int(ref))
        if not target:
            continue
        tu = re.search(rb'/ToUnicode\s+(\d+)\s+0\s+R', target[0])
        if tu and objs.get(int(tu.group(1))) and objs[int(tu.group(1))][1]:
            fonts[name.decode()] = parse_cmap(objs[int(tu.group(1))][1])

if not fonts:
    sys.exit('aucune CMap /ToUnicode trouvée')

pages = []
for num, (head, stream) in objs.items():
    if stream and (b'Tj' in stream or b'TJ' in stream) and b'/' in stream:
        pages.append((num, stream))
pages.sort()

pattern = re.compile(
    rb'/([A-Za-z]\w*)\s+[\d.]+\s+Tf'          # 1 : sélection de police
    rb'|\[((?:[^\[\]\\]|\\.)*)\]\s*TJ'         # 2 : tableau de chaînes
    rb'|(<[0-9A-Fa-f\s]*>|\((?:[^()\\]|\\.)*\))\s*Tj'  # 3 : chaîne simple
    rb'|(T\*|TD|Td|ET)'                        # 4 : saut de ligne
)

out = []
for _, stream in pages:
    cmap = {}
    for m in pattern.finditer(stream):
        if m.group(1):
            cmap = fonts.get(m.group(1).decode(), {})
        elif m.group(4):
            out.append('\n' if m.group(4) == b'T*' else '\x00')
        else:
            blob = m.group(2) if m.group(2) is not None else m.group(3)
            for tok in re.finditer(rb'<([0-9A-Fa-f\s]*)>|\(((?:[^()\\]|\\.)*)\)', blob):
                if tok.group(1) is not None:
                    hexs = re.sub(rb'\s', b'', tok.group(1)).decode()
                    codes = [int(hexs[i:i + 4], 16) for i in range(0, len(hexs) - 3, 4)]
                    out.append(''.join(cmap.get(c, '') for c in codes))
                else:
                    lit = tok.group(2).decode('latin-1')
                    out.append(lit)
    out.append('\n\n')

"""Recolle les fragments.

Le PDF positionne chaque mot — et chaque glyphe des titres — par un `Td`
séparé, marqué ici `\\x00`. Deux fragments d'un seul caractère appartiennent au
même mot et se collent ; dès que l'un des deux est plus long, c'est une
frontière de mot.
"""
joined = []
prev = ''
gap = False
for frag in ''.join(out).split('\x00'):
    if not frag:
        # Déplacement sans texte : c'est l'espace, que le PDF ne code pas comme glyphe.
        gap = True
        continue
    if prev and not prev.endswith((' ', '\n')) and not frag.startswith((' ', '\n')):
        if gap or len(frag.strip()) > 1 or len(prev.strip()) > 1:
            joined.append(' ')
    joined.append(frag)
    prev = frag
    gap = False

text = ''.join(joined)
text = re.sub(r'[ \t]+', ' ', text)
text = re.sub(r'[ \t]+\n', '\n', text)
text = re.sub(r'\n{3,}', '\n\n', text)
open('.cache/seaglass/doc.txt', 'w').write(text)
print('polices:', list(fonts), '| flux de page:', len(pages), '| caractères:', len(text))
