import type { PokemonSheet } from '../../types'

/**
 * Le seul membre fixé avant même de commencer : starter, dans l'équipe
 * jusqu'à la fin. Le reste de la composition se construit en jeu, capture
 * après capture, via le picker de `/equipe` — voir `useRoster`.
 */
/*
 * Pas de `sprite` : `pnpm sprites` ne connaît que le pipeline Unbound
 * (`scripts/lib/data.mjs` charge `unbound/pokemon/index.ts` en dur). Sans
 * sprite, `PokemonSprite` retombe sur une icône neutre — pas d'image cassée.
 */
export default {
  slug: 'treecko',
  name: 'Treecko',
  status: 'active',
  slot: 1,
  role: 'Starter — build à décider en jouant',
  types: ['Grass'],
  baseStats: { hp: 40, atk: 65, def: 35, spa: 45, spd: 55, spe: 70 },
  bst: 310,
  abilities: [
    { name: 'Overgrow' },
    { name: 'Unburden' },
    { name: 'Sharpness', hidden: true },
  ],
  obtention: 'Starter (event) — Safari Zone SE en sauvage.',
} satisfies PokemonSheet
