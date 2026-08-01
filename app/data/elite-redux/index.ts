import type { GameContent } from '../games'
import type { ResourceKey } from '../types'
import { navFor } from '~/utils/navigation'
import { abilities } from './abilities'
import { completionSections } from './completion'
import { counters } from './counters'
import { encounters } from './encounters'
import { phases } from './phases'
import { readinessCriteria } from './readiness'
import { glossary, mechanics, tools } from './reference'

/**
 * Assemblage du contenu Elite Redux.
 *
 * Beaucoup plus léger que celui d'Unbound, et c'est normal à ce stade : la
 * partie commence. Les fiches Pokémon se rempliront au fil du jeu, la
 * complétion aussi.
 *
 * `/ressources` n'est volontairement **pas** fournie, et la page répond donc
 * 404 plutôt que de se rendre vide. Ce n'est pas un trou à combler : les
 * « services » de ce jeu (Nurse Joy, Adoption Center, Candy Box) sont déjà des
 * tâches de phase 1, et en refaire des entrées `npc:` cochables recopierait une
 * entrée qui existe ailleurs — ce que ce projet s'interdit. Il n'y a par
 * ailleurs ni farming ni économie à documenter : tout est gratuit et illimité.
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
    // Consultée ponctuellement, comme chez Unbound : la bottom-nav mobile
    // s'arrête à 5 entrées, et les quatre ci-dessus sont le parcours quotidien.
    { label: 'Référence', to: '/reference', icon: 'i-lucide-book-open', primary: false },
  ]),

  reference: {
    mechanics,
    tools,
    glossary,
    descriptions: {
      mechanics: 'Ce que ce hack change, et qu’aucun réflexe d’un autre jeu ne couvre — quatre talents simultanés, level caps, statuts inédits.',
      natures: 'La nature s’édite librement dans l’écran de résumé : c’est un choix, plus un tirage. Aucun usage n’est « recommandé » ici — celui d’Unbound tient à son guide.',
      tools: 'Le patcher officiel, les références en ligne, et les sites à ne pas utiliser.',
      glossary: 'Le vocabulaire propre à Elite Redux, celui qui n’a pas le même sens ailleurs.',
      encounters: 'Les 142 zones du jeu, telles que le code les décrit. Chercher un lieu pour voir ses tables, ou une espèce pour savoir où elle vit.',
      abilities: 'Les talents du jeu, avec la description que l’écran affiche. Toutes ont été réécrites : connaître un talent par son nom d’origine induit en erreur.',
    },
    encounters,
    abilities,
  },
}
