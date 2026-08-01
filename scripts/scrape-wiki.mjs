/**
 * Génère le contenu adossé à unboundwiki.com.
 *
 *   pnpm scrape:wiki <missions|collectibles|tutors|items|all> [--fresh] [--dry-run]
 *
 * Ces fichiers de `app/data/unbound/` sont **générés** : les corriger à la main, c'est
 * perdre la correction à la prochaine régénération. Une donnée fausse se corrige
 * ici (le parseur) ou là-bas (signaler l'erreur au wiki) — jamais dans la sortie.
 *
 * Ce que le scraper ne fait pas : traduire. La règle du projet est « prose en
 * français, noms propres du jeu en VO » ; titres de mission, lieux, objets et
 * capacités sont des noms d'écran et restent tels quels, et l'objectif d'une
 * mission est conservé mot pour mot parce que c'est une citation de source.
 * Le français est réservé aux `description` de section, écrites à la main.
 *
 * **Contrat d'un module de catégorie** : `scripts/lib/scrape-<nom>.mjs` exporte
 * `scrape({ fresh })` et renvoie, en chaîne, le contenu complet du fichier à
 * écrire. Il lève sur une extraction douteuse plutôt que de rendre un fichier
 * amputé — voir `expectCount()` dans `scripts/lib/wiki.mjs`.
 *
 * `--fresh` ignore le cache disque, `--dry-run` affiche sans écrire.
 */
import { writeFile } from 'node:fs/promises'
import { UNBOUND_DIR } from './lib/data.mjs'
import { scrape as scrapeMissions } from './lib/scrape-missions.mjs'
import { scrape as scrapeCollectibles } from './lib/scrape-collectibles.mjs'
import { scrape as scrapeTutors } from './lib/scrape-tutors.mjs'
import { scrape as scrapeItems } from './lib/scrape-items.mjs'

const SCRAPERS = {
  missions: { file: 'missions.ts', run: scrapeMissions },
  collectibles: { file: 'collectibles.ts', run: scrapeCollectibles },
  tutors: { file: 'tutors.ts', run: scrapeTutors },
  items: { file: 'keyitems.ts', run: scrapeItems },
}

const args = process.argv.slice(2)
const fresh = args.includes('--fresh')
const dryRun = args.includes('--dry-run')
const targets = args.filter(arg => !arg.startsWith('--'))

function fail(message) {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

const wanted = targets.length && !targets.includes('all') ? targets : Object.keys(SCRAPERS)

const unknown = wanted.filter(name => !SCRAPERS[name])
if (unknown.length) {
  fail(`cible inconnue : ${unknown.join(', ')}\n  connues : ${Object.keys(SCRAPERS).join(', ')}, all`)
}

for (const name of wanted) {
  const { file, run } = SCRAPERS[name]
  process.stdout.write(`· ${name}… `)

  let output
  try {
    output = await run({ fresh })
  }
  catch (error) {
    console.log('')
    fail(`${name} : ${error.message}`)
  }

  if (dryRun) {
    console.log(`${output.split('\n').length} lignes (dry-run, rien écrit)`)
  }
  else {
    await writeFile(`${UNBOUND_DIR}${file}`, output, 'utf8')
    console.log(`→ app/data/unbound/${file}`)
  }
}

console.log('\nRelis la sortie avant de commiter, puis : pnpm check')
