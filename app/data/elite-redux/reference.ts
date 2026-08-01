import type { GlossaryEntry, ReferenceSection, Tool } from '../types'

/**
 * La référence Elite Redux — ce qu'on veut pouvoir relire **sur le téléphone,
 * en jouant**.
 *
 * Transcrit depuis `docs/elite-redux/01-la-rom.md` et `02-bien-debuter.md`, qui
 * restent l'archive de la démarche et le détail des sources. L'app en est la
 * version consultable ; en cas d'écart, c'est le markdown qui a été relu en
 * dernier et fait foi jusqu'à vérification en jeu.
 *
 * Pas de `ref` sur les sections : il n'y a pas de guide numéroté ici,
 * contrairement à Unbound. La numérotation des sections du markdown est un
 * détail d'archive, pas un repère que le joueur reconnaîtrait.
 *
 * Toute donnée vient du code ouvert du jeu (`eliteredux-source`, `er-config`).
 * Ce qui n'a pas pu y être lu porte « ⚠️ à vérifier en jeu » et ne se devine
 * pas — voir `docs/elite-redux/03-sources.md` pour la liste des points ouverts.
 */
export const mechanics: ReferenceSection[] = [
  {
    id: 'quatre-talents',
    title: 'Le système à quatre talents',
    blocks: [
      {
        kind: 'p',
        text: 'C’est la mécanique qui distingue Elite Redux de tous les autres hacks. Chaque Pokémon dispose de **1 à 3 abilities switchables** — la plupart des espèces en proposent 3, au choix dans l’écran de résumé, une seule active à la fois — **et de 3 innates**, des talents passifs liés à l’espèce, toujours actifs, **en plus** de l’ability choisie.',
      },
      {
        kind: 'p',
        text: 'Un Pokémon peut donc avoir **jusqu’à 4 talents actifs simultanément**. L’exemple donné par l’auteur : un Gyarados avec `Moxie` et `Aerilate` en même temps.',
      },
      {
        kind: 'quote',
        tone: 'warning',
        text: 'En mode Elite, la plupart des innates sont **verrouillés au départ**. Ils se débloquent en battant les Gym Leaders. C’est pour ça que le 2e badge est une vraie borne : avant, l’équipe joue amputée ; après, il faut repasser sur tous ses builds.',
      },
      {
        kind: 'p',
        text: 'Le jeu compte **plus de 370 abilities**, dont 110+ inédites et une cinquantaine de retouchées. La liste complète et cherchable est plus bas sur cette page — s’y référer plutôt qu’à sa mémoire, puisque toutes les descriptions ont été réécrites.',
      },
      {
        kind: 'table',
        caption: 'Quelques retouches qui changent des réflexes',
        head: ['Ability', 'Comportement dans Elite Redux'],
        rows: [
          ['`Stall`', '30 % de dégâts en moins si le Pokémon n’a pas encore agi'],
          ['`Battle Armor` / `Shell Armor`', '20 % de dégâts en moins **et** bloque les coups critiques'],
          ['`Big Pecks`', 'devient un clone de `Tough Claws`'],
          ['`Storm Drain` / `Lightning Rod`', 'boostent la **meilleure** stat offensive à l’activation'],
          ['`Frisk`', 'désactive l’objet adverse pendant 2 tours'],
        ],
      },
      {
        kind: 'p',
        text: 'Quelques créations, pour donner le ton : `Chloroplast` (les capacités agissent comme sous le soleil), `Phantom Pain` (les capacités Ghost touchent les Normal), `Fungal Infection` (les capacités contact infligent Leech Seed), `Fort Knox` (bloque les talents offensifs adverses).',
      },
    ],
  },

  {
    id: 'difficulte-level-caps',
    title: 'Difficulté et level caps — deux réglages distincts',
    blocks: [
      {
        kind: 'quote',
        tone: 'warning',
        text: 'C’est le point que les sites tiers mélangent systématiquement. Ce sont **deux options séparées** à l’écran d’intro, et elles ne se recouvrent pas.',
      },
      {
        kind: 'list',
        items: [
          '**Easy** — les dresseurs n’ont pas d’EVs. Les équipes restent construites.',
          '**Ace** — mêmes équipes qu’Easy, mais **tous les dresseurs ont des EVs** ; sleep clause active.',
          '**Elite** — équipes **remplacées** pour les combats importants (Gym Leaders, Pokémon League), sleep clause active, et **innates verrouillés** jusqu’à déblocage.',
        ],
      },
      {
        kind: 'p',
        text: 'La difficulté se **baisse** à n’importe quel Poké Center. La **remonter** est possible mais marque le Hall of Fame d’une icône. Autrement dit : commencer haut est réversible, commencer bas ne l’est pas vraiment.',
      },
      {
        kind: 'table',
        caption: 'Niveau maximum autorisé avant d’obtenir chaque badge — valeurs en dur dans `src/pokemon.c`',
        head: ['Badge obtenu', 'Easy', 'More', 'Elite'],
        rows: [
          ['*(aucun)*', '20', '18', '**16**'],
          ['Stone Badge', '28', '25', '**23**'],
          ['Knuckle Badge', '44', '40', '**36**'],
          ['Dynamo Badge', '55', '50', '**45**'],
          ['Heat Badge', '65', '55', '**50**'],
          ['Balance Badge', '80', '70', '**55**'],
          ['Feather Badge', '90', '85', '**60**'],
          ['Mind Badge', '—', '92', '**70**'],
          ['Rain Badge', '—', '95', '**80**'],
          ['Champion', '—', '—', '—'],
        ],
      },
      {
        kind: 'p',
        text: 'Un « — » signifie plus de plafond. En Easy le cap saute après le Feather Badge, en More après le Rain Badge ; en Elite il tient jusqu’au bout du parcours des badges. Les dresseurs adverses **scalent** avec la progression : impossible de compenser par le niveau, seul le build compte.',
      },
      {
        kind: 'quote',
        tone: 'tip',
        text: 'Le cap affiché avant Roxanne doit être **16**. C’est le test le plus rapide pour vérifier que la version installée correspond bien à ce que dit cette référence.',
      },
    ],
  },

  {
    id: 'zero-grind',
    title: 'Zéro grind — tout passe par des menus',
    blocks: [
      {
        kind: 'p',
        text: 'Toute la préparation d’équipe se fait dans des écrans, pas en heures de farm. C’est le fil rouge du design : l’auteur vise des joueurs qui veulent **battler et construire des équipes**.',
      },
      {
        kind: 'list',
        items: [
          '**EVs éditables** dans l’écran de résumé. 252 max par stat, 510 au total. La règle usuelle : 252 dans les deux meilleures stats. Les `HP` valent souvent mieux qu’une défense, sauf si les `HP` de base sont déjà très hauts et les défenses très basses.',
          '**Nature éditable** dans l’écran de résumé (+10 % sur une stat, −10 % sur une autre).',
          '**Ability éditable** dans l’écran de résumé, parmi les 3 proposées.',
          '**IVs à 31 partout par défaut.** L’`Iron Pill` met la `Spe` à 0 (équipes Trick Room) et la remet à 31.',
          '**Candy Box** : Rare Candies illimitées, mécanique Gen 8 — on peut évoluer au level cap. On monte de 4 niveaux d’un coup, ou directement jusqu’au cap.',
          '**Apprentissage des capacités** depuis le menu Party ou Moves (touche `R`), sans Move Tutor. Seule la liste *Level* reste conditionnée au niveau ; en caps Elite, de nouvelles capacités se débloquent **après chaque gym**, jusqu’aux deux tiers du jeu environ.',
          '**Évolutions rendues niveau-based.** Plus d’échange, plus de bonheur. L’écran de résumé indique si un Pokémon peut évoluer et à quel niveau, et affiche ses Mega Evolutions possibles même sans la pierre. On évolue depuis le menu Party, en choisissant la branche.',
          '**Type Gems** : changent le type de `Hidden Power` **et** de `Secret Power` (sa version physique).',
          '**Toutes les capacités sont à PP Max.**',
        ],
      },
    ],
  },

  {
    id: 'confort-combat',
    title: 'Confort de jeu et interface de combat',
    blocks: [
      {
        kind: 'list',
        items: [
          '**Portable PC** depuis le menu Start — désactivé face au Pokémon League, donc l’équipe se fige à l’entrée de la Ligue.',
          '**Aucun HM à enseigner.** On vole vers n’importe quel lieu visité avec n’importe quel Pokémon ; les autres HMs se débloquent au fil des gyms.',
          '**Soin automatique avant la plupart des combats.** Quelques combats sont des gauntlets sans soin.',
          '**Les objets tenus se régénèrent après combat** — plus de Focus Sash ni de baie à remettre.',
          '**Poké Balls : 100 % de capture, en quantité infinie, non consommées.** N’importe quelle ball.',
          '**DexNav+** : recherche automatiquement les Pokémon d’une zone, sans déclencher de rencontre. **Infinite Repel** pour l’inverse.',
          'Plusieurs objets enregistrables sur la touche `L`. Auto-run, baies à pousse instantanée, œufs en 4 cycles, soin sans dialogue. Taux de shiny montable jusqu’à **1/5** dans les options.',
        ],
      },
      {
        kind: 'quote',
        tone: 'tip',
        text: 'En combat, l’**efficacité d’une capacité est affichée avant de l’utiliser**, et elle tient compte des abilities et innates adverses (`Levitate`, `Sap Sipper`…). S’y fier plutôt qu’à la table des types mémorisée : c’est le seul moyen fiable de jouer contre 4 talents inconnus.',
      },
      {
        kind: 'list',
        items: [
          '**Battle Style toujours « Set »** — pas de switch gratuit après un KO.',
          'Le **STAB** est signalé par une icône `+` (bonus de 50 %, comme d’habitude).',
          '`L` en combat ouvre l’aide intégrée (raccourci modifiable dans Settings > Custom).',
          'Un combat de dresseur peut être **abandonné** : cela compte comme une défaite et renvoie au dernier Poké Center.',
        ],
      },
    ],
  },

  {
    id: 'economie',
    title: 'Économie — Nurse Joy et les Adoption Centers',
    blocks: [
      {
        kind: 'quote',
        tone: 'success',
        text: '**Parler à Nurse Joy est l’étape la plus importante du début de partie.** Elle donne d’un coup le DexNav+, l’Infinite Repel, tous les Battle Items, toutes les Poké Balls, toutes les Berries, tous les Type Gems, et les `Lustrous Orb` / `Adamant Orb` / `Griseous Orb`. Tout est **rechargé à chaque conversation** : reprendre le réflexe à chaque passage.',
      },
      {
        kind: 'p',
        text: 'Seules les **Mega Stones** ne sont jamais données par Nurse Joy.',
      },
      {
        kind: 'p',
        text: '**Les Poké Marts sont remplacés par des Adoption Centers.** On y dépense les **BP** gagnés en combattant des dresseurs — c’est la seule monnaie qui compte vraiment, l’argent n’ayant presque plus d’usage. On y achète des **Pokémon Redux**, des variantes retravaillées indisponibles autrement, dont le catalogue s’étoffe à chaque progression ; et, **après Norman**, la plupart des nouvelles Mega Stones.',
      },
    ],
  },

  {
    id: 'statuts-meteo',
    title: 'Statuts et météo',
    blocks: [
      {
        kind: 'table',
        caption: 'Quatre statuts inédits',
        head: ['Statut', 'Effet'],
        rows: [
          ['**Bleed**', 'Statut non volatil. 1/16 des PV max par tour, **empêche les soins** et **annule les boosts de stats**. Rock et Ghost immunisés. Une capacité de soin guérit le Bleed mais ne soigne pas ce tour-là. Vient surtout des capacités boostées par `Keen Edge`.'],
          ['**Fear**', 'Piège la cible 2 tours ; elle subit **50 % de dégâts en plus**. Infligé par `Scary Face`, `Terror Charge`, `Worry Seed`.'],
          ['**Frostbite**', '**Remplace Freeze.** 1/16 des PV par tour aux non-Ice, et **divise par deux les dégâts spéciaux** du porteur.'],
          ['**Enraged**', 'Subit 33 % des dégâts infligés en recul. Cumulable avec d’autres reculs.'],
        ],
      },
      {
        kind: 'p',
        text: '`Burn`, `Paralysis`, `Poison` et `Sleep` sont inchangés. **Infatuation** en revanche est modifiée : la cible inflige **50 % de dégâts en moins**, physiques comme spéciaux, et ce **indépendamment du genre**.',
      },
      {
        kind: 'p',
        text: 'Les météos durent **8 tours**, 12 avec la roche correspondante. Les abilities de météo (`Drought`, `Drizzle`…) donnent à nouveau une météo **infinie**.',
      },
      {
        kind: 'list',
        items: [
          '**Hail/Snow** — `Def` des Ice +50 %, 1/16 aux autres, `Blizzard` ignore la précision.',
          '**Sandstorm** — 1/16 hors Rock/Ground/Steel, `SpD` des Rock +50 %.',
          '**Rain** — capacités Water +50 %, Fire −50 %, `Thunder` et `Hurricane` toujours précis.',
          '**Sunlight** — Fire +50 %, Water −50 %, `Solar Beam`/`Solar Blade` en un tour, `Growth` donne +2 en `Atk` et `SpA`.',
          '**Harsh Sunlight** / **Heavy Rain** — annulent respectivement Water et Fire.',
          '**Strong Winds** — ramène à neutre les dégâts super efficaces contre les Flying.',
        ],
      },
      {
        kind: 'p',
        text: '**Eerie Fog**, la météo inédite : draine d’un cran par tour les stats positives des non-Ghost et non-Psychic, divise par deux les soins météo (`Synthesis`), réduit de 20 % les dégâts subis par les Ghost et Psychic, fait échouer `Revival Blessing` et `Harvest`, rend tous les `Curse` de type Ghost, et transforme `Weather Ball` en Ghost à puissance doublée. La **Smoke Ball** la prolonge à 12 tours.',
      },
    ],
  },

  {
    id: 'pokemon-capacites-objets',
    title: 'Pokémon, capacités, objets',
    blocks: [
      {
        kind: 'list',
        items: [
          '**Toutes les espèces de la Gen 1 à la Gen 9**, formes régionales comprises (Alolan, Galarian, Hisuian, Paldean).',
          '**60+ Redux Forms** — des refontes avec évolutions inédites, achetables à l’Adoption Center.',
          '**40+ Mega Evolutions nouvelles**, sprites et cris compris (Milotic, Flygon…). Certaines proposent un choix entre 3 abilities.',
          '**5 nouvelles Primal Forms**, dont les items sont donnés par un Ace Trainer à côté de la maison de départ : `Tera Orb` (Stellar Terapagos), `Eternamax Orb`, `Ultra Necrozmite`, `Crowned Sword` (Zacian), `Crowned Shield` (Zamazenta).',
          '**100 TMs, 8 HMs, ~130 capacités de tuteur.**',
          'Les capacités **OHKO** (`Fissure`…) infligent désormais **~120 de dégâts avec 80 % de précision** au lieu du KO direct. Ce n’est plus un KO, mais ça reste très lourd en début de partie.',
          'Objets retouchés : `Big Root`, `Shell Bell` renforcés.',
          '**La table des types n’a pas été touchée.**',
        ],
      },
      {
        kind: 'quote',
        tone: 'info',
        text: '**Permanent Mega Mode**, débloqué en parlant à Norman : on passe en forme Mega depuis le menu Party, hors combat. Il faut toujours la bonne Mega Stone dans le sac, mais le Pokémon **reste Mega après les combats**, on peut en aligner **plusieurs dans une équipe**, et **une Mega peut tenir un autre objet**.',
      },
      {
        kind: 'p',
        text: 'Quelques refontes d’espèces citées par l’auteur, pour donner le ton : Gyarados devient **Water/Dragon avec `Levitate`** ; `Colour Change` de Kecleon s’active **avant** d’être touché, ce qui le rend immunisé ou résistant à l’attaque entrante ; toutes les évolutions d’Eevee peuvent **redevenir Eevee** et partagent un movepool commun ; Gliscor a `Poison Heal` ; Pyukumuku passe à 600 BST.',
      },
    ],
  },

  {
    id: 'debut-de-partie',
    title: 'Début de partie — réglages, gyms, starters',
    blocks: [
      {
        kind: 'p',
        text: 'Le détail ordonné des premières heures vit dans la **phase 1** de la progression. Ce qui suit, ce sont les tables qu’on veut pouvoir rouvrir sans la dérouler.',
      },
    ],
    subsections: [
      {
        id: 'ecran-intro',
        title: 'L’écran d’intro',
        blocks: [
          {
            kind: 'list',
            items: [
              '**Difficulté → `Elite`**, **level caps → `Elite`.** Deux réglages distincts.',
              '**Randomizers → off** (encounters, abilities, innates, moves), sauf envie contraire.',
              '**Auto-run → on.** **Shiny rate** au goût, jusqu’à 1/5.',
              'Vérifier le **mode d’affichage des EVs** et des dégâts.',
            ],
          },
          {
            kind: 'quote',
            tone: 'warning',
            text: 'Le premier dresseur peut déjà faire mal en Elite — l’auteur le dit lui-même. Ce n’est pas une difficulté qui monte doucement.',
          },
        ],
      },
      {
        id: 'roxanne',
        title: 'Roxanne — Stone Badge',
        blocks: [
          {
            kind: 'quote',
            tone: 'warning',
            text: '⚠️ **Donnée indicative, à corriger après le combat.** Les deux dépôts officiels du projet donnent des équipes **entièrement différentes** pour ce combat. Ce qui suit est le palier `elite` du dépôt de configuration. Aucun niveau n’est inscrit dans les données : ils sont attribués dynamiquement, vraisemblablement en fonction du cap.',
          },
          {
            kind: 'table',
            head: ['Pokémon', 'Objet', 'Ability', 'Nature', 'Capacités'],
            rows: [
              ['Sandygast', 'Eviolite', '`Sand Stream`', 'Bold', 'Absorb, Scorching Sands, Shore Up, Hex'],
              ['Lairon-Redux', 'Eviolite', '`Shell Armor`', 'Adamant', 'Stone Edge, Leech Seed, Wave Crash, Peck'],
              ['Sudowoodo', 'Leftovers', '`Water Compaction`', 'Adamant', 'Body Press, Trailblaze, Stone Edge, Seed Bomb'],
              ['Gligar', 'Eviolite', '`Sand Veil`', 'Adamant', 'Tectonic Fangs, Dual Wingbeat, Swords Dance, Roost'],
              ['Onix', 'Eviolite', '`Sand Stream`', 'Impish', 'Body Press, Stone Edge, Fissure, Dragon Tail'],
              ['Cacturne', 'Focus Sash', '`Sand Rush`', 'Jolly', 'Needle Arm, Sucker Punch, Knock Off, Drain Punch'],
            ],
          },
          {
            kind: 'list',
            items: [
              '**C’est une équipe Sand.** Deux `Sand Stream` et un `Sand Rush` : la tempête est quasi certaine. Elle grignote tout ce qui n’est pas Rock/Ground/Steel et booste la `SpD` des Rock de 50 % — un sweeper spécial souffrira.',
              '**Beaucoup d’`Eviolite`** : les non-évolués encaissent bien plus que leur apparence ne le suggère. Prévoir de la puissance, pas du chip damage.',
              '**`Body Press` deux fois** : la `Def` adverse sert d’attaque, baisser leur `Atk` ne sert à rien.',
              '**`Focus Sash` sur le Cacturne** : il survivra au premier coup, et il a lui-même `Sucker Punch`.',
              'La difficulté ne se compense pas par le niveau — le cap est à 16 et l’adversaire scale.',
            ],
          },
        ],
      },
      {
        id: 'brawly',
        title: 'Brawly — Knuckle Badge',
        blocks: [
          {
            kind: 'quote',
            tone: 'warning',
            text: '⚠️ Même réserve que pour Roxanne — palier `elite` du dépôt de configuration, à confirmer en jeu.',
          },
          {
            kind: 'table',
            head: ['Pokémon', 'Objet', 'Ability', 'Nature', 'Capacités'],
            rows: [
              ['Noivern-Redux', 'Focus Sash', '`Hyper Aggressive`', 'Jolly', 'Dual Wingbeat, Spirit Shackle, Jagged Fangs, Earthquake'],
              ['Bisharp-Redux', 'Bright Powder', '`Defiant`', 'Jolly', 'Fury Cutter, Sacred Sword, Excalibur, Seismic Blade'],
              ['Lucario', 'Punching Glove', '`Magical Fists`', 'Timid', 'Meteor Mash, Drain Punch, Bullet Punch, Thunder Punch'],
              ['Duelumber', 'Tactical Vest', '`Raging Boxer`', 'Adamant', 'Jagged Punch, Seed Bomb, Drain Punch, Thunder Punch'],
              ['Flamigo', 'Frost Orb', '`Quick Feet`', 'Jolly', 'Whirling Strikes, Triple Dive, Fake Out, Triple Kick'],
              ['Hitmonchan', 'Shell Bell', '`Blitz Boxer`', 'Adamant', 'Drain Punch, Ice Punch, Meteor Mash, Thunder Punch'],
            ],
          },
          {
            kind: 'list',
            items: [
              '**Ce n’est pas un gym mono-Fighting.** Un Noivern Flying/Dragon et un Bisharp Dark/Steel : un contre Fighting seul se fera punir. Prévoir de la couverture.',
              '**Beaucoup de coups-de-poing boostés** (`Punching Glove`, `Blitz Boxer`, `Raging Boxer`) : les abilities qui punissent le contact perdent leur intérêt face à la `Punching Glove`, qui annule le contact.',
              '**`Defiant` sur Bisharp** — ne pas baisser ses stats, `Intimidate` compris. C’est un piège classique, et il se déclenche tout seul.',
              '**`Bright Powder`** ajoute de l’esquive : ne pas compter sur une capacité peu précise.',
              '**`Drain Punch` partout** — les combats d’usure tournent en sa faveur.',
              '**Beaucoup de priorité** (`Bullet Punch`, `Fake Out`) : un sweeper à 1 PV ne survit pas.',
            ],
          },
        ],
      },
      {
        id: 'starters',
        title: 'Les 72 starters',
        blocks: [
          {
            kind: 'p',
            text: 'Le jeu demande d’abord un **groupe** — une région ou un type — puis propose ses trois lignes. Aucun mauvais choix : toutes ont été retravaillées, et ce sont toutes des **lignes à trois stades**, choisies pour tenir sur une partie entière. Un second starter est offert par Calvin sur la Route 102 ; les autres n’ouvrent qu’après Flannery.',
          },
          {
            kind: 'table',
            caption: 'Par région',
            head: ['Région', 'Grass', 'Fire', 'Water'],
            rows: [
              ['Kanto', 'Bulbasaur', 'Charmander', 'Squirtle'],
              ['Johto', 'Chikorita', 'Cyndaquil', 'Totodile'],
              ['Hoenn', 'Treecko', 'Torchic', 'Mudkip'],
              ['Sinnoh', 'Turtwig', 'Chimchar', 'Piplup'],
              ['Unova', 'Snivy', 'Tepig', 'Oshawott'],
              ['Kalos', 'Chespin', 'Fennekin', 'Froakie'],
              ['Alola', 'Rowlet', 'Litten', 'Popplio'],
              ['Galar', 'Grookey', 'Scorbunny', 'Sobble'],
              ['Paldea', 'Sprigatito', 'Fuecoco', 'Quaxly'],
            ],
          },
          {
            kind: 'table',
            caption: 'Par type — pour un run monotype ou thématique',
            head: ['Type', 'Options'],
            rows: [
              ['Bug', 'Blipbug, Trapinch, Venipede'],
              ['Dark', 'Impidimp, Zigzagoon-Galarian, Pawniard'],
              ['Dragon', 'Bagon, Frigibax, Jangmo-o'],
              ['Electric', 'Pawmi, Shinx, Geodude-Alolan'],
              ['Fairy', 'Togepi, Ralts, Tinkatink'],
              ['Fighting', 'Machop, Timburr, Mankey'],
              ['Flying', 'Hoppip, Zubat, Hoothoot'],
              ['Ghost', 'Gastly, Litwick, Phantump'],
              ['Ground', 'Rhyhorn, Gible, Sandile'],
              ['Ice', 'Smoochum, Spheal, Swinub'],
              ['Normal', 'Porygon, Igglybuff, Whismur'],
              ['Poison', 'Nidoran♀, Spinarak, Oddish'],
              ['Psychic', 'Mime Jr., Hatenna, Beldum'],
              ['Rock', 'Rolycoly, Larvitar, Bonsly'],
              ['Steel', 'Klink, Magnemite, Aron'],
            ],
          },
        ],
      },
    ],
  },
]

export const glossary: GlossaryEntry[] = [
  { term: 'Ability', definition: 'Le talent **switchable**, choisi parmi 1 à 3 dans l’écran de résumé. Un seul actif à la fois. À ne pas confondre avec les innates.' },
  { term: 'Innate', definition: 'Talent **passif lié à l’espèce**, actif *en plus* de l’ability. Chaque Pokémon en a 3. En mode Elite ils sont verrouillés au départ et se débloquent au fil des badges.' },
  { term: 'Adoption Center', definition: 'Remplace les Poké Marts. On y dépense les BP pour des Pokémon Redux, puis — après Norman — pour la plupart des Mega Stones.' },
  { term: 'BP', definition: 'Battle Points, gagnés en combattant des dresseurs. Seule monnaie de l’Adoption Center, et de fait la seule qui compte.' },
  { term: 'Redux Form', definition: 'Variante retravaillée d’une espèce, avec parfois des évolutions inédites. Indisponible ailleurs qu’à l’Adoption Center, à quelques exceptions près.' },
  { term: 'Primal Form', definition: 'Cinq formes inédites déclenchées par un item ramassé très tôt (`Tera Orb`, `Eternamax Orb`, `Ultra Necrozmite`, `Crowned Sword`, `Crowned Shield`).' },
  { term: 'Permanent Mega Mode', definition: 'Débloqué en parlant à Norman : la forme Mega se déclenche hors combat depuis le menu Party, persiste après les combats, se cumule dans une équipe, et laisse tenir un autre objet.' },
  { term: 'Level cap', definition: 'Niveau maximum autorisé avant le prochain badge. Réglage **distinct** de la difficulté. En caps Elite : 16 avant le premier badge, puis 23 · 36 · 45 · 50 · 55 · 60 · 70 · 80.' },
  { term: 'Candy Box', definition: 'Rare Candies illimitées. Monte de 4 niveaux, ou directement jusqu’au cap. On peut évoluer au cap (mécanique Gen 8).' },
  { term: 'DexNav+', definition: 'Donné par Nurse Joy. Recherche les Pokémon d’une zone sans déclencher de rencontre.' },
  { term: 'Iron Pill', definition: 'Met la `Spe` à 0 pour une équipe Trick Room, et la remet à 31. Les IVs étant à 31 par défaut, c’est le seul objet d’IV du jeu.' },
  { term: 'Type Gem', definition: 'Fixe le type de `Hidden Power` **et** de `Secret Power`, sa version physique. Donné par Nurse Joy, en quantité illimitée.' },
  { term: 'Bleed', definition: 'Statut non volatil : 1/16 des PV par tour, **empêche les soins** et **annule les boosts**. Rock et Ghost immunisés.' },
  { term: 'Fear', definition: 'Piège la cible 2 tours et lui fait subir **50 % de dégâts en plus**.' },
  { term: 'Frostbite', definition: 'Remplace Freeze : 1/16 des PV par tour et **dégâts spéciaux divisés par deux**.' },
  { term: 'Enraged', definition: 'Le porteur subit 33 % des dégâts qu’il inflige, en recul. Cumulable avec d’autres reculs.' },
  { term: 'Eerie Fog', definition: 'Météo inédite : draine les stats positives des non-Ghost/Psychic, halve les soins météo, protège Ghost et Psychic, et rend `Weather Ball` Ghost à puissance doublée.' },
  { term: 'Palier de dresseur', definition: 'Les équipes des combats importants sont déclinées par palier (`ace`, `elite`, `hell`) selon la difficulté choisie. En mode Elite, c’est le palier `elite` qui s’applique.' },
]

export const tools: Tool[] = [
  {
    name: 'Patcher officiel',
    url: 'elite-redux.com',
    usage: '**La seule voie d’installation à utiliser.** Fournir une ROM Emerald, le patcher fait le reste.',
  },
  {
    name: 'Pokédex en ligne',
    url: 'dex.elite-redux.com',
    usage: 'La référence désignée par le jeu : Pokémon, abilities, moves, locations, trainers, et un team builder. **Navigateur seulement** — injoignable en ligne de commande.',
  },
  {
    name: 'Codex des abilities',
    url: 'codex.elite-redux.com',
    usage: 'Le détail des talents. SPA VitePress, donc **navigateur seulement** — c’est la raison pour laquelle la liste des talents est embarquée ci-dessous, consultable hors-ligne.',
  },
  {
    name: 'Page de features',
    url: 'elite-redux.github.io/EliteReduxWiki/',
    usage: 'Page unique signée Darky. Fiable sur l’intention et les grandes lignes du hack.',
  },
  {
    name: 'Code du jeu',
    url: 'github.com/Elite-Redux/eliteredux-source',
    usage: 'Le decomp. **Source de vérité** : level caps (`src/pokemon.c`), encounters, starters, sets recommandés.',
  },
  {
    name: 'Configuration du jeu',
    url: 'github.com/Elite-Redux/er-config',
    usage: 'Protobuf textuel : abilities, moves, objets, dresseurs, articles d’aide. ⚠️ Aucune branche stable — la lecture se fait sur `upcoming`.',
  },
  {
    name: 'Sites à ne pas utiliser',
    url: 'eliteredux.net',
    usage: '`eliteredux.net`, `pokehostel`, `pokeharbor`, `pokepatched`, `pokemoncoders` : fermes de contenu SEO. Elles **mélangent systématiquement difficulté et level caps**, et ne jamais y télécharger le patch. `wiki.elite-redux.com` est hors service.',
  },
]
