# guide_endgame_pokemon_unbound_v2

# Guide Ultime Endgame — Pokémon Unbound (v2.1+)

### Édition révisée — vérifiée sur sources (juillet 2026)

---

## 0. Note de révision — LIS ÇA EN PREMIER

Ton guide d’origine est bon sur la **théorie compétitive** (rôles, IV/EV/natures, archétypes) mais contient plusieurs **erreurs factuelles sur Unbound lui-même** : des PNJ placés dans des villes qui n’existent pas dans Borrius (Saffron City), des mécaniques importées d’autres jeux (Ability Patch), et un objet clé (« Stat Scanner ») que je n’ai retrouvé dans aucune source.

### 0.1 Corrections majeures

| Point du guide d’origine | Réalité vérifiée (Unbound) |
| --- | --- |
| Nature Changer à « Saffron City / Teachy TV » | **Tehl Town** (maison au sud-ouest du Centre Pokémon), après la mission *Seasonal Research* (#053) → 1 changement gratuit puis **50 000 $**. Second PNJ à la **Battle Frontier** (stand en haut à gauche) → **50 BP**. Saffron City n’existe pas dans Borrius. |
| EV Eraser à « Fallshore City » ou Dresco Town | **Battle Frontier**, stand en haut à droite (PNJ Black Belt) : **purger 1 stat = 5 BP**, **maxer 1 stat = 50 BP**. Il affiche aussi les IV **et** les EV de toute l’équipe. |
| « Stat Scanner » donné par le Prof. Log | ✅ **Ton guide avait raison, ma première révision avait tort.** L’objet s’appelle l’**Advanced Stat Scanner** et il est donné par **l’assistant du Prof. Log, au laboratoire de Frozen Heights**. Il affiche les stats de base, les **IV en chiffres** (et non en lettres) et les EV. C’est le tout premier objet à aller chercher. En complément, les PNJ IV Changer (Seaport) et EV Changer (Frontier) affichent aussi les IV/EV de l’équipe. |
| — *(absent du guide d’origine)* | Sans le Scanner, les IV s’affichent quand même dans le résumé du Pokémon sous forme de **notes de E- à S** (S = 31). ⚠️ Ces lettres sont **invisibles en difficulté Vanilla**, alors que les IV existent quand même. |
| Hyper Training aux « docks de Seaport City » | Correct dans l’esprit : PNJ aux cheveux violets **à l’est du Centre Pokémon de Seaport, en descendant les escaliers près de l’entrée KBT, puis plein sud**, devant l’entrepôt. 1 Bottle Cap = 1 stat, 1 Gold Bottle Cap = les 6. ⚠️ Si le PNJ est absent, passe la difficulté sur autre chose que *Vanilla*. |
| Ability Patch pour débloquer les Talents Cachés | **L’Ability Patch n’existe pas dans Unbound.** Les Talents Cachés s’obtiennent via **Dream Mist** (raid Musharna 5/6★ à Tarmigan Town, ~50 % de drop + un exemplaire offert par un scientifique devant le Research Center), via **Dream Ball** (3/jour chez un scientifique du Dream Research Lab de Tarmigan Town, postgame), ou via l’**Ability Changer** de la Battle Frontier. L’**Ability Capsule** (Game Corner de Dehara) ne fait qu’**alterner entre les 2 talents standards**. |
| « Togekiss : Sérénité est son Talent Caché » | **Faux, et c’est une bonne nouvelle.** Dans Unbound, Togekiss a *Hustle* (talent 1), **Sérénité / Serene Grace (talent 2)** et *Œil Compétitif / Super Luck* (caché). Une simple **Ability Capsule** suffit → pas besoin de Dream Mist. |
| Move Reminder à Crater Town | ✅ Correct (maison au sud du Centre Pokémon). |
| Egg Move Tutor à la garderie de Seaport City | **Battle Frontier**, stand à l’ouest de l’entrée, contre des BP. À la garderie, c’est l’*Egg Move **Transfer** Tutor* (transfert entre deux Pokémon de la même lignée). |
| Hidden Power Master à « Tarmigan Town » | **Battle Frontier**, stand au sud du bâtiment principal, contre des BP. |
| Répartition EV « 252 / 252 / 6 » | Utilise **252 / 252 / 4**. Au niveau 100, 4 EV = 1 point de stat : les 2 EV supplémentaires ne donnent strictement rien. |
| Zeraora : « Danse Lames (Swords Dance) » | **Zeraora n’apprend pas Danse Lames dans Unbound.** Son seul vrai setup est **Gonflette / Bulk Up (CT08)** ou *Aiguisage / Hone Claws*. Voir sa fiche détaillée §6.5. |
| Tableau des quêtes postgame | *Seasonal Research* (#053) et *Portal Purge* (#050) sont confirmés. Je n’ai **pas** pu vérifier « The Ultimate Red Card », « Tomb Raider » ni « The Black Emissary » — traite-les comme non fiables tant que tu ne les as pas croisés en jeu. |
| « Les vitamines n’ont plus de plafond à 100 EV » | **Non vérifié.** Unbound tourne sur le CFRU (mécaniques Gen 8), où les vitamines montent effectivement jusqu’à 252 — mais aucune source ne le confirme explicitement pour Unbound. **Test 30 secondes** : donne 11 Protéines d’affilée à un Pokémon à 0 EV Attaque ; si la 11ᵉ passe, le plafond de 100 a sauté. |

### 0.2 Ce que le post Reddit apporte (intégré)

Le post `r/PokemonUnbound` (*Pokémon Stats Explained – EV/IV/Nature Training Guide*) est un guide **pédagogique orienté milieu de partie**, pas endgame. Il ne remplace pas ce document, mais il corrige et complète cinq points importants :

1. **L’Advanced Stat Scanner existe** (voir ci-dessus) — j’avais tort de le mettre en doute.
2. **Les baies réductrices d’EV s’achètent au marché en plein air de Fallshore City.** C’est l’explication de la mention « Fallshore » dans ton guide d’origine : il n’y a pas d’EV Eraser là-bas, il y a le **magasin de baies**. Concrètement, ça te donne une méthode de purge **à 0 BP**.
3. **Le Macho Brace est améliorable jusqu’à ×10** sur les gains d’EV — bien plus puissant que ce que suggérait ton guide.
4. **Le DexNav affiche une note en étoiles = le nombre d’IV garantis à 31.** Méthode majeure pour obtenir de bons IV **sans dépenser de Bottle Cap**, et donc à réserver à ton 6ᵉ Pokémon.
5. **Les vitamines sont explicitement décrites comme une mauvaise méthode** (chères, peu efficaces). Nuance pour ton cas : tu en as déjà un stock dans ton sac, donc elles te coûtent 0 $ — utilise-les, mais n’en rachète pas.

> ⚠️ **Attention à un point de niveau, cependant.** Ce post explique que les IV « ne sont pas très importants en Vanilla/Difficile ». C’est vrai pour le scénario. **Ça ne l’est plus du tout pour la Battle Frontier**, où tous les Pokémon sont ramenés au niveau 50 : à ce niveau, l’écart de stats entre les Pokémon se resserre, et 31 IV pèsent proportionnellement **plus lourd**, pas moins. Ne te sers pas de cette phrase pour justifier de sauter l’étape IV.
> 

### 0.3 Sources utilisées

- `unboundwiki.com` — pages *Useful NPCs*, *IV Changer*, *EV Checker & Changer*, *Nature Changers*, *Mega Stones*, *Held Items*
- `pokemonunbound.miraheze.org` — *Battle Frontier*, *FAQ Page*
- `romhackdex.net/unbound` — statistiques, talents et learnsets spécifiques à Unbound
- `pokemoncoders.com` — obtention des Talents Cachés dans Unbound
- `pokecommunity.com` — thread officiel / FAQ de Skeli
- **Post Reddit r/PokemonUnbound** — *Pokémon Stats Explained – EV/IV/Nature Training Guide* (fourni par toi)
- **Yda Dex** — `https://ydarissep.github.io/Unbound-Pokedex/` — le Pokédex de référence pour Unbound, **il inclut les modifications propres au hack**. À garder ouvert dans un onglet en permanence.

---

## 1. Comprendre le endgame

### 1.1 Pourquoi un Pokémon niveau 100 peut être faible

Le niveau 100 est un prérequis, pas une garantie. Un Pokémon avec des IV moyens, des EV dispersés au fil du scénario, une nature tirée au hasard et un talent non adapté sera nettement moins efficace qu’un Pokémon optimisé de niveau inférieur. L’IA du postgame d’Unbound applique des stratégies de niveau compétitif : équipes construites, synergies de climat, objets stratégiques, prédictions de switch.

### 1.2 Terminé ≠ Optimisé

- **Terminé (scénario)** : Niveau 100, EV dispersés, IV variables, nature aléatoire, moveset orienté couverture brute.
- **Optimisé (endgame)** : 31 IV sur les stats utiles, 508 EV placés au point près, nature qui booste la stat clé sans pénaliser le rôle, talent optimal, moveset cohérent (STAB + couverture + utilitaire/setup), objet dédié.

```
Niveau 100
    ↓
   IV (potentiel génétique : 0 à 31)
    ↓
   EV (entraînement ciblé : 252 max/stat, 510 total)
    ↓
 Nature (+10 % / -10 %)
    ↓
 Talent
    ↓
Moveset (STAB + couverture + utilitaire)
    ↓
 Objet
    =
Pokémon compétitif
```

---

## 2. Mécaniques d’optimisation (version corrigée)

### 2.1 IV — Individual Values

0 à 31 par statistique. Au niveau 100, 31 IV = 31 points de stat supplémentaires.

| Rôle | IV visés | Exception |
| --- | --- | --- |
| Attaquant physique | 31 partout sauf Att. Spé. | Vitesse à 0 si équipe Distorsion |
| Attaquant spécial | 31 partout sauf Attaque | Attaque basse recommandée (réduit Confusion et Coup Bas / Foul Play) |
| Tank | 31 partout | Vitesse à 0 si Distorsion |

**Où :** PNJ **IV Changer**, Seaport City, près du port.
Depuis le Centre Pokémon de Seaport : plein est → descends les escaliers près de l’entrée KBT Expressway → plein sud → PNJ aux cheveux violets devant l’entrepôt.
- 1 **Bottle Cap** = 1 stat portée à 31
- 1 **Gold Bottle Cap** = les 6 stats

> ⚠️ **Deux pièges.**
1. Si le PNJ n’apparaît pas, mets la difficulté sur autre chose que *Vanilla*.
2. Le Hyper Training ne modifie **pas** la Puissance Cachée (Hidden Power). Pour ça, il y a le **Hidden Power Changer** à la Battle Frontier (contre BP). Pertinent pour Sceptile si tu vises PC Feu.
> 

**Obtenir des Bottle Caps :** minage avec l’**ADM Gear** (KBT Expressway, Crystal Peak), raids 5–6★, récompenses de missions. **Gold Bottle Cap** : mission **#006 « All the Right Moves »** (trouver les 120 CT — la dame est à Polder Town, à l’est de la ville au-dessus de l’entrée de la Zone Safari).

#### Les trois méthodes IV, et laquelle utiliser quand

| Méthode | Coût | Quand l’utiliser |
| --- | --- | --- |
| **DexNav** | Gratuit, un peu de temps | **Pour tout nouveau Pokémon.** Après avoir capturé une espèce puis l’avoir cherchée quelques fois au DexNav, la boîte de scan affiche une **note en étoiles = le nombre d’IV déjà à 31**. Capture quelques 2★/3★, compare-les dans le PC, garde le meilleur. |
| **Élevage** | Long | Meilleur résultat absolu. Fais les quêtes du personnage de la **Breeder’s School de Seaport City** pour obtenir un **Métamorph aux IV max**, donne-lui un **Nœud Destin** (achetable au Casino), et croise-le avec ta cible. Répète avec les bébés les plus proches du parfait. |
| **Bottle Caps** | Rare | **Réserve-les aux légendaires et mythiques** — ceux que tu ne peux ni élever ni DexNav. |

> 🎯 **Conséquence directe pour toi.** Zeraora est **le seul de tes 5 Pokémon** qui ne peut être ni élevé (groupe d’œufs *Indéterminé*) ni chassé au DexNav. **C’est lui, en priorité absolue, qui doit consommer tes Bottle Caps.**
> 
> 
> Pour Tyranitar / Sceptile / Dusknoir / Togekiss, tu as un vrai arbitrage à faire :
> - **Garder tes exemplaires actuels** (histoire, niveau 100 déjà atteint, CT déjà apprises) et payer en Bottle Caps ;
> - **ou en ré-élever/re-capturer** de meilleurs via DexNav 3★ + Métamorph parfait, ce qui coûte du temps mais zéro cap, puis les remonter au niveau 100 à la Trainer House de Dresco (quasi instantané avec un Œuf Chance amélioré).
> 
> Si tu as moins de ~8 Bottle Caps en stock, la seconde option est objectivement meilleure. Ce n’était pas une possibilité envisagée dans ton guide d’origine.
> 

> ⚠️ **Piège Vanilla.** Si tu joues en difficulté *Vanilla*, les notes IV en lettres n’apparaissent pas dans le résumé, **et** le PNJ IV Changer peut ne pas apparaître à Seaport. Monte au moins en *Difficile*.
> 

### 2.2 EV — Effort Values

510 au total, 252 maximum par stat. **4 EV = 1 point** au niveau 100 → **252 / 252 / 4** est la répartition optimale (le reste est perdu de toute façon).

```
[Sweeper physique / spécial]   252 Vit  | 252 Atk ou Att.Spé | 4 PV
[Tank physique]                252 PV   | 252 Déf            | 4 Déf.Spé
[Tank spécial]                 252 PV   | 252 Déf.Spé        | 4 Déf
[Bulky offense]                252 PV   | 252 Atk/Att.Spé    | 4 Vit
```

**Purger les EV parasites — 3 méthodes :**

1. **Baies réductrices** (Pomeg, Kelpsy, Qualot, Hondew, Grepa, Tamato) : **10 EV par baie**, et elles s’achètent au **marché en plein air de Fallshore City**. **C’est la méthode par défaut** : ça ne coûte que de l’argent, et l’argent se farme facilement à Dresco. Achètes-en une trentaine par stat à purger. Une boîte de dialogue t’avertit quand la stat est à 0.
2. **Battle Frontier**, stand en haut à droite : **5 BP par stat purgée**. Plus rapide, mais tes BP valent mieux que ça — garde-les pour les objets Choix. Ce PNJ peut aussi **maxer** une stat à 252 pour **50 BP** (dépannage de luxe).
3. Les vitamines ne purgent rien — elles ajoutent uniquement.

**Ré-entraîner les EV :**

- **Trainer House de Dresco Town** (coin **sud-est** de la ville) : chaque dresseur n’utilise que des Pokémon donnant un seul type d’EV, et l’annonce indirectement dans son dialogue (« mes Pokémon *rapides* vont te battre »). Avant Blizzard City : PV/XP, Attaque, Att.Spé, Vitesse. Après : Défense et Déf.Spé aussi. **C’est la méthode de référence**, confirmée par la FAQ du hack.
> 💡 En difficulté *Vanilla*, monte temporairement en *Difficile* : les dresseurs utilisent alors des Pokémon plus haut niveau et évolués, qui donnent **plus d’EV par combat**.
- **Macho Brace** — multiplie les EV gagnés **jusqu’à ×10 selon son niveau d’amélioration**. C’est de très loin le plus gros levier, et ton guide d’origine le sous-estimait complètement.
    - **Vanilla / Difficile** : donné par le Maître de Karaté **à l’ouest de Fallshore City, sur le bord sud de la carte** (Surf requis) — la Route 10, près de la cascade la plus au sud, sous la Cave of Being.
    - **Expert / Insane** : le Macho Brace est **déjà dans ton sac au début de la partie**, et le Maître de Karaté se trouve sur le **bord est de Crater Town**.
    - **Amélioration** : par ce même PNJ, contre des **Pierres Stase (Everstones)** — qui se farment très facilement **au minage dans le KBT Expressway, juste au nord de Crater Town**.
- **Objets Pouvoir** (Poids / Brassard / Ceinture / Bandeau / Lentille / Anneau) : donnent des EV d’une stat précise à chaque fin de combat, indépendamment du Pokémon vaincu. Obtenus via des missions secondaires (#003, #005, #033, #052, #071, + Vivill Warehouse B5F).
    - **Amélioration** : un **autre** Maître de Karaté, **près d’Antisis City** (côté Thundercap Mountain), contre des **Morceaux d’Étoile**.
    - **Farm de Morceaux d’Étoile** : DexNav un **Minior sur la Route 1** et vole-lui son objet avec **Sabotage (Knock Off)**, idéalement avec un Absol ou un Drapion.
- **Pokérus** : double tous les gains d’EV. Cumulable avec le Macho Brace et les objets Pouvoir.
- **Vitamines** : +10 EV/unité. Chères à l’achat et peu efficaces — **mais tu en as déjà un stock dans ton sac**, donc utilise-le, ne le rachète pas. Voir §0.1 pour le doute sur le plafond de 100.

> **Combo optimal :** Pokérus + Macho Brace amélioré ×10 + dresseur spécialisé de Dresco → une statistique passe de 0 à 252 EV en une poignée de combats.
> 

### 2.3 Nature

| Nature (Fr / En) | +10 % | -10 % | Usage |
| --- | --- | --- | --- |
| Rigide / Adamant | Attaque | Att. Spé. | Sweeper physique lent, bulky offense |
| Jovial / Jolly | Vitesse | Att. Spé. | Sweeper physique rapide |
| Modeste / Modest | Att. Spé. | Attaque | Sweeper spécial puissant |
| Timide / Timid | Vitesse | Attaque | Sweeper spécial rapide |
| Assuré / Bold | Défense | Attaque | Tank physique |
| Calme / Calm | Déf. Spé. | Attaque | Tank spécial |
| Malin / Impish | Défense | Att. Spé. | Tank physique qui frappe physique |
| Prudent / Careful | Déf. Spé. | Att. Spé. | Tank spécial qui frappe physique |

**Où changer :**
- **Tehl Town** — maison du côté ouest / sud-ouest du Centre Pokémon. Nécessite d’avoir terminé la mission **Seasonal Research (#053)** ; elle n’est pas difficile mais demande d’avoir progressé **au moins jusqu’à la Route 12**. 1er changement gratuit, puis **50 000 $ par changement, illimité**.
> 💡 Si tu ne dois faire **qu’une seule** chose sur un Pokémon, fais celle-ci : c’est un clic, 50 000 $, et l’effet (±10 % sur deux stats) est immédiat et énorme.
- **Battle Frontier** — stand en haut à gauche, **50 BP**. ⚠️ **Remet le bonheur du Pokémon à 0** (à surveiller si tu utilises Retour / Return).

> 💡 **Arbitrage économique :** 50 000 $ se farment en quelques minutes à Dresco. 50 BP demandent plusieurs runs de Frontier. **Passe systématiquement par Tehl Town** pour les natures et garde tes BP pour les objets Choix.
> 

### 2.4 Talents

- **Ability Capsule** — alterne entre **talent 1 et talent 2**. Obtenable au **Game Corner de Dehara**. Ne donne **jamais** le talent caché.
- **Dream Mist** — donne le **talent caché** d’un Pokémon déjà capturé. Postgame uniquement : raid **Musharna 5/6★** à Tarmigan Town (~50 % de drop ; accès via la sortie est du Tarmigan Mansion + interrupteur secret) ; un exemplaire offert par le scientifique devant le Research Center.
- **Dream Ball** — le Pokémon capturé obtient son talent caché. 3 par jour chez un scientifique du **Dream Research Lab de Tarmigan Town** (après la Ligue). La meilleure méthode pour les légendaires.
- **DexNav** — permet de chasser des sauvages qui ont déjà leur talent caché. Obtenu chez la sœur du Prof. Log, Blizzard City (maison au nord-ouest, à l’étage).
- **Ability Changer** — PNJ de la Battle Frontier (côté Battle Circus), contre BP.

> ✅ **Bonne nouvelle pour ton équipe :** les 5 talents dont tu as besoin sont soit le talent 1 (déjà en place), soit le talent 2 (**Ability Capsule suffit**). Aucune Dream Mist nécessaire. Détail dans les fiches §6.
> 

---

## 3. Procédure d’optimisation d’un Pokémon

L’ordre compte : certaines étapes coûtent des BP, d’autres de l’argent, et l’ordre ci-dessous minimise le gaspillage.

```
1. Définir le rôle dans l'équipe          (gratuit — la seule étape qui compte vraiment)
      ↓
2. Lire ses IV/EV actuels                 (PNJ Frontier ou Seaport, gratuit)
      ↓
3. Purger les EV parasites                (5 BP/stat, Frontier)
      ↓
4. Changer la nature                      (50 000 $, Tehl Town)
      ↓
5. Ré-entraîner les EV                    (Dresco + objets Pouvoir + Pokérus)
      ↓
6. Monter les IV à 31                     (Bottle Caps, Seaport)
      ↓
7. Ajuster le talent                      (Ability Capsule / Dream Mist)
      ↓
8. Construire le moveset                  (CT + Move Relearner + tuteurs Frontier)
      ↓
9. Équiper l'objet                        (Game Corner ou 32-48 BP au Battle Tower)
```

### Principes de moveset

1. **STAB** — au moins une attaque du type du Pokémon (+50 % de dégâts).
2. **Couverture** — toucher super-efficacement ce qui résiste au STAB principal.
3. **Setup** — Danse Draco, Machination, Gonflette, Exuviation… pour passer les murs.
4. **Utilitaire** — Piège de Roc, Provoc, Feu Follet, Toxik, Vœu, Atterrissage.
5. **Priorité** — Ombre Portée, Vitesse Extrême, Coup Bas pour achever plus rapide que soi.
6. **Synergie** — les faiblesses d’un membre doivent être couvertes par les résistances d’un autre.

---

## 4. Rôles compétitifs

| Rôle | Définition | Force | Faiblesse |
| --- | --- | --- | --- |
| **Sweeper** | Rapide et puissant, balaye après un boost | Vitesse + dégâts | Fragile, vulnérable aux priorités et au Mouchoir Choix |
| **Wall** | Encaisse et use l’adversaire | Longévité, contrôle du rythme | Dégâts faibles, vulnérable à Provoc |
| **Pivot** | Entre, encaisse, repart avec Demi-Tour / Change Éclair | Maintient le momentum | Sensible aux pièges d’entrée |
| **Wallbreaker** | Puissance brute dès l’entrée | Dégâts immédiats | Souvent lent, a besoin de pivots |
| **Cleaner** | Ultra-rapide, achève en fin de partie | Dépasse tout le méta | Inefficace face à une équipe intacte |
| **Revenge Killer** | Entre après un KO pour punir | Réponse immédiate | Dépend du Mouchoir Choix ou d’une priorité |
| **Lead** | Ouvre : hazards, Provoc, climat | Impose le tempo | Sacrifiable |

### Archétypes

```
[Hyper Offense]   Hazards/Screens → Sweeper setup → Cleaner
[Balance]         Wall physique + Wall spécial ↔ Pivot ↔ Wallbreaker
[Bulky Offense]   PV élevés + stats offensives ; encaisse et réplique
[Sand]            Tyranitar (Sable Volant) + Excadrill (Baigne Sable) + murs Roche/Sol/Acier
```

---

## 5. ✅ TODO LIST GÉNÉRALE — à faire maintenant

### PHASE 0 — Diagnostic (30 min, gratuit) — **commence ici**

- [x]  **0.0** 🔑 **Récupérer l’Advanced Stat Scanner** : parle à **l’assistant du Prof. Log, au laboratoire de Frozen Heights**. Il affiche stats de base + **IV en chiffres** + EV directement dans le résumé. **Tout le reste du guide devient dix fois plus simple avec cet objet en poche — commence par là.**
- [x]  **0.1** Récupérer la **Frontier Card** : parle au guide à la barrière **au nord de Seaport City** (disponible dès que tu es Champion).
- [x]  **0.2** Vérifier ta difficulté : si tu es en **Vanilla**, monte au moins en **Difficile** (sinon les notes IV sont masquées et le PNJ IV Changer peut ne pas apparaître).
- [x]  **0.3** **Noter sur papier / dans un fichier** les 6 IV et les 6 EV de tes 5 Pokémon. Sans ça tu vas gaspiller des Bottle Caps sur des stats déjà à 31.
- [x]  **0.4** Décider du rôle définitif de chaque Pokémon (les fiches §6 te donnent une recommandation argumentée).
- [x]  **0.5** **Trancher le conflit de Méga.** Tu ne peux Méga-évoluer qu’**un** Pokémon par combat : Tyranitar **ou** Sceptile, pas les deux. Voir §6.2.
- [x]  **0.6** Vérifier que tu as bien battu **Successor Maxima au Tarmigan Mansion** (prérequis obligatoire pour Méga-évoluer).

### PHASE 1 — Débloquer l’infrastructure

- [x]  **1.1** Terminer la mission **Seasonal Research (#053)** — scientifique dans la maison au sud-ouest du Centre Pokémon de **Tehl Town**. Débloque le Nature Changer à 50 000 $ (au lieu de 50 BP).
- [x]  **1.2** Récupérer le **DexNav** si tu ne l’as pas : sœur du Prof. Log, Blizzard City, maison au nord-ouest, à l’étage.
- [x]  **1.3** Récupérer la **Rune Purif. / Amulet Coin** : échange en jeu à Blizzard City (Onix contre Électrode). L’améliorer chez le PNJ au centre de **Tehl Town** contre des Gros Pépites (nécessite de lui montrer Regigigas).
- [x]  **1.4** 🔑 **Récupérer et améliorer le Macho Brace au maximum (×10 EV).** C’est le plus gros gain de temps de toute la Phase 3.
    - Le récupérer : Maître de Karaté à l’ouest de Fallshore City / Route 10, bord sud de la carte, Surf requis (ou bord est de Crater Town en Expert/Insane, où tu l’as déjà dans le sac).
    - **Farmer des Pierres Stase (Everstones)** au minage dans le **KBT Expressway au nord de Crater Town**, puis les échanger au même PNJ pour monter le multiplicateur.
- [ ]  **1.5** Récupérer les **objets Pouvoir** manquants via leurs missions : Brassard (#003), Ceinture (#005), Anneau (#033), Bandeau (#052), Poids (#071), Lentille (Vivill Warehouse B5F). Les améliorer chez le second Maître de Karaté près d’Antisis City, contre des **Morceaux d’Étoile** (à voler aux Minior de la Route 1 avec Sabotage).
- [x]  **1.6** Choper le **Pokérus** si possible (raids, échanges) — double tous les gains d’EV, cumulable avec le Macho Brace.
- [x]  **1.7** *(optionnel mais rentable)* Faire les quêtes de la **Breeder’s School de Seaport City** pour obtenir un **Métamorph aux IV parfaits**, + un **Nœud Destin** au Casino. Ça remplace définitivement les Bottle Caps pour tout Pokémon élevable.

### PHASE 2 — Farm des ressources

- [ ]  **2.1 Argent — objectif ~500 000 $** (5 natures + marge). Trainer House de Dresco Town, Amulet Coin améliorée en tête d’équipe.
- [ ]  **2.2 Baies réductrices d’EV** — marché en plein air de **Fallshore City**. Compte ~25 baies par stat à purger (10 EV/baie). C’est ta méthode de purge principale : **0 BP dépensé**.
- [ ]  **2.3 BP — objectif ~200 BP.** Battle Tower en Singles. Budget prévisionnel révisé :
    - purge EV : **0 BP** si tu passes par les baies de Fallshore
    - objets Choix : 48 BP pièce (non disponibles au Game Corner)
    - Bottes Épaisses : 48 BP (ou exemplaire unique à Cootes Bog)
    - tuteurs et Egg Move Tutor : variable
- [ ]  **2.4 Bottle Caps.** Minage avec l’**ADM Gear** (KBT Expressway, Crystal Peak) + raids 5–6★. **Priorité : Zeraora d’abord** (seul non-élevable et non-DexNavvable de ton équipe). Pour les autres, compare le coût en caps avec un ré-élevage via Métamorph parfait.
- [ ]  **2.5 Écailles Cœur.** Pêche aux Luvdisc à la Méga Canne, avec un Pokémon en tête ayant **Fouille (Frisk)** + **Larcin (Thief)**. Ton **Dusknoir peut avoir Fouille comme talent caché** — pratique, mais ça lui coûte Pression, à ne faire que sur un second exemplaire.
- [ ]  **2.6 Jetons du Game Corner** (Dehara) si tu vises Orbe Vie (7 500 jetons) ou Restes (5 000 jetons) sans dépenser de BP.
- [ ]  **2.7 (optionnel) Gold Bottle Cap** — mission **#006**, collecter les 120 CT. Long, mais ça règle un Pokémon entier d’un coup.

### PHASE 3 — Optimisation, Pokémon par Pokémon

Suis les fiches §6 dans cet ordre de priorité (retour sur investissement décroissant) :

- [ ]  **3.1 Togekiss** — le meilleur rapport effort/puissance de ton équipe. Une Ability Capsule le transforme.
- [x]  **3.3 Tyranitar** — puissant mais il faut trancher son rôle et gérer le sable.

### PHASE 4 — Combler les trous d’équipe

- [x]  **4.1** Ajouter un **6ᵉ Pokémon** — ton équipe n’a **aucun retrait de hazards** (ni Anti-Brume ni Tour Rapide). Sur la durée du Battle Tower, le Piège de Roc à lui seul détruit ton Togekiss (25 % par entrée).
    - **Excadrill** — Tour Rapide + Baigne Sable, synergie parfaite avec Tyranitar
    - **Corviknight** — Anti-Brume + résistance Acier, couvre les faiblesses Glace/Fée
    - **Landorus-Thérien** — Intimidation + Demi-Tour + Piège de Roc
- [x]  **4.2** Décider qui pose le **Piège de Roc**. Tyranitar est le candidat naturel.

### PHASE 5 — Battle Frontier

- [ ]  **5.1** Commencer par le **Battle Tower en Singles** (format le plus lisible).
- [ ]  **5.2** ⚠️ **Vérifier les règles du format avant de construire ton équipe** : selon le bâtiment et le tier, les objets doublons et certains talents/capacités (Moody, Chlorophyle, Relais, Toile Gluante…) sont interdits. Ne planifie pas 3 Restes.
- [ ]  **5.3** Viser un Gold Print par bâtiment, puis les Frontier Brains (Palmer, Paula, Pablo, Patroz).

---

## 6. Fiches détaillées par Pokémon

> Les statistiques de base et les learnsets ci-dessous sont ceux **d’Unbound** (source : romhackdex.net/unbound), pas ceux des jeux officiels — il y a des différences.
> 

---

### 6.1 Tyranitar

**Type :** Roche / Ténèbres — **Stats :** 100 / 134 / 110 / 95 / 100 / 61 (BST 600)
**Talents :** Sable Volant (Sand Stream) — Anti-Gourmandise (Unnerve) — *pas de talent caché exploitable***Méga :** Tyranitarite → 100 / **164** / **150** / 95 / **120** / 71 (BST 700), garde Sable Volant

#### Analyse critique

C’est ta meilleure pièce brute. Sable Volant lui donne **+50 % de Déf. Spé. sous la tempête de sable**, ce qui en fait un tank spécial gratuit en plus d’un wallbreaker.

**MAIS** — et c’est le point que ton guide d’origine a raté : **le sable inflige des dégâts à 4 de tes 5 Pokémon actuels** (Sceptile, Dusknoir, Togekiss, Zeraora — seul Tyranitar y est immunisé). Sur un run de Battle Tower, tu t’infliges 6,25 % par tour à ton équipe entière. Ce n’est pas rédhibitoire, mais ça veut dire une chose :

> **Soit tu construis autour du sable** (ajoute Excadrill / Gigalithe / un Acier), **soit tu joues Tyranitar comme un simple wallbreaker et tu acceptes le chip damage.** L’entre-deux est le pire choix.
> 

Sa **Vitesse 61** est le second point clé : investir 252 EV en Vitesse ne le fait dépasser presque personne. Une nature Jovial est un gâchis **sauf** si tu joues Danse Draco.

#### Trois builds cohérents — choisis-en un

**A. Wallbreaker Bandeau Choix** *(le plus simple, le plus fiable)*
- Nature **Rigide (Adamant)**
- EV **252 PV / 252 Atk / 4 Déf.Spé**
- Objet **Bandeau Choix** (48 BP au Battle Tower)
- Moveset : Lame de Roc / Mâchouille / Séisme / Poing Glace
- *Pourquoi 252 PV et pas 252 Vit :* à 61 de base il ne dépassera rien d’utile ; la masse de PV + le boost Déf.Spé du sable en font un mur offensif.

**B. Sweeper Danse Draco** *(plafond plus haut, plus risqué)*
- Nature **Rigide (Adamant)** — Jovial seulement si tu veux dépasser des cibles précises
- EV **252 Atk / 252 Vit / 4 PV**
- Objet **Ceinture Force (Focus Sash)** (32 BP) ou **Orbe Vie**
- Moveset : Danse Draco / Lame de Roc / Mâchouille / Séisme

**C. Méga-Tyranitar** *(le plus fort, mais consomme ton slot Méga)*
- Nature **Rigide (Adamant)**
- EV **252 PV / 252 Atk / 4 Déf.Spé**
- Objet **Tyranitarite**
- Moveset : Danse Draco / Lame de Roc / Mâchouille / Séisme
- **Tyranitarite** : trouvée au Shadow Base 1F si Embrylex était ton starter, sinon récompense de la mission **#050 « Portal Purge »**.

#### ✅ TODO Tyranitar

- [x]  Choisir le build (A, B ou C) — **ne saute pas cette étape**, tout le reste en dépend
- [x]  Lire ses IV/EV actuels (PNJ Frontier)
- [x]  Purger les EV parasites : toutes les stats sauf celles du build choisi (5 BP/stat)
- [x]  Changer la nature en **Rigide** (Tehl Town, 50 000 $)
- [x]  Vérifier son talent : il doit être **Sable Volant**, pas Anti-Gourmandise. Si c’est Anti-Gourmandise → **Ability Capsule** (Game Corner de Dehara)
- [x]  EV : Trainer House de Dresco, dresseur PV + dresseur Attaque, avec Poids Pouvoir puis Brassard Pouvoir
- [x]  IV : Bottle Caps sur **Attaque, PV, Défense, Déf. Spé.** — **ne gaspille pas de cap sur l’Att. Spé.** (il ne l’utilise jamais). Vitesse uniquement pour le build B/C
- [x]  Moveset : CT Séisme / Lame de Roc ; **Mâchouille** et **Danse Draco** via le Move Relearner de **Crater Town** (Écailles Cœur) si oubliés ; Poing Glace via tuteur
- [x]  Objet : Bandeau Choix (48 BP) / Tyranitarite / Roche Lisse — la **Roche Lisse (Smooth Rock)** rallonge le sable à 8 tours (Great Desert, au nord de Cameron, ou minage ADM)
- [x]  Décider s’il porte le **Piège de Roc** (recommandé : oui, dans le build B ou C)

---

### 6.2 Flagadoss (Slowbro) — *remplace Sceptile*

**Type :** Eau / Psy — **Stats :** 95 / 75 / **110** / 100 / 80 / 30 (BST 490)
**Talents :** Benêt (Oblivious) — Tempo Perso (Own Tempo) — **Régé-Force (Regenerator)** en talent caché
**Obtention :** évolution de **Ramoloss au niveau 37**, ou **Repaire de Raid de la Route 14 (4-5★)**

#### D’abord, deux mises au point

**1. Roigada (Slowking) n’est PAS l’évolution de Flagadoss.** Les deux sont des évolutions **parallèles** de Ramoloss :

|  | Obtention | PV | Déf | Att.Spé | **Déf.Spé** |
| --- | --- | --- | --- | --- | --- |
| **Flagadoss** | Niveau 37 | 95 | **110** | 100 | 80 |
| **Roigada** | **Échange** (Écaille Royale) | 95 | 80 | 100 | **110** |

Même BST, Défense et Déf.Spé simplement inversées.

**Prends Flagadoss**, pour deux raisons :
- Le trou que tu bouches, c’est le **Combat**, et les attaques Combat qui font mal (Close Combat, Force Poing, Poing Boost) sont **physiques**. C’est la Défense qui compte, pas la Déf.Spé.
- Flagadoss évolue **au niveau 37**, sans échange. Roigada demande un échange — toujours pénible en solo sur une ROM hack.

> Bascule sur Roigada uniquement si, après quelques runs de Battle Tower, tu constates que tu meurs surtout à des attaques spéciales.
> 

**2. Non, tu ne peux pas cumuler Slowbronite et Tyranitarite.** Bien vu — **une seule Méga-Évolution par combat**, et Méga-Tyranitar est ton choix. La Slowbronite reste donc au fond du sac. Ma phrase du message précédent était ambiguë : je citais la plage de Seaport City comme **preuve que Flagadoss existe dans le jeu**, pas comme une recommandation d’objet.

#### Analyse critique

Flagadoss est le **seul membre de l’équipe qui résiste au Combat**, et c’est pour ça qu’il entre. Rappel du problème : Méga-Tyranitar prend ×4, Excadrill ×2, et personne ne pouvait switcher dedans.

Son profil défensif couvre presque exactement la liste des peurs de ton duo sable :

| Il résiste à… | Qui en avait besoin |
| --- | --- |
| **Combat** | Méga-Tyranitar (×4), Excadrill (×2) |
| **Eau** | Tyranitar (×2), Excadrill (×2), Scorvol (×2) |
| **Feu** | Excadrill (×2) |
| **Glace** | Scorvol (×4) |
| **Acier** | Tyranitar (×2), Togekiss (×2) |
| **Psy** | — (bonus) |

**Régé-Force est le cœur du set** : 1/3 des PV max récupérés à chaque changement. Combiné à Grosse Flemme (Slack Off), tu obtiens un mur qui ne meurt quasiment jamais d’usure. C’est aussi ce qui compense le chip du sable : Flagadoss le régénère en sortant.

**Ses défauts, sans détour :**
- **Vitesse 30.** Il joue toujours en dernier. Ce n’est pas un problème pour un mur, mais ne compte jamais sur lui pour achever.
- **Déf.Spé 80** — c’est son vrai point faible. Un attaquant spécial Ténèbres ou Spectre le déchire.
- Faiblesses : **Électrik, Plante, Insecte, Spectre, Ténèbres**. Le Ténèbres est gênant car Tyranitar y est aussi faible… mais Togekiss (Fée) résiste et Excadrill (Acier) aussi.
- **Il prend le chip du sable.** Régé-Force l’absorbe, mais ça reste un coût.

#### Build recommandé — Mur physique / Pivot régénérant

- Nature **Assuré (Bold)** (+Déf / -Atk)
- EV **252 PV / 252 Déf / 4 Déf.Spé**
- Talent **Régé-Force (Regenerator)** — talent **caché**, donc **Dream Mist ou Dream Ball obligatoire**
- Objet **Restes** (Game Corner, 5 000 jetons) ou **Casque Brut** (48 BP) contre les attaquants physiques
- Moveset : **Ébullition / Grosse Flemme / Danse Ténèbre ou Cage-Éclair / Vibra-Soin**
    - *Ébullition (Scald)* : 30 % de brûlure — sur un mur physique, c’est une seconde couche de défense
    - *Grosse Flemme (Slack Off)* : soin fiable à 50 %, à empiler avec Régé-Force
    - *Danse Ténèbre (Toxic)* ou *Cage-Éclair* : de quoi ne pas être passif face aux setup sweepers
    - *Vibra-Soin (Psyshock)* : STAB qui frappe la **Défense** adverse — utile contre les murs spéciaux qui te bloqueraient sinon

**Variante Plénitude (Calm Mind)** : si tu veux qu’il gagne des combats plutôt que de les tenir — Plénitude / Ébullition / Vibra-Soin / Grosse Flemme, nature **Calme**, EV 252 PV / 252 Déf.Spé. Plus lent à mettre en place, mais il devient une menace réelle en fin de partie.

#### ✅ TODO Flagadoss

- [x]  **Obtenir un Ramoloss ou un Flagadoss.** Le plus propre : **DexNav un Ramoloss** jusqu’à en trouver un **3★** (3 IV déjà à 31) — ça t’économise 3 Bottle Caps. Alternative : Repaire de Raid de la **Route 14 (4-5★)** pour un Flagadoss direct.
- [x]  **Obtenir Régé-Force.** C’est le talent **caché**, donc deux chemins :
    - **Dream Ball** (3/jour, Dream Research Lab de Tarmigan Town) → capture un Ramoloss directement avec Régé-Force. **C’est la meilleure option** : gratuite et répétable.
    - **Dream Mist** (raid Musharna 5/6★ à Tarmigan Town) sur un exemplaire déjà en ta possession.
    - ⚠️ **Une Ability Capsule ne suffit PAS** ici — elle ne fait qu’alterner Benêt ↔︎ Tempo Perso.
- [x]  Faire évoluer au **niveau 37** (Trainer House de Dresco + Œuf Chance amélioré = quelques minutes)
- [ ]  Monter au niveau 100 (même méthode)
- [x]  Purger les EV parasites — baies au marché de **Fallshore City**
- [x]  Nature → **Assuré (Bold)** (Tehl Town, 50 000 $)
- [x]  EV : Dresco, dresseur PV (Poids Pouvoir) puis dresseur Défense (Ceinture Pouvoir), avec Macho Brace amélioré si tu ne fais qu’une stat à la fois
- [x]  IV : Bottle Caps sur **PV et Défense** en priorité, puis Déf.Spé. **Ignore l’Attaque et la Vitesse** — une Attaque basse réduit les dégâts de Coup Bas (Foul Play), et la Vitesse ne lui sert à rien
- [x]  Moveset : **Ébullition (CT)**, **Grosse Flemme** et **Vibra-Soin** via le Move Relearner de **Crater Town** (Écailles Cœur) ou les tuteurs de la Battle Frontier
- [ ]  Objet : **Restes** au Game Corner (5 000 jetons). ⚠️ Vérifie que Togekiss ou Motisma ne le porte pas déjà — certains formats de la Frontier interdisent les objets en double
- [x]  ❌ **Ne pas lui donner la Slowbronite** — le slot Méga est pris par Tyranitar

### 6.3 Togekiss

**Type :** Fée / Vol — **Stats :** 85 / 50 / 95 / 120 / 115 / 80 (BST 545)
**Talents :** Hustle — **Sérénité (Serene Grace) = talent 2** — Œil Compétitif (caché)

#### Analyse critique

**C’est ton meilleur investissement, de loin.** Sérénité double les effets secondaires : Lame d’Air passe de 30 % à **60 % de chance d’apeurer**. Combiné à Cage-Éclair (paralysie = 25 % de chance de ne pas agir), tu obtiens la fameuse **para-flinch** : l’adversaire a environ **70 % de chance de ne rien faire à chaque tour**.

C’est une stratégie qui frôle l’abus contre l’IA du Battle Tower, et c’est exactement pour ça qu’elle est parfaite pour ton usage.

**Correction importante :** Sérénité **n’est pas** son talent caché — c’est son **talent 2**. Une **Ability Capsule** du Game Corner suffit. Économie de plusieurs heures de farm de Dream Mist.

**Sur la nature :** ton guide d’origine proposait **Assuré (Bold)**. C’est un mauvais choix ici — Bold baisse l’Attaque (que Togekiss n’utilise pas, donc OK) mais monte la Défense, alors que ce que tu veux c’est **agir en premier pour apeurer**. Un Togekiss lent ne peut pas apeurer.

#### Build recommandé — Para-Flinch

- Nature **Timide (Timid)** (+Vit / -Atk)
- EV **252 PV / 252 Vit / 4 Att.Spé** — la Vitesse est la stat qui fait fonctionner la stratégie
- Objet **Bottes Épaisses (Heavy-Duty Boots)** — Togekiss prend **25 % par Piège de Roc**, c’est sa faiblesse n°1
- Moveset : **Lame d’Air / Cage-Éclair / Atterrissage / Machination**
    - *Lame d’Air* = le cœur du set
    - *Cage-Éclair* = la moitié du combo
    - *Atterrissage (Roost)* = soin fiable, indispensable
    - *Machination (Nasty Plot)* ou *Éclat Magique* selon que tu préfères la puissance ou la couverture

**Variante Bulky Offense :** Nature **Modeste**, EV 252 PV / 252 Att.Spé, objet **Restes**, avec Éclat Magique + Aurasphère. Plus de dégâts, moins de contrôle.

#### ✅ TODO Togekiss

- [x]  **Acheter une Ability Capsule** au **Game Corner de Dehara** → passer en **Sérénité**. ⚠️ Vérifie d’abord son talent actuel : s’il est déjà en Sérénité, tu n’as rien à faire
- [x]  Purger ses EV (5 BP/stat, Frontier)
- [x]  Nature → **Timide** (Tehl Town, 50 000 $)
- [x]  EV : Dresco, dresseur PV (Poids Pouvoir) + dresseur Vitesse (Anneau Pouvoir)
- [x]  IV : Bottle Caps sur **PV, Vitesse, Att.Spé, Déf.Spé** — **ignore l’Attaque**
- [x]  Moveset : **Cage-Éclair (CT73)**, **Atterrissage** et **Machination** via Move Relearner de Crater Town (Écailles Cœur) ou tuteur Frontier
- [x]  Objet : **Bottes Épaisses** — 48 BP au Battle Tower, ou exemplaire unique à **Cootes Bog** (nord-est de la Ranger Betty)
- [x]  **Vérifier son bonheur** si tu passes par le Nature Changer de la Frontier (il le remet à 0) — sans impact ici puisque le set n’utilise pas Retour

---

### 6.4 Dusknoir — ❌ *sorti de l’équipe (voir §6.7-B pour son recyclage)*

> **Décision prise :** Dusknoir quitte l’équipe de combat. Fiche conservée pour référence — et parce qu’il a une seconde vie comme **mule à objets** grâce à son talent caché Fouille (§6.7-B).
> 

**Type :** Spectre — **Stats :** 45 / 100 / 135 / 65 / 135 / 45 (BST 525)
**Talents :** Pression (Pressure) — **Fouille (Frisk)** en talent caché

#### Analyse critique — le maillon faible

Je vais être direct : **Dusknoir est le Pokémon le plus surestimé de ton équipe.**

135 en Défense et 135 en Déf. Spé., c’est excellent sur le papier. **45 en PV, c’est catastrophique.** La survivabilité réelle se calcule `PV × Défense`, et 45 PV divise sa résistance effective par presque deux par rapport à un tank normal. Même avec 252 EV en PV, il plafonne à ~324 PV au niveau 100 — moins qu’un Togekiss non investi.

Ajoute à ça :
- **Aucun soin fiable** — seulement Balance (Pain Split), qui est aléatoire et dépend des PV adverses
- **Aucun retrait de hazards**
- **Vitesse 45** — il agit toujours en dernier
- Il **prend les dégâts de sable** de ton propre Tyranitar

**Ses deux vraies utilités :**
1. **Spinblocker** — étant Spectre, il bloque Tour Rapide (mais pas Anti-Brume). Utile seulement si toi tu poses des hazards.
2. **Support Feu Follet** — brûler un attaquant physique adverse divise ses dégâts par deux. Ça, c’est réellement précieux au Battle Tower.

**Trois options honnêtes :**

- **Option 1 — Le garder en support minimal.** Investissement réduit : nature + EV, pas de Bottle Caps. Il fait son job de Feu Follet et de blocage.
- **Option 2 — Le remplacer.** **Corviknight** (Anti-Brume, résistance Acier, soin fiable) ou **Toxapex** couvrent bien mieux le rôle de mur. C’est ce que je ferais.
- **Option 3 — Pivoter vers une équipe Distorsion (Trick Room).** Sa Vitesse 45 devient un **atout** : sous Distorsion, il agit en premier, et Tyranitar (61) aussi. C’est une réorientation complète de l’équipe, mais c’est cohérent et surprenant. Si ça t’intéresse, dis-le-moi et je te construis l’équipe autour.

#### Build recommandé (Option 1)

- Nature **Malin (Impish)** (+Déf / -Att.Spé)
- EV **252 PV / 252 Déf / 4 Déf.Spé**
- Objet **Restes** (Game Corner, 5 000 jetons — ne dépense pas 48 BP pour lui)
- Moveset : **Feu Follet / Ombre Portée / Balance / Poing Glace**
    - *Ombre Portée* : priorité +1, permet d’achever malgré sa lenteur
    - *Poing Glace* ou *Séisme* pour la couverture

#### ✅ TODO Dusknoir

- [ ]  **Trancher entre Option 1, 2 ou 3 avant de dépenser quoi que ce soit**
- [ ]  Si Option 2 (remplacement) → arrête ici, passe à la Phase 4
- [ ]  Si Option 1 : purger les EV (5 BP/stat)
- [ ]  Nature → **Malin (Impish)** (Tehl Town)
- [ ]  EV : Dresco, dresseur PV + dresseur Défense (Ceinture Pouvoir)
- [ ]  IV : **investissement minimal** — Bottle Caps sur **PV et Défense** uniquement. Ne dépense pas 6 caps sur un Pokémon de rôle secondaire
- [ ]  Talent : **garder Pression** (fait perdre 2 PP par attaque adverse — utile en combat d’usure). Fouille n’a d’intérêt que pour le farm d’Écailles Cœur
- [ ]  Moveset : Feu Follet (CT), Ombre Portée / Balance / Poing Glace via Move Relearner ou tuteur
- [ ]  Objet : **Restes** au Game Corner (5 000 jetons) plutôt qu’au Battle Tower (48 BP)

---

### 6.5 Zeraora — ❌ *sorti de l’équipe*

> **Décision prise :** Zeraora sort, non pas parce qu’il est mauvais — il est excellent — mais parce qu’il **fait doublon avec Excadrill** (cleaner physique rapide) tout en étant **puni par ton propre sable**, alors qu’Excadrill y gagne 176 de Vitesse. Fiche conservée : si tu abandonnes un jour le plan sable, il rentre immédiatement.
> 

**Type :** Électrik — **Stats :** 88 / 112 / 75 / 102 / 80 / **143** (BST 600)
**Talents :** **Absorbe-Volt (Volt Absorb)** — Prescience (Anticipation) en talent caché
**Localisation :** Thundercap Mountain 4F (nécessite l’**ADM Gear**)

#### Analyse critique

Excellent choix, et il arrive au bon moment : **fraîchement capturé, ses EV sont vierges** — tu n’as rien à purger, ce qui fait de lui le Pokémon le moins cher à optimiser de ton équipe. Commence par lui ou par Togekiss.

**143 de Vitesse de base**, c’est top-tier absolu : il dépasse presque tout le métagame. **Absorbe-Volt** lui donne une **immunité Électrik avec soin**, ce qui en fait un switch-in gratuit sur les attaques électriques.

**Corrections par rapport à ton guide d’origine :**

- ❌ **Zeraora n’apprend pas Danse Lames dans Unbound.** Son unique setup est **Gonflette / Bulk Up (CT08)** ou *Aiguisage / Hone Claws*. Vu sa fragilité (75 Déf / 80 Déf.Spé), il n’a de toute façon pas le temps de se booster : **joue-le en attaquant direct**.
- ⚠️ **Plasma Punch (Plasma Fists) s’apprend au niveau 88** et **Close Combat au niveau 96**. Si tu l’as capturé à un niveau plus bas puis monté à 100 avec des Super Bonbons, il ne les connaît pas → **Move Relearner de Crater Town** contre des Écailles Cœur. C’est la première chose à faire.
- ✅ **Sabotage (Knock Off)** est bien disponible — via **tuteur**, pas par CT.
- ✅ **Change Éclair (Volt Switch)** : CT92 **et** apprentissage naturel au niveau 32.
- ⚠️ **Garde Absorbe-Volt.** Prescience (le talent caché) est nettement moins bon. **N’achète pas de Dream Mist pour lui.**

#### Build recommandé — Cleaner / Pivot offensif

- Nature **Jovial (Jolly)** (+Vit / -Att.Spé)
- EV **252 Atk / 252 Vit / 4 PV**
- Objet **Orbe Vie** (Game Corner, 7 500 jetons — moins cher que 48 BP)
- Moveset : **Plasma Punch / Close Combat / Sabotage / Change Éclair**
    - *Plasma Punch* : STAB principal, 100 de puissance
    - *Close Combat* : couverture Acier/Roche/Ténèbres, indispensable
    - *Sabotage* : retire l’objet adverse — énorme valeur au Battle Tower contre les Restes et les objets Choix
    - *Change Éclair* : conserve le momentum et ramène Togekiss en sécurité

**Variantes :**
- **Bandeau Choix** (48 BP) au lieu d’Orbe Vie : plus de dégâts immédiats, mais tu perds la flexibilité et Change Éclair devient ta seule sortie.
- **Vive-Attaque (Fake Out)** en slot 1 si tu le joues en lead : dégâts gratuits + flinch garanti au premier tour.
- **Étrangleur (Throat Chop)** disponible en tuteur, alternative à Sabotage si tu affrontes beaucoup de Psy/Spectre.

#### ✅ TODO Zeraora

- [ ]  **Vérifier son moveset actuel.** S’il lui manque **Plasma Punch** ou **Close Combat** → **Move Relearner de Crater Town** (maison au sud du Centre Pokémon), contre des Écailles Cœur
- [ ]  Lire ses IV (PNJ Seaport ou Frontier) — un légendaire fraîchement capturé a souvent 3 IV garantis à 31, vérifie avant de gaspiller des caps
- [ ]  **Pas besoin de purger les EV** s’il est fraîchement capturé (à confirmer en le regardant)
- [ ]  Nature → **Jovial (Jolly)** (Tehl Town, 50 000 $)
- [ ]  EV : Dresco, dresseur Attaque (Brassard Pouvoir) + dresseur Vitesse (Anneau Pouvoir)
- [ ]  IV : Bottle Caps sur **Attaque, Vitesse, PV** — **ignore l’Att. Spé.** (mieux vaut la laisser basse)
- [ ]  Talent : **vérifier que c’est Absorbe-Volt**, pas Prescience. Si c’est Prescience, il faudra un autre exemplaire — pas d’Ability Capsule possible entre talent standard et talent caché
- [ ]  Apprendre **Sabotage** chez le tuteur (Battle Frontier)
- [ ]  Apprendre **Change Éclair** (CT92) si absent
- [ ]  Objet : **Orbe Vie** au Game Corner (7 500 jetons) ou Bandeau Choix (48 BP)
- [ ]  **Note d’équipe :** Zeraora est ×2 faible au Sol, comme Tyranitar. Togekiss (type Vol) est ton switch gratuit sur Séisme — construis tes rotations autour de ça

---

### 6.6 Scorvol (Gliscor) — *nouveau, slot 6*

**Type :** Sol / Vol — **Stats :** 75 / 95 / **125** / 45 / 75 / 95 (BST 510)
**Talents :** Régime Strict (Hyper Cutter) — Sable Volant (Sand Veil) — **Soin Poison (Poison Heal)** en talent caché
**Obtention :** **Gligar à Valley Cave** (+ Repaire de Raid de Valley Cave 3★), évolue en tenant un **Croc Rasoir (Razor Fang)** et en montant de niveau **la nuit**. Scorvol s’obtient aussi directement au **Repaire de Raid de Valley Cave (4-5★)**.
**Croc Rasoir :** Valley Cave B1F (zone centrale, derrière un rocher cassable), Victory Road, ou **48 BP** au comptoir d’échange de la Battle Frontier. 5 % sur les Bruxish sauvages.

#### Analyse critique

Scorvol est le seul Pokémon de la liste qui coche **quatre cases d’un coup** :

1. **Immunisé au sable** (type Sol) — il ne subit pas ton propre Tyranitar
2. **Immunisé au Sol** (type Vol) — troisième immunité Sol de l’équipe, Tyranitar peut switcher librement
3. **Immunisé à l’Électrik** (type Sol) — couvre la faiblesse ×2 de Togekiss
4. **Résiste au Combat** — seconde résistance après Flagadoss, sur le trou n°1 de ton équipe

Ajoute **Soin Poison + Orbe Toxique** : il récupère **1/8 de ses PV max par tour**, est immunisé à tous les autres statuts (brûlure, paralysie, sommeil), et se soigne encore avec **Atterrissage**. C’est un mur physique qui ne meurt pas, et il pose ton **Piège de Roc** — ce qui libère Tyranitar d’avoir à le faire.

**Le combo à connaître :** sous Soin Poison, Scorvol est empoisonné en permanence. **Façade (Facade)** double sa puissance quand le lanceur a un statut → **140 de puissance** avec 95 d’Attaque, sans recul et sans baisse de stat. C’est son meilleur STAB de secours à côté de Séisme.

**Ses défauts, sans détour :**
- **Glace ×4.** Un seul Laser Glace le sort du combat. C’est sa faiblesse rédhibitoire, et elle chevauche mal avec Togekiss (Glace ×2). Flagadoss résiste à la Glace : c’est ton switch.
- **Eau ×2**, qui s’empile avec Tyranitar et Excadrill. Là encore, Flagadoss couvre.
- **Att.Spé 45** — c’est un attaquant purement physique. Il ne règle pas ta monoculture, il règle ta défense.
- **Soin Poison est un talent caché** → Dream Mist ou Dream Ball obligatoires.

> ⚠️ **Sable Volant (Sand Veil) donne 20 % d’esquive sous le sable — n’y touche pas.** Certains formats de la Battle Frontier bannissent les talents et objets d’esquive, et l’esquive est de toute façon une source de frustration. **Soin Poison est le seul talent qui vaut le coup ici.**
> 

#### Build recommandé — Mur physique / Poseur de hazards

- Nature **Malin (Impish)** (+Déf / -Att.Spé)
- EV **252 PV / 252 Déf / 4 Vit**
- Talent **Soin Poison (Poison Heal)**
- Objet **Orbe Toxique (Toxic Orb)** — obligatoire, c’est ce qui active le talent (Valley Cave, à l’ouest de Black Belt Hitoshi, ou **16 BP** au Battle Tower)
- Moveset : **Séisme / Piège de Roc / Atterrissage / Sabotage**
    - *Séisme* : STAB principal
    - *Piège de Roc (Stealth Rock)* : le poseur de hazards qui manquait à l’équipe
    - *Atterrissage (Roost)* : soin, empilé avec Soin Poison
    - *Sabotage (Knock Off)* : retire les Restes et les objets Choix adverses — valeur énorme au Battle Tower
    - *Façade* remplace Sabotage si tu préfères la puissance brute (140 de puissance sous poison)

**Variante offensive :** Danse Lames / Séisme / Façade / Atterrissage, nature **Rigide**, EV 252 Atk / 252 Vit. Il devient un vrai sweeper, mais tu perds le Piège de Roc et la solidité — et l’équipe a plus besoin du mur.

#### ✅ TODO Scorvol

- [ ]  **Capturer un Gligar avec Soin Poison.** Deux chemins :
    - **Dream Ball** (3/jour, Dream Research Lab de Tarmigan Town) sur un Gligar de **Valley Cave** → talent caché garanti. **Le plus simple.**
    - **DexNav** un Gligar à Valley Cave en visant **3★** (3 IV à 31), puis **Dream Mist** dessus.
    - Si tu peux combiner les deux (Dream Ball **et** un bon jet d’IV), fais-le : ça t’économise 3 Bottle Caps.
- [ ]  **Récupérer un Croc Rasoir** : Valley Cave B1F derrière le rocher cassable, ou 48 BP
- [ ]  **Faire évoluer** : donner le Croc Rasoir à tenir, puis monter d’un niveau **de nuit**
- [ ]  Monter au niveau 100 (Trainer House de Dresco + Œuf Chance amélioré)
- [ ]  Purger les EV — baies au marché de **Fallshore City** (inutile s’il est fraîchement capturé)
- [ ]  Nature → **Malin (Impish)** (Tehl Town, 50 000 $)
- [ ]  EV : Dresco, dresseur PV (Poids Pouvoir) + dresseur Défense (Ceinture Pouvoir)
- [ ]  IV : Bottle Caps sur **PV et Défense**. **Ignore l’Att.Spé** ; l’Attaque est secondaire (utile seulement pour Séisme/Façade)
- [ ]  **Récupérer l’Orbe Toxique** : Valley Cave (ouest de Black Belt Hitoshi) ou 16 BP au Battle Tower. **Sans lui, Soin Poison ne sert à rien**
- [ ]  Moveset : **Piège de Roc (CT)**, **Séisme (CT)**, **Atterrissage** et **Sabotage** via Move Relearner de Crater Town ou tuteurs de la Frontier
- [ ]  ⚠️ **Vérifier son talent avant tout achat** : s’il a Sable Volant ou Régime Strict, le set ne fonctionne pas

---

### 6.7 Les deux utilitaires à garder en boîte (capture & Pokédex)

Ces deux-là ne font **pas** partie de l’équipe de combat. Ils vivent dans le PC et sortent uniquement pour les sessions de capture et de farm. Ils te feront gagner des dizaines d’heures sur la complétion du Pokédex.

#### A. Queulorior (Smeargle) — le couteau suisse de la capture

**Pourquoi lui :** sa capacité **Mimique (Sketch)** copie définitivement la dernière attaque utilisée par l’adversaire. Il apprend Mimique à chaque multiple de 11 niveaux, donc il peut se constituer **le moveset de capture parfait**, que presque aucun autre Pokémon ne peut réunir seul :

| Slot | Capacité | Rôle |
| --- | --- | --- |
| 1 | **Faux-Chage (False Swipe)** | Laisse toujours 1 PV — jamais de KO accidentel |
| 2 | **Spore** | Endort à **100 %** de précision. Le statut qui double le taux de capture |
| 3 | **Larcin (Thief)** ou **Implore (Covet)** | Vole l’objet tenu par le sauvage — c’est ta source d’Écailles Cœur, de Morceaux d’Étoile et de Pierres Stase |
| 4 | **Doux Parfum (Sweet Scent)** | Déclenche une rencontre immédiate — plus besoin de tourner en rond dans les hautes herbes |

**Points de vigilance :**
- Ses stats sont catastrophiques (BST 250). Monte-le **niveau 100** et donne-lui **252 EV en PV et en Défense** pour qu’il survive — c’est vite fait à Dresco.
- **Faux-Chage ne touche pas les Spectre.** Pour ceux-là, prévois un Pokémon avec une attaque faible à dégâts fixes, ou capture-les endormis à pleine vie.
- **Larcin échoue si Queulorior tient déjà un objet** — laisse-lui les mains vides.
- Pour lui apprendre une attaque, il doit **subir ou voir** cette attaque : le plus simple est de faire utiliser l’attaque par un allié en Combat Duo, ou de la subir d’un sauvage.
- Je n’ai **pas trouvé sa localisation exacte dans Unbound** — utilise le **DexNav** une fois l’espèce enregistrée, ou consulte la page Locations du wiki.

#### B. Un porteur de Fouille + Larcin — la mule à objets

**Pourquoi :** **Fouille (Frisk)** révèle l’objet tenu par le sauvage **dès l’entrée en combat**. Tu sais donc immédiatement si le combat vaut la peine d’être joué, au lieu de voler à l’aveugle. Combiné à Larcin, ça alimente **trois** de tes farms simultanément :

| Objet volé | Source | Pour quoi faire |
| --- | --- | --- |
| **Écailles Cœur** | Luvdisc (pêche Méga Canne) | Move Relearner de Crater Town |
| **Morceaux d’Étoile** | Minior (DexNav, Route 1) | Améliorer les objets Pouvoir |
| **Pierres Stase** | Racaillou / Rocabot (5–10 %) | Améliorer le Macho Brace jusqu’à ×10 |

**Candidats :** **Branette (Banette)** — Fouille + Larcin + Feu Follet, disponible tôt. **Bébécaille/Noctunoir** ou **Ronflex** peuvent aussi convenir selon leur talent dans Unbound.

> 💡 **Ton Dusknoir sortant est un candidat naturel** : son talent caché est justement **Fouille**. Comme il quitte l’équipe de combat, tu peux lui appliquer une **Dream Mist** sans regret et le recycler en mule à objets. Ça lui donne une seconde vie utile au lieu de le laisser dormir en boîte.
> 

#### C. Le troisième larron : Synchro (Synchronize)

Un **Tarsal / Kirlia / Gardevoir**, un **Abra**, un **Mentali** ou un **Noctali** avec le talent **Synchro** placé **en tête d’équipe** donne aux Pokémon sauvages **50 % de chances d’avoir la même nature que lui**.

Concrètement : un Kirlia **Rigide** en tête, et un Gligar sur deux sera Rigide. **Tu économises 50 000 $ de Nature Changer par capture.**

> ⚠️ À vérifier en jeu : je n’ai pas confirmé que Synchro affecte bien les rencontres sauvages dans Unbound (c’est le cas depuis la Gen 4 dans les jeux officiels, et le CFRU suit les mécaniques Gen 8, donc c’est très probable). Test rapide : mets un Synchro d’une nature rare en tête et capture cinq sauvages d’affilée.
> 

## 7. Audit d’équipe global

### 7.1 Ce qui fonctionne

- **Trois vrais gagnants de combat** : Tyranitar (puissance), Zeraora (vitesse), Togekiss (contrôle)
- **Bonne couverture de types offensive** : Roche, Ténèbres, Sol, Électrik, Combat, Fée, Vol, Plante
- **Togekiss couvre les faiblesses Sol** de Tyranitar et Zeraora (immunité Vol)

### 7.2 Les trous — par ordre de gravité

1. **Aucun retrait de hazards.** Ni Anti-Brume, ni Tour Rapide. Le Piège de Roc inflige **25 % à Togekiss** à chaque entrée. C’est ton problème n°1 sur un run de Battle Tower.
2. **Aucun poseur de hazards.** Tu ne mets aucune pression passive sur l’adversaire. Tyranitar peut porter Piège de Roc.
3. **Le sable se retourne contre toi.** 4 Pokémon sur 5 prennent 6,25 % par tour de ton propre Tyranitar.
4. **Conflit de Méga** entre Tyranitar et Sceptile.
5. **Deux slots faibles** : Dusknoir (PV 45) et Sceptile non-Méga.
6. **Aucune résistance Acier ni Poison** — Togekiss et Sceptile sont tous deux vulnérables à ces types.

### 7.3 ✅ Composition finale validée

| Slot | Pokémon | Rôle | Objet | Statut |
| --- | --- | --- | --- | --- |
| 1 | **Méga-Tyranitar** | Poseur de sable / Wallbreaker physique | Tyranitarite | Conservé |
| 2 | **Excadrill** | Sweeper Baigne Sable + **Tour Rapide** | Bandeau Choix | Conservé |
| 3 | **Togekiss** | Para-flinch / Stallbreaker (spécial) | Bottes Épaisses | Conservé |
| 4 | **Motisma-Lavage** | Pivot spécial / Feu Follet / Change Éclair | Restes ou Ballon | **Nouveau** |
| 5 | **Flagadoss** | Mur physique régénérant, résiste Combat (spécial) | Casque Brut | **Nouveau** |
| 6 | **Scorvol** | Mur physique / **Piège de Roc** / Soin Poison | Orbe Toxique | **Nouveau** |

**Sortis :** Sceptile (jamais optimisé), Dusknoir (§6.4), Zeraora (§6.5).

**Ce qui est enfin réglé :**

|  | Avant | Après |
| --- | --- | --- |
| Combat résisté | 0 | **2** (Flagadoss, Scorvol) |
| Sol | 1 immunité | **3 immunités** (Togekiss, Motisma, Scorvol) |
| Eau résistée | 0 | **2** (Motisma, Flagadoss) |
| Physique / Spécial | 4 / 1 | **3 / 3** |
| Retrait de hazards | aucun | Tour Rapide (Excadrill) |
| Pose de hazards | aucune | Piège de Roc (Scorvol) |
| Soin fiable | 1 | **4** (Togekiss, Flagadoss ×2, Scorvol ×2, Motisma) |

**Ce qui reste comme faiblesse assumée :**

- **Glace** — Scorvol ×4, Togekiss ×2. Flagadoss et Excadrill résistent : ce sont tes switchs obligatoires.
- **Chip du sable** — Togekiss, Motisma et Flagadoss le subissent. Régé-Force sur Flagadoss l’annule en pratique ; c’est le prix de Méga-Tyranitar.
- **Vitesse** — hors Excadrill sous sable, l’équipe est lente. Tu gagnes par usure et par contrôle, pas par vitesse. Assume ce plan de jeu.
- **Objets en double** — trois candidats aux Restes (Togekiss, Motisma, Flagadoss). Répartis-les comme dans le tableau ci-dessus si le format interdit les doublons.

---

## 8. PNJ indispensables du postgame (table corrigée)

| Service | Localisation exacte | Coût | Priorité |
| --- | --- | --- | --- |
| **Advanced Stat Scanner** | **Frozen Heights** — laboratoire, assistant du Prof. Log | Gratuit | ★★★★★ — **à faire en tout premier** |
| **Marché de baies (réduction EV)** | **Fallshore City** — marché en plein air | Argent (10 EV retirés/baie) | ★★★★★ |
| **IV Changer (Hyper Training)** | **Seaport City** — est du Centre Pokémon, escaliers près de l’entrée KBT, puis plein sud, devant l’entrepôt | 1 Bottle Cap (1 stat) / 1 Gold Bottle Cap (6 stats) | ★★★★★ |
| **EV Changer + lecteur IV/EV** | **Battle Frontier** — stand en haut à droite (Black Belt) | Purge 5 BP/stat · Max 50 BP/stat · Lecture gratuite | ★★★★★ |
| **Nature Changer #1** | **Tehl Town** — maison au sud-ouest du Centre Pokémon (après mission #053) | 1er gratuit, puis 50 000 $ | ★★★★★ |
| **Nature Changer #2** | **Battle Frontier** — stand en haut à gauche | 50 BP (⚠️ remet le bonheur à 0) | ★★★☆☆ |
| **Move Relearner** | **Crater Town** — maison au sud du Centre Pokémon | Écailles Cœur | ★★★★★ |
| **Move Deleter** | **Epidimy Town** — maison au nord-ouest du Centre Pokémon | Gratuit | ★★★☆☆ |
| **Egg Move Tutor** | **Battle Frontier** — stand à l’ouest de l’entrée | BP | ★★★★☆ |
| **Egg Move Transfer Tutor** | **Garderie (Day Care Center)** | — | ★★★☆☆ |
| **Hidden Power Changer** | **Battle Frontier** — stand au sud du bâtiment principal | BP | ★★★☆☆ |
| **Ability Changer** | **Battle Frontier** — côté Battle Circus | BP | ★★★★☆ |
| **Améliorateur objets Pouvoir** | Maître de Karaté près d’**Antisis City**, côté Thundercap Mountain | Morceaux d’Étoile | ★★★★☆ |
| **Macho Brace + améliorations (×10 EV)** | Maître de Karaté, **ouest de Fallshore / Route 10**, bord sud de la carte, **Surf requis**. En Expert/Insane : **bord est de Crater Town** (l’objet est déjà dans ton sac au départ) | Pierres Stase (minage KBT Expressway) | ★★★★★ |
| **Breeder’s School (Métamorph IV max)** | **Seaport City** — après ses quêtes | — | ★★★★☆ |
| **Améliorateur Œuf Chance** | **Fallshore City** — Mission HQ (après mission #020) | Grosses Perles | ★★★★☆ |
| **Améliorateur Amulet Coin** | Centre de **Tehl Town** (montrer Regigigas) | Grosses Pépites | ★★★★☆ |
| **Mega Stone Maker** | **Cube Corp.** | 5 Gemmes du type | ★★★★☆ |
| **Pierres Dures → Gemmes** | **Gurun Town** — maison derrière le Centre Pokémon (après mission #010) | 20 Pierres Dures = 1 Gemme | ★★★★☆ |
| **Shady Guy** | Devant la Battle Frontier, entre minuit et 4 h 49 | BP | ★★☆☆☆ |

---

## 9. Objets — où et à quel prix

### 9.1 Objets de combat

| Objet | Effet | Battle Tower (BP) | Alternative |
| --- | --- | --- | --- |
| **Bandeau Choix** | Attaque +50 %, 1 seule capacité | 48 BP | Code cadeau (Zapdos de Galar) |
| **Lunettes Choix** | Att.Spé +50 %, 1 seule capacité | 48 BP | Code cadeau (Floette Éternelle) |
| **Mouchoir Choix** | Vitesse +50 %, 1 seule capacité | 48 BP | Crystal Peak 1F (salle vers Cube Corp.) |
| **Orbe Vie** | Dégâts +30 %, -10 % PV/attaque | 48 BP | **Game Corner Dehara : 7 500 jetons** |
| **Restes** | +1/16 PV par tour | 48 BP | **Game Corner : 5 000 jetons** · 1 % dans les poubelles |
| **Bottes Épaisses** | Immunité aux pièges de terrain | 48 BP | Cootes Bog (nord-est de Ranger Betty) |
| **Ceinture Force** | Survit à 1 PV si PV pleins | 32 BP | Route 18, tas de sable près du pêcheur |
| **Veste de Combat** | Déf.Spé +50 %, bloque les statuts | 48 BP | Antisis Port |
| **Casque Brut (Rocky Helmet)** | Dégâts au contact | 48 BP | PNJ maison près de l’entrée KBT d’Epidimy |
| **Herbe Blanche** | Annule une baisse de stat | 24 BP | Frost Mountain 2F |
| **Roche Lisse** | Sable de 5 → 8 tours | — | Great Desert (nord de Cameron) · minage ADM |
| **Ballon** | Immunité Sol jusqu’au premier coup | 32 BP | Game Corner : 3 000 jetons |
| **Assurance (Weakness Policy)** | +2 Atk/Att.Spé si touché super-efficace | 32 BP | Game Corner : 10 000 jetons |

> 💰 **Arbitrage :** l’Orbe Vie et les Restes sont **bien moins chers au Game Corner** qu’au Battle Tower. Garde tes BP pour les objets **Choix**, qui ne sont pas au Game Corner.
> 

### 9.2 Consommables d’optimisation

| Objet | Rôle | Obtention |
| --- | --- | --- |
| **Bottle Cap** | 1 IV à 31 | Minage ADM (KBT Expressway, Crystal Peak) · raids 5–6★ · missions |
| **Gold Bottle Cap** | 6 IV à 31 | Mission **#006** (les 120 CT) · minage très rare |
| **Ability Capsule** | Alterne talent 1 ↔︎ talent 2 | **Game Corner de Dehara** |
| **Dream Mist** | Débloque le talent caché | Raid Musharna 5/6★ Tarmigan Town (~50 %) · 1 offerte par le scientifique devant le Research Center |
| **Dream Ball** | Capture avec talent caché | 3/jour, Dream Research Lab de Tarmigan Town (postgame) |
| **Vitamines** | +10 EV | Dept. Store de Dehara |
| **Écaille Cœur** | Monnaie du Move Relearner | Pêche aux Luvdisc (Fouille + Larcin) · minage |
| **Objets Pouvoir** | Accélèrent l’EV training | Missions #003, #005, #033, #052, #071 + Vivill Warehouse B5F |

---

## 10. Battle Frontier

### 10.1 Fonctionnement

Zone postgame accessible par la **barrière au nord de Seaport City**, une fois Champion. Parle au guide pour obtenir la **Frontier Card**. Quatre bâtiments : **Battle Tower**, **Battle Circus**, **Battle Sands**, **Battle Mine**, chacun avec ses règles et son Frontier Brain (Palmer, Paula, Pablo, Patroz). Monnaie : les **BP**.

> ⚠️ **Les règles varient selon le bâtiment et le format.** Certains tiers interdisent les espèces en double, d’autres autorisent les objets en double, d’autres bannissent des talents (Moody, Chlorophyle, Matinal…) ou des capacités (Relais, Toile Gluante, Draco-Rage). **Lis les règles du format avant de dépenser des BP en objets.**
> 

### 10.2 Équipe de départ recommandée

```
[Lead : Zeraora]
- 143 de Vitesse : dépasse la quasi-totalité des leads
- Vive-Attaque en ouverture, Change Éclair pour garder le momentum

[Cœur : Togekiss]
- Absorbe les attaques Sol destinées à Zeraora et Tyranitar (immunité Vol)
- Cage-Éclair + Lame d'Air = 70 % de chance que l'adversaire ne joue pas

[Finisseur : Tyranitar]
- Frappe brute contre les murs
- Sable = +50 % Déf.Spé pour lui-même
```

### 10.3 Farm rapide de BP

- Privilégier les Pokémon rapides à forte puissance brute : Zeraora Orbe Vie, Tyranitar Bandeau Choix, Togekiss para-flinch. Objectif = raccourcir les combats.
- Le **Battle Tower en Singles** est le format le plus lisible pour débuter.

---

## 11. Farming endgame

### 11.1 Argent

- **Trainer House de Dresco Town** en boucle, avec **Amulet Coin** (ou Encens Veine) améliorée sur le Pokémon de tête.
- L’Amulet Coin s’obtient par l’échange en jeu de Blizzard City (Onix contre Électrode), puis s’améliore chez le PNJ au centre de Tehl Town contre des Grosses Pépites.

### 11.2 Expérience

- **Trainer House de Dresco Town**, dresseur XP au maximum, avec **Œuf Chance** amélioré (PNJ du Mission HQ de Fallshore City, après la mission #020) contre des Grosses Perles.

### 11.3 EV training

- **Trainer House de Dresco Town** (coin sud-est) — dresseurs spécialisés par stat, identifiables via leur dialogue d’avant-combat. Avant Blizzard City : PV/XP, Attaque, Att.Spé, Vitesse. Après Blizzard City : Défense et Déf.Spé aussi.
- **Macho Brace amélioré (jusqu’à ×10)** + **objet Pouvoir** correspondant + **Pokérus** → une stat se maxe en une poignée de combats. Détail complet en §2.2.
- En *Vanilla*, monte temporairement la difficulté en *Difficile* : les dresseurs utilisent des Pokémon évolués de plus haut niveau, qui donnent plus d’EV.
- **Baies réductrices** en cas d’erreur : marché en plein air de **Fallshore City**.

### 11.4 Bottle Caps

- **Minage avec l’ADM Gear** dans le KBT Expressway et Crystal Peak (méthode la plus régulière).
- **Raids 5–6★** (drop rare).
- Certaines récompenses de missions.

### 11.5 Écailles Cœur

- Pêche aux **Luvdisc** à la Méga Canne, avec un Pokémon en tête ayant **Fouille (Frisk)** pour révéler l’objet, et **Larcin (Thief)** pour le voler.
- Également disponibles au minage.

---

## 12. Quêtes postgame (entrées vérifiées uniquement)

| Mission | Localisation | Récompense | Intérêt |
| --- | --- | --- | --- |
| **#053 Seasonal Research** | Tehl Town, maison au sud-ouest du CP | Débloque le Nature Changer (50 000 $ illimité) | ★★★★★ — **fais-la en premier** |
| **#050 Portal Purge** | Toute la carte | Tyranitarite / Garchompite / Metagrossite (selon starter) + portails légendaires | ★★★★★ |
| **#006 All the Right Moves** | Polder Town (est de la ville, au-dessus de la Zone Safari) | **Gold Bottle Cap** (les 120 CT à trouver) | ★★★★☆ |
| **#010 As Hard as They Come** | Gurun Town | Débloque l’échange 20 Pierres Dures → 1 Gemme | ★★★★☆ (indispensable pour la Sceptilite) |
| **#020 Exp. Millionaire** | Fallshore City, Mission HQ | Débloque l’amélioration de l’Œuf Chance | ★★★☆☆ |
| **#003 / #005 / #033 / #052 / #071** | Diverses | Objets Pouvoir (Brassard, Ceinture, Anneau, Bandeau, Poids) | ★★★★☆ |

> Les entrées « The Ultimate Red Card », « Tomb Raider » et « The Black Emissary » de ton guide d’origine n’ont pas pu être vérifiées. Je les ai retirées plutôt que de te faire perdre du temps à les chercher.
> 

---

## 13. Annexes

### 13.0 Formules et outils

**Formule de stat (hors PV), pour comprendre ce que tu achètes :**

```
Stat = Stat de base × 2 × (Niveau / 100) + 5 + IV + (EV / 4)
       puis × 1,1 ou × 0,9 selon la Nature
```

Ce que ça implique concrètement :

| Levier | Gain au niveau 100 | Gain au niveau 50 (Battle Frontier) |
| --- | --- | --- |
| **31 IV** sur une stat | +31 points | +15 points |
| **252 EV** sur une stat | +63 points | +31 points |
| **Nature favorable** | +10 % du total (souvent +20 à +35) | idem, proportionnel |

> 🔍 **Lecture importante pour la Frontier.** Tout y est ramené au **niveau 50**. Les IV et EV y valent donc **environ moitié moins en points bruts** — mais les stats globales sont elles aussi divisées par deux, donc **le poids relatif est identique**. Ne fais pas l’erreur de croire que l’optimisation compte moins au niveau 50 : c’est exactement l’inverse, puisque tu ne peux plus compenser par le niveau.
> 

**Outils à garder ouverts :**

| Outil | URL | Usage |
| --- | --- | --- |
| **Yda Dex** | `ydarissep.github.io/Unbound-Pokedex/` | Le Pokédex de référence — **inclut les modifications spécifiques à Unbound**. À utiliser en priorité sur Bulbapedia. |
| **RomHackDex** | `romhackdex.net/unbound/` | Learnsets Unbound (CT / tuteurs / niveau) + Team Builder |
| **Unbound Wiki** | `unboundwiki.com` | Localisations, PNJ, missions, objets |
| **Smogon** | `smogon.com/dex/sm/pokemon/<nom>/` | Sets compétitifs de référence, à **adapter** (Unbound n’est pas le méta Smogon) |
| **Bulbapedia** | `bulbapedia.bulbagarden.net` | Rendement d’EV par espèce vaincue |

### 13.1 Table complète des natures

| Nature | +10 % | -10 % |
| --- | --- | --- |
| Rigide (Adamant) | Attaque | Att. Spé. |
| Solo (Lonely) | Attaque | Défense |
| Brave | Attaque | Vitesse |
| Mauvais (Naughty) | Attaque | Déf. Spé. |
| Assuré (Bold) | Défense | Attaque |
| Malin (Impish) | Défense | Att. Spé. |
| Relax (Relaxed) | Défense | Vitesse |
| Lâche (Lax) | Défense | Déf. Spé. |
| Modeste (Modest) | Att. Spé. | Attaque |
| Doux (Mild) | Att. Spé. | Défense |
| Discret (Quiet) | Att. Spé. | Vitesse |
| Foufou (Rash) | Att. Spé. | Déf. Spé. |
| Calme (Calm) | Déf. Spé. | Attaque |
| Gentil (Gentle) | Déf. Spé. | Défense |
| Malpoli (Sassy) | Déf. Spé. | Vitesse |
| Prudent (Careful) | Déf. Spé. | Att. Spé. |
| Timide (Timid) | Vitesse | Attaque |
| Pressé (Hasty) | Vitesse | Défense |
| Jovial (Jolly) | Vitesse | Att. Spé. |
| Naïf (Naive) | Vitesse | Déf. Spé. |

### 13.2 Checklist « Endgame Ready »

Un Pokémon est prêt quand **les 7 cases** sont cochées :

- [ ]  Niveau 100
- [ ]  IV vérifiés : 31 sur toutes les stats **utiles** (l’Attaque d’un attaquant spécial doit rester **basse**)
- [ ]  EV exacts : **252 / 252 / 4**, aucun point perdu
- [ ]  Nature favorable (+10 % sur la stat clé, -10 % sur une stat inutilisée)
- [ ]  Talent optimal confirmé
- [ ]  Moveset : STAB + couverture + utilitaire/setup
- [ ]  Objet de combat équipé et **non dupliqué** dans l’équipe

### 13.3 Glossaire

- **STAB** — bonus ×1,5 quand le type de l’attaque correspond à celui du lanceur
- **EV** — points d’entraînement (510 max au total, 252 max par stat, 4 EV = 1 point au niveau 100)
- **IV** — valeurs génétiques de 0 à 31 par stat
- **BST** — somme des statistiques de base d’une espèce
- **OHKO** — mise KO en un seul coup
- **Setup** — se booster avant d’attaquer (Danse Draco, Machination, Gonflette)
- **Pivot** — encaisse un coup puis repart avec Demi-Tour / Change Éclair
- **Sweeper** — rapide et puissant, élimine plusieurs adversaires d’affilée
- **Cleaner** — sweeper qui achève en fin de partie
- **Hazard** — piège de terrain (Piège de Roc, Picots, Pics Toxik)
- **Defog / Rapid Spin** — Anti-Brume / Tour Rapide, nettoient les hazards
- **Spinblocker** — Pokémon Spectre qui bloque Tour Rapide (mais pas Anti-Brume)
- **Para-flinch** — combo paralysie + attaque à fort taux d’apeurement
- **Chip damage** — dégâts passifs récurrents (sable, Orbe Vie, hazards)