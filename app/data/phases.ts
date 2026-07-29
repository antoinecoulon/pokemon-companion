import type { Phase } from './types'

/**
 * §5 — TODO LIST GÉNÉRALE.
 *
 * Les `done` reprennent l'état des cases du guide markdown au moment de la
 * migration : ils servent de valeur initiale, l'état réel vit ensuite dans le
 * localStorage.
 *
 * Les `requires` encodent les prérequis que le guide énonce en prose, pour que
 * le dashboard ne propose jamais une tâche impossible à faire. Une dépendance
 * n'est posée que lorsque le guide l'affirme explicitement.
 */
export const phases: Phase[] = [
  {
    id: 'phase-0',
    number: 0,
    title: 'Diagnostic',
    subtitle: '30 min, gratuit — commence ici',
    tasks: [
      {
        id: 'phase-0.0',
        label: 'Récupérer l’**Advanced Stat Scanner** : parle à **l’assistant du Prof. Log, au laboratoire de Frozen Heights**. Il affiche stats de base + **IV en chiffres** + EV directement dans le résumé.',
        details: [
          '**Tout le reste du guide devient dix fois plus simple avec cet objet en poche — commence par là.**',
        ],
        key: true,
        priority: 1,
        done: true,
      },
      {
        id: 'phase-0.1',
        label: 'Récupérer la **Frontier Card** : parle au guide à la barrière **au nord de Seaport City** (disponible dès que tu es Champion).',
        done: true,
      },
      {
        id: 'phase-0.2',
        label: 'Vérifier ta difficulté : si tu es en **Vanilla**, monte au moins en **Difficile** (sinon les notes IV sont masquées et le PNJ IV Changer peut ne pas apparaître).',
        priority: 2,
        done: true,
      },
      {
        id: 'phase-0.3',
        label: 'Noter les 6 IV et les 6 EV de tes Pokémon. Sans ça tu vas gaspiller des Bottle Caps sur des stats déjà à 31.',
        details: [
          'Le guide disait « sur papier / dans un fichier » : c’est désormais le formulaire de chaque fiche d’équipe.',
        ],
        requires: ['phase-0.0', 'phase-0.2'],
        link: '/equipe',
        done: true,
      },
      {
        id: 'phase-0.4',
        label: 'Décider du rôle définitif de chaque Pokémon (les fiches §6 te donnent une recommandation argumentée).',
        requires: ['phase-0.3'],
        link: '/equipe',
        done: true,
      },
      {
        id: 'phase-0.5',
        label: '**Trancher le conflit de Méga.** Tu ne peux Méga-évoluer qu’**un** Pokémon par combat : Tyranitar **ou** Sceptile, pas les deux.',
        ref: '§6.2',
        done: true,
      },
      {
        id: 'phase-0.6',
        label: 'Vérifier que tu as bien battu **Successor Maxima au Tarmigan Mansion** (prérequis obligatoire pour Méga-évoluer).',
        done: true,
      },
    ],
  },

  {
    id: 'phase-1',
    number: 1,
    title: 'Débloquer l’infrastructure',
    tasks: [
      {
        id: 'phase-1.1',
        label: 'Terminer la mission **Seasonal Research (#053)** — scientifique dans la maison au sud-ouest du Centre Pokémon de **Tehl Town**. Débloque le Nature Changer à 50 000 $ (au lieu de 50 BP).',
        priority: 3,
        done: true,
      },
      {
        id: 'phase-1.2',
        label: 'Récupérer le **DexNav** si tu ne l’as pas : sœur du Prof. Log, Blizzard City, maison au nord-ouest, à l’étage.',
        done: true,
      },
      {
        id: 'phase-1.3',
        label: 'Récupérer la **Rune Purif. / Amulet Coin** : échange en jeu à Blizzard City (Onix contre Électrode). L’améliorer chez le PNJ au centre de **Tehl Town** contre des Gros Pépites (nécessite de lui montrer Regigigas).',
        done: true,
      },
      {
        id: 'phase-1.4',
        label: '**Récupérer et améliorer le Macho Brace au maximum (×10 EV).** C’est le plus gros gain de temps de toute la Phase 3.',
        details: [
          'Le récupérer : Maître de Karaté à l’ouest de Fallshore City / Route 10, bord sud de la carte, Surf requis (ou bord est de Crater Town en Expert/Insane, où tu l’as déjà dans le sac).',
          '**Farmer des Pierres Stase (Everstones)** au minage dans le **KBT Expressway au nord de Crater Town**, puis les échanger au même PNJ pour monter le multiplicateur.',
        ],
        key: true,
        priority: 4,
        done: true,
      },
      {
        id: 'phase-1.5',
        label: 'Récupérer les **objets Pouvoir** manquants via leurs missions : Brassard (#003), Ceinture (#005), Anneau (#033), Bandeau (#052), Poids (#071), Lentille (Vivill Warehouse B5F).',
        details: [
          'Les améliorer chez le second Maître de Karaté près d’Antisis City, contre des **Morceaux d’Étoile** (à voler aux Minior de la Route 1 avec Sabotage).',
        ],
        done: false,
      },
      {
        id: 'phase-1.6',
        label: 'Choper le **Pokérus** si possible (raids, échanges) — double tous les gains d’EV, cumulable avec le Macho Brace.',
        done: true,
      },
      {
        id: 'phase-1.7',
        label: '*(optionnel mais rentable)* Faire les quêtes de la **Breeder’s School de Seaport City** pour obtenir un **Métamorph aux IV parfaits**, + un **Nœud Destin** au Casino. Ça remplace définitivement les Bottle Caps pour tout Pokémon élevable.',
        done: true,
      },
    ],
  },

  {
    id: 'phase-2',
    number: 2,
    title: 'Farm des ressources',
    tasks: [
      {
        id: 'phase-2.1',
        label: '**Argent — objectif ~500 000 $** (5 natures + marge). Trainer House de Dresco Town, Amulet Coin améliorée en tête d’équipe.',
        requires: ['phase-1.3'],
        done: false,
      },
      {
        id: 'phase-2.2',
        label: '**Baies réductrices d’EV** — marché en plein air de **Fallshore City**. Compte ~25 baies par stat à purger (10 EV/baie). C’est ta méthode de purge principale : **0 BP dépensé**.',
        done: false,
      },
      {
        id: 'phase-2.3',
        label: '**BP — objectif ~200 BP.** Battle Tower en Singles.',
        details: [
          'purge EV : **0 BP** si tu passes par les baies de Fallshore',
          'objets Choix : 48 BP pièce (non disponibles au Game Corner)',
          'Bottes Épaisses : 48 BP (ou exemplaire unique à Cootes Bog)',
          'tuteurs et Egg Move Tutor : variable',
        ],
        requires: ['phase-0.1'],
        done: false,
      },
      {
        id: 'phase-2.4',
        label: '**Bottle Caps.** Minage avec l’**ADM Gear** (KBT Expressway, Crystal Peak) + raids 5–6★. **Priorité : Zeraora d’abord** (seul non-élevable et non-DexNavvable de ton équipe). Pour les autres, compare le coût en caps avec un ré-élevage via Métamorph parfait.',
        requires: ['phase-0.2'],
        done: false,
      },
      {
        id: 'phase-2.5',
        label: '**Écailles Cœur.** Pêche aux Luvdisc à la Méga Canne, avec un Pokémon en tête ayant **Fouille (Frisk)** + **Larcin (Thief)**. Ton **Dusknoir peut avoir Fouille comme talent caché** — pratique, mais ça lui coûte Pression, à ne faire que sur un second exemplaire.',
        done: false,
      },
      {
        id: 'phase-2.6',
        label: '**Jetons du Game Corner** (Dehara) si tu vises Orbe Vie (7 500 jetons) ou Restes (5 000 jetons) sans dépenser de BP.',
        done: false,
      },
      {
        id: 'phase-2.7',
        label: '*(optionnel)* **Gold Bottle Cap** — mission **#006**, collecter les 120 CT. Long, mais ça règle un Pokémon entier d’un coup.',
        done: false,
      },
    ],
  },

  {
    id: 'phase-3',
    number: 3,
    title: 'Optimisation, Pokémon par Pokémon',
    intro: [
      {
        kind: 'p',
        text: 'Suis les fiches §6 dans cet ordre de priorité (retour sur investissement décroissant) :',
      },
      {
        kind: 'quote',
        tone: 'warning',
        text: 'Le guide source ne numérote que **deux** entrées ici (3.1 Togekiss et 3.3 Tyranitar — le 3.2 manque). Les quatre autres membres de la composition finale n’ont pas d’entrée de phase : leur travail d’optimisation vit dans leur fiche, section **Équipe**.',
      },
    ],
    tasks: [
      {
        id: 'phase-3.1',
        label: '**Togekiss** — le meilleur rapport effort/puissance de ton équipe. Une Ability Capsule le transforme.',
        requires: ['phase-0.4'],
        link: '/equipe/togekiss',
        ref: '§6.3',
        done: false,
      },
      {
        id: 'phase-3.3',
        label: '**Tyranitar** — puissant mais il faut trancher son rôle et gérer le sable.',
        requires: ['phase-0.4'],
        link: '/equipe/tyranitar',
        ref: '§6.1',
        done: true,
      },
    ],
  },

  {
    id: 'phase-4',
    number: 4,
    title: 'Combler les trous d’équipe',
    tasks: [
      {
        id: 'phase-4.1',
        label: 'Ajouter un **6ᵉ Pokémon** — ton équipe n’a **aucun retrait de hazards** (ni Anti-Brume ni Tour Rapide). Sur la durée du Battle Tower, le Piège de Roc à lui seul détruit ton Togekiss (25 % par entrée).',
        details: [
          '**Excadrill** — Tour Rapide + Baigne Sable, synergie parfaite avec Tyranitar',
          '**Corviknight** — Anti-Brume + résistance Acier, couvre les faiblesses Glace/Fée',
          '**Landorus-Thérien** — Intimidation + Demi-Tour + Piège de Roc',
        ],
        ref: '§7.3',
        done: true,
      },
      {
        id: 'phase-4.2',
        label: 'Décider qui pose le **Piège de Roc**. Tyranitar est le candidat naturel.',
        done: true,
      },
    ],
  },

  {
    id: 'phase-5',
    number: 5,
    title: 'Battle Frontier',
    tasks: [
      {
        id: 'phase-5.1',
        label: 'Commencer par le **Battle Tower en Singles** (format le plus lisible).',
        requires: ['phase-0.1'],
        done: false,
      },
      {
        id: 'phase-5.2',
        label: '**Vérifier les règles du format avant de construire ton équipe** : selon le bâtiment et le tier, les objets doublons et certains talents/capacités (Moody, Chlorophyle, Relais, Toile Gluante…) sont interdits. Ne planifie pas 3 Restes.',
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

/** Index plat de toutes les tâches de la roadmap, par id. */
export const phaseTasksById = new Map(
  phases.flatMap(phase => phase.tasks.map(task => [task.id, { task, phase }] as const)),
)
