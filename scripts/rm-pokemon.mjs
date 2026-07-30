/**
 * Retire une fiche Pokémon.
 *
 * Supprimer le fichier à la main laissait quatre traces : des sprites orphelins
 * dans `public/sprites/`, un trou dans la numérotation des slots (`1,2,4,5,6`
 * passait la validation), des `requires` morts pointant vers ses tâches, et des
 * clés de sauvegarde que `normalize()` conserve indéfiniment. Ce script traite
 * les trois premières et énumère la quatrième — la sauvegarde vit dans le
 * navigateur, elle se nettoie depuis l'app (Sauvegarde → Nettoyer).
 *
 * Il refuse tant qu'une référence subsiste : mieux vaut un refus qu'un lien mort
 * découvert trois semaines plus tard.
 *
 * Usage :
 *   pnpm rm:pokemon lucario
 *   pnpm rm:pokemon lucario --dry-run
 *   pnpm rm:pokemon lucario --force     # passe outre les références
 */
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { POKEMON_DIR, loadData, loadPokemon, root } from './lib/data.mjs'
import { printFiche } from './lib/fiche.mjs'
import { regenerateIndex } from './lib/pokemon-index.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')
const [slug] = args.filter(argument => !argument.startsWith('--'))

function fail(message, details = []) {
  console.error(`✖ ${message}`)
  for (const detail of details) console.error(`    ${detail}`)
  process.exit(1)
}

if (!slug) fail('usage : pnpm rm:pokemon <slug> [--dry-run] [--force]')

const { pokemon } = await loadPokemon()
const { phases } = await loadData('phases.ts')

const target = pokemon.find(mon => mon.slug === slug)
if (!target) {
  fail(`aucune fiche « ${slug} »`, [`Disponibles : ${pokemon.map(mon => mon.slug).join(', ')}`])
}

const ownTaskIds = new Set((target.tasks ?? []).map(task => task.id))

/* --- 1. Références entrantes --------------------------------------------- */

const references = []

for (const phase of phases) {
  for (const task of phase.tasks) {
    for (const dep of task.requires ?? []) {
      if (ownTaskIds.has(dep)) references.push(`phases.ts — « ${task.id} » requiert « ${dep} »`)
    }
    if (task.link === `/equipe/${slug}`) references.push(`phases.ts — « ${task.id} » pointe vers /equipe/${slug}`)
  }
}

for (const mon of pokemon) {
  if (mon.slug === slug) continue
  for (const task of mon.tasks ?? []) {
    for (const dep of task.requires ?? []) {
      if (ownTaskIds.has(dep)) references.push(`fiche ${mon.slug} — « ${task.id} » requiert « ${dep} »`)
    }
    if (task.link === `/equipe/${slug}`) references.push(`fiche ${mon.slug} — « ${task.id} » pointe vers /equipe/${slug}`)
  }
}

/*
 * Les scripts de smoke nomment des fiches en dur (`tyranitar`, `excadrill`,
 * `togekiss`) : les retirer casserait les tests sans que rien ne le dise avant
 * l'exécution.
 */
for (const file of await readdir(`${root}scripts`)) {
  if (!file.startsWith('smoke')) continue
  const source = await readFile(`${root}scripts/${file}`, 'utf8')
  if (source.includes(`/equipe/${slug}`) || source.includes(`'${slug}'`) || source.includes(`{ ${slug}:`)) {
    references.push(`scripts/${file} — la fiche y est nommée en dur`)
  }
}

if (references.length && !force) {
  fail(
    `« ${slug} » est encore référencé ${references.length} fois — rien n'a été supprimé`,
    [...references, '', 'Corrige ces références, ou relance avec --force.'],
  )
}
if (references.length) {
  console.warn(`⚠ ${references.length} référence(s) laissée(s) derrière (--force) :`)
  for (const reference of references) console.warn(`    ${reference}`)
}

/* --- 2. Ce qui va disparaître -------------------------------------------- */

const spriteFiles = []
for (const variant of ['home', 'pixel']) {
  const file = `${root}public/sprites/${variant}/${slug}.png`
  if (await stat(file).then(() => true).catch(() => false)) spriteFiles.push(file)
}

/*
 * Les clés de sauvegarde ne sont pas accessibles d'ici : elles vivent dans le
 * localStorage du navigateur. On les énumère pour que la purge dans l'app soit
 * un geste conscient et non une découverte.
 */
const orphanKeys = [
  `pokemon.${slug}`,
  ...ownTaskIds,
  ...['level', 'ivs', 'evs', 'nature', 'ability', 'moves', 'item'].map(key => `ready-${slug}-${key}`),
  `roster.${slug}`,
]

/* --- 3. Slots à refermer -------------------------------------------------- */

/*
 * Renumérotation du contenu, pas de la composition jouée : les overrides
 * persistés sont recalculés par `useRoster` au chargement, et la purge de
 * sauvegarde retire l'entrée morte.
 */
const remainingActive = pokemon
  .filter(mon => mon.status === 'active' && mon.slug !== slug)
  .sort((a, b) => (a.slot ?? 99) - (b.slot ?? 99))

const renumbered = remainingActive
  .map((mon, index) => ({ mon, slot: index + 1 }))
  .filter(({ mon, slot }) => mon.slot !== slot)

console.log(`Fiche « ${slug} » — ${target.name}, statut ${target.status}${target.slot ? `, slot ${target.slot}` : ''}.`)
console.log(`  fichier   : app/data/pokemon/${slug}.ts`)
console.log(`  sprites   : ${spriteFiles.length ? spriteFiles.map(file => file.replace(root, '')).join(', ') : 'aucun'}`)
console.log(`  tâches    : ${ownTaskIds.size}`)
if (renumbered.length) {
  console.log(`  slots     : ${renumbered.map(({ mon, slot }) => `${mon.slug} ${mon.slot}→${slot}`).join(', ')}`)
}

if (dryRun) {
  console.log('\n--dry-run : rien n’a été supprimé.')
  process.exit(0)
}

/* --- 4. Suppression ------------------------------------------------------- */

await rm(`${POKEMON_DIR}${slug}.ts`)
for (const file of spriteFiles) await rm(file)

for (const { mon, slot } of renumbered) {
  /*
   * Réécrit par l'imprimeur du contrat, pas par une substitution textuelle : une
   * regex sur `slot: n` toucherait aussi un `slot` cité dans de la prose.
   * En contrepartie les commentaires du fichier sont perdus, d'où l'avertissement.
   */
  await writeFile(`${POKEMON_DIR}${mon.slug}.ts`, printFiche({ ...mon, slot }))
  console.log(`  réécrit : ${mon.slug}.ts (slot ${mon.slot} → ${slot}) — commentaires du fichier perdus`)
}

const { order, removed } = await regenerateIndex()

console.log(`\nSupprimée. Barrel régénéré : ${order.length} fiches (${removed.join(', ') || 'aucun import retiré'}).`)
console.log('\nClés de sauvegarde devenues orphelines :')
for (const key of orphanKeys) console.log(`    ${key}`)
console.log('\n  → dans l’app : Sauvegarde → « Nettoyer la sauvegarde ».')
console.log('\nPuis : pnpm check')
