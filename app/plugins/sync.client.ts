/**
 * Synchronise la sauvegarde avec le gist au démarrage, puis à chaque occasion.
 *
 * Trois déclencheurs, pour trois usages réels : l'ouverture de l'app (« charge
 * les dernières données »), le retour en ligne, et le retour sur l'onglet ou
 * l'app — c'est le cas courant sur téléphone, où l'app n'est jamais fermée mais
 * seulement mise en arrière-plan.
 *
 * Rien n'est bloquant : `sync()` ne lève pas, et un échec laisse simplement un
 * état affiché dans le menu. On doit pouvoir cocher des cases dans le train.
 */
export default defineNuxtPlugin({
  name: 'sync',
  dependsOn: ['save'],
  setup() {
    const { state } = useSave()
    const { activeId } = useGame()
    const { configured, load, sync } = useSync()

    load()
    if (configured.value) sync()

    /*
     * `sync()` ne traite que le jeu ouvert : sans ce déclencheur, la sauvegarde
     * du second jeu ne partirait jamais tant qu'on n'y toucherait pas.
     */
    watch(activeId, () => {
      if (configured.value) sync()
    })

    /*
     * Délai plus long que celui de `save.client.ts` (400 ms) : l'écriture
     * locale doit rester immédiate, l'envoi réseau peut attendre qu'une série
     * de cases cochées se termine.
     */
    let timer: ReturnType<typeof setTimeout> | undefined

    watch(state, () => {
      if (!configured.value) return
      clearTimeout(timer)
      timer = setTimeout(sync, 3000)
    }, { deep: true })

    window.addEventListener('online', () => {
      if (configured.value) sync()
    })

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && configured.value) sync()
    })
  },
})
