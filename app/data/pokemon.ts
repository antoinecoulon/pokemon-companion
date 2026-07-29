import type { PokemonSheet } from './types'

/**
 * §6 — Fiches détaillées par Pokémon, et §7.3 — Composition finale validée.
 *
 * Les statistiques de base et les learnsets sont ceux d'Unbound
 * (source : romhackdex.net/unbound), pas ceux des jeux officiels.
 *
 * Deux fiches sont marquées `incomplete` : §7.3 place Excadrill et
 * Motisma-Lavage dans l'équipe, mais §6 ne leur consacre aucune fiche. On
 * reporte les seules données réellement présentes dans le guide, sans
 * fabriquer de build à leur place.
 */
export const pokemon: PokemonSheet[] = [
  /* ----------------------------------------------------------------------- *
   * Slot 1 — Tyranitar (§6.1)
   * ----------------------------------------------------------------------- */
  {
    slug: 'tyranitar',
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
  },

  /* ----------------------------------------------------------------------- *
   * Slot 2 — Excadrill : aucune fiche dans le guide source
   * ----------------------------------------------------------------------- */
  {
    slug: 'excadrill',
    name: 'Excadrill',
    slot: 2,
    status: 'active',
    badge: 'Conservé',
    role: 'Sweeper Baigne Sable + Tour Rapide',
    types: ['Sol', 'Acier'],
    incomplete: true,
    incompleteNote: 'Le guide place Excadrill au slot 2 (§7.3) et le recommande en phase 4.1, mais ne lui consacre aucune fiche en §6 : ni stats de base, ni build, ni TODO. Les éléments ci-dessous sont les seuls que le guide donne réellement à son sujet.',
    analysis: [
      {
        kind: 'list',
        items: [
          '**Tour Rapide + Baigne Sable, synergie parfaite avec Tyranitar** — c’est à ce titre qu’il est retenu en §4.1 pour combler le trou n°1 de l’équipe.',
          'Il apporte le **seul retrait de hazards** de l’équipe (§7.3) : sans lui, le Piège de Roc détruit Togekiss à 25 % par entrée.',
          'Sous le sable, il **gagne 176 de Vitesse** (§6.5) — c’est ce qui lui fait préférer Zeraora, puni par le sable là où Excadrill en profite.',
          '**Résiste à la Glace** (§7.3) : avec Flagadoss, c’est ton switch obligatoire contre les attaquants Glace.',
          'Faiblesses citées par le guide : **Combat ×2** et **Feu ×2** (§6.2), **Eau ×2** (§6.2, §6.6) — les trois couvertes par Flagadoss.',
          'Objet prévu en §7.3 : **Bandeau Choix**.',
        ],
      },
      {
        kind: 'quote',
        tone: 'warning',
        text: 'Fiche à compléter : stats de base d’Unbound, talent exact, nature, répartition d’EV et moveset restent à établir sur **romhackdex.net/unbound**.',
      },
    ],
  },

  /* ----------------------------------------------------------------------- *
   * Slot 3 — Togekiss (§6.3)
   * ----------------------------------------------------------------------- */
  {
    slug: 'togekiss',
    name: 'Togekiss',
    slot: 3,
    status: 'active',
    badge: 'Conservé',
    role: 'Para-flinch / Stallbreaker (spécial)',
    types: ['Fée', 'Vol'],
    baseStats: { hp: 85, atk: 50, def: 95, spa: 120, spd: 115, spe: 80 },
    bst: 545,
    abilities: [
      { name: 'Hustle' },
      { name: 'Sérénité (Serene Grace)' },
      { name: 'Œil Compétitif', hidden: true },
    ],
    targetAbility: 'Sérénité (Serene Grace)',
    analysis: [
      {
        kind: 'p',
        text: '**C’est ton meilleur investissement, de loin.** Sérénité double les effets secondaires : Lame d’Air passe de 30 % à **60 % de chance d’apeurer**. Combiné à Cage-Éclair (paralysie = 25 % de chance de ne pas agir), tu obtiens la fameuse **para-flinch** : l’adversaire a environ **70 % de chance de ne rien faire à chaque tour**.',
      },
      {
        kind: 'p',
        text: 'C’est une stratégie qui frôle l’abus contre l’IA du Battle Tower, et c’est exactement pour ça qu’elle est parfaite pour ton usage.',
      },
      {
        kind: 'quote',
        tone: 'success',
        text: '**Correction importante :** Sérénité **n’est pas** son talent caché — c’est son **talent 2**. Une **Ability Capsule** du Game Corner suffit. Économie de plusieurs heures de farm de Dream Mist.',
      },
      {
        kind: 'p',
        text: '**Sur la nature :** ton guide d’origine proposait **Assuré (Bold)**. C’est un mauvais choix ici — Bold baisse l’Attaque (que Togekiss n’utilise pas, donc OK) mais monte la Défense, alors que ce que tu veux c’est **agir en premier pour apeurer**. Un Togekiss lent ne peut pas apeurer.',
      },
    ],
    builds: [
      {
        id: 'para-flinch',
        name: 'Para-Flinch',
        nature: 'Timide (Timid)',
        natureFr: 'Timide',
        evs: { hp: 252, spe: 252, spa: 4 },
        item: 'Bottes Épaisses (Heavy-Duty Boots)',
        ability: 'Sérénité (Serene Grace)',
        moves: ['Lame d’Air', 'Cage-Éclair', 'Atterrissage', 'Machination'],
        notes: [
          'La **Vitesse est la stat qui fait fonctionner la stratégie**.',
          'Objet : Togekiss prend **25 % par Piège de Roc**, c’est sa faiblesse n°1.',
          '*Lame d’Air* = le cœur du set · *Cage-Éclair* = la moitié du combo · *Atterrissage (Roost)* = soin fiable, indispensable · *Machination (Nasty Plot)* ou *Éclat Magique* selon que tu préfères la puissance ou la couverture.',
        ],
        recommended: true,
      },
      {
        id: 'bulky-offense',
        name: 'Bulky Offense',
        tagline: 'variante',
        nature: 'Modeste (Modest)',
        natureFr: 'Modeste',
        evs: { hp: 252, spa: 252 },
        item: 'Restes',
        moves: ['Éclat Magique', 'Aurasphère', '—', '—'],
        notes: ['Plus de dégâts, moins de contrôle.'],
      },
    ],
    ivGuidance: {
      focus: ['hp', 'spe', 'spa', 'spd'],
      ignore: ['atk'],
      note: '**Ignore l’Attaque** : elle n’est jamais utilisée, et une Attaque basse réduit les dégâts de Confusion et de Coup Bas.',
    },
    tasks: [
      {
        id: 'mon-togekiss-1',
        label: '**Acheter une Ability Capsule** au **Game Corner de Dehara** → passer en **Sérénité**. ⚠️ Vérifie d’abord son talent actuel : s’il est déjà en Sérénité, tu n’as rien à faire',
        key: true,
        priority: 1,
        done: true,
      },
      {
        id: 'mon-togekiss-2',
        label: 'Purger ses EV (5 BP/stat, Frontier)',
        done: true,
      },
      {
        id: 'mon-togekiss-3',
        label: 'Nature → **Timide** (Tehl Town, 50 000 $)',
        requires: ['phase-1.1'],
        done: true,
      },
      {
        id: 'mon-togekiss-4',
        label: 'EV : Dresco, dresseur PV (Poids Pouvoir) + dresseur Vitesse (Anneau Pouvoir)',
        requires: ['mon-togekiss-2', 'phase-1.4'],
        done: true,
      },
      {
        id: 'mon-togekiss-5',
        label: 'IV : Bottle Caps sur **PV, Vitesse, Att.Spé, Déf.Spé** — **ignore l’Attaque**',
        requires: ['phase-2.4'],
        done: true,
      },
      {
        id: 'mon-togekiss-6',
        label: 'Moveset : **Cage-Éclair (CT73)**, **Atterrissage** et **Machination** via Move Relearner de Crater Town (Écailles Cœur) ou tuteur Frontier',
        done: true,
      },
      {
        id: 'mon-togekiss-7',
        label: 'Objet : **Bottes Épaisses** — 48 BP au Battle Tower, ou exemplaire unique à **Cootes Bog** (nord-est de la Ranger Betty)',
        done: true,
      },
      {
        id: 'mon-togekiss-8',
        label: '**Vérifier son bonheur** si tu passes par le Nature Changer de la Frontier (il le remet à 0) — sans impact ici puisque le set n’utilise pas Retour',
        done: true,
      },
    ],
  },

  /* ----------------------------------------------------------------------- *
   * Slot 4 — Motisma-Lavage : aucune fiche dans le guide source
   * ----------------------------------------------------------------------- */
  {
    slug: 'motisma-lavage',
    name: 'Motisma-Lavage',
    nameEn: 'Rotom-Wash',
    slot: 4,
    status: 'active',
    badge: 'Nouveau',
    role: 'Pivot spécial / Feu Follet / Change Éclair',
    types: ['Électrik', 'Eau'],
    incomplete: true,
    incompleteNote: 'Le guide introduit Motisma-Lavage au slot 4 dans la composition finale (§7.3) mais ne lui consacre aucune fiche en §6 : ni stats de base, ni analyse, ni build, ni TODO. Les éléments ci-dessous sont les seuls que le guide donne réellement à son sujet.',
    analysis: [
      {
        kind: 'list',
        items: [
          'Rôle assigné en §7.3 : **pivot spécial**, avec **Feu Follet** et **Change Éclair**.',
          'Objet prévu : **Restes ou Ballon**. ⚠️ §7.3 signale que Togekiss, Motisma et Flagadoss sont **trois candidats aux Restes** — à répartir si le format interdit les doublons.',
          'Il apporte une des **3 immunités Sol** de l’équipe et une des **2 résistances Eau** (§7.3).',
          'Il fait partie des **4 sources de soin fiable** de la nouvelle composition (§7.3).',
          '**Il subit le chip du sable** de ton propre Tyranitar (§7.3), avec Togekiss et Flagadoss.',
          'Il fait passer le ratio physique / spécial de l’équipe de 4/1 à **3/3** (§7.3).',
        ],
      },
      {
        kind: 'quote',
        tone: 'warning',
        text: 'Fiche à compléter : stats de base d’Unbound, talent (Lévitation ou Motor Drive selon la forme), nature, répartition d’EV et moveset complet restent à établir sur **romhackdex.net/unbound**.',
      },
    ],
  },

  /* ----------------------------------------------------------------------- *
   * Slot 5 — Flagadoss (§6.2)
   * ----------------------------------------------------------------------- */
  {
    slug: 'flagadoss',
    name: 'Flagadoss',
    nameEn: 'Slowbro',
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
  },

  /* ----------------------------------------------------------------------- *
   * Slot 6 — Scorvol (§6.6)
   * ----------------------------------------------------------------------- */
  {
    slug: 'scorvol',
    name: 'Scorvol',
    nameEn: 'Gliscor',
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
  },

  /* ----------------------------------------------------------------------- *
   * Sortis de l'équipe (§6.4, §6.5, §7.3)
   * ----------------------------------------------------------------------- */
  {
    slug: 'dusknoir',
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
  },

  {
    slug: 'zeraora',
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
  },

  {
    slug: 'sceptile',
    name: 'Sceptile',
    status: 'retired',
    badge: 'Sorti de l’équipe',
    role: 'Jamais optimisé — remplacé par Flagadoss',
    types: ['Plante'],
    incomplete: true,
    incompleteNote: 'Le guide range Sceptile parmi les sortants (§7.3, « jamais optimisé ») et ne lui consacre aucune fiche en §6. Il n’apparaît plus que dans les raisonnements sur le conflit de Méga (§0.5, §6.2) et le chip du sable (§6.1).',
    analysis: [
      {
        kind: 'list',
        items: [
          'Motif de sortie donné en §7.3 : **jamais optimisé**, et §7.2 le cite comme l’un des **deux slots faibles** (« Sceptile non-Méga »).',
          'Il était l’une des deux branches du **conflit de Méga** avec Tyranitar (§0.5) — tranché en faveur de Tyranitar.',
          '**Il prenait le chip du sable** de ton propre Tyranitar (§6.1).',
          'Son remplaçant est **Flagadoss**, qui apporte la résistance au Combat qui manquait (§6.2).',
          'Reste utile à savoir : la **Sceptilite** dépend de la mission **#010** (20 Pierres Dures → 1 Gemme, §12), et la **Puissance Cachée Feu** passait par le Hidden Power Changer de la Frontier (§2.1).',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------------- *
   * §6.7 — Utilitaires à garder en boîte (capture & Pokédex)
   * ----------------------------------------------------------------------- */
  {
    slug: 'queulorior',
    name: 'Queulorior',
    nameEn: 'Smeargle',
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
        text: '**Pourquoi lui :** sa capacité **Mimique (Sketch)** copie définitivement la dernière attaque utilisée par l’adversaire. Il apprend Mimique à chaque multiple de 11 niveaux, donc il peut se constituer **le moveset de capture parfait**, que presque aucun autre Pokémon ne peut réunir seul :',
      },
      {
        kind: 'table',
        head: ['Slot', 'Capacité', 'Rôle'],
        rows: [
          ['1', '**Faux-Chage (False Swipe)**', 'Laisse toujours 1 PV — jamais de KO accidentel'],
          ['2', '**Spore**', 'Endort à **100 %** de précision. Le statut qui double le taux de capture'],
          ['3', '**Larcin (Thief)** ou **Implore (Covet)**', 'Vole l’objet tenu par le sauvage — c’est ta source d’Écailles Cœur, de Morceaux d’Étoile et de Pierres Stase'],
          ['4', '**Doux Parfum (Sweet Scent)**', 'Déclenche une rencontre immédiate — plus besoin de tourner en rond dans les hautes herbes'],
        ],
      },
      {
        kind: 'p',
        text: '**Points de vigilance :**',
      },
      {
        kind: 'list',
        items: [
          'Ses stats sont catastrophiques (BST 250). Monte-le **niveau 100** et donne-lui **252 EV en PV et en Défense** pour qu’il survive — c’est vite fait à Dresco.',
          '**Faux-Chage ne touche pas les Spectre.** Pour ceux-là, prévois un Pokémon avec une attaque faible à dégâts fixes, ou capture-les endormis à pleine vie.',
          '**Larcin échoue si Queulorior tient déjà un objet** — laisse-lui les mains vides.',
          'Pour lui apprendre une attaque, il doit **subir ou voir** cette attaque : le plus simple est de faire utiliser l’attaque par un allié en Combat Duo, ou de la subir d’un sauvage.',
          'Le guide n’a **pas trouvé sa localisation exacte dans Unbound** — utilise le **DexNav** une fois l’espèce enregistrée, ou consulte la page Locations du wiki.',
        ],
      },
    ],
  },

  {
    slug: 'mule-a-objets',
    name: 'Mule à objets',
    status: 'utility',
    role: 'Porteur de Fouille + Larcin',
    types: [],
    extra: [
      {
        kind: 'p',
        text: '**Pourquoi :** **Fouille (Frisk)** révèle l’objet tenu par le sauvage **dès l’entrée en combat**. Tu sais donc immédiatement si le combat vaut la peine d’être joué, au lieu de voler à l’aveugle. Combiné à Larcin, ça alimente **trois** de tes farms simultanément :',
      },
      {
        kind: 'table',
        head: ['Objet volé', 'Source', 'Pour quoi faire'],
        rows: [
          ['**Écailles Cœur**', 'Luvdisc (pêche Méga Canne)', 'Move Relearner de Crater Town'],
          ['**Morceaux d’Étoile**', 'Minior (DexNav, Route 1)', 'Améliorer les objets Pouvoir'],
          ['**Pierres Stase**', 'Racaillou / Rocabot (5–10 %)', 'Améliorer le Macho Brace jusqu’à ×10'],
        ],
      },
      {
        kind: 'p',
        text: '**Candidats :** **Branette (Banette)** — Fouille + Larcin + Feu Follet, disponible tôt. **Bébécaille/Noctunoir** ou **Ronflex** peuvent aussi convenir selon leur talent dans Unbound.',
      },
      {
        kind: 'quote',
        tone: 'tip',
        text: '**Ton Dusknoir sortant est un candidat naturel** : son talent caché est justement **Fouille**. Comme il quitte l’équipe de combat, tu peux lui appliquer une **Dream Mist** sans regret et le recycler en mule à objets. Ça lui donne une seconde vie utile au lieu de le laisser dormir en boîte.',
      },
    ],
  },

  {
    slug: 'synchro',
    name: 'Porteur de Synchro',
    status: 'utility',
    role: 'Économise 50 000 $ de Nature Changer par capture',
    types: ['Psy'],
    extra: [
      {
        kind: 'p',
        text: 'Un **Tarsal / Kirlia / Gardevoir**, un **Abra**, un **Mentali** ou un **Noctali** avec le talent **Synchro** placé **en tête d’équipe** donne aux Pokémon sauvages **50 % de chances d’avoir la même nature que lui**.',
      },
      {
        kind: 'p',
        text: 'Concrètement : un Kirlia **Rigide** en tête, et un Gligar sur deux sera Rigide. **Tu économises 50 000 $ de Nature Changer par capture.**',
      },
      {
        kind: 'quote',
        tone: 'warning',
        text: 'À vérifier en jeu : le guide n’a pas confirmé que Synchro affecte bien les rencontres sauvages dans Unbound (c’est le cas depuis la Gen 4 dans les jeux officiels, et le CFRU suit les mécaniques Gen 8, donc c’est très probable). Test rapide : mets un Synchro d’une nature rare en tête et capture cinq sauvages d’affilée.',
      },
    ],
  },
] satisfies PokemonSheet[]

/** Membres de la composition finale validée (§7.3), triés par slot. */
export const activePokemon = pokemon
  .filter(mon => mon.status === 'active')
  .sort((a, b) => (a.slot ?? 99) - (b.slot ?? 99))

export const retiredPokemon = pokemon.filter(mon => mon.status === 'retired')
export const utilityPokemon = pokemon.filter(mon => mon.status === 'utility')

export const pokemonBySlug = new Map(pokemon.map(mon => [mon.slug, mon]))

/** Index plat de toutes les tâches de fiche, par id. */
export const pokemonTasksById = new Map(
  pokemon.flatMap(mon => (mon.tasks ?? []).map(task => [task.id, { task, mon }] as const)),
)
