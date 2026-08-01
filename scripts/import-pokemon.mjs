/**
 * Intègre une fiche Pokémon rédigée en JSON.
 *
 * C'est le chemin d'entrée du contenu généré par IA (contrat :
 * `docs/fiche-pokemon.md`). Il fait d'un seul coup ce qui demandait cinq gestes
 * manuels — coller dans un fichier de 1170 lignes, trouver le slug pokemondb,
 * lancer `pnpm sprites`, deviner le jeu du sprite pixel, relancer `pnpm check` —
 * et il refuse plutôt que d'écrire une fiche qui casserait le build.
 *
 * Rien n'est écrit avant que la fiche entière soit validée : un import à
 * moitié appliqué laisserait un module orphelin absent du barrel.
 *
 * Usage :
 *   pnpm import:pokemon fiche.json
 *   pnpm import:pokemon fiche.json --dry-run   # valide et affiche, n'écrit rien
 */
import { readFile, writeFile } from 'node:fs/promises'
import { POKEMON_DIR, loadUnbound, loadPokemon } from './lib/data.mjs'
import { TEAM_SIZE, printFiche, validateFiche } from './lib/fiche.mjs'
import { regenerateIndex } from './lib/pokemon-index.mjs'
import { resolveSprite } from './lib/sprites.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const replace = args.includes('--replace')
const [file] = args.filter(argument => !argument.startsWith('--'))

function fail(message, details = []) {
  console.error(`✖ ${message}`)
  for (const detail of details) console.error(`    ${detail}`)
  process.exit(1)
}

if (!file) fail('usage : pnpm import:pokemon <fiche.json> [--dry-run] [--replace]')

/* --- 1. Lecture ---------------------------------------------------------- */

let fiche
try {
  fiche = JSON.parse(await readFile(file, 'utf8'))
}
catch (error) {
  fail(`lecture de « ${file} » impossible : ${error.message}`)
}

/*
 * Une IA rend volontiers la fiche enveloppée dans un objet racine. On accepte les
 * deux formes plutôt que de renvoyer une erreur de champ inconnu incompréhensible.
 */
if (fiche && typeof fiche === 'object' && !Array.isArray(fiche) && !fiche.slug) {
  const wrapped = fiche.pokemon ?? fiche.fiche ?? fiche.sheet
  if (wrapped) fiche = wrapped
}

/* --- 2. Validation ------------------------------------------------------- */

const { pokemon } = await loadPokemon()
const { phases } = await loadUnbound('phases.ts')

/*
 * En mode `--replace`, la fiche remplacée est retirée des ensembles de collision :
 * sinon elle se heurterait à son propre slug et à ses propres ids de tâche.
 */
const previous = pokemon.find(mon => mon.slug === fiche?.slug)

if (replace && !previous) {
  fail(
    `--replace demandé mais aucune fiche « ${fiche?.slug} » n'existe`,
    ['Retire le drapeau pour créer la fiche.'],
  )
}

const others = pokemon.filter(mon => mon.slug !== (replace ? fiche.slug : null))

const knownTaskIds = new Set([
  ...phases.flatMap(phase => phase.tasks.map(task => task.id)),
  ...others.flatMap(mon => (mon.tasks ?? []).map(task => task.id)),
])
const knownSlugs = new Set(others.map(mon => mon.slug))

if (previous && !replace) {
  fail(
    `la fiche « ${fiche.slug} » existe déjà`,
    ['Relance avec --replace pour la remplacer (le contenu actuel sera écrasé).'],
  )
}

const report = validateFiche(fiche, { knownTaskIds, knownSlugs })

for (const warning of report.warnings) console.warn(`  avertissement — ${warning}`)

if (report.errors.length) {
  fail(`${report.errors.length} erreur(s) dans « ${file} » — rien n'a été écrit`, report.errors)
}

/* --- 3. Slot ------------------------------------------------------------- */

/*
 * Le slot n'est pas laissé à l'IA : il dépend de l'équipe en place, qu'elle ne
 * connaît pas. On prend la première place libre, et on refuse d'ajouter un
 * septième membre — c'est exactement le piège que l'ancien squelette tendait en
 * proposant `slot: 7`.
 */
if (fiche.status === 'active') {
  // En remplacement, le slot que la fiche occupait déjà n'est pas « pris ».
  const taken = new Set(others.filter(mon => mon.status === 'active').map(mon => mon.slot))
  if (fiche.slot !== undefined && taken.has(fiche.slot)) {
    fail(`le slot ${fiche.slot} est déjà occupé par « ${others.find(mon => mon.slot === fiche.slot)?.slug} »`)
  }
  if (fiche.slot === undefined && previous?.slot !== undefined) {
    fiche.slot = previous.slot
    console.log(`Slot conservé : ${previous.slot}.`)
  }
  if (fiche.slot === undefined) {
    const free = Array.from({ length: TEAM_SIZE }, (_, index) => index + 1).find(slot => !taken.has(slot))
    if (!free) {
      fail(
        `l'équipe compte déjà ${TEAM_SIZE} membres actifs`,
        [
          'Importe la fiche en `"status": "retired"`, puis fais l’échange dans l’app',
          '(/equipe → Modifier) : la composition jouée y est modifiable sans toucher au contenu.',
        ],
      )
    }
    fiche.slot = free
    console.log(`Slot libre attribué : ${free}.`)
  }
}

/* --- 4. Sprite ----------------------------------------------------------- */

// `name` est en VO depuis le passage des noms propres à l'anglais : c'est lui
// qui donne le slug pokemondb, `nameEn` n'a plus de raison d'être.
if (fiche.sprite === undefined && fiche.name) {
  const guess = fiche.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  console.log(`Sprite non déclaré — recherche de « ${guess} » sur pokemondb…`)
  const resolved = await resolveSprite(guess)
  if (resolved) {
    fiche.sprite = resolved.sprite
    if (resolved.pixelSet !== 'black-white') fiche.spritePixelSet = resolved.pixelSet
    console.log(`  trouvé : ${resolved.sprite} (pixel : ${resolved.pixelSet}).`)
  }
  else {
    console.warn(`  avertissement — aucun sprite « ${guess} » sur pokemondb.`)
    console.warn('  Renseigne « sprite » à la main (slug pokemondb, ex. « rotom-wash »), ou laisse')
    console.warn('  la clé absente s’il s’agit d’une fiche concept, puis relance.')
  }
}
else if (fiche.sprite) {
  const resolved = await resolveSprite(fiche.sprite)
  if (!resolved) fail(`« ${fiche.sprite} » n'existe pas sur pokemondb — corrige « sprite »`)
  if (resolved.pixelSet !== 'black-white' && fiche.spritePixelSet === undefined) {
    fiche.spritePixelSet = resolved.pixelSet
    console.log(`Jeu du sprite pixel : ${resolved.pixelSet} (absent de Noir/Blanc).`)
  }
}

/* --- 5. Écriture --------------------------------------------------------- */

/*
 * En remplacement, on annonce ce qui change avant d'écrire : une fiche
 * régénérée par IA perd volontiers un champ au passage, et l'écrasement est
 * silencieux sans ça.
 */
if (previous) {
  const before = Object.keys(previous)
  const after = Object.keys(fiche)
  const added = after.filter(key => !before.includes(key))
  const removed = before.filter(key => !after.includes(key))

  console.log(`\nRemplacement de « ${fiche.slug} » :`)
  if (added.length) console.log(`  champs ajoutés  : ${added.join(', ')}`)
  if (removed.length) console.log(`  champs retirés  : ${removed.join(', ')}`)
  if (!added.length && !removed.length) console.log('  mêmes champs, contenu mis à jour')
  console.log(`  tâches          : ${previous.tasks?.length ?? 0} → ${fiche.tasks?.length ?? 0}`)

  /*
   * Une tâche disparue emporte sa case cochée : l'id n'existe plus, donc
   * `pruneOrphans` la donnera pour morte. Ça se dit avant, pas après.
   */
  const lostTasks = (previous.tasks ?? [])
    .map(task => task.id)
    .filter(id => !(fiche.tasks ?? []).some(task => task.id === id))
  if (lostTasks.length) {
    console.warn(`  ⚠ ids de tâche perdus : ${lostTasks.join(', ')}`)
    console.warn('    Leur case cochée deviendra orpheline dans la sauvegarde.')
  }
}

const module = printFiche(fiche)
const target = `${POKEMON_DIR}${fiche.slug}.ts`

if (dryRun) {
  console.log(`\n--- ${target} (--dry-run, rien n'est écrit) ---\n`)
  console.log(module)
  process.exit(0)
}

await writeFile(target, module)

/*
 * Placée derrière la dernière fiche de même statut : le barrel est rangé par
 * groupe (l'équipe, les sortis, puis les utilitaires de §6.7) et une nouvelle
 * recrue doit se lire dans son groupe, pas à la toute fin.
 */
const lastOfGroup = pokemon.filter(mon => mon.status === fiche.status).at(-1)?.slug
const { order } = await regenerateIndex({
  after: lastOfGroup ? { [fiche.slug]: lastOfGroup } : undefined,
})

console.log(`\nFiche écrite : app/data/unbound/pokemon/${fiche.slug}.ts`)
console.log(`Barrel régénéré : ${order.length} fiches.`)
console.log('\nÉtapes suivantes :')
console.log('  pnpm sprites   # télécharge les images déclarées')
console.log('  pnpm check     # validation du contenu + typecheck')
