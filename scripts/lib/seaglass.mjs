/**
 * Lecture des sources Emerald Seaglass.
 *
 * Ce jeu n'a **pas de code source public** — c'est ce qui le distingue d'Elite
 * Redux, et ce qui avait fait conclure qu'il n'y avait rien à générer. C'était
 * vrai du code, faux de la donnée : `mrwalkthroughs.com` publie les 447 fiches
 * d'espèces telles qu'extraites de la ROM, avec pour chaque stat de base la
 * valeur du jeu **et** celle du jeu officiel.
 *
 * Deux sources, deux rôles, et la hiérarchie compte :
 *
 * - **La documentation officielle v3.0**, versionnée dans `docs/emerald-seaglass/`
 *   et relue par `scripts/read-seaglass-doc.py`. C'est **l'autorité** : sur un
 *   désaccord, c'est elle qui tranche.
 * - **mrwalkthroughs.com** — la donnée Pokémon détaillée que la doc ne donne pas
 *   (stats, talents, groupes d'œufs, évolutions) et les lieux des TM.
 *
 * ⚠️ **Ne jamais relire le mirror pokeharbor** : il est antérieur à la v3.0. Il
 * donne 14 types faux et annonce un Battle Tent cassé qui ne l'est plus. C'est
 * lui qui a produit les erreurs du premier tour, et c'est précisément ce que le
 * recoupement ci-dessous existe pour rattraper.
 *
 * Le cache vit dans `.cache/seaglass/wiki/` (git-ignoré). `--fresh` le contourne.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { root } from './data.mjs'

const CACHE_DIR = `${root}.cache/seaglass/wiki/`
const BASE = 'https://mrwalkthroughs.com/pokemon-emerald-seaglass'

/** Texte de la doc officielle, produit par `scripts/read-seaglass-doc.py`. */
const DOC_TEXT = `${root}.cache/seaglass/doc.txt`

/** L'URL qui sert de `source` dans le contenu généré. */
export const SOURCES = {
  pokedex: `${BASE}/pokedex/`,
  tms: `${BASE}/tms-hms/`,
}

/**
 * ⚠️ `mrwalkthroughs.com` est un WordPress derrière un filtre anti-bot : sans
 * User-Agent de navigateur, il répond 403. Même précaution que pour unboundwiki
 * et romhackdex.
 */
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/** Politesse : 447 pages à lire, on ne martèle pas le site. */
const DELAY_MS = 120

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function cacheName(path) {
  return path.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'index'
}

/**
 * Télécharge une page du wiki, en passant par le cache disque.
 *
 * Lève sur un statut non-2xx : continuer sur une 404 produirait un fichier
 * généré silencieusement amputé, ce que les garde-fous cherchent à éviter.
 */
export async function fetchPage(path, { fresh = false } = {}) {
  const cached = `${CACHE_DIR}${cacheName(path)}.html`

  if (!fresh) {
    try {
      return await readFile(cached, 'utf8')
    }
    catch {
      // Absent du cache : on télécharge.
    }
  }

  const url = path.startsWith('http') ? path : `${BASE}${path}`
  const response = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA } })
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`)
  const html = await response.text()

  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(cached, html, 'utf8')
  await sleep(DELAY_MS)
  return html
}

/* ------------------------------------------------------------------------- *
 * Garde-fous
 * ------------------------------------------------------------------------- */

/**
 * Contrôle de compte — même garde-fou que chez Elite Redux, et pour la même
 * raison : un parseur cassé ne lève pas, il rend moins d'entrées en silence.
 */
export function expectCount(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} : ${actual} entrées extraites, ${expected} attendues.\n`
      + '  Soit le parseur est cassé, soit la source a changé. Ne pas ajuster\n'
      + '  le compte sans avoir vérifié la page source à la main.',
    )
  }
}

export function expectAtLeast(label, actual, minimum) {
  if (actual < minimum) {
    throw new Error(`${label} : ${actual} entrées extraites, au moins ${minimum} attendues.`)
  }
}

/* ------------------------------------------------------------------------- *
 * Le recoupement contre la doc officielle
 *
 * C'est **le** garde-fou de ce générateur, et ce qui autorise à se servir d'une
 * source tierce : la table de dex de la v3.0 donne le type de 421 espèces, donc
 * on peut vérifier que le wiki dit la même chose plutôt que de le croire.
 *
 * Il attrape deux pannes distinctes :
 *
 * - un parseur qui décale une colonne — les types partiraient tous de travers ;
 * - un wiki qui suivrait un patch **plus récent** que la doc versionnée. Dans ce
 *   cas l'écart est réel et doit être arbitré à la main, pas absorbé en silence.
 *
 * Mesuré au moment de l'écriture : **413 espèces comparables, 413 accords.**
 * ------------------------------------------------------------------------- */

const TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground',
  'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
]

/**
 * Types par espèce, lus dans la table de dex de la doc officielle.
 *
 * Deux pièges du texte extrait du PDF, tous deux rencontrés :
 *
 * - le nom d'un **lieu** peut commencer par un type (`Rock Smash: Granite Cave`
 *   sur Nosepass), d'où le refus d'un second type suivi de `Smash`/`Climb`/`:` ;
 * - l'extraction laisse des artefacts de kerning (`T own`, `Shar e`), sans effet
 *   ici puisqu'on ne lit que des noms d'espèces et des types.
 */
export async function officialTypes() {
  let text
  try {
    text = await readFile(DOC_TEXT, 'utf8')
  }
  catch {
    throw new Error(
      `documentation officielle absente de ${DOC_TEXT}.\n`
      + '  La produire d\'abord :  python3 scripts/read-seaglass-doc.py\n'
      + '  Ce recoupement est obligatoire — sans lui, rien ne vérifie le wiki.',
    )
  }

  const flat = text.replace(/\s+/g, ' ')
  const type = TYPES.join('|')
  const pattern = new RegExp(
    String.raw`(?<!\d)\d{1,3} ([A-Z][A-Za-z'’.\- ]{1,18}?) (${type})(?: (${type})(?! Smash| Climb|:))?\b`,
    'g',
  )

  const byName = new Map()
  for (const [, name, first, second] of flat.matchAll(pattern)) {
    const key = name.trim().toLowerCase()
    /* Le premier passage gagne : la table de dex précède les listes d'objets. */
    if (!byName.has(key)) {
      byName.set(key, [first, second].filter(Boolean).sort())
    }
  }
  return byName
}

/**
 * Compare les types du Pokédex extrait à ceux de la doc, et **lève** sur écart.
 *
 * Les espèces absentes de la doc ne sont pas un écart : ce sont les extras et
 * easter eggs, que la doc décrit hors de sa table numérotée, plus les noms
 * qu'elle écrit autrement (`NidoranF`, `PorygonZ`, `Dundunsparce`).
 */
export async function crossCheckTypes(entries, { expectedMatches } = {}) {
  const official = await officialTypes()

  const conflicts = []
  let compared = 0

  for (const entry of entries) {
    const expected = official.get(entry.name.trim().toLowerCase())
    if (!expected) continue
    compared += 1
    const actual = [...entry.types].sort()
    if (expected.join('/') !== actual.join('/')) {
      conflicts.push(`${entry.name} : doc v3.0 = ${expected.join('/')}, wiki = ${actual.join('/')}`)
    }
  }

  if (conflicts.length) {
    throw new Error(
      `recoupement doc v3.0 ↔ wiki : ${conflicts.length} conflit(s) de types sur ${compared} espèces.\n`
      + conflicts.map(line => `    ${line}`).join('\n')
      + '\n\n  La doc officielle est l\'autorité. Deux causes possibles :\n'
      + '    · le parseur décale une colonne — le corriger ;\n'
      + '    · le wiki suit un patch plus récent que la doc versionnée — arbitrer\n'
      + '      à la main, et ne rien publier sans avoir tranché.',
    )
  }

  /*
   * Un recoupement qui ne compare rien passerait vert, ce qui serait le pire des
   * cas : un garde-fou muet. D'où la borne basse sur le nombre de comparaisons.
   */
  if (expectedMatches !== undefined) {
    expectCount('recoupement doc v3.0 (espèces comparées)', compared, expectedMatches)
  }

  return compared
}

/* ------------------------------------------------------------------------- *
 * Utilitaires de génération, alignés sur ceux d'Elite Redux
 * ------------------------------------------------------------------------- */

/** Littéral de chaîne TypeScript, apostrophes simples comme le reste du dépôt. */
export function quote(text) {
  return `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* --- Lecture de HTML, sans dépendance ----------------------------------- */

/** Retire scripts, styles et SVG, qui polluent toute extraction de texte. */
export function stripNoise(html) {
  return html.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
}

/** Texte d'un fragment HTML, entités décodées et espaces normalisés. */
export function textOf(html) {
  return decodeEntities(String(html).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

/** Les lignes de texte d'un fragment, une par balise — pratique sur les tables. */
export function linesOf(html) {
  return decodeEntities(stripNoise(String(html)).replace(/<[^>]+>/g, '\n'))
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
}

export function decodeEntities(text) {
  const named = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'', nbsp: ' ',
    eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', ccedil: 'ç',
    rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', hellip: '…',
    ndash: '–', mdash: '—', times: '×', deg: '°',
  }
  return String(text)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (whole, name) => named[name.toLowerCase()] ?? whole)
}

/** Les `<tr>` d'un HTML, chacun rendu comme un tableau de cellules en texte. */
export function tableRows(html) {
  return [...stripNoise(html).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map(([, row]) => [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(([, cell]) => textOf(cell)))
    .filter(cells => cells.length)
}

/**
 * En-tête d'un fichier généré, pour qu'on ne le corrige jamais à la main.
 *
 * `crossChecked` n'est vrai que pour le Pokédex : c'est le seul jeu de données
 * que la doc officielle permet de recouper. L'écrire sur les autres serait une
 * fausse garantie, dans un fichier versionné que personne ne relira.
 */
export function header(what, source, counts, { crossChecked = false } = {}) {
  return `/**\n`
    + ` * ${what}\n`
    + ` *\n`
    + ` * ⚠️ **Fichier généré — ne pas le corriger à la main.** Toute correction\n`
    + ` * serait perdue à la régénération suivante : elle se fait dans le parseur\n`
    + ` * (\`scripts/lib/gen-seaglass-*.mjs\`), puis \`pnpm gen:seaglass\`.\n`
    + ` *\n`
    + ` * Source : ${source}\n`
    + (crossChecked
      ? ` * Recoupé contre la documentation officielle v3.0, qui reste l'autorité.\n`
      : ` * Non recoupable : la doc officielle ne couvre pas cette donnée.\n`)
    + ` * ${counts}\n`
    + ` *\n`
    + ` * Rien ici n'est persisté : aucun id n'entre dans \`knownContent\`, donc une\n`
    + ` * régénération ne peut pas faire perdre une progression.\n`
    + ` */\n`
}
