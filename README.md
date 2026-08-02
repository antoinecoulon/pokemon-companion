# Pokémon Companion

Application web de suivi de mes parties de hack ROMs Pokémon. On y coche sa progression, on y saisit
les IV/EV réels de son équipe, et l’app dit quoi faire ensuite.

**Trois jeux suivis en parallèle**, chacun avec sa propre sauvegarde et ses propres sections :

| Jeu | Racine | État |
| --- | --- | --- |
| **Pokémon Unbound** | `/unbound` | post-game, partie avancée. Remplace le guide markdown de 996 lignes archivé dans `docs/` |
| **Pokémon Elite Redux** | `/elite-redux` | mode Elite, partie qui démarre. Doc de référence dans `docs/elite-redux/` |
| **Pokémon Emerald Seaglass** | `/emerald-seaglass` | première partie, pas encore commencée. Doc de référence dans `docs/emerald-seaglass/` |

Mono-utilisateur, sans compte, sans backend : tout l’état vit dans le navigateur.

## Démarrer

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Ce que fait l’app

| Section | Contenu | Source dans le guide |
| --- | --- | --- |
| **Accueil** | Progression globale, 3–5 prochaines actions, compteurs de ressources | — |
| **Complétion** | La Battle Frontier en tâches ordonnées, puis tout ce qu’il reste à voir du jeu : 84 missions, Black Trainer Card, légendaires, Mega Stones, 34 Key Items, 29 move tutors, 100 Zygarde Cells, 32 raid dens — chaque entrée cochable et liée à sa page wiki | §10 + unboundwiki |
| **Équipe** | Les 6 slots actifs en avant avec leur sprite, le reste dans un bandeau défilant, et la composition modifiable (échange, ordre, sortie) ; par fiche : analyse, builds, formulaire IV/EV, checklist « Endgame Ready » | §6, §7.3, §13.2 |
| **Ressources** | PNJ, objets de combat, consommables, farming — les PNJ cochables, les acquis descendant dans un repli | §8, §9, §11 |
| **Référence** | Mécaniques IV/EV/natures/talents, Battle Frontier, formules, natures, outils, glossaire | §1–4, §10, §13 |
| **Journal** | Entrées horodatées à l’échelle de la partie | — |

### Prochaines actions

Le dashboard ne propose une tâche que si **tous ses prérequis sont cochés**. Les dépendances encodées
sont celles que le guide énonce explicitement : pas d’entraînement d’EV avant le Macho Brace amélioré
(§2.2), pas de Bottle Caps avant d’avoir lu les IV (§2.1), pas de changement de nature avant la
mission #053 (§2.3), et au sein d’une fiche l’ordre en 9 étapes de §3.

### Checklist « Endgame Ready »

Les 7 critères de §13.2, dont **4 déduits automatiquement** du formulaire de la fiche :

- **Niveau 100** — déduit du niveau saisi
- **EV exacts** — motif 252/252/4 vérifié, et signalement des EV perdus hors multiples de 4
- **Nature favorable** — comparaison entre la nature saisie et celle du build choisi
- **Objet non dupliqué** — contrôle croisé sur les slots actifs (§7.3 signale trois candidats aux Leftovers)

Les 3 autres (IV, talent, moveset) se cochent à la main, avec la cible du build affichée à côté de la
valeur réelle.

## Stack

- **Nuxt 4** en SPA (`ssr: false`) — l’état vit dans le `localStorage`, le rendu serveur n’apporte rien
- **Nuxt UI v4** (Tailwind CSS v4) — mobile-first, thème clair/sombre
- **PWA** via `@vite-pwa/nuxt` — installable sur téléphone, fonctionne hors-ligne
- **pnpm**

## Structure

```
app/
├── data/
│   ├── games.ts     LE registre des jeux — clés de sauvegarde, routes, dérivés
│   ├── types.ts     types de contenu + modèle de sauvegarde (partagés)
│   ├── natures.ts   les 25 natures (partagées : même notion dans tous les jeux)
│   ├── unbound/     LE contenu du guide, migré en TypeScript
│   │   ├── index.ts      assemble le GameContent d’Unbound
│   │   ├── phases.ts     §10  — la Battle Frontier, seul reste de la roadmap
│   │   ├── pokemon/      §6, §7.3 — une fiche par fichier + index.ts généré
│   │   ├── completion.ts objectifs de complétion écrits à la main
│   │   ├── missions.ts   ⚙ généré · tutors.ts ⚙ · collectibles.ts ⚙ · keyitems.ts ⚙
│   │   ├── npcs.ts  §8   · items.ts §9 · farming.ts §11
│   │   ├── mechanics.ts §1–4, §10, §13.0 · glossary.ts §13.3
│   │   ├── readiness.ts §13.2 — les 7 critères
│   │   └── counters.ts  compteurs de ressources et leurs objectifs
│   ├── elite-redux/ écrit à la main depuis docs/elite-redux/
│   │   ├── index.ts      assemble le GameContent d’Elite Redux
│   │   ├── phases.ts     les 4 phases : Débuter → Équipe → Compléter → Post-game
│   │   ├── completion.ts Mega Stones, Primal Forms, starters, Adoption Center, Frontier
│   │   ├── encounters.ts ⚙ généré · abilities.ts ⚙ (pnpm gen:elite)
│   │   ├── readiness.ts  pas d’IV (31 par défaut), un critère `innates` à la place
│   │   └── counters.ts   BP et argent — ni Bottle Caps ni Heart Scales dans ce jeu
│   └── emerald-seaglass/ écrit à la main depuis docs/emerald-seaglass/
│       ├── index.ts      ni encounters, ni abilities, ni resources — rien à générer
│       ├── phases.ts     4 phases, dont une phase 1 détaillée : tout s’y rate
│       ├── completion.ts légendaires du Sailor, easter eggs, minigames, Pokédex
│       ├── reference.ts  soft level caps, DexNav, deux Shiny Charm, minigames
│       ├── readiness.ts  les 7 critères, mais un `level` non déduit (caps souples)
│       └── counters.ts   Wishing Stars, Pinball Points, Heart Scales, argent
├── composables/
│   ├── useGame.ts        jeu actif et bascule
│   ├── useSave.ts        seul point d’accès au localStorage, une clé par jeu
│   ├── useRoster.ts      composition jouée : statut et slot effectifs
│   ├── useProgress.ts    ratios de progression + critères dérivés
│   └── useNextActions.ts moteur de « prochaine action »
├── middleware/
│   └── game.global.ts    valide le jeu de la route, redirige les anciennes URLs
├── components/      AppCard, SectionBlock, PokemonSprite, GameSwitcher, TaskItem, …
└── pages/
    ├── index.vue         redirige vers le dernier jeu ouvert
    └── [game]/           toutes les pages, préfixées par le jeu
docs/                le guide Unbound archivé + la doc de référence Elite Redux
public/sprites/      sprites versionnés : home/ (fiches) et pixel/ (vignettes)
scripts/             validation, tests de fumée, icônes, sprites, squelettes de contenu
```

### Multi-jeux

**Une clé `localStorage` par jeu**, pas un objet enveloppe. `pokemon-companion:save` reste *à l’octet
près* la sauvegarde Unbound d’avant le multi-jeux : aucun bump de `SAVE_VERSION`, aucune migration,
donc aucun risque sur la partie en cours. `normalize()`, la purge et `decideSync` continuent
d’opérer sur **un** `SaveState`, sans rien savoir des autres jeux.

Les **routes sont préfixées** (`/unbound/completion`) et la route est la source de vérité : le
middleware en déduit le jeu actif. Les anciennes URLs y redirigent — des favoris PWA pointent encore
dessus. Le jeu actif est mémorisé sous `pokemon-companion:game`, hors de toute sauvegarde.

Conséquence à connaître : **les ids ne sont uniques que par jeu**. Deux sauvegardes ne se croisent
jamais, donc Elite Redux réutilise librement `phase-1.x`.

### Contenu en TypeScript, pas en YAML

`satisfies Phase[]` fait échouer le build sur un `id` mal orthographié. Comme l’état persisté ne
référence le contenu **que par id**, cette vérification protège directement la sauvegarde.

## Ajouter ou modifier du contenu

Le guide n’est pas figé — la conversation d’origine contient plus d’informations qu’il n’en reprend.

Le contenu est du TypeScript, pas un CMS. Pour tout sauf les fiches Pokémon, les commandes ci-dessous
impriment le squelette avec la bonne convention d’id déjà remplie et refusent un id qui existe déjà.
Elles **n’écrivent rien** : on relit, on colle.

| Contenu | Commande | Fichier | Convention d’id |
| --- | --- | --- | --- |
| Tâche de la Frontier | `pnpm new:task phase-5` | `app/data/unbound/phases.ts` | `phase-<n>.<m>` |
| PNJ | `pnpm new:npc "Move Tutor"` | `app/data/unbound/npcs.ts` | kebab-case, persisté en `npc:<id>` |
| Objectif de complétion | `pnpm new:goal portails "Nom"` | `app/data/unbound/completion.ts` | kebab-case, persisté en `goal:<id>` |

**Missions, move tutors, collectibles et Key Items ne s’écrivent pas** : ils sont générés depuis
unboundwiki par `pnpm scrape:wiki <missions|collectibles|tutors|items|all>`. Corriger le fichier à la
main, c’est perdre la correction à la régénération suivante — une donnée fausse se corrige dans
`scripts/lib/scrape-<nom>.mjs`, ou se signale au wiki. Chaque scraper vérifie son compte d’entrées
(84 missions, 100 cells, 32 raid dens…) et échoue bruyamment plutôt que de rendre un fichier amputé.
Les pages sont mises en cache dans `.cache/wiki/` ; `--fresh` l’ignore, `--dry-run` n’écrit rien.

### Elite Redux — un générateur, d’autres sources

Elite Redux est **open source**, donc la donnée se lit dans son code plutôt que sur un wiki. Deux
fichiers de `app/data/elite-redux/` sont générés, par un script **distinct** de `scrape:wiki` :

```bash
pnpm gen:elite <encounters|abilities|all> [--fresh] [--dry-run]
```

| Fichier généré | Source | Volume |
| --- | --- | --- |
| `encounters.ts` | `wild_encounters.json` du decomp, noms résolus depuis `species_names.h` | 142 zones, 635 espèces |
| `abilities.ts` | `AbilityList.textproto` de `er-config` | 1 039 talents |

Mêmes règles que les scrapers Unbound : ne pas éditer la sortie, corriger
`scripts/lib/gen-<nom>.mjs` ; chaque générateur contrôle son compte et échoue plutôt que de rendre
un fichier amputé. Le cache vit dans `.cache/elite-redux/`.

**Aucun id de ces deux fichiers n’est persisté** — ce sont des données de consultation, pas des
cases à cocher. Une régénération ne peut donc pas faire perdre de progression, contrairement au
contenu adossé au wiki d’Unbound où l’id *est* le contrat avec la sauvegarde.

Trois pièges que les parseurs traitent explicitement, et qu’il faut connaître avant d’y toucher :
une table terrestre a **12 slots, pas 12 espèces** (compter les espèces uniques fait passer une
table valide pour tronquée) ; `hidden_mons` est à taux 0 et remplie de données de test, donc **ne se
publie pas** ; et les formes régionales **partagent le nom de base** (`SPECIES_MEOWTH_GALARIAN` rend
« Meowth »), d’où une table de suffixes fermée et un contrôle de libellés ambigus.

Pour le reste (objets, consommables, rubriques de farm, mécaniques, natures, glossaire), copie une
entrée voisine : ces contenus ne sont pas persistés, leur id ne sert qu’à la clé de rendu.

**De la prose** (analyse, mécanique, farming) s’écrit en tableau de `Block` : `p`, `list`, `quote`,
`table`, `code`. Le formatage inline supporte `**gras**`, `*italique*` et `` `code` ``.

### Complétion

La roadmap du guide a été retirée : ses phases 0 à 4 étaient faites, et seule la **Battle Frontier**
en restait — elle est devenue la première section de `/completion`. Le reste de la page inventorie ce
que le guide ne couvre pas, depuis unboundwiki : missions, légendaires, Mega Stones, Key Items, move
tutors, Zygarde Cells, raid dens. `app/utils/completion.ts` aplatit ces cinq fichiers en une seule
forme, pour que la page et le comptage n’aient qu’une liste à parcourir.

Deux règles s’y appliquent, et `pnpm validate` les fait respecter :

- **`source` est obligatoire** — une section du guide (`'§9.1'`) ou l’URL consultée. Hors du guide,
  rien ne s’écrit ici qui n’ait été lu sur `unboundwiki.com` ou `romhackdex.net` ; §12 a déjà perdu
  trois quêtes faute d’avoir pu les vérifier.
- **La progression se mesure sur deux axes, et les fondre est interdit.** `overall` compte ce qui est
  *actionnable* et ordonné — la Frontier et les fiches des six actifs, avec leurs `requires`, qui
  alimentent « prochaines actions ». `completion` compte la *collection*, qui n’a ni ordre ni
  dépendances. Les additionner noierait six tâches sous trois cent cinquante cases et ferait chuter
  d’un coup l’avancement d’une partie en cours.

Une entrée marquée `repeatable` — raid den, move tutor — **reste affichée une fois cochée** : elle se
refait indéfiniment, cocher y veut dire « déjà fait au moins une fois », pas « rayé de la liste ».

> ⚠️ **Ne renomme jamais un `id` existant.** Un libellé peut changer librement ; changer un id perd la
> case cochée correspondante dans les sauvegardes déjà écrites. Cela vaut pour toutes les ressources
> persistées : `npc:`, `goal:`, `mission:`, `tutor:`, `raid:`, `cell:`, `item:`.

Après toute modification de contenu :

```bash
pnpm check    # validation du contenu + typecheck + tests unitaires
```

`pnpm validate` contrôle : ids uniques (tâches, fiches, PNJ, objets, quêtes, farm), libellés non vides,
`requires` résolus, absence de cycle, liens internes valides, **collisions de clés persistées** entre
catégories, **composition par défaut occupant exactement les slots 1 à 6**, conformité de chaque fiche
au contrat ci-dessous, existence des fichiers de sprite déclarés, sprites orphelins, et **déclaration
des icônes utilisées hors template** (voir plus bas).

### Fiches Pokémon

Une fiche par fichier dans `app/data/unbound/pokemon/<slug>.ts`, assemblées par un `index.ts` **généré**. On ne
les écrit pas à la main : elles sont rédigées en JSON — le contrat est dans
[`docs/fiche-pokemon.md`](docs/fiche-pokemon.md), fait pour être collé dans un prompt — puis intégrées
par un script qui valide tout avant d’écrire quoi que ce soit.

```bash
pnpm new:pokemon Lucario                  # imprime un squelette JSON conforme au contrat
pnpm import:pokemon lucario.json --dry-run # valide et affiche, n’écrit rien
pnpm import:pokemon lucario.json           # écrit la fiche, régénère le barrel, résout le sprite
pnpm sprites                               # télécharge les images déclarées
pnpm check
```

L’import refuse plutôt que d’écrire à moitié : slug déjà pris, id de tâche en collision, type mal
orthographié, nature absente de `natures.ts`, `requires` mort, champ inventé, EV au-delà de 510. Il
attribue lui-même le slot — la première place libre, et jamais un septième membre.

**Le sprite se résout tout seul** depuis `name` (en VO) : le script interroge
[pokemondb](https://pokemondb.net/sprites), vérifie le slug et détermine le jeu du sprite pixel (une
espèce postérieure à Noir/Blanc n’y figure pas). Les images sont versionnées dans `public/sprites/` —
l’app est hors-ligne, une image distante serait invisible réseau coupé.

Pour retirer une fiche :

```bash
pnpm rm:pokemon lucario --dry-run   # ce qui serait supprimé
pnpm rm:pokemon lucario
```

Il supprime le module et les sprites, renumérote les slots pour ne pas laisser de trou, **refuse** tant
qu’un `requires`, un lien interne ou un test de fumée référence la fiche (`--force` passe outre), et
liste les clés de sauvegarde devenues orphelines — à balayer dans l’app via **Sauvegarde → Nettoyer**.

Les fiches **Excadrill** et **Rotom-Wash** portent `incomplete: true` : le guide les place dans
l’équipe (§7.3) sans leur consacrer de fiche en §6. `/equipe` les regroupe sous « Fiches à compléter ».

## Mise en page

Trois composants portent toute la mise en page ; l’échelle d’espacement est documentée en tête de
`app/assets/css/main.css` et ne doit pas être recopiée à la main.

- **`SectionBlock`** — une section : titre, description, slot `action` à droite. Une page n’a jamais de
  `<h1>` : le titre est rendu par la barre du layout.
- **`AppCard`** — la boîte : `density` (`comfortable` / `compact`), `tone` (`plain` / `raised`),
  `interactive`, et `to` pour en faire un lien.
- **`PokemonSprite`** — sprite d’une fiche, `variant` `home` ou `pixel`, avec repli si la fiche n’a pas
  de sprite.

## Sauvegarde

Un objet JSON par jeu dans `localStorage` — `pokemon-companion:save` pour Unbound,
`pokemon-companion:save:elite-redux` pour Elite Redux. Même forme dans les deux cas :

- `tasks` — uniquement les choix explicites de l’utilisateur ; une tâche absente retombe sur le `done`
  du contenu, donc ajouter une tâche plus tard ne casse aucune sauvegarde
- `pokemon` — par slug : build choisi, niveau, IV, EV, nature, talent, moveset, objet, notes
- `roster` — l’écart entre la composition du guide (§7.3) et celle réellement jouée, par slug :
  `status` et `slot`. Vide tant qu’on n’a rien échangé — faire tourner un membre est la phase 4 du
  guide, pas une correction de contenu, donc ça n’a rien à faire dans `app/data/`
- `resources` — tout ce qui se coche hors tâches, sous des clés **préfixées** : `npc:`, `goal:`,
  `mission:`, `tutor:`, `raid:`, `cell:`, `item:`. Le préfixe n’est pas décoratif — `portal-purge` est
  à la fois la mission #050 et le nom d’une section de complétion
- `counters`, `journal`, `version`, `updatedAt`

`normalize()` reconstruit la sauvegarde champ par champ depuis `createEmptySave()` : un champ ajouté
plus tard se remplit de sa valeur par défaut, sans bump de `SAVE_VERSION`. C’est ainsi que `resources`
est apparu sans casser les sauvegardes v1.

Une sauvegarde d’une version **antérieure** passe par `migrations` (`app/utils/migrations.ts`), indexé
par la version d’origine. `SAVE_VERSION` vaut **2** : `migrations[1]` reporte les anciennes clés
`quest:` vers `mission:`, puisque les six quêtes du guide font partie des 84 missions — et déplie le
lot « objets-pouvoir » sur les cinq missions qui donnent un Power item. Ce code est le seul à
*réécrire* une progression acquise, donc il vit hors du composable et `pnpm test:migration` le couvre :
ne pas y toucher sans étendre le test. Seule une version **postérieure** au code est refusée : la
relire à la baisse perdrait ce qu’elle sait en trop.

### Synchronisation entre appareils

La sauvegarde vit dans un **gist privé** du compte GitHub du joueur. L’app étant un site statique,
il n’y a pas de serveur où faire vivre un backend — le gist est un stockage qu’on possède déjà,
privé, sans compte à créer ni service à payer.

Menu Sauvegarde → *Synchronisation*, puis un token collé sur chaque appareil. Le gist est retrouvé
par ses noms de fichier, pas par son id : relier un second appareil ne demande donc rien d’autre que
le token.

**Un seul gist, un fichier par jeu.** Celui d’Unbound garde son nom d’origine
(`pokemon-companion.json`), donc un gist déjà en place continue de fonctionner sans rien faire ; Elite
Redux prend `pokemon-companion.elite-redux.json`. Chaque jeu a aussi son propre marqueur de synchro,
et une configuration antérieure au multi-jeux voit son marqueur unique **repris sur Unbound** —
le jeter ferait passer la synchro suivante pour une divergence, donc un écrasement. `sync()` ne
traite que le jeu ouvert ; changer de jeu en relance une.

Le token doit être **classic**, avec la portée **`gist` et rien d’autre**
([lien pré-rempli](https://github.com/settings/tokens/new?scopes=gist&description=Pok%C3%A9mon%20Companion)).
Les tokens *fine-grained* ne conviennent pas : GitHub ne leur donne aucune permission sur les gists.
Contrepartie assumée : la portée `gist` couvre **tous** les gists du compte, pas seulement celui de
l’app — c’est le grain le plus fin que GitHub propose ici.

Le `localStorage` **reste la source de vérité**. La synchro est un aller-retour opportuniste
par-dessus, déclenché à l’ouverture de l’app, au retour du réseau, et au retour sur l’onglet — ce
dernier cas étant le courant sur téléphone, où l’app passe en arrière-plan sans jamais se fermer.
Elle ne bloque jamais l’interface : hors-ligne, on coche, et l’envoi part plus tard.

Le token est rangé sous `pokemon-companion:sync`, **hors de `SaveState`** : il ne part ni dans le
gist, ni dans un export JSON, et la purge ne le voit pas.

**Conflits : le plus récent gagne**, sans fusion. La décision est prise par `decideSync`
(`app/utils/sync.ts`), isolée du réseau et testée par `pnpm test:sync` — c’est le seul endroit du
code qui peut faire perdre une progression. Deux points s’y jouent :

- un appareil neuf a un `updatedAt` plus récent que le distant alors qu’il est vide ; sans le
  contrôle `isPristineSave`, il écraserait des mois de progression dès la première ouverture ;
- quand les deux côtés ont vraiment divergé, le perdant part en copie de secours avant d’être
  écrasé, et un avertissement persistant le signale.

### Copie de secours

Ce qui n’est pas relu n’est pas perdu. Avant d’abandonner une sauvegarde illisible, `hydrate()` en
recopie les octets bruts sous la clé de secours du jeu (`pokemon-companion:save:backup`, et
`…:save:elite-redux:backup`) — sans quoi le premier `persist()` venu les écraserait en silence, à la
première case cochée. La remise à zéro passe par le même filet.

L’échec se voit à l’écran : alerte persistante au chargement, bouton du menu en `warning`, et une entrée
pour retélécharger la copie. Elle réapparaît tant que la sauvegarde illisible est encore là — se taire
au second chargement supprimerait le seul chemin vers la copie. `pnpm smoke:features` couvre les deux
cas, rejet et sauvegarde saine.

Le menu **base de données** de l’en-tête permet d’exporter, d’importer, de **nettoyer** et de
réinitialiser. C’est aussi le moyen de transférer sa progression vers le téléphone : exporter ici,
importer là-bas.

**Nettoyer** retire les clés qui ne correspondent plus à aucun contenu — la trace que laisse une fiche
supprimée ou une tâche retirée. `normalize()` conserve en effet tout ce qu’il reconnaît par sa forme :
sans purge, ces clés survivent à chaque chargement et voyagent dans chaque export, invisibles. La purge
est explicite et jamais automatique : une fiche peut aussi avoir disparu le temps d’une branche git.

## Vérifier

Sans navigateur, sur le code :

```bash
pnpm check          # = validate + test:stats + test:roster + test:fiche + test:sync
                    #   + test:migration + typecheck
pnpm validate       # pour chaque jeu : ids uniques, requires résolus, aucun cycle, sources
                    # renseignées, nav cohérente avec les pages fournies, clés de contenu
                    # toutes présentes dans knownContent (sinon la purge les effacerait) ;
                    # pour Unbound : cohérence des fiches et comptes du généré (84/100/32)
pnpm test:stats     # logique EV/IV, y compris les cas limites de §2.2
pnpm test:roster    # invariants de composition (six slots, pas de trou) et purge de sauvegarde
pnpm test:fiche     # contrat de fiche : validateur, et aller-retour d’impression sur les 12 fiches
pnpm test:sync      # décision de synchronisation, isolée du réseau
pnpm test:migration # report des clés `quest:` vers `mission:`, y compris ses cas dégénérés
```

Avec navigateur — **indispensable** : l’app est un SPA, le build ne prérend rien, donc ni `typecheck`
ni `generate` ne peuvent détecter une erreur de rendu.

```bash
pnpm dev            # dans un terminal
pnpm smoke          # dans un autre : toutes les routes des deux jeux × 2 viewports
                    # (1280 et 375 px), échoue sur toute erreur console, page vide ou
                    # débordement horizontal ; vérifie le CLOISONNEMENT des sauvegardes
                    # (cocher chez un jeu n'écrit pas chez l'autre), le sélecteur de jeu,
                    # les sections facultatives de /reference (rendues chez Elite Redux,
                    # absentes chez Unbound) et leurs recherches, la persistance et
                    # l'aller-retour export/import
pnpm smoke:features # critères « Endgame Ready » déduits, détection d'objet en double,
                    # CRUD du journal
```

Sur le build de production, pour la partie PWA :

```bash
pnpm generate
pnpm serve:pages                    # dans un terminal
pnpm smoke:offline http://localhost:3200
```

> ⚠️ **Ne teste pas la PWA avec `pnpm preview`.** Nitro résout des chemins qu’un hébergeur statique
> renvoie en 404 (`/200` pour `200.html`), ce qui masque les bugs de déploiement. `pnpm serve:pages` ne
> fait que du fichier brut, avec le repli `404.html` de GitHub Pages.

Pour reproduire un déploiement en sous-chemin (dépôt de projet GitHub Pages) :

```bash
NUXT_APP_BASE_URL=/pokemon-companion/ pnpm generate
pnpm serve:pages /pokemon-companion
pnpm smoke:offline http://localhost:3200/pokemon-companion
```

`smoke:offline` existe parce que quatre régressions y sont passées :

- **les icônes déclarées dans un `.ts` n’étaient pas embarquées** : `clientBundle.scan` ne lit que les
  templates, donc les 5 icônes de la nav et les 4 des compteurs étaient absentes du bundle — et
  `@nuxt/icon` rend alors un `<svg>` **vide**, sans erreur. L’ancienne assertion « au moins 5 `<svg>`
  dans la nav » passait donc au travers ; elle vérifie désormais le *contenu* de chaque icône, et
  `pnpm validate` échoue si une icône n’est pas listée dans `icon.clientBundle.icons` ;

- les icônes étaient téléchargées depuis `api.iconify.design` à chaque chargement, donc invisibles
  hors-ligne → `icon.clientBundle.scan` ;
- le mode de rendu CSS des icônes injecte son `mask-image` dynamiquement, ce qui les laissait vides sur
  un build statique → `icon.mode: 'svg'` ;
- le précache du service worker incluait `200.html` et `404.html` sous les URLs sans extension `200` et
  `404`, que GitHub Pages renvoie en 404 : **l’installation du service worker échouait entièrement**, et
  l’app perdait tout son mode hors-ligne → `workbox.globIgnores`. Un serveur Nitro résolvant ces chemins,
  le bug était invisible avec `pnpm preview`.

Le `navigateFallback` du service worker est ce qui permet d’ouvrir `/equipe/tyranitar` hors-ligne, et
`app/plugins/pwa.client.ts` enregistre le service worker à la main — le plugin du module
`@vite-pwa/nuxt` n’enregistre rien derrière un sous-chemin.

## Construire et déployer

```bash
pnpm generate        # sortie statique dans .output/public (~1,4 Mo)
pnpm serve:pages     # la servir comme un hébergeur statique
```

### GitHub Pages

`.github/workflows/deploy.yml` construit et publie à chaque push sur `main`. Il lance `pnpm check` avant
le build : un `requires` mort ou un id de tâche dupliqué n’atteint jamais la production.

Côté GitHub, une fois le dépôt distant créé : **Settings → Pages → Source : GitHub Actions**.

Le workflow renseigne `NUXT_APP_BASE_URL=/<nom-du-depot>/` automatiquement, ce dont dépendent les URLs
d’assets, le scope du service worker et le manifest. Si tu passes sur un dépôt utilisateur
(`<pseudo>.github.io`) ou un domaine personnalisé, mets `NUXT_APP_BASE_URL: /` dans le workflow.

`public/.nojekyll` est nécessaire : sans lui, GitHub Pages ignore le dossier `_nuxt/` (préfixe underscore).

### Autre hébergeur

`.output/public` se déploie tel quel. L’hébergeur doit renvoyer le shell du SPA pour toute route inconnue :
`404.html` est identique à `index.html`, ce qui suffit à GitHub Pages, et un `200.html` est également
généré pour Netlify et Surge.

### Sur le téléphone

Ouvrir l’URL (HTTPS requis pour installer une PWA), puis « Ajouter à l’écran d’accueil ». L’app fonctionne
ensuite hors connexion. La progression étant locale au navigateur, transfère-la via **exporter** ici puis
**importer** là-bas.

Les icônes PWA sont générées depuis `public/favicon.svg` :

```bash
pnpm icons
```
