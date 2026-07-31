import type { PokemonSheet, ReadinessKey } from '~/data/types'
import { matchesNature } from '~/data/natures'
import { phases } from '~/data/phases'
import { readinessCriteria } from '~/data/readiness'

export interface Ratio {
  done: number
  total: number
  /** Entier de 0 à 100. */
  percent: number
}

function ratio(done: number, total: number): Ratio {
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
}

export function useProgress() {
  const { isDone, progressFor, state } = useSave()
  const { active, activeSlugs } = useRoster()

  /** Roadmap + fiches des 6 membres actifs. */
  const overall = computed(() => {
    const tracked = trackedEntriesFor(activeSlugs.value)
    return ratio(tracked.filter(entry => isDone(entry.task.id)).length, tracked.length)
  })

  const byPhase = computed(() =>
    new Map(phases.map(phase => [
      phase.id,
      ratio(phase.tasks.filter(task => isDone(task.id)).length, phase.tasks.length),
    ])),
  )

  function forPokemon(mon: PokemonSheet): Ratio {
    const tasks = mon.tasks ?? []
    return ratio(tasks.filter(task => isDone(task.id)).length, tasks.length)
  }

  /* --- Checklist « Endgame Ready » (§13.2) ------------------------------ */

  /**
   * Objets portés par les autres membres actifs, pour détecter les doublons.
   * §7.3 signale trois candidats aux Leftovers ; certains formats de la Frontier
   * interdisent les objets en double.
   */
  function duplicateItemHolders(slug: string): string[] {
    const own = state.value.pokemon[slug]?.item?.trim().toLowerCase()
    if (!own) return []
    return active.value
      .map(entry => entry.sheet)
      .filter(mon => mon.slug !== slug)
      .filter(mon => state.value.pokemon[mon.slug]?.item?.trim().toLowerCase() === own)
      .map(mon => mon.name)
  }

  /**
   * Les quatre critères marqués `derived` dans readiness.ts sont calculés ici ;
   * les trois autres sont des cases cochées à la main (ids `ready-<slug>-<key>`).
   */
  function readinessFor(mon: PokemonSheet) {
    const progress = progressFor(mon.slug)
    const build = buildFor(mon, progress)

    const duplicates = duplicateItemHolders(mon.slug)

    /*
     * Clé typée sur `ReadinessKey` : en `Record<string, …>`, une faute de frappe
     * sur un nom de critère rendait simplement `undefined`, donc `met: false` —
     * un critère durablement non rempli, sans la moindre erreur.
     */
    const derived: Partial<Record<ReadinessKey, { met: boolean, detail?: string }>> = {
      level: {
        met: progress.level === 100,
        detail: progress.level ? `Niveau ${progress.level}` : 'Niveau non saisi',
      },
      evs: {
        met: isOptimalEvSpread(progress.evs),
        detail: (() => {
          const total = statsTotal(progress.evs)
          if (total === 0) return 'EV non saisis'
          const wasted = wastedEvs(progress.evs)
          if (wasted > 0) return `${total} EV répartis, dont ${wasted} perdus (hors multiples de 4)`
          return `${total} EV répartis`
        })(),
      },
      nature: {
        met: !!build && matchesNature(progress.nature, build.nature),
        detail: !build
          ? 'Aucun build de référence'
          : progress.nature
            ? `${progress.nature} — cible : ${build.nature}`
            : `Nature non saisie — cible : ${build.nature}`,
      },
      item: {
        met: !!progress.item?.trim() && duplicates.length === 0,
        detail: !progress.item?.trim()
          ? 'Objet non saisi'
          : duplicates.length
            ? `Doublon avec ${duplicates.join(', ')}`
            : progress.item,
      },
    }

    const rows = readinessCriteria.map((criterion) => {
      const computedResult = derived[criterion.key]
      return {
        ...criterion,
        taskId: `ready-${mon.slug}-${criterion.key}` as const,
        met: criterion.derived ? (computedResult?.met ?? false) : isDone(`ready-${mon.slug}-${criterion.key}`),
        detail: criterion.derived ? computedResult?.detail : undefined,
      }
    })

    return {
      rows,
      build,
      duplicates,
      ratio: ratio(rows.filter(row => row.met).length, rows.length),
    }
  }

  /** Raccourci pour les cartes d'équipe. */
  function readyRatio(mon: PokemonSheet): Ratio {
    return readinessFor(mon).ratio
  }

  return { overall, byPhase, forPokemon, readinessFor, readyRatio, duplicateItemHolders }
}

export type ReadinessRow = ReturnType<ReturnType<typeof useProgress>['readinessFor']>['rows'][number]
export type { ReadinessKey }
