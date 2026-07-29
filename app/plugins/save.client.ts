/**
 * Hydrate la sauvegarde une seule fois au démarrage, puis écrit à chaque
 * changement avec un délai — cocher cinq cases d'affilée ne doit pas produire
 * cinq écritures.
 */
export default defineNuxtPlugin(() => {
  const { state, hydrate, persist } = useSave()

  hydrate()

  let timer: ReturnType<typeof setTimeout> | undefined

  watch(state, () => {
    clearTimeout(timer)
    timer = setTimeout(persist, 400)
  }, { deep: true })

  // Un onglet fermé pendant le délai ne doit pas perdre la dernière action.
  if (import.meta.client) {
    window.addEventListener('beforeunload', () => {
      clearTimeout(timer)
      persist()
    })
  }
})
