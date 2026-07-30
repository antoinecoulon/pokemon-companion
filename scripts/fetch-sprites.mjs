/**
 * Récupère les sprites des Pokémon de l'équipe dans `public/sprites/`.
 *
 * Les images sont **versionnées dans le dépôt**, pas chargées à la volée : l'app
 * est une PWA hors-ligne, et une image distante serait invisible réseau coupé —
 * exactement le piège qui avait fait disparaître les icônes en v1.
 *
 * Deux jeux, deux usages :
 *   - `home`  — rendus 3D 256 px, pour l'en-tête d'une fiche (~38 Ko pièce) ;
 *   - `pixel` — sprites 2D 96 px, pour les vignettes et le bandeau (~1 Ko pièce).
 *
 * Le script est idempotent : il saute tout fichier déjà présent. Passer `--force`
 * pour re-télécharger.
 *
 * Usage : pnpm sprites
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, { alias: { '~': fileURLToPath(new URL('../app', import.meta.url)) } })
const { pokemon } = await jiti.import('../app/data/pokemon.ts')

const force = process.argv.includes('--force')
const root = new URL('../public/sprites/', import.meta.url)

/*
 * Zeraora est de la génération 7 : il n'a aucun sprite pixel dans les jeux
 * Noir/Blanc. On prend le sien dans Épée/Bouclier, seul set pixel qui le couvre.
 */
const PIXEL_SET_OVERRIDES = { zeraora: 'sword-shield' }

const variants = {
  home: () => 'home',
  pixel: sprite => PIXEL_SET_OVERRIDES[sprite] ?? 'black-white',
}

const sheets = pokemon.filter(mon => mon.sprite)
const skipped = pokemon.filter(mon => !mon.sprite).map(mon => mon.slug)

let downloaded = 0
let kept = 0
const failures = []

for (const variant of Object.keys(variants)) {
  await mkdir(new URL(`${variant}/`, root), { recursive: true })
}

for (const mon of sheets) {
  for (const [variant, resolveSet] of Object.entries(variants)) {
    const target = new URL(`${variant}/${mon.slug}.png`, root)

    if (!force && await stat(target).then(() => true).catch(() => false)) {
      kept += 1
      continue
    }

    const source = `https://img.pokemondb.net/sprites/${resolveSet(mon.sprite)}/normal/${mon.sprite}.png`
    const response = await fetch(source)

    if (!response.ok) {
      failures.push(`${mon.slug} (${variant}) — ${response.status} sur ${source}`)
      continue
    }

    await writeFile(target, Buffer.from(await response.arrayBuffer()))
    downloaded += 1
  }
}

console.log(`Sprites : ${downloaded} téléchargé(s), ${kept} déjà présent(s), ${sheets.length} fiches couvertes.`)
if (skipped.length) console.log(`  sans sprite (fiches concept) : ${skipped.join(', ')}`)

if (failures.length) {
  console.error(`\n${failures.length} échec(s) :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}
