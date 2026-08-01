import type { CompletionSection } from '../types'

/**
 * L'axe *collection* d'Elite Redux — sans ordre, sans dépendances, et qui
 * n'entre jamais dans « prochaines actions ».
 *
 * Ce que ce jeu **n'a pas**, vérifié dans son code ouvert et à ne surtout pas
 * décalquer d'Unbound : ni Zygarde Cells, ni Z-Crystals, ni missions
 * numérotées, ni move tutors à cocher, ni raid dens. Un système de quêtes existe
 * bien dans le moteur (`src/quests.c`) mais **n'est pas peuplé** — une seule
 * quête réelle, le reste en entrées de remplissage `"Side Quest Name"`. Ne rien
 * construire dessus.
 *
 * Ce qui reste, et qui fait le 100 % de ce jeu : **287 Mega Stones**, **207
 * formes Redux** achetables en BP, les installations de la Battle Frontier, et
 * le Pokédex.
 *
 * ⚠️ Seules les entrées à **emplacement documenté** sont listées. Les Mega
 * Stones s'achètent en majorité à l'Adoption Center après Norman : les énumérer
 * une par une donnerait 250 cases sans information. Les sections concernées
 * portent un objectif de suivi plutôt qu'une liste.
 */

const HELP = 'https://github.com/Elite-Redux/er-config/blob/upcoming/HelpArticles.textproto'
const WIKI = 'https://elite-redux.github.io/EliteReduxWiki/'

export const completionSections: CompletionSection[] = [
  {
    id: 'mega-stones-fixes',
    title: 'Mega Stones à emplacement fixe',
    description:
      'Celles qui ne s’achètent pas : elles sont posées sur la carte, gardées par un dresseur, ou données par un Gym Leader. Les seules qu’on peut rater. Le reste du catalogue passe par l’Adoption Center après Norman.',
    goals: [
      { id: 'mega-breloom', label: 'M.Breloom', location: 'Nord de Petalburg Woods (zone inédite) — Totem', source: HELP },
      { id: 'mega-nidoking-nidoqueen', label: 'M.Nidoking et M.Nidoqueen', location: 'Route 116, à l’extérieur du Rusturf Tunnel — battre l’Ace Trainer', source: HELP },
      { id: 'mega-hitmon', label: 'Les trois Mega Stones des Hitmon', location: 'Granite Cave B2F — battre le Black Belt', source: HELP },
      { id: 'mega-feraligatr-x', label: 'M.Feraligatr X', location: 'Route 105, sur la plage — battre le Sailor', source: HELP },
      { id: 'mega-lapras-x', label: 'M.Lapras X', location: 'Slateport Museum, à l’étage', source: HELP },
      { id: 'mega-shuckle', label: 'M.Shuckle', location: 'Début de la Cycling Road, au nord de Slateport', source: HELP },
      { id: 'mega-sandslash', label: 'M.Sandslash', location: 'Sud de la Route 111, dans le désert — Totem', source: HELP },
      { id: 'mega-meganium', label: 'M.Meganium', location: 'Verdanturf Meadow — battre l’Aroma Lady', source: HELP },
      { id: 'mega-typhlosion', label: 'M.Typhlosion', location: 'Ashen Woods, en haut à droite — battre le Kindler', source: HELP },
      { id: 'mega-feraligatr-y', label: 'M.Feraligatr Y', location: 'Route 114 — Totem', source: HELP },
      { id: 'mega-krookodile', label: 'M.Krookodile', location: 'Extérieur de la Mirage Tower, zone inédite — battre le Ruin Maniac', source: HELP },
      { id: 'mega-haxorus', label: 'M.Haxorus', location: 'Meteor Falls — un dresseur garde l’ouverture d’une zone inédite', source: HELP },
      { id: 'mega-dewgong', label: 'M.Dewgong', location: 'Seaspray Cave 2F — Totem', source: HELP },
      { id: 'mega-gyarados-y', label: 'M.Gyarados Y', location: 'Route 132 — Totem', source: HELP },
      { id: 'mega-dragonite', label: 'M.Dragonite', location: 'Sky Pillar — venir à bout du gauntlet', source: HELP },
      { id: 'mega-starters-sinnoh', label: 'Mega Stones des starters de Sinnoh', location: 'Game Corner', source: HELP },
      { id: 'mega-lanturn', label: 'M.Lanturn', location: 'Donnée par Wattson, au terme de sa quête', source: HELP },
      { id: 'mega-toucannon', label: 'M.Toucannon', location: 'Donnée par Winona avec son badge', source: HELP },
      { id: 'mega-slowking', label: 'M.Slowking', location: 'Donnée par Tate & Liza avec leur badge', source: HELP },
      { id: 'mega-slaking', label: 'M.Slaking', location: 'Donnée par Norman, une fois Winona battue', source: HELP },
    ],
  },

  {
    id: 'primal-forms',
    title: 'Primal Forms',
    description:
      'Cinq nouvelles Primal Forms, plus les Origin Formes du trio de Sinnoh. Les items se ramassent très tôt — ils ne servent que bien plus tard.',
    goals: [
      { id: 'tera-orb', label: '`Tera Orb` — Stellar Terapagos', location: 'Ace Trainer à côté de la maison de départ', source: HELP },
      { id: 'eternamax-orb', label: '`Eternamax Orb` — Eternamax Eternatus', location: 'Ace Trainer à côté de la maison de départ', source: HELP },
      { id: 'ultra-necrozmite', label: '`Ultra Necrozmite` — Ultra Necrozma', location: 'Ace Trainer à côté de la maison de départ', source: HELP },
      { id: 'crowned-sword', label: '`Crowned Sword` — Zacian Crowned', location: 'Ace Trainer à côté de la maison de départ', source: HELP },
      { id: 'crowned-shield', label: '`Crowned Shield` — Zamazenta Crowned', location: 'Ace Trainer à côté de la maison de départ', source: HELP },
      { id: 'orbes-origin', label: '`Lustrous Orb`, `Adamant Orb`, `Griseous Orb` — Origin Formes de Dialga, Palkia, Giratina (680 → 780 BST)', location: 'Nurse Joy, au premier contact', source: HELP },
      { id: 'primal-cascoon', label: 'Primal Cascoon', location: 'Au fond de Petalburg Woods, au-delà d’un spot de surf', source: HELP },
    ],
  },

  {
    id: 'starters',
    title: 'Les 72 starters',
    description:
      'Un starter au départ, un second offert par Calvin, et le reste après Flannery. 9 trios régionaux et 15 trios monotype.',
    goals: [
      { id: 'starter-initial', label: 'Starter de départ — région ou type au choix', source: HELP },
      { id: 'starter-calvin', label: 'Second starter, tiré au hasard', location: 'Battre Calvin sur la Route 102', source: HELP },
      { id: 'starters-fire', label: 'Starters Fire', location: 'Boutique de Lavaridge, après Flannery', source: HELP },
      { id: 'starters-grass', label: 'Starters Grass', location: 'Flower Shop devant Petalburg Woods, après Flannery', source: HELP },
      { id: 'starters-water', label: 'Starters Water', location: 'Open-Air Market de Slateport, après Flannery', source: HELP },
      { id: 'starters-lilycove', label: 'Tous les starters d’un coup', location: 'Lilycove Department Store, en fin de partie', source: HELP },
    ],
  },

  {
    id: 'adoption-center',
    title: 'Adoption Center',
    description:
      'Les Adoption Centers remplacent les Poké Marts. On y dépense les **BP** gagnés en combattant des dresseurs. Le catalogue s’étoffe à chaque progression — 207 formes Redux et l’essentiel des 287 Mega Stones y passent, trop pour être listés un par un.',
    goals: [
      { id: 'adoption-premiere-visite', label: 'Première visite, et repérage du catalogue de départ', source: HELP },
      { id: 'adoption-post-roxanne', label: 'Repasser après Roxanne — de nouveaux Pokémon s’y débloquent', source: HELP },
      { id: 'adoption-post-norman', label: 'Repasser après Norman — la plupart des nouvelles Mega Stones s’y achètent', source: HELP },
      { id: 'redux-forms', label: 'Collectionner les **formes Redux** (207 espèces `*_REDUX` dans les données du jeu)', source: WIKI, optional: true },
    ],
  },

  {
    id: 'battle-frontier',
    title: 'Battle Frontier',
    description:
      'Les sept installations héritées d’Emerald. ⚠️ Contenu et conditions d’accès à confirmer en jeu — le squelette est là, les détails manquent.',
    goals: [
      { id: 'frontier-tower', label: 'Battle Tower', source: WIKI },
      { id: 'frontier-dome', label: 'Battle Dome', source: WIKI },
      { id: 'frontier-factory', label: 'Battle Factory', source: WIKI },
      { id: 'frontier-arena', label: 'Battle Arena', source: WIKI },
      { id: 'frontier-palace', label: 'Battle Palace', source: WIKI },
      { id: 'frontier-pike', label: 'Battle Pike', source: WIKI },
      { id: 'frontier-pyramid', label: 'Battle Pyramid', source: WIKI },
    ],
  },
]

export const completionGoalKeys = completionSections.flatMap(section =>
  section.goals.map(goal => `goal:${goal.id}`),
)
