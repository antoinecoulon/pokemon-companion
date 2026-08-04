import type { PokemonSheet } from '../../types'
import azumarill from './azumarill'
import crobat from './crobat'
import gardevoir from './gardevoir'
import houndoom from './houndoom'
import skarmory from './skarmory'
import treecko from './treecko'

/**
 * Fiches manuscrites de Seaglass.
 *
 * `treecko` est possédé (starter). Les cinq autres sont la composition B —
 * choisie après vérification des typages du guide personnel du joueur contre
 * `pokedex.ts` et la doc officielle v3.0 (voir le commentaire de
 * `skarmory.ts`) — mais **pas encore capturés** : leur `role` le dit en toutes
 * lettres. Le reste d'une composition qui s'écarterait de ce plan continue de
 * se synthétiser à la volée depuis le Pokédex de référence : voir
 * `useRoster`.
 */
export const pokemon: PokemonSheet[] = [treecko, skarmory, gardevoir, houndoom, azumarill, crobat]
