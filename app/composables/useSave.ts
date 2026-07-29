import type { JournalEntry, PokemonProgress, SaveState, TaskId } from '~/data/types'
import { phases } from '~/data/phases'
import { pokemon } from '~/data/pokemon'
import { SAVE_VERSION } from '~/data/types'

const STORAGE_KEY = 'pokemon-companion:save'

/**
 * État initial des cases, tel que repris du guide markdown.
 *
 * `state.tasks` ne stocke QUE les choix explicites de l'utilisateur. Une tâche
 * absente retombe sur ce défaut : quand une nouvelle tâche est ajoutée au
 * contenu, son `done` est donc respecté sans avoir à migrer la sauvegarde.
 */
const contentDefaults = new Map<TaskId, boolean>([
  ...phases.flatMap(phase => phase.tasks.map(task => [task.id, task.done ?? false] as const)),
  ...pokemon.flatMap(mon => (mon.tasks ?? []).map(task => [task.id, task.done ?? false] as const)),
])

export function createEmptySave(): SaveState {
  return {
    version: SAVE_VERSION,
    tasks: {},
    pokemon: {},
    counters: {},
    journal: [],
    updatedAt: new Date().toISOString(),
  }
}

function emptyProgress(): PokemonProgress {
  return { ivs: {}, evs: {}, moves: ['', '', '', ''] }
}

/**
 * Normalise une sauvegarde venue du localStorage ou d'un import : on ne fait
 * jamais confiance à la forme du JSON, seulement à ce qu'on reconnaît.
 */
function normalize(raw: unknown): SaveState | null {
  if (!raw || typeof raw !== 'object') return null
  const input = raw as Partial<SaveState>
  if (input.version !== SAVE_VERSION) return null

  const save = createEmptySave()

  if (input.tasks && typeof input.tasks === 'object') {
    for (const [id, value] of Object.entries(input.tasks)) {
      if (typeof value === 'boolean') save.tasks[id] = value
    }
  }

  if (input.pokemon && typeof input.pokemon === 'object') {
    for (const [slug, value] of Object.entries(input.pokemon)) {
      if (!value || typeof value !== 'object') continue
      const progress = value as Partial<PokemonProgress>
      save.pokemon[slug] = {
        ...emptyProgress(),
        ...progress,
        ivs: progress.ivs ?? {},
        evs: progress.evs ?? {},
        moves: Array.isArray(progress.moves)
          ? [0, 1, 2, 3].map(index => String(progress.moves?.[index] ?? ''))
          : ['', '', '', ''],
      }
    }
  }

  if (input.counters && typeof input.counters === 'object') {
    for (const [id, value] of Object.entries(input.counters)) {
      if (typeof value === 'number' && Number.isFinite(value)) save.counters[id] = value
    }
  }

  if (Array.isArray(input.journal)) {
    save.journal = input.journal
      .filter((entry): entry is JournalEntry =>
        !!entry && typeof entry === 'object'
        && typeof (entry as JournalEntry).id === 'string'
        && typeof (entry as JournalEntry).date === 'string')
      .map(entry => ({
        id: entry.id,
        date: entry.date,
        title: String(entry.title ?? ''),
        body: String(entry.body ?? ''),
      }))
  }

  save.updatedAt = typeof input.updatedAt === 'string' ? input.updatedAt : save.updatedAt
  return save
}

/**
 * Point d'accès unique au localStorage.
 *
 * Aucun composant ne lit ni n'écrit le stockage directement : brancher une base
 * distante plus tard ne demandera de retoucher que ce fichier.
 */
export function useSave() {
  const state = useState<SaveState>('save', createEmptySave)
  const ready = useState<boolean>('save-ready', () => false)
  /**
   * Horodatage tenu HORS de `state`.
   *
   * Le plugin surveille `state` en profondeur ; si `persist()` écrivait
   * `updatedAt` dedans, chaque écriture déclencherait le watcher, qui
   * replanifierait une écriture — une boucle infinie d'accès au localStorage.
   */
  const lastSavedAt = useState<string | null>('save-updated-at', () => null)

  /** Appelé une seule fois, par le plugin client. */
  function hydrate() {
    if (ready.value) return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = normalize(JSON.parse(stored))
        if (parsed) {
          state.value = parsed
          lastSavedAt.value = parsed.updatedAt
        }
        else { console.warn('[save] sauvegarde ignorée : version ou forme inattendue') }
      }
    }
    catch (error) {
      console.error('[save] lecture impossible, on repart d’une sauvegarde vide', error)
    }
    ready.value = true
  }

  /** Sérialise l'état avec un horodatage frais, sans toucher à `state`. */
  function snapshot(): SaveState {
    return { ...state.value, updatedAt: new Date().toISOString() }
  }

  function persist() {
    if (!ready.value) return
    const payload = snapshot()
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      lastSavedAt.value = payload.updatedAt
    }
    catch (error) {
      console.error('[save] écriture impossible', error)
    }
  }

  /* --- Tâches ---------------------------------------------------------- */

  function isDone(id: TaskId): boolean {
    return state.value.tasks[id] ?? contentDefaults.get(id) ?? false
  }

  function setDone(id: TaskId, value: boolean) {
    state.value.tasks[id] = value
  }

  function toggleDone(id: TaskId) {
    setDone(id, !isDone(id))
  }

  /* --- Fiches Pokémon -------------------------------------------------- */

  function progressFor(slug: string): PokemonProgress {
    state.value.pokemon[slug] ??= emptyProgress()
    return state.value.pokemon[slug]
  }

  /* --- Compteurs ------------------------------------------------------- */

  function counterValue(id: string): number {
    return state.value.counters[id] ?? 0
  }

  function setCounter(id: string, value: number) {
    state.value.counters[id] = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0
  }

  /* --- Journal de bord ------------------------------------------------- */

  const journal = computed(() =>
    [...state.value.journal].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
  )

  function addJournalEntry(entry: Omit<JournalEntry, 'id'>) {
    state.value.journal.push({ ...entry, id: crypto.randomUUID() })
  }

  function updateJournalEntry(id: string, patch: Partial<Omit<JournalEntry, 'id'>>) {
    const entry = state.value.journal.find(item => item.id === id)
    if (entry) Object.assign(entry, patch)
  }

  function removeJournalEntry(id: string) {
    state.value.journal = state.value.journal.filter(entry => entry.id !== id)
  }

  /* --- Export / import / remise à zéro --------------------------------- */

  function exportJson(): string {
    return JSON.stringify(snapshot(), null, 2)
  }

  function importJson(text: string): { ok: true } | { ok: false, error: string } {
    let raw: unknown
    try {
      raw = JSON.parse(text)
    }
    catch {
      return { ok: false, error: 'Le fichier n’est pas du JSON valide.' }
    }
    const parsed = normalize(raw)
    if (!parsed) {
      return {
        ok: false,
        error: `Sauvegarde non reconnue : version ${SAVE_VERSION} attendue.`,
      }
    }
    state.value = parsed
    persist()
    return { ok: true }
  }

  function reset() {
    state.value = createEmptySave()
    persist()
  }

  return {
    state,
    ready: readonly(ready),
    lastSavedAt: readonly(lastSavedAt),
    hydrate,
    persist,
    isDone,
    setDone,
    toggleDone,
    progressFor,
    counterValue,
    setCounter,
    journal,
    addJournalEntry,
    updateJournalEntry,
    removeJournalEntry,
    exportJson,
    importJson,
    reset,
  }
}
