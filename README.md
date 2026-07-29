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
| **Équipe** | 6 slots actifs + sortis + utilitaires ; par fiche : analyse, builds, formulaire IV/EV, checklist « Endgame Ready » | §6, §7.3, §13.2 |
| **Ressources** | PNJ, objets de combat, consommables, quêtes, farming | §8, §9, §11, §12 |
| **Référence** | Mécaniques IV/EV/natures/talents, Battle Frontier, formules, natures, outils, glossaire | §1–4, §10, §13 |
| **Journal** | Entrées horodatées à l’échelle de la partie | — |

### Prochaines actions

Le dashboard ne propose une tâche que si **tous ses prérequis sont cochés**. Les dépendances encodées
sont celles que le guide énonce explicitement : pas d’entraînement d’EV avant le Macho Brace amélioré
(§2.2), pas de Bottle Caps avant d’avoir lu les IV (§2.1), pas de changement de nature avant la
mission #053 (§2.3), et au sein d’une fiche l’ordre en 9 étapes de §3.

### Checklist « Endgame Ready »

Les 7 critères de §13.2, dont **3 déduits automatiquement** du formulaire de la fiche :

- **EV exacts** — motif 252/252/4 vérifié, et signalement des EV perdus hors multiples de 4
- **Nature favorable** — comparaison entre la nature saisie et celle du build choisi
- **Objet non dupliqué** — contrôle croisé sur les 6 slots actifs (§7.3 signale trois candidats aux Restes)

Les 4 autres (niveau 100, IV, talent, moveset) se cochent à la main, avec la cible du build affichée à
côté de la valeur réelle.

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
│   ├── pokemon.ts   §6   — fiches, builds, TODO par Pokémon
│   ├── npcs.ts      §8   · items.ts §9 · quests.ts §12 · farming.ts §11
│   ├── mechanics.ts §1–4, §10, §13.0 · natures.ts §13.1 · glossary.ts §13.3
│   ├── readiness.ts §13.2 — les 7 critères
│   └── counters.ts  compteurs de ressources et leurs objectifs
├── composables/
│   ├── useSave.ts        seul point d’accès au localStorage
│   ├── useProgress.ts    ratios de progression + critères dérivés
│   └── useNextActions.ts moteur de « prochaine action »
├── components/      ContentBlocks, TaskItem, ProgressRing, StatInputs, …
└── pages/
docs/                le guide markdown d’origine, archivé
scripts/             validation du contenu, tests de fumée, icônes
```

### Contenu en TypeScript, pas en YAML

`satisfies Phase[]` fait échouer le build sur un `id` mal orthographié. Comme l’état persisté ne
référence le contenu **que par id**, cette vérification protège directement la sauvegarde.

## Ajouter ou modifier du contenu

Le guide n’est pas figé — la conversation d’origine contient plus d’informations qu’il n’en reprend.

1. **Une tâche de roadmap** → `app/data/phases.ts`. Id au format `phase-<n>.<m>`, `requires` pour les
   prérequis, `done: true` si c’est déjà fait dans ta partie.
2. **Une fiche Pokémon** → `app/data/pokemon.ts`. Tâches en `mon-<slug>-<n>`. Les fiches
   **Excadrill** et **Motisma-Lavage** portent `incomplete: true` : le guide les place dans l’équipe
   (§7.3) sans leur consacrer de fiche en §6. Retire le drapeau quand tu les complètes.
3. **De la prose** (analyse, mécanique, farming) → un tableau de `Block` : `p`, `list`, `quote`,
   `table`, `code`. Le formatage inline supporte `**gras**`, `*italique*` et `` `code` ``.

> ⚠️ **Ne renomme jamais un `id` existant.** Un libellé peut changer librement ; changer un id perd la
> case cochée correspondante dans les sauvegardes déjà écrites.

Après toute modification de contenu :

```bash
pnpm check    # validation du contenu + typecheck
```

## Sauvegarde

Un seul objet JSON dans `localStorage`, sous la clé `pokemon-companion:save` :

- `tasks` — uniquement les choix explicites de l’utilisateur ; une tâche absente retombe sur le `done`
  du contenu, donc ajouter une tâche plus tard ne casse aucune sauvegarde
- `pokemon` — par slug : build choisi, niveau, IV, EV, nature, talent, moveset, objet, notes
- `counters`, `journal`, `version`, `updatedAt`

Le menu **base de données** de l’en-tête permet d’exporter, d’importer et de réinitialiser. C’est aussi
le moyen de transférer sa progression vers le téléphone : exporter ici, importer là-bas.

## Vérifier

Sans navigateur, sur le code :

```bash
pnpm check          # = validate + test:stats + typecheck
pnpm validate       # ids uniques, requires résolus, aucun cycle, cohérence des fiches
pnpm test:stats     # logique EV/IV, y compris les cas limites de §2.2
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

`smoke:offline` existe parce que trois régressions y sont passées :

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
