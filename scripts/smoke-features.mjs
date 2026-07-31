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

// Le build A de Tyranitar vise 252 HP / 252 Atk / 4 SpD, nature Adamant.
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
await setStat('EV Sp. Def', 252)
await page.waitForTimeout(300)
if (await criterionMet('EV exacts : 252 / 252 / 4')) {
  failures.push('fiche — une répartition au-delà de 510 EV est acceptée comme optimale')
}
if (await page.getByText(/au-delà du plafond/).count() === 0) {
  failures.push('fiche — le dépassement du plafond de 510 EV n’est pas signalé')
}

await setStat('EV Sp. Def', 4)
await setField('Niveau', 100)
await page.waitForTimeout(300)
if (!await criterionMet('Niveau 100')) {
  failures.push('fiche — saisir le niveau 100 ne satisfait pas le critère')
}

/* --- 2. Objet en double entre deux membres actifs ---------------------- */

// Tyranitar porte désormais le Choice Band (build A). On le donne aussi à
// Togekiss : §7.3 avertit que certains formats interdisent les objets doublons.
await page.goto(`${baseUrl}/equipe/togekiss`, { waitUntil: 'networkidle' })

const itemField = page.getByLabel('Objet tenu')
await itemField.fill('Choice Band')
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
await itemField.fill('Heavy-Duty Boots')
await itemField.blur()
await page.waitForTimeout(400)
if (await page.getByText(/Objet en double dans l’équipe/).count() !== 0) {
  failures.push('doublon — l’alerte persiste après avoir changé l’objet')
}

/* --- 3. Journal : ajouter, modifier, supprimer ------------------------- */

await page.goto(`${baseUrl}/journal`, { waitUntil: 'networkidle' })

await page.getByRole('button', { name: 'Nouvelle entrée' }).click()
await page.getByLabel('Titre').fill('Run Battle Tower — 21 victoires')
await page.getByLabel('Notes').fill('Mort sur un attaquant Ice au match 22.')
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

/* --- Composition d'équipe : échanger un membre --------------------------- */

/*
 * Le roster est le seul état qui change le *périmètre* de la progression
 * globale : sortir un membre retire ses tâches du total. On vérifie donc les
 * deux effets ensemble — l'échange à l'écran, et le total qui bouge — puis la
 * survie au rechargement, puisque l'écart est persisté et non recalculé.
 */
const rosterContext = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
const rosterPage = await rosterContext.newPage()
rosterPage.on('pageerror', error => failures.push(`roster — exception : ${error.message.split('\n')[0]}`))

/** « 12 tâches sur 88 » → 88. */
async function trackedTotal() {
  await rosterPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
  await rosterPage.waitForTimeout(600)
  const text = await rosterPage.getByText(/tâches sur \d+/).first().innerText()
  return Number(text.match(/tâches sur (\d+)/)?.[1])
}

const totalBefore = await trackedTotal()

await rosterPage.goto(`${baseUrl}/equipe`, { waitUntil: 'networkidle' })
await rosterPage.waitForTimeout(600)

await rosterPage.getByRole('button', { name: 'Modifier' }).click()
await rosterPage.waitForTimeout(400)

// Les six slots sont pris : « Échanger » doit demander qui sort.
await rosterPage.getByRole('button', { name: 'Échanger' }).first().click()
await rosterPage.waitForTimeout(300)
if (await rosterPage.getByText(/Qui sort de l’équipe/).count() === 0) {
  failures.push('roster — faire entrer un Pokémon sur une équipe pleine ne demande pas qui sort')
}

await rosterPage.getByRole('button', { name: 'Remplacer' }).last().click()
await rosterPage.waitForTimeout(600)
await rosterPage.keyboard.press('Escape')
await rosterPage.waitForTimeout(400)

if (await rosterPage.getByText(/Composition modifiée/).count() === 0) {
  failures.push('roster — l’écart avec la composition du guide n’est pas signalé')
}

// Scopé aux cartes de la page : le tiroir reste monté et affiche les mêmes slots.
const slotLabels = await rosterPage.locator('a[href^="/equipe/"] .tabular-nums')
  .filter({ hasText: /^#\d$/ })
  .allInnerTexts()
if (slotLabels.join(' ') !== '#1 #2 #3 #4 #5 #6') {
  failures.push(`roster — slots affichés « ${slotLabels.join(' ')} », « #1 … #6 » attendus`)
}

const overrides = await rosterPage.evaluate(() =>
  JSON.parse(localStorage.getItem('pokemon-companion:save') ?? '{}').roster ?? {})
if (!Object.keys(overrides).length) {
  failures.push('roster — l’échange n’est pas persisté')
}

const totalAfter = await trackedTotal()
if (!(totalAfter < totalBefore)) {
  failures.push(`roster — le périmètre de la progression n’a pas changé (${totalBefore} → ${totalAfter})`)
}

// Retour à la composition du guide : le total doit revenir exactement.
await rosterPage.goto(`${baseUrl}/equipe`, { waitUntil: 'networkidle' })
await rosterPage.waitForTimeout(600)
await rosterPage.getByRole('button', { name: 'Revenir à celle du guide' }).click()
await rosterPage.waitForTimeout(600)

if (await rosterPage.getByText(/Composition modifiée/).count() !== 0) {
  failures.push('roster — le bandeau « composition modifiée » persiste après remise à zéro')
}
if (await trackedTotal() !== totalBefore) {
  failures.push('roster — revenir à la composition du guide ne restaure pas le total de tâches')
}

await rosterContext.close()

/* --- Purge des clés mortes ---------------------------------------------- */

/*
 * On amorce une sauvegarde mêlant clés valides et clés mortes. Le point qui
 * compte n'est pas que les mortes disparaissent — c'est que les valides
 * survivent : une purge trop large effacerait des cases cochées, en silence.
 */
const pruneContext = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
await pruneContext.addInitScript(() => {
  // `addInitScript` s'exécute à CHAQUE navigation : sans cette garde, le
  // rechargement réinjecterait les clés mortes qu'on vient de purger.
  if (localStorage.getItem('pokemon-companion:save')) return
  localStorage.setItem('pokemon-companion:save', JSON.stringify({
    version: 1,
    tasks: {
      'phase-1.1': true,
      'ready-tyranitar-ivs': true,
      'mon-disparu-3': true,
    },
    pokemon: {
      tyranitar: { ivs: { atk: 31 }, evs: {}, moves: ['', '', '', ''] },
      disparu: { ivs: {}, evs: {}, moves: ['', '', '', ''] },
    },
    counters: { money: 4200, ancien: 7 },
    resources: { 'npc:aboli': true },
    roster: {},
    journal: [],
    updatedAt: new Date().toISOString(),
  }))
})

const prunePage = await pruneContext.newPage()
prunePage.on('pageerror', error => failures.push(`purge — exception : ${error.message.split('\n')[0]}`))
await prunePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
await prunePage.waitForTimeout(700)

await prunePage.getByRole('button', { name: 'Gérer la sauvegarde' }).click()
await prunePage.waitForTimeout(300)

// 4 clés mortes : la tâche, la fiche, le compteur, la ressource.
if (await prunePage.getByRole('menuitem', { name: /Nettoyer la sauvegarde \(4\)/ }).count() === 0) {
  const label = await prunePage.getByRole('menuitem', { name: /Nettoyer/ }).innerText().catch(() => '(absent)')
  failures.push(`purge — le menu annonce « ${label} », « Nettoyer la sauvegarde (4) » attendu`)
}

await prunePage.getByRole('menuitem', { name: /Nettoyer/ }).click()
await prunePage.waitForTimeout(400)
await prunePage.getByRole('button', { name: 'Nettoyer', exact: true }).click()
await prunePage.waitForTimeout(600)

const after = await prunePage.evaluate(() =>
  JSON.parse(localStorage.getItem('pokemon-companion:save') ?? '{}'))

for (const [label, present] of [
  ['tâche de roadmap cochée', after.tasks?.['phase-1.1']],
  ['case « Endgame Ready » cochée', after.tasks?.['ready-tyranitar-ivs']],
  ['compteur renseigné', after.counters?.money === 4200],
  ['progression saisie', after.pokemon?.tyranitar?.ivs?.atk === 31],
]) {
  if (!present) failures.push(`purge — ${label} : supprimée alors qu'elle est valide`)
}

for (const [label, gone] of [
  ['tâche disparue', after.tasks?.['mon-disparu-3'] === undefined],
  ['fiche disparue', after.pokemon?.disparu === undefined],
  ['compteur disparu', after.counters?.ancien === undefined],
  ['ressource disparue', after.resources?.['npc:aboli'] === undefined],
]) {
  if (!gone) failures.push(`purge — ${label} : toujours présente après nettoyage`)
}

await prunePage.reload({ waitUntil: 'networkidle' })
await prunePage.waitForTimeout(700)
await prunePage.getByRole('button', { name: 'Gérer la sauvegarde' }).click()
await prunePage.waitForTimeout(300)
if (await prunePage.getByRole('menuitem', { name: /Nettoyer la sauvegarde \(\d/ }).count() !== 0) {
  failures.push('purge — des clés mortes réapparaissent après rechargement')
}

await pruneContext.close()

/* --- 7. Copie de secours d'une sauvegarde illisible -------------------- */

/*
 * `normalize()` refuse ce qu'il ne reconnaît pas, et le premier `persist()` qui
 * suit réécrit la clé par-dessus : sans copie, la sauvegarde disparaît en
 * silence. C'est la seule opération réellement destructrice du code, et elle se
 * déclenche toute seule au chargement — d'où ce contrôle.
 */
const backupContext = await browser.newContext({ viewport: { width: 1280, height: 1000 } })

// Version supérieure à celle du code : cas d'un déploiement revenu en arrière.
const doomedSave = JSON.stringify({
  version: 99,
  tasks: { 'phase-1.1': true },
  pokemon: {},
  counters: { money: 123456 },
  resources: {},
  roster: {},
  journal: [],
  updatedAt: new Date().toISOString(),
})

await backupContext.addInitScript((payload) => {
  localStorage.setItem('pokemon-companion:save', payload)
}, doomedSave)

const backupPage = await backupContext.newPage()
backupPage.on('pageerror', error => failures.push(`secours — exception : ${error.message.split('\n')[0]}`))
await backupPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
await backupPage.waitForTimeout(700)

// L'échec doit se voir à l'écran, pas seulement dans la console.
if (await backupPage.getByText('Sauvegarde illisible').count() === 0) {
  failures.push('secours — aucune alerte à l’écran alors que la sauvegarde a été rejetée')
}

const storedBackup = await backupPage.evaluate(() =>
  localStorage.getItem('pokemon-companion:save:backup'))

if (!storedBackup) {
  failures.push('secours — aucune copie écrite : la sauvegarde rejetée est perdue')
}
else {
  const entry = JSON.parse(storedBackup)
  if (entry.payload !== doomedSave) {
    failures.push('secours — la copie ne contient pas les octets d’origine')
  }
  if (entry.reason !== 'rejected') {
    failures.push(`secours — motif « ${entry.reason} », « rejected » attendu`)
  }
}

// Et elle doit être récupérable, sinon la conserver ne sert à rien.
await backupPage.getByRole('button', { name: /Gérer la sauvegarde/ }).click()
await backupPage.waitForTimeout(300)
if (await backupPage.getByRole('menuitem', { name: /Copie de la sauvegarde illisible/ }).count() === 0) {
  failures.push('secours — la copie n’est pas proposée au téléchargement dans le menu')
}
await backupPage.keyboard.press('Escape')

/*
 * Rien n'a réécrit la sauvegarde illisible : elle est toujours là, donc le
 * problème est toujours entier. L'alerte doit se répéter — se taire au second
 * chargement ferait disparaître le seul signal qui mène à la copie.
 */
await backupPage.reload({ waitUntil: 'networkidle' })
await backupPage.waitForTimeout(700)
if (await backupPage.evaluate(() => localStorage.getItem('pokemon-companion:save:backup')) === null) {
  failures.push('secours — la copie disparaît au rechargement')
}
if (await backupPage.getByText('Sauvegarde illisible').count() === 0) {
  failures.push('secours — l’alerte disparaît alors que la sauvegarde illisible est toujours en place')
}

// Et la copie reste fidèle : un second rejet ne doit pas l'écraser par autre chose.
const rewritten = JSON.parse(await backupPage.evaluate(() =>
  localStorage.getItem('pokemon-companion:save:backup')))
if (rewritten.payload !== doomedSave) {
  failures.push('secours — la copie a été écrasée par un contenu différent au second chargement')
}

await backupContext.close()

/* --- 8. Une sauvegarde valide ne déclenche rien ------------------------ */

const intactContext = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
await intactContext.addInitScript(() => {
  localStorage.setItem('pokemon-companion:save', JSON.stringify({
    version: 1,
    tasks: { 'phase-1.1': true },
    pokemon: {},
    counters: {},
    resources: {},
    roster: {},
    journal: [],
    updatedAt: new Date().toISOString(),
  }))
})

const intactPage = await intactContext.newPage()
intactPage.on('pageerror', error => failures.push(`intact — exception : ${error.message.split('\n')[0]}`))
await intactPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
await intactPage.waitForTimeout(700)

if (await intactPage.evaluate(() => localStorage.getItem('pokemon-companion:save:backup')) !== null) {
  failures.push('intact — une copie de secours est écrite alors que la sauvegarde est lisible')
}
if (await intactPage.getByText('Sauvegarde illisible').count() !== 0) {
  failures.push('intact — alerte affichée sur une sauvegarde parfaitement valide')
}

await intactContext.close()

/* --- 9. Écran de synchronisation, appareil non relié ------------------- */

/*
 * Sans token, aucun appel réseau ne doit partir : la synchronisation est une
 * option, pas un prérequis. On vérifie donc que l'app s'ouvre normalement, que
 * l'écran de configuration s'affiche, et surtout qu'aucune requête ne sort vers
 * GitHub — une app hors-ligne qui appelle une API au démarrage, ça se voit au
 * premier tunnel.
 */
const syncContext = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
const syncPage = await syncContext.newPage()
const githubCalls = []
syncPage.on('request', (request) => {
  if (request.url().includes('api.github.com')) githubCalls.push(request.url())
})
syncPage.on('pageerror', error => failures.push(`synchro — exception : ${error.message.split('\n')[0]}`))

await syncPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
await syncPage.waitForTimeout(700)

if (githubCalls.length) {
  failures.push(`synchro — ${githubCalls.length} appel(s) à GitHub alors qu'aucun token n'est enregistré`)
}

await syncPage.getByRole('button', { name: /Gérer la sauvegarde/ }).click()
await syncPage.waitForTimeout(300)

if (await syncPage.getByRole('menuitem', { name: /appareil non relié/ }).count() === 0) {
  failures.push('synchro — le menu n’annonce pas que l’appareil n’est pas relié')
}
if (await syncPage.getByRole('menuitem', { name: 'Synchroniser maintenant' }).count() !== 0) {
  failures.push('synchro — « Synchroniser maintenant » proposé alors qu’aucun token n’est enregistré')
}

await syncPage.getByRole('menuitem', { name: /appareil non relié/ }).click()
await syncPage.waitForTimeout(400)

if (await syncPage.getByLabel('Token GitHub').count() === 0) {
  failures.push('synchro — le champ de token ne s’affiche pas')
}
// Le bouton reste inerte tant qu'aucun token n'est saisi.
if (await syncPage.getByRole('button', { name: 'Relier cet appareil' }).isDisabled() === false) {
  failures.push('synchro — « Relier cet appareil » est actif avec un champ vide')
}

/*
 * Le contenu des icônes, pas leur simple présence : un nom inexistant rend un
 * <svg> vide, sans erreur. C'est ce qui avait laissé `i-lucide-broom` invisible.
 */
const emptyIcons = await syncPage.evaluate(() =>
  [...document.querySelectorAll('svg')].filter(svg => svg.innerHTML.trim() === '').length)
if (emptyIcons > 0) {
  failures.push(`synchro — ${emptyIcons} icône(s) rendue(s) vide(s) à l’écran`)
}

await syncContext.close()
await browser.close()

/* --- Rapport ---------------------------------------------------------- */

if (failures.length) {
  console.error(`\n${failures.length} problème(s) :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log(
  'Critères déduits · doublon d’objet · CRUD du journal · ressources acquises · '
  + 'composition d’équipe · purge de sauvegarde · copie de secours · écran de synchro — tout passe.',
)
