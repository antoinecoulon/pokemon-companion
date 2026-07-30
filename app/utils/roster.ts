import type { PokemonSheet, PokemonStatus, RosterOverride } from '~/data/types'
import { TEAM_SIZE } from '~/data/types'

/**
 * Composition d'équipe effective, et les quatre opérations qui la modifient.
 *
 * Tout est pur : une opération prend la carte d'overrides actuelle et rend la
 * suivante, sans toucher à la sauvegarde. C'est ce qui rend les invariants
 * testables hors navigateur (`pnpm test:roster`) — et ils en ont besoin : un
 * slot en doublon ou un trou dans la numérotation désordonne silencieusement
 * l'affichage de l'équipe.
 */

export interface RosterEntry {
  sheet: PokemonSheet
  status: PokemonStatus
  /** Défini pour les seuls actifs : un Pokémon en boîte n'occupe pas de slot. */
  slot?: number
}

export type RosterOverrides = Record<string, RosterOverride>

export interface RosterResult {
  overrides: RosterOverrides
  /** Renseigné quand l'opération est refusée ; `overrides` est alors inchangé. */
  error?: string
}

/**
 * Applique les overrides aux fiches.
 *
 * Le slot n'est lu que pour un actif : sans cette règle, « sortir de l'équipe »
 * devrait exprimer l'absence de slot, ce que l'omission d'un champ ne peut pas
 * dire — elle signifie déjà « reprendre la valeur de la fiche ».
 */
export function resolveRoster(sheets: PokemonSheet[], overrides: RosterOverrides): RosterEntry[] {
  return sheets.map((sheet) => {
    const override = overrides[sheet.slug]
    const status = override?.status ?? sheet.status
    return {
      sheet,
      status,
      slot: status === 'active' ? (override?.slot ?? sheet.slot) : undefined,
    }
  })
}

/**
 * Les actifs dans l'ordre des slots.
 *
 * Départage par l'ordre de déclaration : deux fiches peuvent revendiquer le même
 * slot le temps d'une opération (promouvoir Sceptile pendant que Tyranitar
 * occupe le slot 1 de sa fiche), et le tri doit rester déterministe jusqu'à la
 * renumérotation.
 */
export function activeEntries(entries: RosterEntry[]): RosterEntry[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.status === 'active')
    .sort((a, b) => (a.entry.slot ?? 99) - (b.entry.slot ?? 99) || a.index - b.index)
    .map(({ entry }) => entry)
}

/**
 * Traduit un état voulu en carte d'overrides minimale.
 *
 * Minimale au sens strict : un champ égal à celui de la fiche n'est pas écrit,
 * et une entrée vide est supprimée. C'est ce qui fait que « revenir à la
 * composition du guide » se lit `roster === {}`, et qu'une sauvegarde ne
 * mémorise que l'écart réel.
 */
function buildOverrides(
  sheets: PokemonSheet[],
  activeOrder: string[],
  status: Map<string, PokemonStatus>,
): RosterOverrides {
  const slotOf = new Map(activeOrder.map((slug, index) => [slug, index + 1]))
  const overrides: RosterOverrides = {}

  for (const sheet of sheets) {
    const target = status.get(sheet.slug) ?? sheet.status
    const override: RosterOverride = {}

    if (target !== sheet.status) override.status = target

    if (target === 'active') {
      const slot = slotOf.get(sheet.slug)
      if (slot !== undefined && slot !== sheet.slot) override.slot = slot
    }

    if (override.status !== undefined || override.slot !== undefined) {
      overrides[sheet.slug] = override
    }
  }

  return overrides
}

/** État courant sous la forme attendue par `buildOverrides`. */
function planOf(entries: RosterEntry[]) {
  return {
    activeOrder: activeEntries(entries).map(entry => entry.sheet.slug),
    status: new Map(entries.map(entry => [entry.sheet.slug, entry.status])),
  }
}

function find(entries: RosterEntry[], slug: string): RosterEntry | undefined {
  return entries.find(entry => entry.sheet.slug === slug)
}

/** Fait entrer un Pokémon dans l'équipe, sur le premier slot libre. */
export function withPromoted(
  sheets: PokemonSheet[],
  overrides: RosterOverrides,
  slug: string,
): RosterResult {
  const entries = resolveRoster(sheets, overrides)
  const entry = find(entries, slug)
  if (!entry) return { overrides, error: `fiche inconnue : ${slug}` }
  if (entry.status === 'active') return { overrides, error: `${entry.sheet.name} est déjà dans l'équipe` }

  const plan = planOf(entries)
  if (plan.activeOrder.length >= TEAM_SIZE) {
    return { overrides, error: `l'équipe compte déjà ${TEAM_SIZE} membres — échange-le avec un membre sortant` }
  }

  plan.status.set(slug, 'active')
  plan.activeOrder.push(slug)
  return { overrides: buildOverrides(sheets, plan.activeOrder, plan.status) }
}

/**
 * Sort un Pokémon de l'équipe et referme le trou.
 *
 * La renumérotation est le point délicat : sans elle les slots restants
 * afficheraient `#1 #2 #4 #5 #6`, et `validate` laisse aujourd'hui passer une
 * telle suite.
 */
export function withDemoted(
  sheets: PokemonSheet[],
  overrides: RosterOverrides,
  slug: string,
  status: Exclude<PokemonStatus, 'active'>,
): RosterResult {
  const entries = resolveRoster(sheets, overrides)
  const entry = find(entries, slug)
  if (!entry) return { overrides, error: `fiche inconnue : ${slug}` }

  const plan = planOf(entries)
  plan.status.set(slug, status)
  return {
    overrides: buildOverrides(sheets, plan.activeOrder.filter(item => item !== slug), plan.status),
  }
}

/** Échange un entrant et un sortant : l'entrant reprend le slot du sortant. */
export function withSwapped(
  sheets: PokemonSheet[],
  overrides: RosterOverrides,
  incoming: string,
  outgoing: string,
  status: Exclude<PokemonStatus, 'active'> = 'retired',
): RosterResult {
  const entries = resolveRoster(sheets, overrides)
  const entrant = find(entries, incoming)
  const sortant = find(entries, outgoing)
  if (!entrant) return { overrides, error: `fiche inconnue : ${incoming}` }
  if (!sortant) return { overrides, error: `fiche inconnue : ${outgoing}` }
  if (entrant.status === 'active') return { overrides, error: `${entrant.sheet.name} est déjà dans l'équipe` }
  if (sortant.status !== 'active') return { overrides, error: `${sortant.sheet.name} n'est pas dans l'équipe` }

  const plan = planOf(entries)
  plan.status.set(incoming, 'active')
  plan.status.set(outgoing, status)
  return {
    overrides: buildOverrides(
      sheets,
      plan.activeOrder.map(item => (item === outgoing ? incoming : item)),
      plan.status,
    ),
  }
}

/** Monte (`-1`) ou descend (`+1`) un membre d'un slot. */
export function withMoved(
  sheets: PokemonSheet[],
  overrides: RosterOverrides,
  slug: string,
  delta: number,
): RosterResult {
  const entries = resolveRoster(sheets, overrides)
  const plan = planOf(entries)
  const from = plan.activeOrder.indexOf(slug)
  if (from < 0) return { overrides, error: `${slug} n'est pas dans l'équipe` }

  const to = from + delta
  if (to < 0 || to >= plan.activeOrder.length) return { overrides }

  const order = [...plan.activeOrder]
  const [moved] = order.splice(from, 1)
  order.splice(to, 0, moved!)
  return { overrides: buildOverrides(sheets, order, plan.status) }
}
