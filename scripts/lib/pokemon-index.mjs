/**
 * Réécriture du barrel `app/data/unbound/pokemon/index.ts`.
 *
 * Une fiche vit dans son propre module ; le barrel les assemble avec une liste
 * d'imports explicite — pas un glob : le typage et l'ordre de bundling doivent
 * rester déterministes.
 *
 * L'ordre du tableau est l'ordre éditorial du guide, et il n'est PAS
 * recalculable : rien dans une fiche ne dit que Dusknoir vient avant Zeraora.
 * On relit donc l'ordre actuel du fichier et on le conserve, en n'ajoutant que
 * les slugs nouvellement apparus sur le disque et en retirant ceux dont le
 * module a disparu.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { POKEMON_DIR } from './data.mjs'

const INDEX = `${POKEMON_DIR}index.ts`
const BEGIN = '  /* ordre éditorial — début de la liste générée */'
const END = '  /* fin de la liste générée */'

/** `motisma-lavage` → `motismaLavage` : un slug n'est pas un identifiant. */
export function identifierFor(slug) {
  return slug.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())
}

/** Les slugs présents sur le disque, dans l'ordre alphabétique. */
export async function slugsOnDisk() {
  const files = await readdir(POKEMON_DIR)
  return files
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.slice(0, -3))
    .sort()
}

/** L'ordre éditorial actuellement inscrit dans le barrel. */
async function currentOrder(source) {
  const start = source.indexOf(BEGIN)
  const end = source.indexOf(END)
  if (start < 0 || end < 0) {
    throw new Error(`${INDEX} : marqueurs de liste générée introuvables — restaure-les avant de régénérer`)
  }
  const identifiers = source
    .slice(start + BEGIN.length, end)
    .split('\n')
    .map(line => line.trim().replace(/,$/, ''))
    .filter(Boolean)
  return { identifiers, start, end }
}

/**
 * Régénère le barrel à partir des modules présents.
 *
 * `after` place un slug fraîchement ajouté juste derrière un slug existant, pour
 * qu'une nouvelle fiche d'équipe n'atterrisse pas derrière les utilitaires.
 * Sans lui, les nouveaux slugs sont ajoutés à la fin.
 */
export async function regenerateIndex({ after } = {}) {
  const source = await readFile(INDEX, 'utf8')
  const { identifiers, start, end } = await currentOrder(source)
  const disk = await slugsOnDisk()

  const byIdentifier = new Map(disk.map(slug => [identifierFor(slug), slug]))
  const kept = identifiers.filter(identifier => byIdentifier.has(identifier))
  const known = new Set(kept)
  const added = disk.map(identifierFor).filter(identifier => !known.has(identifier))

  const order = [...kept]
  for (const identifier of added) {
    const anchor = after?.[byIdentifier.get(identifier)]
    const at = anchor ? order.indexOf(identifierFor(anchor)) : -1
    if (at >= 0) order.splice(at + 1, 0, identifier)
    else order.push(identifier)
  }

  const imports = [...byIdentifier.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([identifier, slug]) => `import ${identifier} from './${slug}'`)
    .join('\n')

  const head = source.slice(0, start)
    .replace(/^import [\s\S]*?\n\n/, `import type { PokemonSheet } from '../types'\n${imports}\n\n`)

  const list = order.map(identifier => `  ${identifier},`).join('\n')

  await writeFile(INDEX, `${head}${BEGIN}\n${list}\n${source.slice(end)}`)

  return {
    order: order.map(identifier => byIdentifier.get(identifier)),
    added: added.map(identifier => byIdentifier.get(identifier)),
    removed: identifiers.filter(identifier => !byIdentifier.has(identifier)),
  }
}
