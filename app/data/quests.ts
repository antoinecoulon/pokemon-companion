import type { Quest } from './types'

// §12 — Quêtes postgame.

export const quests: Quest[] = [
  {
    id: 'seasonal-research',
    code: '#053',
    name: 'Seasonal Research',
    location: 'Tehl Town, maison au sud-ouest du CP',
    reward: 'Débloque le Nature Changer (50 000 $ illimité)',
    interest: 5,
    note: 'fais-la en premier'
  },
  {
    id: 'portal-purge',
    code: '#050',
    name: 'Portal Purge',
    location: 'Toute la carte',
    reward: 'Tyranitarite / Garchompite / Metagrossite (selon starter) + portails légendaires',
    interest: 5
  },
  {
    id: 'all-the-right-moves',
    code: '#006',
    name: 'All the Right Moves',
    location: 'Polder Town (est de la ville, au-dessus de la Zone Safari)',
    reward: '**Gold Bottle Cap** (les 120 CT à trouver)',
    interest: 4
  },
  {
    id: 'as-hard-as-they-come',
    code: '#010',
    name: 'As Hard as They Come',
    location: 'Gurun Town',
    reward: 'Débloque l’échange 20 Pierres Dures → 1 Gemme',
    interest: 4,
    note: 'indispensable pour la Sceptilite'
  },
  {
    id: 'exp-millionaire',
    code: '#020',
    name: 'Exp. Millionaire',
    location: 'Fallshore City, Mission HQ',
    reward: 'Débloque l’amélioration de l’Œuf Chance',
    interest: 3
  },
  {
    id: 'objets-pouvoir',
    code: '#003 / #005 / #033 / #052 / #071',
    name: 'Objets Pouvoir',
    location: 'Diverses',
    reward: 'Objets Pouvoir (Brassard, Ceinture, Anneau, Bandeau, Poids)',
    interest: 4
  }
] satisfies Quest[]

/** Remarque du guide sur les entrées non vérifiées, à afficher sous la table. */
export const questsDisclaimer = 'Les entrées « The Ultimate Red Card », « Tomb Raider » et « The Black Emissary » de ton guide d’origine n’ont pas pu être vérifiées. Je les ai retirées plutôt que de te faire perdre du temps à les chercher.'
