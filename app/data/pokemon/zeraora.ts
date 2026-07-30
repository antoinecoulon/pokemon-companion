import type { PokemonSheet } from '../types'

/** Sorti de l'équipe (§6.5, §7.3) */
export default {
  slug: 'zeraora',
  nameEn: 'Zeraora',
  sprite: 'zeraora',
  // Gen 7 : aucun sprite pixel dans Noir/Blanc.
  spritePixelSet: 'sword-shield',
  name: 'Zeraora',
  status: 'retired',
  badge: 'Sorti de l’équipe',
  role: 'Cleaner / Pivot offensif — rentre immédiatement si tu abandonnes le plan sable',
  types: ['Électrik'],
  baseStats: { hp: 88, atk: 112, def: 75, spa: 102, spd: 80, spe: 143 },
  bst: 600,
  abilities: [
    { name: 'Absorbe-Volt (Volt Absorb)' },
    { name: 'Prescience (Anticipation)', hidden: true },
  ],
  targetAbility: 'Absorbe-Volt (Volt Absorb)',
  obtention: 'Thundercap Mountain 4F (nécessite l’**ADM Gear**)',
  preamble: [
    {
      kind: 'quote',
      tone: 'info',
      text: '**Décision prise :** Zeraora sort, non pas parce qu’il est mauvais — il est excellent — mais parce qu’il **fait doublon avec Excadrill** (cleaner physique rapide) tout en étant **puni par ton propre sable**, alors qu’Excadrill y gagne 176 de Vitesse. Fiche conservée : si tu abandonnes un jour le plan sable, il rentre immédiatement.',
    },
  ],
  analysis: [
    {
      kind: 'p',
      text: 'Excellent choix, et il arrive au bon moment : **fraîchement capturé, ses EV sont vierges** — tu n’as rien à purger, ce qui fait de lui le Pokémon le moins cher à optimiser de ton équipe.',
    },
    {
      kind: 'p',
      text: '**143 de Vitesse de base**, c’est top-tier absolu : il dépasse presque tout le métagame. **Absorbe-Volt** lui donne une **immunité Électrik avec soin**, ce qui en fait un switch-in gratuit sur les attaques électriques.',
    },
    {
      kind: 'p',
      text: '**Corrections par rapport à ton guide d’origine :**',
    },
    {
      kind: 'list',
      items: [
        '❌ **Zeraora n’apprend pas Danse Lames dans Unbound.** Son unique setup est **Gonflette / Bulk Up (CT08)** ou *Aiguisage / Hone Claws*. Vu sa fragilité (75 Déf / 80 Déf.Spé), il n’a de toute façon pas le temps de se booster : **joue-le en attaquant direct**.',
        '⚠️ **Plasma Punch (Plasma Fists) s’apprend au niveau 88** et **Close Combat au niveau 96**. Si tu l’as capturé à un niveau plus bas puis monté à 100 avec des Super Bonbons, il ne les connaît pas → **Move Relearner de Crater Town** contre des Écailles Cœur. C’est la première chose à faire.',
        '✅ **Sabotage (Knock Off)** est bien disponible — via **tuteur**, pas par CT.',
        '✅ **Change Éclair (Volt Switch)** : CT92 **et** apprentissage naturel au niveau 32.',
        '⚠️ **Garde Absorbe-Volt.** Prescience (le talent caché) est nettement moins bon. **N’achète pas de Dream Mist pour lui.**',
      ],
    },
  ],
  builds: [
    {
      id: 'cleaner',
      name: 'Cleaner / Pivot offensif',
      nature: 'Jovial (Jolly)',
      natureFr: 'Jovial',
      evs: { atk: 252, spe: 252, hp: 4 },
      item: 'Orbe Vie',
      ability: 'Absorbe-Volt (Volt Absorb)',
      moves: ['Plasma Punch', 'Close Combat', 'Sabotage', 'Change Éclair'],
      notes: [
        'Objet : Game Corner, 7 500 jetons — moins cher que 48 BP.',
        '*Plasma Punch* : STAB principal, 100 de puissance · *Close Combat* : couverture Acier/Roche/Ténèbres, indispensable · *Sabotage* : retire l’objet adverse, énorme valeur au Battle Tower contre les Restes et les objets Choix · *Change Éclair* : conserve le momentum et ramène Togekiss en sécurité.',
        '**Variantes :** **Bandeau Choix** (48 BP) au lieu d’Orbe Vie — plus de dégâts immédiats, mais tu perds la flexibilité et Change Éclair devient ta seule sortie. **Vive-Attaque (Fake Out)** en slot 1 si tu le joues en lead. **Étrangleur (Throat Chop)** disponible en tuteur, alternative à Sabotage contre beaucoup de Psy/Spectre.',
      ],
      recommended: true,
    },
  ],
  ivGuidance: {
    focus: ['atk', 'spe', 'hp'],
    ignore: ['spa'],
    note: '**Ignore l’Att. Spé.** — mieux vaut la laisser basse. Zeraora est le seul membre non élevable et non DexNavvable : c’est lui qui doit consommer tes Bottle Caps en priorité (§2.1).',
  },
  tasks: [
    {
      id: 'mon-zeraora-1',
      label: '**Vérifier son moveset actuel.** S’il lui manque **Plasma Punch** ou **Close Combat** → **Move Relearner de Crater Town** (maison au sud du Centre Pokémon), contre des Écailles Cœur',
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
      label: 'Nature → **Jovial (Jolly)** (Tehl Town, 50 000 $)',
      requires: ['phase-1.1'],
      done: false,
    },
    {
      id: 'mon-zeraora-5',
      label: 'EV : Dresco, dresseur Attaque (Brassard Pouvoir) + dresseur Vitesse (Anneau Pouvoir)',
      requires: ['phase-1.4'],
      done: false,
    },
    {
      id: 'mon-zeraora-6',
      label: 'IV : Bottle Caps sur **Attaque, Vitesse, PV** — **ignore l’Att. Spé.** (mieux vaut la laisser basse)',
      requires: ['mon-zeraora-2', 'phase-2.4'],
      done: false,
    },
    {
      id: 'mon-zeraora-7',
      label: 'Talent : **vérifier que c’est Absorbe-Volt**, pas Prescience. Si c’est Prescience, il faudra un autre exemplaire — pas d’Ability Capsule possible entre talent standard et talent caché',
      done: false,
    },
    {
      id: 'mon-zeraora-8',
      label: 'Apprendre **Sabotage** chez le tuteur (Battle Frontier)',
      requires: ['phase-0.1'],
      done: false,
    },
    {
      id: 'mon-zeraora-9',
      label: 'Apprendre **Change Éclair** (CT92) si absent',
      done: false,
    },
    {
      id: 'mon-zeraora-10',
      label: 'Objet : **Orbe Vie** au Game Corner (7 500 jetons) ou Bandeau Choix (48 BP)',
      done: false,
    },
    {
      id: 'mon-zeraora-11',
      label: '**Note d’équipe :** Zeraora est ×2 faible au Sol, comme Tyranitar. Togekiss (type Vol) est ton switch gratuit sur Séisme — construis tes rotations autour de ça',
      done: false,
    },
  ],
} satisfies PokemonSheet
