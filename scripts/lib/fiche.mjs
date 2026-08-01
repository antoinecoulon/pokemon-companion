/**
 * Contrat d'une fiche Pokémon : validation, puis sérialisation en TypeScript.
 *
 * Les fiches sont rédigées par une IA à partir du guide, en JSON. Ce module est
 * la seule définition de ce qui est acceptable — `pnpm import:pokemon` l'applique
 * à l'entrée, `pnpm validate` le réapplique à tout le contenu déjà en place. Les
 * deux doivent dire exactement la même chose, sinon un import passe et le build
 * casse ensuite.
 *
 * Ce que TypeScript ne peut pas contrôler et qui est donc contrôlé ici :
 * la convention des ids (des chaînes), la fermeture des listes de types et de
 * natures, la résolution des `requires`, et l'absence de champ inventé — une IA
 * produit volontiers un `weaknesses` ou un `evYield` qui serait silencieusement
 * ignoré à l'affichage.
 */
import { loadData } from './data.mjs'

const { POKEMON_TYPES, ROSTER_STATUSES, TEAM_SIZE } = await loadData('types.ts')
const { natures } = await loadData('natures.ts')

export { TEAM_SIZE }

const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
const BLOCK_KINDS = ['p', 'list', 'quote', 'table', 'code']
const QUOTE_TONES = ['info', 'warning', 'tip', 'success']
const NATURES_EN = new Set(natures.map(nature => nature.en))

/**
 * Ordre canonique des champs.
 *
 * Sert deux fois : rejeter un champ hors liste, et écrire les fiches toujours
 * dans le même ordre — deux fiches importées à six mois d'écart doivent se lire
 * pareil.
 */
export const SHEET_FIELDS = [
  'slug', 'name', 'sprite', 'spritePixelSet', 'slot', 'status', 'badge',
  'role', 'types', 'baseStats', 'bst', 'abilities', 'targetAbility', 'mega',
  'obtention', 'incomplete', 'incompleteNote', 'preamble', 'analysis', 'builds',
  'ivGuidance', 'extra', 'tasks',
]

const BUILD_FIELDS = ['id', 'name', 'tagline', 'nature', 'evs', 'item', 'moves', 'ability', 'notes', 'recommended']
const TASK_FIELDS = ['id', 'label', 'details', 'requires', 'priority', 'done', 'ref', 'link', 'key']
const ABILITY_FIELDS = ['name', 'hidden']
const MEGA_FIELDS = ['stone', 'stats', 'bst', 'note']
const IV_FIELDS = ['focus', 'ignore', 'note']
const BLOCK_FIELDS = ['kind', 'tone', 'text', 'items', 'ordered', 'head', 'rows', 'caption']

/**
 * Ordre des clés, par champ parent.
 *
 * Indispensable d'être imbriqué : avec une seule liste plate, `name` (rang 2 dans
 * une fiche) passait devant `id` dans un build, et un champ absent de la liste
 * remontait en tête.
 */
const CHILD_ORDER = {
  baseStats: STAT_KEYS,
  stats: STAT_KEYS,
  evs: STAT_KEYS,
  abilities: ABILITY_FIELDS,
  mega: MEGA_FIELDS,
  ivGuidance: IV_FIELDS,
  builds: BUILD_FIELDS,
  tasks: TASK_FIELDS,
  preamble: BLOCK_FIELDS,
  analysis: BLOCK_FIELDS,
  extra: BLOCK_FIELDS,
}

/* ------------------------------------------------------------------------- *
 * Validation
 * ------------------------------------------------------------------------- */

class Report {
  constructor() {
    this.errors = []
    this.warnings = []
  }

  error(message) {
    this.errors.push(message)
  }

  warn(message) {
    this.warnings.push(message)
  }
}

const isPlainObject = value => !!value && typeof value === 'object' && !Array.isArray(value)
const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0

function checkFields(report, object, allowed, where) {
  for (const key of Object.keys(object)) {
    if (!allowed.includes(key)) {
      report.error(`${where} : champ inconnu « ${key} » — il serait ignoré à l'affichage`)
    }
  }
}

function checkBlocks(report, blocks, where) {
  if (!Array.isArray(blocks)) {
    report.error(`${where} : doit être un tableau de blocs`)
    return
  }
  blocks.forEach((block, index) => {
    const at = `${where}[${index}]`
    if (!isPlainObject(block)) return report.error(`${at} : doit être un objet`)
    if (!BLOCK_KINDS.includes(block.kind)) {
      return report.error(`${at} : kind « ${block.kind} » inconnu (${BLOCK_KINDS.join(', ')})`)
    }
    if (block.kind === 'p' || block.kind === 'code') {
      if (!isNonEmptyString(block.text)) report.error(`${at} : « text » requis`)
    }
    if (block.kind === 'quote') {
      if (!isNonEmptyString(block.text)) report.error(`${at} : « text » requis`)
      if (block.tone !== undefined && !QUOTE_TONES.includes(block.tone)) {
        report.error(`${at} : tone « ${block.tone} » inconnu (${QUOTE_TONES.join(', ')})`)
      }
    }
    if (block.kind === 'list') {
      if (!Array.isArray(block.items) || !block.items.length) {
        report.error(`${at} : « items » doit être un tableau non vide`)
      }
    }
    if (block.kind === 'table') {
      if (!Array.isArray(block.head) || !block.head.length) {
        report.error(`${at} : « head » doit être un tableau non vide`)
      }
      if (!Array.isArray(block.rows) || !block.rows.length) {
        report.error(`${at} : « rows » doit être un tableau non vide`)
      }
      else {
        block.rows.forEach((row, rowIndex) => {
          if (!Array.isArray(row) || row.length !== block.head?.length) {
            report.error(
              `${at}.rows[${rowIndex}] : ${row?.length} cellule(s) pour ${block.head?.length} colonne(s)`,
            )
          }
        })
      }
    }
  })
}

function checkStats(report, stats, where, { max, complete }) {
  if (!isPlainObject(stats)) return report.error(`${where} : doit être un objet de stats`)
  for (const [key, value] of Object.entries(stats)) {
    if (!STAT_KEYS.includes(key)) {
      report.error(`${where} : stat inconnue « ${key} » (${STAT_KEYS.join(', ')})`)
    }
    if (!Number.isInteger(value) || value < 0 || value > max) {
      report.error(`${where}.${key} : ${value} — entier attendu entre 0 et ${max}`)
    }
  }
  if (complete) {
    for (const key of STAT_KEYS) {
      if (stats[key] === undefined) report.error(`${where} : stat « ${key} » manquante`)
    }
  }
}

/**
 * Valide une fiche.
 *
 * `knownTaskIds` sert au contrôle des `requires` : une dépendance qui ne résout
 * pas bloque la tâche pour de bon dans le moteur de prochaine action, sans
 * aucune erreur visible.
 */
export function validateFiche(fiche, { knownTaskIds = new Set(), knownSlugs = new Set() } = {}) {
  const report = new Report()

  if (!isPlainObject(fiche)) {
    report.error('la fiche doit être un objet JSON')
    return report
  }

  checkFields(report, fiche, SHEET_FIELDS, 'fiche')

  /* --- Identité --------------------------------------------------------- */

  if (!isNonEmptyString(fiche.slug)) report.error('fiche : « slug » requis')
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fiche.slug)) {
    report.error(`fiche : slug « ${fiche.slug} » — kebab-case ASCII attendu, il nomme le fichier et les clés de sauvegarde`)
  }
  else if (knownSlugs.has(fiche.slug)) {
    report.error(`fiche : le slug « ${fiche.slug} » est déjà pris`)
  }

  if (!isNonEmptyString(fiche.name)) report.error('fiche : « name » requis')
  if (!isNonEmptyString(fiche.role)) report.error('fiche : « role » requis (§7.3 — le rôle tenu dans l’équipe)')

  if (fiche.sprite !== undefined && !isNonEmptyString(fiche.sprite)) {
    report.error('fiche : « sprite » présent mais vide — retire la clé pour une fiche concept, sinon le contrôle de présence de l’image est sauté')
  }

  if (!ROSTER_STATUSES.includes(fiche.status)) {
    report.error(`fiche : status « ${fiche.status} » inconnu (${ROSTER_STATUSES.join(', ')})`)
  }

  if (fiche.slot !== undefined) {
    if (!Number.isInteger(fiche.slot) || fiche.slot < 1 || fiche.slot > TEAM_SIZE) {
      report.error(`fiche : slot ${fiche.slot} — entier attendu entre 1 et ${TEAM_SIZE}`)
    }
    if (fiche.status !== 'active') {
      report.error('fiche : un slot n’a de sens que pour un membre actif')
    }
  }

  /* --- Types et stats --------------------------------------------------- */

  if (!Array.isArray(fiche.types)) report.error('fiche : « types » requis (tableau, vide pour une fiche concept)')
  else {
    if (fiche.types.length > 2) report.error(`fiche : ${fiche.types.length} types — deux au maximum`)
    for (const type of fiche.types) {
      if (!POKEMON_TYPES.includes(type)) {
        report.error(`fiche : type « ${type} » inconnu — orthographe anglaise exacte attendue`)
      }
    }
  }

  if (fiche.baseStats !== undefined) {
    checkStats(report, fiche.baseStats, 'fiche.baseStats', { max: 255, complete: true })
    const sum = STAT_KEYS.reduce((total, key) => total + (fiche.baseStats?.[key] ?? 0), 0)
    if (fiche.bst === undefined) report.warn(`fiche : « bst » absent alors que les stats de base donnent ${sum}`)
    else if (fiche.bst !== sum) report.error(`fiche : bst ${fiche.bst} alors que les stats de base totalisent ${sum}`)
  }
  else if (fiche.bst !== undefined) {
    report.error('fiche : « bst » sans « baseStats »')
  }

  /* --- Talents et méga -------------------------------------------------- */

  if (fiche.abilities !== undefined) {
    if (!Array.isArray(fiche.abilities)) report.error('fiche.abilities : tableau attendu')
    else {
      fiche.abilities.forEach((ability, index) => {
        if (!isPlainObject(ability)) return report.error(`fiche.abilities[${index}] : objet attendu`)
        checkFields(report, ability, ['name', 'hidden'], `fiche.abilities[${index}]`)
        if (!isNonEmptyString(ability.name)) report.error(`fiche.abilities[${index}] : « name » requis`)
      })
      if (fiche.targetAbility && !fiche.abilities.some(ability => ability.name === fiche.targetAbility)) {
        report.error(`fiche : targetAbility « ${fiche.targetAbility} » ne figure pas dans « abilities »`)
      }
    }
  }
  else if (fiche.targetAbility !== undefined) {
    report.error('fiche : « targetAbility » sans « abilities »')
  }

  if (fiche.mega !== undefined) {
    if (!isPlainObject(fiche.mega)) report.error('fiche.mega : objet attendu')
    else {
      checkFields(report, fiche.mega, ['stone', 'stats', 'bst', 'note'], 'fiche.mega')
      if (!isNonEmptyString(fiche.mega.stone)) report.error('fiche.mega : « stone » requis')
      checkStats(report, fiche.mega.stats, 'fiche.mega.stats', { max: 255, complete: true })
    }
  }

  /* --- Fiche incomplète ------------------------------------------------- */

  if (fiche.incomplete && !isNonEmptyString(fiche.incompleteNote)) {
    report.error('fiche : « incomplete » exige « incompleteNote » — l’UI affiche cette phrase à la place du build')
  }
  if (!fiche.incomplete && fiche.incompleteNote !== undefined) {
    report.error('fiche : « incompleteNote » sans « incomplete »')
  }
  if (!fiche.incomplete && fiche.status === 'active' && !fiche.builds?.length) {
    report.error('fiche : un membre actif sans build doit porter « incomplete: true » — on n’invente pas de build')
  }

  /* --- Prose ------------------------------------------------------------ */

  for (const field of ['preamble', 'analysis', 'extra']) {
    if (fiche[field] !== undefined) checkBlocks(report, fiche[field], `fiche.${field}`)
  }

  /* --- Builds ----------------------------------------------------------- */

  if (fiche.builds !== undefined) {
    if (!Array.isArray(fiche.builds)) report.error('fiche.builds : tableau attendu')
    else {
      const seen = new Set()
      let recommended = 0
      fiche.builds.forEach((build, index) => {
        const at = `fiche.builds[${index}]`
        if (!isPlainObject(build)) return report.error(`${at} : objet attendu`)
        checkFields(report, build, BUILD_FIELDS, at)

        if (!isNonEmptyString(build.id)) report.error(`${at} : « id » requis`)
        else if (seen.has(build.id)) report.error(`${at} : id de build dupliqué « ${build.id} »`)
        else seen.add(build.id)

        if (!isNonEmptyString(build.name)) report.error(`${at} : « name » requis`)
        if (!isNonEmptyString(build.item)) report.error(`${at} : « item » requis`)
        if (!NATURES_EN.has(build.nature)) {
          report.error(`${at} : nature « ${build.nature} » absente de natures.ts — nom anglais seul attendu, ex. « Adamant »`)
        }

        if (!Array.isArray(build.moves) || build.moves.length !== 4) {
          report.error(`${at} : ${build.moves?.length ?? 0} capacité(s) — le jeu en tient exactement 4`)
        }

        checkStats(report, build.evs, `${at}.evs`, { max: 252, complete: false })
        const total = Object.values(build.evs ?? {}).reduce((sum, value) => sum + (value || 0), 0)
        if (total > 510) report.error(`${at} : ${total} EV, au-delà du plafond de 510`)

        if (build.recommended) recommended += 1
      })
      if (recommended > 1) report.error(`fiche.builds : ${recommended} builds marqués « recommended », un seul attendu`)
      if (fiche.builds.length > 1 && recommended === 0) {
        report.warn('fiche.builds : plusieurs builds et aucun « recommended » — le premier servira de référence')
      }
    }
  }

  /* --- Guidance IV ------------------------------------------------------ */

  if (fiche.ivGuidance !== undefined) {
    const guidance = fiche.ivGuidance
    if (!isPlainObject(guidance)) report.error('fiche.ivGuidance : objet attendu')
    else {
      checkFields(report, guidance, ['focus', 'ignore', 'note'], 'fiche.ivGuidance')
      for (const field of ['focus', 'ignore']) {
        if (!Array.isArray(guidance[field])) {
          report.error(`fiche.ivGuidance.${field} : tableau de stats attendu`)
          continue
        }
        for (const key of guidance[field]) {
          if (!STAT_KEYS.includes(key)) {
            report.error(`fiche.ivGuidance.${field} : stat inconnue « ${key} » (${STAT_KEYS.join(', ')})`)
          }
        }
      }
      const overlap = (guidance.focus ?? []).filter(key => (guidance.ignore ?? []).includes(key))
      if (overlap.length) {
        report.error(`fiche.ivGuidance : « ${overlap.join(', ') }» à la fois dans focus et ignore`)
      }
    }
  }

  /* --- Tâches ----------------------------------------------------------- */

  if (fiche.tasks !== undefined) {
    if (!Array.isArray(fiche.tasks)) report.error('fiche.tasks : tableau attendu')
    else {
      const own = new Set(fiche.tasks.map(task => task?.id).filter(Boolean))
      const pattern = new RegExp(`^mon-${fiche.slug}-\\d+$`)
      const seen = new Set()

      fiche.tasks.forEach((task, index) => {
        const at = `fiche.tasks[${index}]`
        if (!isPlainObject(task)) return report.error(`${at} : objet attendu`)
        checkFields(report, task, TASK_FIELDS, at)

        if (!isNonEmptyString(task.id)) report.error(`${at} : « id » requis`)
        else {
          if (!pattern.test(task.id)) {
            report.error(`${at} : id « ${task.id} » — convention mon-${fiche.slug}-<n> attendue`)
          }
          if (seen.has(task.id)) report.error(`${at} : id dupliqué « ${task.id} »`)
          seen.add(task.id)
          if (knownTaskIds.has(task.id)) report.error(`${at} : l'id « ${task.id} » existe déjà ailleurs dans le contenu`)
        }

        if (!isNonEmptyString(task.label)) {
          report.error(`${at} : « label » requis — une tâche sans libellé s'affiche comme une ligne vide`)
        }

        for (const dep of task.requires ?? []) {
          if (!own.has(dep) && !knownTaskIds.has(dep)) {
            report.error(`${at} : requires « ${dep} », qui n'existe pas`)
          }
          if (dep === task.id) report.error(`${at} : se requiert lui-même`)
        }

        if (task.priority !== undefined && !Number.isInteger(task.priority)) {
          report.error(`${at} : « priority » doit être un entier (défaut 50)`)
        }
      })
    }
  }

  return report
}

/* ------------------------------------------------------------------------- *
 * Sérialisation en TypeScript
 * ------------------------------------------------------------------------- */

/** Guillemets simples, comme le reste du contenu. Les apostrophes typographiques passent telles quelles. */
function quote(text) {
  return `'${text.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

/** Au-delà, on passe à la ligne. Correspond à la mise en forme des fiches écrites à la main. */
const WIDTH = 96

const isScalar = value =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'

/**
 * Rend une valeur JSON en littéral TypeScript.
 *
 * Une valeur purement scalaire tient sur une ligne si elle rentre dans la
 * largeur — `types: ['Sol', 'Vol']`, `baseStats: { hp: 100, atk: 134, … }`,
 * `{ name: 'Sable Volant (Sand Stream)' }` — et tout le reste s'indente. Cette
 * règle unique reproduit la mise en forme des 12 fiches écrites à la main, ce
 * qui compte : une fiche importée doit être indiscernable d'une fiche relue et
 * corrigée à la main, sinon chaque import parasite le diff suivant.
 */
function render(value, depth, keyOrder) {
  const pad = '  '.repeat(depth)
  const inner = '  '.repeat(depth + 1)

  if (value === null) return 'null'
  if (isScalar(value)) return typeof value === 'string' ? quote(value) : String(value)

  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    if (value.every(isScalar)) {
      const line = `[${value.map(item => render(item, 0)).join(', ')}]`
      if (pad.length + line.length <= WIDTH) return line
    }
    // Les éléments d'un tableau gardent l'ordre de clés de leur champ parent.
    const items = value.map(item => `${inner}${render(item, depth + 1, keyOrder)},`).join('\n')
    return `[\n${items}\n${pad}]`
  }

  const keys = Object.keys(value).filter(key => value[key] !== undefined)
  const rank = key => (keyOrder?.indexOf(key) ?? -1) < 0 ? Number.POSITIVE_INFINITY : keyOrder.indexOf(key)
  const ordered = [...keys].sort((a, b) => rank(a) - rank(b) || keys.indexOf(a) - keys.indexOf(b))

  const name = key => (IDENTIFIER.test(key) ? key : quote(key))
  const child = key => CHILD_ORDER[key] ?? keyOrder

  if (ordered.every(key => isScalar(value[key]))) {
    const line = `{ ${ordered.map(key => `${name(key)}: ${render(value[key], 0)}`).join(', ')} }`
    if (pad.length + line.length <= WIDTH) return line
  }

  const fields = ordered
    .map(key => `${inner}${name(key)}: ${render(value[key], depth + 1, child(key))},`)
    .join('\n')

  return `{\n${fields}\n${pad}}`
}

/** Module TypeScript complet d'une fiche, prêt à écrire dans `app/data/unbound/pokemon/`. */
export function printFiche(fiche) {
  const ordered = {}
  for (const field of SHEET_FIELDS) {
    if (fiche[field] !== undefined) ordered[field] = fiche[field]
  }

  return [
    'import type { PokemonSheet } from \'../types\'',
    '',
    `export default ${render(ordered, 0, SHEET_FIELDS)} satisfies PokemonSheet`,
    '',
  ].join('\n')
}
