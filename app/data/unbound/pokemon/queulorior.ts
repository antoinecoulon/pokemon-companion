import type { PokemonSheet } from '../../types'

/** §6.7 — Utilitaires à garder en boîte (capture & Pokédex) */
export default {
  slug: 'queulorior',
  name: 'Smeargle',
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
      text: '**Pourquoi lui :** sa capacité **Sketch** copie définitivement la dernière attaque utilisée par l’adversaire. Il apprend *Sketch* à chaque multiple de 11 niveaux, donc il peut se constituer **le moveset de capture parfait**, que presque aucun autre Pokémon ne peut réunir seul :',
    },
    {
      kind: 'table',
      head: ['Slot', 'Capacité', 'Rôle'],
      rows: [
        ['1', '**False Swipe**', 'Laisse toujours 1 HP — jamais de KO accidentel'],
        ['2', '**Spore**', 'Endort à **100 %** de précision. Le statut qui double le taux de capture'],
        ['3', '**Thief** ou **Covet**', 'Vole l’objet tenu par le sauvage — c’est ta source de Heart Scales, de Star Pieces et de Stasis Stones'],
        ['4', '**Sweet Scent**', 'Déclenche une rencontre immédiate — plus besoin de tourner en rond dans les hautes herbes'],
      ],
    },
    {
      kind: 'p',
      text: '**Points de vigilance :**',
    },
    {
      kind: 'list',
      items: [
        'Ses stats sont catastrophiques (BST 250). Monte-le **niveau 100** et donne-lui **252 EV en HP et en Defense** pour qu’il survive — c’est vite fait à Dresco.',
        '**False Swipe ne touche pas les Ghost.** Pour ceux-là, prévois un Pokémon avec une attaque faible à dégâts fixes, ou capture-les endormis à pleine vie.',
        '**Thief échoue si Smeargle tient déjà un objet** — laisse-lui les mains vides.',
        'Pour lui apprendre une attaque, il doit **subir ou voir** cette attaque : le plus simple est de faire utiliser l’attaque par un allié en Combat Duo, ou de la subir d’un sauvage.',
        'Le guide n’a **pas trouvé sa localisation exacte dans Unbound** — utilise le **DexNav** une fois l’espèce enregistrée, ou consulte la page Locations du wiki.',
      ],
    },
  ],
  tasks: [
    {
      id: 'mon-queulorior-1',
      label: 'Trouver et capturer un **Smeargle** — localisation non documentée par le guide, passer par le **DexNav** une fois l’espèce enregistrée',
      priority: 1,
      done: false,
    },
    {
      id: 'mon-queulorior-2',
      label: '*Sketch* n°1 → **False Swipe** (laisse toujours 1 HP)',
      requires: ['mon-queulorior-1'],
      done: false,
    },
    {
      id: 'mon-queulorior-3',
      label: '*Sketch* n°2 → **Spore** (endort à 100 %, double le taux de capture)',
      requires: ['mon-queulorior-1'],
      done: false,
    },
    {
      id: 'mon-queulorior-4',
      label: '*Sketch* n°3 → **Thief** ou **Covet** (source de Heart Scales, Star Pieces, Stasis Stones)',
      requires: ['mon-queulorior-1'],
      done: false,
    },
    {
      id: 'mon-queulorior-5',
      label: '*Sketch* n°4 → **Sweet Scent** (déclenche une rencontre immédiate)',
      requires: ['mon-queulorior-1'],
      done: false,
    },
    {
      id: 'mon-queulorior-6',
      label: 'Niveau 100 et **252 EV en HP + 252 en Defense** à Dresco — BST 250, sans ça il tombe sur n’importe quoi',
      requires: ['mon-queulorior-1'],
      done: false,
    },
    {
      id: 'mon-queulorior-7',
      label: 'Le laisser **les mains vides** : *Thief* échoue si Smeargle tient déjà un objet',
      requires: ['mon-queulorior-4'],
      done: false,
    },
  ],
} satisfies PokemonSheet
