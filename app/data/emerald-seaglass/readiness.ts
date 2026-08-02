import type { ReadinessCriterion } from '../types'

/**
 * « Un Pokémon est prêt » — version Emerald Seaglass.
 *
 * Ce jeu est un Emerald côté mécaniques : les sept critères d'Unbound
 * s'appliquent tous, et il n'y a **pas** de critère `innates` (c'est une
 * particularité d'Elite Redux, à ne pas décalquer ici).
 *
 * Deux nuances propres à ce hack, qui changent ce que chaque case veut dire :
 *
 * - **le plafond de niveau est un *soft* cap.** Dépasser le niveau du Gym Leader
 *   en cours ne bloque rien : l'EXP est d'abord divisée par deux, puis réduite
 *   davantage. Et le **Hard Mode**, réglé par le livre sur le bureau de la
 *   chambre, retire les caps. Le critère ne peut donc pas se déduire d'un
 *   niveau cible unique — d'où `derived: false`, contrairement à Unbound où
 *   c'était « niveau 100 ».
 * - **les IV se lisent en jeu**, touche `A` dans l'écran de résumé, et **tout
 *   Pokémon a au moins 2 IV parfaits**. Un DexNav chaîné en donne davantage.
 *
 * Source : documentation officielle de l'auteur, voir `docs/emerald-seaglass/`.
 */
export const readinessCriteria: ReadinessCriterion[] = [
  {
    key: 'level',
    label: 'Au soft level cap courant',
    derived: false,
    hint: 'Le cap est le niveau max du Gym Leader en cours : au-delà, l’EXP est divisée par deux puis réduite encore. Le Hard Mode (livre sur le bureau) les retire. ⚠️ Les valeurs par badge ne sont pas documentées — à relever en jeu.',
  },
  {
    key: 'ivs',
    label: 'IV à 31 sur les stats utiles',
    derived: false,
    hint: 'Touche `A` dans l’écran de résumé pour les lire. Tout Pokémon a au moins 2 IV parfaits ; chaîner au DexNav en ajoute. L’Atk d’un attaquant spécial doit rester basse — à valider à l’œil.',
  },
  {
    key: 'evs',
    label: 'EV exacts : 252 / 252 / 4',
    derived: true,
    hint: 'Déduit des EV saisis : deux stats à 252, une à 4, aucun point perdu. Les `Stat Feather` et `Vitamin` s’achètent au Happy Trainer Merchant Stand de Petalburg.',
  },
  {
    key: 'nature',
    label: 'Nature favorable',
    derived: true,
    hint: 'Déduit de la comparaison entre la nature saisie et celle du build choisi. Les `Nature Mint` s’achètent à la Pretty Petal, sur la Route 104 au sud de Rustboro.',
  },
  {
    key: 'ability',
    label: 'Talent optimal confirmé',
    derived: false,
    hint: 'Les `Ability Capsule` s’achètent au Happy Trainer Merchant Stand de Petalburg, dont le stock s’étoffe à chaque badge.',
  },
  {
    key: 'moves',
    label: 'Moveset : STAB + couverture + utilitaire',
    derived: false,
    hint: 'Les movesets sont ceux d’USUM, retouchés — beaucoup d’espèces ont plus de couverture qu’ailleurs. Le Pokédex du jeu affiche les movesets : le consulter plutôt que se fier à sa mémoire.',
  },
  {
    key: 'item',
    label: 'Objet équipé et non dupliqué',
    derived: true,
    hint: 'Déduit par contrôle croisé sur les six membres actifs. Les objets `Choice` s’achètent au Happy Trainer Merchant Stand de Petalburg.',
  },
] satisfies ReadinessCriterion[]
