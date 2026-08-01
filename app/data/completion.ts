import type { CompletionSection } from './types'

/**
 * Complétion post-game.
 *
 * Deux origines, distinguées par le champ `source` de chaque objectif :
 *
 * - le **guide**, pour ce qu'il mentionne sans le rendre cochable (§9.1 les
 *   ramassages gratuits, §2.4 les voies vers les talents cachés, §0.1 et §6.7-C
 *   les deux tests qu'il demande de faire en jeu) ;
 * - le **jeu**, pour tout ce que le guide n'inventorie pas — il vise la Frontier,
 *   pas la complétion. Ces entrées portent l'URL consultée : rien n'est écrit ici
 *   qui n'ait été lu sur unboundwiki.com (règle « ne pas deviner de données
 *   Pokémon » ; §12 a déjà perdu trois quêtes faute de vérification).
 *
 * Ce sont des ressources cochées sous `goal:<id>`, pas des tâches : elles ne
 * pèsent ni sur la progression de la roadmap ni sur les prochaines actions.
 * Ce cloisonnement est le point : ajouter 70 objectifs à la roadmap ferait
 * s'effondrer le pourcentage d'une partie en cours.
 *
 * Ce fichier ne double jamais une tâche existante. L'accès à la Frontier est
 * `phase-5.4`, l'échange Hard Stones → Gems est `quest:as-hard-as-they-come`,
 * le farm de ressources est `phase-2.1` à `2.7` : rien de tout ça n'est repris.
 */

const WIKI = 'https://unboundwiki.com'

export const completionSections: CompletionSection[] = [
  /* ----------------------------------------------------------------------- *
   * La Black Trainer Card sert de cadre : c'est la seule définition de
   * « fini » que le jeu lui-même donne.
   * ----------------------------------------------------------------------- */
  {
    id: 'carte-noire',
    title: 'Black Trainer Card',
    description:
      'La seule définition de « post-game terminé » que le jeu donne : cinq étoiles, dans n’importe quel ordre. Elle débloque le niveau maximum du Stat Scanner. La cinquième étoile — tous les Gold Prints — se coche dans la section suivante.',
    goals: [
      {
        id: 'carte-noire-champion',
        label: 'Battre le Conseil 4 et devenir **Champion**',
        details: ['Première étoile, et prérequis de presque tout le reste de cette page.'],
        source: `${WIKI}/extras/black-trainer-card/`,
      },
      {
        id: 'carte-noire-missions',
        label: 'Terminer **les 84 missions** du jeu',
        details: [
          'Les 84 sont inventoriées et cochables une à une dans la section **Missions** — c’est la case qui les résume.',
          '**27 d’entre elles** ne s’ouvrent qu’après la Ligue.',
          'Battre **Aklove** dans les Depths of the Ruins of Void (deuxième générique) fait afficher à l’écran des missions la position de celles qui restent.',
        ],
        source: `${WIKI}/missions/`,
      },
      {
        id: 'carte-noire-pokedex',
        label: 'Compléter le **National Pokédex**',
        details: [
          'La Safari Zone (est de Polder Town, 500 $ la partie) est le seul moyen d’obtenir certaines espèces.',
        ],
        source: `${WIKI}/extras/safari-zone/`,
      },
      {
        id: 'ring-challenge-100',
        label: '**Ring Challenge** d’Antisis City : série de **100 victoires**',
        details: [
          'Combats en Singles, tout ramené au **niveau 50** — le §13.0 du guide s’applique donc : les IV et EV y pèsent proportionnellement autant qu’au niveau 100.',
          'Un dresseur spécial tous les 10 combats ; **Big Mo** aux 20ᵉ, 50ᵉ et 100ᵉ.',
        ],
        location: 'Antisis City — l’ancien Gym, rouvert par Big Mo après sa défaite',
        reward: 'Une étoile de la Black Trainer Card',
        source: 'https://pokemonunbound.miraheze.org/wiki/Ring_Challenge',
      },
    ],
  },

  /* ----------------------------------------------------------------------- *
   * L'accès (barrière nord de Seaport + Frontier Card) est déjà `phase-5.4`,
   * et « viser un Gold Print par bâtiment » est `phase-5.3`. Ici, chaque
   * bâtiment devient une case : c'est le grain qui manque à la roadmap.
   * ----------------------------------------------------------------------- */
  {
    id: 'battle-frontier',
    title: 'Battle Frontier — Prints',
    description:
      'Quatre bâtiments, quatre Frontier Brains. Le Brain se présente à la 20ᵉ victoire consécutive (Silver Print) puis à la 50ᵉ (Gold Print), dans une même série. L’accès et la Frontier Card sont la tâche 5.4 de la roadmap.',
    goals: [
      {
        id: 'silver-print-battle-tower',
        label: '**Battle Tower** — Silver Print (20 victoires d’affilée, **Palmer**)',
        details: ['Le format le plus lisible : du combat pur. C’est par là que §10.3 conseille de commencer.'],
        source: 'https://pokemonunbound.miraheze.org/wiki/Battle_Tower',
      },
      {
        id: 'gold-print-battle-tower',
        label: '**Battle Tower** — Gold Print (50 victoires d’affilée)',
        source: 'https://pokemonunbound.miraheze.org/wiki/Battle_Tower',
      },
      {
        id: 'silver-print-battle-circus',
        label: '**Battle Circus** — Silver Print (20 victoires d’affilée, **Paula**)',
        details: ['C’est aussi là que se trouve l’Ability Change Clown, le PNJ qui change de talent contre des BP.'],
        source: `${WIKI}/locations/battle-frontier/`,
      },
      {
        id: 'gold-print-battle-circus',
        label: '**Battle Circus** — Gold Print (50 victoires d’affilée)',
        source: `${WIKI}/locations/battle-frontier/`,
      },
      {
        id: 'silver-print-battle-sands',
        label: '**Battle Sands** — Silver Print (20 victoires d’affilée, **Patroz**)',
        details: [
          'Le seul bâtiment qui n’en est pas un : une fosse de sable à l’angle sud-ouest de la Frontier, derrière le Battle Circus.',
        ],
        source: 'https://pokemonunbound.miraheze.org/wiki/Battle_Sands',
      },
      {
        id: 'gold-print-battle-sands',
        label: '**Battle Sands** — Gold Print (50 victoires d’affilée)',
        source: 'https://pokemonunbound.miraheze.org/wiki/Battle_Sands',
      },
      {
        id: 'silver-print-battle-mine',
        label: '**Battle Mine** — Silver Print (20 victoires d’affilée, **Pablo**)',
        source: `${WIKI}/locations/battle-frontier/`,
      },
      {
        id: 'gold-print-battle-mine',
        label: '**Battle Mine** — Gold Print (50 victoires d’affilée)',
        details: ['Les quatre Gold Prints réunis valent la cinquième étoile de la Black Trainer Card.'],
        source: `${WIKI}/extras/black-trainer-card/`,
      },
    ],
  },

  /* ----------------------------------------------------------------------- *
   * §12 modélise la mission #050 comme une seule case, parce que le guide ne
   * s'y intéresse que pour la Tyranitarite. Elle ouvre en réalité vingt
   * rencontres — c'est le gros du post-game.
   * ----------------------------------------------------------------------- */
  {
    id: 'portails',
    title: 'Portal Purge — les légendaires des portails',
    description:
      'La mission **#050** ouvre ces rencontres à travers la carte — elle est cochable en une fois dans la liste des missions ; voici ce qu’elle donne réellement. L’heure compte : plusieurs n’apparaissent que de jour ou que de nuit. ⚠️ Le wiki se contredit : la fiche de la mission annonce **25** Portal Pokémon, sa liste des légendaires n’en énumère que **23** — les 23 vérifiés sont ici, les deux autres restent à identifier en jeu.',
    goals: [
      { id: 'portail-blacephalon', label: '**Blacephalon**', location: 'Magnolia Fields — la nuit', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-celesteela', label: '**Celesteela**', location: 'Crater Town — la nuit', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-guzzlord', label: '**Guzzlord**', location: 'Antisis Sewers — la nuit', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-necrozma', label: '**Necrozma**', location: 'Frost Mountain — la nuit', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-xurkitree', label: '**Xurkitree**', location: 'Thundercap Mountain 2F — la nuit', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-yveltal', label: '**Yveltal**', location: 'Crystal Cave B1F — la nuit', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-zekrom', label: '**Zekrom**', location: 'Crystal Peak — la nuit', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-buzzwole', label: '**Buzzwole**', location: 'Route 4 — le jour', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-kartana', label: '**Kartana**', location: 'Vivill Woods — le jour', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-pheromosa', label: '**Pheromosa**', location: 'Great Desert — le jour', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-reshiram', label: '**Reshiram**', location: 'Crystal Peak 3F — le jour', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-stakataka', label: '**Stakataka**', location: 'Route 7 — le jour', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-xerneas', label: '**Xerneas**', location: 'Redwood Forest — le jour', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-nihilego', label: '**Nihilego**', location: 'Route 14 — la nuit', source: `${WIKI}/extras/legendary-pokemon/` },
      {
        id: 'portail-eternal-floette',
        label: '**Eternal Floette**',
        details: ['§9.1 la donne comme porteuse des Choice Specs via un code cadeau — ici, c’est l’espèce elle-même.'],
        location: 'Vivill Warehouse, sous-sol',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      { id: 'portail-ho-oh', label: '**Ho-Oh**', location: 'Ruins of Void', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-lugia', label: '**Lugia**', location: 'Ruins of Void', source: `${WIKI}/extras/legendary-pokemon/` },
      {
        id: 'portail-lunala',
        label: '**Lunala**',
        details: ['S’obtient aussi en faisant évoluer **Cosmoem** de nuit — le portail n’est pas la seule voie.'],
        location: 'Route 12 — la plage',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      {
        id: 'portail-solgaleo',
        label: '**Solgaleo**',
        details: ['S’obtient aussi en faisant évoluer **Cosmoem** de jour.'],
        location: 'Route 12 — la plage',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      { id: 'portail-tapu-koko', label: '**Tapu Koko**', location: 'Route 11', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-tapu-lele', label: '**Tapu Lele**', location: 'Route 17', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-tapu-bulu', label: '**Tapu Bulu**', location: 'Route 9', source: `${WIKI}/extras/legendary-pokemon/` },
      { id: 'portail-tapu-fini', label: '**Tapu Fini**', location: 'Route 2', source: `${WIKI}/extras/legendary-pokemon/` },
    ],
  },

  {
    id: 'legendaires-hors-portails',
    title: 'Légendaires — hors portails',
    description:
      'Ceux qui tiennent à une mission, à un orbe ou à une rencontre errante. La Dream Ball du Dream Research Lab est ici la meilleure méthode : elle capture avec le talent caché, et un légendaire ne s’élève pas (§2.4).',
    goals: [
      {
        id: 'legendaire-mew',
        label: '**Mew** — récompense de la mission *Darwin Was Right*',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      {
        id: 'legendaire-victini',
        label: '**Victini** — mission **#025**',
        location: 'Seaport Battleground',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      {
        id: 'legendaire-guardians-of-the-lake',
        label: '**Azelf, Mesprit, Uxie et Dialga** — mission **#027** *Guardians of the Lake*',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      {
        id: 'legendaire-rayquaza',
        label: '**Rayquaza** — nécessite le **Jade Orb**',
        location: 'Crystal Peak',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      {
        id: 'legendaire-groudon',
        label: '**Groudon** — nécessite le **Red Orb**',
        details: [
          'Le Red Orb et le Blue Orb s’obtiennent en battant **Vega** au Battleground certains jours, puis se récupèrent au Gym de Crater Town.',
        ],
        location: 'Cinder Volcano B2F',
        source: `${WIKI}/mega-stones/`,
      },
      {
        id: 'legendaire-kyogre',
        label: '**Kyogre** — nécessite le **Blue Orb**',
        location: 'Vivill Warehouse, sous l’eau',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      {
        id: 'legendaire-entei-raikou',
        label: '**Entei** et **Raikou** — errants, après avoir interagi avec le portail du *Tomb of Borrius*',
        details: ['Ce portail-là n’appartient pas à la mission #050 : les deux ne comptent pas dans les Portal Pokémon.'],
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      {
        id: 'legendaire-giratina',
        label: '**Giratina** — par le portail de la **Rift Cave**',
        details: ['Là encore un portail hors mission #050.'],
        location: 'Distortion World',
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
      {
        id: 'legendaire-thundurus-tornadus',
        label: '**Thundurus** et **Tornadus** — errants, après les avoir battus à Magnolia Fields',
        details: [
          'Les battre arrête aussi la pluie éternelle de Magnolia Town, ce qui ouvre le Magnolia Café.',
        ],
        source: `${WIKI}/extras/magnolia-cafe/`,
      },
      {
        id: 'legendaire-latias-latios',
        label: '**Latias** / **Latios** — errants, l’espèce disponible dépend du genre du personnage',
        details: ['La mission **#042** donne la Latiasite / Latiosite correspondante.'],
        source: `${WIKI}/extras/legendary-pokemon/`,
      },
    ],
  },

  {
    id: 'mega-stones',
    title: 'Mega Stones à fabriquer ou à récupérer',
    description:
      'Le guide ne s’intéresse qu’à la Tyranitarite (#050) et à la Sceptilite. Les trois Mega Stones de starter Hoenn se fabriquent à Cube Corp. contre 5 Gems du type — et l’échange qui fournit les Gems est la mission #010, déjà cochable dans Ressources.',
    goals: [
      {
        id: 'sceptilite',
        label: '**Sceptilite** — Mega Stone Maker de **Cube Corp.**, contre **5 Grass Gems**',
        details: [
          'Les Gems viennent de l’échange 20 Hard Stones → 1 Gem de Gurun Town, débloqué par la mission #010 (voir Ressources).',
          'Rappel §0.5 : un seul Pokémon Mega-évolue par combat, et §7.3 tranche pour Mega-Tyranitar.',
        ],
        location: 'Cube Corp.',
        source: `${WIKI}/mega-stones/`,
      },
      {
        id: 'blazikenite',
        label: '**Blazikenite** — Cube Corp., contre **5 Fire Gems**',
        location: 'Cube Corp.',
        source: `${WIKI}/mega-stones/`,
        optional: true,
      },
      {
        id: 'swampertite',
        label: '**Swampertite** — Cube Corp., contre **5 Water Gems**',
        location: 'Cube Corp.',
        source: `${WIKI}/mega-stones/`,
        optional: true,
      },
      {
        id: 'blastoisinite',
        label: '**Blastoisinite** — Cathy, au **Magnolia Café**',
        details: ['Le Café n’ouvre qu’une fois la pluie éternelle de Magnolia Town arrêtée (Tornadus et Thundurus battus).'],
        location: 'Magnolia Café — **lundi**, 14 h – 16 h 59',
        source: `${WIKI}/extras/magnolia-cafe/`,
        optional: true,
      },
      {
        id: 'charizardite-y',
        label: '**Charizardite Y** — Abimbola, au **Magnolia Café**',
        location: 'Magnolia Café — **mardi**, 17 h – 19 h 59',
        source: `${WIKI}/extras/magnolia-cafe/`,
        optional: true,
      },
      {
        id: 'venusaurite',
        label: '**Venusaurite** — Mahina, au **Magnolia Café**',
        location: 'Magnolia Café — **jeudi**, 14 h – 16 h 59',
        source: `${WIKI}/extras/magnolia-cafe/`,
        optional: true,
      },
      {
        id: 'altarianite',
        label: '**Altarianite** — récompense de **Successor Maxima**, au Tarmigan Mansion',
        details: [
          'Le même combat que `phase-0.6` : le battre est le prérequis de toute Mega-évolution. La Mega Stone, elle, est un bonus qu’il faut penser à récupérer.',
        ],
        source: `${WIKI}/mega-stones/`,
        optional: true,
      },
    ],
  },

  /* ----------------------------------------------------------------------- *
   * Partie A — le guide, rendu cochable.
   * ----------------------------------------------------------------------- */
  {
    id: 'objets-du-monde',
    title: 'Objets à ramasser plutôt qu’à acheter',
    description:
      '§9.1 donne pour chaque objet de combat un prix en BP et un exemplaire gratuit posé quelque part sur la carte. Ramasser celui-là, c’est autant de BP gardés pour les objets Choice, qui n’ont pas d’alternative. Les emplacements ont été recoupés sur le wiki.',
    goals: [
      {
        id: 'objet-heavy-duty-boots',
        label: '**Heavy-Duty Boots** — l’objet de Togekiss (§6.3), sinon 48 BP',
        location: 'Cootes Bog, au nord-est de Ranger Betty',
        source: `${WIKI}/items/held-items/`,
      },
      {
        id: 'objet-choice-scarf',
        label: '**Choice Scarf** — sinon 48 BP',
        location: 'Crystal Peak 1F, dans la salle qui mène à Cube Corp.',
        source: `${WIKI}/items/held-items/`,
      },
      {
        id: 'objet-focus-sash',
        label: '**Focus Sash** — l’objet du build B de Tyranitar (§6.1), sinon 32 BP',
        location: 'Route 18, dans le sable à côté du pêcheur',
        source: `${WIKI}/items/held-items/`,
      },
      {
        id: 'objet-assault-vest',
        label: '**Assault Vest** — sinon 48 BP',
        location: 'Antisis Port',
        source: `${WIKI}/items/held-items/`,
      },
      {
        id: 'objet-rocky-helmet',
        label: '**Rocky Helmet** — l’objet de Flagadoss en §7.3, sinon 48 BP',
        location: 'Epidimy Town — un PNJ, dans la maison près de l’entrée du KBT Expressway',
        source: `${WIKI}/items/held-items/`,
      },
      {
        id: 'objet-white-herb',
        label: '**White Herb** — sinon 24 BP',
        location: 'Frost Mountain 2F, au nord de Hiker Eric',
        source: `${WIKI}/items/held-items/`,
      },
      {
        id: 'objet-smooth-rock',
        label: '**Smooth Rock** — sable de 5 à 8 tours, pour Tyranitar (§6.1)',
        details: ['Aucun prix en BP : ramassage ou minage ADM, il n’y a pas d’autre voie.'],
        location: 'Great Desert, au nord de Roughneck Cameron — ou minage ADM',
        source: `${WIKI}/items/held-items/`,
      },
      {
        id: 'objet-toxic-orb',
        label: '**Toxic Orb** — indispensable au combo Poison Heal de Scorvol (§6.6), sinon 16 BP',
        location: 'Valley Cave, à l’ouest de Black Belt Hitoshi',
        source: `${WIKI}/items/held-items/`,
      },
      {
        id: 'objet-razor-fang',
        label: '**Razor Fang** — sans lui, Gligar n’évolue pas (§6.6)',
        details: ['L’évolution demande de tenir l’objet **et** de monter d’un niveau **la nuit**.'],
        location: 'Valley Cave B1F, derrière un rocher cassable — aussi Victory Road, ou 48 BP',
        source: '§6.6',
      },
      {
        id: 'objet-power-lens',
        label: '**Power Lens** — le seul Power item qui ne vienne pas d’une mission (§1.5)',
        location: 'Vivill Warehouse B5F, lors du combat contre Aklove',
        source: `${WIKI}/items/held-items/`,
      },
    ],
  },

  {
    id: 'talents-caches',
    title: 'Talents cachés — les accès à débloquer',
    description:
      '§2.4 est formel : l’Ability Patch n’existe pas dans Unbound. Un talent caché passe forcément par une Dream Ball ou une Dream Mist, et les deux se prennent à Tarmigan Town. Flagadoss (Regenerator) et Scorvol (Poison Heal) en dépendent tous les deux.',
    goals: [
      {
        id: 'dream-research-lab',
        label: 'Débloquer le **Dream Research Lab** de Tarmigan Town — **3 Dream Balls par jour**',
        details: [
          'Ouvre après la Ligue, et se renouvelle tous les jours : c’est la voie la plus simple, la capture donne directement le talent caché.',
          'C’est aussi la meilleure méthode pour un légendaire, qui ne s’élève pas.',
        ],
        location: 'Tarmigan Town — le scientifique le plus à l’est du labo',
        source: `${WIKI}/extras/daily-events/`,
      },
      {
        id: 'dream-mist-offerte',
        label: 'Récupérer la **Dream Mist offerte** par le scientifique devant le Research Center',
        details: ['Une seule, gratuite. À réserver à un Pokémon déjà capturé qu’on ne veut pas recapturer.'],
        location: 'Tarmigan Town, devant le Research Center',
        source: '§2.4',
      },
      {
        id: 'raid-musharna',
        label: 'Faire le **raid Musharna 5/6★** — ~50 % de chances de Dream Mist',
        details: [
          'Accès par la sortie est du Tarmigan Mansion, puis un interrupteur secret.',
          'Les raids 5–6★ ne se débloquent qu’après le Conseil 4 ; ils lâchent aussi des Bottle Caps (§2.1).',
        ],
        location: 'Tarmigan Town',
        source: '§2.4',
      },
      {
        id: 'ability-change-clown',
        label: 'Repérer l’**Ability Changer** (Ability Change Clown), côté Battle Circus',
        details: ['Il alterne les talents contre des BP — il ne donne pas le talent caché, contrairement à la Dream Mist.'],
        location: 'Battle Frontier — Battle Circus',
        source: `${WIKI}/locations/battle-frontier/`,
      },
    ],
  },

  {
    id: 'game-corner',
    title: 'Cloud Game Corner — les objets à jetons',
    description:
      '§9.1 est net sur l’arbitrage : la Life Orb et les Leftovers coûtent bien moins cher ici qu’au Battle Tower. Les BP se gardent pour les objets Choice, qui n’y sont pas vendus. Change : 500 000 $ = 5 000 jetons.',
    goals: [
      {
        id: 'coin-case',
        label: 'Récupérer le **Coin Case** — l’homme qui fait les cent pas devant le Game Corner',
        location: 'Dehara City',
        source: `${WIKI}/extras/cloud-game-corner/`,
      },
      {
        id: 'jetons-leftovers',
        label: '**Leftovers** — 5 000 jetons (contre 48 BP au Battle Tower)',
        details: ['§7.3 signale trois candidats aux Leftovers : certains formats de la Frontier interdisent les objets en double.'],
        source: `${WIKI}/extras/cloud-game-corner/`,
      },
      {
        id: 'jetons-life-orb',
        label: '**Life Orb** — 7 500 jetons (contre 48 BP)',
        source: `${WIKI}/extras/cloud-game-corner/`,
      },
      {
        id: 'jetons-ability-capsule',
        label: '**Ability Capsule** — 8 000 jetons ; c’est elle qui donne Serene Grace à Togekiss (§6.3)',
        details: [
          'La page du Game Corner du wiki la nomme **Ability Pill**, la liste des récompenses hebdomadaires **Ability Capsule** — vérifier le nom exact à l’écran avant d’acheter.',
          'Elle n’alterne que les talents 1 ↔ 2 : elle ne donne **jamais** un talent caché.',
        ],
        source: `${WIKI}/extras/cloud-game-corner/`,
      },
      {
        id: 'jetons-destiny-knot',
        label: '**Destiny Knot** — 500 jetons ; il verrouille 5 IV à l’élevage (§2.1)',
        details: ['Avec le Ditto parfait de la Breeder’s School (`phase-1.7`), il remplace les Bottle Caps pour tout Pokémon élevable.'],
        source: `${WIKI}/extras/cloud-game-corner/`,
      },
      {
        id: 'jetons-air-balloon',
        label: '**Air Balloon** — 3 000 jetons ; l’objet alternatif de Rotom-Wash en §7.3',
        source: `${WIKI}/extras/cloud-game-corner/`,
        optional: true,
      },
      {
        id: 'jetons-weakness-policy',
        label: '**Weakness Policy** — 10 000 jetons',
        source: `${WIKI}/extras/cloud-game-corner/`,
        optional: true,
      },
    ],
  },

  {
    id: 'verifications',
    title: 'À vérifier en jeu',
    description:
      'Deux points sur lesquels le guide dit explicitement qu’il ne sait pas, et propose un protocole. Tant qu’ils ne sont pas tranchés, les sections concernées restent des hypothèses.',
    goals: [
      {
        id: 'test-plafond-vitamines',
        label: 'Le plafond de **100 EV par vitamine** a-t-il sauté ?',
        details: [
          'Protocole du guide : donner **11 Proteins d’affilée** à un Pokémon à 0 EV en Attack, et regarder si le 11ᵉ passe.',
          'Si le plafond tient, les vitamines restent un appoint ; s’il a sauté, elles redeviennent une vraie méthode et §2.2 change.',
        ],
        source: '§0.1',
      },
      {
        id: 'test-synchronize',
        label: '**Synchronize** fonctionne-t-il sur les sauvages dans cette version ?',
        details: [
          'Protocole du guide : mettre en tête un porteur de Synchronize de nature rare, puis faire **5 captures d’affilée** et compter.',
          'S’il marche, c’est 50 000 $ économisés par capture au Nature Changer — le porteur utilitaire de §6.7-C devient rentable tout de suite.',
        ],
        source: '§6.7',
      },
    ],
  },
] satisfies CompletionSection[]

/** Toutes les clés persistées de la page, pour la purge (`knownContent`). */
export const completionGoalKeys = completionSections.flatMap(section =>
  section.goals.map(goal => `goal:${goal.id}` as const),
)
