/**
 * TM et HM d'Emerald Seaglass, avec leur lieu et leurs prérequis.
 *
 * Une seule page à lire, et deux tables : les HM d'abord, puis « All TMs ».
 * Toutes deux ont les colonnes `TM | Location | Screenshot`, la dernière étant
 * vide — les captures sont des images, sans texte à extraire.
 *
 * Pourquoi une section de référence et non des cases à cocher : le lieu d'une TM
 * répond à « où aller la chercher », pas à « qu'ai-je fini ». En faire 68 entrées
 * de complétion gonflerait le compteur d'un jeu sans rien apprendre, et ce projet
 * s'interdit de recopier une entrée qui existe déjà ailleurs.
 *
 * Piège du balisage : le numéro, la capacité et les prérequis vivent **dans la
 * même cellule** (`TM01 Focus Punch (Requires Surf)`), les prérequis étant sur
 * leur propre ligne dans la source. Après normalisation des espaces, il faut donc
 * découper la cellule plutôt que se fier à trois colonnes.
 */
import { expectCount, header, quote, SOURCES, fetchPage, tableRows } from './seaglass.mjs'

/** TM01–TM60 et HM01–HM08. */
const TM_COUNT = 68

/** Celles qui demandent un déplacement ou un badge pour être atteintes. */
const WITH_REQUIRES = 14

export async function generate({ fresh = false } = {}) {
  const html = await fetchPage('/tms-hms/', { fresh })

  const entries = []
  for (const cells of tableRows(html)) {
    if (cells.length < 2) continue

    /* Les lignes d'en-tête (`TM | Location | Screenshot`) n'ont pas de numéro. */
    const match = cells[0].match(/^((?:TM|HM)\d{2})\s+(.+)$/)
    if (!match) continue

    const [, id, rest] = match
    const requires = rest.match(/\(Requires\s+([^)]+)\)/i)?.[1]
    const move = rest.replace(/\s*\(Requires[^)]*\)\s*/i, '').trim()

    entries.push({
      id,
      move,
      location: cells[1].trim(),
      ...(requires
        ? { requires: requires.split(',').map(item => item.trim()).filter(Boolean) }
        : {}),
    })
  }

  expectCount('TM et HM', entries.length, TM_COUNT)
  expectCount('TM et HM avec prérequis', entries.filter(entry => entry.requires).length, WITH_REQUIRES)

  for (const entry of entries) {
    if (!entry.move) throw new Error(`${entry.id} : capacité absente`)
    if (!entry.location) throw new Error(`${entry.id} : lieu absent`)
  }

  /* HM avant TM, puis par numéro : c'est l'ordre de la source, et l'ordre utile. */
  entries.sort((a, b) => a.id.localeCompare(b.id))

  const lines = entries.map(entry =>
    `  { id: ${quote(entry.id)}, move: ${quote(entry.move)}`
    + (entry.requires ? `, requires: [${entry.requires.map(quote).join(', ')}]` : '')
    + `, location: ${quote(entry.location)} },`,
  )

  return header(
    'TM et HM d\'Emerald Seaglass, avec leur lieu et leurs prérequis.',
    SOURCES.tms,
    `${entries.length} TM et HM · ${WITH_REQUIRES} demandent un déplacement ou un badge`,
  )
    + '\nimport type { TmEntry } from \'../types\'\n\n'
    + 'export const tms: TmEntry[] = [\n'
    + `${lines.join('\n')}\n`
    + ']\n'
}
