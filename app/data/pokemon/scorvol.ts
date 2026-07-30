import type { PokemonSheet } from '../types'

/** Slot 6 — Scorvol (§6.6) */
export default {
  slug: 'scorvol',
  name: 'Scorvol',
  nameEn: 'Gliscor',
  sprite: 'gliscor',
  slot: 6,
  status: 'active',
  badge: 'Nouveau',
  role: 'Mur physique / Piège de Roc / Soin Poison',
  types: ['Sol', 'Vol'],
  baseStats: { hp: 75, atk: 95, def: 125, spa: 45, spd: 75, spe: 95 },
  bst: 510,
  abilities: [
    { name: 'Régime Strict (Hyper Cutter)' },
    { name: 'Sable Volant (Sand Veil)' },
    { name: 'Soin Poison (Poison Heal)', hidden: true },
  ],
  targetAbility: 'Soin Poison (Poison Heal)',
  obtention: '**Gligar à Valley Cave** (+ Repaire de Raid de Valley Cave 3★), évolue en tenant un **Croc Rasoir (Razor Fang)** et en montant de niveau **la nuit**. Scorvol s’obtient aussi directement au **Repaire de Raid de Valley Cave (4-5★)**. Croc Rasoir : Valley Cave B1F (zone centrale, derrière un rocher cassable), Victory Road, ou **48 BP** au comptoir d’échange de la Battle Frontier. 5 % sur les Bruxish sauvages.',
  analysis: [
    {
      kind: 'p',
      text: 'Scorvol est le seul Pokémon de la liste qui coche **quatre cases d’un coup** :',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Immunisé au sable** (type Sol) — il ne subit pas ton propre Tyranitar',
        '**Immunisé au Sol** (type Vol) — troisième immunité Sol de l’équipe, Tyranitar peut switcher librement',
        '**Immunisé à l’Électrik** (type Sol) — couvre la faiblesse ×2 de Togekiss',
        '**Résiste au Combat** — seconde résistance après Flagadoss, sur le trou n°1 de ton équipe',
      ],
    },
    {
      kind: 'p',
      text: 'Ajoute **Soin Poison + Orbe Toxique** : il récupère **1/8 de ses PV max par tour**, est immunisé à tous les autres statuts (brûlure, paralysie, sommeil), et se soigne encore avec **Atterrissage**. C’est un mur physique qui ne meurt pas, et il pose ton **Piège de Roc** — ce qui libère Tyranitar d’avoir à le faire.',
    },
    {
      kind: 'p',
      text: '**Le combo à connaître :** sous Soin Poison, Scorvol est empoisonné en permanence. **Façade (Facade)** double sa puissance quand le lanceur a un statut → **140 de puissance** avec 95 d’Attaque, sans recul et sans baisse de stat. C’est son meilleur STAB de secours à côté de Séisme.',
    },
    {
      kind: 'p',
      text: '**Ses défauts, sans détour :**',
    },
    {
      kind: 'list',
      items: [
        '**Glace ×4.** Un seul Laser Glace le sort du combat. C’est sa faiblesse rédhibitoire, et elle chevauche mal avec Togekiss (Glace ×2). Flagadoss résiste à la Glace : c’est ton switch.',
        '**Eau ×2**, qui s’empile avec Tyranitar et Excadrill. Là encore, Flagadoss couvre.',
        '**Att.Spé 45** — c’est un attaquant purement physique. Il ne règle pas ta monoculture, il règle ta défense.',
        '**Soin Poison est un talent caché** → Dream Mist ou Dream Ball obligatoires.',
      ],
    },
    {
      kind: 'quote',
      tone: 'warning',
      text: '**Sable Volant (Sand Veil) donne 20 % d’esquive sous le sable — n’y touche pas.** Certains formats de la Battle Frontier bannissent les talents et objets d’esquive, et l’esquive est de toute façon une source de frustration. **Soin Poison est le seul talent qui vaut le coup ici.**',
    },
  ],
  builds: [
    {
      id: 'mur-hazards',
      name: 'Mur physique / Poseur de hazards',
      nature: 'Malin (Impish)',
      natureFr: 'Malin',
      evs: { hp: 252, def: 252, spe: 4 },
      item: 'Orbe Toxique (Toxic Orb)',
      ability: 'Soin Poison (Poison Heal)',
      moves: ['Séisme', 'Piège de Roc', 'Atterrissage', 'Sabotage'],
      notes: [
        'Objet **obligatoire**, c’est ce qui active le talent (Valley Cave, à l’ouest de Black Belt Hitoshi, ou **16 BP** au Battle Tower).',
        '*Séisme* : STAB principal · *Piège de Roc (Stealth Rock)* : le poseur de hazards qui manquait à l’équipe · *Atterrissage (Roost)* : soin, empilé avec Soin Poison · *Sabotage (Knock Off)* : retire les Restes et les objets Choix adverses — valeur énorme au Battle Tower.',
        '*Façade* remplace Sabotage si tu préfères la puissance brute (140 de puissance sous poison).',
      ],
      recommended: true,
    },
    {
      id: 'offensif',
      name: 'Variante offensive',
      nature: 'Rigide (Adamant)',
      natureFr: 'Rigide',
      evs: { atk: 252, spe: 252 },
      item: 'Orbe Toxique (Toxic Orb)',
      moves: ['Danse Lames', 'Séisme', 'Façade', 'Atterrissage'],
      notes: [
        'Il devient un vrai sweeper, mais tu perds le Piège de Roc et la solidité — et l’équipe a plus besoin du mur.',
      ],
    },
  ],
  ivGuidance: {
    focus: ['hp', 'def'],
    ignore: ['spa'],
    note: '**Ignore l’Att.Spé** ; l’Attaque est secondaire (utile seulement pour Séisme/Façade).',
  },
  tasks: [
    {
      id: 'mon-scorvol-1',
      label: '**Capturer un Gligar avec Soin Poison.** Deux chemins :',
      details: [
        '**Dream Ball** (3/jour, Dream Research Lab de Tarmigan Town) sur un Gligar de **Valley Cave** → talent caché garanti. **Le plus simple.**',
        '**DexNav** un Gligar à Valley Cave en visant **3★** (3 IV à 31), puis **Dream Mist** dessus.',
        'Si tu peux combiner les deux (Dream Ball **et** un bon jet d’IV), fais-le : ça t’économise 3 Bottle Caps.',
      ],
      key: true,
      priority: 1,
      done: false,
    },
    {
      id: 'mon-scorvol-2',
      label: '**Récupérer un Croc Rasoir** : Valley Cave B1F derrière le rocher cassable, ou 48 BP',
      done: false,
    },
    {
      id: 'mon-scorvol-3',
      label: '**Faire évoluer** : donner le Croc Rasoir à tenir, puis monter d’un niveau **de nuit**',
      requires: ['mon-scorvol-1', 'mon-scorvol-2'],
      done: false,
    },
    {
      id: 'mon-scorvol-4',
      label: 'Monter au niveau 100 (Trainer House de Dresco + Œuf Chance amélioré)',
      requires: ['mon-scorvol-3'],
      done: false,
    },
    {
      id: 'mon-scorvol-5',
      label: 'Purger les EV — baies au marché de **Fallshore City** (inutile s’il est fraîchement capturé)',
      requires: ['phase-2.2'],
      done: false,
    },
    {
      id: 'mon-scorvol-6',
      label: 'Nature → **Malin (Impish)** (Tehl Town, 50 000 $)',
      requires: ['phase-1.1'],
      done: false,
    },
    {
      id: 'mon-scorvol-7',
      label: 'EV : Dresco, dresseur PV (Poids Pouvoir) + dresseur Défense (Ceinture Pouvoir)',
      requires: ['mon-scorvol-5', 'phase-1.4'],
      done: false,
    },
    {
      id: 'mon-scorvol-8',
      label: 'IV : Bottle Caps sur **PV et Défense**. **Ignore l’Att.Spé** ; l’Attaque est secondaire (utile seulement pour Séisme/Façade)',
      requires: ['phase-2.4'],
      done: false,
    },
    {
      id: 'mon-scorvol-9',
      label: '**Récupérer l’Orbe Toxique** : Valley Cave (ouest de Black Belt Hitoshi) ou 16 BP au Battle Tower. **Sans lui, Soin Poison ne sert à rien**',
      key: true,
      done: false,
    },
    {
      id: 'mon-scorvol-10',
      label: 'Moveset : **Piège de Roc (CT)**, **Séisme (CT)**, **Atterrissage** et **Sabotage** via Move Relearner de Crater Town ou tuteurs de la Frontier',
      done: false,
    },
    {
      id: 'mon-scorvol-11',
      label: '⚠️ **Vérifier son talent avant tout achat** : s’il a Sable Volant ou Régime Strict, le set ne fonctionne pas',
      priority: 2,
      done: false,
    },
  ],
} satisfies PokemonSheet
