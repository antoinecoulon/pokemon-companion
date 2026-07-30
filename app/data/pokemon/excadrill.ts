import type { PokemonSheet } from '../types'

/** Slot 2 — Excadrill : aucune fiche dans le guide source */
export default {
  slug: 'excadrill',
  nameEn: 'Excadrill',
  sprite: 'excadrill',
  name: 'Excadrill',
  slot: 2,
  status: 'active',
  badge: 'Conservé',
  role: 'Sweeper Baigne Sable + Tour Rapide',
  types: ['Sol', 'Acier'],
  incomplete: true,
  incompleteNote: 'Le guide place Excadrill au slot 2 (§7.3) et le recommande en phase 4.1, mais ne lui consacre aucune fiche en §6 : ni stats de base, ni build, ni TODO. Les éléments ci-dessous sont les seuls que le guide donne réellement à son sujet.',
  analysis: [
    {
      kind: 'list',
      items: [
        '**Tour Rapide + Baigne Sable, synergie parfaite avec Tyranitar** — c’est à ce titre qu’il est retenu en §4.1 pour combler le trou n°1 de l’équipe.',
        'Il apporte le **seul retrait de hazards** de l’équipe (§7.3) : sans lui, le Piège de Roc détruit Togekiss à 25 % par entrée.',
        'Sous le sable, il **gagne 176 de Vitesse** (§6.5) — c’est ce qui lui fait préférer Zeraora, puni par le sable là où Excadrill en profite.',
        '**Résiste à la Glace** (§7.3) : avec Flagadoss, c’est ton switch obligatoire contre les attaquants Glace.',
        'Faiblesses citées par le guide : **Combat ×2** et **Feu ×2** (§6.2), **Eau ×2** (§6.2, §6.6) — les trois couvertes par Flagadoss.',
        'Objet prévu en §7.3 : **Bandeau Choix**.',
      ],
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: 'Fiche à compléter : stats de base d’Unbound, talent exact, nature, répartition d’EV et moveset restent à établir sur **romhackdex.net/unbound**.',
    },
  ],
} satisfies PokemonSheet
