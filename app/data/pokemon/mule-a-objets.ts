import type { PokemonSheet } from '../types'

/** §6.7-B — Utilitaire à garder en boîte (capture & Pokédex) */
export default {
  slug: 'mule-a-objets',
  name: 'Mule à objets',
  status: 'utility',
  role: 'Porteur de Frisk + Thief',
  types: [],
  extra: [
    {
      kind: 'p',
      text: '**Pourquoi :** **Frisk** révèle l’objet tenu par le sauvage **dès l’entrée en combat**. Tu sais donc immédiatement si le combat vaut la peine d’être joué, au lieu de voler à l’aveugle. Combiné à *Thief*, ça alimente **trois** de tes farms simultanément :',
    },
    {
      kind: 'table',
      head: ['Objet volé', 'Source', 'Pour quoi faire'],
      rows: [
        ['**Heart Scales**', 'Luvdisc (pêche Super Rod)', 'Move Relearner de Crater Town'],
        ['**Star Pieces**', 'Minior (DexNav, Route 1)', 'Améliorer les Power items'],
        ['**Stasis Stones**', 'Geodude / Roggenrola (5–10 %)', 'Améliorer le Macho Brace jusqu’à ×10'],
      ],
    },
    {
      kind: 'p',
      text: '**Candidats :** **Banette** — *Frisk* + *Thief* + *Will-O-Wisp*, disponible tôt. **Duskull/Dusknoir** ou **Snorlax** peuvent aussi convenir selon leur talent dans Unbound.',
    },
    {
      kind: 'quote',
      tone: 'tip',
      text: '**Ton Dusknoir sortant est un candidat naturel** : son talent caché est justement **Frisk**. Comme il quitte l’équipe de combat, tu peux lui appliquer une **Dream Mist** sans regret et le recycler en mule à objets. Ça lui donne une seconde vie utile au lieu de le laisser dormir en boîte.',
    },
  ],
  tasks: [
    {
      id: 'mon-mule-a-objets-1',
      label: 'Choisir le porteur : **Dusknoir recyclé** (talent caché *Frisk*, il quitte l’équipe de toute façon) ou **Banette**, disponible plus tôt',
      priority: 1,
      link: '/equipe/dusknoir',
      done: false,
    },
    {
      id: 'mon-mule-a-objets-2',
      label: 'Si Dusknoir : **Dream Mist** pour basculer sur *Frisk* — sans regret, puisqu’il ne combat plus',
      requires: ['mon-mule-a-objets-1'],
      done: false,
    },
    {
      id: 'mon-mule-a-objets-3',
      label: 'Lui apprendre **Thief** (TM) — *Frisk* montre ce que porte le sauvage, *Thief* le prend',
      requires: ['mon-mule-a-objets-1'],
      done: false,
    },
    {
      id: 'mon-mule-a-objets-4',
      label: 'Farm **Heart Scales** sur les Luvdisc au Super Rod → Move Relearner de Crater Town',
      requires: ['mon-mule-a-objets-3'],
      done: false,
    },
    {
      id: 'mon-mule-a-objets-5',
      label: 'Farm **Star Pieces** sur les Minior (DexNav, Route 1) → améliorer les Power items',
      requires: ['mon-mule-a-objets-3'],
      done: false,
    },
    {
      id: 'mon-mule-a-objets-6',
      label: 'Farm **Stasis Stones** sur les Geodude / Roggenrola (5–10 %) → améliorer le Macho Brace jusqu’à ×10',
      requires: ['mon-mule-a-objets-3'],
      done: false,
    },
  ],
} satisfies PokemonSheet
