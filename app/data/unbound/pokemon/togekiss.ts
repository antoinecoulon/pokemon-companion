import type { PokemonSheet } from '../../types'

/** Slot 3 — Togekiss (§6.3) */
export default {
  slug: 'togekiss',
  sprite: 'togekiss',
  name: 'Togekiss',
  slot: 3,
  status: 'active',
  badge: 'Conservé',
  role: 'Para-flinch / Stallbreaker (spécial)',
  types: ['Fairy', 'Flying'],
  baseStats: { hp: 85, atk: 50, def: 95, spa: 120, spd: 115, spe: 80 },
  bst: 545,
  abilities: [
    { name: 'Hustle' },
    { name: 'Serene Grace' },
    { name: 'Super Luck', hidden: true },
  ],
  targetAbility: 'Serene Grace',
  analysis: [
    {
      kind: 'p',
      text: '**C’est ton meilleur investissement, de loin.** *Serene Grace* double les effets secondaires : *Air Slash* passe de 30 % à **60 % de chance d’apeurer**. Combiné à *Thunder Wave* (paralysie = 25 % de chance de ne pas agir), tu obtiens la fameuse **para-flinch** : l’adversaire a environ **70 % de chance de ne rien faire à chaque tour**.',
    },
    {
      kind: 'p',
      text: 'C’est une stratégie qui frôle l’abus contre l’IA du Battle Tower, et c’est exactement pour ça qu’elle est parfaite pour ton usage.',
    },
    {
      kind: 'quote',
      tone: 'success',
      text: '**Correction importante :** *Serene Grace* **n’est pas** son talent caché — c’est son **talent 2**. Une **Ability Capsule** du Game Corner suffit. Économie de plusieurs heures de farm de Dream Mist.',
    },
    {
      kind: 'p',
      text: '**Sur la nature :** ton guide d’origine proposait **Bold**. C’est un mauvais choix ici — *Bold* baisse l’Attaque (que Togekiss n’utilise pas, donc OK) mais monte la Défense, alors que ce que tu veux c’est **agir en premier pour apeurer**. Un Togekiss lent ne peut pas apeurer.',
    },
  ],
  builds: [
    {
      id: 'para-flinch',
      name: 'Para-Flinch',
      nature: 'Timid',
      evs: { hp: 252, spe: 252, spa: 4 },
      item: 'Heavy-Duty Boots',
      ability: 'Serene Grace',
      moves: ['Air Slash', 'Thunder Wave', 'Roost', 'Nasty Plot'],
      notes: [
        'La **Speed est la stat qui fait fonctionner la stratégie**.',
        'Objet : Togekiss prend **25 % par *Stealth Rock***, c’est sa faiblesse n°1.',
        '*Air Slash* = le cœur du set · *Thunder Wave* = la moitié du combo · *Roost* = soin fiable, indispensable · *Nasty Plot* ou *Dazzling Gleam* selon que tu préfères la puissance ou la couverture.',
      ],
      recommended: true,
    },
    {
      id: 'bulky-offense',
      name: 'Bulky Offense',
      tagline: 'variante',
      nature: 'Modest',
      evs: { hp: 252, spa: 252 },
      item: 'Leftovers',
      moves: ['Dazzling Gleam', 'Aura Sphere', '—', '—'],
      notes: ['Plus de dégâts, moins de contrôle.'],
    },
  ],
  ivGuidance: {
    focus: ['hp', 'spe', 'spa', 'spd'],
    ignore: ['atk'],
    note: '**Ignore l’Attack** : elle n’est jamais utilisée, et une Attack basse réduit les dégâts de la confusion et de *Foul Play*.',
  },
  tasks: [
    {
      id: 'mon-togekiss-1',
      label: '**Acheter une Ability Capsule** au **Game Corner de Dehara** → passer en **Serene Grace**. ⚠️ Vérifie d’abord son talent actuel : s’il est déjà en *Serene Grace*, tu n’as rien à faire',
      key: true,
      priority: 1,
      done: true,
    },
    {
      id: 'mon-togekiss-2',
      label: 'Purger ses EV (5 BP/stat, Frontier)',
      done: true,
    },
    {
      id: 'mon-togekiss-3',
      label: 'Nature → **Timid** (Tehl Town, 50 000 $)',
      done: true,
    },
    {
      id: 'mon-togekiss-4',
      label: 'EV : Dresco, dresseur HP (Power Weight) + dresseur Speed (Power Anklet)',
      requires: ['mon-togekiss-2'],
      done: true,
    },
    {
      id: 'mon-togekiss-5',
      label: 'IV : Bottle Caps sur **HP, Speed, SpA, SpD** — **ignore l’Attack**',
      done: true,
    },
    {
      id: 'mon-togekiss-6',
      label: 'Moveset : **Thunder Wave (TM73)** et **Roost (TM51)** ; **Nasty Plot** via les tuteurs de la Battle Frontier — ni l\'un ni l\'autre ne passe par le Move Relearner, aucun des trois n\'est un acquis de niveau',
      done: true,
    },
    {
      id: 'mon-togekiss-7',
      label: 'Objet : **Heavy-Duty Boots** — 48 BP au Battle Tower, ou exemplaire unique à **Cootes Bog** (nord-est de la Ranger Betty)',
      done: true,
    },
    {
      id: 'mon-togekiss-8',
      label: '**Vérifier son bonheur** si tu passes par le Nature Changer de la Frontier (il le remet à 0) — sans impact ici puisque le set n’utilise pas *Return*',
      done: true,
    },
  ],
} satisfies PokemonSheet
