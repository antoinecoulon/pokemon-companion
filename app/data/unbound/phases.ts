import type { Phase } from '../types'

/**
 * Battle Frontier — ce qui reste de la roadmap du guide.
 *
 * Les phases 0 à 4 (diagnostic, infrastructure, farm, optimisation, trous
 * d'équipe) ont été retirées : la partie les a dépassées, et le guide n'est plus
 * une source de vérité. Leurs ids `phase-0.x` à `phase-4.x` restent dans les
 * sauvegardes déjà écrites — `normalize()` les conserve, la purge se fait à la
 * main dans l'app — et ne doivent jamais être réattribués.
 *
 * La Frontier reste modélisée en *tâches* plutôt qu'en objectifs de complétion,
 * parce qu'elle en a les propriétés : un ordre, des `requires`, et un intérêt à
 * apparaître dans « prochaines actions ». Tout le reste du post-game, qui n'a ni
 * ordre ni dépendances, vit dans la complétion.
 *
 * Le tableau reste un `Phase[]` d'un seul élément : `taskEntries`, `useProgress`
 * et `prune` continuent d'en dépendre sans changement.
 */
export const phases: Phase[] = [
  {
    id: 'phase-5',
    number: 5,
    title: 'Battle Frontier',
    intro: [
      {
        kind: 'p',
        text: 'La destination de tout le parcours. §10 décrit le lieu ; ce qui suit en extrait ce qui se fait, dans l’ordre où ça se fait.',
      },
    ],
    tasks: [
      {
        id: 'phase-5.4',
        label: 'Accéder à la Frontier : **barrière au nord de Seaport City**, une fois Champion, puis parler au guide pour obtenir la **Frontier Card**.',
        details: [
          'Quatre bâtiments — **Battle Tower**, **Battle Circus**, **Battle Sands**, **Battle Mine** — chacun avec ses règles et son Frontier Brain.',
        ],
        ref: '§10.1',
        done: false,
      },
      {
        id: 'phase-5.1',
        label: 'Commencer par le **Battle Tower en Singles** (format le plus lisible).',
        // La Frontier Card conditionne tout le reste de la phase : sans elle, le
        // moteur proposerait des runs impossibles à lancer. Le retrait de la
        // roadmap a fait tomber `phase-0.1`, qui disait déjà la même chose.
        requires: ['phase-5.4'],
        done: false,
      },
      {
        id: 'phase-5.2',
        label: '**Vérifier les règles du format avant de construire ton équipe** : selon le bâtiment et le tier, les objets doublons et certains talents/capacités (Moody, Chlorophyll, Baton Pass, Sticky Web…) sont interdits. Ne planifie pas 3 Leftovers.',
        done: false,
      },
      {
        id: 'phase-5.5',
        label: 'Arrêter l’équipe de Frontier. **§10.2 est périmé** : il propose Zeraora en lead, or §6.5 et §7.3 le sortent de l’équipe. À reconstruire depuis la composition finale.',
        details: [
          'Ce que §10.2 cherchait reste valable : un **lead rapide**, un **cœur** qui absorbe le Ground destiné au reste, un **finisseur** qui casse les murs.',
          'Togekiss et Tyranitar tiennent toujours les rôles de cœur et de finisseur ; le lead est le seul à redéfinir.',
        ],
        requires: ['phase-5.2'],
        ref: '§10.2',
        done: false,
      },
      {
        id: 'phase-5.6',
        label: 'Farmer les BP : privilégier les **Pokémon rapides à forte puissance brute** pour raccourcir les combats.',
        details: [
          'Le guide citait Zeraora Life Orb, Tyranitar Choice Band, Togekiss para-flinch — le principe tient même si le premier n’est plus dans l’équipe.',
          'Les BP servent aux **Choice items** (48 BP pièce) ; la purge d’EV passe par les baies de Fallshore, à 0 BP.',
        ],
        requires: ['phase-5.1'],
        ref: '§10.3',
        done: false,
      },
      {
        id: 'phase-5.3',
        label: 'Viser un Gold Print par bâtiment, puis les Frontier Brains (Palmer, Paula, Pablo, Patroz).',
        requires: ['phase-5.1', 'phase-5.2'],
        done: false,
      },
    ],
  },
] satisfies Phase[]

/** Index plat des tâches de la Frontier, par id. */
export const phaseTasksById = new Map(
  phases.flatMap(phase => phase.tasks.map(task => [task.id, { task, phase }] as const)),
)
