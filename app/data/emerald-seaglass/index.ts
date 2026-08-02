import type { GameContent } from '../games'
import type { ResourceKey } from '../types'
import { navFor } from '~/utils/navigation'
import { completionSections } from './completion'
import { counters } from './counters'
import { phases } from './phases'
import { readinessCriteria } from './readiness'
import { glossary, mechanics, tools } from './reference'

/**
 * Assemblage du contenu Emerald Seaglass.
 *
 * Trois absences délibérées, qui viennent toutes du même fait : **ce jeu n'a pas
 * de code source public**, et sa documentation est un PDF de 8 pages.
 *
 * - **pas d'`encounters` ni d'`abilities`.** Il n'y a rien à générer : aucun
 *   dépôt à lire. Et il n'y aurait rien à y gagner — le hack embarque un Pokédex
 *   refait sur le modèle de HGSS, qui affiche déjà types, localisations,
 *   méthodes d'évolution et movesets à jour de ses propres changements. Recopier
 *   ça à la main serait long, faux à la première divergence, et moins bon que
 *   l'écran de jeu. Les sections correspondantes ne se rendent donc pas.
 * - **pas de `resources`.** La page `/ressources` répond 404, et ce n'est pas un
 *   trou à combler : les marchands du jeu (Happy Trainer Merchant Stand,
 *   Pretty Petal, stands de pierres) sont documentés dans la référence, où ils
 *   informent, plutôt qu'en cases `npc:` à cocher — ce qui recopierait une
 *   entrée existant déjà ailleurs, ce que ce projet s'interdit.
 * - **`pokemon: []`.** La partie n'a pas commencé et une fiche ne s'écrit pas
 *   d'avance. `useRoster` et la progression s'accommodent d'une liste vide.
 */
export const emeraldSeaglassContent: GameContent = {
  phases,
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
  nav: navFor('/emerald-seaglass', [
    { label: 'Accueil', to: '/', icon: 'i-lucide-house', primary: true },
    /*
     * « Progression » comme chez Elite Redux : la page porte les quatre phases
     * *plus* la collection. La route reste `/completion`, c'est le même fichier.
     */
    { label: 'Progression', to: '/completion', icon: 'i-lucide-trophy', primary: true },
    { label: 'Équipe', to: '/equipe', icon: 'i-lucide-users', primary: true },
    { label: 'Journal', to: '/journal', icon: 'i-lucide-notebook-pen', primary: true },
    // Consultée ponctuellement : la bottom-nav mobile s'arrête à 5 entrées.
    { label: 'Référence', to: '/reference', icon: 'i-lucide-book-open', primary: false },
  ]),

  dashboard: {
    completionSummary: ' — légendaires, easter eggs, minigames, objets et jalons de Pokédex.',
    overallLabel: 'Équipe & progression',
    nextActionsHint: 'Une tâche n’apparaît ici que si tous ses prérequis sont cochés — pas de Scuba Safari avant l’ouverture de Pacifidlog, pas de quête du Sailor avant le Mossdeep Gym.',
    allDone: 'Tout est coché. Reste à relever les level caps que personne ne publie.',
  },

  reference: {
    mechanics,
    tools,
    glossary,
    /*
     * Pas de chapeau `encounters` ni `abilities` : ces deux jeux de données ne
     * sont pas fournis, et `pnpm validate` refuse un chapeau qui décrirait une
     * section absente.
     */
    descriptions: {
      mechanics: 'Ce que ce hack change, et qu’aucun réflexe d’Emerald ne couvre — soft level caps, DexNav, deux Shiny Charm cumulables, et quatre minigames dont deux sont incontournables.',
      natures: 'La nature se change en boutique : les `Nature Mint` s’achètent à la Pretty Petal, sur la Route 104. Aucun usage n’est « recommandé » ici — celui d’Unbound tient à son guide.',
      tools: 'Le patch officiel, la documentation de l’auteur, et les sites à ne pas utiliser.',
      glossary: 'Le vocabulaire propre à Emerald Seaglass, celui qui n’a pas le même sens dans un autre Emerald.',
    },
  },
}
