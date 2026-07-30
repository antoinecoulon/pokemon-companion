import type { PokemonSheet } from '../types'

/** Sortis de l'équipe (§6.4, §6.5, §7.3) */
export default {
  slug: 'dusknoir',
  nameEn: 'Dusknoir',
  sprite: 'dusknoir',
  name: 'Dusknoir',
  status: 'retired',
  badge: 'Sorti de l’équipe',
  role: 'Recyclé en mule à objets (§6.7-B)',
  types: ['Spectre'],
  baseStats: { hp: 45, atk: 100, def: 135, spa: 65, spd: 135, spe: 45 },
  bst: 525,
  abilities: [
    { name: 'Pression (Pressure)' },
    { name: 'Fouille (Frisk)', hidden: true },
  ],
  preamble: [
    {
      kind: 'quote',
      tone: 'info',
      text: '**Décision prise :** Dusknoir quitte l’équipe de combat. Fiche conservée pour référence — et parce qu’il a une seconde vie comme **mule à objets** grâce à son talent caché Fouille (§6.7-B).',
    },
  ],
  analysis: [
    {
      kind: 'p',
      text: 'Je vais être direct : **Dusknoir est le Pokémon le plus surestimé de ton équipe.**',
    },
    {
      kind: 'p',
      text: '135 en Défense et 135 en Déf. Spé., c’est excellent sur le papier. **45 en PV, c’est catastrophique.** La survivabilité réelle se calcule `PV × Défense`, et 45 PV divise sa résistance effective par presque deux par rapport à un tank normal. Même avec 252 EV en PV, il plafonne à ~324 PV au niveau 100 — moins qu’un Togekiss non investi.',
    },
    {
      kind: 'p',
      text: 'Ajoute à ça :',
    },
    {
      kind: 'list',
      items: [
        '**Aucun soin fiable** — seulement Balance (Pain Split), qui est aléatoire et dépend des PV adverses',
        '**Aucun retrait de hazards**',
        '**Vitesse 45** — il agit toujours en dernier',
        'Il **prend les dégâts de sable** de ton propre Tyranitar',
      ],
    },
    {
      kind: 'p',
      text: '**Ses deux vraies utilités :**',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Spinblocker** — étant Spectre, il bloque Tour Rapide (mais pas Anti-Brume). Utile seulement si toi tu poses des hazards.',
        '**Support Feu Follet** — brûler un attaquant physique adverse divise ses dégâts par deux. Ça, c’est réellement précieux au Battle Tower.',
      ],
    },
    {
      kind: 'p',
      text: '**Trois options honnêtes :**',
    },
    {
      kind: 'list',
      items: [
        '**Option 1 — Le garder en support minimal.** Investissement réduit : nature + EV, pas de Bottle Caps. Il fait son job de Feu Follet et de blocage.',
        '**Option 2 — Le remplacer.** **Corviknight** (Anti-Brume, résistance Acier, soin fiable) ou **Toxapex** couvrent bien mieux le rôle de mur. C’est ce que je ferais.',
        '**Option 3 — Pivoter vers une équipe Distorsion (Trick Room).** Sa Vitesse 45 devient un **atout** : sous Distorsion, il agit en premier, et Tyranitar (61) aussi. C’est une réorientation complète de l’équipe, mais c’est cohérent et surprenant.',
      ],
    },
  ],
  builds: [
    {
      id: 'support-minimal',
      name: 'Support minimal (Option 1)',
      nature: 'Malin (Impish)',
      natureFr: 'Malin',
      evs: { hp: 252, def: 252, spd: 4 },
      item: 'Restes',
      moves: ['Feu Follet', 'Ombre Portée', 'Balance', 'Poing Glace'],
      notes: [
        'Objet : Game Corner, 5 000 jetons — ne dépense pas 48 BP pour lui.',
        '*Ombre Portée* : priorité +1, permet d’achever malgré sa lenteur.',
        '*Poing Glace* ou *Séisme* pour la couverture.',
      ],
    },
  ],
  tasks: [
    {
      id: 'mon-dusknoir-1',
      label: '**Trancher entre Option 1, 2 ou 3 avant de dépenser quoi que ce soit**',
      priority: 1,
      done: false,
    },
    {
      id: 'mon-dusknoir-2',
      label: 'Si Option 2 (remplacement) → arrête ici, passe à la Phase 4',
      requires: ['mon-dusknoir-1'],
      link: '/roadmap',
      done: false,
    },
    {
      id: 'mon-dusknoir-3',
      label: 'Si Option 1 : purger les EV (5 BP/stat)',
      requires: ['mon-dusknoir-1'],
      done: false,
    },
    {
      id: 'mon-dusknoir-4',
      label: 'Nature → **Malin (Impish)** (Tehl Town)',
      requires: ['mon-dusknoir-1', 'phase-1.1'],
      done: false,
    },
    {
      id: 'mon-dusknoir-5',
      label: 'EV : Dresco, dresseur PV + dresseur Défense (Ceinture Pouvoir)',
      requires: ['mon-dusknoir-3'],
      done: false,
    },
    {
      id: 'mon-dusknoir-6',
      label: 'IV : **investissement minimal** — Bottle Caps sur **PV et Défense** uniquement. Ne dépense pas 6 caps sur un Pokémon de rôle secondaire',
      requires: ['phase-2.4'],
      done: false,
    },
    {
      id: 'mon-dusknoir-7',
      label: 'Talent : **garder Pression** (fait perdre 2 PP par attaque adverse — utile en combat d’usure). Fouille n’a d’intérêt que pour le farm d’Écailles Cœur',
      done: false,
    },
    {
      id: 'mon-dusknoir-8',
      label: 'Moveset : Feu Follet (CT), Ombre Portée / Balance / Poing Glace via Move Relearner ou tuteur',
      done: false,
    },
    {
      id: 'mon-dusknoir-9',
      label: 'Objet : **Restes** au Game Corner (5 000 jetons) plutôt qu’au Battle Tower (48 BP)',
      done: false,
    },
  ],
} satisfies PokemonSheet
