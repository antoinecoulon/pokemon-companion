import type { PokemonSheet } from '../types'

/** Slot 5 — Flagadoss (§6.2) */
export default {
  slug: 'flagadoss',
  name: 'Flagadoss',
  nameEn: 'Slowbro',
  sprite: 'slowbro',
  slot: 5,
  status: 'active',
  badge: 'Nouveau',
  role: 'Mur physique régénérant, résiste Combat (spécial)',
  types: ['Eau', 'Psy'],
  baseStats: { hp: 95, atk: 75, def: 110, spa: 100, spd: 80, spe: 30 },
  bst: 490,
  abilities: [
    { name: 'Benêt (Oblivious)' },
    { name: 'Tempo Perso (Own Tempo)' },
    { name: 'Régé-Force (Regenerator)', hidden: true },
  ],
  targetAbility: 'Régé-Force (Regenerator)',
  obtention: 'Évolution de **Ramoloss au niveau 37**, ou **Repaire de Raid de la Route 14 (4-5★)**. Remplace Sceptile.',
  preamble: [
    {
      kind: 'p',
      text: '**1. Roigada (Slowking) n’est PAS l’évolution de Flagadoss.** Les deux sont des évolutions **parallèles** de Ramoloss :',
    },
    {
      kind: 'table',
      head: ['', 'Obtention', 'PV', 'Déf', 'Att.Spé', '**Déf.Spé**'],
      rows: [
        ['**Flagadoss**', 'Niveau 37', '95', '**110**', '100', '80'],
        ['**Roigada**', '**Échange** (Écaille Royale)', '95', '80', '100', '**110**'],
      ],
    },
    {
      kind: 'p',
      text: 'Même BST, Défense et Déf.Spé simplement inversées.',
    },
    {
      kind: 'p',
      text: '**Prends Flagadoss**, pour deux raisons :',
    },
    {
      kind: 'list',
      items: [
        'Le trou que tu bouches, c’est le **Combat**, et les attaques Combat qui font mal (Close Combat, Force Poing, Poing Boost) sont **physiques**. C’est la Défense qui compte, pas la Déf.Spé.',
        'Flagadoss évolue **au niveau 37**, sans échange. Roigada demande un échange — toujours pénible en solo sur une ROM hack.',
      ],
    },
    {
      kind: 'quote',
      tone: 'info',
      text: 'Bascule sur Roigada uniquement si, après quelques runs de Battle Tower, tu constates que tu meurs surtout à des attaques spéciales.',
    },
    {
      kind: 'p',
      text: '**2. Non, tu ne peux pas cumuler Slowbronite et Tyranitarite.** Bien vu — **une seule Méga-Évolution par combat**, et Méga-Tyranitar est ton choix. La Slowbronite reste donc au fond du sac.',
    },
  ],
  analysis: [
    {
      kind: 'p',
      text: 'Flagadoss est le **seul membre de l’équipe qui résiste au Combat**, et c’est pour ça qu’il entre. Rappel du problème : Méga-Tyranitar prend ×4, Excadrill ×2, et personne ne pouvait switcher dedans.',
    },
    {
      kind: 'p',
      text: 'Son profil défensif couvre presque exactement la liste des peurs de ton duo sable :',
    },
    {
      kind: 'table',
      head: ['Il résiste à…', 'Qui en avait besoin'],
      rows: [
        ['**Combat**', 'Méga-Tyranitar (×4), Excadrill (×2)'],
        ['**Eau**', 'Tyranitar (×2), Excadrill (×2), Scorvol (×2)'],
        ['**Feu**', 'Excadrill (×2)'],
        ['**Glace**', 'Scorvol (×4)'],
        ['**Acier**', 'Tyranitar (×2), Togekiss (×2)'],
        ['**Psy**', '— (bonus)'],
      ],
    },
    {
      kind: 'p',
      text: '**Régé-Force est le cœur du set** : 1/3 des PV max récupérés à chaque changement. Combiné à Grosse Flemme (Slack Off), tu obtiens un mur qui ne meurt quasiment jamais d’usure. C’est aussi ce qui compense le chip du sable : Flagadoss le régénère en sortant.',
    },
    {
      kind: 'p',
      text: '**Ses défauts, sans détour :**',
    },
    {
      kind: 'list',
      items: [
        '**Vitesse 30.** Il joue toujours en dernier. Ce n’est pas un problème pour un mur, mais ne compte jamais sur lui pour achever.',
        '**Déf.Spé 80** — c’est son vrai point faible. Un attaquant spécial Ténèbres ou Spectre le déchire.',
        'Faiblesses : **Électrik, Plante, Insecte, Spectre, Ténèbres**. Le Ténèbres est gênant car Tyranitar y est aussi faible… mais Togekiss (Fée) résiste et Excadrill (Acier) aussi.',
        '**Il prend le chip du sable.** Régé-Force l’absorbe, mais ça reste un coût.',
      ],
    },
  ],
  builds: [
    {
      id: 'mur-physique',
      name: 'Mur physique / Pivot régénérant',
      nature: 'Assuré (Bold)',
      natureFr: 'Assuré',
      evs: { hp: 252, def: 252, spd: 4 },
      item: 'Casque Brut',
      ability: 'Régé-Force (Regenerator)',
      moves: ['Ébullition', 'Grosse Flemme', 'Danse Ténèbre', 'Vibra-Soin'],
      notes: [
        'Talent **caché**, donc **Dream Mist ou Dream Ball obligatoire**.',
        'Objet : **Restes** (Game Corner, 5 000 jetons) ou **Casque Brut** (48 BP) contre les attaquants physiques.',
        '*Ébullition (Scald)* : 30 % de brûlure — sur un mur physique, c’est une seconde couche de défense.',
        '*Grosse Flemme (Slack Off)* : soin fiable à 50 %, à empiler avec Régé-Force.',
        '*Danse Ténèbre (Toxic)* ou *Cage-Éclair* : de quoi ne pas être passif face aux setup sweepers.',
        '*Vibra-Soin (Psyshock)* : STAB qui frappe la **Défense** adverse — utile contre les murs spéciaux qui te bloqueraient sinon.',
      ],
      recommended: true,
    },
    {
      id: 'plenitude',
      name: 'Variante Plénitude (Calm Mind)',
      tagline: 'gagner des combats plutôt que les tenir',
      nature: 'Calme (Calm)',
      natureFr: 'Calme',
      evs: { hp: 252, spd: 252 },
      item: 'Restes',
      moves: ['Plénitude', 'Ébullition', 'Vibra-Soin', 'Grosse Flemme'],
      notes: ['Plus lent à mettre en place, mais il devient une menace réelle en fin de partie.'],
    },
  ],
  ivGuidance: {
    focus: ['hp', 'def', 'spd'],
    ignore: ['atk', 'spe'],
    note: '**Ignore l’Attaque et la Vitesse** — une Attaque basse réduit les dégâts de Coup Bas (Foul Play), et la Vitesse ne lui sert à rien.',
  },
  tasks: [
    {
      id: 'mon-flagadoss-1',
      label: '**Obtenir un Ramoloss ou un Flagadoss.** Le plus propre : **DexNav un Ramoloss** jusqu’à en trouver un **3★** (3 IV déjà à 31) — ça t’économise 3 Bottle Caps. Alternative : Repaire de Raid de la **Route 14 (4-5★)** pour un Flagadoss direct.',
      priority: 1,
      requires: ['phase-1.2'],
      done: true,
    },
    {
      id: 'mon-flagadoss-2',
      label: '**Obtenir Régé-Force.** C’est le talent **caché**, donc deux chemins :',
      details: [
        '**Dream Ball** (3/jour, Dream Research Lab de Tarmigan Town) → capture un Ramoloss directement avec Régé-Force. **C’est la meilleure option** : gratuite et répétable.',
        '**Dream Mist** (raid Musharna 5/6★ à Tarmigan Town) sur un exemplaire déjà en ta possession.',
        '⚠️ **Une Ability Capsule ne suffit PAS** ici — elle ne fait qu’alterner Benêt ↔︎ Tempo Perso.',
      ],
      key: true,
      priority: 2,
      done: true,
    },
    {
      id: 'mon-flagadoss-3',
      label: 'Faire évoluer au **niveau 37** (Trainer House de Dresco + Œuf Chance amélioré = quelques minutes)',
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
      label: 'Nature → **Assuré (Bold)** (Tehl Town, 50 000 $)',
      requires: ['phase-1.1'],
      done: true,
    },
    {
      id: 'mon-flagadoss-7',
      label: 'EV : Dresco, dresseur PV (Poids Pouvoir) puis dresseur Défense (Ceinture Pouvoir), avec Macho Brace amélioré si tu ne fais qu’une stat à la fois',
      requires: ['mon-flagadoss-5', 'phase-1.4'],
      done: true,
    },
    {
      id: 'mon-flagadoss-8',
      label: 'IV : Bottle Caps sur **PV et Défense** en priorité, puis Déf.Spé. **Ignore l’Attaque et la Vitesse** — une Attaque basse réduit les dégâts de Coup Bas (Foul Play), et la Vitesse ne lui sert à rien',
      requires: ['phase-2.4'],
      done: true,
    },
    {
      id: 'mon-flagadoss-9',
      label: 'Moveset : **Ébullition (CT)**, **Grosse Flemme** et **Vibra-Soin** via le Move Relearner de **Crater Town** (Écailles Cœur) ou les tuteurs de la Battle Frontier',
      done: true,
    },
    {
      id: 'mon-flagadoss-10',
      label: 'Objet : **Restes** au Game Corner (5 000 jetons). ⚠️ Vérifie que Togekiss ou Motisma ne le porte pas déjà — certains formats de la Frontier interdisent les objets en double',
      requires: ['phase-2.6'],
      done: false,
    },
    {
      id: 'mon-flagadoss-11',
      label: '**Ne pas lui donner la Slowbronite** — le slot Méga est pris par Tyranitar',
      done: true,
    },
  ],
} satisfies PokemonSheet
