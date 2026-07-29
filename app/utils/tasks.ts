import type { Phase, PokemonSheet, Task, TaskId } from '~/data/types'
import { phases } from '~/data/phases'
import { pokemon } from '~/data/pokemon'

export interface TaskEntry {
  task: Task
  /** D'où vient la tâche : la roadmap générale (§5) ou une fiche (§6). */
  source: 'phase' | 'pokemon'
  phase?: Phase
  mon?: PokemonSheet
  /**
   * Poids de tri. Les tâches de fiche valent 3 : l'optimisation Pokémon par
   * Pokémon EST la phase 3 du guide.
   */
  weight: number
  /** Rang dans son groupe d'origine, pour départager à priorité égale. */
  order: number
  /** Libellé court de l'origine, affiché dans la liste des prochaines actions. */
  originLabel: string
  /** Route à ouvrir pour traiter la tâche. */
  route: string
}

export const taskEntries: TaskEntry[] = [
  ...phases.flatMap(phase =>
    phase.tasks.map((task, index): TaskEntry => ({
      task,
      source: 'phase',
      phase,
      weight: phase.number,
      order: index,
      originLabel: `Phase ${phase.number} · ${phase.title}`,
      route: task.link ?? '/roadmap',
    })),
  ),
  ...pokemon.flatMap(mon =>
    (mon.tasks ?? []).map((task, index): TaskEntry => ({
      task,
      source: 'pokemon',
      mon,
      weight: 3,
      order: index,
      originLabel: mon.name,
      route: task.link ?? `/equipe/${mon.slug}`,
    })),
  ),
]

export const taskEntriesById = new Map(taskEntries.map(entry => [entry.task.id, entry]))

/**
 * Périmètre de la progression globale et des prochaines actions : la roadmap
 * plus les six membres de la composition finale. Les fiches `retired` et
 * `utility` restent consultables mais ne pèsent pas sur l'avancement — ce sont
 * des références, pas du travail restant.
 */
export const trackedTaskEntries = taskEntries.filter(
  entry => entry.source === 'phase' || entry.mon?.status === 'active',
)

export function taskLabelOf(id: TaskId): string {
  return taskEntriesById.get(id)?.task.label ?? id
}
