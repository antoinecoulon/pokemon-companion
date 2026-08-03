import type { PokemonSheet } from '../../types'
import treecko from './treecko'

/**
 * Fiches manuscrites de Seaglass — pour l'instant, le seul Pokémon fixé
 * d'avance. Tout le reste de la composition vit dans `state.catches` et se
 * synthétise à la volée depuis le Pokédex de référence : voir `useRoster`.
 */
export const pokemon: PokemonSheet[] = [treecko]
