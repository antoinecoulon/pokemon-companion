import type { Block, Build, IvGuidance, PokemonSheet, PokemonSheetOverride } from '~/data/types'
import { POKEMON_TYPES } from '~/data/types'
import { natures } from '~/data/natures'
import { EV_TOTAL_MAX, STAT_KEYS, statsTotal, type StatKey } from '~/utils/stats'

/**
 * Corrections locales de fiche : le pendant de `roster.ts` pour le contenu
 * plutôt que pour la composition d'équipe.
 *
 * Pas d'invariant multi-opérations à tenir ici (une correction n'a pas besoin
 * de « renuméroter des slots ») : le mécanisme se limite à un remplacement de
 * champ (`applyPokemonOverride`), un nettoyage défensif du JSON importé
 * (`sanitizePokemonOverride`, appelé par `normalize()`) et une validation
 * légère côté formulaire (`validatePokemonOverride`), qui bloque plutôt que de
 * filtrer en silence — l'utilisateur est en train de corriger, pas d'importer
 * un fichier auquel on ne fait pas confiance.
 */

/** Champs éditables, dans l'ordre où l'éditeur les affiche. */
export const OVERRIDABLE_FIELDS = [
  'role', 'types', 'baseStats', 'bst', 'abilities', 'targetAbility',
  'mega', 'obtention', 'badge', 'analysis', 'preamble', 'extra',
  'builds', 'ivGuidance', 'incomplete', 'incompleteNote',
] as const satisfies readonly (keyof PokemonSheetOverride)[]

/**
 * Fusion façon `resolveRoster` : un champ présent dans l'override remplace
 * celui de la fiche.
 *
 * On ne recopie que les champs d'`OVERRIDABLE_FIELDS`, plutôt qu'un `{ ...sheet,
 * ...override }` naïf : le typage protège l'appelant TypeScript, pas un objet
 * qui a transité par du JSON (import, localStorage) où rien ne garantit que
 * `slug`/`status`/`slot`/`sprite`/`tasks` en sont absents.
 */
export function applyPokemonOverride(sheet: PokemonSheet, override: PokemonSheetOverride | undefined): PokemonSheet {
  if (!override) return sheet
  const merged = { ...sheet }
  for (const field of OVERRIDABLE_FIELDS) {
    if (override[field] !== undefined) (merged as Record<string, unknown>)[field] = override[field]
  }
  return merged
}

/** Pour le badge « modifié » d'un champ précis dans l'éditeur. */
export function isFieldOverridden(
  override: PokemonSheetOverride | undefined,
  field: typeof OVERRIDABLE_FIELDS[number],
): boolean {
  return !!override && override[field] !== undefined
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isStatKey(value: unknown): value is StatKey {
  return STAT_KEYS.includes(value as StatKey)
}

function isBaseStats(value: unknown): value is Record<StatKey, number> {
  if (!value || typeof value !== 'object') return false
  return STAT_KEYS.every(key => Number.isFinite((value as Record<string, unknown>)[key]))
}

/** Un bloc de prose reconnu — mêmes cinq formes que `Block` dans `types.ts`. */
function isBlock(value: unknown): value is Block {
  if (!value || typeof value !== 'object') return false
  const block = value as Record<string, unknown>
  switch (block.kind) {
    case 'p': return isString(block.text)
    case 'list': return Array.isArray(block.items) && block.items.every(isString)
    case 'quote': return isString(block.text)
    case 'table': return Array.isArray(block.head) && Array.isArray(block.rows)
    case 'code': return isString(block.text)
    default: return false
  }
}

function sanitizeBlocks(value: unknown): Block[] | undefined {
  if (!Array.isArray(value)) return undefined
  const blocks = value.filter(isBlock)
  return blocks.length > 0 ? blocks : []
}

function sanitizeAbilities(value: unknown) {
  if (!Array.isArray(value)) return undefined
  const abilities = value
    .filter((entry): entry is { name: string, hidden?: boolean } =>
      !!entry && typeof entry === 'object' && isString((entry as Record<string, unknown>).name))
    .map(entry => ({ name: entry.name, ...(entry.hidden === true ? { hidden: true } : {}) }))
  return abilities.length > 0 ? abilities : undefined
}

/** Une entrée de build cohérente — moves à 4 entrées, EV plafonnés, nature connue. */
function isValidBuild(value: unknown): value is Build {
  if (!value || typeof value !== 'object') return false
  const build = value as Record<string, unknown>
  if (!isString(build.id) || !isString(build.name) || !isString(build.nature) || !isString(build.item)) return false
  if (!natures.some(nature => nature.en === build.nature)) return false
  if (!Array.isArray(build.moves) || build.moves.length !== 4 || !build.moves.every(isString)) return false
  if (!build.evs || typeof build.evs !== 'object') return false
  const evs = build.evs as Record<string, unknown>
  if (!Object.keys(evs).every(key => isStatKey(key) && Number.isFinite(evs[key]))) return false
  if (statsTotal(evs) > EV_TOTAL_MAX) return false
  return true
}

function sanitizeBuilds(value: unknown): Build[] | undefined {
  if (!Array.isArray(value)) return undefined
  return value.filter(isValidBuild)
}

function sanitizeIvGuidance(value: unknown): IvGuidance | undefined {
  if (!value || typeof value !== 'object') return undefined
  const guidance = value as Record<string, unknown>
  if (!Array.isArray(guidance.focus) || !guidance.focus.every(isStatKey)) return undefined
  if (!Array.isArray(guidance.ignore) || !guidance.ignore.every(isStatKey)) return undefined
  return {
    focus: guidance.focus,
    ignore: guidance.ignore,
    ...(isString(guidance.note) ? { note: guidance.note } : {}),
  }
}

function sanitizeMega(value: unknown) {
  if (!value || typeof value !== 'object') return undefined
  const mega = value as Record<string, unknown>
  if (!isString(mega.stone) || !isBaseStats(mega.stats) || !Number.isFinite(mega.bst)) return undefined
  return {
    stone: mega.stone,
    stats: mega.stats as Record<StatKey, number>,
    bst: mega.bst as number,
    ...(isString(mega.note) ? { note: mega.note } : {}),
  }
}

/**
 * Nettoyage défensif d'un override lu depuis le localStorage ou un import JSON.
 *
 * Même posture que le reste de `normalize()` : on ne fait confiance qu'à ce
 * qu'on reconnaît par sa forme, champ par champ — un champ invalide est
 * simplement absent du résultat plutôt que de faire rejeter toute l'entrée.
 */
export function sanitizePokemonOverride(value: unknown): PokemonSheetOverride {
  if (!value || typeof value !== 'object') return {}
  const raw = value as Record<string, unknown>
  const clean: PokemonSheetOverride = {}

  if (isString(raw.role)) clean.role = raw.role
  if (Array.isArray(raw.types) && raw.types.every(type => POKEMON_TYPES.includes(type)) && raw.types.length <= 2) {
    clean.types = raw.types
  }
  if (isBaseStats(raw.baseStats)) clean.baseStats = raw.baseStats
  if (Number.isFinite(raw.bst)) clean.bst = raw.bst as number
  const abilities = sanitizeAbilities(raw.abilities)
  if (abilities) clean.abilities = abilities
  if (isString(raw.targetAbility)) clean.targetAbility = raw.targetAbility
  const mega = sanitizeMega(raw.mega)
  if (mega) clean.mega = mega
  if (isString(raw.obtention)) clean.obtention = raw.obtention
  if (isString(raw.badge)) clean.badge = raw.badge
  const analysis = sanitizeBlocks(raw.analysis)
  if (analysis) clean.analysis = analysis
  const preamble = sanitizeBlocks(raw.preamble)
  if (preamble) clean.preamble = preamble
  const extra = sanitizeBlocks(raw.extra)
  if (extra) clean.extra = extra
  const builds = sanitizeBuilds(raw.builds)
  if (builds) clean.builds = builds
  const ivGuidance = sanitizeIvGuidance(raw.ivGuidance)
  if (ivGuidance) clean.ivGuidance = ivGuidance
  if (typeof raw.incomplete === 'boolean') clean.incomplete = raw.incomplete
  if (isString(raw.incompleteNote)) clean.incompleteNote = raw.incompleteNote

  return clean
}

/**
 * Validation légère côté formulaire, avant `save()`.
 *
 * Volontairement moins stricte que `scripts/lib/fiche.mjs` (qui gate le
 * contenu canonique en CI) : ceci est une correction personnelle, pas du
 * contenu partagé — on bloque juste les états manifestement cassés plutôt que
 * de gatekeeper comme le contenu du dépôt. Retourne la liste des erreurs ;
 * vide = patch acceptable.
 */
export function validatePokemonOverride(patch: PokemonSheetOverride): string[] {
  const errors: string[] = []

  if (patch.types && (patch.types.length === 0 || patch.types.length > 2)) {
    errors.push('un Pokémon a 1 ou 2 types, pas plus.')
  }
  if (patch.types?.some(type => !POKEMON_TYPES.includes(type as typeof POKEMON_TYPES[number]))) {
    errors.push('type inconnu.')
  }
  if (patch.targetAbility && patch.abilities && !patch.abilities.some(ability => ability.name === patch.targetAbility)) {
    errors.push('le talent visé doit être l’un des talents listés.')
  }

  for (const build of patch.builds ?? []) {
    if (build.moves.length !== 4) {
      errors.push(`« ${build.name || 'build'} » : exactement 4 capacités attendues.`)
    }
    if (!natures.some(nature => nature.en === build.nature)) {
      errors.push(`« ${build.name || 'build'} » : nature « ${build.nature} » inconnue.`)
    }
    if (statsTotal(build.evs) > EV_TOTAL_MAX) {
      errors.push(`« ${build.name || 'build'} » : ${statsTotal(build.evs)} EV dépassent le plafond de ${EV_TOTAL_MAX}.`)
    }
  }

  if (patch.ivGuidance) {
    const overlap = patch.ivGuidance.focus.filter(key => patch.ivGuidance!.ignore.includes(key))
    if (overlap.length > 0) errors.push('une stat ne peut pas être à la fois prioritaire et ignorée.')
  }

  return errors
}

/** Un bloc réduit à sa forme texte, pour les blocs qu'on n'édite pas en `p`. */
function blockToPlainText(block: Block): string {
  switch (block.kind) {
    case 'list': return block.items.join('\n')
    case 'quote': return block.text
    case 'table': return [block.head.join(' | '), ...block.rows.map(row => row.join(' | '))].join('\n')
    case 'code': return block.text
    default: return ''
  }
}

/**
 * Bascule `Block[] → texte`, pour l'édition en un seul `UTextarea`.
 *
 * Chaque bloc `p` devient un paragraphe, séparé du suivant par une ligne
 * vide ; tout autre type de bloc (liste, tableau, citation, code) est aplati
 * en texte brut — `hasStructuredBlocks` sert à prévenir avant cette perte.
 */
export function blocksToText(blocks: Block[] | undefined): string {
  if (!blocks?.length) return ''
  return blocks.map(block => block.kind === 'p' ? block.text : blockToPlainText(block)).join('\n\n')
}

/** Bascule inverse : chaque paragraphe séparé par une ligne vide devient un bloc `p`. */
export function textToBlocks(text: string): Block[] {
  return text.split(/\n{2,}/)
    .map(chunk => chunk.trim())
    .filter(Boolean)
    .map(text => ({ kind: 'p' as const, text }))
}

/** Vrai si la fiche source contient un bloc non `p` — l'édition en texte simple l'aplatirait. */
export function hasStructuredBlocks(blocks: Block[] | undefined): boolean {
  return !!blocks?.some(block => block.kind !== 'p')
}
