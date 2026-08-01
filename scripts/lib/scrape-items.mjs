/**
 * Scraper des Key Items.
 *
 * Voir `scripts/scrape-wiki.mjs` pour le contrat : chaque module de catégorie
 * exporte `scrape({ fresh })` et renvoie le contenu complet du fichier
 * `app/data/unbound/*.ts` à écrire. Voir `scrape-missions.mjs` pour le modèle détaillé.
 */
import {
  WIKI,
  expectCount,
  fetchPage,
  mainOf,
  parseTables,
  quote,
  toLine,
} from './wiki.mjs'

/* ------------------------------------------------------------------------- *
 * Key Items
 *
 * Deux sources complémentaires :
 * - `/items/key-items/` : une table de **40** lignes (Name / Description /
 *   Location / Screenshot). C'est le total que la page annonce elle-même.
 * - `/items/key-items/<slug>/` : une fiche détail, avec sa propre table
 *   Location / Description / Features.
 *
 * **Seuls 34 des 40 items ont une fiche détail.** Les six autres — Barrier
 * Key, Berry Pouch, Key Cards 1/2/3 (une seule ligne pour les trois), N-Lunarizer,
 * N-Solarizer, TM Case — n'ont pas de lien dans la colonne « Name » : rien à
 * sourcer par une URL dédiée. Contrairement à la mission #001 (qui retombe sur
 * l'index comme source), on les exclut plutôt que d'inventer une fiche : ce
 * module ne couvre que les 34 items pour lesquels une page existe.
 * ------------------------------------------------------------------------- */

const ITEM_COUNT = 34

const DETAIL_URL = /^https:\/\/unboundwiki\.com\/items\/key-items\/([a-z0-9-]+)\/$/

/** Les champs de la fiche détail, dans l'ordre où le wiki les pose. */
const ITEM_FIELDS = ['Location', 'Description', 'Features']

/**
 * Découpe la fiche détail d'un item en champs libellés.
 *
 * Le balisage de ces tables est bien formé chez unboundwiki (contrairement aux
 * fiches mission), mais on reprend quand même la lecture cellule-par-cellule de
 * `scrape-missions.mjs` plutôt qu'un découpage par `<tr>` : un site perso peut
 * changer sa mise en page sans préavis, et cette lecture ne dépend d'aucune
 * fermeture de balise.
 */
const CELL = /<(th|td)\b[^>]*>([\s\S]*?)(?=<\/?(?:th|td|tr|tbody|thead|table)\b)/gi

function parseItemFields(html) {
  const table = /<table\b[^>]*>([\s\S]*?)<\/table>/i.exec(mainOf(html))
  if (!table) return {}

  const cells = [...table[1].matchAll(CELL)].map(match => ({
    tag: match[1].toLowerCase(),
    html: match[2],
  }))

  const fields = {}
  for (let index = 0; index < cells.length; index += 1) {
    const cell = cells[index]
    if (cell.tag !== 'th') continue
    const name = toLine(cell.html)
    if (!ITEM_FIELDS.includes(name)) continue
    const value = cells[index + 1]
    if (!value || value.tag !== 'td') continue
    fields[name] = toLine(value.html)
  }
  return fields
}

export async function scrape({ fresh = false } = {}) {
  const indexUrl = `${WIKI}/items/key-items/`
  const indexHtml = await fetchPage(indexUrl, { fresh })

  const [table] = parseTables(indexHtml)
  if (!table) throw new Error('table des Key Items introuvable sur l’index')

  /**
   * Slug, URL de fiche et nom, pour les seules lignes dont le nom est un lien.
   *
   * Le nom vient de l'index, pas du `<h1>` de la fiche détail : plusieurs pages
   * (DexNav, Trainer Catalogue, ADM) désambiguïsent leur titre avec un suffixe
   * wiki (« (Key Item) », « (Advanced Diggin 'n diving Machine) ») que l'écran
   * du jeu n'affiche jamais.
   */
  const entries = []
  for (const cells of table) {
    const nameCell = cells[0]
    if (!nameCell) continue
    const link = /href="(https:\/\/unboundwiki\.com\/items\/key-items\/[a-z0-9-]+\/)"/i.exec(nameCell)
    if (!link) continue // pas de fiche détail : hors périmètre, voir commentaire plus haut.
    const match = DETAIL_URL.exec(link[1])
    if (!match) continue
    entries.push({ id: match[1], url: link[1], name: toLine(nameCell) })
  }

  expectCount('key items (avec fiche détail)', entries.length, ITEM_COUNT)

  const items = []
  for (const entry of entries.slice().sort((a, b) => a.id.localeCompare(b.id))) {
    const html = await fetchPage(entry.url, { fresh })
    const fields = parseItemFields(html)

    if (!fields.Location) throw new Error(`${entry.id} : pas de Location trouvée`)

    /*
     * `Description` est le texte de description en jeu, `Features` l'explication
     * du wiki. Ils disent la même chose deux fois — l'ADM est « a machine that
     * can be used in place of HMs » puis « a machine that eliminates the need to
     * use most HMs » — et sur 34 objets ça double le texte à l'écran pour rien.
     * On garde `Features`, plus concret, et on retombe sur `Description` quand
     * la page n'en a pas.
     */
    const detail = fields.Features ?? fields.Description
    const details = detail ? [detail] : []

    items.push({
      id: entry.id,
      label: `**${entry.name}**`,
      location: fields.Location,
      details,
      source: entry.url,
    })
  }

  expectCount('key items', items.length, ITEM_COUNT)

  return renderItems(items)
}

function renderItems(items) {
  const entries = items.map((item) => {
    const lines = [
      '  {',
      `    id: ${quote(item.id)},`,
      `    label: ${quote(item.label)},`,
    ]
    if (item.location) lines.push(`    location: ${quote(item.location)},`)
    if (item.details.length) {
      lines.push(`    details: [${item.details.map(quote).join(', ')}],`)
    }
    lines.push(`    source: ${quote(item.source)},`, '  },')
    return lines.join('\n')
  })

  return `import type { KeyItem } from './types'

/**
 * Les ${ITEM_COUNT} Key Items d'Unbound qui ont une fiche détail sur le wiki.
 *
 * **Fichier généré — \`pnpm scrape:wiki items\`.** Ne pas éditer à la main.
 *
 * L'index (\`/items/key-items/\`) annonce 40 Key Items au total, mais seuls
 * ${ITEM_COUNT} d'entre eux ont une page dédiée à sourcer : les six autres —
 * Barrier Key, Berry Pouch, Key Cards 1/2/3, N-Lunarizer, N-Solarizer, TM Case
 * — n'ont qu'une ligne de table, sans URL propre. Ils sont hors de ce fichier
 * plutôt que sourcés sur l'index, par cohérence avec la règle « une entrée
 * sans source vérifiable ne s'écrit pas ».
 *
 * Les noms d'objet et lieux sont en VO : ce sont les chaînes que l'écran
 * affiche.
 */
export const keyItems: KeyItem[] = [
${entries.join('\n')}
] satisfies KeyItem[]

/** Toutes les clés persistées, pour \`knownContent\` et la purge. */
export const keyItemKeys = keyItems.map(item => \`item:\${item.id}\` as const)
`
}
