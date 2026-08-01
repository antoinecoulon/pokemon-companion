/**
 * Scraper des move tutors.
 *
 * Voir `scripts/scrape-wiki.mjs` pour le contrat, et `scrape-missions.mjs` pour
 * le modèle suivi ici.
 */
import {
  WIKI,
  expectCount,
  fetchPage,
  mainOf,
  parseTables,
  quote,
  slugify,
  toLine,
  toText,
} from './wiki.mjs'

/* ------------------------------------------------------------------------- *
 * Move tutors
 *
 * Une seule page, `/misc-info/move-tutors/` : un `<h2>` par groupe (Shard,
 * KBT Expressway Gem Family, Battle Frontier), un `<h3>` par tutor. Chaque
 * tutor porte deux tables : une fiche libellée (Location / Screenshot /
 * Unlock Requirements **ou** Prerequisites — le libellé change selon le
 * groupe, sans différence de sens) puis la table des capacités enseignées.
 *
 * La table des matières en tête de page relie chaque tutor en `<a>`, mais ne
 * pose aucun `<h3>` : découper sur `<h3\b` ne la traverse donc jamais, pas
 * besoin de la filtrer explicitement. Le widget de retour en pied de page,
 * lui, pose un vrai `<h3>Found an error?</h3>` — on tronque le HTML avant son
 * marqueur pour ne pas le compter comme un 30ᵉ tutor.
 * ------------------------------------------------------------------------- */

const TUTOR_PAGE = `${WIKI}/misc-info/move-tutors/`
const TUTOR_COUNT = 29

/** Un `<h3>` de tutor, capturé avec tout son contenu jusqu'au prochain titre. */
const H3_BLOCK = /<h3\b[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3\b|<h2\b|$)/gi

function parseTutorFields(infoRows) {
  const fields = {}
  for (const row of infoRows) {
    if (row.length < 2) continue
    const label = toLine(row[0])
    fields[label] = toText(row[1]).split('\n').filter(Boolean).join(' ')
  }
  return fields
}

function parseTutorMoves(movesRows) {
  const moves = []
  for (const row of movesRows) {
    if (row.length !== 2) continue
    const name = toLine(row[0])
    const cost = toLine(row[1])
    // La première ligne de la table est le titre en colspan (une seule
    // cellule, déjà écartée par le `length !== 2` ci-dessus) ; la seconde est
    // l'en-tête « Move / Cost », qu'il faut écarter explicitement.
    if (name === 'Move' && cost === 'Cost') continue
    if (!name) continue
    moves.push({ name, cost })
  }
  return moves
}

export async function scrape({ fresh = false } = {}) {
  const html = await fetchPage(TUTOR_PAGE, { fresh })

  // Tronqué avant le widget de retour, dont le `<h3>Found an error?</h3>`
  // serait sinon lu comme un 30ᵉ tutor sans fiche ni table de capacités.
  const body = mainOf(html).split('<div class="feedback-widget-v1"')[0]

  const tutors = []
  const seen = new Set()

  for (const match of body.matchAll(H3_BLOCK)) {
    const name = toLine(match[1])
    const content = match[2]

    const tables = parseTables(`<main>${content}</main>`)
    if (tables.length < 2) {
      throw new Error(`tutor "${name}" : moins de deux tables trouvées (fiche + capacités attendues).`)
    }

    const fields = parseTutorFields(tables[0])
    const location = fields.Location ?? ''
    // Les tutors du Battle Frontier libellent ce champ « Prerequisites » ; les
    // Shard et Gem Family tutors « Unlock Requirements ». Même information.
    const requirement = fields['Unlock Requirements'] ?? fields.Prerequisites ?? ''

    const moves = parseTutorMoves(tables[1])
    if (!moves.length) {
      throw new Error(`tutor "${name}" : aucune capacité extraite.`)
    }

    const id = slugify(name)
    if (seen.has(id)) {
      throw new Error(`tutor "${name}" : id "${id}" en doublon.`)
    }
    seen.add(id)

    tutors.push({
      id,
      label: `**${name}**`,
      location,
      details: requirement ? [requirement] : [],
      moves,
      source: TUTOR_PAGE,
    })
  }

  expectCount('move tutors', tutors.length, TUTOR_COUNT)

  const missing = tutors.filter(tutor => !tutor.location)
  if (missing.length) {
    throw new Error(`tutors sans localisation : ${missing.map(t => t.id).join(', ')}`)
  }

  return renderTutors(tutors)
}

function renderTutors(tutors) {
  const entries = tutors.map((tutor) => {
    const lines = [
      '  {',
      `    id: ${quote(tutor.id)},`,
      `    label: ${quote(tutor.label)},`,
      `    location: ${quote(tutor.location)},`,
    ]
    if (tutor.details.length) {
      lines.push(`    details: [${tutor.details.map(quote).join(', ')}],`)
    }
    lines.push(`    moves: [`)
    for (const move of tutor.moves) {
      lines.push(`      { name: ${quote(move.name)}, cost: ${quote(move.cost)} },`)
    }
    lines.push('    ],')
    lines.push('    repeatable: true,')
    lines.push(`    source: ${quote(tutor.source)},`, '  },')
    return lines.join('\n')
  })

  return `import type { Tutor } from '../types'

/**
 * Les ${tutors.length} move tutors d'Unbound (Shard Tutors, Gem Family du KBT
 * Expressway, Battle Frontier).
 *
 * **Fichier généré — \`pnpm scrape:wiki tutors\`.** Ne pas éditer à la main.
 *
 * \`repeatable\` vaut toujours vrai : un tutor continue d'enseigner après un
 * premier passage, contrairement à une mission ou un objet unique. Cocher une
 * entrée ici veut donc dire « repéré / débloqué », pas « consommé » — voir
 * \`WikiEntry.repeatable\` dans \`types.ts\`.
 */
export const tutors: Tutor[] = [
${entries.join('\n')}
] satisfies Tutor[]

/** Toutes les clés persistées, pour \`knownContent\` et la purge. */
export const tutorKeys = tutors.map(tutor => \`tutor:\${tutor.id}\` as const)
`
}
