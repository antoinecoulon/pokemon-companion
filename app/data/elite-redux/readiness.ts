import type { ReadinessCriterion } from '../types'

/**
 * « Un Pokémon est prêt » — version Elite Redux.
 *
 * Deux écarts de fond avec Unbound, qui viennent des mécaniques du jeu :
 *
 * - **pas de critère IV.** Tous les Pokémon ont 31 partout par défaut ; le
 *   critère n'aurait rien à vérifier. Le seul réglage d'IV du jeu est l'`Iron
 *   Pill`, qui met la Spe à 0 pour du Trick Room — un choix de build, pas un
 *   travail de préparation.
 * - **un critère `innates`.** C'est la particularité du jeu : 3 talents passifs
 *   liés à l'espèce, actifs en plus de l'ability choisie, et **verrouillés au
 *   départ en mode Elite**. Ils se débloquent en battant les gyms, et changent
 *   le build quand ils arrivent — d'où une case dédiée, à recocher après chaque
 *   déblocage.
 *
 * Le niveau visé est le **level cap courant**, pas 100 : monter au-delà est
 * impossible, et les dresseurs scalent.
 */
export const readinessCriteria: ReadinessCriterion[] = [
  {
    key: 'level',
    label: 'Au level cap courant',
    derived: false,
    hint: 'Le cap dépend des badges obtenus (16 / 23 / 36 / 45 / 50 / 55 / 60 / 70 / 80 en mode Elite). La Candy Box monte directement au plafond.',
  },
  {
    key: 'evs',
    label: 'EV exacts : 252 / 252 / 4',
    derived: true,
    hint: 'Déduit des EV saisis : deux stats à 252, une à 4, aucun point perdu. Se règle dans l’écran de résumé, sans grind.',
  },
  {
    key: 'nature',
    label: 'Nature favorable',
    derived: true,
    hint: 'Déduit de la comparaison entre la nature saisie et celle du build choisi. Se change librement dans l’écran de résumé.',
  },
  {
    key: 'ability',
    label: 'Ability choisie parmi les 3',
    derived: false,
    hint: 'Une seule ability switchable est active à la fois. Toutes les descriptions ont été réécrites : les relire même quand le nom est familier.',
  },
  {
    key: 'innates',
    label: 'Les 3 innates lus et pris en compte',
    derived: false,
    hint: 'Passifs, liés à l’espèce, actifs en plus de l’ability. Verrouillés au départ en mode Elite — à revoir après chaque gym qui en débloque.',
  },
  {
    key: 'moves',
    label: 'Moveset : STAB + couverture + utilitaire',
    derived: false,
    hint: 'Les capacités hors niveau s’apprennent depuis le menu Party ou Moves (touche R), sans tuteur ni TM à acheter.',
  },
  {
    key: 'item',
    label: 'Objet équipé et non dupliqué',
    derived: true,
    hint: 'Déduit par contrôle croisé sur les six membres actifs. Les objets tenus se régénèrent après chaque combat.',
  },
] satisfies ReadinessCriterion[]
