/*
 * Chemin de base du déploiement.
 *
 * En local et sur un domaine dédié c'est `/`. Sur GitHub Pages en dépôt de
 * projet, l'app est servie depuis `/<nom-du-depot>/` : le manifest, le scope du
 * service worker et les URLs d'icônes doivent suivre, sinon la PWA ne s'installe
 * pas et les assets partent chercher la racine du domaine.
 *
 * Le workflow de déploiement renseigne NUXT_APP_BASE_URL automatiquement.
 */
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const withBase = (path: string) => `${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vite-pwa/nuxt'],

  // App mono-utilisateur dont tout l'état vit dans le localStorage : le rendu
  // serveur n'apporte rien et le SPA supprime tout risque de mismatch d'hydratation.
  ssr: false,

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },

  typescript: {
    strict: true,
  },

  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Pokémon Companion',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Suivi du post-game de Pokémon Unbound' },
        { name: 'theme-color', content: '#0f172a' },
      ],
      link: [
        { rel: 'icon', href: withBase('favicon.svg'), type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: withBase('apple-touch-icon.png'), sizes: '180x180' },
        // Déclaré explicitement : le module PWA ne l'injecte pas, et sans ce lien
        // le navigateur ne propose jamais d'installer l'app.
        { rel: 'manifest', href: withBase('manifest.webmanifest') },
      ],
    },
  },

  ui: {
    theme: {
      // Le thème complet est défini dans app.config.ts
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
    },
  },

  icon: {
    /*
     * En SPA il n'y a pas de serveur pour servir les icônes : sans bundle
     * client, @nuxt/icon les récupère depuis api.iconify.design à chaque
     * chargement — donc pas d'icônes hors-ligne, et une requête externe à
     * chaque visite. `scan` détecte les icônes utilisées dans le code et les
     * embarque dans le bundle.
     */
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
    provider: 'none',
    /*
     * Rendu en SVG inline plutôt qu'en masque CSS : le mode CSS injecte la règle
     * `mask-image` dynamiquement, ce qui laisse les icônes invisibles sur un
     * build statique hors-ligne. En SVG, l'icône est dans le DOM, point.
     */
    mode: 'svg',
  },

  pwa: {
    registerType: 'autoUpdate',
    /*
     * Le plugin d'enregistrement du module ne s'exécute pas quand l'app est
     * servie depuis un sous-chemin (cas GitHub Pages en dépôt de projet) :
     * l'enregistrement est donc fait explicitement dans app/plugins/pwa.client.ts.
     */
    injectRegister: false,
    manifest: {
      name: 'Pokémon Companion',
      short_name: 'Companion',
      description: 'Suivi du post-game de Pokémon Unbound',
      lang: 'fr',
      start_url: baseURL,
      scope: baseURL,
      display: 'standalone',
      orientation: 'portrait-primary',
      background_color: '#0f172a',
      theme_color: '#0f172a',
      icons: [
        { src: withBase('pwa-192.png'), sizes: '192x192', type: 'image/png' },
        { src: withBase('pwa-512.png'), sizes: '512x512', type: 'image/png' },
        { src: withBase('pwa-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      // En SPA, toute route doit retomber sur le shell : sans ça, ouvrir
      // /equipe/tyranitar hors-ligne donne un 404 du service worker.
      navigateFallback: baseURL,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      /*
       * 200.html et 404.html sont les shells de repli du SPA, pas des routes.
       * Le module les inscrit au précache sous les URLs sans extension `200` et
       * `404`, que la plupart des hébergeurs statiques (dont GitHub Pages)
       * renvoient en 404 : l'installation du service worker échoue alors en
       * entier, et l'app perd tout son mode hors-ligne. Un serveur Nitro les
       * résout, ce qui masque le problème en local.
       */
      globIgnores: ['**/200.html', '**/404.html'],
      // Le bundle Nuxt UI + les icônes dépassent le plafond par défaut de 2 Mio.
      maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
    },
    devOptions: {
      // Le SW en dev masque les erreurs de rendu derrière du cache.
      enabled: false,
    },
  },
})
