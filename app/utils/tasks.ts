import type { Phase, PokemonSheet, Task, TaskId } from '~/data/types'

export interface TaskEntry {
  task: Task
  /** D'où vient la tâche : une phase du jeu ou une fiche Pokémon. */
  source: 'phase' | 'pokemon'
  phase?: Phase
  mon?: PokemonSheet
  /**
   * Poids de tri. Les tâches de fiche valent 3 : chez Unbound, l'optimisation
   * d'équipe passe avant la Battle Frontier (poids 5), comme dans la
   * numérotation d'origine du guide. Un jeu dont les phases sont numérotées 1 à
   * 4 place donc naturellement ses deux premières phases avant les fiches.
   */
  weight: number
  /** Rang dans son groupe d'origine, pour départager à priorité égale. */
  order: number
  /** Libellé court de l'origine, affiché dans la liste des prochaines actions. */
  originLabel: string
  /** Route à ouvrir pour traiter la tâche, préfixe de jeu compris. */
  route: string
}

const POKEMON_TASK_WEIGHT = 3

/**
 * Construit les entrées de tâche d'un jeu.
 *
 * Fonction et non constante de module : chaque jeu a ses propres phases, ses
 * propres fiches et son propre préfixe de route. Une constante figerait le
 * contenu du premier jeu importé.
 *
 * `basePath` est le préfixe de route du jeu (`/unbound`), sans barre finale.
 */
export function buildTaskEntries(
  phases: Phase[],
  pokemon: PokemonSheet[],
  basePath: string,
): TaskEntry[] {
  return [
    ...phases.flatMap(phase =>
      phase.tasks.map((task, index): TaskEntry => ({
        task,
        source: 'phase',
        phase,
        weight: phase.number,
        order: index,
        originLabel: `Phase ${phase.number} · ${phase.title}`,
        route: `${basePath}${task.link ?? '/completion'}`,
      })),
    ),
    ...pokemon.flatMap(mon =>
      (mon.tasks ?? []).map((task, index): TaskEntry => ({
        task,
        source: 'pokemon',
        mon,
        weight: POKEMON_TASK_WEIGHT,
        order: index,
        originLabel: mon.name,
        route: `${basePath}${task.link ?? `/equipe/${mon.slug}`}`,
      })),
    ),
  ]
}

/**
 * Périmètre de la progression globale et des prochaines actions : les phases,
 * plus les membres de la composition jouée. Les fiches `retired` et `utility`
 * restent consultables mais ne pèsent pas sur l'avancement — ce sont des
 * références, pas du travail restant.
 *
 * Prend les slugs actifs en paramètre au lieu de lire `mon.status` : depuis que
 * la composition est modifiable en cours de partie, le statut d'une fiche n'est
 * plus une constante de compilation. Une constante de module figerait la
 * progression sur l'équipe du guide.
 */
export function trackedEntriesFor(
  entries: TaskEntry[],
  activeSlugs: ReadonlySet<string>,
): TaskEntry[] {
  return entries.filter(
    entry => entry.source === 'phase' || (entry.mon && activeSlugs.has(entry.mon.slug)),
  )
}

export function taskLabelOf(entriesById: Map<TaskId, TaskEntry>, id: TaskId): string {
  return entriesById.get(id)?.task.label ?? id
}
