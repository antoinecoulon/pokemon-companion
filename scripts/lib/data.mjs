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

/**
 * Le contenu Unbound vit sous `app/data/unbound/` depuis que l'app est
 * multi-jeux ; seuls `types.ts` et `natures.ts` restent partagés à la racine.
 *
 * Les scripts d'écriture (`import:pokemon`, `rm:pokemon`, `scrape:wiki`,
 * `new:*`) sont **spécifiques à Unbound** — ils visent unboundwiki et les
 * conventions de son guide. Leur donner un argument `--game` serait de
 * l'abstraction prématurée : un second jeu qui aurait besoin d'un générateur
 * aura ses propres sources, donc son propre script.
 */
export const UNBOUND_DIR = `${root}app/data/unbound/`

/** Importe un module de contenu Unbound, chemin relatif à `app/data/unbound/`. */
export function loadUnbound(module) {
  return loadData(`unbound/${module}`)
}

/** Le dossier d'une fiche par Pokémon, et son barrel généré. */
export const POKEMON_DIR = `${UNBOUND_DIR}pokemon/`

export const loadPokemon = () => loadUnbound('pokemon/index.ts')
