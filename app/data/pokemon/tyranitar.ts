import type { PokemonSheet } from '../types'

/** Slot 1 — Tyranitar (§6.1) */
export default {
  slug: 'tyranitar',
  sprite: 'tyranitar',
  name: 'Tyranitar',
  slot: 1,
  status: 'active',
  badge: 'Conservé',
  role: 'Poseur de sable / Wallbreaker physique',
  types: ['Rock', 'Dark'],
  baseStats: { hp: 100, atk: 134, def: 110, spa: 95, spd: 100, spe: 61 },
  bst: 600,
  abilities: [
    { name: 'Sand Stream' },
    { name: 'Unnerve' },
  ],
  targetAbility: 'Sand Stream',
  mega: {
    stone: 'Tyranitarite',
    stats: { hp: 100, atk: 164, def: 150, spa: 95, spd: 120, spe: 71 },
    bst: 700,
    note: 'Garde *Sand Stream*. Trouvée au Shadow Base 1F si Embrylex était ton starter, sinon récompense de la mission **#050 « Portal Purge »**.',
  },
  analysis: [
    {
      kind: 'p',
      text: 'C’est ta meilleure pièce brute. *Sand Stream* lui donne **+50 % en SpD sous la tempête de sable**, ce qui en fait un tank spécial gratuit en plus d’un wallbreaker.',
    },
    {
      kind: 'p',
      text: '**MAIS** — et c’est le point que ton guide d’origine a raté : **le sable inflige des dégâts à 4 de tes 5 Pokémon actuels** (Sceptile, Dusknoir, Togekiss, Zeraora — seul Tyranitar y est immunisé). Sur un run de Battle Tower, tu t’infliges 6,25 % par tour à ton équipe entière. Ce n’est pas rédhibitoire, mais ça veut dire une chose :',
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: '**Soit tu construis autour du sable** (ajoute Excadrill / Gigalithe / un Steel), **soit tu joues Tyranitar comme un simple wallbreaker et tu acceptes le chip damage.** L’entre-deux est le pire choix.',
    },
    {
      kind: 'p',
      text: 'Sa **Speed 61** est le second point clé : investir 252 EV en Speed ne le fait dépasser presque personne. Une nature *Jolly* est un gâchis **sauf** si tu joues *Dragon Dance*.',
    },
  ],
  builds: [
    {
      id: 'a',
      name: 'Wallbreaker Choice Band',
      tagline: 'le plus simple, le plus fiable',
      nature: 'Adamant',
      evs: { hp: 252, atk: 252, spd: 4 },
      item: 'Choice Band',
      moves: ['Rock Slide', 'Crunch', 'Earthquake', 'Ice Punch'],
      notes: [
        'Objet : 48 BP au Battle Tower.',
        '*Pourquoi 252 HP et pas 252 Speed :* à 61 de base il ne dépassera rien d’utile ; la masse de HP + le boost SpD du sable en font un mur offensif.',
      ],
      recommended: true,
    },
    {
      id: 'b',
      name: 'Sweeper Dragon Dance',
      tagline: 'plafond plus haut, plus risqué',
      nature: 'Adamant',
      evs: { atk: 252, spe: 252, hp: 4 },
      item: 'Focus Sash',
      moves: ['Dragon Dance', 'Rock Slide', 'Crunch', 'Earthquake'],
      notes: [
        'Nature *Jolly* seulement si tu veux dépasser des cibles précises.',
        'Objet : *Focus Sash* (32 BP) ou **Life Orb**.',
      ],
    },
    {
      id: 'c',
      name: 'Mega Tyranitar',
      tagline: 'le plus fort, mais consomme ton slot Mega',
      nature: 'Adamant',
      evs: { hp: 252, atk: 252, spd: 4 },
      item: 'Tyranitarite',
      moves: ['Dragon Dance', 'Rock Slide', 'Crunch', 'Earthquake'],
      notes: [
        '**Tyranitarite** : trouvée au Shadow Base 1F si Embrylex était ton starter, sinon récompense de la mission **#050 « Portal Purge »**.',
      ],
    },
  ],
  ivGuidance: {
    focus: ['atk', 'hp', 'def', 'spd'],
    ignore: ['spa'],
    note: 'Speed uniquement pour le build B/C. **Ne gaspille pas de cap sur la SpA** — il ne l’utilise jamais.',
  },
  tasks: [
    {
      id: 'mon-tyranitar-1',
      label: 'Choisir le build (A, B ou C) — **ne saute pas cette étape**, tout le reste en dépend',
      priority: 1,
      done: true,
    },
    {
      id: 'mon-tyranitar-2',
      label: 'Lire ses IV/EV actuels (PNJ Frontier)',
      requires: ['mon-tyranitar-1'],
      done: true,
    },
    {
      id: 'mon-tyranitar-3',
      label: 'Purger les EV parasites : toutes les stats sauf celles du build choisi (5 BP/stat)',
      requires: ['mon-tyranitar-2'],
      done: true,
    },
    {
      id: 'mon-tyranitar-4',
      label: 'Changer la nature en **Adamant** (Tehl Town, 50 000 $)',
      requires: ['mon-tyranitar-1'],
      done: true,
    },
    {
      id: 'mon-tyranitar-5',
      label: 'Vérifier son talent : il doit être **Sand Stream**, pas *Unnerve*. Si c’est *Unnerve* → **Ability Capsule** (Game Corner de Dehara)',
      done: true,
    },
    {
      id: 'mon-tyranitar-6',
      label: 'EV : Trainer House de Dresco, dresseur HP + dresseur Attack, avec Power Weight puis Power Bracer',
      requires: ['mon-tyranitar-3'],
      done: true,
    },
    {
      id: 'mon-tyranitar-7',
      label: 'IV : Bottle Caps sur **Attack, HP, Defense, SpD** — **ne gaspille pas de cap sur la SpA** (il ne l’utilise jamais). Speed uniquement pour le build B/C',
      requires: ['mon-tyranitar-2'],
      done: true,
    },
    {
      id: 'mon-tyranitar-8',
      label: 'Moveset : TM *Earthquake* / *Rock Slide* ; **Crunch** via le Move Relearner de **Crater Town** (Heart Scales) si oublié ; *Ice Punch* et **Dragon Dance** via les tuteurs de la Battle Frontier — le Move Relearner ne propose pas *Dragon Dance*',
      requires: ['mon-tyranitar-1'],
      done: true,
    },
    {
      id: 'mon-tyranitar-9',
      label: 'Objet : *Choice Band* (48 BP) / Tyranitarite / *Smooth Rock* — la **Smooth Rock** rallonge le sable à 8 tours (Great Desert, au nord de Cameron, ou minage ADM)',
      requires: ['mon-tyranitar-1'],
      done: true,
    },
    {
      id: 'mon-tyranitar-10',
      label: 'Décider s’il porte le **Stealth Rock** (recommandé : oui, dans le build B ou C)',
      requires: ['mon-tyranitar-1'],
      done: true,
    },
  ],
} satisfies PokemonSheet
