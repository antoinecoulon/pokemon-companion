# Pokémon Companion

Application web de suivi du post-game de **Pokémon Unbound**. Elle remplace le guide markdown de
996 lignes (`docs/`) par une interface où l’on coche sa progression, saisit les IV/EV réels de son
équipe, et se fait dire quoi faire ensuite.

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
| **Roadmap** | Les 6 phases, leurs tâches cochables et leurs prérequis | §5 |
| **Équipe** | Les 6 slots actifs en avant avec leur sprite, le reste dans un bandeau défilant, et la composition modifiable (échange, ordre, sortie) ; par fiche : analyse, builds, formulaire IV/EV, checklist « Endgame Ready » | §6, §7.3, §13.2 |
| **Ressources** | PNJ, objets de combat, consommables, quêtes, farming — PNJ et quêtes cochables, les acquis descendant dans un repli | §8, §9, §11, §12 |
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
├── data/            LE contenu du guide, migré en TypeScript
│   ├── types.ts     types de contenu + modèle de sauvegarde
│   ├── phases.ts    §5   — les 6 phases et leurs prérequis
│   ├── pokemon/     §6, §7.3 — une fiche par fichier + index.ts généré
│   ├── npcs.ts      §8   · items.ts §9 · quests.ts §12 · farming.ts §11
│   ├── mechanics.ts §1–4, §10, §13.0 · natures.ts §13.1 · glossary.ts §13.3
│   ├── readiness.ts §13.2 — les 7 critères
│   └── counters.ts  compteurs de ressources et leurs objectifs
├── composables/
│   ├── useSave.ts        seul point d’accès au localStorage
│   ├── useRoster.ts      composition jouée : statut et slot effectifs
│   ├── useProgress.ts    ratios de progression + critères dérivés
│   └── useNextActions.ts moteur de « prochaine action »
├── components/      AppCard, SectionBlock, PokemonSprite, TaskItem, ContentBlocks, …
└── pages/
docs/                le guide markdown d’origine, archivé
public/sprites/      sprites versionnés : home/ (fiches) et pixel/ (vignettes)
scripts/             validation, tests de fumée, icônes, sprites, squelettes de contenu
```

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
| Tâche de roadmap | `pnpm new:task phase-2` | `app/data/phases.ts` | `phase-<n>.<m>` |
| PNJ | `pnpm new:npc "Move Tutor"` | `app/data/npcs.ts` | kebab-case, persisté en `npc:<id>` |
| Quête | `pnpm new:quest "#042" "Nom"` | `app/data/quests.ts` | kebab-case, persisté en `quest:<id>` |

Pour le reste (objets, consommables, rubriques de farm, mécaniques, natures, glossaire), copie une
entrée voisine : ces contenus ne sont pas persistés, leur id ne sert qu’à la clé de rendu.

**De la prose** (analyse, mécanique, farming) s’écrit en tableau de `Block` : `p`, `list`, `quote`,
`table`, `code`. Le formatage inline supporte `**gras**`, `*italique*` et `` `code` ``.

> ⚠️ **Ne renomme jamais un `id` existant.** Un libellé peut changer librement ; changer un id perd la
> case cochée correspondante dans les sauvegardes déjà écrites. Cela vaut aussi pour les ids de PNJ et
> de quête depuis qu’ils sont persistés.

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

Une fiche par fichier dans `app/data/pokemon/<slug>.ts`, assemblées par un `index.ts` **généré**. On ne
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

Un seul objet JSON dans `localStorage`, sous la clé `pokemon-companion:save` :

- `tasks` — uniquement les choix explicites de l’utilisateur ; une tâche absente retombe sur le `done`
  du contenu, donc ajouter une tâche plus tard ne casse aucune sauvegarde
- `pokemon` — par slug : build choisi, niveau, IV, EV, nature, talent, moveset, objet, notes
- `roster` — l’écart entre la composition du guide (§7.3) et celle réellement jouée, par slug :
  `status` et `slot`. Vide tant qu’on n’a rien échangé — faire tourner un membre est la phase 4 du
  guide, pas une correction de contenu, donc ça n’a rien à faire dans `app/data/`
- `resources` — PNJ débloqués et quêtes faites, sous des clés **préfixées** `npc:<id>` / `quest:<id>` ;
  le préfixe n’est pas décoratif, `objets-pouvoir` existe à la fois comme id de consommable et de quête
- `counters`, `journal`, `version`, `updatedAt`

`normalize()` reconstruit la sauvegarde champ par champ depuis `createEmptySave()` : un champ ajouté
plus tard se remplit de sa valeur par défaut, sans bump de `SAVE_VERSION`. C’est ainsi que `resources`
est apparu sans casser les sauvegardes v1.

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
pnpm check          # = validate + test:stats + test:roster + test:fiche + typecheck
pnpm validate       # ids uniques, requires résolus, aucun cycle, cohérence des fiches
pnpm test:stats     # logique EV/IV, y compris les cas limites de §2.2
pnpm test:roster    # invariants de composition (six slots, pas de trou) et purge de sauvegarde
pnpm test:fiche     # contrat de fiche : validateur, et aller-retour d’impression sur les 12 fiches
```

Avec navigateur — **indispensable** : l’app est un SPA, le build ne prérend rien, donc ni `typecheck`
ni `generate` ne peuvent détecter une erreur de rendu.

```bash
pnpm dev            # dans un terminal
pnpm smoke          # dans un autre : toutes les routes × 2 viewports (1280 et 375 px),
                    # échoue sur toute erreur console, page vide ou débordement horizontal ;
                    # vérifie aussi la persistance et l'aller-retour export/import
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
