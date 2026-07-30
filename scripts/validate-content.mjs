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
import { loadData, loadPokemon, root } from './lib/data.mjs'
import { TEAM_SIZE, validateFiche } from './lib/fiche.mjs'

const { phases } = await loadData('phases.ts')
const { pokemon } = await loadPokemon()
const { counters } = await loadData('counters.ts')
const { readinessCriteria } = await loadData('readiness.ts')
const { npcs } = await loadData('npcs.ts')
const { battleItems, consumables } = await loadData('items.ts')
const { quests } = await loadData('quests.ts')
const { farmingTopics } = await loadData('farming.ts')

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

for (const [id, { task, origin }] of allTasks) {
  const ok = /^phase-\d+\.\d+$/.test(id) || /^mon-[a-z0-9-]+-\d+$/.test(id)
  if (!ok) warnings.push(`« ${id} » (${origin}) ne suit pas la convention phase-<n>.<m> / mon-<slug>-<n>`)

  // Une tâche sans libellé se rend en ligne vide, cochable, et impossible à identifier.
  if (typeof task.label !== 'string' || !task.label.trim()) {
    errors.push(`« ${id} » (${origin}) n'a pas de libellé`)
  }
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

/*
 * Chaque fiche repasse par le contrat de `pnpm import:pokemon`.
 *
 * C'est ce qui garantit qu'une fiche acceptée à l'import reste acceptable
 * ensuite, et qu'une fiche corrigée à la main ne s'écarte pas des règles que
 * l'import impose : mêmes types fermés, mêmes conventions d'id, mêmes bornes
 * d'EV, aucun champ inventé.
 */
const seenSlugs = new Set()
for (const mon of pokemon) {
  if (seenSlugs.has(mon.slug)) errors.push(`slug de Pokémon dupliqué : « ${mon.slug} »`)
  seenSlugs.add(mon.slug)

  if (mon.status === 'active' && typeof mon.slot !== 'number') {
    errors.push(`« ${mon.slug} » est actif mais n'a pas de slot`)
  }

  // Les ids des autres fiches et des phases : les siens ne sont pas des collisions.
  const otherIds = new Set(
    [...allTasks].filter(([, entry]) => entry.origin !== `fiche ${mon.slug}`).map(([id]) => id),
  )
  const report = validateFiche(mon, { knownTaskIds: otherIds })
  for (const error of report.errors) errors.push(`fiche « ${mon.slug} » : ${error}`)
  for (const warning of report.warnings) warnings.push(`fiche « ${mon.slug} » : ${warning}`)
}

/*
 * La composition par défaut doit être exactement les six slots 1..6.
 *
 * L'unicité seule ne suffisait pas : `1,2,4,5,6` passait, et le trou se voyait
 * seulement à l'écran sous la forme d'un « #4 » manquant. Un septième membre
 * passait aussi, alors que toute l'UI parle des six slots de §7.3. La
 * composition *jouée* peut, elle, s'en écarter — elle vit dans la sauvegarde.
 */
const slots = pokemon.filter(mon => mon.status === 'active').map(mon => mon.slot)
const expected = Array.from({ length: TEAM_SIZE }, (_, index) => index + 1)
if (JSON.stringify([...slots].sort((a, b) => a - b)) !== JSON.stringify(expected)) {
  errors.push(
    `la composition par défaut doit occuper les slots ${expected.join(', ')} — trouvé : `
    + `${slots.length ? [...slots].sort((a, b) => a - b).join(', ') : 'aucun'}`,
  )
}

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
  /*
   * `sprite: ''` est falsy : avec un simple `if (!mon.sprite) continue`, une
   * fiche dont le slug pokemondb n'a jamais été rempli sautait tout le contrôle
   * et s'affichait sans image, sans que rien ne le dise. Le contrat interdit
   * désormais la chaîne vide, et on refuse aussi ici.
   */
  if (mon.sprite === undefined) continue
  if (!String(mon.sprite).trim()) {
    errors.push(`« ${mon.slug} » déclare un sprite vide — retire la clé, ou renseigne le slug pokemondb`)
    continue
  }
  for (const variant of ['home', 'pixel']) {
    const file = new URL(`../public/sprites/${variant}/${mon.slug}.png`, import.meta.url)
    const exists = await stat(file).then(() => true).catch(() => false)
    if (!exists) {
      errors.push(`« ${mon.slug} » déclare un sprite mais public/sprites/${variant}/${mon.slug}.png manque — lance pnpm sprites`)
    }
  }
}

/*
 * Sprites sans fiche : ils restent versionnés, donc invisibles et pesants. C'est
 * la trace que laissait une suppression faite à la main.
 */
for (const variant of ['home', 'pixel']) {
  const dir = new URL(`../public/sprites/${variant}/`, import.meta.url)
  for (const file of await readdir(dir)) {
    if (!file.endsWith('.png')) continue
    const slug = file.slice(0, -4)
    if (!slugs.has(slug)) {
      warnings.push(`public/sprites/${variant}/${file} ne correspond à aucune fiche — supprime-le`)
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

/*
 * Parcours récursif : depuis que les fiches vivent dans `app/data/pokemon/`, un
 * `readdir` à plat ne les voyait plus, et une icône déclarée dans une fiche
 * serait passée sous le radar.
 */
async function* typescriptFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}${entry.name}`
    if (entry.isDirectory()) yield * typescriptFiles(`${path}/`)
    else if (entry.name.endsWith('.ts')) yield path
  }
}

for (const dir of [`${root}app/data/`, `${root}app/utils/`]) {
  for await (const path of typescriptFiles(dir)) {
    const source = await readFile(path, 'utf8')
    for (const [, name] of source.matchAll(/i-lucide-([a-z0-9-]+)/g)) {
      if (!declared.has(name)) {
        errors.push(
          `icône « i-lucide-${name} » utilisée dans ${path.replace(root, '')} `
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
