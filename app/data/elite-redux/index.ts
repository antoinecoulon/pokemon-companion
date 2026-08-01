import type { GameContent } from '../games'
import type { ResourceKey } from '../types'
import { navFor } from '~/utils/navigation'
import { completionSections } from './completion'
import { counters } from './counters'
import { phases } from './phases'
import { readinessCriteria } from './readiness'

/**
 * Assemblage du contenu Elite Redux.
 *
 * Beaucoup plus léger que celui d'Unbound, et c'est normal à ce stade : la
 * partie commence. Les fiches Pokémon se rempliront au fil du jeu, la
 * complétion aussi.
 *
 * Deux pages du companion ne sont volontairement **pas** fournies —
 * `/ressources` et `/reference`. Elles n'existent donc ni dans la nav ni en
 * direct : la page répond 404 plutôt que de se rendre vide. Unbound les tient
 * de son guide markdown ; ici, l'équivalent (statuts, météo, level caps) vit
 * dans `docs/elite-redux/01-la-rom.md` et n'a pas encore été porté.
 */
export const eliteReduxContent: GameContent = {
  phases,
  /*
   * Aucune fiche pour l'instant : la partie n'a pas commencé, et une fiche ne
   * s'écrit pas d'avance. `useRoster` et la progression s'accommodent d'une
   * liste vide — l'équipe se remplira au fur et à mesure.
   */
  pokemon: [],
  readinessCriteria,
  completionGroups: completionSections.map(section => ({
    id: section.id,
    title: section.title,
    description: section.description,
    entries: section.goals.map(goal => ({
      key: `goal:${goal.id}` as ResourceKey,
      label: goal.label,
      location: goal.location,
      reward: goal.reward,
      details: goal.details,
      source: goal.source,
      optional: goal.optional,
    })),
  })),
  counters,
  /* Les clés `goal:` sont déduites de `completionGroups` par `defineGame`. */
  resourceKeys: [],
  nav: navFor('/elite-redux', [
    { label: 'Accueil', to: '/', icon: 'i-lucide-house', primary: true },
    /*
     * « Progression » et non « Complétion » : la page porte ici les quatre
     * phases *plus* la collection, alors que chez Unbound il ne reste que la
     * Battle Frontier à côté des cases. La route, elle, reste `/completion` —
     * c'est le même fichier de page.
     */
    { label: 'Progression', to: '/completion', icon: 'i-lucide-trophy', primary: true },
    { label: 'Équipe', to: '/equipe', icon: 'i-lucide-users', primary: true },
    { label: 'Journal', to: '/journal', icon: 'i-lucide-notebook-pen', primary: true },
  ]),
}
