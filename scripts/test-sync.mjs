/**
 * Tests de la décision de synchronisation.
 *
 * Une erreur ici ne se voit pas : elle écrase une progression par une autre, en
 * silence, et l'utilisateur ne s'en aperçoit qu'en cherchant une case qu'il
 * avait cochée. Le cas qui compte le plus est l'appareil neuf — son `updatedAt`
 * est toujours plus récent que le distant, donc « le plus récent gagne » le
 * ferait gagner à tort.
 *
 * Usage : pnpm test:sync
 */
import { loadApp } from './lib/data.mjs'

const { decideSync, emptyMarker, isPristineSave, markerAfter } = await loadApp('utils/sync.ts')

const failures = []
let assertions = 0

function check(label, actual, expected) {
  assertions += 1
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) failures.push(`${label} — attendu ${b}, obtenu ${a}`)
}

/** Sauvegarde vierge, avec l'horodatage voulu. */
function pristine(updatedAt) {
  return { version: 1, tasks: {}, pokemon: {}, counters: {}, resources: {}, roster: {}, journal: [], updatedAt }
}

/** Sauvegarde portant une progression. */
function filled(updatedAt, extra = {}) {
  return { ...pristine(updatedAt), tasks: { 'phase-1.1': true }, ...extra }
}

const T0 = '2026-07-01T10:00:00.000Z'
const T1 = '2026-07-02T10:00:00.000Z'
const T2 = '2026-07-03T10:00:00.000Z'

/* --- Reconnaissance d'une sauvegarde vierge ---------------------------- */

check('vierge', isPristineSave(pristine(T0)), true)
check('une tâche cochée', isPristineSave(filled(T0)), false)
check(
  'une fiche saisie',
  isPristineSave({ ...pristine(T0), pokemon: { tyranitar: { ivs: { atk: 31 }, evs: {}, moves: ['', '', '', ''] } } }),
  false,
)
check('un compteur', isPristineSave({ ...pristine(T0), counters: { money: 1 } }), false)
check('une ressource', isPristineSave({ ...pristine(T0), resources: { 'npc:x': true } }), false)
check('un roster modifié', isPristineSave({ ...pristine(T0), roster: { tyranitar: { slot: 2 } } }), false)
check('une entrée de journal', isPristineSave({ ...pristine(T0), journal: [{ id: 'a', date: T0, title: '', body: '' }] }), false)

/* --- Le garde-fou de l'appareil neuf ----------------------------------- */

/*
 * Le scénario réel : tout a été rempli sur le téléphone, l'ordinateur ouvre
 * l'app pour la première fois. Son local est vierge mais horodaté à l'instant,
 * donc « plus récent » que le distant. Il doit malgré tout tirer, jamais pousser.
 */
check(
  'appareil neuf face à un distant rempli plus ancien',
  decideSync(pristine(T2), filled(T0), emptyMarker()).action,
  'pull',
)
check(
  'appareil neuf : aucune divergence annoncée',
  decideSync(pristine(T2), filled(T0), emptyMarker()).diverged,
  false,
)

/* --- Premier envoi ------------------------------------------------------ */

check('pas de distant, local rempli', decideSync(filled(T1), null, emptyMarker()).action, 'push')
check('pas de distant, local vierge', decideSync(pristine(T1), null, emptyMarker()).action, 'none')

/* --- Marche courante ---------------------------------------------------- */

const synced = markerAfter(filled(T1), filled(T1))
check('marqueur après synchro', synced, { localUpdatedAt: T1, remoteUpdatedAt: T1 })

check('rien n’a bougé', decideSync(filled(T1), filled(T1), synced).action, 'none')
check('seul le local a bougé', decideSync(filled(T2), filled(T1), synced).action, 'push')
check('seul le distant a bougé', decideSync(filled(T1), filled(T2), synced).action, 'pull')

check('local modifié : pas de divergence', decideSync(filled(T2), filled(T1), synced).diverged, false)
check('distant modifié : pas de divergence', decideSync(filled(T1), filled(T2), synced).diverged, false)

/* --- Divergence : les deux côtés ont bougé ------------------------------ */

const old = markerAfter(filled(T0), filled(T0))

check('divergence, distant plus récent', decideSync(filled(T1), filled(T2), old).action, 'pull')
check('divergence, local plus récent', decideSync(filled(T2), filled(T1), old).action, 'push')
check('divergence signalée', decideSync(filled(T2), filled(T1), old).diverged, true)
check('divergence, même horodatage', decideSync(filled(T1), filled(T1), old).action, 'none')

/*
 * Première synchro d'un appareil déjà rempli sur un gist déjà rempli : sans
 * marqueur, on ne peut pas savoir qui a bougé, donc c'est une divergence — et
 * le perdant part en copie de secours. C'est le seul cas où la règle choisie
 * peut coûter quelque chose, il doit donc être annoncé comme tel.
 */
check(
  'deux appareils remplis, jamais synchronisés',
  decideSync(filled(T2), filled(T1), emptyMarker()),
  { action: 'push', diverged: true, reason: 'Les deux appareils ont changé ; celui-ci est plus récent.' },
)

/* --- Rapport ------------------------------------------------------------ */

if (failures.length) {
  console.error(`\n${failures.length} problème(s) sur ${assertions} :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log(`Décision de synchronisation : ${assertions} assertions, tout passe.`)
