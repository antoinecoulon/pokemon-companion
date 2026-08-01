import type { SaveState } from '~/data/types'
import type { SyncMarkers } from '~/utils/sync'
import { games } from '~/data/games'
import { decideSync, markerAfter, readMarkers } from '~/utils/sync'

/**
 * Synchronisation de la sauvegarde entre appareils, via un gist privé GitHub.
 *
 * Pourquoi un gist plutôt qu'un backend : l'app est un site statique, sans
 * serveur où faire vivre quoi que ce soit. Le gist est un stockage que le
 * joueur possède déjà, privé, versionné par GitHub, et qui ne demande ni compte
 * à créer ni service à payer.
 *
 * Le `localStorage` reste la source de vérité : on joue hors-ligne, la
 * synchronisation n'est qu'un aller-retour opportuniste par-dessus. Elle ne
 * bloque jamais l'interface et son échec n'empêche jamais de cocher une case.
 *
 * La règle de conflit est « le plus récent gagne », décidée par `decideSync`
 * (voir `app/utils/sync.ts`, testé par `pnpm test:sync`). Le perdant d'une
 * divergence part en copie de secours avant d'être écrasé.
 *
 * ## Multi-jeux
 *
 * Un seul gist, mais **un fichier par jeu** — et un marqueur par jeu. Chaque
 * sauvegarde garde donc son propre historique de synchronisation, et
 * `decideSync` continue de raisonner sur une seule paire local/distant, sans
 * rien savoir des autres jeux.
 *
 * Le fichier d'Unbound garde son nom d'origine : un gist déjà en place reste
 * reconnu et continue de fonctionner sans intervention.
 *
 * `sync()` ne traite que le jeu ouvert. Synchroniser les deux d'un coup
 * doublerait les appels réseau à chaque ouverture pour une sauvegarde qu'on ne
 * regarde pas ; le plugin relance donc une synchro à chaque bascule de jeu.
 */

const CONFIG_KEY = 'pokemon-companion:sync'
/** Nom du fichier d'Unbound, antérieur au multi-jeux : sert à retrouver le gist. */
const LEGACY_GIST_FILENAME = 'pokemon-companion.json'
const GIST_DESCRIPTION = 'Pokémon Companion — sauvegarde (ne pas supprimer)'
const API = 'https://api.github.com'

/**
 * Configuration propre à l'appareil.
 *
 * Volontairement HORS de `SaveState` : le token n'a rien à faire dans un export
 * JSON qu'on s'envoie par mail, ni dans le gist lui-même. Il ne passe donc ni
 * par `normalize()`, ni par la purge, ni par `knownContent`.
 */
interface SyncConfig {
  token: string
  gistId: string | null
  /** Un marqueur par jeu : deux sauvegardes ne partagent pas leur historique. */
  markers: SyncMarkers
}

export type SyncStatus = 'unconfigured' | 'idle' | 'syncing' | 'ok' | 'offline' | 'error'

interface GistFile { content?: string, truncated?: boolean, raw_url?: string }
interface Gist { id: string, files?: Record<string, GistFile> }

function readConfig(): SyncConfig | null {
  try {
    const stored = localStorage.getItem(CONFIG_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as Partial<SyncConfig>
    if (typeof parsed?.token !== 'string' || !parsed.token) return null
    return {
      token: parsed.token,
      gistId: typeof parsed.gistId === 'string' ? parsed.gistId : null,
      /*
       * Reprend l'ancien `marker` unique sur Unbound quand la config date
       * d'avant le multi-jeux. Le jeter ferait passer la première synchro
       * suivante pour une divergence — donc un écrasement. Testé par
       * `pnpm test:sync`.
       */
      markers: readMarkers(parsed, games.map(game => game.id), 'unbound'),
    }
  }
  catch {
    return null
  }
}

export function useSync() {
  const { state, exportJson, importJson, parseSave, backupNow, persist } = useSave()
  const { current } = useGame()

  const config = useState<SyncConfig | null>('sync-config', () => null)
  const status = useState<SyncStatus>('sync-status', () => 'unconfigured')
  const lastError = useState<string | null>('sync-error', () => null)
  const lastSyncedAt = useState<string | null>('sync-at', () => null)
  /** Dernier verdict rendu, pour que l'écran puisse dire ce qui s'est passé. */
  const lastOutcome = useState<string | null>('sync-outcome', () => null)
  /** Une divergence a fait une victime : elle est dans la copie de secours. */
  const lastOverwrote = useState<boolean>('sync-overwrote', () => false)

  const configured = computed(() => !!config.value)

  function writeConfig(next: SyncConfig | null) {
    config.value = next
    try {
      if (next) localStorage.setItem(CONFIG_KEY, JSON.stringify(next))
      else localStorage.removeItem(CONFIG_KEY)
    }
    catch (error) {
      console.error('[sync] configuration non enregistrée', error)
    }
  }

  /** Chargée par le plugin, une fois, au démarrage. */
  function load() {
    config.value = readConfig()
    status.value = config.value ? 'idle' : 'unconfigured'
  }

  /* --- Accès à l'API GitHub -------------------------------------------- */

  async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = config.value?.token
    if (!token) throw new Error('Aucun token enregistré sur cet appareil.')

    const response = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    })

    if (response.status === 401 || response.status === 403) {
      throw new Error('Token refusé par GitHub — il a expiré, ou il n’a pas la portée « gist ».')
    }
    if (response.status === 404) {
      throw new Error('Gist introuvable — il a peut-être été supprimé depuis un autre appareil.')
    }
    if (!response.ok) {
      throw new Error(`GitHub a répondu ${response.status}.`)
    }
    return response.json() as Promise<T>
  }

  /**
   * Retrouve le gist de sauvegarde, ou le crée.
   *
   * On le retrouve par son nom de fichier plutôt que par son id : ça permet de
   * relier un second appareil sans avoir à recopier l'id à la main.
   */
  async function findOrCreateGist(): Promise<string> {
    if (config.value?.gistId) return config.value.gistId

    /*
     * On cherche n'importe quel fichier de jeu connu, plus le nom historique :
     * le gist a pu être créé par un autre jeu, ou avant le multi-jeux.
     */
    const known = new Set([LEGACY_GIST_FILENAME, ...games.map(game => game.gistFile)])
    const gists = await api<Gist[]>('/gists?per_page=100')
    const found = gists.find(gist =>
      gist.files && Object.keys(gist.files).some(name => known.has(name)),
    )
    if (found) return found.id

    const created = await api<Gist>('/gists', {
      method: 'POST',
      body: JSON.stringify({
        description: GIST_DESCRIPTION,
        public: false,
        files: { [current.value.gistFile]: { content: exportJson() } },
      }),
    })
    return created.id
  }

  async function fetchRemote(gistId: string): Promise<SaveState | null> {
    const gist = await api<Gist>(`/gists/${gistId}`)
    const file = gist.files?.[current.value.gistFile]
    // Fichier absent : ce jeu n'a simplement jamais été envoyé sur ce gist.
    if (!file) return null

    /*
     * Au-delà d'un mégaoctet, GitHub tronque le contenu inline et ne donne
     * qu'une URL brute. Une sauvegarde fait quelques kilo-octets, donc ça
     * n'arrivera pas — mais adopter un JSON tronqué écraserait tout par une
     * sauvegarde amputée, alors autant traiter le cas.
     */
    const text = file.truncated && file.raw_url
      ? await fetch(file.raw_url).then(response => response.text())
      : file.content

    if (!text?.trim()) return null

    const parsed = parseSave(text)
    if (!parsed) throw new Error('La sauvegarde distante n’a pas pu être relue (version ou forme inattendue).')
    return parsed
  }

  async function pushTo(gistId: string, payload: string) {
    await api(`/gists/${gistId}`, {
      method: 'PATCH',
      body: JSON.stringify({ files: { [current.value.gistFile]: { content: payload } } }),
    })
  }

  /** Config mise à jour avec le seul marqueur du jeu ouvert. */
  function withMarker(config: SyncConfig, marker: SyncMarkers[string]): SyncConfig {
    return { ...config, markers: { ...config.markers, [current.value.id]: marker } }
  }

  /* --- Synchronisation -------------------------------------------------- */

  function fail(message: string) {
    lastError.value = message
    status.value = navigator.onLine === false ? 'offline' : 'error'
  }

  /**
   * Un aller-retour complet. Ne lève jamais : un échec réseau est un état, pas
   * une exception — on joue hors-ligne la moitié du temps.
   */
  async function sync(): Promise<boolean> {
    if (!config.value) return false
    if (status.value === 'syncing') return false

    if (navigator.onLine === false) {
      status.value = 'offline'
      lastError.value = null
      return false
    }

    status.value = 'syncing'
    lastError.value = null
    lastOverwrote.value = false

    try {
      const gistId = await findOrCreateGist()
      if (gistId !== config.value.gistId) {
        writeConfig({ ...config.value, gistId })
      }

      const remote = await fetchRemote(gistId)
      const decision = decideSync(state.value, remote, config.value!.markers[current.value.id]!)
      lastOutcome.value = decision.reason

      if (decision.action === 'pull' && remote) {
        // Le local va disparaître : on en garde une copie récupérable.
        if (decision.diverged) {
          backupNow('replaced')
          lastOverwrote.value = true
        }
        const result = importJson(JSON.stringify(remote))
        if (!result.ok) throw new Error(result.error)
        writeConfig(withMarker(config.value!, markerAfter(state.value, remote)))
      }
      else if (decision.action === 'push') {
        // On fige l'horodatage envoyé, sinon le marqueur ne correspondrait plus.
        persist()
        const payload = exportJson()
        const sent = parseSave(payload)!
        await pushTo(gistId, payload)
        writeConfig(withMarker(config.value!, markerAfter(sent, sent)))
      }

      status.value = 'ok'
      lastSyncedAt.value = new Date().toISOString()
      return true
    }
    catch (error) {
      fail(error instanceof Error ? error.message : 'Synchronisation impossible.')
      return false
    }
  }

  /* --- Configuration ---------------------------------------------------- */

  /** Relie cet appareil, puis synchronise immédiatement. */
  async function configure(token: string): Promise<boolean> {
    const clean = token.trim()
    if (!clean) {
      lastError.value = 'Colle un token pour relier cet appareil.'
      status.value = 'error'
      return false
    }
    writeConfig({ token: clean, gistId: null, markers: readMarkers(undefined, games.map(game => game.id), 'unbound') })
    const ok = await sync()
    // Un token refusé ne doit pas rester enregistré : il ferait échouer chaque
    // ouverture de l'app sans qu'on sache pourquoi.
    if (!ok && status.value === 'error') writeConfig(null)
    if (!config.value) status.value = 'unconfigured'
    return ok
  }

  /** Délie cet appareil. Le gist et la sauvegarde locale restent intacts. */
  function unlink() {
    writeConfig(null)
    status.value = 'unconfigured'
    lastError.value = null
    lastOutcome.value = null
    lastSyncedAt.value = null
  }

  return {
    configured,
    status: readonly(status),
    lastError: readonly(lastError),
    lastOutcome: readonly(lastOutcome),
    lastOverwrote: readonly(lastOverwrote),
    lastSyncedAt: readonly(lastSyncedAt),
    load,
    sync,
    configure,
    unlink,
  }
}
