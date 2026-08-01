import type { CompletionGroup } from '~/utils/completion'
import type { GameContent } from '../games'
import type { ResourceKey } from '../types'
import { navFor } from '~/utils/navigation'
import { collectibleKeys, collectibleSets } from './collectibles'
import { completionSections } from './completion'
import { counters } from './counters'
import { farmingTopics } from './farming'
import { glossary } from './glossary'
import { battleItems, battleItemsTip, consumables } from './items'
import { keyItemKeys, keyItems } from './keyitems'
import { mechanics, tools } from './mechanics'
import { missionKeys, missions } from './missions'
import { npcs } from './npcs'
import { phases } from './phases'
import { pokemon } from './pokemon'
import { readinessCriteria } from './readiness'
import { tutorKeys, tutors } from './tutors'

/**
 * Assemblage du contenu Unbound en un `GameContent`.
 *
 * L'ordre des groupes de complétion est éditorial, pas technique : la Black
 * Trainer Card d'abord parce qu'elle est la seule définition de « fini » que le
 * jeu donne, puis les missions qui en sont l'étoile la plus longue, puis le
 * reste.
 */

/** Les 27 missions d'après-Ligue sont séparées : elles ne sont pas jouables avant. */
const preLeague = missions.filter(mission => !mission.postGame)
const postLeague = missions.filter(mission => mission.postGame)

const missionGroup = (
  id: string,
  title: string,
  description: string,
  list: typeof missions,
): CompletionGroup => ({
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

const completionGroups: CompletionGroup[] = [
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

export const unboundContent: GameContent = {
  phases,
  pokemon,
  readinessCriteria,
  completionGroups,
  counters,
  /*
   * Les clés `goal:` ne sont pas listées ici : `defineGame` les déduit de
   * `completionGroups`, dont elles sortent déjà. Y figurent les catégories qui
   * se cochent ailleurs que sur la page de complétion.
   */
  resourceKeys: [
    ...npcs.map(npc => `npc:${npc.id}`),
    ...missionKeys,
    ...tutorKeys,
    ...collectibleKeys,
    ...keyItemKeys,
  ],
  reference: { mechanics, tools, glossary },
  resources: { npcs, battleItems, battleItemsTip, consumables, farmingTopics },
  nav: navFor('/unbound', [
    { label: 'Accueil', to: '/', icon: 'i-lucide-house', primary: true },
    /*
     * La complétion a pris la place de la roadmap : les phases 0 à 4 du guide
     * étaient faites, seule la Battle Frontier en restait, et elle tient
     * désormais dans une section de cette page. `/roadmap` reste routé et
     * redirige — des liens et des favoris pointent encore dessus.
     */
    { label: 'Complétion', to: '/completion', icon: 'i-lucide-trophy', primary: true },
    { label: 'Équipe', to: '/equipe', icon: 'i-lucide-users', primary: true },
    { label: 'Ressources', to: '/ressources', icon: 'i-lucide-package', primary: true },
    { label: 'Journal', to: '/journal', icon: 'i-lucide-notebook-pen', primary: true },
    // Pages consultées ponctuellement : accessibles depuis la sidebar, le header
    // mobile et les liens de tâches. La bottom-nav est pleine à 5 entrées — toute
    // nouvelle page passe forcément par ici.
    { label: 'Référence', to: '/reference', icon: 'i-lucide-book-open', primary: false },
  ]),
}
