import type { PokemonSheet } from '../types'

/** Sorti de l'équipe (§6.5, §7.3) */
export default {
  slug: 'zeraora',
  sprite: 'zeraora',
  // Gen 7 : aucun sprite pixel dans Noir/Blanc.
  spritePixelSet: 'sword-shield',
  name: 'Zeraora',
  status: 'retired',
  badge: 'Sorti de l’équipe',
  role: 'Cleaner / Pivot offensif — rentre immédiatement si tu abandonnes le plan sable',
  types: ['Electric'],
  baseStats: { hp: 88, atk: 112, def: 75, spa: 102, spd: 80, spe: 143 },
  bst: 600,
  abilities: [
    { name: 'Volt Absorb' },
    { name: 'Anticipation', hidden: true },
  ],
  targetAbility: 'Volt Absorb',
  obtention: 'Thundercap Mountain 4F (nécessite l’**ADM Gear**)',
  preamble: [
    {
      kind: 'quote',
      tone: 'info',
      text: '**Décision prise :** Zeraora sort, non pas parce qu’il est mauvais — il est excellent — mais parce qu’il **fait doublon avec Excadrill** (cleaner physique rapide) tout en étant **puni par ton propre sable**, alors qu’Excadrill y gagne 176 de Speed. Fiche conservée : si tu abandonnes un jour le plan sable, il rentre immédiatement.',
    },
  ],
  analysis: [
    {
      kind: 'p',
      text: 'Excellent choix, et il arrive au bon moment : **fraîchement capturé, ses EV sont vierges** — tu n’as rien à purger, ce qui fait de lui le Pokémon le moins cher à optimiser de ton équipe.',
    },
    {
      kind: 'p',
      text: '**143 de Speed de base**, c’est top-tier absolu : il dépasse presque tout le métagame. **Volt Absorb** lui donne une **immunité Electric avec soin**, ce qui en fait un switch-in gratuit sur les attaques électriques.',
    },
    {
      kind: 'p',
      text: '**Corrections par rapport à ton guide d’origine :**',
    },
    {
      kind: 'list',
      items: [
        '❌ **Zeraora n’apprend pas *Swords Dance* dans Unbound.** Son unique setup est **Bulk Up (TM08)** ou *Hone Claws*. Vu sa fragilité (75 Defense / 80 SpD), il n’a de toute façon pas le temps de se booster : **joue-le en attaquant direct**.',
        '⚠️ **Plasma Fists s’apprend au niveau 88** et **Close Combat au niveau 96**. Si tu l’as capturé à un niveau plus bas puis monté à 100 avec des Super Bonbons, il ne les connaît pas → **Move Relearner de Crater Town** contre des Heart Scales. C’est la première chose à faire.',
        '✅ **Knock Off** est bien disponible — via **tuteur**, pas par TM.',
        '✅ **Volt Switch** : TM92 **et** apprentissage naturel au niveau 32.',
        '⚠️ **Garde Volt Absorb.** *Anticipation* (le talent caché) est nettement moins bon. **N’achète pas de Dream Mist pour lui.**',
      ],
    },
  ],
  builds: [
    {
      id: 'cleaner',
      name: 'Cleaner / Pivot offensif',
      nature: 'Jolly',
      evs: { atk: 252, spe: 252, hp: 4 },
      item: 'Life Orb',
      ability: 'Volt Absorb',
      moves: ['Plasma Fists', 'Close Combat', 'Knock Off', 'Volt Switch'],
      notes: [
        'Objet : Game Corner, 7 500 jetons — moins cher que 48 BP.',
        '*Plasma Fists* : STAB principal, 100 de puissance · *Close Combat* : couverture Steel/Rock/Dark, indispensable · *Knock Off* : retire l’objet adverse, énorme valeur au Battle Tower contre les *Leftovers* et les Choice items · *Volt Switch* : conserve le momentum et ramène Togekiss en sécurité.',
        '**Variantes :** **Choice Band** (48 BP) au lieu du *Life Orb* — plus de dégâts immédiats, mais tu perds la flexibilité et *Volt Switch* devient ta seule sortie. **Fake Out** en slot 1 si tu le joues en lead. **Throat Chop** disponible en tuteur, alternative à *Knock Off* contre beaucoup de Psychic/Ghost.',
      ],
      recommended: true,
    },
  ],
  ivGuidance: {
    focus: ['atk', 'spe', 'hp'],
    ignore: ['spa'],
    note: '**Ignore la SpA** — mieux vaut la laisser basse. Zeraora est le seul membre non élevable et non DexNavvable : c’est lui qui doit consommer tes Bottle Caps en priorité (§2.1).',
  },
  tasks: [
    {
      id: 'mon-zeraora-1',
      label: '**Vérifier son moveset actuel.** S’il lui manque **Plasma Fists** ou **Close Combat** → **Move Relearner de Crater Town** (maison au sud du Pokémon Center), contre des Heart Scales',
      priority: 1,
      done: false,
    },
    {
      id: 'mon-zeraora-2',
      label: 'Lire ses IV (PNJ Seaport ou Frontier) — un légendaire fraîchement capturé a souvent 3 IV garantis à 31, vérifie avant de gaspiller des caps',
      requires: ['phase-0.0', 'phase-0.2'],
      done: false,
    },
    {
      id: 'mon-zeraora-3',
      label: '**Pas besoin de purger les EV** s’il est fraîchement capturé (à confirmer en le regardant)',
      done: false,
    },
    {
      id: 'mon-zeraora-4',
      label: 'Nature → **Jolly** (Tehl Town, 50 000 $)',
      requires: ['phase-1.1'],
      done: false,
    },
    {
      id: 'mon-zeraora-5',
      label: 'EV : Dresco, dresseur Attack (Power Bracer) + dresseur Speed (Power Anklet)',
      requires: ['phase-1.4'],
      done: false,
    },
    {
      id: 'mon-zeraora-6',
      label: 'IV : Bottle Caps sur **Attack, Speed, HP** — **ignore la SpA** (mieux vaut la laisser basse)',
      requires: ['mon-zeraora-2', 'phase-2.4'],
      done: false,
    },
    {
      id: 'mon-zeraora-7',
      label: 'Talent : **vérifier que c’est Volt Absorb**, pas *Anticipation*. Si c’est *Anticipation*, il faudra un autre exemplaire — pas d’Ability Capsule possible entre talent standard et talent caché',
      done: false,
    },
    {
      id: 'mon-zeraora-8',
      label: 'Apprendre **Knock Off** chez le tuteur (Battle Frontier)',
      requires: ['phase-0.1'],
      done: false,
    },
    {
      id: 'mon-zeraora-9',
      label: 'Apprendre **Volt Switch** (TM92) si absent',
      done: false,
    },
    {
      id: 'mon-zeraora-10',
      label: 'Objet : **Life Orb** au Game Corner (7 500 jetons) ou *Choice Band* (48 BP)',
      done: false,
    },
    {
      id: 'mon-zeraora-11',
      label: '**Note d’équipe :** Zeraora est ×2 faible au Ground, comme Tyranitar. Togekiss (type Flying) est ton switch gratuit sur *Earthquake* — construis tes rotations autour de ça',
      done: false,
    },
  ],
} satisfies PokemonSheet
