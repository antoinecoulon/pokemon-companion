# Pokémon Elite Redux — doc de référence

Doc de suivi personnel pour une partie de **Pokémon Elite Redux**, hack ROM de Pokémon Emerald.

> **Hors périmètre de l'app.** Ce dossier est de la documentation lue hors ligne. Il n'alimente
> pas le companion Unbound (`app/`, `scripts/`), qui reste consacré à Unbound. Rien ici n'est
> importé, généré ou validé par `pnpm check`.

## Hypothèses de cette doc

Elle est écrite pour **un run en mode Elite avec les level caps Elite** — les deux réglages les
plus stricts, choisis à l'écran d'intro. En dehors de ces réglages, les tables de level caps et
les équipes des Gym Leaders ne s'appliquent pas.

## Dans quel ordre lire

1. **[01-la-rom.md](01-la-rom.md)** — ce qu'est Elite Redux et en quoi il diffère d'un Pokémon
   classique. À lire **avant** de lancer la partie : plusieurs mécaniques (talents multiples,
   level caps, Adoption Centers) changent la façon de jouer dès la première heure.
2. **[02-bien-debuter.md](02-bien-debuter.md)** — la checklist des premières heures, de l'écran
   d'intro jusqu'au **Knuckle Badge** (2e badge). C'est le cœur du dossier.
3. **[03-sources.md](03-sources.md)** — d'où vient chaque donnée, et ce qui reste incertain.

## ⚠️ Décalage de version possible

Les tables chiffrées de cette doc (level caps, encounters sauvages, équipes des Gym Leaders) sont
extraites du **code source ouvert** du projet, consulté le **2026-08-01**. Rien ne garantit que ce
snapshot corresponde exactement au patch installé : le dépôt de configuration n'a pas de branche
stable, et deux dépôts officiels donnent des équipes de Gym Leaders **différentes** (voir
[03-sources.md](03-sources.md)).

En pratique :

- Les **level caps** sont fiables — ils sont en dur dans le code et concordent avec la doc publique.
- Les **encounters** sont fiables à la version près.
- Les **équipes des Gym Leaders** sont données à titre indicatif et marquées comme telles.

Tout ce qui n'a pas pu être vérifié porte la mention **⚠️ à vérifier en jeu** plutôt qu'une
supposition. On ne comble pas un trou par une devinette.

## Convention d'écriture

Prose en français, **noms propres du jeu en VO** : `Stone Badge`, `Nurse Joy`, `Adoption Center`,
`Focus Sash`, `Stealth Rock`, et les libellés de statistiques (`HP`, `Atk`, `Def`, `SpA`, `SpD`,
`Spe`). On traduit la phrase autour, jamais le nom que l'écran affiche.
