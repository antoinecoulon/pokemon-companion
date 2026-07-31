import type { PokemonSheet } from '../types'

/** Slot 6 — Scorvol (§6.6) */
export default {
  slug: 'scorvol',
  name: 'Gliscor',
  sprite: 'gliscor',
  slot: 6,
  status: 'active',
  badge: 'Nouveau',
  role: 'Mur physique / Stealth Rock / Poison Heal',
  types: ['Ground', 'Flying'],
  baseStats: { hp: 75, atk: 95, def: 125, spa: 45, spd: 75, spe: 95 },
  bst: 510,
  abilities: [
    { name: 'Hyper Cutter' },
    { name: 'Sand Veil' },
    { name: 'Poison Heal', hidden: true },
  ],
  targetAbility: 'Poison Heal',
  obtention: '**Gligar à Valley Cave** (+ Repaire de Raid de Valley Cave 3★), évolue en tenant un **Razor Fang** et en montant de niveau **la nuit**. Gliscor s’obtient aussi directement au **Repaire de Raid de Valley Cave (4-5★)**. Razor Fang : Valley Cave B1F (zone centrale, derrière un rocher cassable), Victory Road, ou **48 BP** au comptoir d’échange de la Battle Frontier. 5 % sur les Bruxish sauvages.',
  analysis: [
    {
      kind: 'p',
      text: 'Gliscor est le seul Pokémon de la liste qui coche **quatre cases d’un coup** :',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Immunisé au sable** (type Ground) — il ne subit pas ton propre Tyranitar',
        '**Immunisé au Ground** (type Flying) — troisième immunité Ground de l’équipe, Tyranitar peut switcher librement',
        '**Immunisé à l’Electric** (type Ground) — couvre la faiblesse ×2 de Togekiss',
        '**Résiste au Fighting** — seconde résistance après Flagadoss, sur le trou n°1 de ton équipe',
      ],
    },
    {
      kind: 'p',
      text: 'Ajoute **Poison Heal + Toxic Orb** : il récupère **1/8 de ses HP max par tour**, est immunisé à tous les autres statuts (brûlure, paralysie, sommeil), et se soigne encore avec **Roost**. C’est un mur physique qui ne meurt pas, et il pose ton **Stealth Rock** — ce qui libère Tyranitar d’avoir à le faire.',
    },
    {
      kind: 'p',
      text: '**Le combo à connaître :** sous *Poison Heal*, Gliscor est empoisonné en permanence. **Facade** double sa puissance quand le lanceur a un statut → **140 de puissance** avec 95 d’Attaque, sans recul et sans baisse de stat. C’est son meilleur STAB de secours à côté de *Earthquake*.',
    },
    {
      kind: 'p',
      text: '**Ses défauts, sans détour :**',
    },
    {
      kind: 'list',
      items: [
        '**Ice ×4.** Un seul *Ice Beam* le sort du combat. C’est sa faiblesse rédhibitoire, et elle chevauche mal avec Togekiss (Ice ×2). Slowbro résiste à l’Ice : c’est ton switch.',
        '**Water ×2**, qui s’empile avec Tyranitar et Excadrill. Là encore, Slowbro couvre.',
        '**SpA 45** — c’est un attaquant purement physique. Il ne règle pas ta monoculture, il règle ta défense.',
        '**Poison Heal est un talent caché** → Dream Mist ou Dream Ball obligatoires.',
      ],
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: '**Sand Veil donne 20 % d’esquive sous le sable — n’y touche pas.** Certains formats de la Battle Frontier bannissent les talents et objets d’esquive, et l’esquive est de toute façon une source de frustration. **Poison Heal est le seul talent qui vaut le coup ici.**',
    },
  ],
  builds: [
    {
      id: 'mur-hazards',
      name: 'Mur physique / Poseur de hazards',
      nature: 'Impish',
      evs: { hp: 252, def: 252, spe: 4 },
      item: 'Toxic Orb',
      ability: 'Poison Heal',
      moves: ['Earthquake', 'Stealth Rock', 'Roost', 'Knock Off'],
      notes: [
        'Objet **obligatoire**, c’est ce qui active le talent (Valley Cave, à l’ouest de Black Belt Hitoshi, ou **16 BP** au Battle Tower).',
        '*Earthquake* : STAB principal · *Stealth Rock* : le poseur de hazards qui manquait à l’équipe · *Roost* : soin, empilé avec *Poison Heal* · *Knock Off* : retire les *Leftovers* et les Choice items adverses — valeur énorme au Battle Tower.',
        '*Facade* remplace *Knock Off* si tu préfères la puissance brute (140 de puissance sous poison).',
      ],
      recommended: true,
    },
    {
      id: 'offensif',
      name: 'Variante offensive',
      nature: 'Adamant',
      evs: { atk: 252, spe: 252 },
      item: 'Toxic Orb',
      moves: ['Swords Dance', 'Earthquake', 'Facade', 'Roost'],
      notes: [
        'Il devient un vrai sweeper, mais tu perds le *Stealth Rock* et la solidité — et l’équipe a plus besoin du mur.',
      ],
    },
  ],
  ivGuidance: {
    focus: ['hp', 'def'],
    ignore: ['spa'],
    note: '**Ignore la SpA** ; l’Attack est secondaire (utile seulement pour *Earthquake*/*Facade*).',
  },
  tasks: [
    {
      id: 'mon-scorvol-1',
      label: '**Capturer un Gligar avec Poison Heal.** Deux chemins :',
      details: [
        '**Dream Ball** (3/jour, Dream Research Lab de Tarmigan Town) sur un Gligar de **Valley Cave** → talent caché garanti. **Le plus simple.**',
        '**DexNav** un Gligar à Valley Cave en visant **3★** (3 IV à 31), puis **Dream Mist** dessus.',
        'Si tu peux combiner les deux (Dream Ball **et** un bon jet d’IV), fais-le : ça t’économise 3 Bottle Caps.',
      ],
      key: true,
      priority: 1,
      done: false,
    },
    {
      id: 'mon-scorvol-2',
      label: '**Récupérer un Razor Fang** : Valley Cave B1F derrière le rocher cassable, ou 48 BP',
      done: false,
    },
    {
      id: 'mon-scorvol-3',
      label: '**Faire évoluer** : donner le *Razor Fang* à tenir, puis monter d’un niveau **de nuit**',
      requires: ['mon-scorvol-1', 'mon-scorvol-2'],
      done: false,
    },
    {
      id: 'mon-scorvol-4',
      label: 'Monter au niveau 100 (Trainer House de Dresco + Lucky Egg amélioré)',
      requires: ['mon-scorvol-3'],
      done: false,
    },
    {
      id: 'mon-scorvol-5',
      label: 'Purger les EV — baies au marché de **Fallshore City** (inutile s’il est fraîchement capturé)',
      requires: ['phase-2.2'],
      done: false,
    },
    {
      id: 'mon-scorvol-6',
      label: 'Nature → **Impish** (Tehl Town, 50 000 $)',
      requires: ['phase-1.1'],
      done: false,
    },
    {
      id: 'mon-scorvol-7',
      label: 'EV : Dresco, dresseur HP (Power Weight) + dresseur Defense (Power Belt)',
      requires: ['mon-scorvol-5', 'phase-1.4'],
      done: false,
    },
    {
      id: 'mon-scorvol-8',
      label: 'IV : Bottle Caps sur **HP et Defense**. **Ignore la SpA** ; l’Attack est secondaire (utile seulement pour *Earthquake*/*Facade*)',
      requires: ['phase-2.4'],
      done: false,
    },
    {
      id: 'mon-scorvol-9',
      label: '**Récupérer le Toxic Orb** : Valley Cave (ouest de Black Belt Hitoshi) ou 16 BP au Battle Tower. **Sans lui, Poison Heal ne sert à rien**',
      key: true,
      done: false,
    },
    {
      id: 'mon-scorvol-10',
      label: 'Moveset : **Stealth Rock (TM)**, **Earthquake (TM)**, **Roost** et **Knock Off** via Move Relearner de Crater Town ou tuteurs de la Frontier',
      done: false,
    },
    {
      id: 'mon-scorvol-11',
      label: '⚠️ **Vérifier son talent avant tout achat** : s’il a *Sand Veil* ou *Hyper Cutter*, le set ne fonctionne pas',
      priority: 2,
      done: false,
    },
  ],
} satisfies PokemonSheet
