import type { PokemonProgress, SaveState } from '~/data/types'

/**
 * Détection des clés mortes d'une sauvegarde.
 *
 * `normalize()` conserve indéfiniment ce qu'il reconnaît par sa forme : une clé
 * dont le contenu a disparu (fiche supprimée, tâche retirée) reste dans le
 * localStorage pour toujours, et voyage dans chaque export. Rien ne la signale,
 * puisque plus aucune UI ne la lit.
 *
 * La purge est explicite et non automatique au chargement : supprimer des
 * données de progression sans le dire serait pire que de les garder — une fiche
 * peut aussi disparaître le temps d'une branche git.
 */

export interface KnownContent {
  /** Tous les ids de tâche du contenu, y compris les `ready-<slug>-<key>`. */
  taskIds: ReadonlySet<string>
  slugs: ReadonlySet<string>
  resourceKeys: ReadonlySet<string>
  counterIds: ReadonlySet<string>
}

export interface PruneReport {
  tasks: string[]
  pokemon: string[]
  resources: string[]
  counters: string[]
  roster: string[]
  /**
   * Fiches connues dont la progression est vide.
   *
   * `progressFor` crée un enregistrement dès qu'une fiche est *ouverte* : ce
   * n'est pas une clé morte mais du remplissage, et la compter comme orpheline
   * ferait clignoter le menu après chaque visite. La purge s'en débarrasse quand
   * même — ça allège l'export — mais sans peser sur le total annoncé.
   */
  empty: string[]
  /** Clés réellement mortes, celles qui justifient la purge. */
  total: number
}

/** Une progression sans la moindre saisie — ce que `progressFor` crée à la visite. */
export function isEmptyProgress(progress: PokemonProgress): boolean {
  return !progress.buildId
    && progress.level === undefined
    && !progress.nature
    && !progress.ability
    && !progress.item
    && !progress.notes?.trim()
    && Object.keys(progress.ivs ?? {}).length === 0
    && Object.keys(progress.evs ?? {}).length === 0
    && (progress.moves ?? []).every(move => !move.trim())
}

export function findOrphans(save: SaveState, known: KnownContent): PruneReport {
  const tasks = Object.keys(save.tasks).filter(id => !known.taskIds.has(id))
  const pokemon = Object.keys(save.pokemon).filter(slug => !known.slugs.has(slug))
  const resources = Object.keys(save.resources).filter(key => !known.resourceKeys.has(key))
  const counters = Object.keys(save.counters).filter(id => !known.counterIds.has(id))
  const roster = Object.keys(save.roster).filter(slug => !known.slugs.has(slug))

  const empty = Object.entries(save.pokemon)
    .filter(([slug, progress]) => known.slugs.has(slug) && isEmptyProgress(progress))
    .map(([slug]) => slug)

  return {
    tasks,
    pokemon,
    resources,
    counters,
    roster,
    empty,
    total: tasks.length + pokemon.length + resources.length + counters.length + roster.length,
  }
}

/** Rend une sauvegarde débarrassée de ce que `findOrphans` a listé. */
export function pruneSave(save: SaveState, known: KnownContent): SaveState {
  const report = findOrphans(save, known)
  const drop = <T>(record: Record<string, T>, keys: string[]): Record<string, T> =>
    Object.fromEntries(Object.entries(record).filter(([key]) => !keys.includes(key)))

  return {
    ...save,
    tasks: drop(save.tasks, report.tasks),
    pokemon: drop(save.pokemon, [...report.pokemon, ...report.empty]),
    resources: drop(save.resources, report.resources),
    counters: drop(save.counters, report.counters),
    roster: drop(save.roster, report.roster),
  }
}
