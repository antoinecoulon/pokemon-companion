import type { PokemonSheet } from '../types'

/** §6.7-C — Utilitaire à garder en boîte (capture & Pokédex) */
export default {
  slug: 'synchro',
  name: 'Porteur de Synchronize',
  status: 'utility',
  role: 'Économise 50 000 $ de Nature Changer par capture',
  types: ['Psychic'],
  extra: [
    {
      kind: 'p',
      text: 'Un **Ralts / Kirlia / Gardevoir**, un **Abra**, un **Espeon** ou un **Umbreon** avec le talent **Synchronize** placé **en tête d’équipe** donne aux Pokémon sauvages **50 % de chances d’avoir la même nature que lui**.',
    },
    {
      kind: 'p',
      text: 'Concrètement : un Kirlia **Adamant** en tête, et un Gligar sur deux sera *Adamant*. **Tu économises 50 000 $ de Nature Changer par capture.**',
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: 'À vérifier en jeu : le guide n’a pas confirmé que *Synchronize* affecte bien les rencontres sauvages dans Unbound (c’est le cas depuis la Gen 4 dans les jeux officiels, et le CFRU suit les mécaniques Gen 8, donc c’est très probable). Test rapide : mets un porteur de *Synchronize* d’une nature rare en tête et capture cinq sauvages d’affilée.',
    },
  ],
} satisfies PokemonSheet
