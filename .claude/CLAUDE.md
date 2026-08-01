# Pokemon Companion

Companion de suivi de mes parties de hack ROMs Pokémon. **L'app est multi-jeux** : aujourd'hui
**Pokémon Unbound** (post-game, partie avancée) et **Pokémon Elite Redux** (mode Elite, partie qui
démarre).

## Contexte

J'ai construit avec Claude Web un document de suivi de mon parcours post-game de Pokémon Unbound.

Ce [document](../docs/guide_endgame_pokemon_unbound_v2%203ac169213df18014bcb7f8b3a586c169.md) avait deux limitations :

- le confort de lecture : un grand fichier markdown m'obligeait à remonter/descendre toute la page constamment ;
- le suivi de progression se limitait à une checklist et n'était pas très engageant.

## Objectif

Faciliter mon suivi via une application web qui me permette de suivre mes progrès et de noter mes notes
et statistiques simplement et rapidement. Navigation fluide et organisée, mobile-friendly.

**État : l'application est construite et fonctionnelle.** Le guide markdown reste archivé dans `docs/`
pour l'historique de la démarche, mais **il n'est plus une source de vérité** : la partie a
progressé au-delà de ce qu'il couvre, et une relecture (2026-08) y a trouvé des erreurs factuelles
(talents cachés, movesets). Pour toute donnée Pokémon, voir la référence externe ci-dessous.

## Décisions techniques prises

| Sujet | Choix | Raison |
| --- | --- | --- |
| Framework | Nuxt 4 + Nuxt UI v4, pnpm | terrain connu, composants et thème mobile-first gratuits |
| Rendu | SPA (`ssr: false`) | l'état vit dans le `localStorage` ; aucun intérêt au prerender, zéro risque de mismatch d'hydratation |
| Contenu | découpé en TypeScript dans `app/data/` | `satisfies` fait échouer le build sur un id invalide, ce qui protège la sauvegarde |
| Persistance | `localStorage` + export/import JSON | pas de backend, pas de compte, hors-ligne |
| Multi-appareils | gist privé GitHub, « le plus récent gagne » | seul stockage déjà possédé par le joueur ; l'hébergement statique interdit un backend |
| Accès | build statique + PWA installable | consultable sur téléphone, y compris hors connexion |
| Navigation | dashboard + Complétion / Équipe / Ressources / Journal, + Référence | la complétion a remplacé la roadmap : le guide est dépassé, seule la Battle Frontier en restait |
| Multi-jeux | **une clé `localStorage` par jeu**, routes préfixées `/<jeu>/…` | `pokemon-companion:save` reste à l'octet près la sauvegarde Unbound : aucun bump de `SAVE_VERSION`, aucune migration, donc aucun risque sur la partie en cours. Une URL veut toujours dire la même chose. |
| Engagement | progression visuelle + « prochaine action » calculée | retenu ; la gamification (badges, streaks) a été écartée |

TypeScript est épinglé en **5.9** : `vue-tsc` n'est pas encore compatible avec TypeScript 7.

## Règles de travail sur ce projet

- **Ne jamais renommer un `id` existant.** Les libellés peuvent changer librement ; les ids sont le
  contrat avec les sauvegardes déjà écrites. Cela vaut pour les tâches (`phase-<n>.<m>`,
  `mon-<slug>-<n>`, `ready-<slug>-<key>`) **et pour toutes les ressources**, persistées sous une clé
  préfixée : `npc:`, `goal:`, `mission:`, `tutor:`, `raid:`, `cell:`, `item:`. Le préfixe évite des
  collisions réelles — `objets-pouvoir` est à la fois un consommable et l'ancien lot de quêtes,
  `portal-purge` est à la fois la mission `#050` et le nom d'une section de complétion. Deux ids
  n'ont plus le droit d'exister **chez Unbound** : `phase-0.x` à `phase-4.x` (roadmap du guide,
  retirée) et `quest:` (`quests.ts` absorbé par `missions.ts`) — des sauvegardes les portent encore,
  **ne jamais les réattribuer à autre chose**.
  ⚠️ **Depuis le multi-jeux, les ids ne sont uniques que _par jeu_.** Chaque jeu a sa propre clé de
  sauvegarde, donc les `phase-1.x` d'Elite Redux ne rencontrent jamais ceux, retirés, d'Unbound. La
  réserve ci-dessus vaut donc pour Unbound et lui seul. À l'intérieur d'un jeu, la règle est
  inchangée. `pnpm validate` contrôle l'unicité par jeu.
- **La progression se mesure sur deux axes, et les fondre est interdit.**
  `overall` compte ce qui est *actionnable* et ordonné — les tâches de phase
  (`app/data/<jeu>/phases.ts`) et celles des fiches Pokémon actives. Elles ont des `requires`, un poids, et
  alimentent « prochaines actions ». `completion` compte la *collection* : objectifs éditoriaux
  (`completion.ts`), missions, PNJ, move tutors, raid dens, Zygarde Cells, objets clés. Ces
  entrées-là n'ont ni dépendances ni ordre et n'entrent **jamais** dans « prochaines actions ».
  Verser l'une dans l'autre ferait chuter d'un coup l'avancement d'une partie en cours — c'est la
  raison d'origine du cloisonnement, et elle n'a pas changé.
- **Le champ `source` est obligatoire sur toute entrée de complétion**, et `pnpm validate` le vérifie
  **pour tous les jeux** : soit une section du guide (`§9.1`), soit l'URL consultée. Rien ne s'y écrit
  qui n'ait été lu sur romhackdex, unboundwiki, ou — pour Elite Redux — le code ouvert du jeu. Ne jamais y recopier une entrée qui existe déjà ailleurs — l'accès à la
  Frontier est `phase-5.4`, l'échange Hard Stones → Gems est la mission `#010`.
- **Missions, tutors, collectibles et objets clés sont des fichiers _générés_.** Le cycle est
  `pnpm scrape:wiki <missions|collectibles|tutors|items|all>`, puis relecture, puis `pnpm check`.
  Corriger `app/data/unbound/missions.ts` à la main, c'est perdre la correction à la régénération suivante :
  une donnée fausse se corrige dans le parseur (`scripts/lib/scrape-<nom>.mjs`) ou se signale au
  wiki. Chaque module de catégorie exporte `scrape({ fresh })` et **doit** contrôler son compte
  d'entrées avec `expectCount()` — un parseur cassé ne lève pas, il rend moins d'entrées, et sans ce
  garde-fou une régénération remplacerait 84 missions par trois en silence. Les pages sont mises en
  cache dans `.cache/wiki/` ; `--fresh` l'ignore.
- **Passer par `pnpm new:npc` / `new:task` / `new:goal`** pour ajouter du contenu écrit à la main : les
  scripts impriment le squelette avec la bonne convention d'id et refusent un id déjà pris.
- **Une fiche Pokémon ne s'écrit pas à la main.** Une fiche par fichier dans `app/data/unbound/pokemon/<slug>.ts`,
  assemblées par un `index.ts` **généré** — ne pas éditer la liste du barrel, la régénérer. Le cycle est :
  `pnpm new:pokemon <Nom>` (squelette JSON) → rédaction selon `docs/fiche-pokemon.md` → `pnpm
  import:pokemon <fichier> [--dry-run]` → `pnpm sprites` → `pnpm check`. Retrait : `pnpm rm:pokemon <slug>`.
  `scripts/lib/fiche.mjs` est la seule définition du contrat : `validate` et l'import l'appliquent tous
  les deux, ils ne doivent jamais diverger.
- **La composition jouée vit dans la sauvegarde, pas dans le contenu.** `status` et `slot` d'une fiche
  sont la composition *du guide* (§7.3) ; l'écart est persisté sous `roster` et se modifie dans l'app
  (/equipe → Modifier). Ne pas éditer une fiche pour faire tourner un membre — c'est la phase 4 du
  guide, pas une correction de contenu. Tout ce qui compte l'équipe passe par `useRoster()`, jamais par
  les exports statiques `activePokemon` & co., calculés à l'import et donc figés.
- **Mise en page : `SectionBlock`, `AppCard`, `PokemonSprite`.** L'échelle d'espacement est documentée
  en tête de `app/assets/css/main.css` ; ne pas recopier les classes de boîte à la main. Une page n'a
  jamais de `<h1>` — la barre du layout rend le titre.
- **Un sprite se résout puis se télécharge.** `pnpm import:pokemon` interroge pokemondb depuis `name`,
  vérifie le slug et inscrit le jeu du sprite pixel (`spritePixelSet`) quand l'espèce est postérieure à
  Noir/Blanc — ne plus coder d'exception en dur dans `fetch-sprites.mjs`. Les images vivent dans
  `public/sprites/`, versionnées : l'app est hors-ligne, une image distante serait invisible réseau
  coupé. `pnpm validate` échoue si un sprite déclaré manque sur le disque, refuse un `sprite: ''` (falsy,
  il sautait tout contrôle) et signale les images sans fiche.
- **Prose en français, noms propres du jeu en VO.** La partie se joue en anglais : **tout ce que
  l'écran affiche** s'écrit comme l'écran l'affiche — types, natures, talents, capacités, objets,
  noms d'espèces, lieux, PNJ, quêtes, et jusqu'aux **libellés de statistiques** (`HP`, `Atk`, `Def`,
  `SpA`, `SpD`, `Spe` en court ; `Attack`, `Sp. Atk`… en long, voir `STAT_LABELS` dans
  `app/utils/stats.ts`) et aux abréviations (`TM`, `HM`, jamais `CT`/`CS`). Les phrases, elles,
  restent en français : on traduit le nom, pas la prose autour. Un libellé descriptif qui n'existe
  pas en jeu suit le motif **descripteur français + nom VO** — « Améliorateur Lucky Egg »,
  « Marché de baies (purge EV) », « Hard Stones → Gems ». Les `slug` et les `id` antérieurs à cette
  bascule ne se renomment jamais — `motisma-lavage` reste l'id de Rotom-Wash, `orbe-vie` celui de la
  Life Orb ; l'écart id/libellé est assumé. `POKEMON_TYPES` et la colonne `en` de `natures.ts` sont
  les seules listes fermées qui le font respecter, et elles ne couvrent que les fiches Pokémon : pour
  le reste du contenu, la règle tient à la relecture, il n'y a pas de contrôle automatique. La
  colonne `fr` de `natures.ts` reste néanmoins nécessaire — `toNatureEn()` et `matchesNature()` s'en
  servent pour relire les natures saisies en français dans les sauvegardes antérieures.
- **Ne rien deviner : deux références, deux périmètres.** Le guide donne les *décisions de build*
  (pourquoi ce Pokémon, ce rôle), mais plus les *faits*. Ceux-ci se lisent, jamais ne s'inventent, et
  l'autorité dépend de ce qu'on cherche :
  - **[romhackdex.net/unbound](https://romhackdex.net/unbound/)** — seule autorité sur les **données
    Pokémon** : stats, types, talents, learnset (TM, niveau, Move Relearner, tuteur), obtention,
    localisation sauvage, effets d'objets. Chemins `/pokedex/<slug>/`, `/moves/`, `/abilities/`,
    `/locations/`, `/items/`.
  - **[unboundwiki.com](https://unboundwiki.com/)** — autorité sur le **contenu de monde et de
    progression**, c'est-à-dire tout ce que romhackdex ne couvre pas : missions (`/missions/`), lieux
    (`/locations/`), PNJ à service (`/misc-info/useful-npcs/`), move tutors
    (`/misc-info/move-tutors/`), raid dens (`/raid-dens/`), collectibles (`/items/zygarde-cells/`),
    objets clés (`/items/key-items/`), Mega Stones (`/mega-stones/`), Black Trainer Card, Battle
    Frontier, événements quotidiens et Game Corner (`/extras/`).

  ⚠️ **L'avertissement sur unboundwiki tient toujours, mais seulement sur son hors-périmètre** : sur
  une *donnée Pokémon*, il a été pris à recopier des valeurs du jeu officiel divergentes d'Unbound
  (talent caché de Dusknoir, relecture 2026-08), donc toute donnée Pokémon lue là-bas se confirme sur
  romhackdex. Ne pas étendre ce doute au contenu de monde, où il est la seule source et où il s'est
  montré fiable et régulier.

  Ce qui reste invérifiable garde `incomplete: true` et l'UI affiche « fiche à compléter » — voir
  Sceptile. On ne comble pas un trou par une supposition.

  ⚠️ **romhackdex bloque `WebFetch`** (403, anti-bot) — passer par `curl` avec un
  `User-Agent` de navigateur (`curl -s -A "Mozilla/5.0 ..." -L <url>`) pour le lire depuis Claude Code.
  **La même précaution vaut pour unboundwiki** : `curl` avec un User-Agent de navigateur est la voie
  vérifiée (c'est ce que fait `scripts/lib/wiki.mjs`). Le wiki est un WordPress dont le sitemap
  énumère les 1 500 pages : `sitemap_index.xml` → `page-sitemap.xml` et `wiki-sitemap1..8.xml`.
  Deux pièges rencontrés en le parsant, à ressortir avant d'écrire un parseur : les titres de section
  sont des `<h3>` là où on attend des `<h2>`, et **le balisage des tables d'info est invalide**
  (`<tr>` non fermés, `<td>` refermé par un `</th>`) — lire les cellules jusqu'à la balise de cellule
  suivante, jamais se fier aux lignes.
  Le tableau des capacités liste, pour chaque section (Level Up / TM / HM / Tutor / Egg Moves), la
  **seule** vraie source d'acquisition : une capacité listée uniquement en Tutor ou en Egg Moves
  n'est **pas** proposée par le Move Relearner, qui ne reteache que les capacités de niveau oubliées
  — erreur trouvée sur plusieurs fiches en 2026-08 (Iron Head d'Excadrill, Pain Split de Rotom-Wash,
  Dragon Dance de Tyranitar, Roost de Togekiss/Gliscor, Psyshock de Slowbro).
  [ydarissep.github.io/Unbound-Pokedex](https://ydarissep.github.io/Unbound-Pokedex/) n'est **pas**
  utilisable comme référence automatisée : c'est un outil client-side qui parse une ROM importée
  dans le navigateur, sans données statiques accessibles par `WebFetch` ou `curl`.
- **Ne jamais référencer un composant par son nom dans `:is`.** `:is="'NuxtLink'"` ne résout pas : Vue
  rend un élément littéral `<nuxtlink>`, donc aucun `<a>` et aucune navigation — sans la moindre erreur.
  Importer le composant depuis `#components` (voir `AppCard.vue`). `pnpm smoke` échoue désormais sur
  toute balise de composant non résolue dans le DOM.
- **Même famille de piège : `UBadge` ignore `:to`.** Il rend un `<span>`, donc un badge d'apparence
  cliquable qui ne navigue nulle part, sans erreur. Envelopper dans un `NuxtLink` (voir le badge
  « Complétion » du dashboard). Vérifier une navigation en cherchant un `<a href>` dans le DOM, jamais
  en se fiant à l'apparence.
- **`pnpm typecheck` peut passer sur des types périmés.** `pnpm check` lance donc `nuxt prepare` d'abord :
  une erreur de `nuxt.config.ts` est restée invisible jusqu'à une régénération.
- **La sauvegarde se synchronise entre appareils via un gist privé.** Le `localStorage` reste la
  source de vérité ; `useSync` n'est qu'un aller-retour opportuniste par-dessus, qui ne bloque
  jamais l'interface. Toute la logique qui peut faire *perdre* une progression vit dans
  `app/utils/sync.ts`, isolée du réseau et testée par `pnpm test:sync` — `useSync` ne fait
  qu'exécuter son verdict. Ne jamais y toucher sans étendre le test. Le garde-fou central est
  `isPristineSave` : un appareil neuf est toujours « plus récent » que le distant, donc sans lui la
  règle « le plus récent gagne » écraserait tout à la première ouverture. Le token vit sous
  `pokemon-companion:sync`, **hors de `SaveState`** — il ne doit jamais entrer dans `knownContent`
  ni dans un export.
- **Ce que `normalize()` refuse n'est plus perdu.** Une sauvegarde illisible est recopiée telle quelle
  sous `pokemon-companion:save:backup` avant d'être abandonnée, et l'échec se voit à l'écran — avant,
  c'était un `console.warn` que le premier `persist()` rendait définitif. Une version *antérieure*
  passe par `migrations` (indexé par la version d'origine, vide aujourd'hui) ; seule une version
  *postérieure* au code reste refusée. Ne pas ajouter de bump de `SAVE_VERSION` pour un simple champ
  ajouté : `normalize()` retombe déjà sur le défaut de `createEmptySave()`.
- **Une clé de sauvegarde qui perd son contenu ne disparaît pas toute seule.** `normalize()` conserve
  tout ce qu'il reconnaît par sa forme. Après toute suppression de contenu, la purge se fait dans l'app
  (Sauvegarde → Nettoyer) ; l'ensemble des clés légitimes est `knownContent` dans `useSave.ts` — y
  penser en ajoutant une catégorie persistée, sinon la purge effacerait des cases valides. Le test de
  purge travaille sur un ensemble synthétique et ne peut pas voir cet oubli : c'est `pnpm validate` qui
  relit la source de `useSave.ts` pour vérifier que `completionGoalKeys` y est bien inscrit.
- **Vérifier avec `pnpm check`, puis `pnpm smoke` et `pnpm smoke:features`** (serveur de dev lancé), et
  `pnpm smoke:offline` sur le build de production quand on touche à la PWA ou aux icônes. L'app étant un
  SPA, ni `typecheck` ni `generate` ne détectent une erreur de rendu : seul le test navigateur le fait.
- Ce document et le README sont écrits au fil de l'eau et maintenus à jour.
- **Sonnet et Haiku au maximum ; Opus est réservé à l'orchestration et aux tâches les plus
  complexes.** C'est le défaut, pas une suggestion. Relèvent de Sonnet/Haiku : écrire un parseur de
  table une fois le motif établi, transcrire des données, appliquer un motif connu à N fichiers,
  toute tâche dont la sortie est *falsifiable* — un contrôle de compte, un test, un typecheck.
  Restent sur Opus : la conception du modèle de données et des contrats d'id, tout ce qui peut faire
  perdre une progression (migrations, purge, sync), les arbitrages entre sources qui se contredisent,
  et **la relecture systématique de toute sortie déléguée avant intégration** — c'est la contrepartie
  du délestage, pas une option. Déléguer sans garde-fou vérifiable ne fait pas gagner de temps : la
  règle est de donner au sous-agent de quoi échouer bruyamment.
- S'arrêter et me poser la question dès qu'une alternative technique intéressante apparaît, qu'un choix
  produit n'est pas couvert, ou que le guide est ambigu.

## Trous du guide source — comblés

Il n'y a plus de fiche `incomplete`. Ce qui suit reste vrai **du guide**, pas de l'app : le garder
en tête avant de « corriger » un écart entre les deux.

Les phases 0 à 4 de sa roadmap ont été retirées de l'app en 2026-08 : la partie les avait dépassées.
Ce qu'elles disaient de vrai n'a pas disparu pour autant — les décisions de build vivent dans les
fiches Pokémon, les PNJ à service dans /ressources, et la Battle Frontier reste `phase-5.x`.

- **§6 n'a de fiche ni pour Excadrill ni pour Rotom-Wash**, alors que §7.3 les place aux slots 2
  et 4. Les deux ont été complétées depuis les données Unbound ; le guide, lui, garde des fiches
  complètes pour Dusknoir et Zeraora, tous deux sortis de l'équipe.
- **§7.3 assigne à Excadrill le Choice Band *et* Rapid Spin**, or l'objet verrouille sur la première
  capacité utilisée. La fiche assume la tension dans son build A et l'évite dans son build B — la
  note du build A le dit à l'écran, pas seulement dans le fichier.
- **Sceptile** n'avait pas de fiche : complétée depuis romhackdex. Au passage, **Mega Sceptile a
  *Technician* dans Unbound**, pas *Lightning Rod* comme dans le jeu officiel.
- **§6.7-B proposait Dusknoir comme mule à objets pour son talent caché *Frisk*** — faux dans
  Unbound, où son talent caché est **Iron Fist** (romhackdex, 2026-08). La fiche `mule-a-objets.ts`
  ne recommande plus que **Banette**, qui a réellement *Frisk* (en talent 2, pas caché).
- **§10.2 est périmé** : l'équipe de Frontier qu'il recommande met Zeraora en lead, alors que §6.5 et
  §7.3 le sortent de l'équipe. `phase-5.5` le signale plutôt que de recopier la contradiction.
- **§10.1 n'était pas suivi** : l'accès à la Frontier (barrière au nord de Seaport City, Frontier
  Card) est devenu `phase-5.4`, et conditionne `phase-5.1`.
- **Les tâches des fiches non actives ne comptent pas.** `trackedEntriesFor` ne suit que la Battle
  Frontier et les six actifs : les tâches ajoutées aux utilitaires §6.7 et aux sortants s'affichent sur leur
  fiche mais n'entrent ni dans la progression ni dans « prochaines actions ». C'est volontaire —
  élargir ce périmètre changerait les pourcentages d'une sauvegarde en cours.

## Notes

- La conversation ClaudeWeb donne davantage d'informations que n'en contient le guide : les ajouts se
  font dans `app/data/`, voir la section « Ajouter ou modifier du contenu » du README.
- Déploiement : **GitHub Pages**, via `.github/workflows/deploy.yml` (push sur `main`). Il reste à créer le
  dépôt distant et à régler *Settings → Pages → Source : GitHub Actions*.

## Pièges de déploiement déjà rencontrés

- **Ne jamais valider la PWA avec `pnpm preview`.** Nitro résout `/200` et `/404`, un hébergeur statique
  non. Utiliser `pnpm serve:pages` puis `pnpm smoke:offline`.
- Le précache du service worker incluait `200.html`/`404.html` sous les URLs `200` et `404` : GitHub Pages
  les renvoie en 404, ce qui faisait **échouer l'installation entière du service worker** et supprimait le
  hors-ligne, sans aucune erreur visible. D'où `workbox.globIgnores`.
- Le plugin d'enregistrement de `@vite-pwa/nuxt` n'enregistre rien derrière un sous-chemin : c'est
  `app/plugins/pwa.client.ts` qui s'en charge.
- `<link rel="manifest">` n'est pas injecté par le module — il est déclaré à la main dans `app.head.link`,
  et **uniquement hors dev** : le module PWA étant désactivé en dev, la requête retombe sur le shell HTML
  du SPA, que le navigateur signale en « Manifest: Line 1, column 1, Syntax error ».
- Tout chemin vers `public/` doit être préfixé par `app.baseURL` (voir `logo` dans le layout).
- **`icon.clientBundle.scan` ne scanne que les templates.** Une icône déclarée dans un `.ts`
  (`navigation.ts`, `counters.ts`) n'est jamais embarquée, et `@nuxt/icon` rend alors un `<svg>` **vide** —
  aucune erreur, rien à l'écran. Toute icône hors template doit être listée dans
  `icon.clientBundle.icons` ; `pnpm validate` échoue sinon. Ne jamais tester une icône en comptant les
  balises `<svg>` : vérifier leur contenu.


## Multi-jeux

L'app suit plusieurs jeux. Tout part de **`app/data/games.ts`**, seul endroit qui les connaît.

- **Une clé `localStorage` par jeu**, et c'est la décision structurante : `pokemon-companion:save`
  **reste exactement** la sauvegarde Unbound d'avant le multi-jeux, `pokemon-companion:save:elite-redux`
  est neuve. Conséquence voulue : `normalize()`, `migrations`, `SAVE_VERSION`, la purge et `decideSync`
  n'ont pas été touchés — ils opèrent toujours sur **un** `SaveState`. Ne jamais remplacer ça par un
  objet enveloppe : ça imposerait de migrer une partie en cours, exactement ce qu'on évite.
  `saveKey` et `gistFile` d'Unbound ne se changent jamais.
- **Le jeu actif vit sous `pokemon-companion:game`**, hors de tout `SaveState` — c'est une préférence
  d'appareil, comme le token de sync. Jamais dans un export, jamais dans `knownContent`.
- **Les routes sont préfixées** (`/unbound/completion`). La **route est la source de vérité** : le
  middleware `app/middleware/game.global.ts` en déduit le jeu actif, et non l'inverse. Les anciennes
  URLs (`/completion`, `/equipe`…) y redirigent vers Unbound — des favoris PWA et le précache du
  service worker pointent encore dessus, et un 404 sur un hébergement statique ne se rattrape pas.
- **Les `link` de tâche sont relatifs à la racine du jeu** (`/equipe/tyranitar`) : c'est
  `buildTaskEntries` qui préfixe. Écrire un lien déjà préfixé donne `/unbound/unbound/…`, et
  `pnpm validate` le refuse.
- **Aucune constante de module ne doit dériver du contenu.** Le motif est partout le même : ce qui
  était une constante (`taskEntries`, `completionGroups`, `knownContent`) est devenu une fonction du
  `GameContent`, calculée une fois par jeu dans `defineGame()`. Une constante figerait le premier jeu
  importé.
- **`/ressources` et `/reference` sont facultatives.** Un jeu qui ne les fournit pas ne les met pas
  dans sa `nav`, et la page répond **404** plutôt que de se rendre vide. `pnpm validate` refuse une
  nav qui proposerait une page absente.
- **Les scripts de contenu sont spécifiques à Unbound** (`scrape:wiki`, `new:*`, `import:pokemon`,
  `rm:pokemon`, `sprites`) : ils visent unboundwiki et les conventions de son guide. Leur ajouter un
  `--game` serait de l'abstraction prématurée — un autre jeu aura ses propres sources.
- **La synchro garde un fichier de gist par jeu**, dans le même gist. Celui d'Unbound conserve son nom
  d'origine (`pokemon-companion.json`), donc un gist déjà en place continue de fonctionner.
  `SyncConfig.markers` est indexé par jeu, et `readMarkers()` **reprend l'ancien `marker` unique sur
  Unbound** : le jeter ferait passer la première synchro suivante pour une divergence, donc un
  écrasement. C'est testé par `pnpm test:sync`, et ça ne se touche pas sans étendre le test.
- **Le test qui valide l'architecture est le cloisonnement**, dans `pnpm smoke` : cocher une case chez
  un jeu ne doit rien écrire dans la sauvegarde de l'autre.

### Pokémon Elite Redux

Doc de référence hors-ligne dans **`docs/elite-redux/`** (description de la ROM, checklist de début
de partie, sources). Le contenu de l'app en est tiré.

- **Structure propre au jeu, et surtout pas un décalque d'Unbound** : quatre phases ordonnées
  (Débuter → Construire une équipe → Compléter le jeu → Post-game) plus un axe complétion.
- **Ce jeu n'a ni Zygarde Cells, ni Z-Crystals, ni missions numérotées, ni move tutors, ni raid
  dens** — vérifié dans son code. Un système de quêtes existe dans le moteur (`src/quests.c`) mais
  **n'est pas peuplé** : une seule quête réelle, le reste en `"Side Quest Name"`. Ne rien construire
  dessus.
- **Ses critères « Ready » diffèrent** : pas d'IV (31 par défaut dans ce jeu), et un critère
  `innates` à la place — les 3 talents passifs se débloquent en cours de partie et changent le build.
- **Difficulté et level caps sont deux réglages distincts.** Tous les sites tiers les confondent. En
  caps Elite : 16 avant le premier badge, puis 23 · 36 · 45 · 50 · 55 · 60 · 70 · 80.
- **Sources** : le jeu est open source, donc la donnée se lit dans le code plutôt que sur un wiki.
  `Elite-Redux/eliteredux-source` (level caps dans `src/pokemon.c`, encounters, starters) et
  `Elite-Redux/er-config` (`HelpArticles.textproto` = les articles d'aide affichés en jeu).
  ⚠️ `wiki.elite-redux.com` est **hors service** et `dex.elite-redux.com` injoignable en CLI (à
  ouvrir au navigateur). `eliteredux.net` et consorts sont des fermes SEO : ne jamais s'y fier ni y
  télécharger le patch — le patcher officiel est `elite-redux.com`.
