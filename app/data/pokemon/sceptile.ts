import type { PokemonSheet } from '../types'

/** Sorti de l'équipe (§7.3) — cité comme sortant sans avoir de fiche en §6 */
export default {
  slug: 'sceptile',
  nameEn: 'Sceptile',
  sprite: 'sceptile',
  name: 'Sceptile',
  status: 'retired',
  badge: 'Sorti de l’équipe',
  role: 'Jamais optimisé — remplacé par Flagadoss',
  types: ['Plante'],
  incomplete: true,
  incompleteNote: 'Le guide range Sceptile parmi les sortants (§7.3, « jamais optimisé ») et ne lui consacre aucune fiche en §6. Il n’apparaît plus que dans les raisonnements sur le conflit de Méga (§0.5, §6.2) et le chip du sable (§6.1).',
  analysis: [
    {
      kind: 'list',
      items: [
        'Motif de sortie donné en §7.3 : **jamais optimisé**, et §7.2 le cite comme l’un des **deux slots faibles** (« Sceptile non-Méga »).',
        'Il était l’une des deux branches du **conflit de Méga** avec Tyranitar (§0.5) — tranché en faveur de Tyranitar.',
        '**Il prenait le chip du sable** de ton propre Tyranitar (§6.1).',
        'Son remplaçant est **Flagadoss**, qui apporte la résistance au Combat qui manquait (§6.2).',
        'Reste utile à savoir : la **Sceptilite** dépend de la mission **#010** (20 Pierres Dures → 1 Gemme, §12), et la **Puissance Cachée Feu** passait par le Hidden Power Changer de la Frontier (§2.1).',
      ],
    },
  ],
} satisfies PokemonSheet
