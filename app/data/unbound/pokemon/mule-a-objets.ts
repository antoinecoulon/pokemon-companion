import type { PokemonSheet } from '../../types'

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
      text: '**Le porteur : Banette.** *Frisk* est son **talent 2** (pas caché) — une simple **Ability Capsule** suffit si un exemplaire capturé a *Insomnia*. Il apprend aussi *Will-O-Wisp* (niveau 18) et *Thief* (TM46) nativement, donc rien à aller chercher ailleurs.',
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: '**Correction (romhackdex.net/unbound) : Dusknoir n\'a pas Frisk.** Le guide d\'origine le proposait comme mule recyclée en supposant que *Frisk* était son talent caché — c\'est **Iron Fist** dans Unbound (voir sa fiche). Il ne peut donc pas tenir ce rôle : Banette est la seule option ici.',
    },
  ],
  tasks: [
    {
      id: 'mon-mule-a-objets-1',
      label: 'Capturer un **Banette** et vérifier son talent : **Insomnia** ou **Frisk**. Si *Insomnia* → **Ability Capsule** (Game Corner de Dehara) pour basculer sur *Frisk*',
      priority: 1,
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
