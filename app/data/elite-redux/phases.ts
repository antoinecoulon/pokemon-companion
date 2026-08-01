import type { Phase } from '../types'

/**
 * Les quatre phases d'un run Elite Redux, en **mode Elite avec level caps
 * Elite** — les deux réglages les plus stricts.
 *
 * La structure ne décalque pas celle d'Unbound, et c'est délibéré : Elite Redux
 * est un jeu de construction d'équipe articulé sur les 8 badges de Hoenn, pas
 * un post-game de collection. D'où quatre phases ordonnées là où Unbound n'en a
 * plus qu'une.
 *
 * Ce qui est *ordonné et actionnable* vit ici ; ce qui est *collection* vit dans
 * `completion.ts`. Les deux axes ne se mélangent jamais.
 *
 * Les ids `phase-1.x` à `phase-4.x` ne sont pas en conflit avec ceux, retirés,
 * d'Unbound : chaque jeu a sa propre clé de sauvegarde et les deux ne se
 * croisent jamais. Voir `app/data/games.ts`.
 *
 * Source des faits : `docs/elite-redux/`, adossé au code ouvert du jeu.
 */
export const phases: Phase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Débuter',
    subtitle: 'De l’écran d’intro au Knuckle Badge — le palier où les innates se débloquent.',
    intro: [
      {
        kind: 'p',
        text: 'Elite Redux n’est pas un difficulty hack de plus : chaque Pokémon porte **jusqu’à 4 talents à la fois** (1 à 3 abilities switchables + 3 innates), et tout le grind est remplacé par des menus. Ce qui suit met en place les réflexes qui rendent le reste jouable.',
      },
    ],
    tasks: [
      {
        id: 'phase-1.1',
        label: 'Patcher une ROM **Pokémon Emerald** avec le **patcher officiel** <https://elite-redux.com/>.',
        details: [
          'Ne pas passer par les sites de téléchargement tiers : ce sont des fermes SEO, pas le projet.',
          'Noter la version installée — c’est ce qui permettra de savoir si un écart avec cette app est une erreur de contenu ou un changement de version.',
        ],
        key: true,
        done: false,
      },
      {
        id: 'phase-1.2',
        label: 'À l’écran d’intro : **difficulté `Elite`** et **level caps `Elite`**. Ce sont **deux réglages distincts**.',
        details: [
          'La difficulté se **baisse** à n’importe quel Poké Center, mais la remonter marque le Hall of Fame — commencer haut est réversible, commencer bas ne l’est pas.',
          'Level caps Elite, par badge : **16** avant le premier, puis 23 · 36 · 45 · 50 · 55 · 60 · 70 · 80.',
          'Randomizers sur off, auto-run sur on, shiny rate au goût.',
        ],
        requires: ['phase-1.1'],
        link: '/reference#difficulte-level-caps',
        key: true,
        done: false,
      },
      {
        id: 'phase-1.3',
        label: 'Choisir son starter : le jeu demande d’abord une **région** ou un **type**, pour **72 options** au total.',
        details: [
          '9 trios régionaux de Kanto à Paldea, plus 15 trios monotype pour un run thématique.',
          'Aucun mauvais choix : toutes les lignes ont été retravaillées, et ce sont toutes des lignes à trois stades.',
          'La liste des 72, par région et par type, est dans la référence.',
        ],
        requires: ['phase-1.2'],
        link: '/reference#starters',
        done: false,
      },
      {
        id: 'phase-1.4',
        label: 'À Littleroot : parler au **PNJ en uniforme bleu**, à l’**Ace Trainer** près de la maison, et récupérer l’**Old Rod** et le **Coin Case** auprès de maman.',
        details: [
          'L’Ace Trainer donne les items des Primal Forms : `Tera Orb`, `Eternamax Orb`, `Ultra Necrozmite`, `Crowned Sword`, `Crowned Shield`. Inutiles maintenant, à ne pas rater.',
          'L’Old Rod sert tout de suite : il ouvre des encounters inaccessibles autrement dès la Route 102.',
          '⚠️ L’emplacement exact des deux PNJ reste à confirmer en jeu.',
        ],
        requires: ['phase-1.3'],
        done: false,
      },
      {
        id: 'phase-1.5',
        label: 'Au premier Poké Center, **parler à Nurse Joy** — l’étape à ne pas rater.',
        details: [
          'Elle donne d’un coup : **DexNav+**, **Infinite Repel**, tous les **Battle Items**, **toutes les Poké Balls** (100 % de capture, jamais consommées), **toutes les Berries**, **tous les Type Gems**, et les `Lustrous Orb` / `Adamant Orb` / `Griseous Orb`.',
          'Tout est **rechargé à chaque conversation** : reprendre le réflexe à chaque passage.',
          'Seules les Mega Stones ne sont jamais données par Nurse Joy.',
        ],
        requires: ['phase-1.4'],
        key: true,
        link: '/reference#economie',
        done: false,
      },
      {
        id: 'phase-1.6',
        label: 'Prendre les réflexes de préparation : **EVs, nature et ability se règlent dans l’écran de résumé**, le niveau se monte à la **Candy Box**.',
        details: [
          'EVs : 252 max par stat, 510 au total — en général 252 dans les deux meilleures. Les HP valent souvent mieux qu’une défense.',
          'IVs à 31 partout par défaut. L’`Iron Pill` met la Spe à 0 pour du Trick Room, et la remet à 31.',
          'Les capacités hors niveau s’apprennent depuis le menu Party ou Moves (touche `R`), sans tuteur.',
          'En combat, `L` ouvre l’aide, et l’efficacité affichée **tient compte des innates adverses** : s’y fier plutôt qu’à la table des types mémorisée.',
        ],
        requires: ['phase-1.5'],
        key: true,
        link: '/reference#zero-grind',
        done: false,
      },
      {
        id: 'phase-1.7',
        label: 'Battre **Calvin sur la Route 102** : il donne un **second starter**, tiré au hasard.',
        details: [
          'Les espèces sauvages de chaque zone traversée sont dans la référence, section « Où trouver quoi » — chercher le lieu, ou l’espèce qu’on veut recruter.',
        ],
        requires: ['phase-1.6'],
        link: '/reference',
        done: false,
      },
      {
        id: 'phase-1.8',
        label: 'Traverser **Petalburg Woods** — trois combats obligatoires, dont un **Aqua Grunt**.',
        details: [
          'La forêt est découpée en trois zones aux niveaux distincts (6-8, 12-14, 13-15).',
          '⚠️ Contenu exact des combats à vérifier en jeu.',
        ],
        requires: ['phase-1.7'],
        link: '/reference',
        done: false,
      },
      {
        id: 'phase-1.9',
        label: 'Battre **Roxanne** à Rustboro → **Stone Badge**. Le cap passe de 16 à 23.',
        details: [
          'En Elite, son équipe est **remplacée**, pas renforcée : c’est une équipe **Sand**, avec deux `Sand Stream`, beaucoup d’`Eviolite`, deux `Body Press` et un `Focus Sash`.',
          'La tempête grignote tout ce qui n’est pas Rock/Ground/Steel et booste la SpD des Rock de 50 % : un sweeper spécial souffrira.',
          '`Body Press` utilise la Def comme attaque — baisser leur Atk ne sert à rien.',
          'Battre Roxanne débloque de nouveaux Pokémon à l’**Adoption Center**.',
        ],
        requires: ['phase-1.8'],
        key: true,
        link: '/reference#roxanne',
        done: false,
      },
      {
        id: 'phase-1.10',
        label: 'Sur la route de Dewford : ramasser les Mega Stones accessibles (Route 116, Granite Cave B2F).',
        details: [
          'Route 116, à l’extérieur du Rusturf Tunnel : battre l’**Ace Trainer** pour M.Nidoking et M.Nidoqueen.',
          'Granite Cave B2F : battre le **Black Belt** pour les Mega Stones des **trois Hitmon**.',
          'Rusturf Tunnel et Granite Cave valent le détour pour leurs encounters : Larvitar, Drilbur, Noibat, Riolu, Axew, Abra. Voir la référence.',
        ],
        requires: ['phase-1.9'],
        link: '/reference',
        done: false,
      },
      {
        id: 'phase-1.11',
        label: 'Battre **Brawly** à Dewford → **Knuckle Badge**. Le cap passe de 23 à 36.',
        details: [
          '**Ce n’est pas un gym mono-Fighting** en Elite : un Noivern Flying/Dragon et un Bisharp Dark/Steel punissent un contre Fighting seul.',
          '`Defiant` sur le Bisharp : ne pas baisser ses stats, `Intimidate` compris.',
          'Beaucoup de coups-de-poing boostés et de priorité (`Bullet Punch`, `Fake Out`) : un sweeper à 1 PV ne survit pas.',
        ],
        requires: ['phase-1.10'],
        key: true,
        link: '/reference#brawly',
        done: false,
      },
      {
        id: 'phase-1.12',
        label: 'Les **innates commencent à se débloquer** : repasser sur chaque membre de l’équipe et **revoir tous les builds**.',
        details: [
          'Une ability choisie au premier badge peut être devenue redondante avec un innate fraîchement débloqué.',
          'C’est la vraie borne de fin du début de partie : avant, l’équipe joue amputée.',
        ],
        requires: ['phase-1.11'],
        key: true,
        link: '/equipe',
        done: false,
      },
    ],
  },

  {
    id: 'phase-2',
    number: 2,
    title: 'Construire une équipe',
    subtitle: 'Le cœur du jeu : 4 talents simultanés, EVs et natures libres, zéro grind.',
    intro: [
      {
        kind: 'p',
        text: 'Elite Redux se joue en teambuilding. L’essentiel du travail vit dans les **fiches Pokémon** — ces tâches-ci ne sont que le fil conducteur.',
      },
    ],
    tasks: [
      {
        id: 'phase-2.1',
        label: 'Arrêter une composition de six membres et l’enregistrer dans /equipe.',
        link: '/equipe',
        done: false,
      },
      {
        id: 'phase-2.2',
        label: 'Pour chaque membre : poser les **EVs** (252/252/4) et la **nature** dans l’écran de résumé.',
        requires: ['phase-2.1'],
        link: '/equipe',
        done: false,
      },
      {
        id: 'phase-2.3',
        label: 'Pour chaque membre : choisir l’**ability** parmi les 3, et **lire les 3 innates** — ce sont eux qui décident du build.',
        details: [
          'Les innates sont passifs, liés à l’espèce, et actifs **en plus** de l’ability choisie.',
          'Toutes les descriptions d’abilities ont été réécrites : les relire même quand le nom est familier.',
        ],
        requires: ['phase-2.1'],
        link: '/equipe',
        done: false,
      },
      {
        id: 'phase-2.4',
        label: 'Pour chaque membre : valider les **4 capacités** (STAB, couverture, utilitaire) et l’**objet tenu**.',
        requires: ['phase-2.3'],
        link: '/equipe',
        done: false,
      },
    ],
  },

  {
    id: 'phase-3',
    number: 3,
    title: 'Compléter le jeu',
    subtitle: 'Du Dynamo Badge au titre de Champion. Les deux premiers badges sont en phase 1.',
    tasks: [
      {
        id: 'phase-3.1',
        label: '**Wattson** → **Dynamo Badge**. Cap : 36 → 45.',
        details: ['Sa quête donne la Mega Stone de **Lanturn**.'],
        done: false,
      },
      {
        id: 'phase-3.2',
        label: '**Flannery** → **Heat Badge**. Cap : 45 → 50.',
        details: ['La battre ouvre l’accès aux **autres starters** partout en Hoenn.'],
        requires: ['phase-3.1'],
        done: false,
      },
      {
        id: 'phase-3.3',
        label: '**Norman** → **Balance Badge**. Cap : 50 → 55.',
        details: [
          'Lui parler débloque le **Permanent Mega Mode** : forme Mega depuis le menu Party, conservée après combat, plusieurs Megas par équipe, et une Mega peut tenir un autre objet.',
          'Il donne les Mega Stones vanilla, les Primal Orbs et celles de la plupart des starters.',
          'L’**Adoption Center** vend alors la plupart des nouvelles Mega Stones.',
        ],
        requires: ['phase-3.2'],
        key: true,
        done: false,
      },
      {
        id: 'phase-3.4',
        label: '**Winona** → **Feather Badge**. Cap : 55 → 60.',
        details: [
          'Elle donne la Mega Stone de **Toucannon**.',
          'Une fois Winona battue, Norman donne celle de **Slaking**.',
        ],
        requires: ['phase-3.3'],
        done: false,
      },
      {
        id: 'phase-3.5',
        label: '**Tate & Liza** → **Mind Badge**. Cap : 60 → 70.',
        details: ['Ils donnent la Mega Stone de **Slowking**.'],
        requires: ['phase-3.4'],
        done: false,
      },
      {
        id: 'phase-3.6',
        label: '**Juan** → **Rain Badge**. Cap : 70 → 80.',
        requires: ['phase-3.5'],
        done: false,
      },
      {
        id: 'phase-3.7',
        label: 'Battre l’**Elite Four** : Sidney, Phoebe, Glacia, Drake.',
        details: ['Le Portable PC est désactivé face à la Ligue : l’équipe se fige à l’entrée.'],
        requires: ['phase-3.6'],
        done: false,
      },
      {
        id: 'phase-3.8',
        label: 'Battre **Wallace** → **Champion**. Plus de level cap.',
        requires: ['phase-3.7'],
        key: true,
        done: false,
      },
    ],
  },

  {
    id: 'phase-4',
    number: 4,
    title: 'Post-game',
    subtitle: 'Ce qui s’ouvre après le titre, et qui garde un ordre.',
    intro: [
      {
        kind: 'p',
        text: 'La partie *collection* du post-game — Mega Stones, Redux Forms, Pokédex — vit dans la complétion, plus bas : elle n’a ni ordre ni dépendances. Ne restent ici que les étapes qui en ont une.',
      },
    ],
    tasks: [
      {
        id: 'phase-4.1',
        label: 'Accéder à la **Battle Frontier** et en faire le tour.',
        details: ['⚠️ Conditions d’accès à confirmer en jeu.'],
        done: false,
      },
      {
        id: 'phase-4.2',
        label: 'Finir les **combats de totem** et les adversaires coriaces qui gardent une Mega Stone.',
        details: ['Plusieurs demandent Surf ou une zone ouverte tardivement — voir la complétion.'],
        link: '/completion',
        done: false,
      },
      {
        id: 'phase-4.3',
        label: 'Compléter le **Pokédex** — Gen 1 à 9, formes régionales comprises.',
        details: ['1910 entrées d’espèces au total dans les données du jeu, formes et Megas comprises.'],
        requires: ['phase-4.1'],
        done: false,
      },
    ],
  },
]
