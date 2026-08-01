import type { CounterDef } from '../types'

/**
 * Deux compteurs seulement, et c'est la mécanique du jeu qui le veut.
 *
 * Pas de Bottle Caps : les IV sont à 31 par défaut. Pas de Heart Scales : les
 * capacités s'apprennent depuis le menu, sans Move Relearner à payer. Ce qui
 * reste rare, c'est le **BP**, seule monnaie de l'Adoption Center — donc le
 * seul accès aux formes Redux et à la plupart des Mega Stones.
 */
export const counters: CounterDef[] = [
  {
    id: 'bp',
    label: 'BP',
    icon: 'i-lucide-ticket',
    hint: 'Gagnés en combattant des dresseurs. Seule monnaie de l’Adoption Center : formes Redux, puis Mega Stones après Norman.',
  },
  {
    id: 'money',
    label: 'Argent',
    icon: 'i-lucide-banknote',
    hint: 'Beaucoup moins critique qu’ailleurs : Nurse Joy fournit balls, berries et battle items gratuitement, et les Poké Marts n’existent plus.',
  },
] satisfies CounterDef[]
