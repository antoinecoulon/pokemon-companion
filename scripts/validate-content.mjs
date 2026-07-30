/**
 * Contrôle d'intégrité du contenu migré.
 *
 * TypeScript ne peut pas vérifier qu'un `requires: ['phase-1.4']` pointe vers
 * une tâche qui existe : ce sont des chaînes. Or ces ids sont le contrat de
 * durabilité avec le localStorage, et un `requires` mort bloquerait
 * silencieusement une tâche pour toujours dans le moteur de prochaine action.
 * D'où ce script, à lancer avec `pnpm validate`.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, { alias: { '~': new URL('../app', import.meta.url).pathname } })

const { phases } = await jiti.import('../app/data/phases.ts')
const { pokemon } = await jiti.import('../app/data/pokemon.ts')
const { counters } = await jiti.import('../app/data/counters.ts')
const { readinessCriteria } = await jiti.import('../app/data/readiness.ts')
const { npcs } = await jiti.import('../app/data/npcs.ts')
const { battleItems, consumables } = await jiti.import('../app/data/items.ts')
const { quests } = await jiti.import('../app/data/quests.ts')
const { farmingTopics } = await jiti.import('../app/data/farming.ts')

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

/* --- 7. Ressources : ids uniques, et namespaces sans collision --------- */

/*
 * Ces quatre fichiers n'étaient validés par rien jusqu'ici. Or les ids de PNJ et
 * de quête sont désormais persistés (`resources` dans la sauvegarde), donc ils
 * sont soumis au même contrat de durabilité que les ids de tâche.
 */
const resourceSets = [
  { name: 'npcs.ts', prefix: 'npc', entries: npcs, persisted: true },
  { name: 'quests.ts', prefix: 'quest', entries: quests, persisted: true },
  { name: 'items.ts (battleItems)', prefix: null, entries: battleItems, persisted: false },
  { name: 'items.ts (consumables)', prefix: null, entries: consumables, persisted: false },
  { name: 'farming.ts', prefix: null, entries: farmingTopics, persisted: false },
]

const persistedKeys = new Map()

for (const { name, prefix, entries, persisted } of resourceSets) {
  const seen = new Set()
  for (const entry of entries) {
    if (typeof entry.id !== 'string' || !entry.id) {
      errors.push(`${name} : une entrée n'a pas d'id`)
      continue
    }
    if (seen.has(entry.id)) errors.push(`${name} : id dupliqué « ${entry.id} »`)
    seen.add(entry.id)

    if (!/^[a-z0-9-]+$/.test(entry.id)) {
      warnings.push(`${name} : « ${entry.id} » n'est pas en kebab-case`)
    }

    // Les clés persistées doivent rester uniques une fois préfixées.
    if (persisted) {
      const key = `${prefix}:${entry.id}`
      if (persistedKeys.has(key)) {
        errors.push(`clé de ressource dupliquée « ${key} » (${persistedKeys.get(key)} et ${name})`)
      }
      persistedKeys.set(key, name)
    }
  }
}

/* --- 8. Les sprites déclarés existent sur le disque -------------------- */

/*
 * `sprite: 'tyranitar'` ne garantit pas que le fichier a été téléchargé : sans
 * ce contrôle, une fiche annotée mais sans image donne une image cassée en
 * production. `pnpm sprites` répare.
 */
for (const mon of pokemon) {
  if (!mon.sprite) continue
  for (const variant of ['home', 'pixel']) {
    const file = new URL(`../public/sprites/${variant}/${mon.slug}.png`, import.meta.url)
    const exists = await stat(file).then(() => true).catch(() => false)
    if (!exists) {
      errors.push(`« ${mon.slug} » déclare un sprite mais public/sprites/${variant}/${mon.slug}.png manque — lance pnpm sprites`)
    }
  }
}

/* --- 9. Icônes déclarées hors template --------------------------------- */

/*
 * `icon.clientBundle.scan` ne scanne que les templates. Une icône écrite dans un
 * .ts (nav, compteurs) n'est donc jamais embarquée, et avec `provider: 'none'`
 * elle ne s'affiche nulle part — sans aucune erreur. C'est exactement ce qui
 * avait fait disparaître les 5 icônes de la sidebar et les 4 des compteurs.
 * Cette règle exige que toute icône vue dans un .ts soit listée explicitement
 * dans `icon.clientBundle.icons`.
 */
const configSource = await readFile(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
const declared = new Set(
  [...configSource.matchAll(/'lucide:([a-z0-9-]+)'/g)].map(match => match[1]),
)

for (const dir of ['../app/data', '../app/utils']) {
  const base = new URL(`${dir}/`, import.meta.url)
  for (const file of await readdir(base)) {
    if (!file.endsWith('.ts')) continue
    const source = await readFile(new URL(file, base), 'utf8')
    for (const [, name] of source.matchAll(/i-lucide-([a-z0-9-]+)/g)) {
      if (!declared.has(name)) {
        errors.push(
          `icône « i-lucide-${name} » utilisée dans ${dir.slice(3)}/${file} `
          + 'mais absente de icon.clientBundle.icons dans nuxt.config.ts — elle ne sera pas embarquée',
        )
      }
    }
  }
}

/* --- Rapport ----------------------------------------------------------- */

const activeCount = pokemon.filter(mon => mon.status === 'active').length
console.log(
  `Contenu : ${phases.length} phases · ${allTasks.size} tâches · ${pokemon.length} fiches (${activeCount} actives)`,
)
console.log(
  `Ressources : ${npcs.length} PNJ · ${quests.length} quêtes · `
  + `${battleItems.length + consumables.length} objets · ${farmingTopics.length} rubriques de farm`,
)

for (const warning of warnings) console.warn(`  avertissement — ${warning}`)

if (errors.length) {
  console.error(`\n${errors.length} erreur(s) d'intégrité :`)
  for (const error of errors) console.error(`  ✖ ${error}`)
  process.exit(1)
}

console.log(warnings.length ? `${warnings.length} avertissement(s), aucune erreur.` : 'Intégrité vérifiée.')
