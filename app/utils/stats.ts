/**
 * Les six statistiques, dans l'ordre canonique du jeu.
 * Ces clés apparaissent dans l'état persisté : elles ne changent jamais.
 */
export const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const

export type StatKey = (typeof STAT_KEYS)[number]

export type StatSpread = Record<StatKey, number>

/** Libellés courts, pour les grilles et les tableaux. */
export const STAT_LABELS: Record<StatKey, string> = {
  hp: 'PV',
  atk: 'Atk',
  def: 'Déf',
  spa: 'Att.Spé',
  spd: 'Déf.Spé',
  spe: 'Vit',
}

/** Libellés longs, pour les formulaires et les infobulles. */
export const STAT_LABELS_LONG: Record<StatKey, string> = {
  hp: 'Points de Vie',
  atk: 'Attaque',
  def: 'Défense',
  spa: 'Attaque Spéciale',
  spd: 'Défense Spéciale',
  spe: 'Vitesse',
}

export const IV_MAX = 31
export const EV_MAX_PER_STAT = 252
/** §2.2 — 510 EV au total, mais 4 EV = 1 point : 252/252/4 = 508 utilisés. */
export const EV_TOTAL_MAX = 510

export type PartialStats = Partial<Record<StatKey, number>>

export function emptyStats(): PartialStats {
  return {}
}

export function statsTotal(stats: PartialStats): number {
  return STAT_KEYS.reduce((sum, key) => sum + (stats[key] ?? 0), 0)
}

/**
 * §13.2 — « EV exacts : 252 / 252 / 4, aucun point perdu ».
 * On vérifie le motif plutôt que le seul total : 510 EV mal répartis (par ex.
 * 250/250/10) gaspillent des points, puisque seuls les multiples de 4 comptent.
 */
export function isOptimalEvSpread(evs: PartialStats): boolean {
  const values = STAT_KEYS.map(key => evs[key] ?? 0)
  const total = values.reduce((sum, value) => sum + value, 0)
  if (total > EV_TOTAL_MAX) return false

  const maxed = values.filter(value => value === EV_MAX_PER_STAT).length
  const remainder = values.filter(value => value !== EV_MAX_PER_STAT && value !== 0)

  return maxed === 2 && remainder.length === 1 && remainder[0] === 4
}

/** Nombre d'EV réellement perdus : tout point hors multiple de 4 n'apporte rien. */
export function wastedEvs(evs: PartialStats): number {
  return STAT_KEYS.reduce((sum, key) => sum + ((evs[key] ?? 0) % 4), 0)
}
