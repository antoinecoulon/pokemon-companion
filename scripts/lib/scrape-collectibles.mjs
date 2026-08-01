/**
 * Scraper des deux collections dénombrées : Zygarde Cells et raid dens.
 *
 * Voir `scripts/scrape-wiki.mjs` pour le contrat : chaque module de catégorie
 * exporte `scrape({ fresh })` et renvoie le contenu complet du fichier
 * `app/data/unbound/*.ts` à écrire. Modelé sur `scrape-missions.mjs`.
 */
import {
  WIKI,
  expectCount,
  fetchPage,
  parseTables,
  quote,
  slugify,
  toText,
} from './wiki.mjs'

/* ------------------------------------------------------------------------- *
 * Zygarde Cells
 *
 * `/items/zygarde-cells/` porte une table unique : une ligne de titre, une
 * ligne d'en-tête, puis une ligne par cellule. La page **liste #001 à #100**
 * au moment du scrape — pas 99 : le compte attendu ci-dessous suit la page
 * telle qu'elle est, `expectCount` lèverait sinon sur une donnée réelle.
 * ------------------------------------------------------------------------- */

const ZYGARDE_URL = `${WIKI}/items/zygarde-cells/`
const ZYGARDE_COUNT = 100

async function scrapeZygardeCells({ fresh }) {
  const html = await fetchPage(ZYGARDE_URL, { fresh })
  const tables = parseTables(html)
  const table = tables[0]
  if (!table) throw new Error('Zygarde Cells : table introuvable')

  const cells = []
  for (const row of table) {
    if (row.length < 2) continue
    const match = /#(\d{3})/.exec(toText(row[0]))
    if (!match) continue

    // La cellule de localisation porte la zone puis la description sur deux
    // lignes ; on les recolle avec un tiret cadratin plutôt que de n'en garder
    // qu'une, les deux sont nécessaires pour retrouver la cellule en jeu.
    const location = toText(row[1]).split('\n').join(' — ')

    cells.push({
      id: match[1],
      label: `**Cell #${match[1]}**`,
      location,
      source: ZYGARDE_URL,
    })
  }

  expectCount('Zygarde Cells', cells.length, ZYGARDE_COUNT)
  return cells
}

/* ------------------------------------------------------------------------- *
 * Raid Dens
 *
 * `/raid-dens/` porte plusieurs tables ; celle qui nous intéresse est repérée
 * par son en-tête (« Raid Den », « Location »), pas par sa position — la page
 * ouvre sur une table « Star Levels » sans rapport (progression du jeu vers
 * les difficultés de raid disponibles).
 *
 * Chaque den a sa propre page, `/raid-dens/<slug>-raid-den/`, mais le slug de
 * la page n'est pas garanti identique à `slugify(nom)` (abréviations, points).
 * On vérifie donc chaque URL avant de s'y fier, et on retombe sur l'index sinon.
 * ------------------------------------------------------------------------- */

const RAID_INDEX_URL = `${WIKI}/raid-dens/`
const RAID_COUNT = 32

function isRaidTable(table) {
  const header = table[0]?.map(cell => toText(cell)) ?? []
  return header[0] === 'Raid Den' && header[1] === 'Location'
}

async function scrapeRaidDens({ fresh }) {
  const html = await fetchPage(RAID_INDEX_URL, { fresh })
  const table = parseTables(html).find(isRaidTable)
  if (!table) throw new Error('Raid Dens : table introuvable')

  const dens = []
  for (const row of table.slice(1)) {
    if (row.length < 2) continue
    const name = toText(row[0])
    if (!name) continue

    const id = slugify(name)
    const location = toText(row[1])

    const pageUrl = `${WIKI}/raid-dens/${id}-raid-den/`
    let source = RAID_INDEX_URL
    try {
      await fetchPage(pageUrl, { fresh })
      source = pageUrl
    }
    catch {
      // Pas de page dédiée sous ce slug : l'index reste la source.
    }

    dens.push({
      id,
      label: `**${name}**`,
      location,
      repeatable: true,
      source,
    })
  }

  expectCount('Raid Dens', dens.length, RAID_COUNT)
  return dens
}

export async function scrape({ fresh = false } = {}) {
  const [cells, dens] = await Promise.all([
    scrapeZygardeCells({ fresh }),
    scrapeRaidDens({ fresh }),
  ])

  return renderCollectibles(cells, dens)
}

function renderEntries(entries) {
  return entries.map((entry) => {
    const lines = [
      '      {',
      `        id: ${quote(entry.id)},`,
      `        label: ${quote(entry.label)},`,
      `        location: ${quote(entry.location)},`,
    ]
    if (entry.repeatable) lines.push('        repeatable: true,')
    lines.push(`        source: ${quote(entry.source)},`, '      },')
    return lines.join('\n')
  }).join('\n')
}

function renderCollectibles(cells, dens) {
  return `import type { CollectibleSet } from './types'

/**
 * Zygarde Cells et raid dens.
 *
 * **Fichier généré — \`pnpm scrape:wiki collectibles\`.** Ne pas éditer à la main.
 *
 * Les raid dens sont \`repeatable\` : un den se refait indéfiniment, cocher n'y
 * veut dire que « déjà fait au moins une fois », pas « rayé de la liste ». Les
 * comptes ${cells.length} Zygarde Cells et ${dens.length} raid dens sont ceux affichés par le wiki
 * au moment du scrape, et vérifiés par \`expectCount\` à chaque régénération.
 */
export const collectibleSets: CollectibleSet[] = [
  {
    id: 'zygarde-cells',
    title: 'Zygarde Cells',
    description: 'Fragments dispersés dans le monde ; leur assemblage débloque une forme de Zygarde.',
    prefix: 'cell',
    entries: [
${renderEntries(cells)}
    ],
  },
  {
    id: 'raid-dens',
    title: 'Raid Dens',
    description: 'Tanières de combat rejouables, dispersées sur la carte.',
    prefix: 'raid',
    entries: [
${renderEntries(dens)}
    ],
  },
] satisfies CollectibleSet[]

/** Toutes les clés persistées, pour \`knownContent\` et la purge. */
export const collectibleKeys = collectibleSets.flatMap(set =>
  set.entries.map(entry => \`\${set.prefix}:\${entry.id}\` as const),
)
`
}
