/**
 * Vérification PWA sur le build de production.
 *
 * Trois régressions possibles que rien d'autre ne détecte :
 *  - une requête vers un domaine externe (les icônes partaient chez
 *    api.iconify.design avant d'être embarquées dans le bundle client) ;
 *  - une route profonde non servie hors-ligne (il faut `navigateFallback`
 *    puisque l'app est un SPA) ;
 *  - des icônes absentes hors-ligne (le mode CSS injecte son `mask-image`
 *    dynamiquement, d'où le mode `svg`).
 *
 * Usage : pnpm generate && PORT=3100 pnpm preview, puis pnpm smoke:offline
 */
import { chromium } from 'playwright'

const baseUrl = process.argv[2] ?? 'http://localhost:3100'

const routes = ['/', '/roadmap', '/equipe', '/equipe/tyranitar', '/ressources', '/reference', '/journal']

const problems = []
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
const page = await context.newPage()

/* --- 1. En ligne : aucune dépendance réseau externe -------------------- */

const external = []
page.on('request', (request) => {
  const url = request.url()
  if (url.startsWith(baseUrl) || url.startsWith('data:') || url.startsWith('blob:')) return
  external.push(url)
})
page.on('pageerror', error => problems.push(`exception : ${error.message.split('\n')[0]}`))

await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })

// `serviceWorker.ready` ne se résout jamais si l'enregistrement échoue : sans
// borne, le script se bloque au lieu de rapporter le problème.
const swReady = await page.evaluate(async () => {
  const timeout = new Promise(resolve => setTimeout(() => resolve(false), 20000))
  return Promise.race([navigator.serviceWorker.ready.then(() => true), timeout])
})
if (!swReady) problems.push('le service worker ne s’est pas activé en 20 s')
await page.waitForTimeout(4000) // laisser le service worker précacher

if (external.length) {
  problems.push(`requêtes externes : ${[...new Set(external.map(u => new URL(u).host))].join(', ')}`)
}

const manifest = await page.evaluate(async (base) => {
  const response = await fetch(`${base}/manifest.webmanifest`)
  return response.ok ? await response.json() : null
}, baseUrl)
if (!manifest) problems.push('manifest.webmanifest introuvable')
else if (!manifest.icons?.some(icon => icon.purpose === 'maskable')) {
  problems.push('le manifest n’a pas d’icône maskable')
}

/* --- 2. Hors-ligne : toutes les routes restent utilisables ------------- */

await context.setOffline(true)

for (const route of routes) {
  try {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'commit', timeout: 20000 })
    // La bottom-nav est le premier élément monté : elle atteste que le SPA tourne.
    await page.waitForSelector('nav a >> visible=true', { timeout: 20000 })

    const text = (await page.locator('body').innerText()).trim()
    if (text.length < 100) problems.push(`${route} — rendu quasi vide (${text.length} caractères)`)

    const icons = await page.locator('nav >> visible=true').locator('svg').count()
    if (icons < 5) problems.push(`${route} — ${icons} icônes dans la nav au lieu de 5`)

    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (overflow > 2) problems.push(`${route} — débordement horizontal de ${overflow}px`)
  }
  catch (error) {
    problems.push(`${route} — inaccessible hors-ligne : ${error.message.split('\n')[0]}`)
  }
}

await browser.close()

/* --- Rapport ---------------------------------------------------------- */

if (problems.length) {
  console.error(`\n${problems.length} problème(s) :`)
  for (const problem of problems) console.error(`  ✖ ${problem}`)
  process.exit(1)
}

console.log(`PWA : aucune dépendance externe · ${routes.length} routes servies hors-ligne avec leurs icônes.`)
