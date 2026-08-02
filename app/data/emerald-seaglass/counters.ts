import type { CounterDef } from '../types'

/**
 * Ce que ce jeu rend rare, et qu'il vaut donc la peine de compter.
 *
 * Aucune Bottle Cap et aucun BP ici : les IV se règlent par le DexNav et la
 * chance, pas par un consommable, et la Battle Frontier n'est pas la monnaie du
 * jeu. Ce qui compte, ce sont les deux devises des minigames — elles sont la
 * seule voie vers plusieurs Pokémon et objets.
 *
 * ⚠️ Les quatre icônes utilisées ici sont déjà déclarées dans
 * `icon.clientBundle.icons` (`nuxt.config.ts`). En ajouter une nouvelle sans
 * l'y inscrire rendrait un `<svg>` vide sans aucune erreur — `pnpm validate`
 * le refuse.
 *
 * Source : documentation officielle de l'auteur, voir `docs/emerald-seaglass/`.
 */
export const counters: CounterDef[] = [
  {
    id: 'wishing-stars',
    label: 'Wishing Stars',
    icon: 'i-lucide-circle-dot',
    hint: 'Jetés dans le Wishing Well de Rustboro, ils tirent un Pokémon au hasard. Il en faut aussi un en sac pour Jirachi, au White Rock de Mossdeep. Vendus par un PNJ du Mt. Chimney une fois la Team Aqua/Magma chassée.',
  },
  {
    id: 'pinball-points',
    label: 'Pinball Points',
    icon: 'i-lucide-ticket',
    hint: 'Un point par partie de pinball gagnée. À Mauville : Poké Balls rares et œufs de formes Alola. À Mossdeep : objets rares, et des points s’y achètent contre de l’argent.',
  },
  {
    id: 'heart-scales',
    label: 'Heart Scales',
    icon: 'i-lucide-heart',
    hint: 'Cinq à chaque nouveau record au Scuba Safari de Pacifidlog, en plus d’une TM tirée d’un lot de bonnes capacités.',
  },
  {
    id: 'money',
    label: 'Argent',
    icon: 'i-lucide-banknote',
    hint: 'Économie vanilla, mais avec plus à acheter : Nature Mints, Ability Capsules, EXP Candies, Stat Feathers, objets Choice, pierres d’évolution — et des Pinball Points à Mossdeep.',
  },
] satisfies CounterDef[]
