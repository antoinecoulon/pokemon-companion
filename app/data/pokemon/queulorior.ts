import type { PokemonSheet } from '../types'

/** §6.7 — Utilitaires à garder en boîte (capture & Pokédex) */
export default {
  slug: 'queulorior',
  name: 'Queulorior',
  nameEn: 'Smeargle',
  sprite: 'smeargle',
  status: 'utility',
  role: 'Le couteau suisse de la capture',
  types: ['Normal'],
  extra: [
    {
      kind: 'p',
      text: 'Ces utilitaires ne font **pas** partie de l’équipe de combat. Ils vivent dans le PC et sortent uniquement pour les sessions de capture et de farm. Ils te feront gagner des dizaines d’heures sur la complétion du Pokédex.',
    },
    {
      kind: 'p',
      text: '**Pourquoi lui :** sa capacité **Mimique (Sketch)** copie définitivement la dernière attaque utilisée par l’adversaire. Il apprend Mimique à chaque multiple de 11 niveaux, donc il peut se constituer **le moveset de capture parfait**, que presque aucun autre Pokémon ne peut réunir seul :',
    },
    {
      kind: 'table',
      head: ['Slot', 'Capacité', 'Rôle'],
      rows: [
        ['1', '**Faux-Chage (False Swipe)**', 'Laisse toujours 1 PV — jamais de KO accidentel'],
        ['2', '**Spore**', 'Endort à **100 %** de précision. Le statut qui double le taux de capture'],
        ['3', '**Larcin (Thief)** ou **Implore (Covet)**', 'Vole l’objet tenu par le sauvage — c’est ta source d’Écailles Cœur, de Morceaux d’Étoile et de Pierres Stase'],
        ['4', '**Doux Parfum (Sweet Scent)**', 'Déclenche une rencontre immédiate — plus besoin de tourner en rond dans les hautes herbes'],
      ],
    },
    {
      kind: 'p',
      text: '**Points de vigilance :**',
    },
    {
      kind: 'list',
      items: [
        'Ses stats sont catastrophiques (BST 250). Monte-le **niveau 100** et donne-lui **252 EV en PV et en Défense** pour qu’il survive — c’est vite fait à Dresco.',
        '**Faux-Chage ne touche pas les Spectre.** Pour ceux-là, prévois un Pokémon avec une attaque faible à dégâts fixes, ou capture-les endormis à pleine vie.',
        '**Larcin échoue si Queulorior tient déjà un objet** — laisse-lui les mains vides.',
        'Pour lui apprendre une attaque, il doit **subir ou voir** cette attaque : le plus simple est de faire utiliser l’attaque par un allié en Combat Duo, ou de la subir d’un sauvage.',
        'Le guide n’a **pas trouvé sa localisation exacte dans Unbound** — utilise le **DexNav** une fois l’espèce enregistrée, ou consulte la page Locations du wiki.',
      ],
    },
  ],
} satisfies PokemonSheet
