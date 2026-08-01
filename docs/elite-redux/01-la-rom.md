# Elite Redux — ce que c'est

## Identité

| | |
| --- | --- |
| Jeu de base | Pokémon Emerald (GBA) |
| Base technique | Inclement Emerald / patch Yda, avec permission de Buffel Saft & Yda |
| Auteur | **Darky** |
| Nature | Difficulty hack **et** hack de rééquilibrage — pas seulement « plus dur » |
| Licence | Open source, réutilisable librement |
| Installation | Patcher officiel : <https://elite-redux.com/> + une ROM Emerald |

Darky décrit son intention comme : rééquilibrer tout le jeu pour plus de variété et de fun, en
supprimant le grind, pour des joueurs qui aiment surtout **battler et construire des équipes**.
C'est le fil rouge de toutes les décisions de design listées ci-dessous.

---

## 1. Le système à quatre talents — la vraie particularité

C'est la mécanique qui distingue Elite Redux de tous les autres hacks.

Chaque Pokémon dispose de :

- **1 à 3 abilities switchables** — la plupart des espèces en proposent 3, au choix dans l'écran
  de résumé. Une seule est active à la fois.
- **3 innates** — des talents **passifs liés à l'espèce**, toujours actifs, **en plus** de
  l'ability choisie.

Un Pokémon peut donc avoir **jusqu'à 4 talents actifs simultanément**. Exemple donné par l'auteur :
un Gyarados avec `Moxie` et `Aerilate` en même temps.

> **En mode Elite, la plupart des innates sont verrouillés au départ.** Ils se débloquent en
> battant les Gym Leaders et en faisant monter le level cap. C'est précisément pourquoi cette doc
> s'arrête au 2e badge : c'est le palier où l'équipe devient réellement jouable telle qu'elle est
> conçue, et où il faut repasser sur tous ses builds.

Le jeu compte **plus de 370 abilities**, dont 110+ inédites et une cinquantaine de retouchées.
Quelques exemples de créations : `Chloroplast` (les capacités agissent comme sous le soleil),
`Phantom Pain` (les capacités Ghost touchent les Normal), `Fungal Infection` (les capacités
contact infligent Leech Seed), `Fort Knox` (bloque les talents offensifs adverses).

Et de retouches à connaître, car elles changent des réflexes :

| Ability | Comportement dans Elite Redux |
| --- | --- |
| `Stall` | 30 % de dégâts en moins si le Pokémon n'a pas encore agi |
| `Battle Armor` / `Shell Armor` | 20 % de dégâts en moins **et** bloque les coups critiques |
| `Big Pecks` | devient un clone de `Tough Claws` |
| `Storm Drain` / `Lightning Rod` | boostent la **meilleure** stat offensive à l'activation |
| `Frisk` | désactive l'objet adverse pendant 2 tours |

---

## 2. Difficulté et level caps — deux réglages distincts

C'est le point que les sites tiers mélangent le plus souvent. Ce sont **deux options séparées** à
l'écran d'intro.

### Difficulté : `Easy` / `Ace` / `Elite`

- **Easy** — les dresseurs n'ont pas d'EVs. Les équipes restent construites.
- **Ace** — mêmes équipes qu'Easy, mais **tous les dresseurs ont des EVs** ; sleep clause active.
- **Elite** — équipes **remplacées** pour les combats importants (Gym Leaders, Pokémon League),
  sleep clause active, et **innates verrouillés** jusqu'à déblocage.

La difficulté se **baisse** à n'importe quel Poké Center. La **remonter** est possible mais marque
le Hall of Fame d'une icône, pour éviter de tricher sur un challenge run.

### Level caps : `Easy` / `More` / `Elite`

Niveau maximum autorisé **avant** d'obtenir chaque badge. Valeurs en dur dans le code
(`src/pokemon.c`, `GetLevelCap()`) :

| Badge obtenu | Easy | More | **Elite** |
| --- | --- | --- | --- |
| *(aucun)* | 20 | 18 | **16** |
| Stone Badge | 28 | 25 | **23** |
| Knuckle Badge | 44 | 40 | **36** |
| Dynamo Badge | 55 | 50 | **45** |
| Heat Badge | 65 | 55 | **50** |
| Balance Badge | 80 | 70 | **55** |
| Feather Badge | 90 | 85 | **60** |
| Mind Badge | — | 92 | **70** |
| Rain Badge | — | 95 | **80** |
| Champion | — | — | — |

Un « — » signifie plus de plafond. En Easy, le cap saute après le Feather Badge ; en More, après
le Rain Badge ; en Elite, il tient jusqu'au bout du parcours des badges.

Les dresseurs adverses **scalent** avec la progression : impossible de compenser par le niveau,
seul le build compte.

---

## 3. Zéro grind

Toute la préparation d'équipe passe par des menus, pas par des heures de farm.

- **EVs éditables** directement dans l'écran de résumé. 252 max par stat, 510 au total. La règle
  usuelle : 252 dans les deux meilleures stats.
- **Nature éditable** dans l'écran de résumé (+10 % sur une stat, −10 % sur une autre).
- **Ability éditable** dans l'écran de résumé.
- **IVs à 31 partout par défaut.** L'**Iron Pill** met la `Spe` à 0 (équipes Trick Room) et la
  remet à 31.
- **Type Gems** : changent le type de `Hidden Power` **et** de `Secret Power` (sa version
  physique).
- **Candy Box** : Rare Candies illimitées. Mécanique Gen 8 — on peut évoluer au level cap. On
  monte de 4 niveaux d'un coup, ou directement **jusqu'au cap**.
- **Apprentissage des capacités** depuis le menu Party ou Moves (touche `R`), sans Move Tutor.
  Les capacités de la liste *Level* restent conditionnées au niveau ; en caps Elite, de nouvelles
  capacités se débloquent **après chaque gym**, jusqu'aux deux tiers du jeu environ.
- **Évolutions rendues niveau-based.** Plus d'échange, plus de bonheur. L'écran de résumé indique
  si un Pokémon peut évoluer et à quel niveau, et affiche ses Mega Evolutions possibles même sans
  la pierre. On évolue depuis le menu Party, en choisissant la branche.
- **Toutes les capacités sont à PP Max.**

---

## 4. Confort de jeu

- **Portable PC** depuis le menu Start (désactivé face au Pokémon League).
- **Aucun HM à enseigner.** On vole vers n'importe quel lieu visité avec n'importe quel Pokémon ;
  les autres HMs se débloquent au fil des gyms.
- **Soin automatique avant la plupart des combats.** Quelques combats sont des gauntlets sans soin.
- **Les objets tenus se régénèrent après combat** — plus de Focus Sash ou de baie à remettre.
- **Poké Balls : 100 % de capture, en quantité infinie, non consommées.** N'importe quelle ball.
- **DexNav+** : recherche automatiquement les Pokémon d'une zone, sans déclencher de rencontre.
- **Infinite Repel.**
- Plusieurs objets enregistrables sur la touche `L`.
- Taux de shiny montable jusqu'à **1/5** dans les options.
- Auto-run, baies à pousse instantanée, œufs en 4 cycles, soin sans dialogue.
- Pokédex enrichi (base stats, learnsets, egg moves, évolutions, en jeu).

---

## 5. L'interface de combat

- **Battle Style toujours « Set »** — pas de switch gratuit après un KO.
- L'**efficacité d'une capacité est affichée avant de l'utiliser**, et elle tient compte des
  abilities et innates adverses (`Levitate`, `Sap Sipper`…).
- Le **STAB** est signalé par une icône `+` (bonus de 50 %, comme d'habitude).
- `L` en combat ouvre l'aide intégrée (raccourci modifiable dans Settings > Custom).
- Un combat de dresseur peut être **abandonné** : cela compte comme une défaite et renvoie au
  dernier Poké Center.

---

## 6. Économie : les Adoption Centers

**Les Poké Marts sont remplacés par des Adoption Centers.** On y dépense les **BP** gagnés en
combattant des dresseurs pour acheter :

- des **Pokémon Redux** — des variantes retravaillées, indisponibles autrement (à quelques
  exceptions près). Le catalogue s'étoffe au fil de la progression ;
- après **Norman**, la plupart des nouvelles **Mega Stones**.

---

## 7. Statuts et météo

### Nouveaux statuts

| Statut | Effet |
| --- | --- |
| **Bleed** | Statut non volatil. 1/16 des PV max par tour, **empêche les soins** et **annule les boosts de stats**. Rock et Ghost immunisés. Une capacité de soin guérit le Bleed mais ne soigne pas ce tour-là. Vient surtout des capacités boostées par `Keen Edge`. |
| **Fear** | Piège la cible 2 tours ; elle subit **50 % de dégâts en plus**. Infligé par `Scary Face`, `Terror Charge`, `Worry Seed`. |
| **Frostbite** | **Remplace Freeze.** 1/16 des PV par tour aux non-Ice, et **divise par deux les dégâts spéciaux** du porteur. |
| **Enraged** | Subit 33 % des dégâts infligés en recul. Cumulable avec d'autres reculs. |

`Burn`, `Paralysis`, `Poison` et `Sleep` sont inchangés. **Infatuation** en revanche est modifiée :
la cible inflige **50 % de dégâts en moins** (physiques comme spéciaux), et ce **indépendamment du
genre**.

### Météo

Durée : **8 tours**, 12 avec la roche correspondante.

- **Hail/Snow** — `Def` des Ice +50 %, 1/16 aux autres, `Blizzard` ignore la précision.
- **Sandstorm** — 1/16 hors Rock/Ground/Steel, `SpD` des Rock +50 %.
- **Rain** — capacités Water +50 %, Fire −50 %, `Thunder` et `Hurricane` toujours précis.
- **Sunlight** — Fire +50 %, Water −50 %, `Solar Beam`/`Solar Blade` en un tour, `Growth` donne
  +2 en `Atk` et `SpA`.
- **Harsh Sunlight** / **Heavy Rain** — annulent respectivement Water et Fire.
- **Strong Winds** — ramène à neutre les dégâts super efficaces contre les Flying.

**Eerie Fog**, la météo inédite : draine d'un cran par tour les stats positives des non-Ghost et
non-Psychic, divise par deux les soins météo (`Synthesis`), réduit de 20 % les dégâts subis par
les Ghost et Psychic, fait échouer `Revival Blessing` et `Harvest`, rend tous les `Curse` de type
Ghost, et transforme `Weather Ball` en Ghost à puissance doublée. La **Smoke Ball** la prolonge à
12 tours.

> Les abilities de météo type `Drought` / `Drizzle` donnent à nouveau une météo **infinie**.

---

## 8. Pokémon, capacités, objets

- **Toutes les espèces de la Gen 1 à la Gen 9** sont disponibles, formes régionales comprises
  (Alolan, Galarian, Hisuian, Paldean).
- **60+ Redux Forms** — des refontes avec évolutions inédites.
- **40+ Mega Evolutions nouvelles**, sprites et cris compris (Milotic, Flygon…). Certaines
  proposent un choix entre 3 abilities.
- **Permanent Mega Mode**, débloqué après avoir parlé à Norman : on passe en forme Mega depuis le
  menu Party, hors combat. Il faut toujours la bonne Mega Stone dans le sac, mais le Pokémon
  **reste Mega après les combats**, on peut en aligner **plusieurs dans une équipe**, et **une
  Mega peut tenir un autre objet**.
- **5 nouvelles Primal Forms**, dont les items sont donnés par un Ace Trainer à côté de la maison
  de départ : `Tera Orb` (Stellar Terapagos), `Eternamax Orb`, `Ultra Necrozmite`, `Crowned Sword`
  (Zacian), `Crowned Shield` (Zamazenta).
- **100 TMs, 8 HMs, ~130 capacités de tuteur.**
- Capacités revues à la hausse en puissance ou précision. Les capacités **OHKO** (`Fissure`…)
  infligent désormais **~120 de dégâts avec 80 % de précision** au lieu du KO direct.
- Objets retouchés : `Big Root`, `Shell Bell` renforcés.
- **La table des types n'a pas été touchée.**

Quelques refontes d'espèces citées par l'auteur, pour donner le ton : Gyarados devient
**Water/Dragon avec `Levitate`** ; Kecleon voit `Colour Change` s'activer **avant** d'être touché,
ce qui le rend immunisé ou résistant à l'attaque entrante ; toutes les évolutions d'Eevee peuvent
**redevenir Eevee** et partagent un movepool commun ; Gliscor a `Poison Heal` ; Pyukumuku passe à
600 BST.
