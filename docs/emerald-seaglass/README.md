# Pokémon Emerald Seaglass — doc de référence

Doc de suivi personnel pour une partie de **Pokémon Emerald Seaglass**, hack ROM de Pokémon
Emerald.

> **Ce dossier est l'archive de la démarche, pas la source de vérité de l'app.** Le contenu de
> `app/data/emerald-seaglass/` en est tiré — `01-la-rom.md` et `02-bien-debuter.md` sont transcrits
> dans `reference.ts`, `phases.ts` et `completion.ts` — mais rien ici n'est importé ni généré
> automatiquement : `pnpm check` valide l'app, pas ce markdown. Sur un écart entre les deux, c'est la
> documentation officielle de l'auteur qui tranche, jamais ce fichier.

## La démarche

Ce hack vient après Elite Redux et n'en est pas le décalque : Elite Redux rééquilibre et durcit un
Emerald qui reste, question trame et exploration, l'Emerald vanilla. Seaglass, lui, ne touche **pas**
à la difficulté ni à la structure de la région — la doc officielle le dit explicitement : « This is
*NOT* a "difficulty hack" ». Sa valeur est ailleurs : refonte visuelle complète, contenu Pokémon
(toutes les espèces Gen 1-3, cross-gen jusqu'à Gen 9, retypages), et une longue liste de conforts de
jeu (EXP. Share party-wide, DexNav, minigames, Shiny Charm, HM sans emplacement de capacité…).

Contrairement à Elite Redux, **Seaglass n'a pas de code source public** — rien à extraire, rien à
scraper. La source primaire est un document unique : la documentation officielle de l'auteur
(**Nemo622**, pseudonyme ; pronoms they/them faute d'information contraire), diffusée en PDF depuis
sa page Ko-fi. Ce dossier retranscrit ce PDF (extrait en texte dans `.cache/seaglass/doc.txt`), en
corrigeant silencieusement les artefacts de kerning de l'extraction (`V isit` → `Visit`, `T own` →
`Town`, `Lv .` → `Lv.`, etc.) et en organisant le contenu par thème plutôt que dans l'ordre du PDF.

Le patch et l'original du document sont sur Ko-fi (<https://ko-fi.com/nemo622>, page patch
<https://ko-fi.com/s/aabf18551d>) — voir [03-sources.md](03-sources.md) pour le détail des sources
et leur fiabilité.

## Dans quel ordre lire

1. **[01-la-rom.md](01-la-rom.md)** — ce qu'est Seaglass : identité, base technique, et toutes les
   features de la doc organisées par thème. À lire avant de lancer la partie.
2. **[02-bien-debuter.md](02-bien-debuter.md)** — checklist des premières heures, dans l'ordre de
   jeu, jusqu'à Mauville / Wattson.
3. **[03-sources.md](03-sources.md)** — d'où vient chaque donnée, ce qui est automatisable, ce qui
   ne l'est pas, et les sites à ne jamais utiliser.

## Ce que la doc officielle ne dit pas — à vérifier en jeu

La doc de Nemo622 est dense mais laisse plusieurs trous qu'aucune source fiable ne comble
aujourd'hui. **On ne les devine pas** — ils restent ouverts jusqu'à vérification en jeu.

1. **Les valeurs numériques des soft level caps.** La doc dit seulement : on peut monter jusqu'au
   niveau max du gym leader, puis le gain d'XP est divisé par deux pendant quelques niveaux, puis
   réduit davantage encore. Aucun chiffre par badge n'est donné, ni la durée du premier palier de
   réduction, ni celle du second. C'est le trou le plus important de toute la doc — sans lui, aucune
   table de progression comparable à celle d'Elite Redux ne peut être écrite.
2. **L'ordre des 8 badges.** La doc ne l'énonce jamais explicitement ; elle suppose une trame Hoenn
   vanilla (Roxanne → Brawly → Wattson → Flannery → Norman → Winona → Tate & Liza → Wallace/Juan),
   mais aucune phrase ne le confirme pour Seaglass spécifiquement. Le nom du 4e gym leader
   (Flannery, mentionnée pour l'obtention des autres starters) suggère fortement l'ordre vanilla,
   sans le garantir totalement.
3. **La scène de choix du starter.** La doc ne décrit à aucun moment l'écran ou la scène de départ
   à Littleroot — elle indique seulement, dans le tableau des espèces, que Treecko/Torchic/Mudkip
   restent aussi capturables à l'état sauvage en Safari Zone (SE/NW/SW respectivement). Rien ne dit
   si le choix initial se fait encore via Birch dans sa mallette, ni si son déroulé a changé.
4. **Le contenu exact du livre sur le bureau du joueur.** La doc dit qu'il permet de désactiver les
   level caps (Hard Mode) « et plus d'options », sans les lister.
5. **Le niveau des légendaires non chiffrés.** La doc donne des niveaux précis pour Latios/Latias,
   Ho-oh/Lugia (Lv. 50), Deoxys (Lv. 70), Celebi (Lv. 40), Mewtwo (Lv. 80), Raikou/Entei/Suicune et
   Articuno/Zapdos/Moltres (Lv. 50) — mais **pas pour Mew** ni pour les légendaires « classiques »
   (Kyogre, Groudon, la Regi Trio, Rayquaza), dont la doc dit seulement qu'ils s'obtiennent « de la
   façon normale d'Emerald ». Et l'affirmation « mostly before Elite Four » pour l'ensemble des
   légendaires du Sailor de Mossdeep reste à vérifier cas par cas.
6. **La version réellement installée et son changelog.** Une source secondaire non officielle
   (`gbacodes.com`) rapporte la version **v3.0** et une dernière mise à jour au **2024-09-21** — non
   confirmé à la source primaire, donc à vérifier au premier lancement (menu titre ou écran d'intro).
7. **L'URL exacte de patching.** La doc dit « Visit this site to patch the rom » en référence à un
   lien hypertexte qui ne survit pas à l'extraction du PDF en texte. Le seul point d'entrée fiable
   identifié reste Ko-fi (voir [03-sources.md](03-sources.md)) : à confirmer que c'est bien là que
   se trouve l'outil de patching, et pas une page tierce liée depuis Ko-fi.
8. **La localisation précise où Scott remet l'EXP. Share à Petalburg.** La doc dit « juste après le
   tutoriel de capture de Wally », sans préciser le lieu exact (intérieur du gym de Norman ? sortie
   de ville ?).
9. **Le déclenchement exact du don de Tinkatink par le Grunt Team Aqua sur la Route 115** — combat à
   gagner, objet à donner, ou simple dialogue ? La doc ne précise pas la condition.
10. **Le canal Discord de l'auteur** est mentionné dans la section Known Issues, mais son URL
    d'invitation n'a pas été vérifiée : volontairement absente de cette doc.

## Convention d'écriture

Prose en français, **noms propres du jeu en VO** : `Wishing Star`, `Shiny Charm`, `Pacifidlog Town`,
`Route 104`, `EXP. Share`, `HM07 Waterfall`, `Rare Candy`, types en anglais (`Water`, `Fairy`…), et
les libellés de statistiques (`HP`, `Atk`, `Def`, `SpA`, `SpD`, `Spe`). Jamais « CT » pour TM. On
traduit la phrase autour, jamais le nom que l'écran affiche.
