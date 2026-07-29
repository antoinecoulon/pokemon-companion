import type { TaskEntry } from '~/utils/tasks'

export interface ActionableTask extends TaskEntry {
  /** Prérequis non encore cochés — vide pour une tâche actionnable. */
  blockedBy: { id: string, label: string }[]
}

function sortKey(a: TaskEntry, b: TaskEntry) {
  return a.weight - b.weight
    || (a.task.priority ?? 50) - (b.task.priority ?? 50)
    || a.order - b.order
}

/**
 * Moteur de « prochaine action ».
 *
 * Une tâche est proposée quand elle n'est pas cochée ET que tous ses prérequis
 * le sont. Les prérequis sont ceux que le guide énonce explicitement (§3 pour
 * l'ordre au sein d'une fiche, §2.x pour les verrous globaux comme le Macho
 * Brace ou les Bottle Caps) : l'app ne doit jamais proposer une étape que le
 * jeu rendrait impossible.
 */
export function useNextActions(limit = 5) {
  const { isDone } = useSave()

  const decorated = computed<ActionableTask[]>(() =>
    trackedTaskEntries
      .filter(entry => !isDone(entry.task.id))
      .map(entry => ({
        ...entry,
        blockedBy: (entry.task.requires ?? [])
          .filter(id => !isDone(id))
          .map(id => ({ id, label: taskLabelOf(id) })),
      })),
  )

  const actionable = computed(() =>
    decorated.value.filter(entry => entry.blockedBy.length === 0).sort(sortKey),
  )

  const blocked = computed(() =>
    decorated.value.filter(entry => entry.blockedBy.length > 0).sort(sortKey),
  )

  const next = computed(() => actionable.value.slice(0, limit))

  /** Pour la Roadmap : savoir si une tâche donnée est verrouillée. */
  function blockersFor(id: string) {
    return decorated.value.find(entry => entry.task.id === id)?.blockedBy ?? []
  }

  return { next, actionable, blocked, blockersFor }
}
