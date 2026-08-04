import type { PokemonSheet } from '../../types'

/**
 * Cible de la composition B (voir `phases.ts`, phase-2.1) — pas encore capturé.
 *
 * Immunité Dragon (couvre Drake et les Dragon adverses en général) et
 * résistance ×¼ au Combat, clé contre Brawly. Attaquant spécial pur du
 * groupe.
 */
export default {
  slug: 'gardevoir',
  name: 'Gardevoir',
  status: 'active',
  slot: 3,
  role: 'Cible — attaquant spécial Psy/Fée, immunité Dragon ; pas encore capturé.',
  types: ['Psychic', 'Fairy'],
  baseStats: { hp: 68, atk: 65, def: 65, spa: 125, spd: 115, spe: 80 },
  bst: 518,
  abilities: [
    { name: 'Synchronize' },
    { name: 'Trace' },
    { name: 'Telepathy', hidden: true },
  ],
  obtention: 'Ralts sauvage — Route 102, dès la sortie de Littleroot. Évolue en Kirlia puis Gardevoir (Lv 30).',
} satisfies PokemonSheet
