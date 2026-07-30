import type { JournalEntry, PokemonProgress, PokemonStatus, ResourceKey, RosterOverride, SaveState, TaskId } from '~/data/types'
import type { KnownContent } from '~/utils/prune'
import { counters } from '~/data/counters'
import { npcs } from '~/data/npcs'
import { phases } from '~/data/phases'
import { pokemon } from '~/data/pokemon'
import { quests } from '~/data/quests'
import { readinessCriteria } from '~/data/readiness'
import { ROSTER_STATUSES, SAVE_VERSION, TEAM_SIZE } from '~/data/types'
import { findOrphans, pruneSave } from '~/utils/prune'

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

/**
 * Tout ce que le contenu actuel peut légitimement voir stocké.
 *
 * Sert uniquement à la purge. Les cases « Endgame Ready » y figurent parce
 * qu'elles vivent dans `state.tasks` sans exister nulle part dans le contenu :
 * leur id est fabriqué à la volée par `useProgress` (`ready-<slug>-<key>`), donc
 * sans elles la purge les prendrait toutes pour des orphelines.
 */
const knownContent: KnownContent = {
  taskIds: new Set([
    ...phases.flatMap(phase => phase.tasks.map(task => task.id)),
    ...pokemon.flatMap(mon => (mon.tasks ?? []).map(task => task.id)),
    ...pokemon.flatMap(mon => readinessCriteria.map(criterion => `ready-${mon.slug}-${criterion.key}`)),
  ]),
  slugs: new Set(pokemon.map(mon => mon.slug)),
  resourceKeys: new Set([
    ...npcs.map(npc => `npc:${npc.id}`),
    ...quests.map(quest => `quest:${quest.id}`),
  ]),
  counterIds: new Set(counters.map(counter => counter.id)),
}

export function createEmptySave(): SaveState {
  return {
    version: SAVE_VERSION,
    tasks: {},
    pokemon: {},
    counters: {},
    resources: {},
    roster: {},
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

  /*
   * Champ apparu après la v1 : une sauvegarde plus ancienne ne le contient pas et
   * repart simplement du `{}` de `createEmptySave()`. C'est pour cela qu'ajouter
   * un champ ne demande pas de bump de SAVE_VERSION.
   */
  if (input.resources && typeof input.resources === 'object') {
    for (const [key, value] of Object.entries(input.resources)) {
      if (typeof value === 'boolean') save.resources[key] = value
    }
  }

  /*
   * Même logique que `resources` : champ ajouté après la v1, absent des
   * sauvegardes anciennes, qui repartent du `{}`. On ne retient que les statuts
   * connus et les slots entiers de 1 à 6 — un JSON importé n'est pas de
   * confiance, et un slot hors bornes désordonnerait l'affichage de l'équipe.
   */
  if (input.roster && typeof input.roster === 'object') {
    for (const [slug, value] of Object.entries(input.roster)) {
      if (!value || typeof value !== 'object') continue
      const override = value as RosterOverride
      const clean: RosterOverride = {}
      if (ROSTER_STATUSES.includes(override.status as PokemonStatus)) clean.status = override.status
      if (Number.isInteger(override.slot) && override.slot! >= 1 && override.slot! <= TEAM_SIZE) {
        clean.slot = override.slot
      }
      // Une entrée vide ne dit rien : on ne la garde pas.
      if (clean.status || clean.slot) save.roster[slug] = clean
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

  /* --- Ressources acquises --------------------------------------------- */

  /*
   * Volontairement séparé de `tasks` : une ressource n'a ni prérequis, ni poids,
   * ni route, et ne doit pas peser sur la progression ni sur les prochaines
   * actions. La clé est préfixée (`npc:`, `quest:`) pour éviter les collisions
   * d'id entre catégories de contenu.
   */
  function isAcquired(key: ResourceKey): boolean {
    return state.value.resources[key] ?? false
  }

  function setAcquired(key: ResourceKey, value: boolean) {
    state.value.resources[key] = value
  }

  function toggleAcquired(key: ResourceKey) {
    setAcquired(key, !isAcquired(key))
  }

  /* --- Composition d'équipe -------------------------------------------- */

  /*
   * Écriture brute : c'est `useRoster` qui tient les invariants (six slots, pas
   * de trou, pas de doublon). Ces fonctions ne valident donc rien d'autre que la
   * forme — les appeler directement depuis un composant contournerait les règles.
   */
  function rosterOverride(slug: string): RosterOverride | undefined {
    return state.value.roster[slug]
  }

  function setRosterOverride(slug: string, patch: RosterOverride | null) {
    if (!patch || (patch.status === undefined && patch.slot === undefined)) {
      delete state.value.roster[slug]
      return
    }
    state.value.roster[slug] = { ...state.value.roster[slug], ...patch }
  }

  /** Retour à la composition du guide. */
  function clearRoster() {
    state.value.roster = {}
  }

  const rosterModified = computed(() => Object.keys(state.value.roster).length > 0)

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

  /* --- Purge des clés mortes ------------------------------------------- */

  /** Ce que la purge supprimerait, sans rien supprimer. */
  const orphans = computed(() => findOrphans(state.value, knownContent))

  function prune() {
    const report = orphans.value
    state.value = pruneSave(state.value, knownContent)
    persist()
    return report
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
    isAcquired,
    setAcquired,
    toggleAcquired,
    rosterOverride,
    setRosterOverride,
    clearRoster,
    rosterModified,
    journal,
    addJournalEntry,
    updateJournalEntry,
    removeJournalEntry,
    exportJson,
    importJson,
    reset,
    orphans,
    prune,
  }
}
