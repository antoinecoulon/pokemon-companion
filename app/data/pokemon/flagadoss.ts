import type { PokemonSheet } from '../types'

/** Slot 5 — Flagadoss (§6.2) */
export default {
  slug: 'flagadoss',
  name: 'Slowbro',
  sprite: 'slowbro',
  slot: 5,
  status: 'active',
  badge: 'Nouveau',
  role: 'Mur physique régénérant, résiste Combat (spécial)',
  types: ['Water', 'Psychic'],
  baseStats: { hp: 95, atk: 75, def: 110, spa: 100, spd: 80, spe: 30 },
  bst: 490,
  abilities: [
    { name: 'Oblivious' },
    { name: 'Own Tempo' },
    { name: 'Regenerator', hidden: true },
  ],
  targetAbility: 'Regenerator',
  obtention: 'Évolution de **Slowpoke au niveau 37**, ou **Repaire de Raid de la Route 14 (4-5★)**. Remplace Sceptile.',
  preamble: [
    {
      kind: 'p',
      text: '**1. Slowking n’est PAS l’évolution de Slowbro.** Les deux sont des évolutions **parallèles** de Slowpoke :',
    },
    {
      kind: 'table',
      head: ['', 'Obtention', 'HP', 'Def', 'SpA', '**SpD**'],
      rows: [
        ['**Slowbro**', 'Niveau 37', '95', '**110**', '100', '80'],
        ['**Slowking**', '**Échange** (King’s Rock)', '95', '80', '100', '**110**'],
      ],
    },
    {
      kind: 'p',
      text: 'Même BST, Defense et SpD simplement inversées.',
    },
    {
      kind: 'p',
      text: '**Prends Slowbro**, pour deux raisons :',
    },
    {
      kind: 'list',
      items: [
        'Le trou que tu bouches, c’est le **Fighting**, et les attaques Fighting qui font mal (*Close Combat*, *Hammer Arm*, *Drain Punch*) sont **physiques**. C’est la Defense qui compte, pas la SpD.',
        'Slowbro évolue **au niveau 37**, sans échange. Slowking demande un échange — toujours pénible en solo sur une ROM hack.',
      ],
    },
    {
      kind: 'quote',
      tone: 'info',
      text: 'Bascule sur Slowking uniquement si, après quelques runs de Battle Tower, tu constates que tu meurs surtout à des attaques spéciales.',
    },
    {
      kind: 'p',
      text: '**2. Non, tu ne peux pas cumuler Slowbronite et Tyranitarite.** Bien vu — **une seule Mega Evolution par combat**, et Mega Tyranitar est ton choix. La Slowbronite reste donc au fond du sac.',
    },
  ],
  analysis: [
    {
      kind: 'p',
      text: 'Slowbro est le **seul membre de l’équipe qui résiste au Fighting**, et c’est pour ça qu’il entre. Rappel du problème : Mega Tyranitar prend ×4, Excadrill ×2, et personne ne pouvait switcher dedans.',
    },
    {
      kind: 'p',
      text: 'Son profil défensif couvre presque exactement la liste des peurs de ton duo sable :',
    },
    {
      kind: 'table',
      head: ['Il résiste à…', 'Qui en avait besoin'],
      rows: [
        ['**Fighting**', 'Mega Tyranitar (×4), Excadrill (×2)'],
        ['**Water**', 'Tyranitar (×2), Excadrill (×2), Gliscor (×2)'],
        ['**Fire**', 'Excadrill (×2)'],
        ['**Ice**', 'Gliscor (×4)'],
        ['**Steel**', 'Tyranitar (×2), Togekiss (×2)'],
        ['**Psychic**', '— (bonus)'],
      ],
    },
    {
      kind: 'p',
      text: '**Regenerator est le cœur du set** : 1/3 des HP max récupérés à chaque changement. Combiné à *Slack Off*, tu obtiens un mur qui ne meurt quasiment jamais d’usure. C’est aussi ce qui compense le chip du sable : Slowbro le régénère en sortant.',
    },
    {
      kind: 'p',
      text: '**Ses défauts, sans détour :**',
    },
    {
      kind: 'list',
      items: [
        '**Speed 30.** Il joue toujours en dernier. Ce n’est pas un problème pour un mur, mais ne compte jamais sur lui pour achever.',
        '**SpD 80** — c’est son vrai point faible. Un attaquant spécial Dark ou Ghost le déchire.',
        'Faiblesses : **Electric, Grass, Bug, Ghost, Dark**. Le Dark est gênant car Tyranitar y est aussi faible… mais Togekiss (Fairy) résiste et Excadrill (Steel) aussi.',
        '**Il prend le chip du sable.** *Regenerator* l’absorbe, mais ça reste un coût.',
      ],
    },
  ],
  builds: [
    {
      id: 'mur-physique',
      name: 'Mur physique / Pivot régénérant',
      nature: 'Bold',
      evs: { hp: 252, def: 252, spd: 4 },
      item: 'Rocky Helmet',
      ability: 'Regenerator',
      moves: ['Scald', 'Slack Off', 'Toxic', 'Psyshock'],
      notes: [
        'Talent **caché**, donc **Dream Mist ou Dream Ball obligatoire**.',
        'Objet : **Leftovers** (Game Corner, 5 000 jetons) ou **Rocky Helmet** (48 BP) contre les attaquants physiques.',
        '*Scald* : 30 % de brûlure — sur un mur physique, c’est une seconde couche de défense.',
        '*Slack Off* : soin fiable à 50 %, à empiler avec *Regenerator*.',
        '*Toxic* ou *Thunder Wave* : de quoi ne pas être passif face aux setup sweepers.',
        '*Psyshock* : STAB qui frappe la **Defense** adverse — utile contre les murs spéciaux qui te bloqueraient sinon.',
      ],
      recommended: true,
    },
    {
      id: 'plenitude',
      name: 'Variante Calm Mind',
      tagline: 'gagner des combats plutôt que les tenir',
      nature: 'Calm',
      evs: { hp: 252, spd: 252 },
      item: 'Leftovers',
      moves: ['Calm Mind', 'Scald', 'Psyshock', 'Slack Off'],
      notes: ['Plus lent à mettre en place, mais il devient une menace réelle en fin de partie.'],
    },
  ],
  ivGuidance: {
    focus: ['hp', 'def', 'spd'],
    ignore: ['atk', 'spe'],
    note: '**Ignore l’Attack et la Speed** — une Attack basse réduit les dégâts de *Foul Play*, et la Speed ne lui sert à rien.',
  },
  tasks: [
    {
      id: 'mon-flagadoss-1',
      label: '**Obtenir un Slowpoke ou un Slowbro.** Le plus propre : **DexNav un Slowpoke** jusqu’à en trouver un **3★** (3 IV déjà à 31) — ça t’économise 3 Bottle Caps. Alternative : Repaire de Raid de la **Route 14 (4-5★)** pour un Slowbro direct.',
      priority: 1,
      requires: ['phase-1.2'],
      done: true,
    },
    {
      id: 'mon-flagadoss-2',
      label: '**Obtenir Regenerator.** C’est le talent **caché**, donc deux chemins :',
      details: [
        '**Dream Ball** (3/jour, Dream Research Lab de Tarmigan Town) → capture un Slowpoke directement avec *Regenerator*. **C’est la meilleure option** : gratuite et répétable.',
        '**Dream Mist** (raid Musharna 5/6★ à Tarmigan Town) sur un exemplaire déjà en ta possession.',
        '⚠️ **Une Ability Capsule ne suffit PAS** ici — elle ne fait qu’alterner *Oblivious* ↔︎ *Own Tempo*.',
      ],
      key: true,
      priority: 2,
      done: true,
    },
    {
      id: 'mon-flagadoss-3',
      label: 'Faire évoluer au **niveau 37** (Trainer House de Dresco + Lucky Egg amélioré = quelques minutes)',
      requires: ['mon-flagadoss-1'],
      done: true,
    },
    {
      id: 'mon-flagadoss-4',
      label: 'Monter au niveau 100 (même méthode)',
      requires: ['mon-flagadoss-3'],
      done: false,
    },
    {
      id: 'mon-flagadoss-5',
      label: 'Purger les EV parasites — baies au marché de **Fallshore City**',
      requires: ['phase-2.2'],
      done: true,
    },
    {
      id: 'mon-flagadoss-6',
      label: 'Nature → **Bold** (Tehl Town, 50 000 $)',
      requires: ['phase-1.1'],
      done: true,
    },
    {
      id: 'mon-flagadoss-7',
      label: 'EV : Dresco, dresseur HP (Power Weight) puis dresseur Defense (Power Belt), avec Macho Brace amélioré si tu ne fais qu’une stat à la fois',
      requires: ['mon-flagadoss-5', 'phase-1.4'],
      done: true,
    },
    {
      id: 'mon-flagadoss-8',
      label: 'IV : Bottle Caps sur **HP et Defense** en priorité, puis SpD. **Ignore l’Attack et la Speed** — une Attack basse réduit les dégâts de *Foul Play*, et la Speed ne lui sert à rien',
      requires: ['phase-2.4'],
      done: true,
    },
    {
      id: 'mon-flagadoss-9',
      label: 'Moveset : **Scald (TM)**, **Slack Off** et **Psyshock** via le Move Relearner de **Crater Town** (Heart Scales) ou les tuteurs de la Battle Frontier',
      done: true,
    },
    {
      id: 'mon-flagadoss-10',
      label: 'Objet : **Leftovers** au Game Corner (5 000 jetons). ⚠️ Vérifie que Togekiss ou Rotom-Wash ne le porte pas déjà — certains formats de la Frontier interdisent les objets en double',
      requires: ['phase-2.6'],
      done: false,
    },
    {
      id: 'mon-flagadoss-11',
      label: '**Ne pas lui donner la Slowbronite** — le slot Mega est pris par Tyranitar',
      done: true,
    },
  ],
} satisfies PokemonSheet
