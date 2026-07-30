import type { PokemonSheet } from '../types'
import dusknoir from './dusknoir'
import excadrill from './excadrill'
import flagadoss from './flagadoss'
import motismaLavage from './motisma-lavage'
import muleAObjets from './mule-a-objets'
import queulorior from './queulorior'
import sceptile from './sceptile'
import scorvol from './scorvol'
import synchro from './synchro'
import togekiss from './togekiss'
import tyranitar from './tyranitar'
import zeraora from './zeraora'

/**
 * §6 — Fiches détaillées par Pokémon, et §7.3 — Composition finale validée.
 *
 * Les statistiques de base et les learnsets sont ceux d'Unbound
 * (source : romhackdex.net/unbound), pas ceux des jeux officiels.
 *
 * Deux fiches sont marquées `incomplete` : §7.3 place Excadrill et
 * Motisma-Lavage dans l'équipe, mais §6 ne leur consacre aucune fiche. On
 * reporte les seules données réellement présentes dans le guide, sans
 * fabriquer de build à leur place.
 *
 * ⚠️ **Ce fichier est généré.** Une fiche vit dans son propre module
 * (`app/data/pokemon/<slug>.ts`) ; `pnpm import:pokemon` en ajoute un et
 * `pnpm rm:pokemon` en retire un, puis tous deux réécrivent ce barrel. L'ordre
 * du tableau est l'ordre éditorial du guide, et il est préservé d'une
 * régénération à l'autre — ne le retrie pas par mégarde.
 */
export const pokemon: PokemonSheet[] = [
  /* ordre éditorial — début de la liste générée */
  tyranitar,
  excadrill,
  togekiss,
  motismaLavage,
  flagadoss,
  scorvol,
  dusknoir,
  zeraora,
  sceptile,
  queulorior,
  muleAObjets,
  synchro,
  /* fin de la liste générée */
]

/** Membres de la composition finale validée (§7.3), triés par slot. */
export const activePokemon = pokemon
  .filter(mon => mon.status === 'active')
  .sort((a, b) => (a.slot ?? 99) - (b.slot ?? 99))

export const retiredPokemon = pokemon.filter(mon => mon.status === 'retired')
export const utilityPokemon = pokemon.filter(mon => mon.status === 'utility')

export const pokemonBySlug = new Map(pokemon.map(mon => [mon.slug, mon]))

/** Index plat de toutes les tâches de fiche, par id. */
export const pokemonTasksById = new Map(
  pokemon.flatMap(mon => (mon.tasks ?? []).map(task => [task.id, { task, mon }] as const)),
)
