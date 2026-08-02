/**
 * Génère le contenu Pokémon Emerald Seaglass tiré des sources publiées.
 *
 *   pnpm gen:seaglass <pokedex|abilities|tms|all> [--fresh] [--dry-run]
 *
 * Pendant de `pnpm gen:elite` et de `pnpm scrape:wiki`, et **volontairement
 * séparé** : les scripts de contenu sont propres à un jeu, parce que leurs
 * sources n'ont rien en commun. Un argument `--game` partagé ne ferait que
 * coupler trois parseurs qui ne partagent aucune structure.
 *
 * ## Pourquoi ce générateur existe alors qu'on avait conclu l'inverse
 *
 * Seaglass n'a **pas de code source public**, d'où la conclusion initiale qu'il
 * n'y avait rien à générer. C'était vrai du code et faux de la donnée :
 * `mrwalkthroughs.com` publie les 447 fiches d'espèces telles qu'extraites de la
 * ROM, avec pour chaque stat de base la valeur du jeu **et** celle du jeu
 * officiel — ce que le Pokédex embarqué, tout refait qu'il soit, ne peut pas
 * montrer.
 *
 * ## Ce qui autorise à se servir d'une source tierce
 *
 * Le recoupement contre la **documentation officielle v3.0** versionnée dans
 * `docs/emerald-seaglass/` : elle donne le type de 421 espèces, donc le
 * générateur vérifie que le wiki dit la même chose plutôt que de le croire.
 * 413 espèces comparables, 413 accords au moment de l'écriture. La doc reste
 * l'autorité — sur un écart, `crossCheckTypes` **lève**.
 *
 * Ce recoupement a besoin du texte de la doc :
 *
 *   python3 scripts/read-seaglass-doc.py
 *
 * **Contrat d'un module de catégorie** : `scripts/lib/gen-seaglass-<nom>.mjs`
 * exporte `generate({ fresh })` et renvoie, en chaîne, le contenu complet du
 * fichier à écrire. Il lève sur une extraction douteuse plutôt que de rendre un
 * fichier amputé — voir `expectCount()` dans `scripts/lib/seaglass.mjs`.
 *
 * Ces fichiers de `app/data/emerald-seaglass/` sont **générés** : les corriger à
 * la main, c'est perdre la correction à la régénération suivante. Une donnée
 * fausse se corrige ici, dans le parseur, jamais dans la sortie.
 *
 * `--fresh` ignore le cache disque, `--dry-run` affiche sans écrire.
 */
import { writeFile } from 'node:fs/promises'
import { root } from './lib/data.mjs'
import { generate as generateAbilities } from './lib/gen-seaglass-abilities.mjs'
import { generate as generatePokedex } from './lib/gen-seaglass-pokedex.mjs'
import { generate as generateTms } from './lib/gen-seaglass-tms.mjs'

const SEAGLASS_DIR = `${root}app/data/emerald-seaglass/`

const GENERATORS = {
  pokedex: { file: 'pokedex.ts', run: generatePokedex },
  abilities: { file: 'abilities.ts', run: generateAbilities },
  tms: { file: 'tms.ts', run: generateTms },
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
    await writeFile(`${SEAGLASS_DIR}${file}`, output, 'utf8')
    console.log(`→ app/data/emerald-seaglass/${file} · ${weight} Ko`)
  }
}

console.log('\nRelis la sortie avant de commiter, puis : pnpm check')
