import type { KeyItem } from './types'

/**
 * Les 34 Key Items d'Unbound qui ont une fiche détail sur le wiki.
 *
 * **Fichier généré — `pnpm scrape:wiki items`.** Ne pas éditer à la main.
 *
 * L'index (`/items/key-items/`) annonce 40 Key Items au total, mais seuls
 * 34 d'entre eux ont une page dédiée à sourcer : les six autres —
 * Barrier Key, Berry Pouch, Key Cards 1/2/3, N-Lunarizer, N-Solarizer, TM Case
 * — n'ont qu'une ligne de table, sans URL propre. Ils sont hors de ce fichier
 * plutôt que sourcés sur l'index, par cohérence avec la règle « une entrée
 * sans source vérifiable ne s'écrit pas ».
 *
 * Les noms d'objet et lieux sont en VO : ce sont les chaînes que l'écran
 * affiche.
 */
export const keyItems: KeyItem[] = [
  {
    id: 'adm',
    label: '**ADM**',
    location: 'Seaport City – Sold by Captain Davy for 250,000 Pokemon Dollars in the post-game.',
    details: ['A machine that eliminates the need to use most HMs. In addition to letting you use Dive in deep water spots, it’s used to mine underwater and underground.'],
    source: 'https://unboundwiki.com/items/key-items/adm/',
  },
  {
    id: 'baby-monitor',
    label: '**Baby Monitor**',
    location: 'Seaport City – Given as a reward for completing Mission #023: Flaming Body',
    details: ['The Baby Monitor lets you see the current level of all Pokemon left at the Day Care'],
    source: 'https://unboundwiki.com/items/key-items/baby-monitor/',
  },
  {
    id: 'braille-converter',
    label: '**Braille Converter**',
    location: 'Icicle Cave 4F – Given by the Ruin Maniac in front of the stone tablet.',
    details: ['The Braille Converter lets you decipher the text written on the giant stone tablets in every major dungeon.'],
    source: 'https://unboundwiki.com/items/key-items/braille-converter/',
  },
  {
    id: 'catching-charm',
    label: '**Catching Charm**',
    location: 'Frozen Heights – Reward for completing Mission #062: The West Borrius Pokedex.',
    details: ['An item that increases the catch rate of wild Pokemon if it’s in your Cube.'],
    source: 'https://unboundwiki.com/items/key-items/catching-charm/',
  },
  {
    id: 'coin-case',
    label: '**Coin Case**',
    location: 'Dehara City – From the NPC standing outside the Dehara City Game Corner.',
    details: ['The Coin Case holds coins won at the Game Corner.'],
    source: 'https://unboundwiki.com/items/key-items/coin-case/',
  },
  {
    id: 'costume-box',
    label: '**Costume Box**',
    location: 'Your house – Given by Mom at the start of the game',
    details: ['The Costume Box lets you change your character’s outfit and its colors.'],
    source: 'https://unboundwiki.com/items/key-items/costume-box/',
  },
  {
    id: 'devon-scope',
    label: '**Devon Scope**',
    location: 'Route 16 – Reward from Big Mo after clearing the Vivill Warehouse section.',
    details: ['Lets you see invisible Pokemon like Kecleon'],
    source: 'https://unboundwiki.com/items/key-items/devon-scope/',
  },
  {
    id: 'dexnav',
    label: '**DexNav**',
    location: 'Blizzard City – Gift from Professor Log’s sister after catching at least 15 Pokemon.',
    details: ['Lets you search for specific Wild Pokemon by registering them in the DexNav.'],
    source: 'https://unboundwiki.com/items/key-items/dexnav/',
  },
  {
    id: 'dowsing-machine',
    label: '**Dowsing Machine**',
    location: 'Tehl Town – Gift from the researcher southwest of the Tehl Town Pokémon Center if you caught at least 30 Pokémon.',
    details: ['Lets you detect and locate hidden items when in the wild.'],
    source: 'https://unboundwiki.com/items/key-items/dowsing-machine/',
  },
  {
    id: 'frontier-card',
    label: '**Frontier Card**',
    location: 'Battle Frontier – Gift after entering the connector going from Seaport City to the Battle Frontier in the post-game.',
    details: ['The Frontier Card stores all of your Battle Points.'],
    source: 'https://unboundwiki.com/items/key-items/frontier-card/',
  },
  {
    id: 'go-goggles',
    label: '**Go-Goggles**',
    location: 'Dehara City – Gift from the NPC inside the eastern-most house.',
    details: ['These goggles let you enter and traverse the Great Desert to progress in the game.'],
    source: 'https://unboundwiki.com/items/key-items/go-goggles/',
  },
  {
    id: 'good-rod',
    label: '**Good Rod**',
    location: 'Epidimy Town – Gift from the fisherman in the house southwest of the Pokémon Center.',
    details: ['The Good Rod is used to catch Water-type Pokémon from any body of water. The caught Pokémon are usually of a higher level than the Old Rod, but worse than the Super Rod.'],
    source: 'https://unboundwiki.com/items/key-items/good-rod/',
  },
  {
    id: 'gracidea',
    label: '**Gracidea**',
    location: 'Flower Paradise – Gift from the Beauty NPC after showing her Shaymin.',
    details: ['You can use the Gracidea to change Shaymin’s form, though it’s only usable during the day.'],
    source: 'https://unboundwiki.com/items/key-items/gracidea/',
  },
  {
    id: 'grubby-hanky',
    label: '**Grubby Hanky**',
    location: 'Magnolia Cafe – Found in Magnolia Cafe on Saturdays',
    details: ['A handkerchief that’s used to complete Mission #037: Lost Hanky'],
    source: 'https://unboundwiki.com/items/key-items/grubby-hanky/',
  },
  {
    id: 'jade-orb',
    label: '**Jade Orb**',
    location: 'Crystal Peak – Given as a reward for completing Mission #014: Blazing Emeralds',
    details: ['The Jade Orb is used to summon Rayquaza at the top of Crystal Peak'],
    source: 'https://unboundwiki.com/items/key-items/jade-orb/',
  },
  {
    id: 'lunar-wing',
    label: '**Lunar Wing**',
    location: 'Fullmoon Island – Found after defeating or catching Cresselia. Part of Mission #066: The Endless Nightmare',
    details: ['The Lunar Wing lets you free the kid in Tarmigan Town from his nightmare state.'],
    source: 'https://unboundwiki.com/items/key-items/lunar-wing/',
  },
  {
    id: 'magma-stone',
    label: '**Magma Stone**',
    location: 'Seaport City – Given as a reward for completing Mission #039: Master Incubator',
    details: ['The Magma Stone slightly increases the speed of hatching eggs and lets you catch Heatran.'],
    source: 'https://unboundwiki.com/items/key-items/magma-stone/',
  },
  {
    id: 'mega-keystone',
    label: '**Mega Keystone**',
    location: 'Tarmigan Mansion – Given to you after beating Successor Maxima in Tarmigan Town.',
    details: ['A keystone attached to a ring, bracelet, cuff, or charm that allows Pokemon with the correct Mega Stone to Mega Evolve.'],
    source: 'https://unboundwiki.com/items/key-items/mega-keystone/',
  },
  {
    id: 'member-card',
    label: '**Member Card**',
    location: 'Tarmigan Town – Given as a reward for completing Mission #066: The Endless Nightmare',
    details: ['The Members Card works as a key that lets you enter the Tarmigan Town Inn.'],
    source: 'https://unboundwiki.com/items/key-items/member-card/',
  },
  {
    id: 'motorcycle',
    label: '**Motorcycle**',
    location: 'Crater Town – Reward for completing Mission #061: The Black Emboar.',
    details: ['A motorcycle you can equip to quickly travel distances and climb slopes.'],
    source: 'https://unboundwiki.com/items/key-items/motorcycle/',
  },
  {
    id: 'notebook',
    label: '**Notebook**',
    location: 'Dresco Town – Given as a reward for completing Mission #013: Basic Literacy',
    details: ['A notebook you can give to Professor Log’s aide to upgrade the Stat Scanner'],
    source: 'https://unboundwiki.com/items/key-items/notebook/',
  },
  {
    id: 'old-rod',
    label: '**Old Rod**',
    location: 'Route 7 – Gift from the fisherman in the house southeast of the Frost Mountain entrance.',
    details: ['The Old Rod is used to catch Water-type Pokémon from any body of water. The caught Pokémon are usually of the lowest possible quality.'],
    source: 'https://unboundwiki.com/items/key-items/old-rod/',
  },
  {
    id: 'oval-charm',
    label: '**Oval Charm**',
    location: 'Pokemon Day Care – Reward for completing Mission #021: Extreme Hyperosmia',
    details: ['Increases your chances of getting Pokemon eggs from the Day Care after leaving two Pokemon there'],
    source: 'https://unboundwiki.com/items/key-items/oval-charm/',
  },
  {
    id: 'porta-pc',
    label: '**Porta-PC**',
    location: 'Cube Corp. – Reward for completing Mission #008: And Den There Were None',
    details: ['The Porta-PC works as a portable Pokemon Center, letting you heal your Pokemon and change your current party on the go'],
    source: 'https://unboundwiki.com/items/key-items/porta-pc/',
  },
  {
    id: 'prison-bottle',
    label: '**Prison Bottle**',
    location: 'Crystal Peak – Given after rescuing Marlon in Crystal Peak during the main story.',
    details: ['When used, the Prison Bottle lets you change Hoopa from its Confined to Unbound form and vice-versa.'],
    source: 'https://unboundwiki.com/items/key-items/prison-bottle/',
  },
  {
    id: 'reveal-glass',
    label: '**Reveal Glass**',
    location: 'Magnolia Fields – Given by the old lady in the area where the forces of nature Pokémon spawn.',
    details: ['The Reveal Glass is used to change the forms of the three forces of nature legendary Pokemon.'],
    source: 'https://unboundwiki.com/items/key-items/reveal-glass/',
  },
  {
    id: 'shiny-charm',
    label: '**Shiny Charm**',
    location: 'Fallshore City – Given as a reward for completing 65 missions',
    details: ['Increases your chances of encountering shiny Pokemon in the wild.'],
    source: 'https://unboundwiki.com/items/key-items/shiny-charm/',
  },
  {
    id: 'ss-ticket',
    label: '**S.S. Ticket**',
    location: 'Seaport City – Gift from Jax in the southeast boathouse.',
    details: ['Lets you sail from Seaport City to Polder Town. Also enables you to go to Cube Corp. if you’re in the post-game.'],
    source: 'https://unboundwiki.com/items/key-items/ss-ticket/',
  },
  {
    id: 'stat-scanner',
    label: '**Stat Scanner**',
    location: 'Professor Log’s Lab – Given by Professor Log’s assistant after registering 50 caught Pokémon species. Not available in the game’s vanilla difficulty until the post-game.',
    details: ['The Stat Scanner lets you view your Pokémon’s complete stats and movesets. You can also upgrade it to turn it into a portable Move Tutor and EV/IV changer.'],
    source: 'https://unboundwiki.com/items/key-items/stat-scanner/',
  },
  {
    id: 'super-rod',
    label: '**Super Rod**',
    location: 'Seaport City – Gift from the fisherman NPC standing by the port.',
    details: ['The Super Rod is used to catch Water-type Pokémon from any body of water. The caught Pokémon are usually of a higher level than the Old and Good Rods.'],
    source: 'https://unboundwiki.com/items/key-items/super-rod/',
  },
  {
    id: 'time-turner',
    label: '**Time Turner**',
    location: 'Cube Corp. – Given as a reward for completing Mission #065: The Daily Grind',
    details: ['Inverts the time of day to switch the in-game clock from AM to PM and vice versa'],
    source: 'https://unboundwiki.com/items/key-items/time-turner/',
  },
  {
    id: 'town-map',
    label: '**Town Map**',
    location: 'Frozen Heights – Given by Professor Log after recovering his parcel',
    details: ['Shows a map of the region, complete with the character’s current location and the locations of roaming legendary Pokémon'],
    source: 'https://unboundwiki.com/items/key-items/town-map/',
  },
  {
    id: 'trainer-catalogue',
    label: '**Trainer Catalogue**',
    location: 'Fallshore City – Given as a reward from a Ranger NPC in Mission HQ for completing 5 missions',
    details: ['The Trainer Catalogue organizes every trainer in the game and details the teams of those you defeat.'],
    source: 'https://unboundwiki.com/items/key-items/trainer-catalogue/',
  },
  {
    id: 'vs-seeker',
    label: '**VS Seeker**',
    location: 'Blizzard City – Given by the NPC on the second floor of the house east of the Pokemon Center',
    details: ['Scans nearby trainers who want to rematch the player. Rematchable trainers start jumping when the player uses the VS Seeker.'],
    source: 'https://unboundwiki.com/items/key-items/vs-seeker/',
  },
] satisfies KeyItem[]

/** Toutes les clés persistées, pour `knownContent` et la purge. */
export const keyItemKeys = keyItems.map(item => `item:${item.id}` as const)
