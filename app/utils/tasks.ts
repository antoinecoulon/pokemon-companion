import type { Phase, PokemonSheet, Task, TaskId } from '~/data/types'
import { phases } from '~/data/phases'
import { pokemon } from '~/data/pokemon'

export interface TaskEntry {
  task: Task
  /** D'où vient la tâche : la Battle Frontier (§10) ou une fiche (§6). */
  source: 'phase' | 'pokemon'
  phase?: Phase
  mon?: PokemonSheet
  /**
   * Poids de tri. Les tâches de fiche valent 3, la Frontier 5 : l'optimisation
   * d'équipe passe avant, comme dans la numérotation d'origine du guide.
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
      route: task.link ?? '/completion',
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
 * Périmètre de la progression globale et des prochaines actions : la Battle
 * Frontier plus les six membres de la composition finale. Les fiches `retired` et
 * `utility` restent consultables mais ne pèsent pas sur l'avancement — ce sont
 * des références, pas du travail restant.
 *
 * Prend les slugs actifs en paramètre au lieu de lire `mon.status` : depuis que
 * la composition est modifiable en cours de partie, le statut d'une fiche n'est
 * plus une constante de compilation. Une constante de module figerait la
 * progression sur l'équipe du guide.
 */
export function trackedEntriesFor(activeSlugs: ReadonlySet<string>): TaskEntry[] {
  return taskEntries.filter(
    entry => entry.source === 'phase' || (entry.mon && activeSlugs.has(entry.mon.slug)),
  )
}

export function taskLabelOf(id: TaskId): string {
  return taskEntriesById.get(id)?.task.label ?? id
}
