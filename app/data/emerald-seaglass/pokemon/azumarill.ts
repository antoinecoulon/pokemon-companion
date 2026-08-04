import type { PokemonSheet } from '../../types'

/**
 * Cible de la composition B (voir `phases.ts`, phase-2.1) — pas encore capturé.
 *
 * Anti-Feu et anti-Sol, deuxième immunité Dragon de l'équipe (après
 * Gardevoir). Encaisse bien Flannery.
 */
export default {
  slug: 'azumarill',
  name: 'Azumarill',
  status: 'active',
  slot: 5,
  role: 'Cible — mur Eau/Fée, anti-Feu/Sol, deuxième immunité Dragon ; pas encore capturé.',
  types: ['Water', 'Fairy'],
  baseStats: { hp: 100, atk: 50, def: 80, spa: 60, spd: 80, spe: 50 },
  bst: 420,
  abilities: [
    { name: 'Thick Fat' },
    { name: 'Huge Power' },
    { name: 'Sap Sipper', hidden: true },
  ],
  obtention: 'Marill sauvage — Route 104, évolue Lv 18. Azumarill aussi au Surf de la Route 120.',
} satisfies PokemonSheet
