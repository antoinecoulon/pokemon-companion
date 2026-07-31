import type { PokemonSheet } from '../types'

/** Sorti de l'équipe (§7.3) — cité comme sortant sans avoir de fiche en §6 */
export default {
  slug: 'sceptile',
  sprite: 'sceptile',
  name: 'Sceptile',
  status: 'retired',
  badge: 'Sorti de l’équipe',
  role: 'Jamais optimisé — remplacé par Slowbro',
  types: ['Grass'],
  baseStats: { hp: 70, atk: 85, def: 65, spa: 105, spd: 85, spe: 120 },
  bst: 530,
  abilities: [
    { name: 'Overgrow' },
    { name: 'Unburden', hidden: true },
  ],
  mega: {
    stone: 'Sceptilite',
    stats: { hp: 70, atk: 110, def: 75, spa: 145, spd: 85, spe: 145 },
    bst: 630,
    note: 'Passe **Grass/Dragon** et gagne **Technician** — Unbound s’écarte ici du jeu officiel, qui donne *Lightning Rod*. La pierre dépend de la mission **#010** (20 Hard Stones → 1 Gem, §12). Le double type coûte cher : **4× faible à Ice**, et Poison, Flying, Bug, Dragon et Fairy passent à 2×.',
  },
  obtention: 'Évolution de Grovyle au niveau 36 (Treecko → Grovyle au 16).',
  preamble: [
    {
      kind: 'quote',
      tone: 'info',
      text: '**Décision prise :** Sceptile quitte l’équipe sans avoir été optimisé (§7.3). Fiche conservée pour référence — le guide ne lui consacre aucune section en §6, ce qui est reconstitué ici depuis les données Unbound et les raisonnements où il apparaît.',
    },
  ],
  analysis: [
    {
      kind: 'p',
      text: 'Sceptile n’est pas mauvais : **120 en Speed et 105 en SpA** en font un attaquant spécial rapide tout à fait correct. Ce qui l’a sorti, ce n’est pas sa fiche de stats, c’est sa place dans **cette** équipe.',
    },
    {
      kind: 'list',
      items: [
        'Motif de sortie donné en §7.3 : **jamais optimisé**, et §7.2 le cite comme l’un des **deux slots faibles** (« Sceptile non-Mega »).',
        'Il était l’une des deux branches du **conflit de Mega** avec Tyranitar (§0.5) — tranché en faveur de Tyranitar. Sans sa Mega, il reste à 530 de BST là où le reste de l’équipe monte.',
        '**Il prenait le chip du sable** de ton propre Tyranitar (§6.1) : 6,25 % par tour, infligés par ton propre jeu.',
        'Son remplaçant est **Slowbro**, qui apporte la résistance au Fighting qui manquait (§6.2).',
        '**65 en Defense pour 70 HP** : tout ce qui le touche physiquement le sort, ce qui l’empêche de tenir le rôle de pivot que Slowbro assure.',
      ],
    },
    {
      kind: 'p',
      text: '**Ce qu’il aurait fallu pour le rendre viable** — et qui explique le coût du renoncement :',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'La **Sceptilite**, donc la mission **#010** : 20 Hard Stones échangées contre 1 Gem (§12).',
        'Renoncer à Mega Tyranitar, puisqu’on ne Mega-évolue qu’une fois par combat (§0.5).',
        'Le **Hidden Power Fire** pour couvrir Steel — qui passe par le **Hidden Power Changer** de la Frontier, contre BP, le Hyper Training ne touchant pas au Hidden Power (§2.1).',
      ],
    },
    {
      kind: 'quote',
      tone: 'tip',
      text: 'Rien n’est perdu : si tu reviens un jour sur le conflit de Mega, **Technician** sur Mega Sceptile récompense les capacités de puissance ≤ 60 — c’est une orientation de build entièrement différente de celle du jeu officiel, où la Mega sert de paratonnerre électrique.',
    },
  ],
} satisfies PokemonSheet
