import type { SaveState } from '~/data/types'

/**
 * Décision de synchronisation, isolée du réseau.
 *
 * Tout ce qui peut faire perdre une progression se joue ici : `useSync` ne fait
 * qu'exécuter le verdict rendu par `decideSync`. C'est donc la seule partie
 * qu'on teste hors navigateur (`pnpm test:sync`), sur le modèle de `roster.ts`.
 *
 * La règle retenue est « le plus récent gagne » — pas de fusion. Elle suppose
 * que les deux côtés ne divergent quasiment jamais, ce qui est le cas d'un seul
 * joueur sur deux appareils. Quand ils divergent quand même, le perdant n'est
 * pas jeté : `useSync` en fait une copie de secours avant de l'écraser.
 */

/** État de la dernière synchronisation réussie, mémorisé par appareil. */
export interface SyncMarker {
  /** `updatedAt` du distant tel qu'il était à la dernière synchro. */
  remoteUpdatedAt: string | null
  /** `updatedAt` du local tel qu'il était à la dernière synchro. */
  localUpdatedAt: string | null
}

export interface SyncDecision {
  action: 'none' | 'push' | 'pull'
  /** Les deux côtés ont changé depuis la dernière synchro : quelqu'un perd. */
  diverged: boolean
  /** Phrase affichable, qui dit *pourquoi* — un écrasement doit s'expliquer. */
  reason: string
}

export const emptyMarker = (): SyncMarker => ({ remoteUpdatedAt: null, localUpdatedAt: null })

/**
 * Une sauvegarde où l'utilisateur n'a jamais rien saisi.
 *
 * `createEmptySave()` pose un `updatedAt` à l'instant du démarrage : sur un
 * appareil neuf, le local est donc TOUJOURS plus récent que le distant. Sans ce
 * contrôle, « le plus récent gagne » ferait écraser des mois de progression par
 * une sauvegarde vide, à la première ouverture sur le second appareil. C'est le
 * garde-fou le plus important du fichier.
 */
export function isPristineSave(save: SaveState): boolean {
  return Object.keys(save.tasks).length === 0
    && Object.keys(save.pokemon).length === 0
    && Object.keys(save.counters).length === 0
    && Object.keys(save.resources).length === 0
    && Object.keys(save.roster).length === 0
    && save.journal.length === 0
}

export function decideSync(
  local: SaveState,
  /** `null` quand le gist n'existe pas encore, ou qu'il est vide. */
  remote: SaveState | null,
  marker: SyncMarker,
): SyncDecision {
  if (!remote) {
    return isPristineSave(local)
      ? { action: 'none', diverged: false, reason: 'Rien à synchroniser pour l’instant.' }
      : { action: 'push', diverged: false, reason: 'Aucune sauvegarde distante : envoi de celle-ci.' }
  }

  // Appareil neuf, ou app réinstallée : on adopte le distant sans discuter.
  if (isPristineSave(local)) {
    return { action: 'pull', diverged: false, reason: 'Cet appareil n’a aucune progression : récupération de la sauvegarde distante.' }
  }

  /*
   * Sans marqueur, on ne peut pas savoir qui a bougé : c'est la première
   * synchro de cet appareil sur un gist qui existe déjà. Les deux côtés sont
   * donc traités comme modifiés.
   */
  const localChanged = marker.localUpdatedAt === null || local.updatedAt !== marker.localUpdatedAt
  const remoteChanged = marker.remoteUpdatedAt === null || remote.updatedAt !== marker.remoteUpdatedAt

  if (!localChanged && !remoteChanged) {
    return { action: 'none', diverged: false, reason: 'Déjà à jour.' }
  }
  if (localChanged && !remoteChanged) {
    return { action: 'push', diverged: false, reason: 'Modifications locales à envoyer.' }
  }
  if (!localChanged && remoteChanged) {
    return { action: 'pull', diverged: false, reason: 'Sauvegarde distante plus avancée : récupération.' }
  }

  /*
   * Divergence : les deux côtés ont bougé depuis la dernière synchro. Les
   * `updatedAt` sont tous produits par `toISOString()`, donc en UTC et de
   * longueur fixe — la comparaison lexicographique vaut comparaison
   * chronologique. Reste que les horloges des deux appareils peuvent mentir :
   * d'où la copie de secours du perdant, côté `useSync`.
   */
  if (remote.updatedAt > local.updatedAt) {
    return { action: 'pull', diverged: true, reason: 'Les deux appareils ont changé ; le distant est plus récent.' }
  }
  if (local.updatedAt > remote.updatedAt) {
    return { action: 'push', diverged: true, reason: 'Les deux appareils ont changé ; celui-ci est plus récent.' }
  }
  // Même horodatage des deux côtés : rien à départager, rien à gagner.
  return { action: 'none', diverged: true, reason: 'Les deux versions portent le même horodatage.' }
}

/** Marqueur à mémoriser après une synchronisation réussie. */
export function markerAfter(local: SaveState, remote: SaveState): SyncMarker {
  return { localUpdatedAt: local.updatedAt, remoteUpdatedAt: remote.updatedAt }
}
