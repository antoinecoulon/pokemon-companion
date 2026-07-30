import type { PartialStats, StatKey, StatSpread } from '~/utils/stats'

/* ------------------------------------------------------------------------- *
 * Identifiants
 *
 * Les ids sont le contrat de durabilité avec le localStorage : l'état persisté
 * ne référence le contenu que par id. Renommer un libellé est sans effet ;
 * changer un id perd la case cochée correspondante. Ils sont donc figés.
 *
 *   phase-<n>.<m>        tâche de la roadmap générale (§5)   ex. 'phase-1.4'
 *   mon-<slug>-<n>       tâche d'une fiche Pokémon (§6)      ex. 'mon-tyranitar-4'
 *   ready-<slug>-<key>   case « Endgame Ready » (§13.2)      ex. 'ready-togekiss-level'
 * ------------------------------------------------------------------------- */

export type TaskId = string

/* ------------------------------------------------------------------------- *
 * Blocs de contenu
 *
 * Le guide mélange prose, listes, citations d'avertissement, tableaux et blocs
 * de code ASCII. Plutôt que d'embarquer un moteur markdown, on modélise ces
 * cinq formes : elles couvrent l'intégralité du document et se rendent avec un
 * seul composant (ContentBlocks).
 *
 * Le formatage inline supporté est `**gras**`, `*italique*` et `` `code` ``.
 * ------------------------------------------------------------------------- */

export type Block =
  | { kind: 'p', text: string }
  | { kind: 'list', items: string[], ordered?: boolean }
  | { kind: 'quote', text: string, tone?: 'info' | 'warning' | 'tip' | 'success' }
  | { kind: 'table', head: string[], rows: string[][], caption?: string }
  | { kind: 'code', text: string }

/* ------------------------------------------------------------------------- *
 * Tâches et phases (§5)
 * ------------------------------------------------------------------------- */

export interface Task {
  id: TaskId
  label: string
  /** Sous-puces du guide, rendues sous la tâche. */
  details?: string[]
  /** Ids de tâches qui doivent être cochées avant que celle-ci soit actionnable. */
  requires?: TaskId[]
  /** Plus petit = proposé plus tôt dans « prochaines actions ». Défaut : 50. */
  priority?: number
  /** État initial repris des `[x]` du guide markdown. */
  done?: boolean
  /** Renvoi vers la section source, ex. '§6.1'. */
  ref?: string
  /** Route interne à ouvrir depuis la tâche, ex. '/equipe/tyranitar'. */
  link?: string
  /** Marque une tâche clé (🔑 dans le guide). */
  key?: boolean
}

export interface Phase {
  id: string
  number: number
  title: string
  subtitle?: string
  intro?: Block[]
  tasks: Task[]
}

/* ------------------------------------------------------------------------- *
 * Fiches Pokémon (§6, §7.3)
 * ------------------------------------------------------------------------- */

export type PokemonStatus =
  /** Membre de la composition finale validée (§7.3). */
  | 'active'
  /** Sorti de l'équipe de combat (§6.4, §6.5). */
  | 'retired'
  /** Gardé en boîte pour la capture et le farm (§6.7). */
  | 'utility'

export interface Ability {
  name: string
  /** Talent caché : nécessite Dream Ball ou Dream Mist, pas une Ability Capsule. */
  hidden?: boolean
}

export interface Build {
  id: string
  name: string
  tagline?: string
  /** Nature cible, forme complète : 'Rigide (Adamant)'. */
  nature: string
  /** Nom français seul, pour comparer à la nature saisie : 'Rigide'. */
  natureFr: string
  evs: PartialStats
  item: string
  moves: string[]
  ability?: string
  notes?: string[]
  recommended?: boolean
}

export interface IvGuidance {
  /** Stats sur lesquelles dépenser les Bottle Caps en priorité. */
  focus: StatKey[]
  /** Stats à ne pas toucher (§13.2 : l'Attaque d'un attaquant spécial reste basse). */
  ignore: StatKey[]
  note?: string
}

export interface PokemonSheet {
  slug: string
  name: string
  /** Nom anglais, utile pour chercher sur RomHackDex / Smogon. */
  nameEn?: string
  /**
   * Slug pokemondb, qui nomme les fichiers de `public/sprites/`. Absent sur les
   * fiches concept (mule à objets, porteur de Synchro) : ce ne sont pas des
   * Pokémon, ils n'ont pas de sprite. Voir `scripts/fetch-sprites.mjs`.
   */
  sprite?: string
  /** Slot dans la composition finale (§7.3), pour les actifs uniquement. */
  slot?: number
  status: PokemonStatus
  /** Rôle tenu dans l'équipe, tel que défini en §7.3. */
  role: string
  types: string[]
  baseStats?: StatSpread
  bst?: number
  abilities?: Ability[]
  /** Talent visé par le build recommandé. */
  targetAbility?: string
  mega?: { stone: string, stats: StatSpread, bst: number, note?: string }
  obtention?: string
  /** Étiquette de statut du guide : 'Conservé', 'Nouveau', 'Sorti de l'équipe'. */
  badge?: string
  analysis?: Block[]
  /** Mises au point qui précèdent l'analyse (§6.2). */
  preamble?: Block[]
  builds?: Build[]
  ivGuidance?: IvGuidance
  tasks?: Task[]
  /**
   * Fiche absente du guide source : §7.3 place ce Pokémon dans l'équipe mais §6
   * ne lui consacre aucune fiche. On ne fabrique pas de build à sa place.
   */
  incomplete?: boolean
  incompleteNote?: string
  /** Contenu libre supplémentaire (§6.7 pour les utilitaires). */
  extra?: Block[]
}

/* ------------------------------------------------------------------------- *
 * Checklist « Endgame Ready » (§13.2)
 * ------------------------------------------------------------------------- */

export type ReadinessKey
  = | 'level'
    | 'ivs'
    | 'evs'
    | 'nature'
    | 'ability'
    | 'moves'
    | 'item'

export interface ReadinessCriterion {
  key: ReadinessKey
  label: string
  /** true = déduit du formulaire, sans case à cocher manuelle. */
  derived: boolean
  hint?: string
}

/* ------------------------------------------------------------------------- *
 * Ressources (§8, §9, §11, §12)
 * ------------------------------------------------------------------------- */

export interface Npc {
  id: string
  service: string
  location: string
  cost: string
  /** Priorité du guide, de 1 à 5 étoiles. */
  priority: number
  note?: string
}

export interface BattleItem {
  id: string
  name: string
  effect: string
  /** Prix au Battle Tower, ou '—' si non vendu. */
  bp: string
  alternative?: string
}

export interface Consumable {
  id: string
  name: string
  role: string
  source: string
}

export interface Quest {
  id: string
  code: string
  name: string
  location: string
  reward: string
  interest: number
  note?: string
}

export interface FarmingTopic {
  id: string
  title: string
  blocks: Block[]
}

/* ------------------------------------------------------------------------- *
 * Référence (§1–4, §10, §13)
 * ------------------------------------------------------------------------- */

export interface ReferenceSection {
  id: string
  title: string
  /** Numéro de section du guide, affiché comme repère. */
  ref?: string
  blocks: Block[]
  subsections?: ReferenceSection[]
}

export interface Nature {
  fr: string
  en: string
  up: StatKey
  down: StatKey
  /** Usage recommandé (§2.3, renseigné pour les 8 natures utiles seulement). */
  usage?: string
}

export interface GlossaryEntry {
  term: string
  definition: string
}

export interface Tool {
  name: string
  url: string
  usage: string
}

/* ------------------------------------------------------------------------- *
 * Compteurs de ressources
 * ------------------------------------------------------------------------- */

export interface CounterDef {
  id: string
  label: string
  icon: string
  /** Objectif chiffré fixé par le guide, quand il en donne un. */
  goal?: number
  hint?: string
}

/* ------------------------------------------------------------------------- *
 * État persisté
 * ------------------------------------------------------------------------- */

export interface PokemonProgress {
  /** Id du build choisi (§6 : « ne saute pas cette étape »). */
  buildId?: string
  level?: number
  ivs: PartialStats
  evs: PartialStats
  /** Nature actuelle, nom français. */
  nature?: string
  ability?: string
  /** Toujours 4 entrées, chaînes vides incluses. */
  moves: string[]
  item?: string
  notes?: string
}

export interface JournalEntry {
  id: string
  /** Date ISO (YYYY-MM-DD). */
  date: string
  title: string
  body: string
}

export const SAVE_VERSION = 1

/**
 * Clé d'une ressource acquise : `<catégorie>:<id>`.
 *
 * Le préfixe n'est pas décoratif — `objets-pouvoir` existe à la fois comme id de
 * consommable (§9) et de quête (§12). Sans namespace, cocher l'un cocherait
 * l'autre.
 */
export type ResourceKey = `npc:${string}` | `quest:${string}`

export interface SaveState {
  version: typeof SAVE_VERSION
  tasks: Record<TaskId, boolean>
  pokemon: Record<string, PokemonProgress>
  counters: Record<string, number>
  /** Ressources obtenables une seule fois, cochées comme acquises. */
  resources: Record<string, boolean>
  journal: JournalEntry[]
  updatedAt: string
}
