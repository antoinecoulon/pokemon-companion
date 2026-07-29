/**
 * Enregistrement du service worker.
 *
 * Le plugin fourni par @vite-pwa/nuxt n'enregistre rien quand l'app est servie
 * depuis un sous-chemin (GitHub Pages en dépôt de projet) : ni hors-ligne, ni
 * installation possible. On enregistre donc nous-mêmes, en dérivant l'URL et le
 * scope de la baseURL.
 *
 * Le service worker est généré avec `registerType: 'autoUpdate'` : il prend le
 * contrôle et se met à jour seul, sans invite à confirmer.
 */
export default defineNuxtPlugin(() => {
  // En dev le service worker est désactivé : il masquerait les erreurs de rendu.
  if (import.meta.dev) return
  if (!('serviceWorker' in navigator)) return

  const { app } = useRuntimeConfig()
  const scope = app.baseURL.endsWith('/') ? app.baseURL : `${app.baseURL}/`

  navigator.serviceWorker
    .register(`${scope}sw.js`, { scope })
    .catch((error) => {
      console.error('[pwa] enregistrement du service worker impossible', error)
    })
})
