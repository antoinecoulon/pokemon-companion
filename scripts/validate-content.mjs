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
import { loadApp, loadData, loadUnbound, loadPokemon, root } from './lib/data.mjs'
import { TEAM_SIZE, validateFiche } from './lib/fiche.mjs'

/*
 * Le registre est chargé pour contrôler ce qui est *dérivé* du contenu —
 * `knownContent`, les entrées de tâche, les clés de complétion. Les fichiers de
 * contenu Unbound restent chargés un par un juste en dessous : les contrôles
 * d'ids, de sources et de comptes leur sont propres.
 */
const { games } = await loadData('games.ts')
/* Listes fermées partagées, pour contrôler le Pokédex généré d'un jeu. */
const { POKEMON_TYPES } = await loadData('types.ts')
const { STAT_KEYS } = await loadApp('utils/stats.ts')

const { phases } = await loadUnbound('phases.ts')
const { pokemon } = await loadPokemon()
const { counters } = await loadUnbound('counters.ts')
const { readinessCriteria } = await loadUnbound('readiness.ts')
const { npcs } = await loadUnbound('npcs.ts')
const { battleItems, consumables } = await loadUnbound('items.ts')
const { farmingTopics } = await loadUnbound('farming.ts')
const { completionSections } = await loadUnbound('completion.ts')
const { missions } = await loadUnbound('missions.ts')
const { tutors } = await loadUnbound('tutors.ts')
const { collectibleSets } = await loadUnbound('collectibles.ts')
const { keyItems } = await loadUnbound('keyitems.ts')

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

/*
 * Les `link` de tâche sont **relatifs à la racine du jeu** : c'est
 * `buildTaskEntries` qui les préfixe (`/unbound/equipe/…`). Écrire un lien déjà
 * préfixé produirait `/unbound/unbound/…`, donc un 404.
 */
const staticRoutes = new Set(['/', '/roadmap', '/equipe', '/ressources', '/reference', '/journal', '/completion'])

/** Toutes les ancres qu'une page de référence sait ouvrir, sections et sous-sections. */
function referenceAnchors(game) {
  const anchors = new Set()
  const walk = (sections) => {
    for (const section of sections ?? []) {
      anchors.add(section.id)
      walk(section.subsections)
    }
  }
  walk(game.content.reference?.mechanics)
  return anchors
}

for (const game of games) {
  const gameSlugs = new Set(game.content.pokemon.map(mon => mon.slug))
  const anchors = referenceAnchors(game)
  for (const phase of game.content.phases) {
    for (const task of phase.tasks) {
      if (!task.link) continue
      if (task.link.startsWith(game.basePath)) {
        errors.push(`${game.id} : « ${task.id} » a un lien déjà préfixé (« ${task.link} ») — il doit être relatif à la racine du jeu`)
        continue
      }
      /*
       * Une ancre est autorisée (`/reference#roxanne`) et se contrôle : sans ça,
       * une coquille dans le fragment atterrirait en haut de page sans rien
       * signaler — le mode d'échec silencieux habituel de ce projet.
       */
      const [path, anchor] = task.link.split('#')
      const isSheet = path.startsWith('/equipe/') && gameSlugs.has(path.slice('/equipe/'.length))
      if (!staticRoutes.has(path) && !isSheet) {
        errors.push(`${game.id} : « ${task.id} » pointe vers « ${path} », qui n'est pas une route connue`)
      }
      if (anchor !== undefined) {
        if (path !== '/reference') {
          errors.push(`${game.id} : « ${task.id} » porte une ancre sur « ${path} », que seule /reference sait ouvrir`)
        }
        else if (!anchors.has(anchor)) {
          errors.push(`${game.id} : « ${task.id} » pointe vers l'ancre « #${anchor} », absente des sections de référence`)
        }
      }
      /*
       * Une page facultative non fournie répond 404 : y envoyer une tâche
       * enverrait le joueur dans le mur.
       */
      if (path === '/reference' && !game.content.reference) {
        errors.push(`${game.id} : « ${task.id} » pointe vers /reference, que ce jeu ne fournit pas`)
      }
      if (path === '/ressources' && !game.content.resources) {
        errors.push(`${game.id} : « ${task.id} » pointe vers /ressources, que ce jeu ne fournit pas`)
      }
    }
  }
}

const slugs = new Set(pokemon.map(mon => mon.slug))

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
/*
 * Le nombre de critères « Ready » dépend du jeu : Unbound en a 7 (§13.2), Elite
 * Redux aussi mais pas les mêmes — pas d'IV (31 par défaut), un critère
 * `innates` à la place. Ce qui doit rester vrai partout, c'est qu'il y en ait,
 * qu'ils soient uniques et que leurs clés appartiennent à l'union fermée : une
 * clé inventée rendrait `undefined`, donc `met: false`, donc un critère
 * durablement non rempli sans la moindre erreur.
 */
const READINESS_KEYS = new Set(['level', 'ivs', 'evs', 'nature', 'ability', 'innates', 'moves', 'item'])

for (const game of games) {
  const criteria = game.content.readinessCriteria
  if (!criteria.length) {
    errors.push(`${game.id} : aucun critère « Ready » défini`)
    continue
  }
  const keys = criteria.map(criterion => criterion.key)
  if (new Set(keys).size !== keys.length) {
    errors.push(`${game.id} : clés de critères « Ready » en doublon`)
  }
  for (const key of keys) {
    if (!READINESS_KEYS.has(key)) {
      errors.push(`${game.id} : critère « Ready » inconnu « ${key} » — absent de ReadinessKey`)
    }
  }
}

if (readinessCriteria.length !== 7) {
  errors.push(`§13.2 définit 7 critères « Endgame Ready » pour Unbound, ${readinessCriteria.length} trouvés`)
}

/* --- 7. Ressources : ids uniques, et namespaces sans collision --------- */

/*
 * Tout id persisté est soumis au même contrat de durabilité que les ids de
 * tâche. Avec sept catégories, la collision n'est plus une hypothèse : la
 * mission `#050` s'appelle *Portal Purge*, et `portails` est aussi une section
 * de complétion. Le contrôle porte donc sur la clé **préfixée**.
 */
const resourceSets = [
  { name: 'npcs.ts', prefix: 'npc', entries: npcs, persisted: true },
  { name: 'missions.ts', prefix: 'mission', entries: missions, persisted: true },
  { name: 'tutors.ts', prefix: 'tutor', entries: tutors, persisted: true },
  { name: 'keyitems.ts', prefix: 'item', entries: keyItems, persisted: true },
  /*
   * Chaque set porte son propre préfixe (`cell:` ou `raid:`) : ils sont dans le
   * même fichier mais forment deux namespaces distincts.
   */
  ...collectibleSets.map(set => ({
    name: `collectibles.ts (${set.id})`,
    prefix: set.prefix,
    entries: set.entries,
    persisted: true,
  })),
  { name: 'items.ts (battleItems)', prefix: null, entries: battleItems, persisted: false },
  { name: 'items.ts (consumables)', prefix: null, entries: consumables, persisted: false },
  { name: 'farming.ts', prefix: null, entries: farmingTopics, persisted: false },
  /*
   * Les objectifs sont aplatis toutes sections confondues : `goal:<id>` ne porte
   * pas la section, donc deux homonymes dans deux sections ne feraient qu'une
   * seule case cochée. L'unicité doit être globale, pas locale.
   */
  {
    name: 'completion.ts',
    prefix: 'goal',
    entries: completionSections.flatMap(section => section.goals),
    persisted: true,
  },
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

/* --- 7 bis. Complétion : sections nommées, objectifs sourcés ----------- */

/*
 * `source` est requis par le type, mais TypeScript ne voit pas la chaîne vide.
 * Or c'est tout l'intérêt du champ : hors du guide, rien ne s'écrit dans ce
 * fichier qui n'ait été lu sur unboundwiki.com ou romhackdex.net. Un objectif
 * sans source est un objectif qu'on ne peut plus vérifier — c'est ce qui a
 * coûté trois entrées à §12.
 */
const seenSections = new Set()
for (const section of completionSections) {
  if (seenSections.has(section.id)) {
    errors.push(`completion.ts : section dupliquée « ${section.id} »`)
  }
  seenSections.add(section.id)

  if (!section.goals.length) {
    warnings.push(`completion.ts : la section « ${section.id} » est vide`)
  }

  for (const goal of section.goals) {
    if (typeof goal.label !== 'string' || !goal.label.trim()) {
      errors.push(`completion.ts : « ${goal.id} » n'a pas de libellé`)
    }
    if (typeof goal.source !== 'string' || !goal.source.trim()) {
      errors.push(`completion.ts : « ${goal.id} » n'a pas de source — guide (« §x.y ») ou URL consultée`)
    }
    else if (!goal.source.startsWith('§') && !goal.source.startsWith('https://')) {
      warnings.push(`completion.ts : la source de « ${goal.id} » n'est ni une section du guide ni une URL`)
    }
  }
}

/*
 * Le vrai piège n'est pas dans les fichiers de contenu : c'est d'ajouter une
 * catégorie persistée sans qu'elle arrive jusqu'à `knownContent`. La purge
 * prendrait alors chaque case cochée pour une orpheline et les effacerait
 * toutes, en une fois. Le test de purge travaille sur un ensemble synthétique et
 * ne peut pas le voir.
 *
 * Le contrôle portait avant sur la *source* de `useSave.ts` — il y cherchait les
 * noms des tableaux de clés. Depuis que `knownContent` est construit par
 * `defineGame()` à partir du `GameContent`, on vérifie la chose elle-même :
 * chaque clé que le contenu d'un jeu sait produire doit être reconnue par le
 * `knownContent` de ce jeu. C'est plus fort qu'un grep — ça reste vrai quelle
 * que soit la façon dont le registre est écrit.
 */
for (const game of games) {
  const known = game.knownContent

  for (const key of game.content.resourceKeys) {
    if (!known.resourceKeys.has(key)) {
      errors.push(
        `${game.id} : la clé « ${key} » n'est pas dans knownContent — `
        + 'la purge effacerait cette case si elle était cochée',
      )
      break
    }
  }

  for (const entry of game.completionEntries) {
    if (!known.resourceKeys.has(entry.key)) {
      errors.push(
        `${game.id} : l'entrée de complétion « ${entry.key} » n'est pas dans knownContent — `
        + 'la purge effacerait cette case si elle était cochée',
      )
      break
    }
  }

  for (const counter of game.content.counters) {
    if (!known.counterIds.has(counter.id)) {
      errors.push(`${game.id} : le compteur « ${counter.id} » n'est pas dans knownContent`)
      break
    }
  }

  /*
   * Les cases « Ready » n'existent nulle part dans le contenu : leur id est
   * fabriqué à la volée par `useProgress`. Les oublier dans `knownContent` les
   * ferait toutes passer pour orphelines.
   */
  for (const mon of game.content.pokemon) {
    const missing = game.content.readinessCriteria
      .map(criterion => `ready-${mon.slug}-${criterion.key}`)
      .find(id => !known.taskIds.has(id))
    if (missing) {
      errors.push(`${game.id} : la case de readiness « ${missing} » n'est pas dans knownContent`)
      break
    }
  }

  /*
   * Une espèce du Pokédex de référence peut être capturée en jeu sans fiche
   * manuscrite (`state.catches`, voir `useRoster`) — `knownContent.slugs` doit
   * donc la connaître, sinon « Nettoyer » prendrait la capture pour une
   * orpheline dès le premier passage.
   */
  for (const entry of game.content.reference?.pokedex ?? []) {
    if (!known.slugs.has(entry.id)) {
      errors.push(`${game.id} : l'espèce de Pokédex « ${entry.id} » n'est pas dans knownContent.slugs`)
      break
    }
  }
}

/* --- 7 ter. Contenu généré : sources et comptes ------------------------ */

/*
 * Mêmes exigences que pour les objectifs de complétion, sur les fichiers générés
 * par `pnpm scrape:wiki` : un libellé, et une source vérifiable. Ici la source
 * est forcément une URL — ces entrées ne viennent pas du guide.
 */
const wikiSets = [
  { name: 'missions.ts', entries: missions },
  { name: 'tutors.ts', entries: tutors },
  { name: 'keyitems.ts', entries: keyItems },
  ...collectibleSets.map(set => ({ name: `collectibles.ts (${set.id})`, entries: set.entries })),
]

for (const { name, entries } of wikiSets) {
  for (const entry of entries) {
    if (typeof entry.label !== 'string' || !entry.label.trim()) {
      errors.push(`${name} : « ${entry.id} » n'a pas de libellé`)
    }
    if (typeof entry.source !== 'string' || !entry.source.startsWith('https://')) {
      errors.push(`${name} : « ${entry.id} » n'a pas d'URL de source`)
    }
  }
}

/*
 * Les comptes sont le dernier filet : `expectCount` protège la génération, mais
 * un fichier tronqué à la main ou un mauvais merge passerait sans lui. Ces trois
 * nombres sont affirmés par le wiki lui-même — 84 missions, 100 Zygarde Cells,
 * 32 raid dens — et ne bougent pas sans que le jeu change.
 */
const expectedCounts = [
  ['missions.ts', missions.length, 84],
  ['tutors.ts', tutors.length, 29],
  ['keyitems.ts', keyItems.length, 34],
  ...collectibleSets.map(set => [
    `collectibles.ts (${set.id})`,
    set.entries.length,
    set.prefix === 'cell' ? 100 : 32,
  ]),
]

for (const [name, actual, expected] of expectedCounts) {
  if (actual !== expected) {
    errors.push(`${name} : ${actual} entrées, ${expected} attendues — régénérer avec pnpm scrape:wiki`)
  }
}

/*
 * Une mission dont l'objectif est vide est une case sans énoncé : cochable, mais
 * illisible. C'est le symptôme exact d'un parseur cassé.
 */
for (const mission of missions) {
  if (!mission.objective?.trim()) errors.push(`missions.ts : « #${mission.code} » n'a pas d'objectif`)
  if (!/^\d{3}$/.test(mission.code)) errors.push(`missions.ts : code invalide « ${mission.code} »`)
}

for (const tutor of tutors) {
  if (!tutor.moves?.length) errors.push(`tutors.ts : « ${tutor.id} » n'enseigne aucune capacité`)
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
 * Parcours récursif : depuis que les fiches vivent dans `app/data/unbound/pokemon/`, un
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

/* --- 10. Les noms d'icônes existent vraiment --------------------------- */

/*
 * Un nom d'icône inexistant ne casse rien : @nuxt/icon rend un <svg> vide, sans
 * la moindre erreur, et la commande devient un bouton invisible. C'est ainsi que
 * `i-lucide-broom` — qui n'a jamais existé dans lucide — a laissé l'entrée
 * « Nettoyer la sauvegarde » sans icône pendant des mois.
 *
 * On vérifie donc chaque nom contre le jeu réellement installé, dans tout ce que
 * l'app contient : templates compris, puisque `scan` embarque sans vérifier.
 */
const lucide = JSON.parse(
  await readFile(new URL('../node_modules/@iconify-json/lucide/icons.json', import.meta.url), 'utf8'),
)
const known = new Set([...Object.keys(lucide.icons), ...Object.keys(lucide.aliases ?? {})])

async function* sourceFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}${entry.name}`
    if (entry.isDirectory()) yield * sourceFiles(`${path}/`)
    else if (/\.(?:ts|vue)$/.test(entry.name)) yield path
  }
}

const seen = new Map()
for await (const path of sourceFiles(`${root}app/`)) {
  const source = await readFile(path, 'utf8')
  for (const [, name] of source.matchAll(/i-lucide-([a-z0-9-]+)/g)) {
    if (!seen.has(name)) seen.set(name, path.replace(root, ''))
  }
}
for (const [name, path] of seen) {
  if (!known.has(name)) {
    errors.push(`icône « i-lucide-${name} » (${path}) n'existe pas dans lucide — elle rendra un <svg> vide`)
  }
}

/* --- Rapport ----------------------------------------------------------- */

/* --- 11. Contrôles par jeu --------------------------------------------- */

/*
 * Les contrôles précédents portent sur le contenu Unbound, chargé fichier par
 * fichier. Ceux-ci valent pour **tout** jeu du registre : sans eux, un contenu
 * ajouté pour un second jeu ne serait vérifié par rien — un `requires` mort y
 * bloquerait une tâche pour toujours, exactement comme chez Unbound.
 */
for (const game of games) {
  const ids = new Map()
  for (const phase of game.content.phases) {
    for (const task of phase.tasks) {
      if (ids.has(task.id)) {
        errors.push(`${game.id} : id de tâche dupliqué « ${task.id} » (${ids.get(task.id)} et ${phase.id})`)
      }
      ids.set(task.id, phase.id)
    }
  }
  for (const mon of game.content.pokemon) {
    for (const task of mon.tasks ?? []) {
      if (ids.has(task.id)) {
        errors.push(`${game.id} : id de tâche dupliqué « ${task.id} » (${ids.get(task.id)} et fiche ${mon.slug})`)
      }
      ids.set(task.id, `fiche ${mon.slug}`)
    }
  }

  for (const [id, origin] of ids) {
    const task = game.taskEntriesById.get(id)?.task
    if (typeof task?.label !== 'string' || !task.label.trim()) {
      errors.push(`${game.id} : « ${id} » (${origin}) n'a pas de libellé`)
    }
    for (const dep of task?.requires ?? []) {
      if (!ids.has(dep)) errors.push(`${game.id} : « ${id} » requiert « ${dep} », qui n'existe pas`)
      if (dep === id) errors.push(`${game.id} : « ${id} » se requiert lui-même`)
    }
  }

  /*
   * Cycle de dépendances : une tâche prise dans un cycle n'est jamais
   * actionnable, et rien à l'écran ne le dit.
   */
  const seen = new Map()
  const walk = (id, trail) => {
    if (seen.get(id) === 2) return
    if (seen.get(id) === 1) {
      errors.push(`${game.id} : cycle de dépendances — ${[...trail, id].join(' → ')}`)
      return
    }
    seen.set(id, 1)
    for (const dep of game.taskEntriesById.get(id)?.task.requires ?? []) {
      if (ids.has(dep)) walk(dep, [...trail, id])
    }
    seen.set(id, 2)
  }
  for (const id of ids.keys()) walk(id, [])

  /* Même exigence de source que pour Unbound : rien ne s'invente. */
  const goalIds = new Set()
  for (const entry of game.completionEntries) {
    if (goalIds.has(entry.key)) errors.push(`${game.id} : clé de complétion dupliquée « ${entry.key} »`)
    goalIds.add(entry.key)

    if (typeof entry.label !== 'string' || !entry.label.trim()) {
      errors.push(`${game.id} : l'entrée « ${entry.key} » n'a pas de libellé`)
    }
    if (typeof entry.source !== 'string' || !entry.source.trim()) {
      errors.push(`${game.id} : « ${entry.key} » n'a pas de source — guide (« §x.y ») ou URL consultée`)
    }
    else if (!entry.source.startsWith('§') && !entry.source.startsWith('https://')) {
      warnings.push(`${game.id} : la source de « ${entry.key} » n'est ni une section du guide ni une URL`)
    }
  }

  /* Toute entrée de nav doit mener à une route que le jeu sert réellement. */
  for (const item of game.content.nav) {
    if (!item.to.startsWith(game.basePath)) {
      errors.push(`${game.id} : l'entrée de nav « ${item.label} » (${item.to}) n'est pas préfixée par ${game.basePath}`)
    }
    const relative = item.to.slice(game.basePath.length) || '/'
    if (relative === '/reference' && !game.content.reference) {
      errors.push(`${game.id} : la nav propose /reference, que ce jeu ne fournit pas`)
    }
    if (relative === '/ressources' && !game.content.resources) {
      errors.push(`${game.id} : la nav propose /ressources, que ce jeu ne fournit pas`)
    }
  }

  /*
   * La bottom-nav mobile est une grille de 5 colonnes : au-delà, les entrées
   * débordent au lieu de se réorganiser.
   */
  const primary = game.content.nav.filter(item => item.primary)
  if (primary.length > 5) {
    errors.push(`${game.id} : ${primary.length} entrées de nav principales, la bottom-nav mobile en tient 5`)
  }

  /*
   * Encounters et talents — deux jeux de données *générés* depuis le code d'un
   * jeu ouvert. Ils vivent dans `reference`, donc un jeu qui les fournit sans
   * fournir de référence les rendrait invisibles : la page répondrait 404.
   */
  const { encounters = [], abilities = [], pokedex = [], tms = [] } = game.content.reference ?? {}

  const zoneIds = new Set()
  for (const zone of encounters) {
    if (zoneIds.has(zone.id)) errors.push(`${game.id} : zone de rencontre dupliquée « ${zone.id} »`)
    zoneIds.add(zone.id)
    if (!zone.methods.length) {
      errors.push(`${game.id} : la zone « ${zone.id} » n'a aucune méthode de rencontre`)
    }
    for (const method of zone.methods) {
      if (!method.slots.length) {
        errors.push(`${game.id} : « ${zone.id} » a une méthode ${method.method} sans aucune espèce`)
      }
      for (const slot of method.slots) {
        if (slot.min > slot.max) {
          errors.push(`${game.id} : ${zone.id} · ${slot.species} a un niveau min (${slot.min}) supérieur au max (${slot.max})`)
        }
      }
    }
  }

  /*
   * L'index inversé est *dérivé* : c'est le contrôle qui attrape une dérivation
   * de travers, où une espèce se retrouverait rattachée à une zone inexistante.
   */
  for (const [species, spots] of game.encountersBySpecies) {
    for (const spot of spots) {
      if (!zoneIds.has(spot.zoneId)) {
        errors.push(`${game.id} : l'index place « ${species} » dans « ${spot.zoneId} », zone inconnue`)
      }
    }
  }
  if (encounters.length && !game.encountersBySpecies.size) {
    errors.push(`${game.id} : ${encounters.length} zones de rencontre mais un index d'espèces vide`)
  }

  const abilityNames = new Set()
  for (const ability of abilities) {
    if (abilityNames.has(ability.name)) {
      errors.push(`${game.id} : talent dupliqué « ${ability.name} »`)
    }
    abilityNames.add(ability.name)
    if (!ability.description?.trim()) {
      errors.push(`${game.id} : le talent « ${ability.name} » n'a pas de description`)
    }
  }

  /*
   * Pokédex d'espèces. Les deux contrôles qui comptent : l'unicité des slugs
   * (un doublon masquerait une espèce sans rien dire) et la **présence des
   * stats officielles**, qui sont la seule raison d'être de cette section — une
   * régénération qui les perdrait rendrait des colonnes d'écart toutes vides.
   */
  const dexSlugs = new Set()
  const dexNames = new Set()
  for (const entry of pokedex) {
    if (dexSlugs.has(entry.id)) errors.push(`${game.id} : espèce dupliquée « ${entry.id} »`)
    dexSlugs.add(entry.id)
    /*
     * Le nom est unique, le **numéro de dex ne l'est pas** : une forme régionale
     * partage celui de sa forme de base — Alolan Meowth est #197 comme Meowth.
     * Un contrôle d'unicité sur `hoennDex` était donc faux, et refusait les
     * 16 formes d'Alola.
     */
    if (dexNames.has(entry.name)) errors.push(`${game.id} : deux espèces nommées « ${entry.name} »`)
    dexNames.add(entry.name)
    if (!Number.isInteger(entry.hoennDex) || entry.hoennDex < 1) {
      errors.push(`${game.id} : « ${entry.name} » a un n° Hoenn invalide (${entry.hoennDex})`)
    }
    if (!entry.types.length) errors.push(`${game.id} : « ${entry.name} » n'a aucun type`)
    for (const type of entry.types) {
      if (!POKEMON_TYPES.includes(type)) {
        errors.push(`${game.id} : « ${entry.name} » porte le type inconnu « ${type} »`)
      }
    }
    if (!entry.abilities.length) errors.push(`${game.id} : « ${entry.name} » n'a aucun talent`)
    for (const key of STAT_KEYS) {
      const stat = entry.stats?.[key]
      if (typeof stat?.seaglass !== 'number' || typeof stat?.official !== 'number') {
        errors.push(`${game.id} : « ${entry.name} » n'a pas de stat ${key} complète (jeu + officiel)`)
      }
    }
  }

  /* TM : l'id est le seul repère, et un doublon y cacherait une entrée. */
  const tmIds = new Set()
  for (const tm of tms) {
    if (tmIds.has(tm.id)) errors.push(`${game.id} : TM dupliquée « ${tm.id} »`)
    tmIds.add(tm.id)
    if (!tm.move?.trim()) errors.push(`${game.id} : ${tm.id} n'a pas de capacité`)
    if (!tm.location?.trim()) errors.push(`${game.id} : ${tm.id} n'a pas de lieu`)
  }

  /*
   * Un chapeau de section sans sa section, ou l'inverse : les deux se voient à
   * l'écran (un blanc, ou une section muette) sans lever la moindre erreur.
   */
  const captions = game.content.reference?.descriptions ?? {}
  const provided = { encounters, abilities, pokedex, tms }
  const captionLabels = {
    encounters: 'les encounters',
    abilities: 'les talents',
    pokedex: 'le Pokédex',
    tms: 'les TM',
  }
  for (const [key, label] of Object.entries(captionLabels)) {
    if (captions[key] && !provided[key].length) {
      errors.push(`${game.id} : un chapeau décrit ${label}, que ce jeu ne fournit pas`)
    }
  }
}

/* --- Rapport ------------------------------------------------------------ */

for (const game of games) {
  const tasks = game.taskEntries.length
  const { encounters = [], abilities = [], pokedex = [], tms = [] } = game.content.reference ?? {}
  /*
   * Les jeux générés sont affichés quand ils existent : c'est là qu'une
   * régénération amputée se verrait — 12 zones au lieu de 142 ne lève rien.
   */
  const generated = [
    encounters.length ? `${encounters.length} zones (${game.encountersBySpecies.size} espèces)` : '',
    pokedex.length ? `${pokedex.length} espèces au dex` : '',
    abilities.length ? `${abilities.length} talents` : '',
    tms.length ? `${tms.length} TM/HM` : '',
  ].filter(Boolean)
  const generatedLabel = generated.length ? ` · ${generated.join(' · ')}` : ''
  console.log(
    `${game.label} : ${game.content.phases.length} phases · ${tasks} tâches · `
    + `${game.content.pokemon.length} fiches · ${game.completionEntries.length} entrées de complétion${generatedLabel}`,
  )
}

const activeCount = pokemon.filter(mon => mon.status === 'active').length
console.log(
  `Contenu : ${phases.length} phases · ${allTasks.size} tâches · ${pokemon.length} fiches (${activeCount} actives)`,
)
console.log(
  `Ressources : ${npcs.length} PNJ · ${missions.length} missions · ${tutors.length} tutors · `
  + `${battleItems.length + consumables.length} objets · ${farmingTopics.length} rubriques de farm`,
)
const collectibleTotal = collectibleSets.reduce((total, set) => total + set.entries.length, 0)
console.log(
  `Complétion : ${completionSections.reduce((total, section) => total + section.goals.length, 0)} objectifs · `
  + `${missions.length} missions · ${keyItems.length} key items · ${tutors.length} tutors · `
  + `${collectibleTotal} collectibles`,
)

for (const warning of warnings) console.warn(`  avertissement — ${warning}`)

if (errors.length) {
  console.error(`\n${errors.length} erreur(s) d'intégrité :`)
  for (const error of errors) console.error(`  ✖ ${error}`)
  process.exit(1)
}

console.log(warnings.length ? `${warnings.length} avertissement(s), aucune erreur.` : 'Intégrité vérifiée.')
