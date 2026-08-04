import type { PokemonSheet } from '../../types'

/**
 * Cible de la composition B (voir `phases.ts`, phase-2.1) — pas encore capturé.
 *
 * Immunisé Psy (couvre Tate & Liza) et résiste au Feu — ce qui couvre au
 * passage la faiblesse Feu ×2 de Skarmory.
 */
export default {
  slug: 'houndoom',
  name: 'Houndoom',
  status: 'active',
  slot: 4,
  role: 'Cible — Ténèbres/Feu, immunisé Psy, couvre la faiblesse Feu de Skarmory ; pas encore capturé.',
  types: ['Dark', 'Fire'],
  baseStats: { hp: 75, atk: 90, def: 50, spa: 110, spd: 80, spe: 100 },
  bst: 505,
  abilities: [
    { name: 'Unnerve' },
    { name: 'Flash Fire' },
    { name: 'Dark Aura', hidden: true },
  ],
  obtention: 'Houndour sauvage — Route 112 ou Mt. Pyre extérieur, évolue Lv 24. Houndoom sauvage possible au Magma Hideout.',
} satisfies PokemonSheet
