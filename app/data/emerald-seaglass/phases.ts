import type { Phase } from '../types'

/**
 * Les quatre phases d'un run Emerald Seaglass.
 *
 * La structure ne décalque ni Unbound ni Elite Redux, et elle ne décalque pas
 * non plus un walkthrough d'Emerald. Ce jeu suit la **trame vanilla de Hoenn** :
 * recopier les 8 gyms en 8 phases n'apprendrait rien à quelqu'un qui connaît
 * déjà Emerald. Ce qui mérite d'être suivi, c'est **ce que ce hack ajoute** — et
 * qui se rate facilement parce que rien en jeu ne le signale.
 *
 * D'où le déséquilibre assumé : la **phase 1 est détaillée**, parce que c'est là
 * que se concentrent les choses à ne pas manquer (deux Shiny Charm, DexNav,
 * `EXP. Share`, Wishing Well, ouverture précoce de Pacifidlog, `HM07 Waterfall`
 * via un minigame). Les phases 2 à 4 sont des jalons : elles se rempliront en
 * jouant, et il n'y a rien d'honnête à écrire d'avance sur un post-game que la
 * doc de l'auteur ne décrit pas.
 *
 * Ce qui est *ordonné et actionnable* vit ici ; ce qui est *collection* vit dans
 * `completion.ts`. Les deux axes ne se mélangent jamais.
 *
 * Les ids `phase-1.x` à `phase-4.x` ne sont pas en conflit avec ceux d'Unbound
 * (retirés) ni avec ceux d'Elite Redux : chaque jeu a sa propre clé de
 * sauvegarde. Voir `app/data/games.ts`.
 *
 * Source des faits : `docs/emerald-seaglass/`, adossé à la documentation
 * officielle de l'auteur.
 */
export const phases: Phase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Débuter',
    subtitle: 'De la ROM au Dynamo Badge — le tronçon où presque tout ce qui se rate définitivement se ramasse.',
    intro: [
      {
        kind: 'p',
        text: 'Emerald Seaglass est un **Emerald vanilla** côté histoire et exploration : même région, même trame, même ordre de badges. Ce qui change, c’est tout le reste — la refonte visuelle, les 421 espèces des gen 1-3 avec leurs retypages, et un confort de jeu qui supprime l’essentiel du grind.',
      },
      {
        kind: 'quote',
        tone: 'warning',
        text: 'Le piège de ce hack n’est pas la difficulté, c’est la **discrétion** : le premier `Shiny Charm` est dans le PC dès la première minute, Pacifidlog s’ouvre bien avant Surf, et une HM s’obtient dans un minigame. Rien en jeu ne le dit.',
      },
      {
        kind: 'quote',
        tone: 'info',
        text: 'Le **Pokédex du jeu a été refait** pour afficher types, méthodes d’évolution et movesets à jour du hack. Presque toutes les espèces ont changé : le consulter est un réflexe à prendre tout de suite, la mémoire d’Emerald induit en erreur.',
      },
    ],
    tasks: [
      {
        id: 'phase-1.1',
        label: 'Patcher une ROM **Pokémon Emerald** propre avec le patch **officiel**, depuis le **Ko-fi de Nemo622**.',
        details: [
          'C’est la seule source que la documentation désigne elle-même. Ne pas passer par les sites de téléchargement : ce sont des fermes SEO qui réhébergent le patch, et `pokemonemeraldseaglass.com` s’annonce « Official Game Download » sans être confirmé comme le site de l’auteur.',
          'Noter la version installée — c’est ce qui permettra de savoir si un écart avec cette app est une erreur de contenu ou un changement de version.',
          '⚠️ La version **v3.0** (2024-09-21) n’est rapportée que par une source secondaire, jamais confirmée par l’auteur.',
        ],
        link: '/reference#known-issues',
        key: true,
        done: false,
      },
      {
        id: 'phase-1.2',
        label: 'Dans la chambre : régler le **livre sur le bureau**. C’est là que se trouve le **Hard Mode**, qui retire les soft level caps.',
        details: [
          'Les caps par défaut sont **souples** : dépasser le niveau du Gym Leader en cours divise l’EXP par deux, puis la réduit davantage. Rien ne bloque.',
          '⚠️ Les valeurs par badge ne sont **pas documentées** — les relever badge par badge est le principal trou à combler.',
          'Le livre donne accès à « d’autres options » que l’auteur ne détaille pas : les passer en revue à ce moment-là.',
        ],
        requires: ['phase-1.1'],
        link: '/reference#soft-level-caps',
        key: true,
        done: false,
      },
      {
        id: 'phase-1.3',
        label: 'Sortir le **premier `Shiny Charm` du PC de la chambre**. Il y est dès le début de la partie.',
        details: [
          '5 relances supplémentaires, sur un taux de base de 1/4096.',
          'Un **second** `Shiny Charm` existe à Fortree, et les relances **se cumulent** — c’est la particularité du hack.',
        ],
        requires: ['phase-1.2'],
        link: '/reference#shinies',
        done: false,
      },
      {
        id: 'phase-1.4',
        label: 'La **GameCube de la chambre** ouvre les Mystery Gifts. Décider maintenant si l’on joue avec ou sans.',
        details: [
          'Ce sont des codes **prévus par l’auteur** pour les styles de jeu qui veulent éviter le grind : `9RARECANDY`, `MASTERBALL`, `WISHINGSTR`, les starters régionaux…',
          '`ILOVSPHEAL` et `ILOVEAIPOM` donnent des **starters alternatifs** optimisés — l’auteur admet lui-même que le second est très fort.',
          'Choisir une fois, plutôt que de céder au milieu de la partie : c’est ce qui garde le suivi cohérent.',
        ],
        requires: ['phase-1.2'],
        link: '/reference#cheat-codes',
        done: false,
      },
      {
        id: 'phase-1.5',
        label: 'Littleroot : récupérer le **Pokédex auprès de Professor Birch**, puis se laisser rattraper par sa mère en sortant — elle installe le **DexNav**.',
        details: [
          'Le DexNav vit dans le menu Start. Il dit combien d’espèces vivent dans la zone et permet de cibler celles déjà vues.',
          'Environ tous les 200 pas, il détecte un Pokémon ; **une fois sur deux c’est un Hidden Pokémon**, introuvable autrement.',
          '**Applin** est à Littleroot — l’un des trois easter eggs du jeu. Ses pommes d’évolution s’achètent à Pacifidlog.',
        ],
        requires: ['phase-1.3'],
        link: '/reference#dexnav',
        key: true,
        done: false,
      },
      {
        id: 'phase-1.6',
        label: 'Routes 101 à 103 : premières captures, et prendre le réflexe d’**ouvrir le Pokédex du jeu** sur chaque espèce.',
        details: [
          'Les retypages sont partout et ne se devinent pas : Noctowl est Ghost/Flying, Octillery est Water/Fire, Yanmega est Bug/Dragon, Sunflora est Grass/Fire.',
          'Tout Pokémon a au moins **2 IV parfaits** — touche `A` dans l’écran de résumé pour les lire.',
        ],
        requires: ['phase-1.5'],
        link: '/reference#qol',
        done: false,
      },
      {
        id: 'phase-1.7',
        label: 'Petalburg : après le **tutoriel de capture de Wally**, **Scott donne l’`EXP. Share` party-wide**.',
        details: [
          'C’est le changement qui supprime le grind d’équipe — et la raison d’être des soft level caps.',
          'En ville aussi : le **Happy Trainer Merchant Stand**, qui vend `Ability Capsule`, `EXP Candy`, `Stat Feather`, objets `Choice` et `Vitamin`. Stock limité au début, **élargi à chaque badge** : y repasser après chaque gym.',
        ],
        requires: ['phase-1.6'],
        link: '/reference#marchands',
        key: true,
        done: false,
      },
      {
        id: 'phase-1.8',
        label: 'Petalburg Woods, puis **Rustboro City** : le **Wishing Well** est sur le flanc **est** de la ville.',
        details: [
          'Un `Wishing Star` traîne au sol près du puits ; une **petite fille de Rustboro** en donne d’autres.',
          'Chaque étoile jetée dans le puits tire un Pokémon au hasard — une gacha qui peut sortir une espèce rare très tôt.',
          '⚠️ En garder au moins un : il en faut un **en sac** pour déclencher Jirachi, bien plus tard, à Mossdeep.',
        ],
        requires: ['phase-1.7'],
        link: '/reference#wishing-well',
        done: false,
      },
      {
        id: 'phase-1.9',
        label: 'Battre **Roxanne** — et noter le **niveau max de son équipe** : c’est le premier soft level cap.',
        details: [
          'Répéter ce relevé à chaque gym : c’est ce qui comblera le trou de la référence.',
          'Repasser au stand de Petalburg après le badge, son catalogue s’étoffe.',
        ],
        requires: ['phase-1.8'],
        link: '/reference#soft-level-caps',
        key: true,
        done: false,
      },
      {
        id: 'phase-1.10',
        label: 'Route 104 : les **`Nature Mint`** à la **Pretty Petal**, au sud de Rustboro. Route 106 : le **`King’s Rock`**, juste au-dessus de l’entrée de Granite Cave.',
        details: [
          'Les Nature Mints rendent la nature choisissable — plus besoin de rejeter une capture pour ça.',
          'Un **Hiker de Granite Cave** donne des `Wishing Star`.',
        ],
        requires: ['phase-1.9'],
        link: '/reference#marchands',
        done: false,
      },
      {
        id: 'phase-1.11',
        label: 'Dewford et Granite Cave, puis battre **Brawly**.',
        details: [
          'Granite Cave abrite Aron sur tous ses étages, et **Mewtwo attendra plus tard dans la Steven’s Room** — s’en souvenir en y passant.',
          'Relever le level cap de Brawly.',
        ],
        requires: ['phase-1.10'],
        done: false,
      },
      {
        id: 'phase-1.12',
        label: 'Slateport : battre la **Team Aqua au Museum**. Cela débloque le **PNJ accompagné d’un Kirlia**, près du Pokémon Center, qui emmène à **Pacifidlog Town**.',
        details: [
          'C’est l’ouverture la plus facile à rater du jeu : Pacifidlog devient accessible **sans Surf et sans Dive**, très en avance sur le vanilla.',
          'Au marché de Slateport : `Water Stone`, `Thunder Stone`, `Fire Stone`, `Sun Stone`, `Moon Stone`.',
        ],
        requires: ['phase-1.11'],
        key: true,
        done: false,
      },
      {
        id: 'phase-1.13',
        label: 'Jouer une première fois au **Scuba Safari** de Pacifidlog : il donne le **`HM07 Waterfall`**.',
        details: [
          'Parler au Sailor de la plateforme est. **Le HM Dive n’est pas requis** pour y jouer.',
          '200 pas, 5 rencontres. Le score juge rareté, niveau, IV et **HP restants** — donc affaiblir sans trop entamer.',
          'Chaque nouveau record rapporte 5 `Heart Scale` et une TM tirée d’un lot de bonnes capacités.',
          'C’est aussi la plus grosse source d’espèces d’eau du jeu : y revenir régulièrement.',
        ],
        requires: ['phase-1.12'],
        link: '/reference#scuba-safari',
        key: true,
        done: false,
      },
      {
        id: 'phase-1.14',
        label: 'Mauville et **Wattson**, puis retourner au Pokémon Center de **Slateport** chercher le **`Pokémon Box Link`** auprès du Scientist.',
        details: [
          'Le `Pokémon Box Link` donne accès au PC de n’importe où — il ne s’obtient qu’**après Wattson**.',
          'Le **Game Corner de Mauville** ouvre les flippers : chaque partie gagnée rapporte un Pinball Point, échangeable contre des balls apricorn et des **œufs de formes Alola**.',
          'New Mauville abrite Beldum, Magnemite, Voltorb, Raichu et Pichu.',
        ],
        requires: ['phase-1.13'],
        link: '/reference#pinball',
        done: false,
      },
      {
        id: 'phase-1.15',
        label: 'Livrer la **lettre de Steven**, puis décider si l’on veut le **`Z-Power Ring`** à la DEVON Corporation.',
        details: [
          'Entièrement optionnel et à l’écart : l’auteur précise que qui n’aime pas les Z-Moves peut ne jamais aller le chercher.',
          'Choisir maintenant évite de se poser la question à chaque combat.',
        ],
        requires: ['phase-1.14'],
        link: '/reference#qol',
        done: false,
      },
    ],
  },

  {
    id: 'phase-2',
    number: 2,
    title: 'Construire une équipe',
    subtitle: 'Le moment où les outils du hack rendent la préparation d’équipe presque gratuite.',
    intro: [
      {
        kind: 'p',
        text: 'Ce hack met en boutique ce qui demandait ailleurs du farm : natures, talents, EV. La seule chose qui reste à gagner sur le terrain, ce sont les **IV** — et le DexNav s’en charge.',
      },
      {
        kind: 'quote',
        tone: 'info',
        text: 'Cette phase est volontairement un squelette : les fiches Pokémon se rédigent en jouant, une fois l’équipe réelle connue. Elles apparaîtront dans **Équipe**.',
      },
    ],
    tasks: [
      {
        id: 'phase-2.1',
        label: 'Arrêter une **composition de six**, en tenant compte des retypages.',
        details: [
          'Ne pas raisonner sur les types d’Emerald : Noctowl, Octillery, Yanmega, Parasect, Politoed et bien d’autres ont changé.',
          'Créer une fiche par membre au fil des captures.',
        ],
        requires: ['phase-1.15'],
        link: '/equipe',
        key: true,
        done: false,
      },
      {
        id: 'phase-2.2',
        label: 'Régler **natures, talents et EV** par la boutique plutôt que par le rejet de captures.',
        details: [
          '`Nature Mint` à la Pretty Petal, Route 104.',
          '`Ability Capsule`, `Stat Feather`, `Vitamin`, `EXP Candy` et objets `Choice` au Happy Trainer Merchant Stand de Petalburg — catalogue élargi à chaque badge.',
        ],
        requires: ['phase-2.1'],
        link: '/reference#marchands',
        done: false,
      },
      {
        id: 'phase-2.3',
        label: '**Chaîner au DexNav** les espèces gardées : IV améliorés, egg moves rares, et meilleures chances de shiny.',
        requires: ['phase-2.1'],
        link: '/reference#dexnav',
        done: false,
      },
      {
        id: 'phase-2.4',
        label: 'À **Fortree City** : récupérer le **second `Shiny Charm`** en activant tous les **shrines d’est en ouest, dans l’ordre**.',
        details: [
          'Il apparaît dans le dernier shrine, à gauche du Pokémon Center. Un vieil homme d’une des maisons donne l’indice.',
          'Les relances **se cumulent** avec le premier : avoir les deux double les tirages.',
        ],
        requires: ['phase-2.1'],
        link: '/reference#shinies',
        key: true,
        done: false,
      },
      {
        id: 'phase-2.5',
        label: 'Passer au **Contest Hall de Verdanturf** si les concours intéressent — il y a été déplacé pour être accessible tôt.',
        details: [
          'Un PNJ y **remet le Sheen à zéro**, ce qui débloque le gavage de berries — impossible dans Emerald vanilla.',
          '140 de Beauty en concours reste une voie d’évolution pour Feebas, à côté de la `Prism Scale`.',
        ],
        requires: ['phase-2.1'],
        link: '/reference#contests',
        done: false,
      },
    ],
  },

  {
    id: 'phase-3',
    number: 3,
    title: 'Compléter le jeu',
    subtitle: 'Les badges restants, puis la chaîne de quêtes qui ouvre presque tous les légendaires.',
    intro: [
      {
        kind: 'p',
        text: 'À partir de Mossdeep, le hack ajoute son seul vrai fil narratif : un **Sailor au bandeau sur l’œil** qui échange des tickets contre des **entrées de Pokédex**. Presque tous les légendaires des trois premières générations sont accessibles **avant le Elite Four**.',
      },
    ],
    tasks: [
      {
        id: 'phase-3.1',
        label: 'Enchaîner **Flannery, Norman, Winona, Tate & Liza et Juan**, en relevant le level cap de chacun.',
        details: [
          'L’ordre est celui d’Emerald vanilla. ⚠️ La doc ne l’énonce pas explicitement pour Seaglass — à confirmer en jouant.',
          'Repasser au stand de Petalburg après chaque badge.',
        ],
        requires: ['phase-2.1'],
        key: true,
        done: false,
      },
      {
        id: 'phase-3.2',
        label: 'Après le **Mossdeep Gym** : trouver le **Sailor au bandeau** sur la colline près du grand télescope, et prendre l’**`Eon Ticket`**.',
        details: [
          'C’est le déclencheur de toute la chaîne — et cela débloque aussi le **SS Tidal**.',
          'La suite se coche dans **Progression** : chaque ticket demande une entrée de Pokédex précise (Rhydon, puis Octillery, puis Rayquaza).',
        ],
        requires: ['phase-3.1'],
        link: '/reference#legendaires',
        key: true,
        done: false,
      },
      {
        id: 'phase-3.3',
        label: 'Récupérer **Jirachi** : parler à la femme près du **White Rock de Mossdeep**, puis interagir avec le rocher avec un `Wishing Star` en sac.',
        requires: ['phase-3.2'],
        link: '/reference#legendaires',
        done: false,
      },
      {
        id: 'phase-3.4',
        label: 'Boucler les **trois premières quêtes du Sailor** — il annonce alors partir « exploring for more legendaries », ce qui ouvre Celebi, Mewtwo et les deux trios.',
        requires: ['phase-3.2'],
        link: '/reference#legendaires',
        key: true,
        done: false,
      },
      {
        id: 'phase-3.5',
        label: 'Atteindre **50 espèces au Pokédex**, puis aller voir **Professor Elm à Fallarbor** pour le **Spiky-Ear Pichu**.',
        details: ['Le seul palier du dex qui débloque réellement du contenu.'],
        requires: ['phase-2.1'],
        done: false,
      },
      {
        id: 'phase-3.6',
        label: 'Battre le **Elite Four**.',
        requires: ['phase-3.1'],
        key: true,
        done: false,
      },
    ],
  },

  {
    id: 'phase-4',
    number: 4,
    title: 'Post-game',
    subtitle: 'Le moins documenté du jeu — à cartographier en y jouant.',
    intro: [
      {
        kind: 'quote',
        tone: 'warning',
        text: 'La documentation de l’auteur **ne décrit pas le post-game**. Elle confirme seulement que la Battle Frontier existe — ses bâtiments sont cités dans les bugs connus — et que le **Battle Tent est désactivé** (Pokémon loués transformés en `BAD EGG`, entrée bloquée par un PNJ). Cette phase est donc courte à dessein : rien n’y a été recopié d’un walkthrough d’Emerald.',
      },
    ],
    tasks: [
      {
        id: 'phase-4.1',
        label: '**Rebattre le Elite Four** pour relancer le tirage des deux trios, jusqu’à avoir les six.',
        details: [
          'Raikou/Entei/Suicune au Shoal Cave Ice Room, Articuno/Zapdos/Moltres au sommet du Mt. Pyre : le Sailor en invoque **un au hasard**, et le tirage se réinitialise à chaque victoire sur le Elite Four.',
        ],
        requires: ['phase-3.6'],
        link: '/reference#legendaires',
        key: true,
        done: false,
      },
      {
        id: 'phase-4.2',
        label: 'Explorer la **Battle Frontier** et **noter ce qu’on y trouve** : installations disponibles, conditions d’accès, récompenses.',
        details: [
          'Aucune de ces informations n’est documentée — c’est le plus gros trou à combler, et il se comble en jouant.',
          '⚠️ Le **Battle Tent de Lilycove** est cassé dans cette version : ne pas y perdre de temps.',
        ],
        requires: ['phase-3.6'],
        link: '/reference#known-issues',
        done: false,
      },
      {
        id: 'phase-4.3',
        label: 'Compléter le **Pokédex** : 421 entrées, gen 1-3 et leurs évolutions cross-gen.',
        details: [
          'Le Scuba Safari et le DexNav sont les deux voies qui ouvrent le plus d’espèces.',
          'Le stand de **Sootopolis City**, au nord du Pokémon Center, vend **tous** les objets d’évolution — le filet de sécurité pour finir les lignées.',
        ],
        requires: ['phase-3.6'],
        done: false,
      },
      {
        id: 'phase-4.4',
        label: 'Relever les **valeurs des soft level caps** badge par badge, et compléter la référence.',
        details: [
          'C’est la donnée manquante la plus utile du jeu : aucune source ne la publie.',
          'Une fois relevée, elle se note dans le Journal puis se transcrit dans `docs/emerald-seaglass/`.',
        ],
        requires: ['phase-3.6'],
        link: '/reference#soft-level-caps',
        done: false,
      },
    ],
  },
]
