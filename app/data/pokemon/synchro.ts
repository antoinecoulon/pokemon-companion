import type { PokemonSheet } from '../types'

/** §6.7-C — Utilitaire à garder en boîte (capture & Pokédex) */
export default {
  slug: 'synchro',
  name: 'Porteur de Synchro',
  status: 'utility',
  role: 'Économise 50 000 $ de Nature Changer par capture',
  types: ['Psy'],
  extra: [
    {
      kind: 'p',
      text: 'Un **Tarsal / Kirlia / Gardevoir**, un **Abra**, un **Mentali** ou un **Noctali** avec le talent **Synchro** placé **en tête d’équipe** donne aux Pokémon sauvages **50 % de chances d’avoir la même nature que lui**.',
    },
    {
      kind: 'p',
      text: 'Concrètement : un Kirlia **Rigide** en tête, et un Gligar sur deux sera Rigide. **Tu économises 50 000 $ de Nature Changer par capture.**',
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: 'À vérifier en jeu : le guide n’a pas confirmé que Synchro affecte bien les rencontres sauvages dans Unbound (c’est le cas depuis la Gen 4 dans les jeux officiels, et le CFRU suit les mécaniques Gen 8, donc c’est très probable). Test rapide : mets un Synchro d’une nature rare en tête et capture cinq sauvages d’affilée.',
    },
  ],
} satisfies PokemonSheet
