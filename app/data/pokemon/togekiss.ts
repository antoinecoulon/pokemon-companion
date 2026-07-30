import type { PokemonSheet } from '../types'

/** Slot 3 — Togekiss (§6.3) */
export default {
  slug: 'togekiss',
  nameEn: 'Togekiss',
  sprite: 'togekiss',
  name: 'Togekiss',
  slot: 3,
  status: 'active',
  badge: 'Conservé',
  role: 'Para-flinch / Stallbreaker (spécial)',
  types: ['Fée', 'Vol'],
  baseStats: { hp: 85, atk: 50, def: 95, spa: 120, spd: 115, spe: 80 },
  bst: 545,
  abilities: [
    { name: 'Hustle' },
    { name: 'Sérénité (Serene Grace)' },
    { name: 'Œil Compétitif', hidden: true },
  ],
  targetAbility: 'Sérénité (Serene Grace)',
  analysis: [
    {
      kind: 'p',
      text: '**C’est ton meilleur investissement, de loin.** Sérénité double les effets secondaires : Lame d’Air passe de 30 % à **60 % de chance d’apeurer**. Combiné à Cage-Éclair (paralysie = 25 % de chance de ne pas agir), tu obtiens la fameuse **para-flinch** : l’adversaire a environ **70 % de chance de ne rien faire à chaque tour**.',
    },
    {
      kind: 'p',
      text: 'C’est une stratégie qui frôle l’abus contre l’IA du Battle Tower, et c’est exactement pour ça qu’elle est parfaite pour ton usage.',
    },
    {
      kind: 'quote',
      tone: 'success',
      text: '**Correction importante :** Sérénité **n’est pas** son talent caché — c’est son **talent 2**. Une **Ability Capsule** du Game Corner suffit. Économie de plusieurs heures de farm de Dream Mist.',
    },
    {
      kind: 'p',
      text: '**Sur la nature :** ton guide d’origine proposait **Assuré (Bold)**. C’est un mauvais choix ici — Bold baisse l’Attaque (que Togekiss n’utilise pas, donc OK) mais monte la Défense, alors que ce que tu veux c’est **agir en premier pour apeurer**. Un Togekiss lent ne peut pas apeurer.',
    },
  ],
  builds: [
    {
      id: 'para-flinch',
      name: 'Para-Flinch',
      nature: 'Timide (Timid)',
      natureFr: 'Timide',
      evs: { hp: 252, spe: 252, spa: 4 },
      item: 'Bottes Épaisses (Heavy-Duty Boots)',
      ability: 'Sérénité (Serene Grace)',
      moves: ['Lame d’Air', 'Cage-Éclair', 'Atterrissage', 'Machination'],
      notes: [
        'La **Vitesse est la stat qui fait fonctionner la stratégie**.',
        'Objet : Togekiss prend **25 % par Piège de Roc**, c’est sa faiblesse n°1.',
        '*Lame d’Air* = le cœur du set · *Cage-Éclair* = la moitié du combo · *Atterrissage (Roost)* = soin fiable, indispensable · *Machination (Nasty Plot)* ou *Éclat Magique* selon que tu préfères la puissance ou la couverture.',
      ],
      recommended: true,
    },
    {
      id: 'bulky-offense',
      name: 'Bulky Offense',
      tagline: 'variante',
      nature: 'Modeste (Modest)',
      natureFr: 'Modeste',
      evs: { hp: 252, spa: 252 },
      item: 'Restes',
      moves: ['Éclat Magique', 'Aurasphère', '—', '—'],
      notes: ['Plus de dégâts, moins de contrôle.'],
    },
  ],
  ivGuidance: {
    focus: ['hp', 'spe', 'spa', 'spd'],
    ignore: ['atk'],
    note: '**Ignore l’Attaque** : elle n’est jamais utilisée, et une Attaque basse réduit les dégâts de Confusion et de Coup Bas.',
  },
  tasks: [
    {
      id: 'mon-togekiss-1',
      label: '**Acheter une Ability Capsule** au **Game Corner de Dehara** → passer en **Sérénité**. ⚠️ Vérifie d’abord son talent actuel : s’il est déjà en Sérénité, tu n’as rien à faire',
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
      label: 'Nature → **Timide** (Tehl Town, 50 000 $)',
      requires: ['phase-1.1'],
      done: true,
    },
    {
      id: 'mon-togekiss-4',
      label: 'EV : Dresco, dresseur PV (Poids Pouvoir) + dresseur Vitesse (Anneau Pouvoir)',
      requires: ['mon-togekiss-2', 'phase-1.4'],
      done: true,
    },
    {
      id: 'mon-togekiss-5',
      label: 'IV : Bottle Caps sur **PV, Vitesse, Att.Spé, Déf.Spé** — **ignore l’Attaque**',
      requires: ['phase-2.4'],
      done: true,
    },
    {
      id: 'mon-togekiss-6',
      label: 'Moveset : **Cage-Éclair (CT73)**, **Atterrissage** et **Machination** via Move Relearner de Crater Town (Écailles Cœur) ou tuteur Frontier',
      done: true,
    },
    {
      id: 'mon-togekiss-7',
      label: 'Objet : **Bottes Épaisses** — 48 BP au Battle Tower, ou exemplaire unique à **Cootes Bog** (nord-est de la Ranger Betty)',
      done: true,
    },
    {
      id: 'mon-togekiss-8',
      label: '**Vérifier son bonheur** si tu passes par le Nature Changer de la Frontier (il le remet à 0) — sans impact ici puisque le set n’utilise pas Retour',
      done: true,
    },
  ],
} satisfies PokemonSheet
