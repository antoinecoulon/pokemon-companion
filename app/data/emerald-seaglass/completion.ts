import type { CompletionSection } from '../types'

/**
 * L'axe *collection* d'Emerald Seaglass — sans ordre, sans dépendances, et qui
 * n'entre jamais dans « prochaines actions ».
 *
 * Ce jeu suit la trame d'Emerald vanilla : il n'y a donc **ni missions
 * numérotées, ni Zygarde Cells, ni move tutors à cocher, ni raid dens**. Ne rien
 * décalquer d'Unbound. Ce qui fait le 100 % ici, c'est le **Pokédex** (les 421
 * entrées, gen 1-3 et leurs évolutions cross-gen), la **quête des légendaires**
 * portée par le Sailor de Mossdeep, les **easter eggs**, et les **minigames**.
 *
 * ⚠️ Le Pokédex n'est **pas** énuméré espèce par espèce : 421 cases sans
 * information ne valent rien, et le jeu embarque justement un Pokédex refait qui
 * fait ce travail mieux. Les entrées ci-dessous sont des **jalons** — dont un
 * qui débloque réellement du contenu, les 50 espèces de Spiky-Ear Pichu.
 *
 * Source unique : la documentation officielle de l'auteur. `DOC` est le mirror
 * PDF vérifié ; l'original vit sur Ko-fi, que Cloudflare rend illisible hors
 * navigateur.
 */

const DOC = 'https://www.pokeharbor.com/wp-content/uploads/2024/08/Pokemon-Emerald-Seaglass-Documentation.pdf'

export const completionSections: CompletionSection[] = [
  {
    id: 'legendaires-sailor',
    title: 'Quête des légendaires — le Sailor de Mossdeep',
    description:
      'Le seul vrai fil narratif que ce hack ajoute. Le PNJ se reconnaît à son **bandeau sur l’œil**, sur la colline près du grand télescope de Mossdeep. Chaque ticket s’obtient en lui **montrant une entrée de Pokédex** — il faut donc avoir rencontré l’espèce demandée. Presque tout est faisable **avant le Elite Four**.',
    goals: [
      {
        id: 'eon-ticket',
        label: '`Eon Ticket` — ouvre la chaîne, et avec elle le **SS Tidal**',
        location: 'Sailor de Mossdeep, après avoir battu le Mossdeep Gym',
        details: ['C’est le déclencheur : sans lui, aucune des quêtes suivantes n’existe.'],
        source: DOC,
      },
      {
        id: 'latios-latias',
        label: 'Latios et Latias — Southern Island',
        location: 'Southern Island, via l’`Eon Ticket`',
        details: [
          '**Lequel des deux apparaît est tiré au hasard**, et le tirage se réinitialise à chaque Elite Four battu *(v3.0)*. Pour en viser un précis : **sauvegarder avant d’aller sur l’île**.',
          'La table du dex les donne par ailleurs « roaming after Elite Four ». La v3.0 explique le tirage mais pas s’ils errent réellement en plus de l’île — **reste à vérifier en jeu**.',
        ],
        source: DOC,
      },
      {
        id: 'old-sea-map-mew',
        label: '`Old Sea Map` puis **Mew** — Faraway Island',
        location: 'Montrer au Sailor l’entrée de Pokédex de **Rhydon**',
        details: [
          '⚠️ La doc écrit « Pokédex entry for Rhydon (Encounter Lv. 30) » : impossible de dire si ce niveau 30 est celui de **Mew** ou celui du **Rhydon** à rencontrer. À vérifier en jeu.',
        ],
        source: DOC,
      },
      {
        id: 'mystic-ticket-hooh-lugia',
        label: '`Mystic Ticket` puis **Ho-oh et Lugia** — Navel Rock (Lv. 50 chacun)',
        location: 'Montrer au Sailor l’entrée de Pokédex d’**Octillery** (devenu Water/Fire)',
        source: DOC,
      },
      {
        id: 'aurora-ticket-deoxys',
        label: '`Aurora Ticket` puis **Deoxys** — Birth Island (Lv. 70)',
        location: 'Montrer au Sailor l’entrée de Pokédex de **Rayquaza**',
        source: DOC,
      },
      {
        id: 'celebi',
        label: '**Celebi** — Route 119 (Lv. 40)',
        location: 'Parler au Sailor devant le Birdhouse/Shrine au nord du Weather Institute',
        details: ['Débloqué après les **trois premières quêtes** du Sailor, quand il annonce partir « exploring for more legendaries ».'],
        source: DOC,
      },
      {
        id: 'mewtwo',
        label: '**Mewtwo** — Granite Cave, Steven’s Room (Lv. 80)',
        location: 'Parler au Sailor dans la pièce même',
        details: ['Débloqué après les trois premières quêtes du Sailor. Le plus haut niveau de la chaîne.'],
        source: DOC,
      },
      {
        id: 'trio-johto',
        label: '**Raikou**, **Entei**, **Suicune** — Shoal Cave Ice Room (Lv. 50)',
        location: 'Parler au Sailor sur place : il en invoque **un au hasard**',
        details: ['Le tirage **se réinitialise en battant à nouveau le Elite Four** — rater les deux autres n’est jamais définitif.'],
        source: DOC,
      },
      {
        id: 'trio-kanto',
        label: '**Articuno**, **Zapdos**, **Moltres** — sommet du Mt. Pyre (Lv. 50)',
        location: 'Parler au Sailor sur place : il en invoque **un au hasard**',
        details: ['Même mécanique de tirage, et même réinitialisation en rebattant le Elite Four.'],
        source: DOC,
      },
    ],
  },

  {
    id: 'legendaires-hors-sailor',
    title: 'Légendaires hors quête du Sailor',
    description:
      'Ceux qui gardent leur voie d’Emerald, plus Jirachi qui a la sienne. À ne pas chercher chez le Sailor.',
    goals: [
      {
        id: 'jirachi',
        label: '**Jirachi** — White Rock de Mossdeep',
        location: 'Parler à la femme à côté du White Rock, puis interagir avec le rocher avec un `Wishing Star` **en sac**',
        source: DOC,
      },
      {
        id: 'trio-regi',
        label: 'Le **trio Regi** — Desert Ruins, Island Cave, Ancient Tomb',
        details: ['Par les voies habituelles d’Emerald.'],
        source: DOC,
      },
      {
        id: 'kyogre-groudon-rayquaza',
        label: '**Kyogre**, **Groudon**, **Rayquaza** — événements de l’histoire',
        details: ['Par les voies habituelles d’Emerald.'],
        source: DOC,
      },
      {
        id: 'castform',
        label: '**Castform** — Weather Institute',
        location: 'Événement du Weather Institute, Route 119',
        source: DOC,
      },
      {
        id: 'beldum',
        label: '**Beldum** — offert par Steven, ou capturable',
        location: 'Événement chez Steven, mais aussi **sauvage à New Mauville**',
        details: ['Particularité de ce hack : plus besoin d’attendre le cadeau de fin de partie pour en avoir un.'],
        source: DOC,
      },
    ],
  },

  {
    id: 'easter-eggs',
    title: 'Easter eggs — les trois espèces hors gen 1-3',
    description:
      'L’auteur les a gardées « limited and out-of-the-way », à découvrir. Ce sont les seules espèces du jeu qui ne viennent pas des trois premières générations.',
    goals: [
      {
        id: 'spiky-ear-pichu',
        label: '**Spiky-Ear Pichu** — stats et moveset uniques, pensés pour être jouables',
        location: 'Professor Elm, à Fallarbor Town, **après avoir collecté 50 espèces différentes**',
        details: ['Le seul jalon de Pokédex qui débloque réellement quelque chose : les 50 espèces sont une condition, pas un trophée.'],
        source: DOC,
      },
      {
        id: 'tinkaton',
        label: 'La lignée **Tinkaton** — œuf de Tinkatink',
        location: 'Un Team Aqua Grunt sur la **Route 115**, au sud de Meteor Falls et au nord de Rustboro',
        source: DOC,
      },
      {
        id: 'applin',
        label: 'La lignée **Applin** — et ses trois pommes d’évolution',
        location: 'Applin à **Littleroot Town** ; `Tart Apple`, `Sweet Apple` et `Candy Apple` chez le vendeur de pommes de **Pacifidlog Town**',
        source: DOC,
      },
    ],
  },

  {
    id: 'minigames',
    title: 'Minigames',
    description:
      'Deux d’entre eux ne sont pas décoratifs : le Scuba Safari donne une HM, et les Game Corners sont la seule source de plusieurs Pokémon.',
    goals: [
      {
        id: 'pacifidlog-acces',
        label: 'Ouvrir l’accès à **Pacifidlog Town**, sans Surf',
        location: 'PNJ accompagné d’un Kirlia, près du Pokémon Center de **Slateport**, après avoir battu la **Team Aqua au Museum**',
        details: ['C’est ce qui rend Pacifidlog — et donc le Scuba Safari — accessible très tôt dans la partie.'],
        source: DOC,
      },
      {
        id: 'scuba-safari-waterfall',
        label: 'Première partie du **Scuba Safari** — donne le `HM07 Waterfall`',
        location: 'Sailor de la plateforme est de Pacifidlog. **Le HM Dive n’est pas requis.**',
        source: DOC,
      },
      {
        id: 'scuba-safari-record',
        label: 'Battre son record au Scuba Safari — 5 `Heart Scale` et une TM à chaque fois',
        details: ['Score = rareté + (niveau × 3) + somme des 6 IV + HP restants. Affaiblir sans trop entamer.'],
        source: DOC,
        optional: true,
      },
      {
        id: 'pinball-mauville',
        label: 'Game Corner de **Mauville** — balls apricorn et **œufs de formes Alola**',
        location: 'Échanger des Pinball Points, gagnés une partie de flipper à la fois',
        source: DOC,
      },
      {
        id: 'pinball-mossdeep',
        label: 'Game Corner de **Mossdeep** — objets rares, et des Points à acheter',
        details: ['Quatre flippers différents dans les deux Game Corners : SEEL, GENGAR, MEOWTH, DIGLETT.'],
        source: DOC,
      },
      {
        id: 'wishing-well',
        label: '**Wishing Well** de Rustboro — la gacha à Pokémon',
        location: 'Flanc est de Rustboro City. Un `Wishing Star` par tirage',
        details: ['Un `Wishing Star` traîne au sol près du puits ; une petite fille de Rustboro et un Hiker de Granite Cave en donnent ; un PNJ du Mt. Chimney en vend après le départ de la Team Aqua/Magma.'],
        source: DOC,
      },
      {
        id: 'contests-verdanturf',
        label: 'Contests, désormais à **Verdanturf Town**',
        details: [
          'Le Contest Hall a quitté Lilycove pour être accessible bien plus tôt ; en échange, le Battle Tent de Verdanturf est parti à Lilycove.',
          'Un PNJ du Contest Hall **remet le Sheen à zéro** — impossible dans Emerald vanilla.',
        ],
        source: DOC,
        optional: true,
      },
    ],
  },

  {
    id: 'objets-cles',
    title: 'Objets clés et permanents',
    description:
      'Ceux qui changent la partie et qu’il serait dommage de découvrir en fin de jeu.',
    goals: [
      {
        id: 'shiny-charm-1',
        label: 'Premier `Shiny Charm` — 5 relances',
        location: 'Dans le **PC du joueur**, dès le début de la partie',
        details: ['Il y est dès la première minute : le prendre tout de suite.'],
        source: DOC,
      },
      {
        id: 'shiny-charm-2',
        label: 'Second `Shiny Charm` — les relances **se cumulent**, donc le double',
        location: 'Fortree City : interagir avec **tous les shrines d’est en ouest, dans l’ordre**. Il apparaît dans le dernier, à gauche du Pokémon Center',
        details: ['Un vieil homme dans une des maisons de Fortree donne l’indice.'],
        source: DOC,
      },
      {
        id: 'pokemon-box-link',
        label: '`Pokémon Box Link` — accès au PC de n’importe où',
        location: 'Scientist du Pokémon Center de **Slateport**, **après avoir battu Wattson**',
        source: DOC,
      },
      {
        id: 'ss-tidal-ticket',
        label: '`S.S. Tidal Ticket`',
        location: 'Le **Sailor au bandeau** de Mossdeep, après le **7e Gym** *(v3.0)*',
        source: DOC,
      },
      {
        id: 'z-power-ring',
        label: '`Z-Power Ring` et Z-Crystals',
        location: 'DEVON Corporation, après avoir livré la lettre de Steven',
        details: ['**Entièrement optionnel et à l’écart** : l’auteur précise que qui n’aime pas les Z-Moves peut ne jamais aller le chercher.'],
        source: DOC,
        optional: true,
      },
    ],
  },

  {
    id: 'objets-evolution',
    title: 'Objets d’évolution hors emplacement vanilla',
    description:
      'Ceux que ce hack a déplacés ou ajoutés. Un objet absent de cette liste est probablement à sa place habituelle dans Emerald. **Filet de sécurité** : un stand de Sootopolis City, au nord du Pokémon Center, vend *tous* les objets d’évolution en fin de partie.',
    goals: [
      { id: 'stones-slateport', label: '`Water Stone`, `Thunder Stone`, `Fire Stone`, `Sun Stone`, `Moon Stone`', location: 'Marché de Slateport City', source: DOC },
      { id: 'stones-lavaridge', label: '`Leaf Stone`, `Ice Stone`, `Dawn Stone`, `Dusk Stone`, `Shiny Stone`', location: 'Herb Shop de Lavaridge Town', source: DOC },
      { id: 'kings-rock', label: '`King’s Rock`', location: 'Route 106, juste au-dessus de l’entrée de Granite Cave', source: DOC },
      { id: 'dragon-scale', label: '`Dragon Scale`', location: 'Route 118', source: DOC },
      { id: 'upgrade', label: '`Upgrade`', location: 'Weather Institute, Route 119', source: DOC },
      { id: 'dubious-disc', label: '`Dubious Disc`', location: 'Team Aqua Hideout', source: DOC },
      { id: 'metal-coat', label: '`Metal Coat`', location: 'Rusturf Tunnel et Abandoned Ship', source: DOC },
      { id: 'razor-fang', label: '`Razor Fang`', location: 'Route 119', source: DOC },
      { id: 'razor-claw', label: '`Razor Claw`', location: 'Route 121', source: DOC },
      { id: 'black-augurite', label: '`Black Augurite` — pour Kleavor', location: 'Route 119', source: DOC },
      { id: 'peat-block', label: '`Peat Block` — pour Ursaluna', location: 'Péninsule sud de Lilycove', source: DOC },
      { id: 'prism-scale', label: '`Prism Scale` — pour Milotic', location: 'Route 127. 140 de Beauty en concours reste l’autre voie', source: DOC },
      { id: 'electirizer', label: '`Electirizer` — pour Electivire', location: 'New Mauville, **à la place de l’`Ultra Ball`** posée au sol *(ajouté en v3.0)*', source: DOC },
      { id: 'magmarizer', label: '`Magmarizer` — pour Magmortar', location: 'Jagged Pass, **à la place du `Burn Heal`** posé au sol *(ajouté en v3.0)*', source: DOC },
      { id: 'pommes-applin', label: '`Tart Apple`, `Sweet Apple`, `Candy Apple`', location: 'Vendeur de pommes de Pacifidlog Town', source: DOC },
      { id: 'stand-sootopolis', label: '**Tous** les objets d’évolution, au même endroit', location: 'Stand de Sootopolis City, au nord du Pokémon Center', source: DOC },
    ],
  },

  {
    id: 'pokedex',
    title: 'Pokédex — les jalons',
    description:
      'Les **421 entrées** couvrent l’intégralité des générations 1 à 3, plus leurs évolutions cross-gen jusqu’à la Gen 9 (Weavile, Annihilape, Kleavor, Ursaluna, Farigiraf…). Pas de case par espèce ici : le Pokédex du jeu, refait sur le modèle de HGSS, le fait mieux — avec les méthodes d’évolution et les movesets.',
    goals: [
      {
        id: 'dex-50',
        label: '**50 espèces** différentes — débloque Spiky-Ear Pichu chez Professor Elm',
        location: 'Fallarbor Town',
        details: ['Le seul palier du dex qui ouvre du contenu.'],
        source: DOC,
      },
      { id: 'dex-rhydon', label: 'Entrée de **Rhydon** — condition de l’`Old Sea Map` (Mew)', source: DOC },
      { id: 'dex-octillery', label: 'Entrée d’**Octillery** — condition du `Mystic Ticket` (Ho-oh, Lugia)', source: DOC },
      { id: 'dex-rayquaza', label: 'Entrée de **Rayquaza** — condition de l’`Aurora Ticket` (Deoxys)', source: DOC },
      {
        id: 'dex-complet',
        label: 'Les **421 entrées**',
        details: [
          'Toutes les espèces gen 1-3 sont obtenables, réparties « spread out enough to keep it from feeling bloated ».',
          'Le Scuba Safari de Pacifidlog et le DexNav sont les deux voies qui ouvrent le plus d’espèces.',
        ],
        source: DOC,
        optional: true,
      },
    ],
  },

  {
    id: 'post-game',
    title: 'Post-game',
    description:
      '⚠️ **Le plus incertain de cette page.** La doc de l’auteur ne décrit pas le post-game : elle confirme seulement que la Battle Frontier existe. Le reste est à découvrir en jeu — rien n’a été recopié d’un walkthrough d’Emerald.',
    goals: [
      {
        id: 'battle-frontier',
        label: '**Battle Frontier** — installations et conditions d’accès à relever en jeu',
        details: [
          'Confirmé comme présent : la v3.0 crédite des sprites de **Frontier Brain**, et les versions antérieures signalaient ses bâtiments dans les bugs connus.',
          'Ni la liste des installations ni les conditions d’accès ne sont documentées — à compléter au fil de la partie plutôt que devinées.',
        ],
        source: DOC,
      },
      {
        id: 'battle-tent-lilycove',
        label: '**Battle Tent** de Lilycove',
        details: [
          'Déplacé de Verdanturf à Lilycove, en échange du Contest Hall parti dans l’autre sens.',
          'Il était **désactivé** avant la v3.0 — Pokémon loués transformés en `BAD EGG`, entrée bloquée par un PNJ. La v3.0 ne liste plus ce bug : à considérer comme corrigé, et à confirmer en y entrant.',
        ],
        source: DOC,
        optional: true,
      },
      {
        id: 'latios-latias-roaming',
        label: 'Latios/Latias **errants**, après le Elite Four',
        details: ['La table du dex les décrit comme « roaming after Elite Four ». Rebattre le Elite Four **relance le tirage** de celui qui apparaît sur Southern Island *(v3.0)* — c’est la voie pour obtenir les deux.'],
        source: DOC,
        optional: true,
      },
      {
        id: 'reset-trios',
        label: 'Rebattre le Elite Four pour **relancer les deux trios**',
        details: ['C’est la voie pour obtenir les six membres de Raikou/Entei/Suicune et Articuno/Zapdos/Moltres.'],
        source: DOC,
      },
    ],
  },
]

export const completionGoalKeys = completionSections.flatMap(section =>
  section.goals.map(goal => `goal:${goal.id}`),
)
