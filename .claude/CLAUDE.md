# Pokemon Companion

Companion de suivi d'une partie de Pokémon Unbound (post-game).

## Contexte

J'ai construit avec Claude Web un document de suivi de mon parcours post-game de Pokémon Unbound.

Ce [document](../docs/guide_endgame_pokemon_unbound_v2%203ac169213df18014bcb7f8b3a586c169.md) avait deux limitations :

- le confort de lecture : un grand fichier markdown m'obligeait à remonter/descendre toute la page constamment ;
- le suivi de progression se limitait à une checklist et n'était pas très engageant.

## Objectif

Faciliter mon suivi via une application web qui me permette de suivre mes progrès et de noter mes notes
et statistiques simplement et rapidement. Navigation fluide et organisée, mobile-friendly.

**État : l'application est construite et fonctionnelle.** Le guide markdown reste archivé dans `docs/`
comme source de vérité éditoriale, mais l'app le remplace à l'usage.

## Décisions techniques prises

| Sujet | Choix | Raison |
| --- | --- | --- |
| Framework | Nuxt 4 + Nuxt UI v4, pnpm | terrain connu, composants et thème mobile-first gratuits |
| Rendu | SPA (`ssr: false`) | l'état vit dans le `localStorage` ; aucun intérêt au prerender, zéro risque de mismatch d'hydratation |
| Contenu | découpé en TypeScript dans `app/data/` | `satisfies` fait échouer le build sur un id invalide, ce qui protège la sauvegarde |
| Persistance | `localStorage` + export/import JSON | pas de backend, pas de compte, hors-ligne |
| Accès | build statique + PWA installable | consultable sur téléphone, y compris hors connexion |
| Navigation | dashboard + Roadmap / Équipe / Ressources / Référence, + Journal | met l'action en avant tout en suivant la structure du guide |
| Engagement | progression visuelle + « prochaine action » calculée | retenu ; la gamification (badges, streaks) a été écartée |

TypeScript est épinglé en **5.9** : `vue-tsc` n'est pas encore compatible avec TypeScript 7.

## Règles de travail sur ce projet

- **Ne jamais renommer un `id` de tâche existant** (`phase-<n>.<m>`, `mon-<slug>-<n>`,
  `ready-<slug>-<key>`). Les libellés peuvent changer librement ; les ids sont le contrat avec les
  sauvegardes déjà écrites. **Depuis la v2, cela vaut aussi pour les ids de PNJ et de quête**, persistés
  sous les clés préfixées `npc:<id>` et `quest:<id>` — le préfixe évite une collision réelle
  (`objets-pouvoir` est à la fois un consommable et une quête).
- **Passer par `pnpm new:npc` / `new:quest` / `new:task`** pour ajouter du contenu : les scripts
  impriment le squelette avec la bonne convention d'id et refusent un id déjà pris.
- **Une fiche Pokémon ne s'écrit pas à la main.** Une fiche par fichier dans `app/data/pokemon/<slug>.ts`,
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
- **Ne pas deviner de données Pokémon.** Le guide est la source de référence. Là où il est muet, les
  données factuelles (stats, types, talents, learnset, obtention) se prennent sur
  **romhackdex.net/unbound** ou **unboundwiki.com**, et les décisions de build s'en déduisent
  explicitement. Ce qui reste invérifiable garde `incomplete: true` et l'UI affiche « fiche à
  compléter » — voir Sceptile. On ne comble pas un trou par une supposition.
- **Ne jamais référencer un composant par son nom dans `:is`.** `:is="'NuxtLink'"` ne résout pas : Vue
  rend un élément littéral `<nuxtlink>`, donc aucun `<a>` et aucune navigation — sans la moindre erreur.
  Importer le composant depuis `#components` (voir `AppCard.vue`). `pnpm smoke` échoue désormais sur
  toute balise de composant non résolue dans le DOM.
- **`pnpm typecheck` peut passer sur des types périmés.** `pnpm check` lance donc `nuxt prepare` d'abord :
  une erreur de `nuxt.config.ts` est restée invisible jusqu'à une régénération.
- **Une clé de sauvegarde qui perd son contenu ne disparaît pas toute seule.** `normalize()` conserve
  tout ce qu'il reconnaît par sa forme. Après toute suppression de contenu, la purge se fait dans l'app
  (Sauvegarde → Nettoyer) ; l'ensemble des clés légitimes est `knownContent` dans `useSave.ts` — y
  penser en ajoutant une catégorie persistée, sinon la purge effacerait des cases valides.
- **Vérifier avec `pnpm check`, puis `pnpm smoke` et `pnpm smoke:features`** (serveur de dev lancé), et
  `pnpm smoke:offline` sur le build de production quand on touche à la PWA ou aux icônes. L'app étant un
  SPA, ni `typecheck` ni `generate` ne détectent une erreur de rendu : seul le test navigateur le fait.
- Ce document et le README sont écrits au fil de l'eau et maintenus à jour.
- Utiliser des modèles plus légers pour les tâches mécaniques (transcription de tables, application
  d'un motif déjà établi), en relisant systématiquement leur sortie avant intégration.
- S'arrêter et me poser la question dès qu'une alternative technique intéressante apparaît, qu'un choix
  produit n'est pas couvert, ou que le guide est ambigu.

## Trous connus dans le guide source

`/equipe` les regroupe sous « Fiches à compléter » ; c'est ce que `pnpm import:pokemon` sert à combler.

- **§6 n'avait de fiche ni pour Excadrill ni pour Rotom-Wash**, alors que §7.3 les place aux slots 2
  et 4. Les deux ont été complétées depuis les données Unbound ; le guide, lui, garde des fiches
  complètes pour Dusknoir et Zeraora, tous deux sortis de l'équipe.
- **§7.3 assigne à Excadrill le Choice Band *et* Rapid Spin**, or l'objet verrouille sur la première
  capacité utilisée. La fiche assume la tension dans son build A et l'évite dans son build B.
- **§5 phase 3 saute de 3.1 à 3.3** (pas de 3.2), et ne couvre que Togekiss et Tyranitar sur les six
  membres de la composition finale.
- Sceptile est cité comme sortant sans avoir de fiche.

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
