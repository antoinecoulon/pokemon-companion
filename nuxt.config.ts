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

// `nuxt dev` pose NODE_ENV=development ; `build` et `generate` posent production.
const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
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
        { name: 'description', content: 'Suivi de parties de hack ROMs Pokémon — Unbound, Elite Redux, Emerald Seaglass' },
        { name: 'theme-color', content: '#0f172a' },
      ],
      link: [
        { rel: 'icon', href: withBase('favicon.svg'), type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: withBase('apple-touch-icon.png'), sizes: '180x180' },
        /*
         * Déclaré explicitement : le module PWA ne l'injecte pas, et sans ce lien
         * le navigateur ne propose jamais d'installer l'app.
         *
         * Absent en dev à dessein : le module y est désactivé, donc le manifest
         * n'est pas généré et la requête retombe sur le shell HTML du SPA — que
         * le navigateur signale en erreur de syntaxe JSON dans la console.
         */
        // `as const` sur `rel` : dans un tableau conditionnel, TypeScript élargit
        // sinon le type à `string`, que `link` n'accepte pas.
        ...(isDev ? [] : [{ rel: 'manifest' as const, href: withBase('manifest.webmanifest') }]),
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
      /*
       * `scan` ne lit que les templates : il voit `icon="i-lucide-star"` écrit en
       * dur dans un .vue, mais pas `:name="item.icon"` alimenté depuis un tableau
       * TypeScript. Ces icônes-là — nav et compteurs de chaque jeu, déclarés
       * dans app/data/<jeu>/, plus celles passées en prop au sélecteur de jeu —
       * doivent donc être listées à la main : sinon elles
       * sont absentes du bundle et, avec `provider: 'none'`, ne s'affichent
       * nulle part. `scripts/validate-content.mjs` échoue si la liste dérive.
       */
      icons: [
        // nav des jeux — app/data/<jeu>/index.ts
        'lucide:house',
        'lucide:list-checks',
        'lucide:users',
        'lucide:package',
        'lucide:book-open',
        'lucide:notebook-pen',
        'lucide:trophy',
        // app/components/GameSwitcher.vue — passées en prop, donc non scannées
        'lucide:gamepad-2',
        'lucide:chevrons-up-down',
        'lucide:check',
        // compteurs — app/data/<jeu>/counters.ts
        'lucide:banknote',
        'lucide:ticket',
        'lucide:heart',
        'lucide:circle-dot',
      ],
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
      description: 'Suivi de parties de hack ROMs Pokémon — Unbound, Elite Redux, Emerald Seaglass',
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
