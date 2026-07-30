# Contrat d'une fiche Pokémon

Ce document est fait pour être **collé dans un prompt**. Il décrit le JSON attendu par
`pnpm import:pokemon <fichier.json>`, qui valide, refuse plutôt que d'écrire à moitié, résout le
sprite et écrit `app/data/pokemon/<slug>.ts`.

La validation est dans `scripts/lib/fiche.mjs` — ce fichier-ci et ce module doivent dire la même
chose. `pnpm test:fiche` vérifie que le contrat accepte les 13 fiches existantes.

## Règles non négociables

1. **N'invente aucune donnée Pokémon.** Le guide (`docs/guide_endgame_pokemon_unbound_v2 *.md`) est la
   seule source. Là où il est muet, mets `"incomplete": true` et une `incompleteNote` qui dit ce qui
   manque — surtout pas un build plausible. Excadrill et Motisma-Lavage sont dans ce cas.
2. **Les stats sont celles d'Unbound** (romhackdex.net/unbound), pas celles des jeux officiels.
3. **Un id ne se renomme jamais.** `slug` et les ids de tâche sont le contrat avec les sauvegardes
   déjà écrites : changer un id perd la case cochée correspondante. Les libellés, eux, sont libres.
4. **Aucun champ hors de cette liste.** Un champ inventé (`weaknesses`, `evYield`, `locations`…) est
   refusé à l'import : il ne serait affiché nulle part.
5. **Français partout**, y compris pour les types, les natures, les capacités et les objets. Les noms
   anglais vont dans `nameEn` et entre parenthèses dans les libellés : `"Sable Volant (Sand Stream)"`.

## Squelette

```json
{
  "slug": "lucario",
  "name": "Lucario",
  "nameEn": "Lucario",
  "status": "active",
  "role": "Sweeper mixte",
  "types": ["Combat", "Acier"],
  "baseStats": { "hp": 70, "atk": 110, "def": 70, "spa": 115, "spd": 70, "spe": 90 },
  "bst": 525,
  "abilities": [{ "name": "Full Métal (Steadfast)" }, { "name": "Cran (Justified)", "hidden": true }],
  "targetAbility": "Cran (Justified)",
  "analysis": [{ "kind": "p", "text": "…" }],
  "builds": [{ "…": "voir plus bas" }],
  "ivGuidance": { "focus": ["atk", "spe"], "ignore": ["spa"] },
  "tasks": [{ "id": "mon-lucario-1", "label": "Choisir le build" }]
}
```

## Champs

Écris-les dans cet ordre — c'est celui dans lequel l'import les réécrit.

| Champ | Requis | Contenu |
| --- | --- | --- |
| `slug` | ✅ | kebab-case ASCII, en français. Nomme le fichier, les sprites et les clés de sauvegarde. `motisma-lavage`, pas `rotom-wash`. |
| `name` | ✅ | Nom français affiché. |
| `nameEn` | — | Nom anglais. Sert à retrouver le sprite automatiquement — mets-le. |
| `sprite` | — | Slug [pokemondb](https://pokemondb.net/sprites). **Omets-le** : l'import le devine depuis `nameEn` et le vérifie. À renseigner à la main seulement pour une forme (`rotom-wash`). Omets aussi la clé pour une fiche concept (la mule à objets n'est pas un Pokémon). Jamais `""`. |
| `spritePixelSet` | — | Ne le mets pas : l'import sonde pokemondb et le renseigne si l'espèce est postérieure à Noir/Blanc. |
| `slot` | — | **Ne le mets pas.** L'import prend la première place libre de 1 à 6 et refuse un septième membre. |
| `status` | ✅ | `"active"` (composition finale, §7.3), `"retired"` (sorti, §6.4-6.5) ou `"utility"` (gardé en boîte, §6.7). En cas de doute : `"retired"`, l'échange se fait ensuite dans l'app. |
| `badge` | — | Étiquette du guide : `"Conservé"`, `"Nouveau"`, `"Sorti de l'équipe"`. |
| `role` | ✅ | Rôle tenu dans l'équipe, tel que §7.3 le formule. Une ligne. |
| `types` | ✅ | 0 à 2 types, orthographe exacte ci-dessous. `[]` pour une fiche concept. |
| `baseStats` | — | Les six clés `hp`, `atk`, `def`, `spa`, `spd`, `spe`. Toutes ou aucune. |
| `bst` | — | Somme des six. Doit correspondre exactement. |
| `abilities` | — | `[{ "name": "…", "hidden": true }]`. `hidden` = talent caché (Dream Ball / Dream Mist, pas une Ability Capsule). |
| `targetAbility` | — | Talent visé par le build. Doit figurer dans `abilities`. |
| `mega` | — | `{ "stone": "…", "stats": { … six clés … }, "bst": 700, "note": "…" }`. |
| `obtention` | — | Où et comment l'obtenir. Formatage inline autorisé. |
| `incomplete` | — | `true` si le guide ne documente pas de build. Exige `incompleteNote`. |
| `incompleteNote` | — | Ce qui manque, et où le guide s'arrête. |
| `preamble` | — | Blocs de mise au point qui précèdent l'analyse (§6.2). |
| `analysis` | — | Blocs d'analyse critique. |
| `builds` | — | Voir plus bas. Un membre `active` sans build **doit** porter `incomplete: true`. |
| `ivGuidance` | — | `{ "focus": [stats], "ignore": [stats], "note": "…" }`. Aucune stat dans les deux. |
| `extra` | — | Blocs libres (§6.7 pour les utilitaires). |
| `tasks` | — | Voir plus bas. |

### Types (orthographe exacte)

```
Normal  Feu  Eau  Électrik  Plante  Glace  Combat  Poison  Sol
Vol  Psy  Insecte  Roche  Spectre  Dragon  Ténèbres  Acier  Fée
```

### Blocs de prose

`analysis`, `preamble`, `extra` et `incompleteNote`-adjacents sont des tableaux de blocs. Cinq formes,
pas de markdown libre :

```json
{ "kind": "p", "text": "Un paragraphe." }
{ "kind": "list", "items": ["…", "…"], "ordered": false }
{ "kind": "quote", "text": "Un encadré.", "tone": "warning" }
{ "kind": "table", "head": ["Colonne"], "rows": [["cellule"]], "caption": "…" }
{ "kind": "code", "text": "texte préformaté" }
```

`tone` vaut `info`, `warning`, `tip` ou `success`. Chaque ligne de `rows` doit avoir exactement autant
de cellules que `head`.

Le formatage **inline** est accepté dans tout texte : `**gras**`, `*italique*`, `` `code` ``. Rien
d'autre — pas de liens, pas de titres.

### Builds

```json
{
  "id": "a",
  "name": "Wallbreaker Bandeau Choix",
  "tagline": "le plus simple, le plus fiable",
  "nature": "Rigide (Adamant)",
  "natureFr": "Rigide",
  "evs": { "hp": 252, "atk": 252, "spd": 4 },
  "item": "Bandeau Choix",
  "moves": ["Lame de Roc", "Mâchouille", "Séisme", "Poing Glace"],
  "notes": ["Objet : 48 BP au Battle Tower."],
  "recommended": true
}
```

- `id` : court et stable (`"a"`, `"b"`, `"c"`), unique dans la fiche.
- `nature` : forme complète. `natureFr` : le nom français **seul**, et il doit exister dans
  `app/data/natures.ts` — la checklist compare cette chaîne à la nature saisie, une faute la casse
  en silence. `nature` doit commencer par `natureFr`.
- `evs` : 510 EV au maximum, 252 par stat. Le motif visé est `252 / 252 / 4` (§2.2 : 4 EV = 1 point,
  donc `250/250/10` gaspille 6 EV).
- `moves` : **exactement 4**.
- `recommended` : sur un seul build.

### Tâches

```json
{ "id": "mon-lucario-3", "label": "Purger les EV parasites", "requires": ["mon-lucario-2", "phase-1.4"], "priority": 1 }
```

- `id` : **`mon-<slug>-<n>`**, numéroté à partir de 1, sans trou.
- `label` : jamais vide. Formatage inline accepté.
- `requires` : ids de tâches qui doivent être cochées avant. **N'encode qu'un prérequis que le guide
  énonce** : une dépendance inventée bloque la tâche pour de bon dans le moteur de prochaine action.
  Peut viser une tâche de la roadmap (`phase-<n>.<m>`).
- `priority` : entier, plus petit = proposé plus tôt. Défaut 50.
- `done` : `true` seulement si le guide coche déjà la case.
- `ref` : la section source, `"§6.1"`. `link` : une route interne existante.
- `details` : sous-puces du guide.

## Vérifier

```bash
pnpm import:pokemon fiche.json --dry-run   # valide et affiche, n'écrit rien
pnpm import:pokemon fiche.json
pnpm sprites
pnpm check
```

Pour retirer une fiche : `pnpm rm:pokemon <slug>`.
