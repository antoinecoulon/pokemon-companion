import type { Game, GameId } from '~/data/games'
import { DEFAULT_GAME_ID, gameById, games, isGameId } from '~/data/games'

/**
 * Jeu actif, et bascule d'un jeu à l'autre.
 *
 * Le choix vit sous sa propre clé, volontairement **hors de tout `SaveState`** :
 * c'est une préférence d'appareil, comme le token de synchronisation. Il n'a
 * rien à faire dans un export JSON qu'on s'envoie par mail, ni dans le gist, ni
 * dans la purge — et surtout, le mettre dans une sauvegarde le rendrait
 * dépendant du jeu dont il désigne justement le remplaçant.
 *
 * La route reste la source de vérité pendant la navigation (`/unbound/...`) :
 * cette clé ne sert qu'à savoir où envoyer quelqu'un qui ouvre `/`.
 */

const GAME_KEY = 'pokemon-companion:game'

export function useGame() {
  const activeId = useState<GameId>('game-id', () => DEFAULT_GAME_ID)

  /** Chargée par le plugin, une fois, au démarrage. */
  function hydrate() {
    try {
      const stored = localStorage.getItem(GAME_KEY)
      if (isGameId(stored)) activeId.value = stored
    }
    catch {
      /* localStorage indisponible : on reste sur le jeu par défaut. */
    }
  }

  function switchTo(id: GameId) {
    if (!isGameId(id)) return
    activeId.value = id
    try {
      localStorage.setItem(GAME_KEY, id)
    }
    catch (error) {
      console.error('[game] choix de jeu non enregistré', error)
    }
  }

  const current = computed<Game>(() => gameById(activeId.value))

  return { games, activeId, current, hydrate, switchTo }
}
