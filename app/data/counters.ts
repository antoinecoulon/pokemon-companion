import type { CounterDef } from './types'

/**
 * Compteurs de ressources. Les objectifs viennent des chiffres du guide :
 * ~500 000 $ (§5 phase 2.1) et ~200 BP (§5 phase 2.3).
 */
export const counters: CounterDef[] = [
  {
    id: 'money',
    label: 'Argent',
    icon: 'i-lucide-banknote',
    goal: 500000,
    hint: '5 changements de nature à 50 000 $ + marge. Trainer House de Dresco, Amulet Coin améliorée en tête.',
  },
  {
    id: 'bp',
    label: 'BP',
    icon: 'i-lucide-ticket',
    goal: 200,
    hint: 'À garder pour les objets Choix (48 BP pièce) — la purge d’EV passe par les baies de Fallshore, 0 BP.',
  },
  {
    id: 'bottleCaps',
    label: 'Bottle Caps',
    icon: 'i-lucide-circle-dot',
    hint: 'Minage ADM (KBT Expressway, Crystal Peak) + raids 5–6★. 1 cap = 1 IV porté à 31.',
  },
  {
    id: 'heartScales',
    label: 'Écailles Cœur',
    icon: 'i-lucide-heart',
    hint: 'Pêche aux Luvdisc à la Méga Canne avec Fouille + Larcin. Monnaie du Move Relearner de Crater Town.',
  },
] satisfies CounterDef[]
