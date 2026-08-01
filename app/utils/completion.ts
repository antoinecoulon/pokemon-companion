import type { ResourceKey } from '~/data/types'
import { collectibleSets } from '~/data/collectibles'
import { completionSections } from '~/data/completion'
import { keyItems } from '~/data/keyitems'
import { missions } from '~/data/missions'
import { tutors } from '~/data/tutors'

/**
 * Aplatissement de la complétion en une seule forme.
 *
 * Cinq fichiers de contenu aux types différents — objectifs éditoriaux,
 * missions, move tutors, collectibles, objets clés — alimentent une seule page.
 * Sans cet adaptateur, `completion.vue` porterait cinq boucles quasi identiques
 * et `useProgress` cinq comptages : chaque nouvelle catégorie se paierait deux
 * fois, et le jour où l'une serait oubliée dans le comptage, le pourcentage
 * mentirait sans que rien ne le signale.
 *
 * L'ordre des groupes est éditorial, pas technique : la Black Trainer Card
 * d'abord parce qu'elle est la seule définition de « fini » que le jeu donne,
 * puis les missions qui en sont l'étoile la plus longue, puis le reste.
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

/** Les 27 missions d'après-Ligue sont séparées : elles ne sont pas jouables avant. */
const preLeague = missions.filter(mission => !mission.postGame)
const postLeague = missions.filter(mission => mission.postGame)

const missionGroup = (id: string, title: string, description: string, list: typeof missions) => ({
  id,
  title,
  description,
  entries: list.map(mission => ({
    key: `mission:${mission.id}` as ResourceKey,
    label: mission.label,
    summary: mission.objective,
    location: mission.location,
    reward: mission.reward,
    /*
     * Les prérequis d'une mission sont sa seule information vraiment
     * actionnable : ils disent pourquoi elle n'apparaît pas encore en jeu.
     */
    details: mission.unlocks?.length ? mission.unlocks : undefined,
    source: mission.source,
  })),
})

export const completionGroups: CompletionGroup[] = [
  /* Les sections éditoriales gardent leur ordre et leurs ids `goal:`. */
  ...completionSections.map(section => ({
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

  missionGroup(
    'missions-pre-ligue',
    'Missions — avant la Ligue',
    'Les 57 missions accessibles en cours de partie. Les terminer toutes, les 84, vaut une étoile de la Black Trainer Card.',
    preLeague,
  ),
  missionGroup(
    'missions-post-ligue',
    'Missions — après la Ligue',
    'Les 27 missions qui ne s’ouvrent qu’une fois Champion. Battre Aklove dans les Depths of the Ruins of Void fait afficher à l’écran des missions la position de celles qui restent.',
    postLeague,
  ),

  {
    id: 'key-items',
    title: 'Key Items',
    description:
      'Les objets clés qui débloquent un déplacement, un service ou une mécanique. Le wiki en compte 40 ; les 34 qui ont une fiche vérifiable sont ici — les six autres (Barrier Key, Berry Pouch, Key Cards, N-Lunarizer, N-Solarizer, TM Case) n’ont pas de page à citer.',
    entries: keyItems.map(item => ({
      key: `item:${item.id}` as ResourceKey,
      label: item.label,
      summary: item.details?.[0],
      location: item.location,
      source: item.source,
    })),
  },

  {
    id: 'move-tutors',
    title: 'Move Tutors',
    description:
      'Les 29 tuteurs du jeu : quatre Shard Tutors, la Gem Family du KBT Expressway (un par type), et ceux de la Battle Frontier. Cocher veut dire « repéré » — un tuteur continue d’enseigner, il reste donc affiché.',
    entries: tutors.map(tutor => ({
      key: `tutor:${tutor.id}` as ResourceKey,
      label: tutor.label,
      /*
       * La liste des capacités tient sur une ligne et c'est la seule chose qu'on
       * vient chercher : la déplier en `details` ferait des pavés de vingt
       * lignes pour la Gem Family.
       */
      summary: tutor.moves.map(move => `${move.name} (${move.cost})`).join(' · '),
      location: tutor.location,
      details: tutor.details,
      source: tutor.source,
      repeatable: tutor.repeatable,
    })),
  },

  ...collectibleSets.map(set => ({
    id: set.id,
    title: set.title,
    description: set.description,
    entries: set.entries.map(entry => ({
      key: `${set.prefix}:${entry.id}` as ResourceKey,
      label: entry.label,
      location: entry.location,
      details: entry.details,
      source: entry.source,
      repeatable: entry.repeatable,
    })),
  })),
]

/** Toutes les entrées, tous groupes confondus — la base du comptage. */
export const completionEntries = completionGroups.flatMap(group => group.entries)
