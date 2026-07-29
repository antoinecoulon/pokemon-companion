/**
 * Contrôle d'intégrité du contenu migré.
 *
 * TypeScript ne peut pas vérifier qu'un `requires: ['phase-1.4']` pointe vers
 * une tâche qui existe : ce sont des chaînes. Or ces ids sont le contrat de
 * durabilité avec le localStorage, et un `requires` mort bloquerait
 * silencieusement une tâche pour toujours dans le moteur de prochaine action.
 * D'où ce script, à lancer avec `pnpm validate`.
 */
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, { alias: { '~': new URL('../app', import.meta.url).pathname } })

const { phases } = await jiti.import('../app/data/phases.ts')
const { pokemon } = await jiti.import('../app/data/pokemon.ts')
const { counters } = await jiti.import('../app/data/counters.ts')
const { readinessCriteria } = await jiti.import('../app/data/readiness.ts')

const errors = []
const warnings = []

/* --- Collecte de toutes les tâches ------------------------------------- */

const allTasks = new Map()

function register(task, origin) {
  if (allTasks.has(task.id)) {
    errors.push(`id de tâche dupliqué : « ${task.id} » (${allTasks.get(task.id).origin} et ${origin})`)
    return
  }
  allTasks.set(task.id, { task, origin })
}

for (const phase of phases) {
  for (const task of phase.tasks) register(task, `${phase.id}`)
}
for (const mon of pokemon) {
  for (const task of mon.tasks ?? []) register(task, `fiche ${mon.slug}`)
}

/* --- 1. Les `requires` résolvent --------------------------------------- */

for (const [id, { task, origin }] of allTasks) {
  for (const dep of task.requires ?? []) {
    if (!allTasks.has(dep)) {
      errors.push(`« ${id} » (${origin}) requiert « ${dep} », qui n'existe pas`)
    }
    if (dep === id) {
      errors.push(`« ${id} » se requiert lui-même`)
    }
  }
}

/* --- 2. Aucun cycle de dépendances ------------------------------------- */

const VISITING = 1
const DONE = 2
const state = new Map()

function visit(id, trail) {
  if (state.get(id) === DONE) return
  if (state.get(id) === VISITING) {
    errors.push(`cycle de dépendances : ${[...trail, id].join(' → ')}`)
    return
  }
  state.set(id, VISITING)
  for (const dep of allTasks.get(id)?.task.requires ?? []) {
    if (allTasks.has(dep)) visit(dep, [...trail, id])
  }
  state.set(id, DONE)
}

for (const id of allTasks.keys()) visit(id, [])

/* --- 3. Convention de nommage des ids ---------------------------------- */

for (const [id, { origin }] of allTasks) {
  const ok = /^phase-\d+\.\d+$/.test(id) || /^mon-[a-z0-9-]+-\d+$/.test(id)
  if (!ok) warnings.push(`« ${id} » (${origin}) ne suit pas la convention phase-<n>.<m> / mon-<slug>-<n>`)
}

/* --- 4. Les liens internes pointent vers des routes connues ------------ */

const slugs = new Set(pokemon.map(mon => mon.slug))
const staticRoutes = new Set(['/', '/roadmap', '/equipe', '/ressources', '/reference', '/journal'])

for (const [id, { task }] of allTasks) {
  if (!task.link) continue
  const isSheet = task.link.startsWith('/equipe/') && slugs.has(task.link.slice('/equipe/'.length))
  if (!staticRoutes.has(task.link) && !isSheet) {
    errors.push(`« ${id} » pointe vers « ${task.link} », qui n'est pas une route connue`)
  }
}

/* --- 5. Cohérence des fiches ------------------------------------------- */

const seenSlugs = new Set()
for (const mon of pokemon) {
  if (seenSlugs.has(mon.slug)) errors.push(`slug de Pokémon dupliqué : « ${mon.slug} »`)
  seenSlugs.add(mon.slug)

  if (mon.status === 'active' && typeof mon.slot !== 'number') {
    errors.push(`« ${mon.slug} » est actif mais n'a pas de slot`)
  }

  for (const build of mon.builds ?? []) {
    const total = Object.values(build.evs).reduce((sum, value) => sum + value, 0)
    if (total > 510) {
      errors.push(`« ${mon.slug} » / build « ${build.id} » : ${total} EV, au-delà du plafond de 510`)
    }
    if (build.moves.length !== 4) {
      warnings.push(`« ${mon.slug} » / build « ${build.id} » : ${build.moves.length} capacités au lieu de 4`)
    }
  }

  if (!mon.incomplete && mon.status === 'active' && !(mon.builds ?? []).length) {
    errors.push(`« ${mon.slug} » est actif, non marqué incomplete, mais n'a aucun build`)
  }
}

const slots = pokemon.filter(mon => mon.status === 'active').map(mon => mon.slot)
if (new Set(slots).size !== slots.length) errors.push(`slots d'équipe en doublon : ${slots.join(', ')}`)

/* --- 6. Compteurs et checklist ----------------------------------------- */

if (new Set(counters.map(c => c.id)).size !== counters.length) {
  errors.push('ids de compteurs en doublon')
}
if (readinessCriteria.length !== 7) {
  errors.push(`§13.2 définit 7 critères « Endgame Ready », ${readinessCriteria.length} trouvés`)
}

/* --- Rapport ----------------------------------------------------------- */

const activeCount = pokemon.filter(mon => mon.status === 'active').length
console.log(
  `Contenu : ${phases.length} phases · ${allTasks.size} tâches · ${pokemon.length} fiches (${activeCount} actives)`,
)

for (const warning of warnings) console.warn(`  avertissement — ${warning}`)

if (errors.length) {
  console.error(`\n${errors.length} erreur(s) d'intégrité :`)
  for (const error of errors) console.error(`  ✖ ${error}`)
  process.exit(1)
}

console.log(warnings.length ? `${warnings.length} avertissement(s), aucune erreur.` : 'Intégrité vérifiée.')
