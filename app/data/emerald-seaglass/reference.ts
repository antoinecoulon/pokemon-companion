import type { GlossaryEntry, ReferenceSection, Tool } from '../types'

/**
 * Référence Emerald Seaglass — ce que ce hack change, et qu'aucun réflexe
 * d'Emerald vanilla ne couvre.
 *
 * Transcrit depuis `docs/emerald-seaglass/`, lui-même tiré de la documentation
 * officielle de l'auteur. Pas de `ref` sur les sections : ce jeu n'a pas de
 * guide numéroté, contrairement à Unbound.
 *
 * ⚠️ Les `id` de section sont des **ancres** : des tâches de phase pointent
 * dessus via `link: '/reference#<id>'`, et `pnpm validate` échoue si une ancre
 * n'existe pas. Ne pas les renommer sans corriger les liens.
 *
 * Ce fichier ne fournit ni `encounters` ni `abilities` : ce jeu n'a pas de code
 * source public, donc rien à générer. Les tables de rencontre vivent dans le
 * Pokédex du jeu, qui a justement été refait pour les afficher.
 */
export const mechanics: ReferenceSection[] = [
  {
    id: 'soft-level-caps',
    title: 'Soft level caps et Hard Mode',
    blocks: [
      {
        kind: 'p',
        text: 'La seule vraie contrainte de progression du jeu, et elle est **souple**. L’`EXP. Share` étant devenu party-wide, l’auteur a ajouté un plafond pour compenser — mais il ne bloque rien.',
      },
      {
        kind: 'list',
        items: [
          'Le plafond est le **niveau maximum du Gym Leader en cours**.',
          'Au-delà, l’EXP gagnée est **divisée par deux** sur les quelques niveaux suivants, puis **réduite davantage**.',
          'Rien n’empêche de continuer à monter : ce n’est pas un mur, c’est un frein.',
          'Le **Hard Mode** retire les caps. Il se règle avec le **livre sur le bureau** de la chambre du joueur, qui donne accès à d’autres options.',
        ],
      },
      {
        kind: 'quote',
        tone: 'warning',
        text: '**Les valeurs par badge ne sont pas documentées.** L’auteur décrit le mécanisme, jamais les chiffres. À relever en jeu, badge par badge — c’est le principal trou de la référence.',
      },
      {
        kind: 'quote',
        tone: 'info',
        text: 'L’auteur insiste : « This is *NOT* a "difficulty hack" ». Ces réglages coupent le grind, ils ne cherchent pas à durcir le jeu.',
      },
    ],
  },

  {
    id: 'dexnav',
    title: 'DexNav',
    blocks: [
      {
        kind: 'p',
        text: 'Porté depuis ORAS, et **installé automatiquement** : après avoir reçu le Pokédex de Professor Birch, la mère du joueur le rattrape à la sortie de Littleroot pour l’ajouter. Il vit dans le menu Start.',
      },
      {
        kind: 'list',
        items: [
          'Affiche **combien d’espèces** vivent dans la zone, et permet de **cibler** celles déjà vues.',
          'Environ **tous les 200 pas**, il détecte tout seul un Pokémon à proximité.',
          'Une fois sur deux, c’est un **Hidden Pokémon** — introuvable autrement. **Aucune espèce n’y est exclusive** : c’est de la variété, pas du contenu verrouillé.',
          'Chaîner une espèce augmente les chances de shiny, donne accès à des **egg moves rares** et **améliore les IV**.',
        ],
      },
      {
        kind: 'quote',
        tone: 'tip',
        text: 'Le code `JUSTSHOWME` affiche tout le DexNav et autorise à chasser une espèce jamais rencontrée. À réserver si l’on assume de court-circuiter la découverte.',
      },
    ],
  },

  {
    id: 'shinies',
    title: 'Shinies et les deux Shiny Charm',
    blocks: [
      {
        kind: 'p',
        text: 'Taux de base **1/4096**, et **deux** `Shiny Charm` cumulables — c’est la particularité, ailleurs il n’y en a jamais qu’un.',
      },
      {
        kind: 'list',
        items: [
          'Le **premier** est dans le **PC du joueur, dès le début de la partie**. Il donne 5 relances supplémentaires.',
          'Le **second** est à **Fortree City** : interagir avec **tous les shrines d’est en ouest, dans l’ordre**. Il apparaît alors dans le dernier shrine, à gauche du Pokémon Center. Un vieil homme dans une des maisons donne l’indice.',
          'Les relances **se cumulent** : avoir les deux **double** le nombre de tirages.',
          'Chaîner au DexNav s’ajoute encore par-dessus.',
        ],
      },
    ],
  },

  {
    id: 'minigames',
    title: 'Les minigames',
    blocks: [
      {
        kind: 'p',
        text: 'Quatre ajouts, et deux d’entre eux sont la **seule** voie vers certains Pokémon et objets. Ce ne sont pas des à-côtés facultatifs.',
      },
    ],
    subsections: [
      {
        id: 'scuba-safari',
        title: 'Scuba Safari — Pacifidlog Town',
        blocks: [
          {
            kind: 'p',
            text: 'Un croisement entre la Safari Zone et le Bug Catching Contest de Johto, en zone sous-marine dédiée. On y parle au **Sailor de la plateforme est** de Pacifidlog. **Le HM Dive n’est pas requis.**',
          },
          {
            kind: 'list',
            ordered: true,
            items: [
              '**200 « pas »** de nage avant la fin de la partie.',
              '**5 rencontres** au maximum ; passé la cinquième, la partie s’arrête.',
              'Le score juge la **rareté**, le **niveau**, les **IV** et les **HP restants** — donc affaiblir sans trop entamer.',
              'Chaque zone et chaque touffe de seagrass a **sa propre table** de rencontres.',
            ],
          },
          {
            kind: 'code',
            text: 'Score = Rareté + (Niveau × 3) + (somme des 6 IV) + HP restants\n\nExemple : rareté 100, niveau 5, 31 partout, 25 HP restants\n         100 + 15 + (31 × 6) + 25 = 326',
          },
          {
            kind: 'list',
            items: [
              '**Première partie** : le `HM07 Waterfall`. C’est ce qui rend ce minigame incontournable.',
              'Ensuite : un lot aléatoire de trésors (shards, nuggets, pearls), d’objets d’évolution et d’autres bricoles.',
              '**Nouveau record** : 5 `Heart Scale` et une TM tirée d’un lot de bonnes capacités (`Flamethrower`, `Dragon Claw`, `Thunderbolt`…).',
            ],
          },
          {
            kind: 'quote',
            tone: 'info',
            text: 'Pacifidlog s’ouvre **très tôt**, sans Surf : un PNJ accompagné d’un Kirlia, près du Pokémon Center de **Slateport**, y emmène le joueur une fois la **Team Aqua battue au Museum**.',
          },
        ],
      },
      {
        id: 'pinball',
        title: 'Pinball — Mauville et Mossdeep',
        blocks: [
          {
            kind: 'p',
            text: 'Quatre flippers aux styles différents — **SEEL**, **GENGAR**, **MEOWTH** et **DIGLETT** — présents dans les deux Game Corners. Chaque partie gagnée rapporte **1 Pinball Point**.',
          },
          {
            kind: 'list',
            items: [
              '**Mauville** : Poké Balls apricorn et autres balls rares, et des **œufs de formes Alola tirées au hasard**.',
              '**Mossdeep** : objets rares — et on peut y **acheter des Points contre de l’argent**, ce qui rend l’argent utile bien au-delà du vanilla.',
            ],
          },
          {
            kind: 'quote',
            tone: 'info',
            text: 'La physique du flipper est imparfaite, et l’auteur l’assume : « tbh I think that adds to the charm ».',
          },
        ],
      },
      {
        id: 'wishing-well',
        title: 'Wishing Well — Rustboro City',
        blocks: [
          {
            kind: 'p',
            text: 'Un vieux puits sur le **flanc est de Rustboro**. Y jeter un `Wishing Star` fait apparaître un Pokémon au hasard — un Wonder Trade, ou une gacha. Avec de la chance, une espèce rare très tôt dans la partie.',
          },
          {
            kind: 'list',
            items: [
              'Un `Wishing Star` est **au sol près du puits**.',
              'Une **petite fille de Rustboro** et un **Hiker de Granite Cave** en donnent.',
              'Un PNJ du **Mt. Chimney** en vend, une fois la Team Aqua/Magma chassée — sur le modèle de la vendeuse de Lava Cookies.',
              'Quelques autres sont éparpillés dans la région, surtout dans la **moitié ouest** de Hoenn.',
            ],
          },
          {
            kind: 'quote',
            tone: 'tip',
            text: 'Garder un `Wishing Star` de côté : il en faut un **en sac** pour déclencher Jirachi au White Rock de Mossdeep.',
          },
        ],
      },
      {
        id: 'contests',
        title: 'Contests — déplacés à Verdanturf',
        blocks: [
          {
            kind: 'list',
            items: [
              'Le **Contest Hall** est passé de Lilycove à **Verdanturf Town**, pour qu’on y accède beaucoup plus tôt.',
              'En échange, le **Battle Tent** de Verdanturf est parti à **Lilycove**.',
              'Un PNJ du Contest Hall de Verdanturf **remet à zéro le Sheen** d’un Pokémon — ce qui débloque le gavage de berries.',
              '140 de Beauty en concours reste une voie d’évolution pour Feebas, à côté de la `Prism Scale`.',
            ],
          },
          {
            kind: 'quote',
            tone: 'warning',
            text: 'Le **Battle Tent est désactivé** dans cette version : les Pokémon loués deviennent des **BAD EGG**. Un PNJ bloque l’entrée du bâtiment en attendant un correctif.',
          },
        ],
      },
    ],
  },

  {
    id: 'marchands',
    title: 'Marchands et objets à ne pas rater',
    blocks: [
      {
        kind: 'p',
        text: 'Ce hack met en boutique une quantité de choses qui, dans Emerald, demandaient du farm ou n’existaient pas. C’est le vrai changement de confort.',
      },
      {
        kind: 'table',
        head: ['Où', 'Quoi'],
        rows: [
          ['**Happy Trainer Merchant Stand**, Petalburg', '`Ability Capsule`, `EXP Candy`, `Stat Feather`, objets `Choice`, `Vitamin`. **Stock limité au début, élargi à chaque badge.**'],
          ['**Pretty Petal**, Route 104 (sud de Rustboro)', '`Nature Mint`'],
          ['Marché de **Slateport City**', '`Water Stone`, `Thunder Stone`, `Fire Stone`, `Sun Stone`, `Moon Stone`'],
          ['Herb Shop de **Lavaridge Town**', '`Leaf Stone`, `Ice Stone`, `Dawn Stone`, `Dusk Stone`, `Shiny Stone`'],
          ['Stand de **Sootopolis City**, au nord du Pokémon Center', '**Tous** les objets d’évolution — le filet de sécurité de fin de partie'],
          ['Vendeur de pommes, **Pacifidlog Town**', '`Tart Apple`, `Sweet Apple`, `Candy Apple` (lignée Applin)'],
        ],
      },
      {
        kind: 'p',
        text: 'Objets d’évolution posés sur la carte, hors des emplacements vanilla :',
      },
      {
        kind: 'list',
        items: [
          '`King’s Rock` — Route 106, juste au-dessus de l’entrée de Granite Cave',
          '`Dragon Scale` — Route 118',
          '`Upgrade` — Weather Institute, Route 119',
          '`Razor Fang` et `Black Augurite` — Route 119',
          '`Razor Claw` — Route 121',
          '`Prism Scale` — Route 127',
          '`Metal Coat` — Rusturf Tunnel et Abandoned Ship',
          '`Dubious Disc` — Team Aqua Hideout',
          '`Peat Block` — péninsule sud de Lilycove',
        ],
      },
      {
        kind: 'quote',
        tone: 'info',
        text: 'Un objet qui n’est pas listé ici est probablement à son emplacement habituel d’Emerald. Le `Pokémon Box Link` s’obtient auprès d’un Scientist du Pokémon Center de **Slateport**, **après avoir battu Wattson**.',
      },
    ],
  },

  {
    id: 'legendaires',
    title: 'Comment les légendaires se débloquent',
    blocks: [
      {
        kind: 'p',
        text: 'Les 3 premières générations de légendaires sont **toutes** accessibles, et pour la plupart **avant le Elite Four**. C’est le seul contenu narratif que ce hack ajoute vraiment, et il tient à un PNJ.',
      },
      {
        kind: 'list',
        items: [
          '**Kyogre**, **Groudon**, **Rayquaza** et le **trio Regi** s’obtiennent par les voies habituelles d’Emerald.',
          '**Jirachi** : parler à la femme à côté du White Rock de Mossdeep, puis interagir avec le **White Rock** en ayant un `Wishing Star` **en sac**.',
          'Tout le reste passe par le **Sailor de Mossdeep** — reconnaissable à son **bandeau sur l’œil** et à ses vêtements différents, sur la colline près du grand télescope.',
        ],
      },
      {
        kind: 'quote',
        tone: 'tip',
        text: 'La mécanique est là : le Sailor **demande de lui montrer une entrée de Pokédex** pour débloquer chaque ticket. Il faut donc avoir *rencontré* l’espèce demandée — Rhydon, puis Octillery, puis Rayquaza. La liste complète des étapes est dans la page Progression.',
      },
      {
        kind: 'p',
        text: 'Battre le **Mossdeep Gym** ouvre la chaîne : le Sailor donne l’`Eon Ticket`, ce qui débloque aussi le **SS Tidal** et la suite de ses quêtes. Une fois ses trois premières quêtes faites, il annonce partir « exploring for more legendaries » et quatre nouvelles rencontres s’ouvrent.',
      },
      {
        kind: 'quote',
        tone: 'info',
        text: 'Les deux trios tirés au hasard — Raikou/Entei/Suicune et Articuno/Zapdos/Moltres — **se réinitialisent en battant à nouveau le Elite Four**. Rater le tirage n’est donc jamais définitif.',
      },
    ],
  },

  {
    id: 'qol',
    title: 'Confort de jeu',
    blocks: [
      {
        kind: 'list',
        items: [
          '**`EXP. Share` party-wide**, donné par **Scott à Petalburg**, juste après le tutoriel de capture de Wally.',
          '**Refonte du système HM** : si la HM est dans le sac et le badge obtenu, tout Pokémon capable de l’apprendre l’utilise — **sans occuper un emplacement de capacité**. Plus de Pokémon-outil.',
          '**Efficacité des types affichée en combat**, et les types du Pokémon adverse avec.',
          'Touche **`L`** en combat : plus d’informations sur les capacités.',
          'Touche **`R`** : bascule l’auto-run.',
          'Touche **`A`** dans l’écran de résumé : affiche IV et EV.',
          '**Pokédex refait** sur le modèle de HGSS, en style GBC : méthodes d’évolution et movesets inclus. C’est la source à consulter en jeu plutôt que ses souvenirs — presque toutes les espèces ont changé.',
          '**`Pokémon Box Link`** : accès au PC de n’importe où.',
          '**Following Pokémon** dans l’overworld, et une horloge dans le menu Start.',
          '**Z-Power Ring et Z-Crystals** à la DEVON Corporation, après avoir livré la lettre de Steven. **Entièrement optionnels et à l’écart** : qui n’aime pas les Z-Moves peut ne jamais aller les chercher.',
        ],
      },
    ],
  },

  {
    id: 'cheat-codes',
    title: 'Mystery Gifts et cheat codes',
    blocks: [
      {
        kind: 'p',
        text: 'Des codes **prévus par l’auteur**, saisis en interagissant avec la **GameCube de la chambre du joueur**. Ils existent pour les styles de jeu qui veulent éviter le grind — les utiliser est un choix, pas une triche subie.',
      },
      {
        kind: 'table',
        head: ['Code', 'Effet'],
        rows: [
          ['`9RARECANDY`', '99 `Rare Candy`, à chaque saisie'],
          ['`MASTERBALL`', '99 `Master Ball`, à chaque saisie'],
          ['`WISHINGSTR`', '99 `Wishing Star` pour le Wishing Well'],
          ['`ILOVEKANTO` · `ILOVEJOHTO` · `ILOVEHOENN`', 'Les starters de la région, niveau 5'],
          ['`ILOVSPHEAL`', 'Spheal niveau 5, stats défensives optimisées — `Bouncy Bubble`, `Super Fang`, `Slack Off`, `Freeze Dry`. Starter alternatif'],
          ['`ILOVEAIPOM`', 'Aipom niveau 5 avec `Eviolite` — `Dizzy Punch`, `Karate Chop`, `Victory Dance`, `Bullet Punch`. L’auteur le dit lui-même très fort'],
          ['`ILOVEAPPLE`', 'Applin niveau 5 avec un `Syrupy Apple`'],
          ['`ILOVETINKA`', 'Tinkatink niveau 5 avec un `Nugget`'],
          ['`JUSTSHOWME`', 'Affiche tout le DexNav et autorise à chasser une espèce jamais rencontrée'],
        ],
      },
    ],
  },

  {
    id: 'known-issues',
    title: 'Bugs connus',
    blocks: [
      {
        kind: 'p',
        text: 'Recensés par l’auteur. Les rencontrer n’est pas un signe de mauvais patch.',
      },
      {
        kind: 'list',
        items: [
          '**Battle Tent désactivé** : les Pokémon loués deviennent des **BAD EGG**. Un PNJ bloque l’entrée. C’est le seul problème majeur.',
          '**Scintillement graphique après chaque tour** de combat — **semi-intentionnel** : réinitialiser les graphismes évite des freezes et des animations cassées.',
          'Les bâtiments de la **Battle Frontier** utilisent encore les tiles d’Emerald vanilla, qui jurent avec le reste.',
          'Le nombre de PP s’affiche en jaune à l’apprentissage d’une capacité.',
          'Physique du flipper imparfaite.',
        ],
      },
    ],
  },
]

/*
 * ⚠️ `url` est un domaine **nu** : la page de référence rend `https://${url}`.
 * Y remettre le schéma donnerait `https://https://…` et un lien mort.
 */
export const tools: Tool[] = [
  {
    name: 'Patch officiel — Ko-fi de Nemo622',
    url: 'ko-fi.com/s/aabf18551d',
    usage: 'La **seule** source légitime du patch et de la documentation, celle que la doc désigne elle-même. Page générale : `ko-fi.com/nemo622`. Fournir une ROM Emerald propre.',
  },
  {
    name: 'Documentation officielle (mirror PDF)',
    url: 'www.pokeharbor.com/wp-content/uploads/2024/08/Pokemon-Emerald-Seaglass-Documentation.pdf',
    usage: 'Le PDF de l’auteur, 8 pages : les 421 entrées de dex avec types et localisations, objets d’évolution, quête des légendaires, minigames, codes, bugs connus. **C’est un mirror** — l’original est sur Ko-fi, illisible hors navigateur. Le mirror a été confirmé fidèle.',
  },
  {
    name: 'Guide fan (non officiel)',
    url: 'github.com/jimineybillybob1/PokemonEmeraldSeaglassGuide',
    usage: '⚠️ **Non officiel**, et rien n’y est vérifié. Page unique auto-contenue, données en tableaux JS — pratique à consulter, mais sur un désaccord c’est la doc de l’auteur qui tranche.',
  },
  {
    name: 'Sites à ne pas utiliser',
    url: 'pokemonemeraldseaglass.com',
    usage: '`pokemonemeraldseaglass.com` s’annonce « Official Game Download » **sans lien vers l’auteur** — non confirmé comme étant son site. Avec `gbacodes.com`, `pokeharbor.com`, `pokehacks.net`, `pokepatched.com`, `ducumon.click`, `visualboyadvance.org`, `pokemon-roms.net`, `gigachadgamers.com` : fermes de contenu SEO qui recopient la doc et **réhébergent le patch**. Ne jamais y télécharger. `romhackdex.net` ne couvre pas ce jeu.',
  },
  {
    name: 'Le Pokédex du jeu lui-même',
    url: 'ko-fi.com/nemo622',
    usage: 'Pas un site : l’écran de jeu. Refait sur le modèle de HGSS, il donne types, méthodes d’évolution et movesets **à jour des changements du hack**. C’est la première référence à consulter — presque toutes les espèces ont été retouchées, et un dex externe induit en erreur.',
  },
]

export const glossary: GlossaryEntry[] = [
  {
    term: 'Soft level cap',
    definition: 'Le niveau max du Gym Leader en cours. Le dépasser ne bloque rien : l’EXP est divisée par deux, puis réduite davantage. Le Hard Mode les retire.',
  },
  {
    term: 'Hard Mode',
    definition: 'Option qui désactive les soft level caps. Se règle avec le livre sur le bureau de la chambre du joueur, qui donne aussi accès à d’autres réglages.',
  },
  {
    term: 'Hidden Pokémon',
    definition: 'Espèce détectée par le DexNav et trouvable uniquement par lui — une détection sur deux. Aucune espèce n’y est exclusive : c’est de la variété, pas du contenu verrouillé.',
  },
  {
    term: 'Wishing Star',
    definition: 'Objet à jeter dans le Wishing Well de Rustboro pour tirer un Pokémon au hasard. Il en faut aussi un en sac pour déclencher Jirachi au White Rock de Mossdeep.',
  },
  {
    term: 'Pinball Point',
    definition: 'Un par partie de flipper gagnée. Monnaie des deux Game Corners : balls rares et œufs de formes Alola à Mauville, objets rares à Mossdeep.',
  },
  {
    term: 'Scuba Safari',
    definition: 'Minigame sous-marin de Pacifidlog Town, mélange de Safari Zone et de Bug Catching Contest. 200 pas, 5 rencontres. La première partie donne le HM07 Waterfall.',
  },
  {
    term: 'Mossdeep Sailor',
    definition: 'Le PNJ au bandeau sur l’œil, sur la colline près du grand télescope de Mossdeep. Porte toute la quête des légendaires, en échange d’entrées de Pokédex.',
  },
  {
    term: 'Sheen',
    definition: 'Le compteur qui limite le gavage de berries pour les concours. Un PNJ du Contest Hall de Verdanturf le remet à zéro — impossible dans Emerald vanilla.',
  },
  {
    term: 'BAD EGG',
    definition: 'Œuf corrompu, symptôme du bug qui a fait désactiver le Battle Tent. Le bâtiment est bloqué par un PNJ pour l’éviter.',
  },
]
