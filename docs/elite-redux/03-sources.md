# Sources

Toutes les consultations datent du **2026-08-01**.

## Le principe

Elite Redux est **open source**. Chaque fois que c'était possible, la donnée de cette doc a été
lue **dans le code du jeu**, pas sur un site qui le paraphrase. Ce qui n'a pas pu l'être porte
« ⚠️ à vérifier en jeu ».

---

## Sources primaires — le code

### `Elite-Redux/eliteredux-source`, branche `master`

<https://github.com/Elite-Redux/eliteredux-source> — le decomp du jeu.

| Fichier | Ce qu'on en a tiré |
| --- | --- |
| `src/pokemon.c` (fonction `GetLevelCap`, l. 9023-9046) | **Les trois tables de level caps.** Valeurs en dur, aucune ambiguïté. |
| `src/starter_choose.c` | **Les 72 starters**, en 24 groupes de 3. |
| `src/data/wild_encounters.json` | **Les encounters sauvages**, 150 maps, avec méthode, taux et fourchettes de niveaux. |
| `src/data/trainer_parties.h` | Équipes de dresseurs — **schéma concurrent**, voir plus bas. |
| `src/data/dex-strategy.md` | 150 Ko de sets compétitifs par espèce. Non exploité ici (hors périmètre du début de partie), mais utile pour la suite. |

### `Elite-Redux/er-config`, branche `upcoming`

<https://github.com/Elite-Redux/er-config> — la configuration du jeu en protobuf textuel.

| Fichier | Ce qu'on en a tiré |
| --- | --- |
| `HelpArticles.textproto` | **Les articles d'aide affichés en jeu** (touche `L`). Source de toute la partie mécaniques de [01-la-rom.md](01-la-rom.md) : Nurse Joy, EVs, innates, statuts, météo, Mega Stones, Primal Forms, second starter. C'est ce que le jeu lui-même dit au joueur. |
| `TrainerList.textproto` (2,7 Mo) | Équipes des dresseurs, par palier. |
| `SpeciesList`, `MoveList`, `AbilityList`, `items/*` | Non exploités ici. |

⚠️ **`upcoming` est la branche de développement** — ce dépôt n'a aucune branche stable
(`items`, `proto-move-behavior`, `test`, `upcoming`).

### Accès

`raw.githubusercontent.com` et l'API GitHub répondent normalement en `curl`. Aucune précaution
particulière.

---

## Le conflit sur les équipes de Gym Leaders

**Deux dépôts officiels du même projet donnent des équipes différentes, avec des schémas de
paliers différents.** C'est la seule vraie zone d'incertitude de cette doc.

| | `er-config@upcoming` | `eliteredux-source@master` |
| --- | --- | --- |
| Paliers | `ace`, `elite`, `hell` | party de base, + suffixe `Insane` (34 occurrences) |
| Roxanne, palier bas | Anorith, Lileep, Corsola, Noibat-Redux, Nosepass | Onix, Amaura, Gligar, Lileep, Growlithe-Hisuian, Klawf |
| Roxanne, palier haut | Bombirdier, Deoxys-Defense, Zygarde-10, Probopass, Magcargo, Whiscash | Onix, Tirtouga, Naclstack, Bombirdier, Magcargo, Whiscash |
| Brawly, palier bas | Pawniard-Redux, Pawmo, Lokix, Toxicroak, Hariyama | Gallade, Lucario, Hitmonchan, Toxicroak, Lilligant-Hisuian, Pawmot |

Les paliers hauts se recoupent partiellement (Bombirdier, Magcargo, Whiscash chez Roxanne), ce qui
suggère que `Insane` correspond à peu près à `hell`. Mais les paliers bas n'ont presque rien en
commun, et `master` ne connaît pas de palier intermédiaire là où `er-config` en a un.

**Interprétation la plus probable** : `trainer_parties.h` est l'ancien système, encore présent
dans le decomp, tandis que `er-config` est la configuration vivante avec une granularité plus
fine. Ce n'est **pas vérifié**.

**Décision prise** : [02-bien-debuter.md](02-bien-debuter.md) publie le palier `elite` de
`er-config` — c'est celui qui nomme explicitement le mode joué — en le marquant comme indicatif,
et met l'accent sur les **enseignements tactiques** (équipe Sand, `Eviolite`, `Defiant`,
priorité…) plutôt que sur la liste exacte. Ces enseignements restent valables même si l'équipe
diffère à la marge.

**À trancher en jeu.** Une fois Roxanne rencontrée, corriger le tableau et supprimer cet
avertissement.

---

## Sources secondaires

| Source | Autorité | État |
| --- | --- | --- |
| <https://elite-redux.github.io/EliteReduxWiki/> | Page unique de features, signée Darky. Fiable sur l'intention et les grandes lignes. | ✅ accessible |
| <https://elite-redux.com/> | Le patcher officiel. **La seule voie d'installation à utiliser.** | ✅ accessible |
| <https://codex.elite-redux.com/> | Codex des abilities. SPA VitePress, contenu non extractible en ligne de commande. | ⚠️ navigateur seulement |
| <https://dex.elite-redux.com/> | **Le Pokédex en ligne officiel** — Pokémon, abilities, moves, locations, trainers, et un team builder. La référence désignée par le jeu lui-même. | ❌ injoignable en `curl` (timeout) — **navigateur seulement** |
| <https://wiki.elite-redux.com/> | Ancien wiki MediaWiki. Encore indexé par les moteurs de recherche, mais le serveur refuse la connexion (54.244.247.138). | ❌ hors service |

### Sites à ne pas utiliser

`eliteredux.net`, `pokehostel.com`, `pokeharbor.com`, `pokepatched.com`, `gbacodes.com`,
`pokemoncoders.com` : fermes de contenu SEO qui republient le jeu et paraphrasent la doc. Leur
table de level caps s'est révélée **exacte** au recoupement avec le code, mais ils mélangent
systématiquement **difficulté** et **level caps**, qui sont deux réglages distincts. Ne pas les
utiliser comme source, et ne jamais y télécharger le patch.

---

## Ce qui reste à vérifier en jeu

- [ ] La liste exacte des objets donnés par **Nurse Joy** au premier contact.
- [ ] L'emplacement du **PNJ en uniforme bleu** et de l'**Ace Trainer** à Littleroot.
- [ ] Le **level cap affiché avant Roxanne** — doit être **16** en caps Elite. C'est le test le
      plus rapide pour valider que le snapshot du code correspond à la version installée.
- [ ] L'**équipe réelle de Roxanne**, puis celle de **Brawly**.
- [ ] Le contenu des **trois combats obligatoires de Petalburg Woods**.
- [ ] Le comportement du second starter donné par **Calvin** (Route 102) : réellement aléatoire ?

## Hors périmètre, volontairement

- Les **rematches de Gym Leaders** (`ROXANNE_2` à `ROXANNE_5` : singles, singles avec légendaires,
  doubles, doubles avec légendaires) — mentionnés seulement.
- Les **Mega Stones** au-delà de celles atteignables avant le 2e badge.
- L'obtention des **autres starters**, qui n'ouvre qu'après Flannery.
- Le **palier `hell`**, non documenté publiquement et probablement inaccessible dans la version
  publiée.

---

## Reproduire les extractions

Les scripts d'extraction sont **jetables** et ne sont pas versionnés — ce n'est pas de la donnée
d'application, juste de quoi remplir un markdown sans recopier à la main. Ce qui compte est le
principe, à reprendre si on régénère :

- **Contrôler les comptes avant d'écrire.** Un parseur cassé ne lève pas : il rend moins
  d'entrées, en silence. Une table `land_mons` doit rendre **exactement 12 slots** ; une équipe de
  Gym Leader **4 à 6 Pokémon** ; la liste des starters **exactement 72**. Ces trois contrôles ont
  été appliqués, et celui sur les slots a effectivement rattrapé une erreur de méthode (compter
  les espèces uniques et non les slots faisait passer Granite Cave B1F pour une table tronquée,
  alors qu'elle a bien 12 slots pour 7 espèces).
- **Ne pas publier `hidden_mons`** : cette table est à taux 0, donc inutilisée. Elle contient des
  valeurs manifestement de test (`None` sur la Route 102, Dialga/Palkia/Giratina niveau 5 sur la
  Route 116). La publier serait de la désinformation.
