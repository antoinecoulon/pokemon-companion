import type { PokemonSheet } from '../types'

export default {
  slug: 'motisma-lavage',
  name: 'Rotom-Wash',
  sprite: 'rotom-wash',
  slot: 4,
  status: 'active',
  badge: 'Nouveau',
  role: 'Pivot spécial / Will-O-Wisp / Volt Switch',
  types: ['Electric', 'Water'],
  baseStats: { hp: 50, atk: 65, def: 107, spa: 105, spd: 107, spe: 86 },
  bst: 520,
  abilities: [
    { name: 'Levitate' },
    { name: 'Motor Drive', hidden: true },
  ],
  targetAbility: 'Levitate',
  obtention: 'Rotom est la récompense de la **mission #077 « Too Much TV »**. La forme Wash s\'obtient ensuite au **bâtiment de stockage d\'Antisis City** : dans le carton de gauche, interagis avec la machine à laver. Le changement de forme est réversible — les autres appareils y sont aussi.',
  preamble: [
    {
      kind: 'quote',
      tone: 'warning',
      text: '**À vérifier avant tout investissement : le talent doit être *Levitate*.** §7.3 compte Rotom-Wash parmi les **3 immunités Ground** de l\'équipe, et c\'est *Levitate* qui la donne — le typage Electric/Water, lui, prend le Ground plein pot. Avec *Motor Drive* (talent caché), l\'immunité saute et le calcul de §7.3 est faux. Ce n\'est **pas rattrapable à l\'Ability Capsule**, qui ne bascule qu\'entre talents standards : il faudrait un autre exemplaire.',
    },
  ],
  analysis: [
    {
      kind: 'p',
      text: 'C\'est le membre qui fait basculer l\'équipe de **4/1 à 3/3 en physique/spécial** (§7.3). Avant lui, une seule menace spéciale : un mur physique adverse suffisait à bloquer quatre de tes six slots.',
    },
    {
      kind: 'p',
      text: '**107 / 107 en Defense et SpD pour 50 HP** : le profil est celui d\'un pivot, pas d\'un mur. Les 50 HP plafonnent la survivabilité réelle (`HP × Defense`) — c\'est le même piège que Dusknoir (§6.4), en moins grave parce que les défenses sont mieux réparties et surtout parce qu\'il a *Volt Switch* pour sortir avant de mourir.',
    },
    {
      kind: 'p',
      text: '**Le typage Electric/Water est son vrai apport.** Il donne l\'une des 2 résistances Water de l\'équipe (avec Slowbro) — celle qui manquait à Tyranitar, Excadrill et Gliscor, tous ×2 — et une résistance Steel, absente jusque-là (§7.2, trou n°6). Combiné à *Levitate*, il n\'a que **deux faiblesses : Grass et Ground**, et la seconde est annulée par le talent.',
    },
    {
      kind: 'p',
      text: '**Will-O-Wisp est ce qui le rend précieux au Battle Tower**, bien plus que ses dégâts : brûler un attaquant physique divise ses dégâts par deux et lui inflige un chip permanent. Sur un format d\'usure comme celui-ci, c\'est une victoire par avance. *Volt Switch* fait le reste — il ramène Togekiss ou Slowbro en sécurité sans céder le momentum.',
    },
    {
      kind: 'quote',
      tone: 'info',
      text: '**Il subit le chip du sable** de ton propre Tyranitar (§7.3), avec Togekiss et Slowbro. C\'est le prix de Mega Tyranitar, et c\'est aussi pour ça que *Pain Split* ou les *Leftovers* ne sont pas décoratifs sur ce set.',
    },
  ],
  builds: [
    {
      id: 'a',
      name: 'Pivot Leftovers',
      tagline: 'le rôle que §7.3 lui donne mot pour mot',
      nature: 'Bold',
      evs: { hp: 252, def: 252, spa: 4 },
      item: 'Leftovers',
      moves: ['Hydro Pump', 'Volt Switch', 'Will-O-Wisp', 'Pain Split'],
      ability: 'Levitate',
      notes: [
        '*Bold* (+Def / -Atk) plutôt qu\'une nature spéciale : *Will-O-Wisp* fait de lui le check des attaquants **physiques**, c\'est là qu\'il doit tenir. L\'Attack baissée est un bonus — elle réduit les dégâts de *Foul Play*.',
        '*Hydro Pump* : le STAB de la forme Wash, et sa seule vraie source de dégâts · *Volt Switch* : le pivot · *Will-O-Wisp* : la couche défensive · *Pain Split* : le seul soin qu\'il ait, et il fonctionne d\'autant mieux que ses 50 HP sont bas.',
        '⚠️ **Trois candidats aux Leftovers** dans l\'équipe : Togekiss, Rotom-Wash et Slowbro (§7.3). Le tableau de §7.3 tranche en donnant les *Heavy-Duty Boots* à Togekiss et le *Rocky Helmet* à Slowbro — les *Leftovers* reviennent donc ici.',
        'Objet : Game Corner, 5 000 jetons.',
      ],
      recommended: true,
    },
    {
      id: 'b',
      name: 'Air Balloon offensif',
      tagline: 'la seconde option d\'objet de §7.3',
      nature: 'Modest',
      evs: { hp: 252, spa: 252, spe: 4 },
      item: 'Air Balloon',
      moves: ['Hydro Pump', 'Thunderbolt', 'Volt Switch', 'Will-O-Wisp'],
      ability: 'Levitate',
      notes: [
        'Le double STAB *Hydro Pump* / *Thunderbolt* couvre presque tout le jeu à lui seul, mais on perd *Pain Split* — donc tout soin.',
        '⚠️ **L\'Air Balloon fait doublon avec *Levitate*** : les deux donnent l\'immunité Ground, et le ballon éclate au premier coup encaissé. Il n\'a d\'intérêt que si tu joues un exemplaire à *Motor Drive*, faute d\'avoir pu en obtenir un à *Levitate*.',
        'À réserver au cas où l\'équipe manque de puissance offensive plutôt que de solidité — ce qui n\'est pas le diagnostic de §7.2.',
      ],
    },
  ],
  ivGuidance: {
    focus: ['hp', 'def', 'spd', 'spa'],
    ignore: ['atk'],
    note: '**Ignore l\'Attack** : aucun set ne l\'utilise, et une Attack basse réduit les dégâts de *Foul Play* — même logique que sur Togekiss et Slowbro. La Speed est secondaire : 86 de base ne dépasse rien de décisif.',
  },
  tasks: [
    {
      id: 'mon-motisma-lavage-1',
      label: '**Obtenir Rotom** — récompense de la **mission #077 « Too Much TV »**',
      priority: 1,
      key: true,
    },
    {
      id: 'mon-motisma-lavage-2',
      label: '⚠️ **Vérifier son talent avant tout investissement** : il faut **Levitate**, pas *Motor Drive*. *Motor Drive* est le talent caché — aucune Ability Capsule n\'en sort, il faudrait un autre exemplaire. C\'est *Levitate* qui porte l\'immunité Ground sur laquelle §7.3 compte',
      requires: ['mon-motisma-lavage-1'],
      priority: 2,
      ref: '§7.3',
      key: true,
    },
    {
      id: 'mon-motisma-lavage-3',
      label: '**Passer en forme Wash** : bâtiment de stockage d\'**Antisis City**, carton de gauche, interagir avec la machine à laver',
      requires: ['mon-motisma-lavage-1'],
      priority: 3,
    },
    {
      id: 'mon-motisma-lavage-4',
      label: 'Monter au niveau 100 (Trainer House de Dresco + Lucky Egg amélioré)',
      requires: ['mon-motisma-lavage-1'],
    },
    {
      id: 'mon-motisma-lavage-5',
      label: 'Purger les EV — inutile s\'il sort tout juste de la mission ; sinon baies au marché de **Fallshore City**',
      requires: ['phase-2.2'],
    },
    {
      id: 'mon-motisma-lavage-6',
      label: 'Nature → **Bold** (Tehl Town, 50 000 $)',
      requires: ['phase-1.1'],
    },
    {
      id: 'mon-motisma-lavage-7',
      label: 'EV : Dresco, dresseur HP (Power Weight) + dresseur Defense (Power Belt)',
      requires: ['mon-motisma-lavage-5', 'phase-1.4'],
    },
    {
      id: 'mon-motisma-lavage-8',
      label: 'IV : Bottle Caps sur **HP, Defense, SpD, SpA** — **ignore l\'Attack**',
      requires: ['phase-2.4'],
    },
    {
      id: 'mon-motisma-lavage-9',
      label: 'Moveset : **Volt Switch (TM)**, **Thunderbolt (TM)** et **Will-O-Wisp (TM)** ; **Hydro Pump** et **Pain Split** via le Move Relearner de **Crater Town** (Heart Scales) ou les tuteurs de la Battle Frontier. ⚠️ *Hydro Pump* n\'existe que sous la forme Wash — apprends-le **après** le changement de forme',
      requires: ['mon-motisma-lavage-3'],
    },
    {
      id: 'mon-motisma-lavage-10',
      label: 'Objet : **Leftovers** au Game Corner (5 000 jetons). ⚠️ Vérifie que Togekiss ou Slowbro ne les porte pas déjà — certains formats de la Frontier interdisent les objets en double',
      requires: ['phase-2.6'],
      ref: '§7.3',
    },
  ],
} satisfies PokemonSheet
