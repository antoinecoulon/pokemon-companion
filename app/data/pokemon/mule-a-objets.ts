import type { PokemonSheet } from '../types'

/** §6.7-B — Utilitaire à garder en boîte (capture & Pokédex) */
export default {
  slug: 'mule-a-objets',
  name: 'Mule à objets',
  status: 'utility',
  role: 'Porteur de Fouille + Larcin',
  types: [],
  extra: [
    {
      kind: 'p',
      text: '**Pourquoi :** **Fouille (Frisk)** révèle l’objet tenu par le sauvage **dès l’entrée en combat**. Tu sais donc immédiatement si le combat vaut la peine d’être joué, au lieu de voler à l’aveugle. Combiné à Larcin, ça alimente **trois** de tes farms simultanément :',
    },
    {
      kind: 'table',
      head: ['Objet volé', 'Source', 'Pour quoi faire'],
      rows: [
        ['**Écailles Cœur**', 'Luvdisc (pêche Méga Canne)', 'Move Relearner de Crater Town'],
        ['**Morceaux d’Étoile**', 'Minior (DexNav, Route 1)', 'Améliorer les objets Pouvoir'],
        ['**Pierres Stase**', 'Racaillou / Rocabot (5–10 %)', 'Améliorer le Macho Brace jusqu’à ×10'],
      ],
    },
    {
      kind: 'p',
      text: '**Candidats :** **Branette (Banette)** — Fouille + Larcin + Feu Follet, disponible tôt. **Bébécaille/Noctunoir** ou **Ronflex** peuvent aussi convenir selon leur talent dans Unbound.',
    },
    {
      kind: 'quote',
      tone: 'tip',
      text: '**Ton Dusknoir sortant est un candidat naturel** : son talent caché est justement **Fouille**. Comme il quitte l’équipe de combat, tu peux lui appliquer une **Dream Mist** sans regret et le recycler en mule à objets. Ça lui donne une seconde vie utile au lieu de le laisser dormir en boîte.',
    },
  ],
} satisfies PokemonSheet
