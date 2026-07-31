import type { ReferenceSection, Tool } from './types'

export const mechanics: ReferenceSection[] = [
  {
    id: 'comprendre-endgame',
    title: 'Comprendre le endgame',
    ref: '§1',
    blocks: [],
    subsections: [
      {
        id: 'niveau-100-peut-etre-faible',
        title: 'Pourquoi un Pokémon niveau 100 peut être faible',
        ref: '§1.1',
        blocks: [
          { kind: 'p', text: 'Le niveau 100 est un prérequis, pas une garantie. Un Pokémon avec des IV moyens, des EV dispersés au fil du scénario, une nature tirée au hasard et un talent non adapté sera nettement moins efficace qu’un Pokémon optimisé de niveau inférieur. L’IA du postgame d’Unbound applique des stratégies de niveau compétitif : équipes construites, synergies de climat, objets stratégiques, prédictions de switch.' },
        ],
      },
      {
        id: 'termine-vs-optimise',
        title: 'Terminé ≠ Optimisé',
        ref: '§1.2',
        blocks: [
          {
            kind: 'list',
            items: [
              '**Terminé (scénario)** : Niveau 100, EV dispersés, IV variables, nature aléatoire, moveset orienté couverture brute.',
              '**Optimisé (endgame)** : 31 IV sur les stats utiles, 508 EV placés au point près, nature qui booste la stat clé sans pénaliser le rôle, talent optimal, moveset cohérent (STAB + couverture + utilitaire/setup), objet dédié.',
            ],
          },
          {
            kind: 'code',
            text: `Niveau 100
    ↓
   IV (potentiel génétique : 0 à 31)
    ↓
   EV (entraînement ciblé : 252 max/stat, 510 total)
    ↓
 Nature (+10 % / -10 %)
    ↓
 Talent
    ↓
Moveset (STAB + couverture + utilitaire)
    ↓
 Objet
    =
Pokémon compétitif`,
          },
        ],
      },
    ],
  },
  {
    id: 'mecaniques-optimisation',
    title: 'Mécaniques d’optimisation (version corrigée)',
    ref: '§2',
    blocks: [],
    subsections: [
      {
        id: 'ivs',
        title: 'IV — Individual Values',
        ref: '§2.1',
        blocks: [
          { kind: 'p', text: '0 à 31 par statistique. Au niveau 100, 31 IV = 31 points de stat supplémentaires.' },
          {
            kind: 'table',
            head: ['Rôle', 'IV visés', 'Exception'],
            rows: [
              ['Attaquant physique', '31 partout sauf Sp. Atk', 'Speed à 0 si équipe Trick Room'],
              ['Attaquant spécial', '31 partout sauf Attack', 'Attack basse recommandée (réduit les dégâts de Confusion et de Foul Play)'],
              ['Tank', '31 partout', 'Speed à 0 si Trick Room'],
            ],
          },
          { kind: 'p', text: '**Où :** PNJ **IV Changer**, Seaport City, près du port.\nDepuis le Pokémon Center de Seaport : plein est → descends les escaliers près de l’entrée KBT Expressway → plein sud → PNJ aux cheveux violets devant l’entrepôt.' },
          {
            kind: 'list',
            items: [
              '1 **Bottle Cap** = 1 stat portée à 31',
              '1 **Gold Bottle Cap** = les 6 stats',
            ],
          },
          {
            kind: 'quote',
            tone: 'warning',
            text: '**Deux pièges.**\n1. Si le PNJ n’apparaît pas, mets la difficulté sur autre chose que *Vanilla*.\n2. Le Hyper Training ne modifie **pas** le Hidden Power. Pour ça, il y a le **Hidden Power Changer** à la Battle Frontier (contre BP). Pertinent pour Sceptile si tu vises Hidden Power Fire.',
          },
          { kind: 'p', text: '**Obtenir des Bottle Caps :** minage avec l’**ADM Gear** (KBT Expressway, Crystal Peak), raids 5–6★, récompenses de missions. **Gold Bottle Cap** : mission **#006 « All the Right Moves »** (trouver les 120 TM — la dame est à Polder Town, à l’est de la ville au-dessus de l’entrée de la Safari Zone).' },
        ],
        subsections: [
          {
            id: 'ivs-methodes',
            title: 'Les trois méthodes IV, et laquelle utiliser quand',
            blocks: [
              {
                kind: 'table',
                head: ['Méthode', 'Coût', 'Quand l’utiliser'],
                rows: [
                  ['**DexNav**', 'Gratuit, un peu de temps', '**Pour tout nouveau Pokémon.** Après avoir capturé une espèce puis l’avoir cherchée quelques fois au DexNav, la boîte de scan affiche une **note en étoiles = le nombre d’IV déjà à 31**. Capture quelques 2★/3★, compare-les dans le PC, garde le meilleur.'],
                  ['**Élevage**', 'Long', 'Meilleur résultat absolu. Fais les quêtes du personnage de la **Breeder’s School de Seaport City** pour obtenir un **Ditto aux IV max**, donne-lui un **Destiny Knot** (achetable au Casino), et croise-le avec ta cible. Répète avec les bébés les plus proches du parfait.'],
                  ['**Bottle Caps**', 'Rare', '**Réserve-les aux légendaires et mythiques** — ceux que tu ne peux ni élever ni DexNav.'],
                ],
              },
              {
                kind: 'quote',
                tone: 'tip',
                text: '**Conséquence directe pour toi.** Zeraora est **le seul de tes 5 Pokémon** qui ne peut être ni élevé (groupe d’œufs *Indéterminé*) ni chassé au DexNav. **C’est lui, en priorité absolue, qui doit consommer tes Bottle Caps.**\n\nPour Tyranitar / Sceptile / Dusknoir / Togekiss, tu as un vrai arbitrage à faire :\n- **Garder tes exemplaires actuels** (histoire, niveau 100 déjà atteint, TM déjà apprises) et payer en Bottle Caps ;\n- **ou en ré-élever/re-capturer** de meilleurs via DexNav 3★ + Ditto parfait, ce qui coûte du temps mais zéro cap, puis les remonter au niveau 100 à la Trainer House de Dresco (quasi instantané avec un Lucky Egg amélioré).\n\nSi tu as moins de ~8 Bottle Caps en stock, la seconde option est objectivement meilleure. Ce n’était pas une possibilité envisagée dans ton guide d’origine.',
              },
              {
                kind: 'quote',
                tone: 'warning',
                text: '**Piège Vanilla.** Si tu joues en difficulté *Vanilla*, les notes IV en lettres n’apparaissent pas dans le résumé, **et** le PNJ IV Changer peut ne pas apparaître à Seaport. Monte au moins en *Difficile*.',
              },
            ],
          },
        ],
      },
      {
        id: 'evs',
        title: 'EV — Effort Values',
        ref: '§2.2',
        blocks: [
          { kind: 'p', text: '510 au total, 252 maximum par stat. **4 EV = 1 point** au niveau 100 → **252 / 252 / 4** est la répartition optimale (le reste est perdu de toute façon).' },
          {
            kind: 'code',
            text: `[Sweeper physique / spécial]   252 Spe  | 252 Atk ou SpA | 4 HP
[Tank physique]                252 HP   | 252 Def        | 4 SpD
[Tank spécial]                 252 HP   | 252 SpD        | 4 Def
[Bulky offense]                252 HP   | 252 Atk/SpA    | 4 Spe`,
          },
          { kind: 'p', text: '**Purger les EV parasites — 3 méthodes :**' },
          {
            kind: 'list',
            ordered: true,
            items: [
              '**Baies réductrices** (Pomeg, Kelpsy, Qualot, Hondew, Grepa, Tamato) : **10 EV par baie**, et elles s’achètent au **marché en plein air de Fallshore City**. **C’est la méthode par défaut** : ça ne coûte que de l’argent, et l’argent se farme facilement à Dresco. Achètes-en une trentaine par stat à purger. Une boîte de dialogue t’avertit quand la stat est à 0.',
              '**Battle Frontier**, stand en haut à droite : **5 BP par stat purgée**. Plus rapide, mais tes BP valent mieux que ça — garde-les pour les Choice items. Ce PNJ peut aussi **maxer** une stat à 252 pour **50 BP** (dépannage de luxe).',
              'Les Vitamins ne purgent rien — elles ajoutent uniquement.',
            ],
          },
          { kind: 'p', text: '**Ré-entraîner les EV :**' },
          {
            kind: 'list',
            items: [
              '**Trainer House de Dresco Town** (coin **sud-est** de la ville) : chaque dresseur n’utilise que des Pokémon donnant un seul type d’EV, et l’annonce indirectement dans son dialogue (« mes Pokémon *rapides* vont te battre »). Avant Blizzard City : HP/XP, Attack, Sp. Atk, Speed. Après : Defense et Sp. Def aussi. **C’est la méthode de référence**, confirmée par la FAQ du hack.',
              '**Macho Brace** — multiplie les EV gagnés **jusqu’à ×10 selon son niveau d’amélioration**. C’est de très loin le plus gros levier, et ton guide d’origine le sous-estimait complètement.\n— **Vanilla / Difficile** : donné par le Black Belt **à l’ouest de Fallshore City, sur le bord sud de la carte** (Surf requis) — la Route 10, près de la cascade la plus au sud, sous la Cave of Being.\n— **Expert / Insane** : le Macho Brace est **déjà dans ton sac au début de la partie**, et le Black Belt se trouve sur le **bord est de Crater Town**.\n— **Amélioration** : par ce même PNJ, contre des **Everstones** — qui se farment très facilement **au minage dans le KBT Expressway, juste au nord de Crater Town**.',
              '**Power items** (Power Weight / Power Bracer / Power Belt / Power Band / Power Lens / Power Anklet) : donnent des EV d’une stat précise à chaque fin de combat, indépendamment du Pokémon vaincu. Obtenus via des missions secondaires (#003, #005, #033, #052, #071, + Vivill Warehouse B5F).\n— **Amélioration** : un **autre** Black Belt, **près d’Antisis City** (côté Thundercap Mountain), contre des **Star Pieces**.\n— **Farm de Star Pieces** : DexNav un **Minior sur la Route 1** et vole-lui son objet avec **Knock Off**, idéalement avec un Absol ou un Drapion.',
              '**Pokérus** : double tous les gains d’EV. Cumulable avec le Macho Brace et les Power items.',
              '**Vitamins** : +10 EV/unité. Chères à l’achat et peu efficaces — **mais tu en as déjà un stock dans ton sac**, donc utilise-le, ne le rachète pas. Voir §0.1 pour le doute sur le plafond de 100.',
            ],
          },
          {
            kind: 'quote',
            tone: 'tip',
            text: 'En difficulté *Vanilla*, monte temporairement en *Difficile* : les dresseurs utilisent alors des Pokémon plus haut niveau et évolués, qui donnent **plus d’EV par combat**.',
          },
          {
            kind: 'quote',
            tone: 'tip',
            text: '**Combo optimal :** Pokérus + Macho Brace amélioré ×10 + dresseur spécialisé de Dresco → une statistique passe de 0 à 252 EV en une poignée de combats.',
          },
        ],
      },
      {
        id: 'nature',
        title: 'Nature',
        ref: '§2.3',
        blocks: [
          { kind: 'p', text: '**Où changer :**' },
          {
            kind: 'list',
            items: [
              '**Tehl Town** — maison du côté ouest / sud-ouest du Pokémon Center. Nécessite d’avoir terminé la mission **Seasonal Research (#053)** ; elle n’est pas difficile mais demande d’avoir progressé **au moins jusqu’à la Route 12**. 1er changement gratuit, puis **50 000 $ par changement, illimité**.',
              '**Battle Frontier** — stand en haut à gauche, **50 BP**. ⚠️ **Remet le bonheur du Pokémon à 0** (à surveiller si tu utilises *Return*).',
            ],
          },
          {
            kind: 'quote',
            tone: 'tip',
            text: 'Si tu ne dois faire **qu’une seule** chose sur un Pokémon, fais celle-ci : c’est un clic, 50 000 $, et l’effet (±10 % sur deux stats) est immédiat et énorme.',
          },
          {
            kind: 'quote',
            tone: 'tip',
            text: '**Arbitrage économique :** 50 000 $ se farment en quelques minutes à Dresco. 50 BP demandent plusieurs runs de Frontier. **Passe systématiquement par Tehl Town** pour les natures et garde tes BP pour les Choice items.',
          },
        ],
      },
      {
        id: 'talents',
        title: 'Talents',
        ref: '§2.4',
        blocks: [
          {
            kind: 'list',
            items: [
              '**Ability Capsule** — alterne entre **talent 1 et talent 2**. Obtenable au **Game Corner de Dehara**. Ne donne **jamais** le talent caché.',
              '**Dream Mist** — donne le **talent caché** d’un Pokémon déjà capturé. Postgame uniquement : raid **Musharna 5/6★** à Tarmigan Town (~50 % de drop ; accès via la sortie est du Tarmigan Mansion + interrupteur secret) ; un exemplaire offert par le scientifique devant le Research Center.',
              '**Dream Ball** — le Pokémon capturé obtient son talent caché. 3 par jour chez un scientifique du **Dream Research Lab de Tarmigan Town** (après la Ligue). La meilleure méthode pour les légendaires.',
              '**DexNav** — permet de chasser des sauvages qui ont déjà leur talent caché. Obtenu chez la sœur du Prof. Log, Blizzard City (maison au nord-ouest, à l’étage).',
              '**Ability Changer** — PNJ de la Battle Frontier (côté Battle Circus), contre BP.',
            ],
          },
          {
            kind: 'quote',
            tone: 'success',
            text: '**Bonne nouvelle pour ton équipe :** les 5 talents dont tu as besoin sont soit le talent 1 (déjà en place), soit le talent 2 (**Ability Capsule suffit**). Aucune Dream Mist nécessaire. Détail dans les fiches §6.',
          },
        ],
      },
    ],
  },
  {
    id: 'procedure-optimisation',
    title: 'Procédure d’optimisation d’un Pokémon',
    ref: '§3',
    blocks: [
      { kind: 'p', text: 'L’ordre compte : certaines étapes coûtent des BP, d’autres de l’argent, et l’ordre ci-dessous minimise le gaspillage.' },
      {
        kind: 'code',
        text: `1. Définir le rôle dans l'équipe          (gratuit — la seule étape qui compte vraiment)
      ↓
2. Lire ses IV/EV actuels                 (PNJ Frontier ou Seaport, gratuit)
      ↓
3. Purger les EV parasites                (5 BP/stat, Frontier)
      ↓
4. Changer la nature                      (50 000 $, Tehl Town)
      ↓
5. Ré-entraîner les EV                    (Dresco + Power items + Pokérus)
      ↓
6. Monter les IV à 31                     (Bottle Caps, Seaport)
      ↓
7. Ajuster le talent                      (Ability Capsule / Dream Mist)
      ↓
8. Construire le moveset                  (TM + Move Relearner + tuteurs Frontier)
      ↓
9. Équiper l'objet                        (Game Corner ou 32-48 BP au Battle Tower)`,
      },
    ],
    subsections: [
      {
        id: 'principes-moveset',
        title: 'Principes de moveset',
        blocks: [
          {
            kind: 'list',
            ordered: true,
            items: [
              '**STAB** — au moins une attaque du type du Pokémon (+50 % de dégâts).',
              '**Couverture** — toucher super-efficacement ce qui résiste au STAB principal.',
              '**Setup** — Dragon Dance, Nasty Plot, Bulk Up, Shell Smash… pour passer les murs.',
              '**Utilitaire** — Stealth Rock, Taunt, Will-O-Wisp, Toxic, Wish, Roost.',
              '**Priorité** — Shadow Sneak, Extreme Speed, Sucker Punch pour achever plus rapide que soi.',
              '**Synergie** — les faiblesses d’un membre doivent être couvertes par les résistances d’un autre.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'roles-competitifs',
    title: 'Rôles compétitifs',
    ref: '§4',
    blocks: [
      {
        kind: 'table',
        head: ['Rôle', 'Définition', 'Force', 'Faiblesse'],
        rows: [
          ['**Sweeper**', 'Rapide et puissant, balaye après un boost', 'Speed + dégâts', 'Fragile, vulnérable aux priorités et à la Choice Scarf'],
          ['**Wall**', 'Encaisse et use l’adversaire', 'Longévité, contrôle du rythme', 'Dégâts faibles, vulnérable à Taunt'],
          ['**Pivot**', 'Entre, encaisse, repart avec U-turn / Volt Switch', 'Maintient le momentum', 'Sensible aux pièges d’entrée'],
          ['**Wallbreaker**', 'Puissance brute dès l’entrée', 'Dégâts immédiats', 'Souvent lent, a besoin de pivots'],
          ['**Cleaner**', 'Ultra-rapide, achève en fin de partie', 'Dépasse tout le méta', 'Inefficace face à une équipe intacte'],
          ['**Revenge Killer**', 'Entre après un KO pour punir', 'Réponse immédiate', 'Dépend de la Choice Scarf ou d’une priorité'],
          ['**Lead**', 'Ouvre : hazards, Taunt, climat', 'Impose le tempo', 'Sacrifiable'],
        ],
      },
    ],
    subsections: [
      {
        id: 'archetypes',
        title: 'Archétypes',
        blocks: [
          {
            kind: 'code',
            text: `[Hyper Offense]   Hazards/Screens → Sweeper setup → Cleaner
[Balance]         Wall physique + Wall spécial ↔ Pivot ↔ Wallbreaker
[Bulky Offense]   HP élevés + stats offensives ; encaisse et réplique
[Sand]            Tyranitar (Sand Stream) + Excadrill (Sand Rush) + murs Rock/Ground/Steel`,
          },
        ],
      },
    ],
  },
  {
    id: 'battle-frontier',
    title: 'Battle Frontier',
    ref: '§10',
    blocks: [],
    subsections: [
      {
        id: 'battle-frontier-fonctionnement',
        title: 'Fonctionnement',
        ref: '§10.1',
        blocks: [
          { kind: 'p', text: 'Zone postgame accessible par la **barrière au nord de Seaport City**, une fois Champion. Parle au guide pour obtenir la **Frontier Card**. Quatre bâtiments : **Battle Tower**, **Battle Circus**, **Battle Sands**, **Battle Mine**, chacun avec ses règles et son Frontier Brain (Palmer, Paula, Pablo, Patroz). Monnaie : les **BP**.' },
          {
            kind: 'quote',
            tone: 'warning',
            text: '**Les règles varient selon le bâtiment et le format.** Certains tiers interdisent les espèces en double, d’autres autorisent les objets en double, d’autres bannissent des talents (Moody, Chlorophyll, Early Bird…) ou des capacités (Baton Pass, Sticky Web, Dragon Rage). **Lis les règles du format avant de dépenser des BP en objets.**',
          },
        ],
      },
      {
        id: 'battle-frontier-equipe-depart',
        title: 'Équipe de départ recommandée',
        ref: '§10.2',
        blocks: [
          {
            kind: 'code',
            text: `[Lead : Zeraora]
- 143 de Speed : dépasse la quasi-totalité des leads
- Quick Attack en ouverture, Volt Switch pour garder le momentum

[Cœur : Togekiss]
- Absorbe les attaques Ground destinées à Zeraora et Tyranitar (immunité Flying)
- Thunder Wave + Air Slash = 70 % de chance que l'adversaire ne joue pas

[Finisseur : Tyranitar]
- Frappe brute contre les murs
- Sable = +50 % SpD pour lui-même`,
          },
        ],
      },
      {
        id: 'battle-frontier-farm-bp',
        title: 'Farm rapide de BP',
        ref: '§10.3',
        blocks: [
          {
            kind: 'list',
            items: [
              'Privilégier les Pokémon rapides à forte puissance brute : Zeraora Life Orb, Tyranitar Choice Band, Togekiss para-flinch. Objectif = raccourcir les combats.',
              'Le **Battle Tower en Singles** est le format le plus lisible pour débuter.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'formules',
    title: 'Formules et outils',
    ref: '§13.0',
    blocks: [
      { kind: 'p', text: '**Formule de stat (hors HP), pour comprendre ce que tu achètes :**' },
      {
        kind: 'code',
        text: `Stat = Stat de base × 2 × (Niveau / 100) + 5 + IV + (EV / 4)
       puis × 1,1 ou × 0,9 selon la Nature`,
      },
      { kind: 'p', text: 'Ce que ça implique concrètement :' },
      {
        kind: 'table',
        head: ['Levier', 'Gain au niveau 100', 'Gain au niveau 50 (Battle Frontier)'],
        rows: [
          ['**31 IV** sur une stat', '+31 points', '+15 points'],
          ['**252 EV** sur une stat', '+63 points', '+31 points'],
          ['**Nature favorable**', '+10 % du total (souvent +20 à +35)', 'idem, proportionnel'],
        ],
      },
      {
        kind: 'quote',
        tone: 'info',
        text: '🔍 **Lecture importante pour la Frontier.** Tout y est ramené au **niveau 50**. Les IV et EV y valent donc **environ moitié moins en points bruts** — mais les stats globales sont elles aussi divisées par deux, donc **le poids relatif est identique**. Ne fais pas l’erreur de croire que l’optimisation compte moins au niveau 50 : c’est exactement l’inverse, puisque tu ne peux plus compenser par le niveau.',
      },
    ],
  },
] satisfies ReferenceSection[]

/** §13.0 — Outils à garder ouverts. */
export const tools: Tool[] = [
  {
    name: 'Yda Dex',
    url: 'ydarissep.github.io/Unbound-Pokedex/',
    usage: 'Le Pokédex de référence — **inclut les modifications spécifiques à Unbound**. À utiliser en priorité sur Bulbapedia.',
  },
  {
    name: 'RomHackDex',
    url: 'romhackdex.net/unbound/',
    usage: 'Learnsets Unbound (TM / tuteurs / niveau) + Team Builder',
  },
  {
    name: 'Unbound Wiki',
    url: 'unboundwiki.com',
    usage: 'Localisations, PNJ, missions, objets',
  },
  {
    name: 'Smogon',
    url: 'smogon.com/dex/sm/pokemon/<nom>/',
    usage: 'Sets compétitifs de référence, à **adapter** (Unbound n’est pas le méta Smogon)',
  },
  {
    name: 'Bulbapedia',
    url: 'bulbapedia.bulbagarden.net',
    usage: 'Rendement d’EV par espèce vaincue',
  },
] satisfies Tool[]
