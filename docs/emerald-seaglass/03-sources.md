# Sources

## Le principe

Contrairement à Elite Redux, **Emerald Seaglass n'a pas de code source public.** Rien ne s'extrait
d'un dépôt : la source primaire est un document unique, et quasi tout ce que dit ce dossier en
vient. Ce qui n'est pas dans ce document n'entre pas dans ce dossier — il va dans la liste
« à vérifier en jeu » du [README](README.md).

---

## Source primaire

### La documentation officielle (PDF), par Nemo622

| | |
| --- | --- |
| Autorité | **Totale** — c'est l'auteur qui décrit son propre hack |
| Fiabilité | Haute, mais dense : plusieurs points restent volontairement vagues (soft level caps non chiffrés, « and more options », etc.) |
| Original | Diffusé depuis Ko-fi : <https://ko-fi.com/nemo622> ; page patch <https://ko-fi.com/s/aabf18551d> |
| Mirror utilisé pour cette doc | <https://www.pokeharbor.com/wp-content/uploads/2024/08/Pokemon-Emerald-Seaglass-Documentation.pdf> — **c'est un mirror**, pas la source de l'auteur |
| Automatisable | Le PDF a été extrait en texte (`.cache/seaglass/doc.txt`), 8 pages. **Pas de branche stable ni d'API** — chaque relecture repasse par une extraction manuelle |
| Piège rencontré | L'extraction texte introduit des artefacts de kerning (`V isit`, `Shar e`, `T own`, `dif ficulty`, `Cr oss-gen`, `Lv .`) — corrigés silencieusement dans ce dossier, jamais recopiés tels quels |

⚠️ **Ko-fi est derrière Cloudflare** : non lisible en `curl`/`WebFetch`, à ouvrir au navigateur pour
toute vérification directe à la source (version installée, mise à jour du patch, changelog).

---

## Sources secondaires

| Source | Autorité | Fiabilité | Automatisable |
| --- | --- | --- | --- |
| `gbacodes.com` | Aucune (ferme SEO) | Rapporte la version **v3.0** et une dernière mise à jour au **2024-09-21** — **non confirmé** à la source primaire | ⚠️ lisible en HTTP mais **à ne pas utiliser comme source de contenu**, seulement noté ici comme piste à confirmer |
| `github.com/jimineybillybob1/PokemonEmeraldSeaglassGuide` | Guide fan **non officiel** | Inconnue — dépôt à **0 star**, jamais recoupé avec le PDF officiel | Oui — `index.html` statique avec des données en tableaux JS |
| `romhackdex.net` | — | **Ne couvre pas ce jeu.** Vérifié : Seaglass n'y figure pas | N/A |

---

## La piste mise en réserve : le guide fan GitHub

<https://github.com/jimineybillybob1/PokemonEmeraldSeaglassGuide> contient des données
d'encounters/localisations dans un `index.html` statique, sous forme de tableaux JavaScript — donc
techniquement parseable, sur le même principe qu'un futur `pnpm gen:seaglass`.

**Écartée pour l'instant**, pour trois raisons :

1. **Source non officielle** — c'est un guide de joueur, pas l'auteur du hack. Rien ne garantit
   qu'il soit à jour avec la version installée, ni exempt d'erreurs.
2. **0 star, aucun signal de fiabilité communautaire** — contrairement au wiki d'Unbound (fiable et
   régulier sur son périmètre, malgré ses propres erreurs ponctuelles sur les données Pokémon) ou au
   decomp d'Elite Redux (le code du jeu lui-même), ce dépôt n'a aucune traction qui permettrait de
   lui accorder une confiance par défaut.
3. **Exigerait un croisement systématique avec le PDF officiel** avant publication — exactement le
   travail qui a été fait pour la table de level caps d'Elite Redux entre `er-config` et
   `eliteredux-source`. Sans ce travail, une donnée extraite de ce guide serait au même niveau de
   confiance qu'une information non sourcée.

**Ce qu'il faudrait pour la retenir** : recouper au moins les points structurants (soft level caps,
localisations d'objets clés, équipes de Gym Leaders si elles y figurent) avec le PDF officiel ou une
vérification en jeu, et documenter les écarts trouvés — sur le modèle du tableau de conflit
Roxanne/Brawly dans les sources d'Elite Redux. Tant que ce travail n'est pas fait, ce dépôt reste une
piste, pas une source.

---

## Les sites à ne jamais utiliser

Fermes SEO ou sites non confirmés, à ne jamais utiliser comme source de contenu **ni comme lieu de
téléchargement du patch** :

- `gbacodes.com`
- `pokeharbor.com` (sert de mirror pour le PDF officiel, mais n'est pas une source de contenu en
  soi et ne doit jamais être le lieu de téléchargement du patch)
- `pokehacks.net`
- `pokepatched.com`
- `ducumon.click`
- `visualboyadvance.org`
- `pokemon-roms.net`
- `gigachadgamers.com`
- `pokemonemeraldseaglass.com` — se présente comme « Official Game Download » **sans être confirmé
  comme site de l'auteur**. À traiter comme non fiable jusqu'à preuve du contraire.

**Le seul point d'entrée légitime pour le patch et la documentation reste Ko-fi**
(<https://ko-fi.com/nemo622>, page patch <https://ko-fi.com/s/aabf18551d>).

---

## Le canal Discord

L'auteur mentionne un canal Discord pour signaler les bugs (section Known Issues de la doc), mais
son URL d'invitation n'a jamais été vérifiée dans le cadre de cette recherche. **Volontairement non
publiée** dans ce dossier.

---

## Ce qui reste à vérifier en jeu

Voir la liste complète et numérotée dans le [README](README.md). En résumé, les six trous les plus
importants :

- [ ] Les valeurs numériques des **soft level caps** (le plus important).
- [ ] L'**ordre des 8 badges** (supposé vanilla, non confirmé explicitement par la doc).
- [ ] Le déroulé de la **scène de choix du starter** à Littleroot.
- [ ] Le contenu complet du **livre sur le bureau** (« and more options »).
- [ ] Le **niveau de Mew** et des légendaires « classiques » (Kyogre, Groudon, Regi Trio, Rayquaza),
      et si « mostly before Elite Four » se vérifie pour l'ensemble des légendaires du Sailor.
- [ ] La **version réellement installée** et son changelog.
