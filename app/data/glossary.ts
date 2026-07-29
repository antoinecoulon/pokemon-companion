import type { GlossaryEntry } from './types'

// §13.3 — Glossaire.
export const glossary: GlossaryEntry[] = [
  {
    term: 'STAB',
    definition: 'bonus ×1,5 quand le type de l’attaque correspond à celui du lanceur',
  },
  {
    term: 'EV',
    definition: 'points d’entraînement (510 max au total, 252 max par stat, 4 EV = 1 point au niveau 100)',
  },
  {
    term: 'IV',
    definition: 'valeurs génétiques de 0 à 31 par stat',
  },
  {
    term: 'BST',
    definition: 'somme des statistiques de base d’une espèce',
  },
  {
    term: 'OHKO',
    definition: 'mise KO en un seul coup',
  },
  {
    term: 'Setup',
    definition: 'se booster avant d’attaquer (Danse Draco, Machination, Gonflette)',
  },
  {
    term: 'Pivot',
    definition: 'encaisse un coup puis repart avec Demi-Tour / Change Éclair',
  },
  {
    term: 'Sweeper',
    definition: 'rapide et puissant, élimine plusieurs adversaires d’affilée',
  },
  {
    term: 'Cleaner',
    definition: 'sweeper qui achève en fin de partie',
  },
  {
    term: 'Hazard',
    definition: 'piège de terrain (Piège de Roc, Picots, Pics Toxik)',
  },
  {
    term: 'Defog / Rapid Spin',
    definition: 'Anti-Brume / Tour Rapide, nettoient les hazards',
  },
  {
    term: 'Spinblocker',
    definition: 'Pokémon Spectre qui bloque Tour Rapide (mais pas Anti-Brume)',
  },
  {
    term: 'Para-flinch',
    definition: 'combo paralysie + attaque à fort taux d’apeurement',
  },
] satisfies GlossaryEntry[]
