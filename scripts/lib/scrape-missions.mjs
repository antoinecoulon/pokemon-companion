/**
 * Scraper des 84 missions.
 *
 * Voir `scripts/scrape-wiki.mjs` pour le contrat : chaque module de catégorie
 * exporte `scrape({ fresh })` et renvoie le contenu complet du fichier
 * `app/data/unbound/*.ts` à écrire. Celui-ci sert de modèle aux autres.
 */
import {
  WIKI,
  expectCount,
  fetchPage,
  mainOf,
  parseTables,
  quote,
  toLine,
  toText,
} from './wiki.mjs'

/* ------------------------------------------------------------------------- *
 * Missions
 *
 * Deux sources complémentaires :
 * - `/missions/` : une table de 84 lignes, numérotées #001 à #084 sans trou.
 *   C'est elle qui fait foi sur l'existence et le titre d'une mission.
 * - `/missions/mission-<code>/` : les quatre champs libellés Start Location /
 *   Unlock Requirements / Objectives / Reward, plus détaillés que la table.
 *
 * **#001 n'a pas de page détail** — le wiki n'en publie qu'à partir de #002. Il
 * retombe donc sur la ligne de l'index, et sa source est l'URL de l'index.
 * ------------------------------------------------------------------------- */

const MISSION_COUNT = 84

/** Les champs de la fiche, dans l'ordre où le wiki les pose. */
const MISSION_FIELDS = ['Start Location', 'Unlock Requirements', 'Objectives', 'Reward']

/**
 * Découpe la fiche d'une page mission en champs libellés.
 *
 * Les quatre champs sont les lignes d'une table en tête d'article : un `<th>`
 * portant le nom du champ, un `<td>` portant la valeur. On lit ces paires
 * plutôt que le texte de la page — une lecture par texte oblige à deviner où
 * s'arrête la dernière valeur, et la table des matières qui suit s'y était
 * glissée (mission #007).
 *
 * Le balisage du wiki est **invalide** sur ces tables : `<tr>` non fermés,
 * `<td>` refermé par un `</th>`. On ne peut donc pas s'appuyer sur les lignes ;
 * on lit une cellule jusqu'à la balise de cellule suivante, quelle qu'elle soit.
 */
const CELL = /<(th|td)\b[^>]*>([\s\S]*?)(?=<\/?(?:th|td|tr|tbody|thead|table)\b)/gi

function parseMissionFields(html) {
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
    if (!MISSION_FIELDS.includes(name)) continue
    const value = cells[index + 1]
    if (!value || value.tag !== 'td') continue
    // `<li>` et `<br>` deviennent des lignes : c'est ce qui donne les
    // prérequis et objectifs multiples.
    fields[name] = toText(value.html).split('\n').filter(Boolean)
  }
  return fields
}

/**
 * Recolle les récompenses en une ligne.
 *
 * Une mission peut en porter plusieurs, séparées par un `<br>` dans la cellule
 * — donc une ligne chacune ici (« Item: Adamant Orb », « Event: Dialga Capture
 * Opportunity »). Les coller bout à bout donnerait « …Adamant Orb Event: … » ;
 * le point médian rend la frontière visible. Les deux-points ne sont pas
 * retouchés : ces chaînes sont en anglais, pas de fine espace avant.
 */
function joinReward(parts) {
  return parts.map(part => part.trim()).filter(Boolean).join(' · ')
}

export async function scrape({ fresh = false } = {}) {
  const indexUrl = `${WIKI}/missions/`
  const indexHtml = await fetchPage(indexUrl, { fresh })

  /** Titre et section (pré/post-Ligue) depuis l'index, qui fait foi. */
  const index = new Map()

  // Les deux tables de missions sont chacune sous un `<h3>` — « Pre-Pokémon
  // League Missions » et « Post-Pokémon League Missions ». On segmente sur ces
  // titres plutôt que sur les numéros, qui sont alphabétiques donc entrelacés,
  // et on ignore tout le reste de la page : la troisième table (« Mission
  // Rewards ») décrirait les mêmes missions avec d'autres colonnes.
  for (const chunk of mainOf(indexHtml).split(/<h3\b/i)) {
    const heading = chunk.slice(0, 200)
    const isPre = /Pre-Pok[^<]*League Missions/i.test(heading)
    const isPost = /Post-Pok[^<]*League Missions/i.test(heading)
    if (!isPre && !isPost) continue

    for (const rows of parseTables(`<main>${chunk}</main>`)) {
      for (const cells of rows) {
        if (cells.length < 4) continue
        const title = toLine(cells[0])
        const match = /^#(\d{3}):\s*(.+)$/.exec(title)
        if (!match) continue
        index.set(match[1], {
          code: match[1],
          name: match[2].trim(),
          // La cellule porte la ville puis le bâtiment sur deux lignes.
          indexLocation: toText(cells[1]).split('\n').join(', '),
          // La colonne mélange « Requirements: … » et l'objectif ; seul le
          // second nous intéresse, les prérequis viennent de la page détail.
          indexObjective: toText(cells[2])
            .split('\n')
            .filter(line => !/^Requirements?\s*:?$/i.test(line) && !/^Requirements?\s*:/i.test(line))
            .filter(line => line.toLowerCase() !== 'none')
            .join(' '),
          indexReward: toLine(cells[3]),
          postGame: isPost,
        })
      }
    }
  }

  expectCount('missions (index)', index.size, MISSION_COUNT)

  const missions = []
  for (const code of [...index.keys()].sort()) {
    const entry = index.get(code)
    const pageUrl = `${WIKI}/missions/mission-${code}/`

    let fields = {}
    let source = pageUrl
    if (code === '001') {
      // Seule mission sans page dédiée : l'index est sa source.
      source = indexUrl
    }
    else {
      fields = parseMissionFields(await fetchPage(pageUrl, { fresh }))
    }

    const location = (fields['Start Location'] ?? []).join(' — ') || entry.indexLocation
    const unlocks = (fields['Unlock Requirements'] ?? [])
      .filter(line => line.toLowerCase() !== 'none')
    const objective = (fields.Objectives ?? []).join(' ; ') || entry.indexObjective
    const reward = joinReward(fields.Reward ?? []) || entry.indexReward

    missions.push({
      id: code,
      code,
      label: `**#${code}: ${entry.name}**`,
      objective,
      location,
      unlocks,
      reward,
      postGame: entry.postGame,
      source,
    })
  }

  expectCount('missions', missions.length, MISSION_COUNT)

  const missing = missions.filter(mission => !mission.objective)
  if (missing.length) {
    throw new Error(`missions sans objectif : ${missing.map(m => `#${m.code}`).join(', ')}`)
  }

  return renderMissions(missions)
}

function renderMissions(missions) {
  const entries = missions.map((mission) => {
    const lines = [
      '  {',
      `    id: ${quote(mission.id)},`,
      `    code: ${quote(mission.code)},`,
      `    label: ${quote(mission.label)},`,
      `    objective: ${quote(mission.objective)},`,
    ]
    if (mission.location) lines.push(`    location: ${quote(mission.location)},`)
    if (mission.unlocks.length) {
      lines.push(`    unlocks: [${mission.unlocks.map(quote).join(', ')}],`)
    }
    if (mission.reward) lines.push(`    reward: ${quote(mission.reward)},`)
    if (mission.postGame) lines.push('    postGame: true,')
    lines.push(`    source: ${quote(mission.source)},`, '  },')
    return lines.join('\n')
  })

  return `import type { Mission } from '../types'

/**
 * Les 84 missions d'Unbound.
 *
 * **Fichier généré — \`pnpm scrape:wiki missions\`.** Ne pas éditer à la main.
 *
 * La numérotation est celle du jeu : alphabétique, de #001 à #084, sans trou.
 * C'est elle qui forme la clé \`mission:<code>\`, et c'est pour ça qu'elle a été
 * préférée à un slug tiré du titre — un titre peut être corrigé, un numéro non.
 *
 * Les titres, lieux, objectifs et récompenses sont en VO : ce sont les chaînes
 * que l'écran affiche, et l'objectif est cité mot pour mot depuis le wiki.
 *
 * \`postGame\` marque les 27 missions inaccessibles avant d'avoir battu la Ligue.
 * Compléter les 84 est l'une des cinq étoiles de la Black Trainer Card.
 */
export const missions: Mission[] = [
${entries.join('\n')}
] satisfies Mission[]

/** Toutes les clés persistées, pour \`knownContent\` et la purge. */
export const missionKeys = missions.map(mission => \`mission:\${mission.id}\` as const)
`
}
