/**
 * Lecture des sources Elite Redux.
 *
 * Le jeu est **open source** : contrairement à Unbound, il n'y a pas de wiki à
 * parser mais deux dépôts GitHub qui contiennent la donnée elle-même. Ce module
 * ne partage donc rien avec `wiki.mjs` — les sources, le format et les pièges
 * sont différents, et les mélanger n'apporterait qu'un couplage.
 *
 * Deux dépôts, deux rôles :
 *
 * - `eliteredux-source@master` — le decomp du jeu. Encounters sauvages, table
 *   des noms d'espèces, level caps.
 * - `er-config@upcoming` — la configuration en protobuf textuel. Talents,
 *   capacités, objets, dresseurs. ⚠️ `upcoming` est la branche de
 *   développement : ce dépôt n'a aucune branche stable.
 *
 * `raw.githubusercontent.com` répond sans précaution particulière — pas de
 * User-Agent à falsifier, contrairement à unboundwiki et romhackdex.
 *
 * Le cache vit dans `.cache/elite-redux/` (git-ignoré). `--fresh` le contourne.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { root } from './data.mjs'

const CACHE_DIR = `${root}.cache/elite-redux/`

const SOURCE_REPO = 'https://raw.githubusercontent.com/Elite-Redux/eliteredux-source/master'
const CONFIG_REPO = 'https://raw.githubusercontent.com/Elite-Redux/er-config/upcoming'

/** Les fichiers lus, avec l'URL qui sert de `source` dans le contenu généré. */
export const SOURCES = {
  encounters: {
    url: `${SOURCE_REPO}/src/data/wild_encounters.json`,
    human: 'https://github.com/Elite-Redux/eliteredux-source/blob/master/src/data/wild_encounters.json',
  },
  speciesNames: {
    url: `${SOURCE_REPO}/src/data/text/species_names.h`,
    human: 'https://github.com/Elite-Redux/eliteredux-source/blob/master/src/data/text/species_names.h',
  },
  abilities: {
    url: `${CONFIG_REPO}/AbilityList.textproto`,
    human: 'https://github.com/Elite-Redux/er-config/blob/upcoming/AbilityList.textproto',
  },
}

/**
 * Télécharge un fichier source, en passant par le cache disque.
 *
 * Lève sur un statut non-2xx : continuer sur une 404 produirait un fichier
 * généré silencieusement vide, exactement ce que les garde-fous cherchent à
 * éviter.
 */
export async function fetchSource(name, { fresh = false } = {}) {
  const source = SOURCES[name]
  if (!source) throw new Error(`source inconnue : ${name}`)

  const cached = `${CACHE_DIR}${name}`

  if (!fresh) {
    try {
      return await readFile(cached, 'utf8')
    }
    catch {
      // Absent du cache : on télécharge.
    }
  }

  const response = await fetch(source.url, { redirect: 'follow' })
  if (!response.ok) throw new Error(`${source.url} → HTTP ${response.status}`)
  const text = await response.text()

  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(cached, text, 'utf8')
  return text
}

/* ------------------------------------------------------------------------- *
 * Garde-fous
 * ------------------------------------------------------------------------- */

/**
 * Contrôle de compte — le garde-fou central de ces générateurs.
 *
 * Un parseur cassé ne lève pas : il rend moins d'entrées, en silence. Sans ce
 * contrôle, une régénération pourrait remplacer 150 zones par trois sans que
 * rien ne l'annonce. C'est la même règle que pour les scrapers Unbound, et elle
 * a la même valeur : ne jamais ajuster le compte sans avoir vérifié la source à
 * la main.
 */
export function expectCount(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${label} : ${actual} entrées extraites, ${expected} attendues.\n`
      + '  Soit le parseur est cassé, soit la source a changé. Ne pas ajuster\n'
      + '  le compte sans avoir vérifié le fichier source à la main.',
    )
  }
}

/** Même esprit, quand seule une borne basse a du sens. */
export function expectAtLeast(label, actual, minimum) {
  if (actual < minimum) {
    throw new Error(`${label} : ${actual} entrées extraites, au moins ${minimum} attendues.`)
  }
}

/* ------------------------------------------------------------------------- *
 * Génération de fichiers
 * ------------------------------------------------------------------------- */

/** Littéral de chaîne TypeScript, apostrophes simples comme le reste du dépôt. */
export function quote(text) {
  return `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
}

/** Slug kebab-case, aligné sur celui de `wiki.mjs`. */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
