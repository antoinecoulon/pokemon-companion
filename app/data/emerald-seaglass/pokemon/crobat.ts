import type { PokemonSheet } from '../../types'

/**
 * Cible de la composition B (voir `phases.ts`, phase-2.1) — pas encore capturé.
 *
 * Immunisé Sol, résiste Combat et Insecte ×¼. Membre le plus rapide de
 * l'équipe (130 Vit).
 */
export default {
  slug: 'crobat',
  name: 'Crobat',
  status: 'active',
  slot: 6,
  role: 'Cible — Poison/Vol très rapide, immunisé Sol ; pas encore capturé.',
  types: ['Poison', 'Flying'],
  baseStats: { hp: 85, atk: 90, def: 80, spa: 70, spd: 80, spe: 130 },
  bst: 535,
  abilities: [
    { name: 'Inner Focus' },
    { name: 'Infiltrator', hidden: true },
  ],
  obtention: 'Zubat sauvage — Granite Cave (tous les étages), évolue en Golbat (Lv 22) puis Crobat (bonheur élevé).',
} satisfies PokemonSheet
