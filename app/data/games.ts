import type { CompletionEntry, CompletionGroup } from '~/utils/completion'
import type { NavItem } from '~/utils/navigation'
import type { KnownContent } from '~/utils/prune'
import type { TaskEntry } from '~/utils/tasks'
import type {
  AbilityEntry,
  BattleItem,
  Consumable,
  CounterDef,
  EncounterMethodId,
  EncounterZone,
  FarmingTopic,
  GlossaryEntry,
  Npc,
  Phase,
  PokedexEntry,
  PokemonSheet,
  ReadinessCriterion,
  ReferenceSection,
  TaskId,
  TmEntry,
  Tool,
} from './types'
import { buildTaskEntries } from '~/utils/tasks'
import { eliteReduxContent } from './elite-redux'
import { emeraldSeaglassContent } from './emerald-seaglass'
import { unboundContent } from './unbound'

/**
 * Registre des jeux suivis par l'app.
 *
 * ## Pourquoi une clé de sauvegarde par jeu
 *
 * Chaque jeu a sa propre clé `localStorage` et son propre `SaveState`, plutôt
 * qu'un objet enveloppe qui les contiendrait tous. La raison est unique et
 * suffit : `pokemon-companion:save` reste **exactement** la sauvegarde Unbound
 * telle qu'elle existait avant le multi-jeux. Aucun bump de `SAVE_VERSION`,
 * aucune migration, donc aucun risque sur une partie en cours — et tout le code
 * qui peut faire perdre une progression (`normalize()`, `migrations`, la purge,
 * `decideSync`) continue d'opérer sur un `SaveState` unique, sans être retouché.
 *
 * ## Ce que ça change pour les ids
 *
 * Les ids ne sont plus uniques globalement, seulement **par jeu** : deux
 * sauvegardes distinctes ne se croisent jamais. Elite Redux peut donc utiliser
 * `phase-1.x` sans entrer en conflit avec les `phase-1.x` retirés d'Unbound.
 * La réserve d'ids documentée dans `CLAUDE.md` (`phase-0.x`..`phase-4.x`,
 * `quest:`) vaut pour **Unbound et lui seul**.
 *
 * En revanche, à l'intérieur d'un jeu, la règle est inchangée : un id écrit dans
 * une sauvegarde ne se renomme jamais.
 */

export type GameId = 'unbound' | 'elite-redux' | 'emerald-seaglass'

/** Ce qu'un jeu doit fournir pour que la machinerie commune fonctionne. */
export interface GameContent {
  phases: Phase[]
  pokemon: PokemonSheet[]
  readinessCriteria: ReadinessCriterion[]
  /** Groupes de complétion déjà assemblés, dans leur ordre éditorial. */
  completionGroups: CompletionGroup[]
  counters: CounterDef[]
  /**
   * Toutes les clés `<préfixe>:<id>` que ce jeu peut légitimement voir cochées,
   * hors objectifs de complétion (déduits de `completionGroups`).
   *
   * Sert la purge : une catégorie oubliée ici verrait ses cases prises pour des
   * orphelines et effacées.
   */
  resourceKeys: string[]
  /** Entrées de navigation, routes relatives à la racine du jeu. */
  nav: NavItem[]

  /**
   * Textes du dashboard qui **nomment le contenu du jeu**.
   *
   * Même motif que `reference.descriptions`, et pour la même raison : ils étaient
   * écrits en dur dans le template, avec le vocabulaire d'Unbound. Le dashboard
   * d'Emerald Seaglass annonçait donc « missions, tutors et collectibles »,
   * « Équipe & **Frontier** » et des prérequis en `Macho Brace` et `Bottle Caps`
   * — quatre choses que ce jeu n'a pas. Aucune erreur, juste du texte faux.
   *
   * Facultatif : les replis du template sont neutres, jamais empruntés à un
   * autre jeu.
   */
  dashboard?: {
    /** Ce que comptent les entrées de complétion, ex. « missions, objets clés ». */
    completionSummary?: string
    /** Libellé du badge qui porte `overall`, ex. « Équipe & Frontier ». */
    overallLabel?: string
    /** Pourquoi une tâche n'apparaît pas encore dans « prochaines actions ». */
    nextActionsHint?: string
    /** Message quand plus rien n'est actionnable ni bloqué. */
    allDone?: string
  }

  /*
   * Deux pages facultatives. Un jeu qui ne les fournit pas ne les met pas non
   * plus dans sa `nav` ; la page répond alors 404 plutôt que de se rendre vide,
   * pour qu'une URL tapée à la main dise la vérité.
   */
  reference?: {
    mechanics: ReferenceSection[]
    tools: Tool[]
    glossary: GlossaryEntry[]
    /**
     * Chapeaux des sections de la page, propres au jeu.
     *
     * Ils citaient le guide d'Unbound en dur dans le template (« §13.1 — … »),
     * ce qui n'a aucun sens pour un jeu qui n'a pas de guide numéroté.
     */
    descriptions?: Partial<Record<
      'mechanics' | 'natures' | 'tools' | 'glossary' | 'encounters' | 'abilities' | 'pokedex' | 'tms',
      string
    >>
    /**
     * Jeux de données **générés**, tous facultatifs. Un jeu qui ne les fournit
     * pas ne rend pas la section correspondante.
     *
     * Le choix n'est pas éditorial mais dicté par ce que la source publie :
     * Elite Redux a un code ouvert, donc des tables de rencontre complètes
     * (taux, slots, niveaux) ; Seaglass n'a qu'un dex tiers, sans aucun de ces
     * trois champs — d'où un `pokedex` et **pas** d'`encounters`, que remplir de
     * zéros aurait été inventer de la donnée.
     */
    encounters?: EncounterZone[]
    abilities?: AbilityEntry[]
    pokedex?: PokedexEntry[]
    tms?: TmEntry[]
  }
  resources?: {
    npcs: Npc[]
    battleItems: BattleItem[]
    battleItemsTip?: string
    consumables: Consumable[]
    farmingTopics: FarmingTopic[]
  }
}

export interface Game {
  id: GameId
  /** Nom affiché, en VO comme le jeu l'écrit. */
  label: string
  /** Une ligne de contexte sous le nom, dans la barre latérale. */
  subtitle: string
  /** Préfixe de route, sans barre finale. */
  basePath: string
  /** Clé `localStorage` de la sauvegarde. Ne jamais la changer. */
  saveKey: string
  /** Clé de la copie de secours associée. */
  backupKey: string
  /** Nom du fichier dans le gist de synchronisation. Ne jamais le changer. */
  gistFile: string
  content: GameContent

  /* --- Dérivés, calculés une fois à l'import ---------------------------- */
  pokemonBySlug: Map<string, PokemonSheet>
  taskEntries: TaskEntry[]
  taskEntriesById: Map<TaskId, TaskEntry>
  completionEntries: CompletionEntry[]
  /**
   * Défaut de chaque tâche. `state.tasks` ne stocke QUE les choix explicites de
   * l'utilisateur : une tâche absente retombe ici, donc ajouter une tâche au
   * contenu respecte son `done` sans migrer la sauvegarde.
   */
  contentDefaults: Map<TaskId, boolean>
  knownContent: KnownContent
  /**
   * Index inversé des rencontres : « où trouve-t-on cette espèce ».
   *
   * Dérivé du contenu plutôt que généré, sur le même motif que `pokemonBySlug` —
   * la donnée n'existe qu'une fois, et le fichier généré reste lisible. Vide
   * pour un jeu sans encounters.
   */
  encountersBySpecies: Map<string, SpeciesEncounter[]>
}

/** Une occurrence d'espèce, aplatie pour l'affichage « où trouver X ». */
export interface SpeciesEncounter {
  zoneId: string
  zoneLabel: string
  method: EncounterMethodId
  slots: number
  min: number
  max: number
}

interface GameDef {
  id: GameId
  label: string
  subtitle: string
  saveKey: string
  gistFile: string
  content: GameContent
}

function defineGame(def: GameDef): Game {
  const { content } = def
  const basePath = `/${def.id}`
  const taskEntries = buildTaskEntries(content.phases, content.pokemon, basePath)
  const completionEntries = content.completionGroups.flatMap(group => group.entries)

  return {
    ...def,
    basePath,
    backupKey: `${def.saveKey}:backup`,
    pokemonBySlug: new Map(content.pokemon.map(mon => [mon.slug, mon])),
    taskEntries,
    taskEntriesById: new Map(taskEntries.map(entry => [entry.task.id, entry])),
    completionEntries,
    contentDefaults: new Map(
      taskEntries.map(entry => [entry.task.id, entry.task.done ?? false] as const),
    ),
    knownContent: {
      taskIds: new Set([
        ...taskEntries.map(entry => entry.task.id),
        /*
         * Les cases « Ready » vivent dans `state.tasks` sans exister nulle part
         * dans le contenu : leur id est fabriqué à la volée par `useProgress`
         * (`ready-<slug>-<key>`). Sans elles, la purge les prendrait toutes pour
         * des orphelines.
         */
        ...content.pokemon.flatMap(mon =>
          content.readinessCriteria.map(criterion => `ready-${mon.slug}-${criterion.key}`),
        ),
      ]),
      /*
       * Le pokedex de référence entre ici aussi, quand il existe : c'est de là
       * que `useRoster` synthétise une fiche pour une espèce capturée en jeu
       * (`state.catches`), sans qu'une fiche statique existe. Sans cette
       * ligne, « Nettoyer » verrait chaque capture comme orpheline dès le
       * premier passage.
       */
      slugs: new Set([
        ...content.pokemon.map(mon => mon.slug),
        ...(content.reference?.pokedex?.map(entry => entry.id) ?? []),
      ]),
      resourceKeys: new Set([
        ...content.resourceKeys,
        ...completionEntries.map(entry => entry.key),
      ]),
      counterIds: new Set(content.counters.map(counter => counter.id)),
    },
    encountersBySpecies: indexBySpecies(content.reference?.encounters ?? []),
  }
}

function indexBySpecies(zones: EncounterZone[]): Map<string, SpeciesEncounter[]> {
  const index = new Map<string, SpeciesEncounter[]>()
  for (const zone of zones) {
    for (const method of zone.methods) {
      for (const slot of method.slots) {
        const list = index.get(slot.species) ?? []
        list.push({
          zoneId: zone.id,
          zoneLabel: zone.label,
          method: method.method,
          slots: slot.slots,
          min: slot.min,
          max: slot.max,
        })
        index.set(slot.species, list)
      }
    }
  }
  /* Le niveau minimum d'abord : c'est l'ordre utile sous un level cap. */
  for (const list of index.values()) list.sort((a, b) => a.min - b.min || a.zoneLabel.localeCompare(b.zoneLabel))
  return index
}

export const games: Game[] = [
  defineGame({
    id: 'unbound',
    label: 'Pokémon Unbound',
    subtitle: 'post-game',
    /*
     * Valeurs historiques, antérieures au multi-jeux. Les changer perdrait la
     * sauvegarde en cours et le gist déjà en place.
     */
    saveKey: 'pokemon-companion:save',
    gistFile: 'pokemon-companion.json',
    content: unboundContent,
  }),
  defineGame({
    id: 'elite-redux',
    label: 'Pokémon Elite Redux',
    subtitle: 'mode Elite',
    saveKey: 'pokemon-companion:save:elite-redux',
    gistFile: 'pokemon-companion.elite-redux.json',
    content: eliteReduxContent,
  }),
  defineGame({
    id: 'emerald-seaglass',
    label: 'Pokémon Emerald Seaglass',
    subtitle: 'première partie',
    saveKey: 'pokemon-companion:save:emerald-seaglass',
    gistFile: 'pokemon-companion.emerald-seaglass.json',
    content: emeraldSeaglassContent,
  }),
]

export const gamesById = new Map(games.map(game => [game.id, game]))

/** Jeu servi quand aucun choix n'est enregistré, ou qu'il est illisible. */
export const DEFAULT_GAME_ID: GameId = 'unbound'

export const isGameId = (value: unknown): value is GameId =>
  typeof value === 'string' && gamesById.has(value as GameId)

export function gameById(id: GameId): Game {
  const game = gamesById.get(id)
  if (!game) throw new Error(`jeu inconnu : ${id}`)
  return game
}
