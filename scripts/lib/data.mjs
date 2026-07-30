/**
 * Accès partagé au contenu TypeScript depuis les scripts Node.
 *
 * Les scripts lisent les vraies données plutôt qu'une copie : c'est ce qui
 * permet à `validate` de contrôler des ids et à `import:pokemon` de refuser une
 * collision. Passer par ce module évite que chacun reconstruise son instance
 * jiti — et surtout que le chemin d'un module de contenu soit écrit en dur dans
 * trois fichiers, ce qui avait cassé les scripts quand `pokemon.ts` est devenu
 * le dossier `pokemon/`.
 */
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

/** Racine du dépôt, avec barre oblique finale. */
export const root = fileURLToPath(new URL('../../', import.meta.url))

const jiti = createJiti(fileURLToPath(import.meta.url), {
  alias: { '~': `${root}app` },
})

/** Importe un module de l'app, chemin relatif à `app/`. */
export function loadApp(module) {
  return jiti.import(`${root}app/${module}`)
}

/** Importe un module de contenu, chemin relatif à `app/data/`. */
export function loadData(module) {
  return loadApp(`data/${module}`)
}

/** Le dossier d'une fiche par Pokémon, et son barrel généré. */
export const POKEMON_DIR = `${root}app/data/pokemon/`

export const loadPokemon = () => loadData('pokemon/index.ts')
