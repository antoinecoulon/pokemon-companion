import type { PokemonSheet } from '../types'

/** Slot 4 — Motisma-Lavage : aucune fiche dans le guide source */
export default {
  slug: 'motisma-lavage',
  name: 'Motisma-Lavage',
  nameEn: 'Rotom-Wash',
  sprite: 'rotom-wash',
  slot: 4,
  status: 'active',
  badge: 'Nouveau',
  role: 'Pivot spécial / Feu Follet / Change Éclair',
  types: ['Électrik', 'Eau'],
  incomplete: true,
  incompleteNote: 'Le guide introduit Motisma-Lavage au slot 4 dans la composition finale (§7.3) mais ne lui consacre aucune fiche en §6 : ni stats de base, ni analyse, ni build, ni TODO. Les éléments ci-dessous sont les seuls que le guide donne réellement à son sujet.',
  analysis: [
    {
      kind: 'list',
      items: [
        'Rôle assigné en §7.3 : **pivot spécial**, avec **Feu Follet** et **Change Éclair**.',
        'Objet prévu : **Restes ou Ballon**. ⚠️ §7.3 signale que Togekiss, Motisma et Flagadoss sont **trois candidats aux Restes** — à répartir si le format interdit les doublons.',
        'Il apporte une des **3 immunités Sol** de l’équipe et une des **2 résistances Eau** (§7.3).',
        'Il fait partie des **4 sources de soin fiable** de la nouvelle composition (§7.3).',
        '**Il subit le chip du sable** de ton propre Tyranitar (§7.3), avec Togekiss et Flagadoss.',
        'Il fait passer le ratio physique / spécial de l’équipe de 4/1 à **3/3** (§7.3).',
      ],
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: 'Fiche à compléter : stats de base d’Unbound, talent (Lévitation ou Motor Drive selon la forme), nature, répartition d’EV et moveset complet restent à établir sur **romhackdex.net/unbound**.',
    },
  ],
} satisfies PokemonSheet
