/**
 * Tests des migrations de sauvegarde.
 *
 * Une migration est le seul endroit du code qui *réécrit* la progression déjà
 * acquise. Quand elle se trompe, rien ne le signale : l'utilisateur ouvre l'app
 * et trouve des cases décochées, sans erreur ni trace. C'est la même raison qui
 * a fait sortir `sync.ts` du composable et lui a donné son test.
 *
 * Toute nouvelle migration s'accompagne d'un cas ici — y compris ses cas
 * dégénérés, qui sont ceux qui font perdre des données en vrai : clé inconnue,
 * `resources` absent, valeur `false`, double migration.
 *
 * Usage : pnpm test:migration
 */
import { loadApp, loadData, loadUnbound } from './lib/data.mjs'

const { migrateV1ToV2, migrations } = await loadApp('utils/migrations.ts')
const { missions } = await loadUnbound('missions.ts')
const { SAVE_VERSION } = await loadData('types.ts')

const failures = []
let assertions = 0

function check(label, actual, expected) {
  assertions += 1
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) failures.push(`${label} — attendu ${b}, obtenu ${a}`)
}

const v1 = resources => ({ version: 1, resources, tasks: {}, journal: [] })

/* --- Le report nominal --------------------------------------------------- */

check(
  'la version avance',
  migrateV1ToV2(v1({})).version,
  2,
)

check(
  'une quête cochée devient sa mission',
  migrateV1ToV2(v1({ 'quest:portal-purge': true })).resources,
  { 'mission:050': true },
)

check(
  'les cinq quêtes simples se reportent',
  migrateV1ToV2(v1({
    'quest:seasonal-research': true,
    'quest:portal-purge': true,
    'quest:all-the-right-moves': true,
    'quest:as-hard-as-they-come': true,
    'quest:exp-millionaire': true,
  })).resources,
  {
    'mission:053': true,
    'mission:050': true,
    'mission:006': true,
    'mission:010': true,
    'mission:020': true,
  },
)

/*
 * Le lot Power items est le seul cas où une clé en produit plusieurs. S'il se
 * dépliait mal, l'utilisateur perdrait quatre cases sur cinq — et comme les cinq
 * missions sont éparpillées dans une liste de 84, il ne s'en apercevrait pas.
 */
check(
  'le lot « objets-pouvoir » se déplie en cinq missions',
  migrateV1ToV2(v1({ 'quest:objets-pouvoir': true })).resources,
  {
    'mission:003': true,
    'mission:005': true,
    'mission:033': true,
    'mission:052': true,
    'mission:071': true,
  },
)

/* --- Ce qui ne doit pas bouger ------------------------------------------- */

check(
  'les autres catégories passent intactes',
  migrateV1ToV2(v1({ 'npc:move-relearner': true, 'goal:coin-case': true })).resources,
  { 'npc:move-relearner': true, 'goal:coin-case': true },
)

/*
 * Une quête décochée n'a rien à reporter : le défaut est décoché, donc écrire
 * cinq `false` n'ajouterait que du bruit que la purge devrait ensuite trier.
 */
check(
  'une quête décochée ne laisse rien',
  migrateV1ToV2(v1({ 'quest:portal-purge': false })).resources,
  {},
)

/*
 * Une clé `quest:` inconnue — d'un contenu supprimé depuis — est conservée
 * plutôt que jetée en silence : la purge la proposera, et c'est à l'utilisateur
 * de trancher.
 */
check(
  'une quête inconnue est conservée',
  migrateV1ToV2(v1({ 'quest:tomb-raider': true })).resources,
  { 'quest:tomb-raider': true },
)

check(
  'une sauvegarde sans `resources` ne casse pas',
  migrateV1ToV2({ version: 1, tasks: {} }),
  { version: 2, tasks: {} },
)

check(
  'le reste de la sauvegarde est préservé',
  migrateV1ToV2({ version: 1, tasks: { 'phase-5.4': true }, journal: [{ id: 'a' }] }).tasks,
  { 'phase-5.4': true },
)

/* --- Cohérence avec le contenu ------------------------------------------- */

/*
 * Le point aveugle du test : les codes de mission sont écrits en dur dans la
 * migration, et rien n'empêche d'en taper un qui n'existe pas — la case serait
 * alors reportée vers le vide, puis effacée par la purge comme orpheline.
 */
const codes = new Set(missions.map(mission => mission.id))
const targets = new Set()
for (const quest of [
  'seasonal-research', 'portal-purge', 'all-the-right-moves',
  'as-hard-as-they-come', 'exp-millionaire', 'objets-pouvoir',
]) {
  for (const key of Object.keys(migrateV1ToV2(v1({ [`quest:${quest}`]: true })).resources)) {
    targets.add(key.slice('mission:'.length))
  }
}

check(
  'toutes les missions visées existent',
  [...targets].filter(code => !codes.has(code)),
  [],
)

check('les 10 missions visées sont distinctes', targets.size, 10)

/* --- Le chaînage --------------------------------------------------------- */

check('une migration existe pour chaque version antérieure', Object.keys(migrations).map(Number), [1])

check(
  'la dernière migration atteint SAVE_VERSION',
  migrateV1ToV2(v1({})).version,
  SAVE_VERSION,
)

/* --- Verdict ------------------------------------------------------------- */

if (failures.length) {
  console.error(`\n✖ ${failures.length} échec(s) sur ${assertions} assertions\n`)
  for (const failure of failures) console.error(`  · ${failure}`)
  console.error('')
  process.exit(1)
}

console.log(`✓ migrations : ${assertions} assertions`)
