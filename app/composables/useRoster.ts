import type { PokemonSheet, PokemonStatus } from '~/data/types'
import type { RosterEntry } from '~/utils/roster'
import { activeEntries, resolveRoster, withDemoted, withMoved, withPromoted, withSwapped } from '~/utils/roster'

/**
 * Source de vérité unique de la composition jouée.
 *
 * Les exports `activePokemon` / `retiredPokemon` / `utilityPokemon` du barrel
 * d'un jeu restent le roster **du contenu** : ils sont calculés à l'import et ne
 * peuvent pas réagir à un échange. Tout ce qui affiche ou compte l'équipe passe
 * donc par ici.
 */
export function useRoster() {
  const { state, clearRoster, rosterModified } = useSave()
  const { current } = useGame()

  const pokemon = computed(() => current.value.content.pokemon)

  const entries = computed<RosterEntry[]>(() => resolveRoster(pokemon.value, state.value.roster))

  const active = computed(() => activeEntries(entries.value))
  const retired = computed(() => entries.value.filter(entry => entry.status === 'retired'))
  const utility = computed(() => entries.value.filter(entry => entry.status === 'utility'))

  /** Hors équipe de combat, dans l'ordre d'affichage de /equipe. */
  const others = computed(() => [...retired.value, ...utility.value])

  const bySlug = computed(() => new Map(entries.value.map(entry => [entry.sheet.slug, entry])))

  const activeSlugs = computed(() => new Set(active.value.map(entry => entry.sheet.slug)))

  /** Statut effectif d'une fiche, y compris pour une fiche hors équipe. */
  function statusOf(sheet: PokemonSheet): PokemonStatus {
    return bySlug.value.get(sheet.slug)?.status ?? sheet.status
  }

  function slotOf(sheet: PokemonSheet): number | undefined {
    return bySlug.value.get(sheet.slug)?.slot
  }

  /*
   * Les mutations rendent le message d'erreur du refus plutôt que de lever :
   * l'appelant est un gestionnaire de clic, qui l'affiche en toast.
   */
  const lastError = ref<string | null>(null)

  function apply(result: { overrides: Record<string, { status?: PokemonStatus, slot?: number }>, error?: string }) {
    lastError.value = result.error ?? null
    if (result.error) return false
    state.value.roster = result.overrides
    return true
  }

  return {
    entries,
    active,
    retired,
    utility,
    others,
    bySlug,
    activeSlugs,
    statusOf,
    slotOf,
    modified: rosterModified,
    lastError: readonly(lastError),

    promote: (slug: string) => apply(withPromoted(pokemon.value, state.value.roster, slug)),
    demote: (slug: string, status: Exclude<PokemonStatus, 'active'> = 'retired') =>
      apply(withDemoted(pokemon.value, state.value.roster, slug, status)),
    swap: (incoming: string, outgoing: string) =>
      apply(withSwapped(pokemon.value, state.value.roster, incoming, outgoing)),
    move: (slug: string, delta: number) => apply(withMoved(pokemon.value, state.value.roster, slug, delta)),
    reset: clearRoster,
  }
}
