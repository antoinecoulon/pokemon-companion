import type { Npc } from './types'

// §8 — PNJ indispensables du postgame.

export const npcs: Npc[] = [
  {
    id: 'advanced-stat-scanner',
    service: 'Advanced Stat Scanner',
    location: '**Frozen Heights** — laboratoire, assistant du Prof. Log',
    cost: 'Gratuit',
    priority: 5,
    note: 'à faire en tout premier'
  },
  {
    id: 'marche-de-baies-reduction-ev',
    service: 'Marché de baies (réduction EV)',
    location: '**Fallshore City** — marché en plein air',
    cost: 'Argent (10 EV retirés/baie)',
    priority: 5
  },
  {
    id: 'iv-changer-hyper-training',
    service: 'IV Changer (Hyper Training)',
    location: '**Seaport City** — est du Centre Pokémon, escaliers près de l’entrée KBT, puis plein sud, devant l’entrepôt',
    cost: '1 Bottle Cap (1 stat) / 1 Gold Bottle Cap (6 stats)',
    priority: 5
  },
  {
    id: 'ev-changer-lecteur-iv-ev',
    service: 'EV Changer + lecteur IV/EV',
    location: '**Battle Frontier** — stand en haut à droite (Black Belt)',
    cost: 'Purge 5 BP/stat · Max 50 BP/stat · Lecture gratuite',
    priority: 5
  },
  {
    id: 'nature-changer-1',
    service: 'Nature Changer #1',
    location: '**Tehl Town** — maison au sud-ouest du Centre Pokémon (après mission #053)',
    cost: '1er gratuit, puis 50 000 $',
    priority: 5
  },
  {
    id: 'nature-changer-2',
    service: 'Nature Changer #2',
    location: '**Battle Frontier** — stand en haut à gauche',
    cost: '50 BP (⚠️ remet le bonheur à 0)',
    priority: 3
  },
  {
    id: 'move-relearner',
    service: 'Move Relearner',
    location: '**Crater Town** — maison au sud du Centre Pokémon',
    cost: 'Écailles Cœur',
    priority: 5
  },
  {
    id: 'move-deleter',
    service: 'Move Deleter',
    location: '**Epidimy Town** — maison au nord-ouest du Centre Pokémon',
    cost: 'Gratuit',
    priority: 3
  },
  {
    id: 'egg-move-tutor',
    service: 'Egg Move Tutor',
    location: '**Battle Frontier** — stand à l’ouest de l’entrée',
    cost: 'BP',
    priority: 4
  },
  {
    id: 'egg-move-transfer-tutor',
    service: 'Egg Move Transfer Tutor',
    location: '**Garderie (Day Care Center)**',
    cost: '—',
    priority: 3
  },
  {
    id: 'hidden-power-changer',
    service: 'Hidden Power Changer',
    location: '**Battle Frontier** — stand au sud du bâtiment principal',
    cost: 'BP',
    priority: 3
  },
  {
    id: 'ability-changer',
    service: 'Ability Changer',
    location: '**Battle Frontier** — côté Battle Circus',
    cost: 'BP',
    priority: 4
  },
  {
    id: 'ameliorateur-objets-pouvoir',
    service: 'Améliorateur objets Pouvoir',
    location: 'Maître de Karaté près d’**Antisis City**, côté Thundercap Mountain',
    cost: 'Morceaux d’Étoile',
    priority: 4
  },
  {
    id: 'macho-brace-ameliorations-10-ev',
    service: 'Macho Brace + améliorations (×10 EV)',
    location: 'Maître de Karaté, **ouest de Fallshore / Route 10**, bord sud de la carte, **Surf requis**. En Expert/Insane : **bord est de Crater Town** (l’objet est déjà dans ton sac au départ)',
    cost: 'Pierres Stase (minage KBT Expressway)',
    priority: 5
  },
  {
    id: 'breeders-school-metamorph-iv-max',
    service: 'Breeder’s School (Métamorph IV max)',
    location: '**Seaport City** — après ses quêtes',
    cost: '—',
    priority: 4
  },
  {
    // Id en ASCII : il sert de clé de sauvegarde (`npc:…`) depuis la v2.
    id: 'ameliorateur-oeuf-chance',
    service: 'Améliorateur Œuf Chance',
    location: '**Fallshore City** — Mission HQ (après mission #020)',
    cost: 'Grosses Perles',
    priority: 4
  },
  {
    id: 'ameliorateur-amulet-coin',
    service: 'Améliorateur Amulet Coin',
    location: 'Centre de **Tehl Town** (montrer Regigigas)',
    cost: 'Grosses Pépites',
    priority: 4
  },
  {
    id: 'mega-stone-maker',
    service: 'Mega Stone Maker',
    location: '**Cube Corp.**',
    cost: '5 Gemmes du type',
    priority: 4
  },
  {
    id: 'pierres-dures-gemmes',
    service: 'Pierres Dures → Gemmes',
    location: '**Gurun Town** — maison derrière le Centre Pokémon (après mission #010)',
    cost: '20 Pierres Dures = 1 Gemme',
    priority: 4
  },
  {
    id: 'shady-guy',
    service: 'Shady Guy',
    location: 'Devant la Battle Frontier, entre minuit et 4 h 49',
    cost: 'BP',
    priority: 2
  }
] satisfies Npc[]
