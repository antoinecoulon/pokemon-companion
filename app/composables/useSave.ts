import type { JournalEntry, PokemonProgress, PokemonStatus, ResourceKey, RosterOverride, SaveState, TaskId } from '~/data/types'
import { games } from '~/data/games'
import { ROSTER_STATUSES, SAVE_VERSION, TEAM_SIZE } from '~/data/types'
import { migrations } from '~/utils/migrations'
import { findOrphans, pruneSave } from '~/utils/prune'

/**
 * Une sauvegarde par jeu, sous sa propre clé (voir `app/data/games.ts`).
 *
 * Ce fichier, lui, n'a pas changé de nature : il opère toujours sur **un**
 * `SaveState` à la fois. `normalize()`, `migrations`, `SAVE_VERSION`, la copie
 * de secours et l'export/import ignorent complètement l'existence de plusieurs
 * jeux — c'est tout l'intérêt d'avoir partitionné par clé plutôt que d'avoir
 * enveloppé les sauvegardes dans un objet commun.
 *
 * La copie de secours garde les octets qu'on s'apprête à perdre : `normalize()`
 * refuse ce qu'il ne reconnaît pas, et le premier `persist()` qui suit réécrit
 * la clé par-dessus. Sans elle, une sauvegarde illisible disparaît
 * définitivement, en silence, à la première case cochée. Le contenu n'est jamais
 * réinterprété — on garde la chaîne telle quelle, pour pouvoir la rendre à
 * l'utilisateur ou la relire plus tard, une fois la migration manquante écrite.
 */

export interface SaveBackup {
  /**
   * `rejected` : sauvegarde illisible. `reset` : remise à zéro volontaire.
   * `replaced` : écrasée par la sauvegarde distante, les deux ayant divergé.
   */
  reason: 'rejected' | 'reset' | 'replaced'
  savedAt: string
  /** Le JSON d'origine, tel quel. */
  payload: string
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
  let input = raw as Partial<SaveState>
  if (typeof input.version !== 'number') return null

  /*
   * Une sauvegarde *plus récente* que le code se refuse : elle vient d'un
   * déploiement plus avancé, et la relire à la baisse perdrait ce qu'elle sait
   * en trop. C'est le seul cas où le rejet reste la bonne réponse.
   */
  if (input.version > SAVE_VERSION) return null

  while (input.version! < SAVE_VERSION) {
    const from = input.version!
    const step = migrations[from]
    if (!step) return null
    const next = step({ ...input } as Record<string, unknown>) as Partial<SaveState>
    // Une migration qui n'avance pas boucle indéfiniment : on préfère refuser.
    if (typeof next?.version !== 'number' || next.version <= from) return null
    input = next
  }

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
  const { current } = useGame()

  /*
   * Un jeu de refs par jeu, toutes créées ici, de façon synchrone.
   *
   * `useState` est appelé pour *tous* les jeux à chaque appel du composable,
   * et non pour le seul jeu actif : les appeler paresseusement depuis un
   * `computed` sortirait du contexte de setup de Nuxt. Il y a deux jeux, la
   * dépense est nulle, et l'état de chacun reste strictement cloisonné.
   */
  const buckets = new Map(
    games.map(game => [game.id, {
      state: useState<SaveState>(`save:${game.id}`, createEmptySave),
      ready: useState<boolean>(`save-ready:${game.id}`, () => false),
      /**
       * Horodatage tenu HORS de `state`.
       *
       * Le plugin surveille `state` en profondeur ; si `persist()` écrivait
       * `updatedAt` dedans, chaque écriture déclencherait le watcher, qui
       * replanifierait une écriture — une boucle infinie d'accès au localStorage.
       */
      lastSavedAt: useState<string | null>(`save-updated-at:${game.id}`, () => null),
      /** Copie de secours présente dans le stockage, s'il y en a une. */
      backup: useState<SaveBackup | null>(`save-backup:${game.id}`, () => null),
      /** Vrai quand c'est *cette* session qui vient de rejeter une sauvegarde. */
      justRejected: useState<boolean>(`save-just-rejected:${game.id}`, () => false),
    }] as const),
  )

  const bucket = () => buckets.get(current.value.id)!

  /*
   * Ces `computed` suivent le jeu actif. Le `set` est nécessaire : `importJson`
   * et `reset` remplacent l'état entier, pas seulement ses champs.
   */
  const state = computed<SaveState>({
    get: () => bucket().state.value,
    set: (value) => { bucket().state.value = value },
  })
  const ready = computed({
    get: () => bucket().ready.value,
    set: (value) => { bucket().ready.value = value },
  })
  const lastSavedAt = computed({
    get: () => bucket().lastSavedAt.value,
    set: (value) => { bucket().lastSavedAt.value = value },
  })
  const backup = computed({
    get: () => bucket().backup.value,
    set: (value) => { bucket().backup.value = value },
  })
  const justRejected = computed({
    get: () => bucket().justRejected.value,
    set: (value) => { bucket().justRejected.value = value },
  })

  const STORAGE_KEY = computed(() => current.value.saveKey)
  const BACKUP_KEY = computed(() => current.value.backupKey)
  const contentDefaults = computed(() => current.value.contentDefaults)
  const knownContent = computed(() => current.value.knownContent)

  /* --- Copie de secours ------------------------------------------------- */

  function writeBackup(payload: string, reason: SaveBackup['reason']) {
    const entry: SaveBackup = { reason, savedAt: new Date().toISOString(), payload }
    try {
      localStorage.setItem(BACKUP_KEY.value, JSON.stringify(entry))
      backup.value = entry
    }
    catch (error) {
      // Quota plein, ou stockage refusé : on n'a rien de mieux à proposer que
      // de le dire. Surtout ne pas faire échouer l'hydratation pour autant.
      console.error('[save] copie de secours impossible', error)
    }
  }

  function readBackup(): SaveBackup | null {
    try {
      const stored = localStorage.getItem(BACKUP_KEY.value)
      if (!stored) return null
      const parsed = JSON.parse(stored) as Partial<SaveBackup>
      if (typeof parsed?.payload !== 'string') return null
      const reasons: SaveBackup['reason'][] = ['rejected', 'reset', 'replaced']
      return {
        reason: reasons.includes(parsed.reason!) ? parsed.reason! : 'rejected',
        savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
        payload: parsed.payload,
      }
    }
    catch {
      return null
    }
  }

  function discardBackup() {
    try {
      localStorage.removeItem(BACKUP_KEY.value)
    }
    catch (error) {
      console.error('[save] suppression de la copie impossible', error)
    }
    backup.value = null
    justRejected.value = false
  }

  /**
   * Copie de secours à la demande, pour un appelant qui s'apprête à écraser
   * l'état — la synchronisation avant d'adopter une sauvegarde distante.
   */
  function backupNow(reason: SaveBackup['reason']) {
    writeBackup(exportJson(), reason)
  }

  /**
   * Relit une sauvegarde sérialisée sans l'adopter.
   *
   * `importJson` remplace l'état ; la synchronisation, elle, doit d'abord
   * *comparer* le distant au local avant de décider qui gagne.
   */
  function parseSave(text: string): SaveState | null {
    try {
      return normalize(JSON.parse(text))
    }
    catch {
      return null
    }
  }

  /** Appelé une seule fois, par le plugin client. */
  function hydrate() {
    if (ready.value) return
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY.value)
      if (stored) {
        const parsed = normalize(JSON.parse(stored))
        if (parsed) {
          state.value = parsed
          lastSavedAt.value = parsed.updatedAt
        }
        else {
          // Avant que le premier `persist()` n'écrase ces octets.
          writeBackup(stored, 'rejected')
          justRejected.value = true
          console.warn('[save] sauvegarde ignorée : version ou forme inattendue — copie de secours conservée')
        }
      }
    }
    catch (error) {
      // JSON invalide : les octets restent récupérables, eux.
      if (stored) {
        writeBackup(stored, 'rejected')
        justRejected.value = true
      }
      console.error('[save] lecture impossible, on repart d’une sauvegarde vide', error)
    }
    backup.value ??= readBackup()
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
      localStorage.setItem(STORAGE_KEY.value, JSON.stringify(payload))
      lastSavedAt.value = payload.updatedAt
    }
    catch (error) {
      console.error('[save] écriture impossible', error)
    }
  }

  /* --- Tâches ---------------------------------------------------------- */

  function isDone(id: TaskId): boolean {
    return state.value.tasks[id] ?? contentDefaults.value.get(id) ?? false
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
    // Même filet que pour une sauvegarde illisible : la remise à zéro est
    // confirmée, donc voulue, mais elle reste irréversible côté écran.
    writeBackup(exportJson(), 'reset')
    state.value = createEmptySave()
    persist()
  }

  /* --- Purge des clés mortes ------------------------------------------- */

  /** Ce que la purge supprimerait, sans rien supprimer. */
  const orphans = computed(() => findOrphans(state.value, knownContent.value))

  function prune() {
    const report = orphans.value
    state.value = pruneSave(state.value, knownContent.value)
    persist()
    return report
  }

  return {
    state,
    ready: readonly(ready),
    lastSavedAt: readonly(lastSavedAt),
    backup: readonly(backup),
    justRejected: readonly(justRejected),
    discardBackup,
    backupNow,
    parseSave,
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
