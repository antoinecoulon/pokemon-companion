/**
 * Vérification navigateur des interactions distinctives de l'app.
 *
 * `smoke.mjs` couvre les routes et la persistance. Ici on vérifie ce qui fait
 * l'intérêt de l'app par rapport au markdown : les critères « Endgame Ready »
 * déduits du formulaire, la détection d'objet en double entre membres de
 * l'équipe, le CRUD du journal, et le marquage des ressources acquises.
 *
 * Usage : pnpm smoke:features
 */
import { chromium } from 'playwright'

const baseUrl = process.argv[2] ?? 'http://localhost:3000'
const failures = []

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } })

const page = await context.newPage()
page.on('console', (message) => {
  if (message.type() !== 'error') return
  const text = message.text()
  if (/service.?worker|favicon|manifest/i.test(text)) return
  failures.push(`console.error : ${text}`)
})
page.on('pageerror', error => failures.push(`exception : ${error.message}`))

/** Les champs de StatInputs portent un aria-label explicite. */
async function setStat(ariaLabel, value) {
  const input = page.locator(`input[aria-label="${ariaLabel}"]`)
  await input.fill(String(value))
  await input.blur()
}

/** Les autres champs sont reliés à leur libellé par UFormField. */
async function setField(label, value) {
  const input = page.getByLabel(label)
  await input.fill(String(value))
  await input.blur()
}

/** État d'une ligne de la checklist : la pastille verte vaut « rempli ». */
async function criterionMet(label) {
  const row = page.locator('li', { has: page.getByText(label, { exact: true }) }).first()
  return (await row.locator('.text-success').count()) > 0
}

/* --- 1. Fiche Tyranitar : les critères déduits ------------------------- */

await page.goto(`${baseUrl}/equipe/tyranitar`, { waitUntil: 'networkidle' })

if (await criterionMet('Niveau 100')) {
  failures.push('fiche — « Niveau 100 » est rempli alors qu’aucun niveau n’est saisi')
}
if (await criterionMet('EV exacts : 252 / 252 / 4')) {
  failures.push('fiche — « EV exacts » est rempli alors qu’aucun EV n’est saisi')
}

// Le build A de Tyranitar vise 252 PV / 252 Atk / 4 Déf.Spé, nature Rigide.
await page.getByRole('button', { name: /Pré-remplir depuis/ }).click()
await page.waitForTimeout(300)

if (!await criterionMet('EV exacts : 252 / 252 / 4')) {
  failures.push('fiche — le pré-remplissage depuis le build ne satisfait pas « EV exacts »')
}
if (!await criterionMet('Nature favorable')) {
  failures.push('fiche — le pré-remplissage ne satisfait pas « Nature favorable »')
}
if (!await criterionMet('Objet équipé et non dupliqué')) {
  failures.push('fiche — le pré-remplissage ne satisfait pas « Objet équipé et non dupliqué »')
}

// Casser volontairement la répartition : 252/252/252 dépasse le plafond.
await setStat('EV Défense Spéciale', 252)
await page.waitForTimeout(300)
if (await criterionMet('EV exacts : 252 / 252 / 4')) {
  failures.push('fiche — une répartition au-delà de 510 EV est acceptée comme optimale')
}
if (await page.getByText(/au-delà du plafond/).count() === 0) {
  failures.push('fiche — le dépassement du plafond de 510 EV n’est pas signalé')
}

await setStat('EV Défense Spéciale', 4)
await setField('Niveau', 100)
await page.waitForTimeout(300)
if (!await criterionMet('Niveau 100')) {
  failures.push('fiche — saisir le niveau 100 ne satisfait pas le critère')
}

/* --- 2. Objet en double entre deux membres actifs ---------------------- */

// Tyranitar porte désormais le Bandeau Choix (build A). On le donne aussi à
// Togekiss : §7.3 avertit que certains formats interdisent les objets doublons.
await page.goto(`${baseUrl}/equipe/togekiss`, { waitUntil: 'networkidle' })

const itemField = page.getByLabel('Objet tenu')
await itemField.fill('Bandeau Choix')
await itemField.blur()
await page.waitForTimeout(400)

const duplicateAlert = await page.getByText(/Objet en double dans l’équipe/).count()
if (duplicateAlert === 0) {
  failures.push('doublon — donner le même objet à Tyranitar et Togekiss ne déclenche aucune alerte')
}
if (await criterionMet('Objet équipé et non dupliqué')) {
  failures.push('doublon — le critère « objet non dupliqué » reste rempli malgré le doublon')
}

// On nettoie pour ne pas laisser un faux positif derrière soi.
await itemField.fill('Bottes Épaisses')
await itemField.blur()
await page.waitForTimeout(400)
if (await page.getByText(/Objet en double dans l’équipe/).count() !== 0) {
  failures.push('doublon — l’alerte persiste après avoir changé l’objet')
}

/* --- 3. Journal : ajouter, modifier, supprimer ------------------------- */

await page.goto(`${baseUrl}/journal`, { waitUntil: 'networkidle' })

await page.getByRole('button', { name: 'Nouvelle entrée' }).click()
await page.getByLabel('Titre').fill('Run Battle Tower — 21 victoires')
await page.getByLabel('Notes').fill('Mort sur un attaquant Glace au match 22.')
await page.getByRole('button', { name: 'Ajouter' }).click()
await page.waitForTimeout(400)

if (await page.getByText('Run Battle Tower — 21 victoires').count() === 0) {
  failures.push('journal — l’entrée ajoutée n’apparaît pas')
}

// L'entrée doit survivre au rechargement.
await page.reload({ waitUntil: 'networkidle' })
if (await page.getByText('Run Battle Tower — 21 victoires').count() === 0) {
  failures.push('journal — l’entrée ne survit pas au rechargement')
}

await page.getByRole('button', { name: 'Modifier' }).first().click()
await page.getByLabel('Titre').fill('Run Battle Tower — 34 victoires')
await page.getByRole('button', { name: 'Enregistrer' }).click()
await page.waitForTimeout(400)

if (await page.getByText('Run Battle Tower — 34 victoires').count() === 0) {
  failures.push('journal — la modification n’est pas prise en compte')
}
if (await page.getByText('Run Battle Tower — 21 victoires').count() !== 0) {
  failures.push('journal — l’ancien titre est encore affiché après modification')
}

await page.getByRole('button', { name: 'Supprimer', exact: true }).first().click()
await page.getByRole('button', { name: 'Oui, supprimer' }).click()
await page.waitForTimeout(400)

if (await page.getByText('Run Battle Tower — 34 victoires').count() !== 0) {
  failures.push('journal — l’entrée est encore là après suppression')
}
if (await page.getByText('Journal vide').count() === 0) {
  failures.push('journal — l’état vide ne s’affiche pas après suppression de la dernière entrée')
}

await context.close()

/* --- 4. EV perdus sur une sauvegarde importée -------------------------- */

/*
 * Le champ EV avance par pas de 4, donc l'interface ne permet pas de saisir un
 * non-multiple. L'avertissement « EV perdus » ne concerne donc que les
 * sauvegardes importées ou éditées à la main — c'est ce chemin qu'on teste, en
 * injectant l'état avant le démarrage de l'app.
 */
const seeded = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
await seeded.addInitScript(() => {
  localStorage.setItem('pokemon-companion:save', JSON.stringify({
    version: 1,
    tasks: {},
    // 252 / 252 / 6 : total légal, mais 2 EV n'atteignent aucun point de stat.
    pokemon: { tyranitar: { ivs: {}, evs: { hp: 252, atk: 252, spd: 6 }, moves: ['', '', '', ''] } },
    counters: {},
    journal: [],
    updatedAt: new Date().toISOString(),
  }))
})

const seededPage = await seeded.newPage()
seededPage.on('pageerror', error => failures.push(`EV perdus — exception : ${error.message.split('\n')[0]}`))
await seededPage.goto(`${baseUrl}/equipe/tyranitar`, { waitUntil: 'networkidle' })

if (await seededPage.getByText(/2 EV perdus/).count() === 0) {
  failures.push('EV perdus — 252/252/6 importé ne déclenche pas l’avertissement')
}

await seeded.close()

/* --- Ressources acquises : le PNJ descend, et il y reste ---------------- */

/*
 * Deux choses à prouver ici. D'abord que cocher retire l'entrée de la liste
 * active et la fait apparaître dans le repli. Ensuite que les namespaces `npc:`
 * et `quest:` ne se télescopent pas : sans préfixe, `objets-pouvoir` existe
 * comme id de consommable ET de quête.
 */
const resourcesContext = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
const resourcesPage = await resourcesContext.newPage()
resourcesPage.on('pageerror', error => failures.push(`ressources — exception : ${error.message.split('\n')[0]}`))

const CHECKBOX = 'button[role="checkbox"]'
await resourcesPage.goto(`${baseUrl}/ressources`, { waitUntil: 'networkidle' })
await resourcesPage.waitForTimeout(600)

const activeBefore = await resourcesPage.locator(`${CHECKBOX}[aria-label^="Marquer comme acquis"]`).count()
await resourcesPage.locator(`${CHECKBOX}[aria-label*="Advanced Stat Scanner"]`).first().click()
await resourcesPage.waitForTimeout(600)

const activeAfter = await resourcesPage.locator(`${CHECKBOX}[aria-label^="Marquer comme acquis"]`).count()
if (activeAfter !== activeBefore - 1) {
  failures.push(`ressources — ${activeAfter} PNJ actifs après coche, ${activeBefore - 1} attendus`)
}
if (await resourcesPage.getByText(/PNJ déjà débloqués \(1\)/).count() === 0) {
  failures.push('ressources — le repli « PNJ déjà débloqués (1) » n’apparaît pas')
}

// Une quête, pour vérifier que les deux namespaces sont indépendants.
await resourcesPage.locator(`${CHECKBOX}[aria-label^="Marquer comme terminée"]`).first().click()
await resourcesPage.waitForTimeout(600)
if (await resourcesPage.getByText(/Quêtes déjà faites \(1\)/).count() === 0) {
  failures.push('ressources — le repli des quêtes n’apparaît pas')
}
if (await resourcesPage.getByText(/PNJ déjà débloqués \(1\)/).count() === 0) {
  failures.push('ressources — cocher une quête a perturbé le repli des PNJ (collision de clés ?)')
}

await resourcesPage.reload({ waitUntil: 'networkidle' })
await resourcesPage.waitForTimeout(900)
if (await resourcesPage.getByText(/PNJ déjà débloqués \(1\)/).count() === 0) {
  failures.push('ressources — l’état acquis ne survit pas au rechargement')
}

const stored = await resourcesPage.evaluate(() =>
  JSON.parse(localStorage.getItem('pokemon-companion:save') ?? '{}').resources ?? {})
for (const key of Object.keys(stored)) {
  if (!/^(npc|quest):/.test(key)) failures.push(`ressources — clé persistée sans namespace : « ${key} »`)
}

await resourcesContext.close()
await browser.close()

/* --- Rapport ---------------------------------------------------------- */

if (failures.length) {
  console.error(`\n${failures.length} problème(s) :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log('Critères déduits · doublon d’objet · CRUD du journal · ressources acquises — tout passe.')
