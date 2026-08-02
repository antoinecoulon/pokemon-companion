# Emerald Seaglass — ce que c'est

## Identité

| | |
| --- | --- |
| Jeu de base | Pokémon Emerald (GBA) |
| Base technique | **pokeemerald-expansion** |
| Auteur | **Nemo622** (pseudonyme) |
| Statut | Complet. Version rapportée **v3.0**, dernière mise à jour rapportée **2024-09-21** — ⚠️ **source secondaire uniquement** (`gbacodes.com`), non confirmé à la source primaire |
| Code source | **Aucun dépôt public connu** — à la différence d'Elite Redux, rien ne s'extrait du code : la doc officielle de l'auteur est la seule source structurée |
| Où prendre le patch | **Ko-fi uniquement** : <https://ko-fi.com/nemo622>, page patch <https://ko-fi.com/s/aabf18551d>. Ko-fi est derrière Cloudflare et n'est pas lisible en `curl`/`WebFetch` — à ouvrir au navigateur |
| Documentation officielle | PDF « Pokémon Emerald Seaglass Documentation », diffusé depuis Ko-fi. Un mirror est consultable ici : <https://www.pokeharbor.com/wp-content/uploads/2024/08/Pokemon-Emerald-Seaglass-Documentation.pdf> — c'est un **mirror**, pas la source de l'auteur |
| Installation | Pomper une ROM **Pokémon Emerald** propre avec le patch Seaglass |

Nemo622 la présente elle-même comme **pas un difficulty hack** : « This is *NOT* a "difficulty
hack"! These changes just cut down on some grind while still keeping a good balance. » — c'est le
fil rouge de tout le contenu ci-dessous.

---

## Ce que ce hack n'est pas

À dire franchement, avant la liste des features : **Emerald Seaglass est un Emerald vanilla côté
trame et exploration.** Même région (Hoenn), même histoire, même ordre de badges (supposé — voir la
liste « à vérifier en jeu » du [README](README.md)). La doc officielle ne promet que des « new
additions to some maps to increase interesting events » — pas de nouvelles zones majeures, pas de
scénario alternatif, pas de nouvel ordre de progression. Sa valeur n'est ni narrative ni
exploratoire : elle est dans la refonte visuelle, le contenu Pokémon (toutes les espèces Gen 1-3,
cross-gen jusqu'à Gen 9, retypages et movesets USUM) et une longue liste de conforts de jeu. Un
joueur qui cherche de l'histoire nouvelle ou de nouvelles zones à explorer ne les trouvera pas ici.

---

## 1. Refonte visuelle

- **Refonte visuelle complète**, grâce aux tiles de **Zaebucca**.
- Style qui rappelle les RPG 90's, une sorte de GSC amélioré.
- **Sprites Pokémon au style GBC**, issus de la Génération 2 et d'artistes comme **Egg**.
- **PNJ overworld** dans un style plus rétro, avec un contour blanc qui les fait ressortir.

## 2. Pokédex amélioré

Upgradé avec de nombreuses fonctionnalités, inspiré du Pokédex de HGSS mais dans un style GBC :
affiche désormais les **méthodes d'évolution** et les **movesets** — la doc insiste : « Please
remember to use it! ».

## 3. Contenu Pokémon

- **Toutes les espèces des Générations 1 à 3** sont disponibles, réparties pour éviter la
  surcharge.
- **Cross-gen evolutions** ajoutées, jusqu'à la Gen 9 (Weavile, Annihilape, etc.).
- **Movesets USUM modifiés** quand applicable — beaucoup de Pokémon gagnent des capacités de
  couverture et des sets plus intéressants en général.
- **Presque tous les Pokémon ont reçu des changements** — légers ajustements de stats ou nouveaux
  types, pour les rendre plus utilisables/uniques.
- **Les dresseurs utilisent une plus grande variété de Pokémon** — la doc cite spécifiquement les
  combats de la Team Aqua et de la Team Magma, « enfin intéressants ».
- **Pokémon additionnels hors Gen 1-3** (easter eggs) : ligne **Spiky-Ear Pichu**, ligne
  **Tinkaton**, ligne **Applin** — détail des obtentions plus bas.
- **Overworld Following Pokémon.**

## 4. Moteur de combat

Changements venant de **pokeemerald-expansion** :

- Type **Fairy**.
- Split **physique/spécial**.
- (Et d'autres mises à jour du moteur, non détaillées par la doc.)

## 5. EXP. Share party-wide et soft level caps

- **EXP. Share party-wide**, donné par **Scott à Petalburg**, juste après le tutoriel de capture de
  Wally.
- Pour compenser, un **soft level cap** : on peut monter jusqu'au niveau max du gym leader suivant,
  puis le gain d'XP est **divisé par deux** pendant quelques niveaux, puis **réduit davantage
  encore**. Aucun chiffre précis n'est donné par la doc — voir la liste « à vérifier en jeu » du
  [README](README.md).
- La doc insiste : ce n'est **pas** un difficulty hack, juste un moyen de réduire le grind en
  gardant l'équilibre.

## 6. Z-Power Ring et Z-Crystals

Gimmick de combat optionnel : obtenu à la **DEVON Corporation**, après avoir livré la lettre de
Steven. **Complètement optionnel et hors du chemin principal** — la doc précise : si on n'aime pas
les Z-Moves, pas besoin d'aller chercher le Z-Ring.

## 7. DexNav

Installé par la mère du joueur au moment où il/elle quitte Littleroot Town, après avoir obtenu le
Pokédex de Professeur Birch. Accessible depuis le menu Start.

- Indique combien de Pokémon se trouvent dans une zone ; on peut cibler une espèce après l'avoir
  vue une première fois.
- Environ tous les **~200 pas**, le DexNav détecte automatiquement un Pokémon à proximité.
- **50 % de ces détections sont des « Hidden Pokémon »**, trouvables uniquement par ce biais. Aucun
  Pokémon n'est exclusif au statut « hidden » — cela ajoute seulement des options en début de
  partie et de la variété dans les rencontres sauvages.
- Reprend de nombreuses fonctionnalités du DexNav d'ORAS : **chaînes** pour augmenter les taux de
  shiny, trouver des egg moves rares, et augmenter les IVs.
- Le code de triche `JUSTSHOWME` affiche tous les Pokémon du DexNav, vus ou non.

## 8. Shinies

- Taux **1/4096** par défaut.
- **Shiny Charm dans le PC du joueur dès le départ** (+5 rerolls).
- **Second Shiny Charm à Fortree City** : interagir avec **tous les shrines, d'est en ouest, dans
  l'ordre** — le second Shiny Charm se trouve dans le dernier shrine (à gauche du Pokémon Center).
- Les rerolls des deux Shiny Charms **se cumulent** — en avoir deux double les rolls.

## 9. Confort de jeu (QoL)

- **Types affichés en combat.**
- Touche `L` : affiche plus d'informations sur les capacités.
- Touche `R` : bascule l'**auto-run**.
- **Refonte du système de HM** : si le HM est dans le sac et le badge correspondant possédé, tout
  Pokémon capable de l'apprendre peut l'utiliser **nativement** — plus besoin d'un emplacement de
  capacité dédié.
- Touche `A` dans l'écran de Résumé : affiche IVs et EVs. **Tous les Pokémon ont au moins 2 IV
  parfaits.**
- **Pokémon Box Link** : accès au PC depuis n'importe où, obtenu auprès du Scientist NPC du
  Pokémon Center de Slateport City, débloqué après avoir battu Wattson.
- **Codes de triche / fonction Mystery Gift**, via la GameCube dans la chambre du joueur (liste
  plus bas).
- **Légendaires tous rencontrables**, « mostly before Elite Four » — détail plus bas.
- **Hard Mode** (désactive les level caps) **et d'autres options**, réglables via le livre sur le
  bureau du joueur dans sa chambre. Le contenu exact de « and more options » n'est pas détaillé par
  la doc.

## 10. Minigames

Quatre minigames viennent casser le rythme des combats Pokémon.

### Scuba Safari — Pacifidlog Town

Combine la Safari Zone et le Bug Catching Contest de Johto, dans une zone sous-marine dédiée.
Accessible en parlant au **Sailor NPC sur la plateforme est de Pacifidlog** — **pas besoin du HM
Dive**.

Règles :

1. **200 « pas »** (cases nagées) avant la fin de la partie.
2. **5 rencontres au total** pour capturer un Pokémon à faire scorer ; après 5 rencontres, le temps
   s'arrête.
3. Les Pokémon sont jugés sur **rareté, niveau, IVs et PV restants**.
4. Différentes zones et bancs d'algues ont des tables de rencontre différentes.

**Calcul du score** : `Score de rareté + (Niveau × 3) + (IV HP + IV Atk + IV Def + IV SpA + IV SpD
+ IV Spe) + PV restants`. Exemple donné par la doc : rareté 100, niveau 5, IVs parfaits (31) sur
toutes les stats, 25 PV restants → `100 + 15 + (31×6) + 25 = 326`.

Récompenses : la **première** fois qu'on établit un high score, on reçoit le **HM07 Waterfall**.
Ensuite, les récompenses sont tirées au hasard dans un pool de trésors (éclats, pépites, perles…),
d'objets d'évolution et d'autres objets. Chaque nouveau high score donne **5 Heart Scales** et une
TM aléatoire d'un pool de bonnes capacités (Flamethrower, Dragon Claw, Thunderbolt, etc.).

L'accès à Pacifidlog Town depuis Slateport se fait via un **NPC à Kirlia près du Pokémon Center**,
débloqué après avoir battu la **Team Aqua au Museum**.

### Pinball — Mauville et Mossdeep Game Corner

**Quatre jeux de pinball** aux styles distincts, présents dans les deux Game Corners : **Seel**,
**Gengar**, **Meowth**, **Diglett**.

- Gagner une partie donne **1 Pinball Point**.
- À **Mauville** : échangeables contre des Poké Balls rares (apricorn…) et des œufs de formes
  Alolan aléatoires.
- À **Mossdeep** : échangeables contre des objets rares aléatoires ; l'argent peut aussi acheter des
  Points.

### Contests et Battle Tent déplacés

- Le **Contest Hall** a été déplacé à **Verdanturf Town**.
- Le **Battle Tent** (habituellement à Verdanturf) a été déplacé à **Lilycove**.
- Objectif affiché : permettre d'entrer en contest bien plus tôt.
- Un PNJ dans le Contest Hall de Verdanturf peut **réinitialiser le Sheen** d'un Pokémon.

### Rustboro City Wishing Well

Sur le côté est de Rustboro City, un vieux **Wishing Well**. Y jeter un **Wishing Star** fait
apparaître un Pokémon aléatoire, façon Wonder Trade ou système de gacha.

---

## 11. Marchands et objets d'aide

- **Nature Mints** : boutique de fleurs **Pretty Petal** sur la **Route 104**, au sud de Rustboro.
- **Happy Trainer Merchant Stand** à Petalburg : Ability Capsules, EXP Candies, Stat Feathers,
  objets Choice, Stat Vitamins — sélection limitée au début, qui s'étoffe à **chaque badge**.
- **Stands d'objets d'évolution** :
  - Water Stone, Thunder Stone, Fire Stone, Sun Stone, Moon Stone — marché de **Slateport City**.
  - Leaf Stone, Ice Stone, Dawn Stone, Dusk Stone, Shiny Stone — **Herb Shop de Lavaridge Town**.
  - Tart Apple, Sweet Apple, Candy Apple — vendeur de pommes de **Pacifidlog Town**.
  - **Tous** les objets d'évolution sont aussi disponibles à un stand de **Sootopolis City**, au
    nord du Pokémon Center.
- **Wishing Stars** : une au sol près du Wishing Well de Rustboro ; d'autres données par une petite
  fille de Rustboro et un Hiker de Granite Cave ; achetables auprès d'un NPC au **Mt. Chimney**
  après avoir nettoyé la Team Aqua/Magma, sur le modèle de la vieille dame au Lava Cookie ;
  quelques-unes dispersées dans la région, surtout dans la moitié ouest de Hoenn.
- Autres objets notables situés hors de leur emplacement Emerald vanilla : King's Rock (Route 106,
  juste au-dessus de l'entrée de Granite Cave), Dragon Scale (Route 118), Upgrade (Weather
  Institute, Route 119), Dubious Disc (Team Aqua Hideout), Metal Coat (Rusturf Tunnel et Abandoned
  Ship), Razor Fang (Route 119), Razor Claw (Route 121), Prism Scale (Route 127 — ou faire évoluer
  Feebas avec 140 Beauty en contest), Black Augurite (Route 119), Peat Block (péninsule sud de
  Lilycove).

---

## 12. Easter eggs

- **Spiky-Ear Pichu** — repris de HGSS, stats plus hautes et moveset unique pour le rendre
  (relativement) utilisable. Obtenu auprès du **Professeur Elm à Fallarbor Town**, après avoir
  collecté 50 espèces uniques.
- **Ligne Tinkaton** — un œuf de Tinkatink donné par un **Grunt de la Team Aqua sur la Route 115**
  (au sud de Meteor Falls, au nord de Rustboro).
- **Ligne Applin** — Applin se trouve à **Littleroot Town** ; les objets d'évolution (Tart Apple,
  Sweet Apple, Candy Apple) sont disponibles à Pacifidlog Town.

---

## 13. Rencontres de légendaires

Tous les légendaires des trois premières générations sont rencontrables.

- **Jirachi** : parler à la femme près du White Rock, puis interagir avec le White Rock de Mossdeep
  en ayant un Wishing Star dans le sac.
- **Kyogre, Groudon, la Regi Trio et Rayquaza** : rencontrés « de la façon normale d'Emerald » selon
  la doc — pas de changement signalé.

Les autres légendaires (verrouillés derrière des events exclusifs ou absents de l'Emerald vanilla)
passent par une storyline avec un **Sailor à Mossdeep City** (reconnaissable à son cache-œil et à sa
tenue légèrement différente). La doc précise : « These should mostly be possible before the Elite
Four! » (non chiffré cas par cas).

| Légendaire | Obtention | Niveau |
| --- | --- | --- |
| Latios / Latias | Southern Island. Eon Ticket obtenu en parlant au Sailor de Mossdeep (sur la colline, près du grand télescope) après avoir battu le gym de Mossdeep. Débloque aussi le SS Tidal et d'autres quêtes de légendaires | non précisé |
| Mew | Faraway Island. Old Sea Map obtenu en montrant au Sailor l'entrée de Pokédex de Rhydon (rencontré niv. 30) | non précisé |
| Ho-oh / Lugia | Navel Rock. Mystic Ticket en montrant l'entrée de Pokédex d'Octillery (Water/Fire) | Lv. 50 |
| Deoxys | Birth Island. Aurora Ticket en montrant l'entrée de Pokédex de Rayquaza | Lv. 70 |
| Celebi | Route 119, en interagissant avec le Sailor devant le Birdhouse/Shrine au nord du Weather Institute | Lv. 40 |
| Mewtwo | Steven's Room, Granite Cave, en interagissant avec le Sailor | Lv. 80 |
| Raikou / Entei / Suicune | Shoal Cave Ice Room ; le Sailor en fait apparaître un au hasard, reset possible en rebattant l'Elite Four | Lv. 50 |
| Articuno / Zapdos / Moltres | Sommet du Mt. Pyre ; le Sailor en fait apparaître un au hasard, reset possible en rebattant l'Elite Four | Lv. 50 |

Celebi, Mewtwo, et les deux trios ne se débloquent qu'**après avoir complété les trois premières
quêtes du Sailor** (déclenché quand il annonce qu'il « part explorer pour trouver d'autres
légendaires »).

---

## 14. Codes de triche / Mystery Gift

Saisis en interagissant avec la **GameCube dans la chambre du joueur**.

| Code | Effet |
| --- | --- |
| `9RARECANDY` | 99 Rare Candies (répétable) |
| `MASTERBALL` | 99 Master Balls (répétable) |
| `ILOVSPHEAL` | Spheal niv. 5 aux stats défensives optimisées, capacités Bouncy Bubble, Super Fang, Slack Off, Freeze Dry — starter alternatif |
| `ILOVEAIPOM` | Aipom niv. 5 avec Eviolite, capacités Dizzy Punch, Karate Chop, Victory Dance, Bullet Punch — starter alternatif volontairement fort |
| `ILOVEKANTO` | Les trois starters de Kanto, niv. 5 |
| `ILOVEJOHTO` | Les trois starters de Johto, niv. 5 |
| `ILOVEHOENN` | Les trois starters de Hoenn, niv. 5 |
| `ILOVEAPPLE` | Applin niv. 5 tenant une Syrupy Apple |
| `ILOVETINKA` | Tinkatink niv. 5 tenant un Nugget |
| `JUSTSHOWME` | Affiche automatiquement tous les Pokémon du DexNav (vus ou non) et permet de les chasser sans les avoir déjà rencontrés |
| `WISHINGSTR` | 99 Wishing Stars, à utiliser au Wishing Well de Rustboro |

---

## 15. Known Issues (rapportés par l'auteur)

**Problèmes majeurs :**

- **Battle Tent désactivé** — les Pokémon de location deviennent des Bad Egg et d'autres choses
  cassent. Le bâtiment est bloqué par un PNJ en attendant un correctif.

**Problèmes visuels :**

- **Scintillement graphique à chaque tour de combat** — semi-intentionnel : réinitialiser les
  graphismes évite de nombreux freezes et bugs d'animation de capacité.
- Les bâtiments de la **Battle Frontier** utilisent en majorité des tiles Emerald vanilla, qui ne
  correspondent pas à l'esthétique du reste du jeu.
- Le texte du nombre de **PP est jaune** lors de l'apprentissage d'une nouvelle capacité.

**Autres :**

- La **physique du pinball** est loin d'être parfaite — l'auteur estime que ça fait partie du
  charme.

L'auteur mentionne un **canal Discord** pour signaler les bugs, en demandant de vérifier d'abord
cette liste. Son URL n'a pas été vérifiée et n'est pas publiée ici.

---

## Crédits (extrait)

Tiles principalement par **Zaebucca**, sprites Pokémon Gen 1-3/9 par **Egg**, **Nuukiie** et
d'autres artistes crédités dans la doc officielle. Liste complète non reprise ici — voir le PDF
source ou son mirror pour le détail complet des contributions.
