import type { Build, PokemonProgress, PokemonSheet, PokemonStatus } from '~/data/types'

/**
 * Étiquette de statut du roster.
 *
 * Remplace le `badgeColor` qui était recopié dans les deux pages d'équipe et
 * qui reniflait la chaîne libre `badge` (`badge?.startsWith('Sorti')`) alors que
 * `status` porte déjà l'information. Le `badge` d'une fiche reste de la prose du
 * guide (« Conservé », « Nouveau ») : il est affiché tel quel, sans couleur, et
 * masqué dès que la composition jouée s'écarte de celle du guide — « Conservé »
 * sur un Pokémon qu'on vient de sortir serait faux.
 */
export const STATUS_BADGE: Record<PokemonStatus, { label: string, color: 'success' | 'neutral' | 'info' }> = {
  active: { label: 'Actif', color: 'success' },
  retired: { label: 'Sorti de l’équipe', color: 'neutral' },
  utility: { label: 'Utilitaire', color: 'info' },
}

/**
 * Build de référence d'une fiche : celui choisi, sinon le recommandé, sinon le
 * premier.
 *
 * La chaîne de repli était dupliquée entre `PokemonForm.vue` et `useProgress`.
 * Les deux doivent impérativement désigner le même build : le formulaire affiche
 * les valeurs cibles, la checklist décide si elles sont atteintes.
 */
export function buildFor(
  mon: PokemonSheet,
  progress?: Pick<PokemonProgress, 'buildId'>,
): Build | undefined {
  return mon.builds?.find(candidate => candidate.id === progress?.buildId)
    ?? mon.builds?.find(candidate => candidate.recommended)
    ?? mon.builds?.[0]
}
