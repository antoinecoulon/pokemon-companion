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

/*
 * `links` : préfixe de href dont la page doit contenir au moins un lien.
 *
 * Les chemins sans préfixe de jeu sont les **anciennes URLs**, d'avant le
 * multi-jeux : elles doivent continuer de mener quelque part (redirection vers
 * Unbound). Des favoris PWA et le précache du service worker pointent dessus,
 * et un 404 sur un hébergement statique ne se rattrape pas.
 */
const routes = [
  // Anciennes URLs — redirigent vers /unbound/*
  { path: '/roadmap', expect: 'Complétion' },
  { path: '/equipe', expect: null, links: '/unbound/equipe/' },
  { path: '/equipe/tyranitar', expect: 'Tyranitar' },
  { path: '/completion', expect: 'Complétion' },
  { path: '/reference', expect: null },
  { path: '/journal', expect: null },

  // Unbound, routes préfixées
  { path: '/unbound', expect: 'Complétion', links: '/unbound/equipe/' },
  { path: '/unbound/equipe', expect: null, links: '/unbound/equipe/' },
  { path: '/unbound/equipe/excadrill', expect: 'Excadrill' },
  { path: '/unbound/ressources', expect: null },
  { path: '/unbound/completion', expect: 'Complétion' },
  { path: '/unbound/reference', expect: null },
  { path: '/unbound/journal', expect: null },

  // Elite Redux
  { path: '/elite-redux', expect: 'Progression' },
  { path: '/elite-redux/completion', expect: 'Débuter' },
  { path: '/elite-redux/equipe', expect: null },
  { path: '/elite-redux/journal', expect: null },
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

/* --- 1 bis. Cloisonnement des sauvegardes ----------------------------- */

/*
 * Le test qui valide toute l'architecture multi-jeux : chaque jeu a sa propre
 * clé de sauvegarde, donc cocher chez l'un ne doit rien changer chez l'autre.
 * Si les deux partageaient un état, une partie en cours serait écrasée par
 * l'autre jeu — silencieusement.
 */
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const isolation = await openPage(context, 'cloisonnement')

  await isolation.goto(`${baseUrl}/elite-redux/completion`, { waitUntil: 'networkidle' })
  const box = isolation.locator('button[role="checkbox"][data-state="unchecked"]').first()
  if (await box.count() === 0) {
    failures.push('cloisonnement — aucune case décochée sur /elite-redux/completion')
  }
  else {
    await box.click()
    await isolation.waitForTimeout(700) // au-delà du debounce de 400 ms

    const keys = await isolation.evaluate(() => ({
      elite: localStorage.getItem('pokemon-companion:save:elite-redux'),
      unbound: localStorage.getItem('pokemon-companion:save'),
      game: localStorage.getItem('pokemon-companion:game'),
    }))

    if (!keys.elite) {
      failures.push('cloisonnement — rien écrit sous pokemon-companion:save:elite-redux')
    }
    if (keys.unbound) {
      failures.push('cloisonnement — cocher chez Elite Redux a écrit dans la sauvegarde Unbound')
    }
    if (keys.game !== 'elite-redux') {
      failures.push(`cloisonnement — le jeu actif devrait être « elite-redux », trouvé « ${keys.game} »`)
    }

    // Aucune case cochée ne doit apparaître côté Unbound.
    await isolation.goto(`${baseUrl}/unbound/completion`, { waitUntil: 'networkidle' })
    await isolation.waitForTimeout(300)
    const stillEmpty = await isolation.evaluate(() => localStorage.getItem('pokemon-companion:save'))
    if (stillEmpty && JSON.parse(stillEmpty).resources && Object.keys(JSON.parse(stillEmpty).resources).length) {
      failures.push('cloisonnement — la sauvegarde Unbound a récupéré des cases d’Elite Redux')
    }
  }
  await context.close()
}

/* --- 1 ter. Sélecteur de jeu ------------------------------------------ */

/*
 * Vérifié par la présence d'un `<a href>` réel, jamais à l'apparence : un
 * `UBadge` avec `:to` rend un `<span>`, et `:is="'NuxtLink'"` rend un élément
 * littéral — deux contrôles d'apparence cliquable qui ne navigueraient nulle
 * part, sans la moindre erreur.
 */
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const switcher = await openPage(context, 'sélecteur de jeu')
  await switcher.goto(`${baseUrl}/unbound`, { waitUntil: 'networkidle' })

  const trigger = switcher.locator('button', { hasText: 'Pokémon Unbound' }).first()
  if (await trigger.count() === 0) {
    failures.push('sélecteur — aucun déclencheur portant le nom du jeu actif')
  }
  else {
    await trigger.click()
    await switcher.waitForTimeout(300)
    const link = switcher.locator('a[href="/elite-redux"]')
    if (await link.count() === 0) {
      failures.push('sélecteur — pas de <a href="/elite-redux"> : le menu ne navigue nulle part')
    }
    else {
      await link.first().click()
      await switcher.waitForURL('**/elite-redux', { timeout: 5000 }).catch(() => {
        failures.push('sélecteur — le clic n’a pas mené à /elite-redux')
      })
    }
  }
  await context.close()
}

/* --- 2. Persistance : cocher une tâche, recharger --------------------- */

const persistence = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await openPage(persistence, 'persistance')

/*
 * La Battle Frontier est rendue en clair en tête de /completion, hors de
 * l'accordéon : ses tâches sont donc toujours dans le DOM, quel que soit le
 * groupe que l'accordéon décide d'ouvrir. Viser une case NOMMÉE plutôt qu'un
 * compte global garde le test stable quand on coche quelque chose.
 */
const ANCHOR = '/unbound/completion'
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

console.log(`${routes.length} routes × 2 viewports · cloisonnement des jeux · sélecteur · persistance · aller-retour export/import — tout passe.`)
