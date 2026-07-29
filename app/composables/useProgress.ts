import type { PokemonSheet, ReadinessKey } from '~/data/types'
import { phases } from '~/data/phases'
import { activePokemon } from '~/data/pokemon'
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

  /** Roadmap + fiches des 6 membres actifs. */
  const overall = computed(() => {
    const tracked = trackedTaskEntries
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
   * §7.3 signale trois candidats aux Restes ; certains formats de la Frontier
   * interdisent les objets en double.
   */
  function duplicateItemHolders(slug: string): string[] {
    const own = state.value.pokemon[slug]?.item?.trim().toLowerCase()
    if (!own) return []
    return activePokemon
      .filter(mon => mon.slug !== slug)
      .filter(mon => state.value.pokemon[mon.slug]?.item?.trim().toLowerCase() === own)
      .map(mon => mon.name)
  }

  /**
   * Les trois critères marqués `derived` dans readiness.ts sont calculés ici ;
   * les quatre autres sont des cases cochées à la main (ids `ready-<slug>-<key>`).
   */
  function readinessFor(mon: PokemonSheet) {
    const progress = progressFor(mon.slug)
    const build = mon.builds?.find(candidate => candidate.id === progress.buildId)
      ?? mon.builds?.find(candidate => candidate.recommended)
      ?? mon.builds?.[0]

    const duplicates = duplicateItemHolders(mon.slug)

    const derived: Record<string, { met: boolean, detail?: string }> = {
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
        met: !!build && !!progress.nature
          && progress.nature.trim().toLowerCase() === build.natureFr.toLowerCase(),
        detail: !build
          ? 'Aucun build de référence'
          : progress.nature
            ? `${progress.nature} — cible : ${build.natureFr}`
            : `Nature non saisie — cible : ${build.natureFr}`,
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
