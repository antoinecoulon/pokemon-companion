import type { ReadinessCriterion } from './types'

/**
 * §13.2 — « Un Pokémon est prêt quand les 7 cases sont cochées ».
 *
 * Quatre critères sont déduits du formulaire de la fiche plutôt que cochés à la
 * main : c'est ce qui rend la saisie structurée payante au lieu d'être une
 * redite de la checklist.
 */
export const readinessCriteria: ReadinessCriterion[] = [
  {
    key: 'level',
    label: 'Niveau 100',
    derived: true,
    hint: 'Déduit du niveau saisi. Trainer House de Dresco + Lucky Egg amélioré.',
  },
  {
    key: 'ivs',
    label: 'IV à 31 sur les stats utiles',
    derived: false,
    hint: 'L’Attack d’un attaquant spécial doit rester basse — à valider à l’œil, pas automatiquement.',
  },
  {
    key: 'evs',
    label: 'EV exacts : 252 / 252 / 4',
    derived: true,
    hint: 'Déduit des EV saisis : deux stats à 252, une à 4, aucun point perdu.',
  },
  {
    key: 'nature',
    label: 'Nature favorable',
    derived: true,
    hint: 'Déduit de la comparaison entre la nature saisie et celle du build choisi.',
  },
  {
    key: 'ability',
    label: 'Talent optimal confirmé',
    derived: false,
    hint: 'À vérifier en jeu : une Ability Capsule n’alterne que talent 1 ↔ talent 2.',
  },
  {
    key: 'moves',
    label: 'Moveset : STAB + couverture + utilitaire',
    derived: false,
    hint: 'Les 4 capacités du build, apprises via TM, Move Relearner ou tuteurs.',
  },
  {
    key: 'item',
    label: 'Objet équipé et non dupliqué',
    derived: true,
    hint: 'Déduit par contrôle croisé sur les 6 slots actifs : certains formats de la Frontier interdisent les doublons.',
  },
] satisfies ReadinessCriterion[]
