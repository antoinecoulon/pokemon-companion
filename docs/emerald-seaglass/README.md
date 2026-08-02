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

Contrairement à Elite Redux, **Seaglass n'a pas de code source public**. La source primaire est la
documentation officielle de l'auteur (**Nemo622**, pseudonyme ; pronoms they/them faute d'information
contraire), **versionnée dans ce dossier** en v3.0 avec ses patch notes. Ce dossier la retranscrit
(`python3 scripts/read-seaglass-doc.py` → `.cache/seaglass/doc.txt`), en corrigeant silencieusement
les artefacts de kerning de l'extraction (`V isit` → `Visit`, `T own` → `Town`, `Lv .` → `Lv.`) et en
organisant le contenu par thème plutôt que dans l'ordre du PDF.

**« Pas de code source » ne voulait pas dire « rien à générer ».** `mrwalkthroughs.com` publie les
447 fiches d'espèces telles qu'extraites de la ROM — stats du hack **et** du jeu officiel côte à côte,
talents dont le caché, évolutions, localisations — plus les lieux des 68 TM et HM. C'est désormais
généré (`pnpm gen:seaglass`) et **recoupé automatiquement contre la doc officielle**, qui reste
l'autorité : 413 espèces comparables, 413 accords.

⚠️ **Le mirror pokeharbor utilisé au premier tour était antérieur à la v3.0**, et a produit 14 types
faux, un Battle Tent annoncé cassé qui ne l'est plus, et plusieurs manques. Un mirror n'a pas de
version — voir [03-sources.md](03-sources.md) pour le détail, et pour la fiabilité de chaque source.

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
   La v3.0 tranche en revanche un point qui était noté comme une contradiction : **le Lati rencontré
   sur Southern Island est tiré au hasard**, et le tirage se réinitialise à chaque Elite Four battu —
   sauvegarder avant d'aller sur l'île. Reste ouvert : savoir s'ils *errent* réellement en plus, comme
   la table du dex le laisse entendre.
6. ~~**La version réellement installée.**~~ **Résolu** : c'est la **v3.0**, confirmée à la source
   primaire, dont le PDF et les patch notes sont versionnés ici. Signe visible en jeu : les
   protagonistes sont **Brendan et May**, et l'écran-titre a un nouveau fond.
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
11. **Le Battle Tent de Lilycove fonctionne-t-il ?** Il était désactivé avant la v3.0 (Pokémon loués
    transformés en `BAD EGG`, entrée bloquée par un PNJ). La v3.0 **a retiré cette entrée de ses
    « Known Issues »**, ce qui vaut correction — mais l'auteur ne l'annonce pas explicitement dans ses
    patch notes. À confirmer en y entrant. Même raisonnement pour les **tiles vanilla des bâtiments de
    la Battle Frontier**, disparues de la même liste.
12. **Les 14 espèces retypées en v3.0.** Le recoupement automatique les donne pour acquises depuis la
    doc v3.0 — Blastoise `Water/Steel`, Feraligatr `Water/Dark`, Typhlosion `Fire/Ground`, Meganium
    `Grass/Fairy`, Aggron `Steel/Dragon`, Hypno `Psychic/Dark`, Ninjask `Bug/Dark`, Huntail
    `Water/Dragon`, Gorebyss `Water/Fairy`, Ekans, Golduck, Seel, Electivire, Magmortar. Un coup d'œil
    au Pokédex du jeu sur deux ou trois d'entre elles suffirait à confirmer que la ROM installée est
    bien la v3.0.

## Convention d'écriture

Prose en français, **noms propres du jeu en VO** : `Wishing Star`, `Shiny Charm`, `Pacifidlog Town`,
`Route 104`, `EXP. Share`, `HM07 Waterfall`, `Rare Candy`, types en anglais (`Water`, `Fairy`…), et
les libellés de statistiques (`HP`, `Atk`, `Def`, `SpA`, `SpD`, `Spe`). Jamais « CT » pour TM. On
traduit la phrase autour, jamais le nom que l'écran affiche.
