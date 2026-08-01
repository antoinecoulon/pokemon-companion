/**
 * Génère le contenu Elite Redux tiré du code ouvert du jeu.
 *
 *   pnpm gen:elite <encounters|abilities|all> [--fresh] [--dry-run]
 *
 * Pendant Elite Redux de `pnpm scrape:wiki`, et **volontairement séparé** : les
 * sources sont deux dépôts GitHub, pas un WordPress, et `CLAUDE.md` acte déjà
 * que les scripts de contenu sont propres à un jeu. Un argument `--game`
 * partagé ne ferait que coupler deux parseurs qui n'ont rien en commun.
 *
 * Ces fichiers de `app/data/elite-redux/` sont **générés** : les corriger à la
 * main, c'est perdre la correction à la prochaine régénération. Une donnée
 * fausse se corrige ici (le parseur) ou en amont (signaler au projet) — jamais
 * dans la sortie.
 *
 * **Contrat d'un module de catégorie** : `scripts/lib/gen-<nom>.mjs` exporte
 * `generate({ fresh })` et renvoie, en chaîne, le contenu complet du fichier à
 * écrire. Il lève sur une extraction douteuse plutôt que de rendre un fichier
 * amputé — voir `expectCount()` dans `scripts/lib/elite-redux.mjs`.
 *
 * `--fresh` ignore le cache disque, `--dry-run` affiche sans écrire.
 */
import { writeFile } from 'node:fs/promises'
import { root } from './lib/data.mjs'
import { generate as generateAbilities } from './lib/gen-abilities.mjs'
import { generate as generateEncounters } from './lib/gen-encounters.mjs'

const ELITE_REDUX_DIR = `${root}app/data/elite-redux/`

const GENERATORS = {
  encounters: { file: 'encounters.ts', run: generateEncounters },
  abilities: { file: 'abilities.ts', run: generateAbilities },
}

const args = process.argv.slice(2)
const fresh = args.includes('--fresh')
const dryRun = args.includes('--dry-run')
const targets = args.filter(arg => !arg.startsWith('--'))

function fail(message) {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

const wanted = targets.length && !targets.includes('all') ? targets : Object.keys(GENERATORS)

const unknown = wanted.filter(name => !GENERATORS[name])
if (unknown.length) {
  fail(`cible inconnue : ${unknown.join(', ')}\n  connues : ${Object.keys(GENERATORS).join(', ')}, all`)
}

for (const name of wanted) {
  const { file, run } = GENERATORS[name]
  process.stdout.write(`· ${name}… `)

  let output
  try {
    output = await run({ fresh })
  }
  catch (error) {
    console.log('')
    fail(`${name} : ${error.message}`)
  }

  const weight = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(0)

  if (dryRun) {
    console.log(`${output.split('\n').length} lignes · ${weight} Ko (dry-run, rien écrit)`)
  }
  else {
    await writeFile(`${ELITE_REDUX_DIR}${file}`, output, 'utf8')
    console.log(`→ app/data/elite-redux/${file} · ${weight} Ko`)
  }
}

console.log('\nRelis la sortie avant de commiter, puis : pnpm check')
