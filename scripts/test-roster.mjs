/**
 * Tests de la composition d'équipe et de la purge de sauvegarde.
 *
 * Les invariants tenus ici sont invisibles à l'écran quand ils cassent : un slot
 * en doublon ou un trou dans la numérotation réordonne silencieusement les six
 * cartes de /equipe, une carte d'overrides non minimale ferait croire que la
 * composition s'écarte du guide alors qu'elle lui est identique, et une purge
 * trop large effacerait des cases cochées sans que rien ne le signale.
 *
 * Usage : pnpm test:roster
 */
import { loadApp, loadPokemon } from './lib/data.mjs'

const { activeEntries, resolveRoster, synthesizeSheet, withDemoted, withMoved, withPromoted, withSwapped }
  = await loadApp('utils/roster.ts')
const { pokemon } = await loadPokemon()

const failures = []
let assertions = 0

function check(label, actual, expected) {
  assertions += 1
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) failures.push(`${label} — attendu ${b}, obtenu ${a}`)
}

/** Les slugs actifs, dans l'ordre des slots. */
const order = overrides =>
  activeEntries(resolveRoster(pokemon, overrides)).map(entry => entry.sheet.slug)

/** Les slots effectifs, pour vérifier qu'ils forment bien 1..n. */
const slots = overrides =>
  activeEntries(resolveRoster(pokemon, overrides)).map(entry => entry.slot)

const guide = ['tyranitar', 'excadrill', 'togekiss', 'motisma-lavage', 'flagadoss', 'scorvol']

/* --- Point de départ : la composition du guide -------------------------- */

check('composition du guide', order({}), guide)
check('slots du guide', slots({}), [1, 2, 3, 4, 5, 6])

/* --- Promotion ---------------------------------------------------------- */

const full = withPromoted(pokemon, {}, 'sceptile')
check('promouvoir sur une équipe pleine échoue', !!full.error, true)
check('la composition reste intacte après un refus', order(full.overrides), guide)

const alreadyIn = withPromoted(pokemon, {}, 'tyranitar')
check('promouvoir un membre déjà présent échoue', !!alreadyIn.error, true)

/* --- Sortie : le trou doit se refermer ---------------------------------- */

const demoted = withDemoted(pokemon, {}, 'togekiss', 'retired')
check('sortir Togekiss', order(demoted.overrides), [
  'tyranitar', 'excadrill', 'motisma-lavage', 'flagadoss', 'scorvol',
])
check('les slots se renumérotent sans trou', slots(demoted.overrides), [1, 2, 3, 4, 5])
check(
  'Togekiss n’a plus de slot une fois sorti',
  resolveRoster(pokemon, demoted.overrides).find(entry => entry.sheet.slug === 'togekiss').slot,
  undefined,
)

/* Une place libérée permet une promotion, qui atterrit en fin de liste. */
const refilled = withPromoted(pokemon, demoted.overrides, 'sceptile')
check('promotion après une sortie', !!refilled.error, false)
check('l’entrant prend le dernier slot', order(refilled.overrides).at(-1), 'sceptile')
check('toujours six membres', slots(refilled.overrides), [1, 2, 3, 4, 5, 6])

/* --- Échange : l'entrant reprend le slot du sortant --------------------- */

const swapped = withSwapped(pokemon, {}, 'dusknoir', 'togekiss')
check('échange Dusknoir ↔ Togekiss', order(swapped.overrides), [
  'tyranitar', 'excadrill', 'dusknoir', 'motisma-lavage', 'flagadoss', 'scorvol',
])
check('l’échange conserve les six slots', slots(swapped.overrides), [1, 2, 3, 4, 5, 6])
check(
  'le sortant passe en retired',
  resolveRoster(pokemon, swapped.overrides).find(entry => entry.sheet.slug === 'togekiss').status,
  'retired',
)
check(
  'échanger avec un non-membre échoue',
  !!withSwapped(pokemon, {}, 'dusknoir', 'sceptile').error,
  true,
)

/* --- Déplacement -------------------------------------------------------- */

const moved = withMoved(pokemon, {}, 'scorvol', -1)
check('monter Scorvol d’un slot', order(moved.overrides), [
  'tyranitar', 'excadrill', 'togekiss', 'motisma-lavage', 'scorvol', 'flagadoss',
])
check('monter en tête de liste ne fait rien', order(withMoved(pokemon, {}, 'tyranitar', -1).overrides), guide)
check('descendre en fin de liste ne fait rien', order(withMoved(pokemon, {}, 'scorvol', 1).overrides), guide)
check('déplacer un non-membre échoue', !!withMoved(pokemon, {}, 'sceptile', -1).error, true)

/* --- Minimalité de la carte d'overrides -------------------------------- */

/*
 * `roster === {}` est ce qui fait dire à l'app « composition du guide ». Une
 * opération qui rend l'équipe d'origine doit donc effacer les overrides, pas
 * réécrire des valeurs identiques à celles des fiches.
 */
check('une composition identique au guide n’écrit rien', withMoved(pokemon, {}, 'tyranitar', -1).overrides, {})
check(
  'monter puis redescendre revient à zéro override',
  withMoved(pokemon, withMoved(pokemon, {}, 'scorvol', -1).overrides, 'scorvol', 1).overrides,
  {},
)
check(
  'sortir puis refaire entrer revient à zéro override',
  withPromoted(pokemon, withDemoted(pokemon, {}, 'scorvol', 'retired').overrides, 'scorvol').overrides,
  {},
)
check(
  'seuls les slugs déplacés sont écrits',
  Object.keys(withDemoted(pokemon, {}, 'flagadoss', 'retired').overrides).sort(),
  ['flagadoss', 'scorvol'],
)

/* --- Fiche synthétisée depuis une capture -------------------------------- */

const dexEntry = {
  id: 'zigzagoon',
  name: 'Zigzagoon',
  hoennDex: 263,
  nationalDex: 263,
  types: ['Normal'],
  locations: ['Route 101 (wild)'],
  stats: { hp: { seaglass: 38, official: 38 }, atk: { seaglass: 30, official: 30 }, def: { seaglass: 41, official: 41 }, spa: { seaglass: 30, official: 30 }, spd: { seaglass: 41, official: 41 }, spe: { seaglass: 60, official: 60 } },
  abilities: [{ name: 'Pickup', description: '' }],
  eggGroups: ['Field'],
}

const synthesized = synthesizeSheet(dexEntry)
check('fiche synthétisée : slug = id du dex', synthesized.slug, 'zigzagoon')
check('fiche synthétisée : statut par défaut utilitaire', synthesized.status, 'utility')
check('fiche synthétisée : types repris du dex', synthesized.types, ['Normal'])
check('fiche synthétisée : sans sprite', synthesized.sprite, undefined)
check('fiche synthétisée : sans builds', synthesized.builds, undefined)

/* --- Purge des clés mortes --------------------------------------------- */

/*
 * `normalize()` garde tout ce qu'il reconnaît par sa forme : une clé dont le
 * contenu a disparu survit à chaque chargement et voyage dans chaque export.
 * Ce que la purge doit surtout NE PAS toucher, c'est une clé valide — d'où les
 * assertions négatives.
 */
const { findOrphans, pruneSave, isEmptyProgress } = await loadApp('utils/prune.ts')

const known = {
  taskIds: new Set(['phase-1.1', 'mon-tyranitar-1', 'ready-tyranitar-ivs']),
  slugs: new Set(['tyranitar', 'togekiss']),
  resourceKeys: new Set(['npc:nurse', 'quest:objets-pouvoir', 'goal:sceptilite']),
  counterIds: new Set(['money', 'bp']),
}

const filled = { ivs: { atk: 31 }, evs: {}, moves: ['', '', '', ''] }
const blank = { ivs: {}, evs: {}, moves: ['', '', '', ''] }

const save = {
  version: 1,
  tasks: { 'phase-1.1': true, 'mon-tyranitar-1': true, 'ready-tyranitar-ivs': true, 'mon-disparu-3': true },
  pokemon: { tyranitar: filled, togekiss: blank, disparu: filled },
  counters: { money: 1000, ancien: 5 },
  resources: { 'npc:nurse': true, 'quest:objets-pouvoir': true, 'goal:sceptilite': true, 'npc:aboli': true },
  roster: { tyranitar: { slot: 2 }, disparu: { status: 'active' } },
  catches: { togekiss: true, disparu: true },
  journal: [],
  updatedAt: '2026-07-30T00:00:00.000Z',
}

const report = findOrphans(save, known)

check('tâche orpheline détectée', report.tasks, ['mon-disparu-3'])
check('fiche orpheline détectée', report.pokemon, ['disparu'])
check('ressource orpheline détectée', report.resources, ['npc:aboli'])
check('compteur orphelin détecté', report.counters, ['ancien'])
check('composition orpheline détectée', report.roster, ['disparu'])
check('capture orpheline détectée', report.catches, ['disparu'])
check('fiche vide repérée à part', report.empty, ['togekiss'])
check('total = clés mortes seulement, sans les fiches vides', report.total, 6)

/*
 * Le critère « Endgame Ready » est le piège : son id n'existe nulle part dans le
 * contenu, il est fabriqué à la volée par useProgress. Sans lui dans l'ensemble
 * connu, la purge effacerait toutes les cases cochées à la main.
 */
check('une case « Endgame Ready » n’est pas une orpheline', report.tasks.includes('ready-tyranitar-ivs'), false)

const pruned = pruneSave(save, known)

check('clés valides conservées', Object.keys(pruned.tasks).sort(), ['mon-tyranitar-1', 'phase-1.1', 'ready-tyranitar-ivs'])
check('fiche remplie conservée, vide et orpheline retirées', Object.keys(pruned.pokemon), ['tyranitar'])
check('compteur valide conservé', pruned.counters, { money: 1000 })
check('ressources valides conservées', Object.keys(pruned.resources).sort(), ['goal:sceptilite', 'npc:nurse', 'quest:objets-pouvoir'])
check('un objectif de complétion n’est pas une orpheline', report.resources.includes('goal:sceptilite'), false)
check('composition valide conservée', pruned.roster, { tyranitar: { slot: 2 } })
check('capture valide conservée, orpheline retirée', pruned.catches, { togekiss: true })
check('journal et version intacts', [pruned.version, pruned.journal.length], [1, 0])
check('purger deux fois ne change plus rien', findOrphans(pruned, known).total, 0)

check('progression vide reconnue', isEmptyProgress(blank), true)
check('un seul IV suffit à ne plus être vide', isEmptyProgress(filled), false)
check('une note seule suffit', isEmptyProgress({ ...blank, notes: 'x' }), false)
check('une capacité seule suffit', isEmptyProgress({ ...blank, moves: ['Séisme', '', '', ''] }), false)
check('des espaces ne comptent pas', isEmptyProgress({ ...blank, notes: '  ', moves: [' ', '', '', ''] }), true)

/* --- Rapport ----------------------------------------------------------- */

if (failures.length) {
  console.error(`\n${failures.length} test(s) en échec :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log(`Composition d’équipe et purge : ${assertions} assertions, tout passe.`)
