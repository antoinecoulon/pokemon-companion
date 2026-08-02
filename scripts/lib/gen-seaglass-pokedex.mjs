/**
 * Pokédex d'espèces d'Emerald Seaglass, depuis `mrwalkthroughs.com`.
 *
 * Deux niveaux de lecture, et c'est voulu :
 *
 * - la **page index** `/pokedex/` donne les 447 lignes avec leur slug, leurs
 *   numéros de dex et leur nom. C'est la seule liste exhaustive, donc c'est elle
 *   qui fixe le compte ;
 * - la **page de chaque espèce** donne le reste. On ne lit pas les localisations
 *   sur l'index : il les aplatit en une chaîne (« Route 118, Fortree (GR/SR)
 *   (fish) Route 119 (surf) ») là où la fiche les rend en `<li>` propres.
 *
 * ## Ce qu'on ne prend pas, et pourquoi
 *
 * Les **learnsets** sont sur chaque fiche mais restent dehors : 447 × ~25
 * capacités pour une donnée que le Pokédex du jeu affiche déjà bien, dans un SPA
 * installable qu'on ne veut pas alourdir. La colonne **`Change`** des stats reste
 * dehors aussi — elle est dérivable de `seaglass - official`, et l'UI la
 * recalcule. Stocker une valeur dérivée, c'est se garantir de la voir diverger.
 *
 * ## Pièges du balisage, tous rencontrés
 *
 * - les types ne sont **pas** du texte mais des `<span class="type-badge …">` :
 *   les lire comme du texte colle « GrassDragon » sur les doubles types ;
 * - la ligne `Abilities` de l'infobox porte un `rowspan`, donc le `<th>`
 *   n'apparaît **que sur le premier talent**. Les suivants sont des lignes à deux
 *   `<td>` sans en-tête — d'où la détection par `td.thh3` plutôt que par label ;
 * - la table d'évolution décrit **toute la lignée**, pas seulement cette espèce.
 *   Il faut retrouver *sa* ligne par son slug, sinon on récupère la méthode d'un
 *   cousin — Kleavor et Scizor partagent Scyther comme base ;
 * - `Total` est une ligne de la table des stats comme les autres : la prendre
 *   pour une stat donnerait une septième clé.
 */
import { crossCheckTypes, expectCount, header, quote, SOURCES, fetchPage, stripNoise, textOf } from './seaglass.mjs'

/** Les 447 entrées de l'index. Ce compte est le contrat de la source. */
const SPECIES_COUNT = 447

/**
 * Espèces comparables avec la table de dex de la doc officielle.
 *
 * Moins que 447, et ce n'est pas un défaut : la doc numérote jusqu'à 421
 * (Deoxys) puis décrit les extras hors table, et elle écrit quelques noms
 * autrement (`NidoranF`, `PorygonZ`, `Dundunsparce`, `Farfetch'd`).
 */
const CROSS_CHECKED = 413

/** Libellés de la table des stats → clés de `StatKey`. */
const STAT_ROWS = {
  'HP': 'hp',
  'Attack': 'atk',
  'Defense': 'def',
  'Sp. Atk': 'spa',
  'Sp. Def': 'spd',
  'Speed': 'spe',
}

const STAT_ORDER = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']

/** Les types, lus dans les badges plutôt que dans le texte. */
function typeBadges(html) {
  return [...html.matchAll(/<span class="type-badge[^"]*">([^<]+)<\/span>/gi)].map(([, type]) => type.trim())
}

/** Les `<tr>` d'un fragment, en HTML brut : on a besoin des classes et des liens. */
function rawRows(html) {
  return [...stripNoise(html).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(([, row]) => row)
}

function cellsOf(row) {
  return [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(([, cell]) => cell)
}

/**
 * La table qui suit un `<h2>` donné, en HTML brut.
 *
 * ⚠️ Cherche bien un `<h2>` et non le texte nu. Une première version cherchait
 * `>Nom<` pour trouver l'infobox et prenait la table suivante : ça marchait par
 * accident, parce que le nom apparaît d'abord dans le fil d'Ariane. Pour
 * `Nidoran F`, dont le fil d'Ariane écrit autrement, la première occurrence
 * était le titre **de l'infobox lui-même** — donc « la table suivante » était
 * Type Effectiveness, et l'espèce ressortait sans aucun talent. Ce sont les
 * contrôles par espèce qui l'ont attrapé.
 */
function tableAfterHeading(html, heading) {
  const at = html.search(new RegExp(`<h2\\b[^>]*>\\s*${heading}\\s*</h2>`, 'i'))
  if (at < 0) return ''
  const start = html.indexOf('<table', at)
  if (start < 0) return ''
  const end = html.indexOf('</table>', start)
  return end < 0 ? '' : html.slice(start, end)
}

/** L'infobox, repérée par sa classe — le seul ancrage stable de la page. */
function infoboxOf(html) {
  const at = html.search(/<table\b[^>]*\bdextable-infobox\b/i)
  if (at < 0) return ''
  const end = html.indexOf('</table>', at)
  return end < 0 ? '' : html.slice(at, end)
}

/* --- L'index ------------------------------------------------------------- */

/**
 * Exporté pour `gen-seaglass-abilities.mjs`, qui parcourt les mêmes fiches.
 *
 * Les deux générateurs partagent l'index et le cache plutôt que de dupliquer le
 * parcours : le contrat de compte reste ainsi défini à un seul endroit.
 */
export async function readIndexEntries({ fresh = false } = {}) {
  return readIndex({ fresh })
}

async function readIndex({ fresh }) {
  const html = await fetchPage('/pokedex/', { fresh })

  const entries = []
  for (const row of rawRows(html)) {
    const cells = cellsOf(row)
    if (cells.length < 5) continue

    const hoenn = textOf(cells[0]).match(/(\d+)/)
    const national = textOf(cells[1]).match(/(\d+)/)
    const slug = row.match(/\/pokedex\/([a-z0-9-]+)\//i)?.[1]
    if (!hoenn || !national || !slug) continue

    entries.push({
      slug,
      name: textOf(cells[2]),
      hoennDex: Number(hoenn[1]),
      nationalDex: Number(national[1]),
      /* Types de l'index : servent de contrôle croisé contre la fiche. */
      indexTypes: typeBadges(cells[3]),
    })
  }

  expectCount('Pokédex (index)', entries.length, SPECIES_COUNT)
  return entries
}

/* --- Une fiche ----------------------------------------------------------- */

function readSpecies(html, entry) {
  const body = stripNoise(html.slice(html.indexOf('<body')))
  const infobox = infoboxOf(body)
  if (!infobox) throw new Error(`${entry.name} (${entry.slug}) : infobox introuvable`)

  const types = []
  const locations = []
  const abilities = []
  let eggGroups = []

  for (const row of rawRows(infobox)) {
    const cells = cellsOf(row)
    if (!cells.length) continue
    const label = textOf(cells[0])

    /*
     * Un talent est une ligne dont la **première** cellule porte `thh3` — la
     * ligne d'en-tête `Abilities` ayant un rowspan, elle décale les suivantes.
     */
    if (/class="[^"]*\bthh3\b/i.test(row)) {
      const nameCell = cells.find(cell => /class="[^"]*\bthh3\b/i.test(cell)) ?? cells[cells.length - 2]
      const index = cells.indexOf(nameCell)
      const raw = textOf(nameCell)
      const description = textOf(cells[index + 1] ?? '')
      const hidden = /\(Hidden\)\s*$/i.test(raw)
      abilities.push({
        name: raw.replace(/\s*\(Hidden\)\s*$/i, '').trim(),
        description,
        ...(hidden ? { hidden: true } : {}),
      })
      continue
    }

    if (label === 'Type') types.push(...typeBadges(cells[1] ?? ''))
    else if (label === 'Locations') {
      const items = [...(cells[1] ?? '').matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(([, item]) => textOf(item))
      locations.push(...(items.length ? items : [textOf(cells[1] ?? '')]))
    }
    else if (label === 'Egg Groups') {
      eggGroups = textOf(cells[1] ?? '').split(',').map(group => group.trim()).filter(Boolean)
    }
  }

  /* --- Stats : `Total` est une ligne comme les autres, à ne pas prendre. --- */
  const stats = {}
  for (const row of rawRows(tableAfterHeading(body, 'Base Stats'))) {
    const cells = cellsOf(row).map(textOf)
    const key = STAT_ROWS[cells[0]]
    if (!key) continue
    stats[key] = { seaglass: Number(cells[1]), official: Number(cells[2]) }
  }

  /* --- Évolution : retrouver *sa* ligne dans la lignée, par son slug. ------ */
  let evolution
  for (const row of rawRows(tableAfterHeading(body, 'Evolution Line'))) {
    const cells = cellsOf(row)
    if (cells.length < 2) continue
    if (!new RegExp(`/pokedex/${entry.slug}/`, 'i').test(cells[0])) continue
    const method = textOf(cells[1])
    if (!method || /^Base form$/i.test(method)) break
    const from = cells[1].match(/class="branch-source">([^<]+)</i)?.[1]?.trim()
    /* Retirer le fragment « ↳ from X » pour ne garder que la méthode. */
    const bare = method.replace(/^↳?\s*from\s+.*?(?=\s)\s*/i, '').trim()
    evolution = from ? `${from} → ${bare || method}` : method
    break
  }

  return { ...entry, types: types.length ? types : entry.indexTypes, locations, abilities, eggGroups, stats, evolution }
}

/** Les talents d'une fiche seuls — c'est tout ce dont le générateur de talents a besoin. */
export function readSpeciesAbilities(html, entry) {
  return readSpecies(html, entry).abilities
}

/* --- Génération ---------------------------------------------------------- */

/** Contrôles par espèce : une fiche amputée doit lever, en se nommant. */
function assertComplete(species) {
  const where = `${species.name} (${species.slug})`
  if (!species.types.length) throw new Error(`${where} : aucun type`)
  if (!species.abilities.length) throw new Error(`${where} : aucun talent`)
  for (const ability of species.abilities) {
    if (!ability.description) throw new Error(`${where} : le talent « ${ability.name} » n'a pas de description`)
  }
  for (const key of STAT_ORDER) {
    const stat = species.stats[key]
    if (!Number.isFinite(stat?.seaglass) || !Number.isFinite(stat?.official)) {
      throw new Error(`${where} : stat ${key} incomplète (jeu + officiel attendus)`)
    }
  }
  /*
   * L'index et la fiche doivent s'accorder sur les types. C'est le contrôle qui
   * attrape une colonne décalée sur l'un des deux, indépendamment de la doc.
   */
  const fromIndex = [...species.indexTypes].sort().join('/')
  const fromSheet = [...species.types].sort().join('/')
  if (fromIndex && fromIndex !== fromSheet) {
    throw new Error(`${where} : types incohérents entre l'index (${fromIndex}) et la fiche (${fromSheet})`)
  }
}

export async function generate({ fresh = false } = {}) {
  const index = await readIndex({ fresh })

  const species = []
  for (const entry of index) {
    const html = await fetchPage(`/pokedex/${entry.slug}/`, { fresh })
    const parsed = readSpecies(html, entry)
    assertComplete(parsed)
    species.push(parsed)
  }

  expectCount('Pokédex (fiches)', species.length, SPECIES_COUNT)

  /*
   * Le recoupement contre la doc officielle v3.0. C'est ce qui autorise à se
   * servir d'une source tierce : on vérifie plutôt que de croire. Il lève sur
   * écart, et aussi s'il ne compare pas le nombre attendu d'espèces — un
   * garde-fou muet serait pire que pas de garde-fou.
   */
  const compared = await crossCheckTypes(species, { expectedMatches: CROSS_CHECKED })

  species.sort((a, b) => a.hoennDex - b.hoennDex)

  const lines = species.map((entry) => {
    const stats = STAT_ORDER
      .map(key => `${key}: { seaglass: ${entry.stats[key].seaglass}, official: ${entry.stats[key].official} }`)
      .join(', ')
    const abilities = entry.abilities
      .map(ability => `{ name: ${quote(ability.name)}, description: ${quote(ability.description)}${ability.hidden ? ', hidden: true' : ''} }`)
      .join(', ')
    return '  {\n'
      + `    id: ${quote(entry.slug)},\n`
      + `    name: ${quote(entry.name)},\n`
      + `    hoennDex: ${entry.hoennDex},\n`
      + `    nationalDex: ${entry.nationalDex},\n`
      + `    types: [${entry.types.map(quote).join(', ')}],\n`
      + `    locations: [${entry.locations.map(quote).join(', ')}],\n`
      + (entry.evolution ? `    evolution: ${quote(entry.evolution)},\n` : '')
      + `    stats: { ${stats} },\n`
      + `    abilities: [${abilities}],\n`
      + `    eggGroups: [${entry.eggGroups.map(quote).join(', ')}],\n`
      + '  },'
  })

  const retuned = species.filter(entry =>
    STAT_ORDER.some(key => entry.stats[key].seaglass !== entry.stats[key].official),
  ).length

  return header(
    'Pokédex d\'espèces d\'Emerald Seaglass, avec l\'écart de stats vs le jeu officiel.',
    SOURCES.pokedex,
    `${species.length} espèces · ${retuned} dont au moins une stat diffère de l'officiel`
    + ` · ${compared} types recoupés, 0 conflit`,
    { crossChecked: true },
  )
    + '\nimport type { PokedexEntry } from \'../types\'\n\n'
    + 'export const pokedex: PokedexEntry[] = [\n'
    + `${lines.join('\n')}\n`
    + ']\n'
}
