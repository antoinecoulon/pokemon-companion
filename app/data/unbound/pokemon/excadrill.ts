import type { PokemonSheet } from '../../types'

export default {
  slug: 'excadrill',
  name: 'Excadrill',
  sprite: 'excadrill',
  slot: 2,
  status: 'active',
  badge: 'Conservé',
  role: 'Sweeper Sand Rush + Rapid Spin',
  types: ['Ground', 'Steel'],
  baseStats: { hp: 110, atk: 135, def: 60, spa: 50, spd: 65, spe: 88 },
  bst: 508,
  abilities: [
    { name: 'Sand Rush' },
    { name: 'Sand Force' },
    { name: 'Mold Breaker', hidden: true },
  ],
  targetAbility: 'Sand Rush',
  obtention: 'Évolution de **Drilbur au niveau 31**, ou capture directe au **Cinder Volcano Shadow Base**, à la **Victory Road**, et dans les repaires de raid d\'**Icicle Cave** et du **Cinder Volcano** (3-5★).',
  analysis: [
    {
      kind: 'p',
      text: 'C\'est la pièce qui répare le trou n°1 de l\'équipe (§7.2) : **elle apporte le seul retrait de hazards**. Sans elle, le *Stealth Rock* adverse coûte 25 % de HP à Togekiss à chaque entrée, ce qui suffit à faire perdre un run entier de Battle Tower par usure.',
    },
    {
      kind: 'p',
      text: '**Sand Rush double sa Speed sous le sable** : 88 de base passe à l\'équivalent de 176, ce qui la fait dépasser à peu près tout. C\'est la synergie qui a coûté sa place à Zeraora (§6.5) — Zeraora est puni par ton propre sable, Excadrill en vit. Elle est aussi **immunisée au chip du sable** (type Ground), comme Tyranitar et Gliscor.',
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: '**La Speed sous sable est conditionnelle.** Hors tempête, Excadrill est à 88 — correct, pas rapide. Si le sable tombe (8 tours avec la *Smooth Rock*, 5 sans) ou si l\'adversaire impose sa propre météo, elle redevient lente et fragile (60 Defense / 65 SpD).',
    },
    {
      kind: 'p',
      text: '**Ses faiblesses sont exactement celles que Slowbro couvre** (§6.2) : Fighting ×2, Fire ×2, Water ×2, Ground ×2. Le switch est écrit d\'avance. En échange, elle **résiste à l\'Ice**, ce qui en fait avec Slowbro l\'un des deux seuls recours contre les attaquants Ice — la faiblesse assumée de l\'équipe (Gliscor ×4, Togekiss ×2).',
    },
    {
      kind: 'p',
      text: 'Son défaut structurel : **60 en Defense et 65 en SpD avec 110 HP**. Elle encaisse une attaque neutre, pas deux. C\'est un sweeper et un spinner, jamais un mur — ne l\'envoie pas pivoter.',
    },
  ],
  builds: [
    {
      id: 'a',
      name: 'Choice Band',
      tagline: 'l\'objet que §7.3 lui assigne',
      nature: 'Adamant',
      evs: { hp: 4, atk: 252, spe: 252 },
      item: 'Choice Band',
      moves: ['Earthquake', 'Iron Head', 'Rock Slide', 'Rapid Spin'],
      ability: 'Sand Rush',
      notes: [
        '⚠️ **Le Choice Band verrouille sur la capacité utilisée**, *Rapid Spin* compris. Le plan de jeu est donc : entrer, spinner une fois, et **changer** — pas rester. Si tu te retrouves régulièrement bloqué sur *Rapid Spin* face à une menace, c\'est le signe qu\'il faut passer au build B.',
        '*Pourquoi 252 en Speed malgré Sand Rush :* le sable ne dure que 5 tours (8 avec la **Smooth Rock** de Tyranitar) et peut être écrasé par la météo adverse. Les EV sont ce qui reste quand le talent ne s\'applique plus.',
        '*Earthquake* et *Iron Head* : les deux STAB · *Rock Slide* : la couverture Flying/Fire qui manque à *Earthquake* · *Rapid Spin* : la raison même de sa présence dans l\'équipe.',
        'Objet : 48 BP au Battle Tower.',
      ],
      recommended: true,
    },
    {
      id: 'b',
      name: 'Swords Dance',
      tagline: 'garde le spin, échange la puissance immédiate contre de la liberté',
      nature: 'Jolly',
      evs: { hp: 4, atk: 252, spe: 252 },
      item: 'Leftovers',
      moves: ['Swords Dance', 'Earthquake', 'Iron Head', 'Rapid Spin'],
      ability: 'Sand Rush',
      notes: [
        'Aucun verrouillage : elle peut spinner puis rester et se mettre en place, ce que le build A ne permet pas.',
        'Nature *Jolly* plutôt qu\'*Adamant* : sans l\'objet, la Speed hors sable devient le facteur limitant. *Swords Dance* compense la perte d\'Attack.',
        '⚠️ *Leftovers* est déjà revendiqué par Togekiss et Rotom-Wash (§7.3) — certains formats de la Frontier interdisent les objets en double. **Life Orb** est l\'alternative si le slot est pris.',
      ],
    },
  ],
  ivGuidance: {
    focus: ['atk', 'spe', 'hp'],
    ignore: ['spa'],
    note: '**Ne gaspille pas de cap sur la SpA** — aucun set ne l\'utilise, et une Sp. Atk basse ne coûte rien. Defense et SpD sont secondaires : elle n\'est pas là pour encaisser.',
  },
  tasks: [
    {
      id: 'mon-excadrill-1',
      label: 'Choisir le build (A ou B) — **ne saute pas cette étape**, la nature et l\'objet en dépendent',
      priority: 1,
      ref: '§7.3',
    },
    {
      id: 'mon-excadrill-2',
      label: 'Lire ses IV/EV actuels (PNJ Frontier)',
      requires: ['mon-excadrill-1'],
    },
    {
      id: 'mon-excadrill-3',
      label: 'Purger les EV parasites : tout sauf **Attack, Speed, HP** (5 BP/stat, ou baies au marché de **Fallshore City**)',
      requires: ['mon-excadrill-2'],
    },
    {
      id: 'mon-excadrill-4',
      label: '⚠️ **Vérifier son talent** : il doit être **Sand Rush**, pas *Sand Force*. Si c\'est *Sand Force* → **Ability Capsule** au Game Corner de Dehara. *Mold Breaker* étant le talent caché, une Capsule ne peut pas y mener — et de toute façon on n\'en veut pas',
      priority: 2,
      key: true,
    },
    {
      id: 'mon-excadrill-5',
      label: 'Nature → **Adamant** (build A) ou **Jolly** (build B), Tehl Town, 50 000 $',
      requires: ['mon-excadrill-1'],
    },
    {
      id: 'mon-excadrill-6',
      label: 'EV : Trainer House de Dresco, dresseur Attack (Power Bracer) + dresseur Speed (Power Anklet)',
      requires: ['mon-excadrill-3'],
    },
    {
      id: 'mon-excadrill-7',
      label: 'IV : Bottle Caps sur **Attack, Speed, HP** — **ignore la SpA**',
      requires: ['mon-excadrill-2'],
    },
    {
      id: 'mon-excadrill-8',
      label: 'Moveset : **Earthquake (TM)**, **Rock Slide (TM)** et **Swords Dance (TM)** ; **Rapid Spin** via le Move Relearner de **Crater Town** (Heart Scales) si oublié. ⚠️ **Iron Head n\'est pas un acquis de niveau** — il ne passe pas par le Move Relearner, uniquement par les **tuteurs de la Battle Frontier**',
      requires: ['mon-excadrill-1'],
    },
    {
      id: 'mon-excadrill-9',
      label: 'Objet : **Choice Band** (48 BP au Battle Tower) pour le build A, **Leftovers** ou **Life Orb** pour le build B',
      requires: ['mon-excadrill-1'],
    },
    {
      id: 'mon-excadrill-10',
      label: '**Note d\'équipe :** ses quatre faiblesses (Fighting, Fire, Water, Ground) sont toutes couvertes par **Slowbro** — c\'est ton switch par défaut. Dans l\'autre sens, elle et Slowbro sont tes deux seuls recours contre l\'Ice',
      ref: '§7.3',
      link: '/equipe/flagadoss',
    },
    {
      id: 'mon-excadrill-11',
      label: 'Vérifier que Tyranitar tient bien la **Smooth Rock** : elle fait passer le sable de 5 à 8 tours, ce qui double presque la fenêtre où *Sand Rush* s\'applique',
      requires: ['mon-excadrill-1'],
      link: '/equipe/tyranitar',
    },
  ],
} satisfies PokemonSheet
