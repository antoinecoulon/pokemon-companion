/**
 * Lecture d'unboundwiki.com.
 *
 * Le wiki est un WordPress : pas d'API de contenu, mais un HTML très régulier et
 * un sitemap complet. Deux contraintes ont façonné ce module :
 *
 * - **il faut un User-Agent de navigateur.** Sans lui la requête part sans
 *   identité et rien ne garantit la réponse ; avec, `curl` comme `fetch`
 *   passent. C'est la même précaution que pour romhackdex (voir CLAUDE.md).
 * - **il faut un cache disque.** Un scrape complet fait ~250 requêtes, et on le
 *   relance à chaque itération du parseur. Marteler le wiki pour redébugger une
 *   expression régulière serait grossier ; le cache rend aussi les runs
 *   reproductibles, donc le diff d'une régénération lisible.
 *
 * Le cache vit dans `.cache/wiki/` (git-ignoré). `--fresh` le contourne.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { root } from './data.mjs'

export const WIKI = 'https://unboundwiki.com'

const CACHE_DIR = `${root}.cache/wiki/`

const USER_AGENT
  = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    + '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/** Politesse : le wiki est un site perso, on ne le sature pas. */
const DELAY_MS = 250
let lastFetch = 0

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Télécharge une page, en passant par le cache disque.
 *
 * Renvoie le HTML brut. Lève sur un statut non-2xx : un scrape qui continue sur
 * une 404 produit silencieusement une entrée vide, et c'est exactement le genre
 * de trou que ce projet refuse.
 */
export async function fetchPage(url, { fresh = false } = {}) {
  const key = createHash('sha1').update(url).digest('hex').slice(0, 16)
  const cached = `${CACHE_DIR}${key}.html`

  if (!fresh) {
    try {
      return await readFile(cached, 'utf8')
    }
    catch {
      // Absent du cache : on télécharge.
    }
  }

  const wait = DELAY_MS - (Date.now() - lastFetch)
  if (wait > 0) await sleep(wait)
  lastFetch = Date.now()

  const response = await fetch(url, { headers: { 'user-agent': USER_AGENT }, redirect: 'follow' })
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`)
  const html = await response.text()

  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(cached, html, 'utf8')
  return html
}

/* ------------------------------------------------------------------------- *
 * Extraction
 * ------------------------------------------------------------------------- */

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'', nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  ldquo: '“', rdquo: '”', times: '×', eacute: 'é', egrave: 'è',
}

/** Décode les entités HTML, nommées et numériques. */
export function decode(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (whole, name) => ENTITIES[name] ?? whole)
}

/** Espaces normalisés : le HTML du wiki est indenté, les cellules en héritent. */
export const squash = text => text.replace(/\s+/g, ' ').trim()

/**
 * Contenu textuel d'un fragment HTML.
 *
 * `<br>` et les fins de bloc deviennent des sauts de ligne — c'est ce qui permet
 * de séparer les `Unlock Requirements` multiples d'une mission, qui ne sont
 * distingués que par leur découpage en blocs.
 */
export function toText(html) {
  return decode(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map(line => squash(line))
    .filter(Boolean)
    .join('\n')
}

/** Une ligne unique, espaces normalisés. */
export const toLine = html => squash(toText(html).replace(/\n/g, ' '))

/** Le `<main>` de la page, ou la page entière s'il n'y en a pas. */
export function mainOf(html) {
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)
  return main ? main[1] : html
}

/**
 * Tables de la page, chacune en tableau de lignes de cellules **HTML brut**.
 *
 * Le HTML est conservé plutôt que le texte pour que l'appelant puisse encore y
 * lire un `href` ou distinguer un `<br>`. Passer par `toLine()` ensuite.
 */
export function parseTables(html) {
  const tables = []
  for (const [, table] of mainOf(html).matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)) {
    const rows = []
    for (const [, row] of table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
      rows.push([...row.matchAll(/<t([dh])\b[^>]*>([\s\S]*?)<\/t\1>/gi)].map(cell => cell[2]))
    }
    if (rows.length) tables.push(rows)
  }
  return tables
}

/**
 * Titre `<h1>` de la page, débarrassé de son fil d'Ariane.
 */
export function titleOf(html) {
  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html)
  return h1 ? toLine(h1[1]) : ''
}

/* ------------------------------------------------------------------------- *
 * Génération de fichiers
 * ------------------------------------------------------------------------- */

/** Littéral de chaîne TypeScript, apostrophes simples comme le reste du dépôt. */
export function quote(text) {
  return `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
}

/**
 * Slug kebab-case, le format qu'impose `validate` aux ids de ressource.
 * Aligné sur le `slugify()` de `new-content.mjs` : œ/æ avant la décomposition
 * NFD, qui ne les traite pas.
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Contrôle de compte : le garde-fou central de ce scraper.
 *
 * Un parseur cassé ne lève pas — il renvoie moins d'entrées, ou des entrées
 * vides. Sans ce contrôle, une régénération pourrait remplacer 84 missions par
 * 3 sans que rien ne l'annonce. Le compte attendu est écrit sur la page du wiki
 * elle-même (« There are 84 missions total », « a total of 32 Raid Dens »).
 */
export function expectCount(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} : ${actual} entrées extraites, ${expected} attendues.\n`
      + '  Soit le parseur est cassé, soit le wiki a changé. Ne pas ajuster le\n'
      + '  compte sans avoir vérifié la page à la main.',
    )
  }
}
