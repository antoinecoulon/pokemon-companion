import type { FarmingTopic } from '../types'

// §11 — Farming endgame.
export const farmingTopics: FarmingTopic[] = [
  {
    id: 'argent',
    title: 'Argent',
    blocks: [
      {
        kind: 'list',
        items: [
          '**Trainer House de Dresco Town** en boucle, avec **Amulet Coin** (ou Luck Incense) améliorée sur le Pokémon de tête.',
          'L’Amulet Coin s’obtient par l’échange en jeu de Blizzard City (Onix contre Electrode), puis s’améliore chez le PNJ au centre de Tehl Town contre des Big Nuggets.',
        ],
      },
    ],
  },
  {
    id: 'experience',
    title: 'Expérience',
    blocks: [
      {
        kind: 'list',
        items: [
          '**Trainer House de Dresco Town**, dresseur XP au maximum, avec **Lucky Egg** amélioré (PNJ du Mission HQ de Fallshore City, après la mission #020) contre des Big Pearls.',
        ],
      },
    ],
  },
  {
    id: 'ev-training',
    title: 'EV training',
    blocks: [
      {
        kind: 'list',
        items: [
          '**Trainer House de Dresco Town** (coin sud-est) — dresseurs spécialisés par stat, identifiables via leur dialogue d’avant-combat. Avant Blizzard City : HP/XP, Attack, Sp. Atk, Speed. Après Blizzard City : Defense et Sp. Def aussi.',
          '**Macho Brace amélioré (jusqu’à ×10)** + **Power item** correspondant + **Pokérus** → une stat se maxe en une poignée de combats. Détail complet en §2.2.',
          'En *Vanilla*, monte temporairement la difficulté en *Difficile* : les dresseurs utilisent des Pokémon évolués de plus haut niveau, qui donnent plus d’EV.',
          '**Baies réductrices** en cas d’erreur : marché en plein air de **Fallshore City**.',
        ],
      },
    ],
  },
  {
    id: 'bottle-caps',
    title: 'Bottle Caps',
    blocks: [
      {
        kind: 'list',
        items: [
          '**Minage avec l’ADM Gear** dans le KBT Expressway et Crystal Peak (méthode la plus régulière).',
          '**Raids 5–6★** (drop rare).',
          'Certaines récompenses de missions.',
        ],
      },
    ],
  },
  {
    id: 'ecailles-coeur',
    title: 'Heart Scales',
    blocks: [
      {
        kind: 'list',
        items: [
          'Pêche aux **Luvdisc** au Super Rod, avec un Pokémon en tête ayant **Frisk** pour révéler l’objet, et **Thief** pour le voler.',
          'Également disponibles au minage.',
        ],
      },
    ],
  },
] satisfies FarmingTopic[]
