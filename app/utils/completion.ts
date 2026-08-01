import type { ResourceKey } from '~/data/types'

/**
 * Forme commune de la complétion, tous jeux confondus.
 *
 * Chaque jeu alimente cette page depuis des fichiers de contenu aux types
 * différents — Unbound a des objectifs éditoriaux, des missions, des move
 * tutors, des collectibles et des objets clés ; un autre jeu aura autre chose.
 * Sans cet aplatissement, `completion.vue` porterait une boucle par catégorie et
 * `useProgress` un comptage par catégorie : chaque nouvelle catégorie se paierait
 * deux fois, et le jour où l'une serait oubliée dans le comptage, le pourcentage
 * mentirait sans que rien ne le signale.
 *
 * L'assemblage, lui, est propre à chaque jeu et vit dans son contenu
 * (`app/data/<jeu>/index.ts`) : c'est là que se décide l'ordre éditorial des
 * groupes.
 */

export interface CompletionEntry {
  /** Clé persistée, préfixe compris. C'est elle qu'on coche. */
  key: ResourceKey
  label: string
  /** Ligne principale sous le libellé : objectif d'une mission, effet d'un objet. */
  summary?: string
  location?: string
  reward?: string
  details?: string[]
  /** URL de la page wiki, rendue en lien. */
  source: string
  /** Bonus assumé : n'entre pas dans le décompte comme un manque. */
  optional?: boolean
  /** Refaisable : reste affichée une fois cochée, jamais archivée. */
  repeatable?: boolean
}

export interface CompletionGroup {
  id: string
  title: string
  description?: string
  entries: CompletionEntry[]
}
