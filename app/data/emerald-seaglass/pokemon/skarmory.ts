import type { PokemonSheet } from '../../types'

/**
 * Cible de la composition B (voir `phases.ts`, phase-2.1) — pas encore capturé.
 *
 * Remplace Aggron dans la composition conseillée par le guide personnel du
 * joueur : ce dernier lui donnait le typage Acier/Roche et le rôle de
 * « réponse à la Glace ×4 » de Sceptile. Vérifié faux dans ce hack — Aggron y
 * est Acier/Dragon (`pokedex.ts`, et confirmé ligne 336 de la doc officielle
 * v3.0), donc neutre à la Glace. Skarmory (Acier/Vol) tient ce rôle à sa
 * place : résiste ×½ Glace/Dragon/Fée, ×¼ Insecte, immunisé Sol et Poison.
 */
export default {
  slug: 'skarmory',
  name: 'Skarmory',
  status: 'active',
  slot: 2,
  role: 'Cible — mur Acier/Vol, réponse à la Glace ×4 de Sceptile ; pas encore capturé.',
  types: ['Steel', 'Flying'],
  baseStats: { hp: 65, atk: 90, def: 140, spa: 40, spd: 70, spe: 70 },
  bst: 475,
  abilities: [
    { name: 'Gale Wings' },
    { name: 'Sturdy' },
    { name: 'Weak Armor', hidden: true },
  ],
  obtention: 'Sauvage — Route 113 ou Safari Zone N. Pas d’évolution : capture directe.',
} satisfies PokemonSheet
