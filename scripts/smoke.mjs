/**
 * Vérification navigateur de bout en bout.
 *
 * L'app est un SPA : le build ne prérend rien, donc ni `typecheck` ni
 * `generate` ne peuvent détecter une erreur de rendu. Ce script ouvre les pages
 * dans un Chromium headless, échoue sur toute erreur console, et vérifie que la
 * persistance survit à un rechargement.
 *
 * Usage : pnpm smoke [baseUrl]
 */
import { chromium } from 'playwright'

const baseUrl = process.argv[2] ?? 'http://localhost:3000'

// `links` : préfixe de href dont la page doit contenir au moins un lien.
const routes = [
  { path: '/', expect: 'Complétion', links: '/equipe/' },
  // `/roadmap` ne rend plus rien : elle redirige vers `/completion`.
  { path: '/roadmap', expect: 'Complétion' },
  { path: '/equipe', expect: null, links: '/equipe/' },
  { path: '/equipe/tyranitar', expect: 'Tyranitar' },
  { path: '/equipe/excadrill', expect: 'Excadrill' },
  { path: '/ressources', expect: null },
  { path: '/completion', expect: 'Complétion' },
  { path: '/reference', expect: null },
  { path: '/journal', expect: null },
]

const failures = []
const browser = await chromium.launch()

/** Une page neuve qui remonte toute erreur console ou exception. */
async function openPage(context, label) {
  const page = await context.newPage()
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const text = message.text()
    // Le SW n'est pas servi en dev, et les 404 de favicon ne concernent pas l'app.
    if (/service.?worker|favicon|manifest/i.test(text)) return
    failures.push(`${label} — console.error : ${text}`)
  })
  page.on('pageerror', error => failures.push(`${label} — exception : ${error.message}`))
  return page
}

async function checkRoutes(context, viewport) {
  for (const route of routes) {
    const label = `${viewport} ${route.path}`
    const page = await openPage(context, label)
    const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle' })

    if (!response?.ok()) failures.push(`${label} — HTTP ${response?.status()}`)

    const body = await page.locator('body').innerText()
    if (body.trim().length < 40) failures.push(`${label} — page quasi vide (${body.trim().length} caractères)`)
    if (route.expect && !body.includes(route.expect)) {
      failures.push(`${label} — texte attendu absent : « ${route.expect} »`)
    }

    // Aucune page ne doit déborder horizontalement.
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (overflow > 2) failures.push(`${label} — débordement horizontal de ${overflow}px`)

    /*
     * Un composant dynamique référencé par son nom (`:is="'NuxtLink'"`) ne
     * résout pas : Vue rend un élément littéral `<nuxtlink>`, sans `<a>` ni
     * navigation, et sans aucune erreur. C'est arrivé sur AppCard et rien ne
     * l'avait détecté. Toute balise inconnue en minuscules est donc un échec.
     */
    const unresolved = await page.evaluate(() =>
      [...new Set(
        [...document.querySelectorAll('*')]
          .map(element => element.tagName.toLowerCase())
          .filter(tag => /^(nuxt|u)[a-z]+$/.test(tag) && tag !== 'ul'),
      )])
    if (unresolved.length) {
      failures.push(`${label} — composants non résolus dans le DOM : <${unresolved.join('>, <')}>`)
    }

    if (route.links) {
      const count = await page.locator(`a[href^="${route.links}"]`).count()
      if (count === 0) failures.push(`${label} — aucun lien vers « ${route.links} » : cartes non cliquables ?`)
    }

    await page.close()
  }
}

/* --- 1. Toutes les routes, desktop puis mobile ------------------------- */

const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } })
await checkRoutes(desktop, 'desktop')
await desktop.close()

const mobile = await browser.newContext({ viewport: { width: 375, height: 812 } })
await checkRoutes(mobile, 'mobile 375px')
await mobile.close()

/* --- 2. Persistance : cocher une tâche, recharger --------------------- */

const persistence = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await openPage(persistence, 'persistance')

/*
 * La Battle Frontier est rendue en clair en tête de /completion, hors de
 * l'accordéon : ses tâches sont donc toujours dans le DOM, quel que soit le
 * groupe que l'accordéon décide d'ouvrir. Viser une case NOMMÉE plutôt qu'un
 * compte global garde le test stable quand on coche quelque chose.
 */
const ANCHOR = '/completion'
await page.goto(`${baseUrl}${ANCHOR}`, { waitUntil: 'networkidle' })

const target = page.locator('button[role="checkbox"][data-state="unchecked"]').first()
if (await target.count() === 0) {
  failures.push('persistance — aucune case décochée trouvée sur /completion')
}
else {
  const label = await target.getAttribute('aria-label')
  await target.click()
  await page.waitForTimeout(700) // au-delà du debounce de 400 ms

  const stored = await page.evaluate(() => localStorage.getItem('pokemon-companion:save'))
  if (!stored) failures.push('persistance — rien n’a été écrit dans le localStorage')

  const byLabel = () => page.locator(`button[role="checkbox"][aria-label="${label}"]`)
  if (await byLabel().getAttribute('data-state') !== 'checked') {
    failures.push('persistance — la case ne passe pas à « checked » après le clic')
  }

  await page.reload({ waitUntil: 'networkidle' })
  if (await byLabel().getAttribute('data-state') !== 'checked') {
    failures.push('persistance — la case est retombée à « unchecked » après rechargement')
  }

  /* --- 3. Export / import : aller-retour ------------------------------- */

  /*
   * On ne peut pas tester l'import en effaçant le localStorage de l'onglet
   * courant : le handler `beforeunload` de l'app réécrit l'état en mémoire au
   * déchargement, ce qui annule l'effacement. On repart donc de contextes
   * navigateur vierges — ce qui est aussi le vrai cas d'usage : exporter sur le
   * PC, importer sur le téléphone.
   */
  const exported = await page.evaluate(() => localStorage.getItem('pokemon-companion:save'))
  await persistence.close()

  const fresh = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const freshPage = await openPage(fresh, 'aller-retour (vierge)')
  await freshPage.goto(`${baseUrl}${ANCHOR}`, { waitUntil: 'networkidle' })
  if (await freshPage.locator(`button[role="checkbox"][aria-label="${label}"]`).getAttribute('data-state') !== 'unchecked') {
    failures.push('aller-retour — sur un navigateur vierge, la case devrait suivre le défaut du guide')
  }
  await fresh.close()

  const imported = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  await imported.addInitScript(
    ([key, saved]) => localStorage.setItem(key, saved),
    ['pokemon-companion:save', exported],
  )
  const importedPage = await openPage(imported, 'aller-retour (importé)')
  await importedPage.goto(`${baseUrl}${ANCHOR}`, { waitUntil: 'networkidle' })
  if (await importedPage.locator(`button[role="checkbox"][aria-label="${label}"]`).getAttribute('data-state') !== 'checked') {
    failures.push('aller-retour — la sauvegarde importée ne rétablit pas la case')
  }
  await imported.close()
}
await browser.close()

/* --- Rapport ---------------------------------------------------------- */

if (failures.length) {
  console.error(`\n${failures.length} problème(s) :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log(`${routes.length} routes × 2 viewports · persistance · aller-retour export/import — tout passe.`)
