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
        label: '**Trancher le conflit de Mega.** Tu ne peux Mega-évoluer qu’**un** Pokémon par combat : Tyranitar **ou** Sceptile, pas les deux.',
        ref: '§6.2',
        done: true,
      },
      {
        id: 'phase-0.6',
        label: 'Vérifier que tu as bien battu **Successor Maxima au Tarmigan Mansion** (prérequis obligatoire pour Mega-évoluer).',
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
        label: 'Terminer la mission **Seasonal Research (#053)** — scientifique dans la maison au sud-ouest du Pokémon Center de **Tehl Town**. Débloque le Nature Changer à 50 000 $ (au lieu de 50 BP).',
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
        label: 'Récupérer l’**Amulet Coin** : échange en jeu à Blizzard City (Onix contre Electrode). L’améliorer chez le PNJ au centre de **Tehl Town** contre des Big Nuggets (nécessite de lui montrer Regigigas).',
        done: true,
      },
      {
        id: 'phase-1.4',
        label: '**Récupérer et améliorer le Macho Brace au maximum (×10 EV).** C’est le plus gros gain de temps de toute la Phase 3.',
        details: [
          'Le récupérer : Black Belt à l’ouest de Fallshore City / Route 10, bord sud de la carte, Surf requis (ou bord est de Crater Town en Expert/Insane, où tu l’as déjà dans le sac).',
          '**Farmer des Everstones** au minage dans le **KBT Expressway au nord de Crater Town**, puis les échanger au même PNJ pour monter le multiplicateur.',
        ],
        key: true,
        priority: 4,
        done: true,
      },
      {
        id: 'phase-1.5',
        label: 'Récupérer les **Power items** manquants via leurs missions : Power Bracer (#003), Power Belt (#005), Power Anklet (#033), Power Band (#052), Power Weight (#071), Power Lens (Vivill Warehouse B5F).',
        details: [
          'Les améliorer chez le second Black Belt près d’Antisis City, contre des **Star Pieces** (à voler aux Minior de la Route 1 avec Knock Off).',
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
        label: '*(optionnel mais rentable)* Faire les quêtes de la **Breeder’s School de Seaport City** pour obtenir un **Ditto aux IV parfaits**, + un **Destiny Knot** au Casino. Ça remplace définitivement les Bottle Caps pour tout Pokémon élevable.',
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
          'Choice items : 48 BP pièce (non disponibles au Game Corner)',
          'Heavy-Duty Boots : 48 BP (ou exemplaire unique à Cootes Bog)',
          'tuteurs et Egg Move Tutor : variable',
        ],
        requires: ['phase-0.1'],
        done: false,
      },
      {
        id: 'phase-2.4',
        label: '**Bottle Caps.** Minage avec l’**ADM Gear** (KBT Expressway, Crystal Peak) + raids 5–6★. **Priorité : Zeraora d’abord** (seul non-élevable et non-DexNavvable de ton équipe). Pour les autres, compare le coût en caps avec un ré-élevage via Ditto parfait.',
        requires: ['phase-0.2'],
        done: false,
      },
      {
        id: 'phase-2.5',
        label: '**Heart Scales.** Pêche aux Luvdisc au Super Rod, avec un Pokémon en tête ayant **Frisk** + **Thief**. Ton **Dusknoir peut avoir Frisk comme talent caché** — pratique, mais ça lui coûte Pressure, à ne faire que sur un second exemplaire.',
        done: false,
      },
      {
        id: 'phase-2.6',
        label: '**Jetons du Game Corner** (Dehara) si tu vises la Life Orb (7 500 jetons) ou les Leftovers (5 000 jetons) sans dépenser de BP.',
        done: false,
      },
      {
        id: 'phase-2.7',
        label: '*(optionnel)* **Gold Bottle Cap** — mission **#006**, collecter les 120 TM. Long, mais ça règle un Pokémon entier d’un coup.',
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
        text: 'Le guide source ne numérote que **deux** entrées ici (3.1 Togekiss et 3.3 Tyranitar — le 3.2 manque) alors que §7.3 arrête une composition de **six**. Les quatre entrées suivantes comblent ce trou : elles ne viennent pas du guide, elles renvoient vers les fiches, qui font foi.',
      },
      {
        kind: 'p',
        text: 'Le guide n’ordonne par retour sur investissement que les deux entrées qu’il numérote. Pour les quatre autres, seul **Excadrill** est justifié comme prioritaire — §4.1 identifie l’absence de retrait de hazards comme le trou de l’équipe. Les trois derniers suivent l’ordre des sections §6.',
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
      {
        id: 'phase-3.4',
        label: '**Excadrill** — il apporte le *Rapid Spin* qui manque à toute l’équipe, et *Sand Rush* le fait doubler de Speed sous le sable de Tyranitar.',
        details: [
          'Sa fiche assume la tension que §7.3 laisse ouverte : le **Choice Band verrouille sur la première capacité utilisée**, donc incompatible avec *Rapid Spin*. Build A ou build B, il faut trancher.',
        ],
        // §4.1 : « ton équipe n'a aucun retrait de hazards », et Stealth Rock
        // seul détruit Togekiss à 25 % par entrée. C'est le seul des quatre dont
        // le guide justifie explicitement l'urgence.
        priority: 20,
        requires: ['phase-0.4'],
        link: '/equipe/excadrill',
        ref: '§7.3',
        done: false,
      },
      {
        id: 'phase-3.5',
        label: '**Flagadoss** — le pivot régénérant qui remplace Sceptile et apporte la résistance au Fighting qui manquait.',
        requires: ['phase-0.4'],
        link: '/equipe/flagadoss',
        ref: '§6.2',
        done: false,
      },
      {
        id: 'phase-3.6',
        label: '**Scorvol** — mur physique et poseur de hazards, avec *Poison Heal* pour se soigner tout seul.',
        requires: ['phase-0.4'],
        link: '/equipe/scorvol',
        ref: '§6.6',
        done: false,
      },
      {
        id: 'phase-3.7',
        label: '**Rotom-Wash** — le slot 4 de §7.3, qu’aucune section §6 ne couvre. Sa fiche a été reconstituée depuis les données Unbound.',
        requires: ['phase-0.4'],
        link: '/equipe/motisma-lavage',
        ref: '§7.3',
        done: false,
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
        label: 'Ajouter un **6ᵉ Pokémon** — ton équipe n’a **aucun retrait de hazards** (ni Defog ni Rapid Spin). Sur la durée du Battle Tower, Stealth Rock à lui seul détruit ton Togekiss (25 % par entrée).',
        details: [
          '**Excadrill** — Rapid Spin + Sand Rush, synergie parfaite avec Tyranitar',
          '**Corviknight** — Defog + résistance Steel, couvre les faiblesses Ice/Fairy',
          '**Landorus-Therian** — Intimidate + U-turn + Stealth Rock',
        ],
        ref: '§7.3',
        done: true,
      },
      {
        id: 'phase-4.2',
        label: 'Décider qui pose **Stealth Rock**. Tyranitar est le candidat naturel.',
        done: true,
      },
    ],
  },

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
        // moteur proposerait des runs impossibles à lancer.
        requires: ['phase-0.1', 'phase-5.4'],
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

/** Index plat de toutes les tâches de la roadmap, par id. */
export const phaseTasksById = new Map(
  phases.flatMap(phase => phase.tasks.map(task => [task.id, { task, phase }] as const)),
)
