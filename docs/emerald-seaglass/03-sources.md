# Sources

## Le principe

Emerald Seaglass n'a **pas de code source public**. On en avait conclu qu'il n'y avait rien à
générer : c'était vrai du *code*, et faux de la *donnée*. Deux sources se partagent le terrain, et la
hiérarchie entre elles est ce qui compte :

- **La documentation officielle de l'auteur** est l'**autorité**. Sur un désaccord, c'est elle qui
  tranche, toujours.
- **`mrwalkthroughs.com`** fournit la donnée Pokémon détaillée que la doc ne donne pas — et il est
  **recoupé contre elle**, automatiquement, à chaque génération.

Ce qui n'est dans aucune des deux n'entre pas dans ce dossier : ça va dans la liste « à vérifier en
jeu » du [README](README.md).

---

## Source primaire : la documentation officielle v3.0

| | |
| --- | --- |
| Autorité | **Totale** — c'est l'auteur qui décrit son propre hack |
| Version | **v3.0**, confirmée à la source primaire |
| Où | **Versionnée dans ce dépôt** : `Pokemon Emerald Seaglass Documentation v3.0.pdf` (8 pages) et `PatchNotes_EmeraldSeaglass3.0.txt` |
| Origine | Ko-fi : <https://ko-fi.com/nemo622> ; page patch <https://ko-fi.com/s/aabf18551d> |
| Comment la relire | `python3 scripts/read-seaglass-doc.py` → `.cache/seaglass/doc.txt` |
| Pièges d'extraction | Polices **Type0/CID** (une extraction naïve rend une chaîne **vide**, sans erreur) et **un `BT…ET` par mot** (aucun espace dans le flux). D'où le script, sans dépendance : ni `pip` ni `poppler` ici |
| Artefacts résiduels | Le texte extrait garde du kerning (`V isit`, `T own`, `dif ficulty`, `Lv .`) — corrigé silencieusement à la transcription, jamais recopié tel quel |

⚠️ **Ko-fi est derrière Cloudflare** : ni `WebFetch` ni `curl` ne passent. C'est la raison pour
laquelle le PDF est maintenant versionné dans le dépôt plutôt que retéléchargé.

### ⚠️ Le mirror pokeharbor est périmé — ne plus le lire

Le premier tour de ce dossier s'appuyait sur un mirror
(`pokeharbor.com/wp-content/uploads/2024/08/…`), faute d'accès à Ko-fi. **Ce mirror est antérieur à la
v3.0**, et il a produit de vraies erreurs, publiées dans l'app avant d'être corrigées :

- **14 types faux**, là où la v3.0 a retypé : Blastoise `Water/Steel`, Ekans `Poison/Dark`, Golduck
  `Water/Psychic`, Seel `Water/Ice`, Hypno `Psychic/Dark`, Electivire `Electric/Fighting`, Magmortar
  `Fire/Dark`, Meganium `Grass/Fairy`, Typhlosion `Fire/Ground`, Feraligatr `Water/Dark`, Ninjask
  `Bug/Dark`, Aggron `Steel/Dragon`, Huntail `Water/Dragon`, Gorebyss `Water/Fairy` ;
- un **Battle Tent annoncé cassé** (`BAD EGG`, entrée bloquée par un PNJ) qui ne l'est plus : la v3.0
  a retiré cette entrée de ses « Known Issues » ;
- **19 cheat codes manquants** (`GIMMENUGS!` et les 18 codes monotype) ;
- deux objets d'évolution et un objet clé manquants (`Electirizer`, `Magmarizer`, `S.S. Tidal Ticket`) ;
- la précision, ajoutée en v3.0, que **le Lati rencontré est tiré au hasard** et re-tiré à chaque
  Elite Four battu.

**La leçon, et elle est générale : un mirror n'a pas de version.** Il sert le fichier qu'il a
téléchargé un jour, sans dire lequel. « Confirmé fidèle » ne voulait donc rien dire — fidèle à quoi.

---

## Source de la donnée Pokémon : `mrwalkthroughs.com`

<https://mrwalkthroughs.com/pokemon-emerald-seaglass/>

| | |
| --- | --- |
| Autorité | Tierce, mais **manifestement extraite de la ROM** — chaque fiche affiche la stat du hack *et* celle du jeu officiel, ce qu'aucune recopie à la main ne produirait |
| Fiabilité | **Recoupée** : 413 espèces comparables avec la table de dex de la v3.0, **413 accords, zéro conflit** |
| Périmètre retenu | `/pokedex/` (447 espèces : n° Hoenn et National, types, localisations, stats + écart, talents dont le caché, groupes d'œufs, évolutions) et `/tms-hms/` (68 TM et HM avec lieux et prérequis) |
| Automatisable | **Oui**, et automatisé : `pnpm gen:seaglass <pokedex\|abilities\|tms\|all>` |
| Piège | WordPress derrière un filtre anti-bot : **403 sans User-Agent de navigateur**, comme unboundwiki et romhackdex |

### Le garde-fou, et pourquoi il est central

Se servir d'une source tierce n'est acceptable que parce qu'elle est **vérifiable**. À chaque
génération, `crossCheckTypes()` compare les types des 447 espèces à la table de dex de la doc
officielle et **lève** au moindre écart. Il attrape deux pannes distinctes :

- un parseur qui décale une colonne — les types partiraient tous de travers ;
- **un wiki qui suivrait un patch plus récent que la doc versionnée** : l'écart est alors réel et doit
  être arbitré à la main, pas absorbé en silence.

Un recoupement qui ne comparerait rien passerait vert, ce qui serait pire que pas de recoupement :
d'où le contrôle du **nombre de comparaisons** (413), et non seulement du nombre de conflits.

### Ce qui n'est délibérément pas exploité

- **Le walkthrough en 30 parties** (`/part-1/` … `/part-30/`) : lieux des objets route par route, et
  **les équipes des Gym Leaders**. Écarté pour deux raisons déjà actées — ne pas décalquer un
  walkthrough d'Emerald vanilla, et ne pas embarquer les équipes de la Ligue avant d'avoir joué,
  exactement comme le `TrainerList` d'Elite Redux.
- **Les learnsets complets**, présents sur chaque fiche : 447 × ~25 capacités gonfleraient le bundle
  d'un SPA installable pour une donnée que le Pokédex du jeu affiche déjà bien. À rouvrir si le besoin
  se fait sentir manette en main.
- **Les niveaux et taux de rencontre** : la source ne les publie pas. C'est pourquoi ce jeu a un
  `pokedex` et **pas** d'`encounters` — remplir `EncounterZone` de zéros aurait été inventer de la
  donnée.

---

## Sources écartées

| Source | Verdict |
| --- | --- |
| `github.com/jimineybillybob1/PokemonEmeraldSeaglassGuide` | **Écarté, et non plus « en réserve »** : son propre README dit qu'il tire son dex et ses localisations de `mrwalkthroughs.com`, et le reste du PDF officiel. Il est donc **dérivé de nos deux sources**, sans les recouper — il n'apporte rien et ajoute une génération de retard. Dépôt non officiel, 0 star. |
| `gbacodes.com` | Ferme SEO. C'est elle qui rapportait « v3.0, 2024-09-21 » — la version se trouve désormais confirmée à la source primaire, donc cette citation n'a plus lieu d'être. |
| `romhackdex.net` | **Ne couvre pas ce jeu.** Vérifié. |
| `wiki.elite-redux.com` & co. | Autre jeu, sans rapport. |

### Les sites à ne jamais utiliser

Fermes SEO ou sites non confirmés, ni comme source de contenu **ni comme lieu de téléchargement du
patch** : `gbacodes.com`, `pokeharbor.com`, `pokehacks.net`, `pokepatched.com`, `ducumon.click`,
`visualboyadvance.org`, `pokemon-roms.net`, `gigachadgamers.com`, et
`pokemonemeraldseaglass.com` — qui s'annonce « Official Game Download » **sans être confirmé comme le
site de l'auteur**.

**Le seul point d'entrée légitime pour le patch reste Ko-fi** (<https://ko-fi.com/nemo622>).

---

## Le canal Discord

L'auteur y renvoie pour les bugs (section Known Issues) et pour la liste des émulateurs recommandés,
mais son URL d'invitation n'a jamais été vérifiée. **Volontairement non publiée** ici.

---

## Ce qui reste à vérifier en jeu

Voir la liste complète et numérotée dans le [README](README.md).
