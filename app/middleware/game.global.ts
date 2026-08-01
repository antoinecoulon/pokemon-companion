import { isGameId } from '~/data/games'

/**
 * Fait correspondre la route et le jeu actif.
 *
 * Les routes sont préfixées par le jeu (`/unbound/completion`) : une URL veut
 * donc toujours dire la même chose, quel que soit l'état de l'app. C'est ce qui
 * rend un favori PWA fiable et les smoke tests déterministes. La route est la
 * source de vérité ; `pokemon-companion:game` ne sert qu'à savoir où envoyer
 * quelqu'un qui ouvre `/`.
 *
 * Les anciennes URLs, d'avant le multi-jeux, redirigent vers Unbound. Des liens
 * de tâches, des favoris et le précache du service worker pointent encore
 * dessus. Traité ici plutôt que par des pages-souches : `/completion` et
 * `/[game]` se disputeraient sinon la même route, et l'arbitrage tiendrait à
 * l'ordre de priorité de vue-router plutôt qu'à une règle écrite.
 */

const LEGACY_ROUTES = new Set([
  'completion',
  'equipe',
  'journal',
  'reference',
  'ressources',
  'roadmap',
])

export default defineNuxtRouteMiddleware((to) => {
  const [first] = to.path.split('/').filter(Boolean)

  // `/` : la page d'accueil redirige elle-même vers le dernier jeu ouvert.
  if (!first) return

  if (isGameId(first)) {
    // La navigation dicte le jeu actif, et non l'inverse.
    if (import.meta.client) useGame().switchTo(first)
    return
  }

  if (LEGACY_ROUTES.has(first)) {
    return navigateTo(`/unbound${to.fullPath}`, { redirectCode: 301, replace: true })
  }
})
