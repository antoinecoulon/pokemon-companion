/**
 * Tests des corrections locales de fiche (surcouche d'édition en app).
 *
 * L'invariant qui compte : le contenu canonique n'est jamais muté, seul
 * l'écart est lu/écrit. Un nettoyage défensif trop permissif laisserait un
 * JSON importé injecter une fiche incohérente (mauvais nombre de capacités,
 * EV hors plafond) dans l'app ; trop strict, il perdrait une correction
 * valide en silence — les deux sont testés ici.
 *
 * Usage : pnpm test:pokemon-overrides
 */
import { loadApp, loadPokemon } from './lib/data.mjs'

const {
  applyPokemonOverride, isFieldOverridden, sanitizePokemonOverride, validatePokemonOverride,
  blocksToText, textToBlocks, hasStructuredBlocks,
} = await loadApp('utils/pokemon-overrides.ts')
const { pokemon } = await loadPokemon()

const failures = []
let assertions = 0

function check(label, actual, expected) {
  assertions += 1
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) failures.push(`${label} — attendu ${b}, obtenu ${a}`)
}

const tyranitar = pokemon.find(mon => mon.slug === 'tyranitar')

/* --- applyPokemonOverride ------------------------------------------------ */

check('sans override, la fiche est inchangée', applyPokemonOverride(tyranitar, undefined), tyranitar)

const withRole = applyPokemonOverride(tyranitar, { role: 'Rôle corrigé' })
check('un champ overridé remplace celui de la fiche', withRole.role, 'Rôle corrigé')
check('les autres champs restent ceux de la fiche', withRole.name, tyranitar.name)

/*
 * `PokemonSheetOverride` exclut slug/status/slot/sprite/tasks par le système
 * de types — mais un JSON malformé pourrait quand même les porter à
 * l'exécution (le typage TS ne protège rien une fois compilé). Un override
 * qui les contiendrait ne doit rien y changer : ces champs appartiennent à
 * `RosterOverride`, au pipeline d'assets, ou à l'identité de la fiche.
 */
const malformed = { slug: 'usurpé', status: 'retired', slot: 1, sprite: 'x', tasks: [], role: 'Rôle corrigé' }
const guarded = applyPokemonOverride(tyranitar, malformed)
check('slug non touché même si présent dans l’override', guarded.slug, tyranitar.slug)
check('status non touché même si présent dans l’override', guarded.status, tyranitar.status)
check('slot non touché même si présent dans l’override', guarded.slot, tyranitar.slot)
check('sprite non touché même si présent dans l’override', guarded.sprite, tyranitar.sprite)
check('tasks non touché même si présent dans l’override', guarded.tasks, tyranitar.tasks)
check('role bien pris en compte à côté', guarded.role, 'Rôle corrigé')

/* --- isFieldOverridden ---------------------------------------------------- */

check('champ overridé reconnu', isFieldOverridden({ role: 'x' }, 'role'), true)
check('champ non overridé reconnu', isFieldOverridden({ role: 'x' }, 'obtention'), false)
check('aucun override', isFieldOverridden(undefined, 'role'), false)

/* --- sanitizePokemonOverride ---------------------------------------------- */

check('override vide', sanitizePokemonOverride({}), {})
check('valeur non-objet', sanitizePokemonOverride('nawak'), {})

check(
  'champs scalaires valides conservés',
  sanitizePokemonOverride({ role: 'Tank', obtention: 'Route 3', badge: 'Conservé', incomplete: true, incompleteNote: 'x' }),
  { role: 'Tank', obtention: 'Route 3', badge: 'Conservé', incomplete: true, incompleteNote: 'x' },
)

check('type mal orthographié rejeté', sanitizePokemonOverride({ types: ['Electrik'] }).types, undefined)
check('plus de deux types rejeté', sanitizePokemonOverride({ types: ['Fire', 'Water', 'Flying'] }).types, undefined)
check('deux types valides conservés', sanitizePokemonOverride({ types: ['Rock', 'Dark'] }).types, ['Rock', 'Dark'])

check(
  'stats de base incomplètes rejetées',
  sanitizePokemonOverride({ baseStats: { hp: 100 } }).baseStats,
  undefined,
)
const fullStats = { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 }
check('stats de base complètes conservées', sanitizePokemonOverride({ baseStats: fullStats }).baseStats, fullStats)

check(
  'capacité sans nom écartée du tableau',
  sanitizePokemonOverride({ abilities: [{ name: 'Sand Stream' }, { hidden: true }] }).abilities,
  [{ name: 'Sand Stream' }],
)
check('tableau de capacités entièrement invalide → champ absent', sanitizePokemonOverride({ abilities: [{}] }).abilities, undefined)

const goodBuild = {
  id: 'b1', name: 'Physique', nature: 'Adamant', item: 'Choice Band',
  moves: ['Stone Edge', 'Earthquake', 'Crunch', 'Ice Punch'], evs: { atk: 252, spe: 252, hp: 4 },
}
const badMoves = { ...goodBuild, id: 'b2', moves: ['Stone Edge'] }
const badNature = { ...goodBuild, id: 'b3', nature: 'Rigide' } // nom français, plus accepté
const badEvs = { ...goodBuild, id: 'b4', evs: { atk: 252, spe: 252, hp: 20 } } // 524 > 510

check(
  'seul le build cohérent survit, les autres sont écartés',
  sanitizePokemonOverride({ builds: [goodBuild, badMoves, badNature, badEvs] }).builds,
  [goodBuild],
)
check('un tableau de builds sans aucun valide reste un tableau vide', sanitizePokemonOverride({ builds: [badMoves] }).builds, [])

check(
  'ivGuidance valide conservé',
  sanitizePokemonOverride({ ivGuidance: { focus: ['atk'], ignore: ['spa'], note: 'x' } }).ivGuidance,
  { focus: ['atk'], ignore: ['spa'], note: 'x' },
)
check(
  'ivGuidance avec une clé de stat invalide rejeté',
  sanitizePokemonOverride({ ivGuidance: { focus: ['puissance'], ignore: [] } }).ivGuidance,
  undefined,
)

check(
  'bloc de prose reconnu conservé',
  sanitizePokemonOverride({ analysis: [{ kind: 'p', text: 'Un texte.' }] }).analysis,
  [{ kind: 'p', text: 'Un texte.' }],
)
check('bloc de forme inconnue écarté du tableau', sanitizePokemonOverride({ analysis: [{ kind: 'inconnu' }] }).analysis, [])

/* --- validatePokemonOverride ---------------------------------------------- */

check('patch vide : aucune erreur', validatePokemonOverride({}), [])
check('deux types valides : aucune erreur', validatePokemonOverride({ types: ['Rock', 'Dark'] }), [])
check('trois types : erreur', validatePokemonOverride({ types: ['Rock', 'Dark', 'Ground'] }).length > 0, true)
check('type inconnu : erreur', validatePokemonOverride({ types: ['Electrik'] }).length > 0, true)

check(
  'talent visé absent de la liste des talents : erreur',
  validatePokemonOverride({ abilities: [{ name: 'Sand Stream' }], targetAbility: 'Levitate' }).length > 0,
  true,
)
check(
  'talent visé présent dans la liste : aucune erreur',
  validatePokemonOverride({ abilities: [{ name: 'Sand Stream' }], targetAbility: 'Sand Stream' }),
  [],
)

check('build à 4 capacités et EV dans le plafond : aucune erreur', validatePokemonOverride({ builds: [goodBuild] }), [])
check('build à moins de 4 capacités : erreur', validatePokemonOverride({ builds: [badMoves] }).length > 0, true)
check('nature inconnue (nom français) : erreur', validatePokemonOverride({ builds: [badNature] }).length > 0, true)
check('EV au-delà du plafond : erreur', validatePokemonOverride({ builds: [badEvs] }).length > 0, true)

check(
  'focus et ignore qui se recoupent : erreur',
  validatePokemonOverride({ ivGuidance: { focus: ['atk'], ignore: ['atk'] } }).length > 0,
  true,
)
check(
  'focus et ignore disjoints : aucune erreur',
  validatePokemonOverride({ ivGuidance: { focus: ['atk'], ignore: ['spa'] } }),
  [],
)

/* --- blocksToText / textToBlocks / hasStructuredBlocks -------------------- */

check('pas de blocs → texte vide', blocksToText(undefined), '')
check(
  'deux paragraphes séparés par une ligne vide',
  blocksToText([{ kind: 'p', text: 'Un.' }, { kind: 'p', text: 'Deux.' }]),
  'Un.\n\nDeux.',
)
check(
  'un bloc liste est aplati en texte',
  blocksToText([{ kind: 'list', items: ['a', 'b'] }]),
  'a\nb',
)
check(
  'aller-retour texte → blocs pour un seul paragraphe',
  textToBlocks('Un seul paragraphe.'),
  [{ kind: 'p', text: 'Un seul paragraphe.' }],
)
check(
  'texte vide → aucun bloc',
  textToBlocks('   '),
  [],
)
check('fiche sans bloc structuré', hasStructuredBlocks([{ kind: 'p', text: 'x' }]), false)
check('fiche avec un tableau', hasStructuredBlocks([{ kind: 'table', head: [], rows: [] }]), true)
check('pas de blocs du tout', hasStructuredBlocks(undefined), false)

/* --- Purge des clés mortes (voir aussi test-roster.mjs) ------------------- */

const { findOrphans, pruneSave } = await loadApp('utils/prune.ts')

const known = {
  taskIds: new Set(),
  slugs: new Set(['tyranitar']),
  resourceKeys: new Set(),
  counterIds: new Set(),
}

const save = {
  version: 1,
  tasks: {},
  pokemon: {},
  counters: {},
  resources: {},
  roster: {},
  catches: {},
  pokemonOverrides: { tyranitar: { role: 'Corrigé' }, disparu: { role: 'Fantôme' } },
  journal: [],
  updatedAt: '2026-08-05T00:00:00.000Z',
}

const report = findOrphans(save, known)
check('correction sur un slug connu : pas orpheline', report.pokemonOverrides.includes('tyranitar'), false)
check('correction sur un slug inconnu : orpheline', report.pokemonOverrides, ['disparu'])

const pruned = pruneSave(save, known)
check('la purge garde la correction valide et retire l’orpheline', pruned.pokemonOverrides, { tyranitar: { role: 'Corrigé' } })

/* --- Rapport --------------------------------------------------------------- */

if (failures.length) {
  console.error(`\n${failures.length} test(s) en échec :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log(`Corrections locales de fiche : ${assertions} assertions, tout passe.`)
