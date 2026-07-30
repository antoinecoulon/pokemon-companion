import type { PokemonSheet } from '../types'

/** Slot 1 — Tyranitar (§6.1) */
export default {
  slug: 'tyranitar',
  nameEn: 'Tyranitar',
  sprite: 'tyranitar',
  name: 'Tyranitar',
  slot: 1,
  status: 'active',
  badge: 'Conservé',
  role: 'Poseur de sable / Wallbreaker physique',
  types: ['Roche', 'Ténèbres'],
  baseStats: { hp: 100, atk: 134, def: 110, spa: 95, spd: 100, spe: 61 },
  bst: 600,
  abilities: [
    { name: 'Sable Volant (Sand Stream)' },
    { name: 'Anti-Gourmandise (Unnerve)' },
  ],
  targetAbility: 'Sable Volant (Sand Stream)',
  mega: {
    stone: 'Tyranitarite',
    stats: { hp: 100, atk: 164, def: 150, spa: 95, spd: 120, spe: 71 },
    bst: 700,
    note: 'Garde Sable Volant. Trouvée au Shadow Base 1F si Embrylex était ton starter, sinon récompense de la mission **#050 « Portal Purge »**.',
  },
  analysis: [
    {
      kind: 'p',
      text: 'C’est ta meilleure pièce brute. Sable Volant lui donne **+50 % de Déf. Spé. sous la tempête de sable**, ce qui en fait un tank spécial gratuit en plus d’un wallbreaker.',
    },
    {
      kind: 'p',
      text: '**MAIS** — et c’est le point que ton guide d’origine a raté : **le sable inflige des dégâts à 4 de tes 5 Pokémon actuels** (Sceptile, Dusknoir, Togekiss, Zeraora — seul Tyranitar y est immunisé). Sur un run de Battle Tower, tu t’infliges 6,25 % par tour à ton équipe entière. Ce n’est pas rédhibitoire, mais ça veut dire une chose :',
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: '**Soit tu construis autour du sable** (ajoute Excadrill / Gigalithe / un Acier), **soit tu joues Tyranitar comme un simple wallbreaker et tu acceptes le chip damage.** L’entre-deux est le pire choix.',
    },
    {
      kind: 'p',
      text: 'Sa **Vitesse 61** est le second point clé : investir 252 EV en Vitesse ne le fait dépasser presque personne. Une nature Jovial est un gâchis **sauf** si tu joues Danse Draco.',
    },
  ],
  builds: [
    {
      id: 'a',
      name: 'Wallbreaker Bandeau Choix',
      tagline: 'le plus simple, le plus fiable',
      nature: 'Rigide (Adamant)',
      natureFr: 'Rigide',
      evs: { hp: 252, atk: 252, spd: 4 },
      item: 'Bandeau Choix',
      moves: ['Lame de Roc', 'Mâchouille', 'Séisme', 'Poing Glace'],
      notes: [
        'Objet : 48 BP au Battle Tower.',
        '*Pourquoi 252 PV et pas 252 Vit :* à 61 de base il ne dépassera rien d’utile ; la masse de PV + le boost Déf.Spé du sable en font un mur offensif.',
      ],
      recommended: true,
    },
    {
      id: 'b',
      name: 'Sweeper Danse Draco',
      tagline: 'plafond plus haut, plus risqué',
      nature: 'Rigide (Adamant)',
      natureFr: 'Rigide',
      evs: { atk: 252, spe: 252, hp: 4 },
      item: 'Ceinture Force (Focus Sash)',
      moves: ['Danse Draco', 'Lame de Roc', 'Mâchouille', 'Séisme'],
      notes: [
        'Nature Jovial seulement si tu veux dépasser des cibles précises.',
        'Objet : Ceinture Force (32 BP) ou **Orbe Vie**.',
      ],
    },
    {
      id: 'c',
      name: 'Méga-Tyranitar',
      tagline: 'le plus fort, mais consomme ton slot Méga',
      nature: 'Rigide (Adamant)',
      natureFr: 'Rigide',
      evs: { hp: 252, atk: 252, spd: 4 },
      item: 'Tyranitarite',
      moves: ['Danse Draco', 'Lame de Roc', 'Mâchouille', 'Séisme'],
      notes: [
        '**Tyranitarite** : trouvée au Shadow Base 1F si Embrylex était ton starter, sinon récompense de la mission **#050 « Portal Purge »**.',
      ],
    },
  ],
  ivGuidance: {
    focus: ['atk', 'hp', 'def', 'spd'],
    ignore: ['spa'],
    note: 'Vitesse uniquement pour le build B/C. **Ne gaspille pas de cap sur l’Att. Spé.** — il ne l’utilise jamais.',
  },
  tasks: [
    {
      id: 'mon-tyranitar-1',
      label: 'Choisir le build (A, B ou C) — **ne saute pas cette étape**, tout le reste en dépend',
      priority: 1,
      done: true,
    },
    {
      id: 'mon-tyranitar-2',
      label: 'Lire ses IV/EV actuels (PNJ Frontier)',
      requires: ['mon-tyranitar-1', 'phase-0.0'],
      done: true,
    },
    {
      id: 'mon-tyranitar-3',
      label: 'Purger les EV parasites : toutes les stats sauf celles du build choisi (5 BP/stat)',
      requires: ['mon-tyranitar-2'],
      done: true,
    },
    {
      id: 'mon-tyranitar-4',
      label: 'Changer la nature en **Rigide** (Tehl Town, 50 000 $)',
      requires: ['mon-tyranitar-1', 'phase-1.1'],
      done: true,
    },
    {
      id: 'mon-tyranitar-5',
      label: 'Vérifier son talent : il doit être **Sable Volant**, pas Anti-Gourmandise. Si c’est Anti-Gourmandise → **Ability Capsule** (Game Corner de Dehara)',
      done: true,
    },
    {
      id: 'mon-tyranitar-6',
      label: 'EV : Trainer House de Dresco, dresseur PV + dresseur Attaque, avec Poids Pouvoir puis Brassard Pouvoir',
      requires: ['mon-tyranitar-3', 'phase-1.4'],
      done: true,
    },
    {
      id: 'mon-tyranitar-7',
      label: 'IV : Bottle Caps sur **Attaque, PV, Défense, Déf. Spé.** — **ne gaspille pas de cap sur l’Att. Spé.** (il ne l’utilise jamais). Vitesse uniquement pour le build B/C',
      requires: ['mon-tyranitar-2', 'phase-2.4'],
      done: true,
    },
    {
      id: 'mon-tyranitar-8',
      label: 'Moveset : CT Séisme / Lame de Roc ; **Mâchouille** et **Danse Draco** via le Move Relearner de **Crater Town** (Écailles Cœur) si oubliés ; Poing Glace via tuteur',
      requires: ['mon-tyranitar-1'],
      done: true,
    },
    {
      id: 'mon-tyranitar-9',
      label: 'Objet : Bandeau Choix (48 BP) / Tyranitarite / Roche Lisse — la **Roche Lisse (Smooth Rock)** rallonge le sable à 8 tours (Great Desert, au nord de Cameron, ou minage ADM)',
      requires: ['mon-tyranitar-1'],
      done: true,
    },
    {
      id: 'mon-tyranitar-10',
      label: 'Décider s’il porte le **Piège de Roc** (recommandé : oui, dans le build B ou C)',
      requires: ['mon-tyranitar-1'],
      done: true,
    },
  ],
} satisfies PokemonSheet
