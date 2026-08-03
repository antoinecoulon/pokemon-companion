import type { GameContent } from '../games'
import type { ResourceKey } from '../types'
import { navFor } from '~/utils/navigation'
import { abilities } from './abilities'
import { completionSections } from './completion'
import { counters } from './counters'
import { phases } from './phases'
import { pokedex } from './pokedex'
import { pokemon } from './pokemon'
import { readinessCriteria } from './readiness'
import { glossary, mechanics, tools } from './reference'
import { tms } from './tms'

/**
 * Assemblage du contenu Emerald Seaglass.
 *
 * Ce jeu n'a **pas de code source public**, et sa doc primaire est un PDF de
 * 8 pages. On en avait conclu qu'il n'y avait rien à générer : c'était vrai du
 * code, faux de la donnée. `mrwalkthroughs.com` publie les 447 fiches d'espèces
 * telles qu'extraites de la ROM, d'où `pokedex`, `abilities` et `tms`, tous trois
 * **générés** par `pnpm gen:seaglass` et recoupés contre la doc officielle v3.0.
 *
 * Ce qui reste absent, et pourquoi :
 *
 * - **pas d'`encounters`**, et c'est dicté par la source, pas éditorial : elle ne
 *   donne ni niveaux, ni taux, ni slots — les trois champs qu'exige
 *   `EncounterZone` et que l'UI rend en colonnes. Les remplir de zéros serait
 *   inventer de la donnée. Les localisations vivent donc sur les entrées du
 *   Pokédex, qui est la forme que la source a réellement.
 * - **pas de `resources`.** La page `/ressources` répond 404, et ce n'est pas un
 *   trou à combler : les marchands du jeu (Happy Trainer Merchant Stand,
 *   Pretty Petal, stands de pierres) sont documentés dans la référence, où ils
 *   informent, plutôt qu'en cases `npc:` à cocher — ce qui recopierait une
 *   entrée existant déjà ailleurs, ce que ce projet s'interdit.
 * - **`pokemon` ne contient que le starter.** Le reste de la composition se
 *   construit en jeu : une capture s'enregistre depuis `/equipe` (picker
 *   « Ajouter »), sans fiche à écrire — `useRoster` synthétise une fiche
 *   minimale depuis `pokedex` pour toute espèce présente dans
 *   `state.catches`. Une vraie fiche manuscrite reste possible plus tard pour
 *   un membre qui le mérite, sur le modèle de `pokemon/treecko.ts` ; elle
 *   prend alors le relais de la synthèse sans rien migrer.
 *
 * ⚠️ La section `pokedex` **ne remplace pas** le Pokédex du jeu, refait sur le
 * modèle de HGSS et meilleur. Sa raison d'être est ce que l'écran ne peut pas
 * montrer : l'**écart avec le jeu officiel**, stat par stat.
 */
export const emeraldSeaglassContent: GameContent = {
  phases,
  pokemon,
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
     * Pas de chapeau `encounters` : ce jeu de données n'est pas fourni, et
     * `pnpm validate` refuse un chapeau qui décrirait une section absente.
     */
    descriptions: {
      mechanics: 'Ce que ce hack change, et qu’aucun réflexe d’Emerald ne couvre — soft level caps, DexNav, deux Shiny Charm cumulables, et quatre minigames dont deux sont incontournables.',
      natures: 'La nature se change en boutique : les `Nature Mint` s’achètent à la Pretty Petal, sur la Route 104. Aucun usage n’est « recommandé » ici — celui d’Unbound tient à son guide.',
      tools: 'Le patch officiel, la documentation de l’auteur, et les sites à ne pas utiliser.',
      glossary: 'Le vocabulaire propre à Emerald Seaglass, celui qui n’a pas le même sens dans un autre Emerald.',
      pokedex: 'Les 447 espèces, avec l’écart de stats vs le jeu officiel — la seule chose que le Pokédex du jeu ne peut pas afficher. Pour le reste, c’est l’écran de jeu qui fait mieux.',
      abilities: 'Les talents du jeu, avec la description que l’écran affiche. Beaucoup ont été réécrits : connaître un talent par son texte d’origine induit en erreur.',
      tms: 'Où trouver chaque TM et HM, et ce qu’il faut posséder pour y accéder.',
    },
    pokedex,
    abilities,
    tms,
  },
}
