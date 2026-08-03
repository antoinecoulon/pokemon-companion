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

const { decideSync, emptyMarker, isPristineSave, markerAfter, readMarkers } = await loadApp('utils/sync.ts')

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
  return {
    version: 1,
    tasks: {},
    pokemon: {},
    counters: {},
    resources: {},
    roster: {},
    catches: {},
    journal: [],
    updatedAt,
  }
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
check('une capture enregistrée', isPristineSave({ ...pristine(T0), catches: { zigzagoon: true } }), false)
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

/* --- Marqueurs par jeu -------------------------------------------------- */

/*
 * Le multi-jeux a fait passer la configuration d'un `marker` unique à un
 * marqueur par jeu. Un appareil déjà relié au gist porte l'ancienne forme : s'y
 * tromper remettrait son marqueur à zéro, ce que `decideSync` lit comme « les
 * deux côtés ont changé » — donc une divergence, donc un écrasement. C'est
 * exactement le genre de perte silencieuse que ce fichier existe pour empêcher.
 */
const GAMES = ['unbound', 'elite-redux', 'emerald-seaglass']
const legacyMarker = { remoteUpdatedAt: T1, localUpdatedAt: T2 }

check(
  'config héritée : l’ancien marqueur est repris sur le jeu historique',
  readMarkers({ marker: legacyMarker }, GAMES, 'unbound').unbound,
  legacyMarker,
)
/*
 * L'héritage ne vaut que pour le jeu historique, et cela doit rester vrai pour
 * **chaque** jeu ajouté depuis : hériter du marqueur d'Unbound ferait passer la
 * première synchro du nouveau jeu pour une divergence, donc pour un écrasement.
 * Boucler plutôt que nommer un jeu évite qu'un quatrième arrive sans ce contrôle.
 */
for (const game of GAMES.filter(id => id !== 'unbound')) {
  check(
    `config héritée : « ${game} » part d’un marqueur vide`,
    readMarkers({ marker: legacyMarker }, GAMES, 'unbound')[game],
    emptyMarker(),
  )
}

const perGame = {
  markers: {
    'unbound': { remoteUpdatedAt: T1, localUpdatedAt: T1 },
    'elite-redux': { remoteUpdatedAt: T2, localUpdatedAt: T2 },
    'emerald-seaglass': { remoteUpdatedAt: T1, localUpdatedAt: T2 },
  },
}
check('marqueurs par jeu : unbound relu tel quel', readMarkers(perGame, GAMES, 'unbound').unbound, perGame.markers.unbound)
check('marqueurs par jeu : indépendants', readMarkers(perGame, GAMES, 'unbound')['elite-redux'], perGame.markers['elite-redux'])
check('marqueurs par jeu : le troisième jeu aussi', readMarkers(perGame, GAMES, 'unbound')['emerald-seaglass'], perGame.markers['emerald-seaglass'])

/*
 * La forme nouvelle prime sur l'ancienne : une fois les marqueurs par jeu
 * écrits, un `marker` résiduel ne doit plus rien décider.
 */
check(
  'la forme par jeu prime sur le marqueur hérité',
  readMarkers({ marker: legacyMarker, markers: { unbound: emptyMarker() } }, GAMES, 'unbound').unbound,
  emptyMarker(),
)

check('config absente : tous les marqueurs sont vides', readMarkers(undefined, GAMES, 'unbound'), {
  'unbound': emptyMarker(),
  'elite-redux': emptyMarker(),
  'emerald-seaglass': emptyMarker(),
})
check('marqueur corrompu : ramené à vide plutôt que propagé', readMarkers({ markers: { unbound: { remoteUpdatedAt: 42 } } }, GAMES, 'unbound').unbound, emptyMarker())

/*
 * Le cas qui coûte : reprendre l'ancien marqueur évite la divergence. Sans la
 * reprise, `decideSync` verrait deux côtés modifiés et écraserait un des deux.
 */
const inheritedMarker = markerAfter(filled(T1), filled(T1))
check(
  'marqueur hérité repris : pas de fausse divergence',
  decideSync(filled(T1), filled(T1), readMarkers({ marker: inheritedMarker }, GAMES, 'unbound').unbound).action,
  'none',
)
check(
  'marqueur hérité perdu : divergence, donc écrasement',
  decideSync(filled(T1), filled(T1), emptyMarker()).diverged,
  true,
)

/* --- Rapport ------------------------------------------------------------ */

if (failures.length) {
  console.error(`\n${failures.length} problème(s) sur ${assertions} :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log(`Décision de synchronisation : ${assertions} assertions, tout passe.`)
