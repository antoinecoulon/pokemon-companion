/**
 * Talents d'Emerald Seaglass, agrégés depuis les fiches d'espèces.
 *
 * Ce jeu n'a **pas** de page d'index des talents : la seule façon de les
 * énumérer est de parcourir les 447 fiches et de dédupliquer. Le cache de
 * `fetchPage` est partagé avec le générateur du Pokédex, donc lancer
 * `pnpm gen:seaglass all` ne télécharge chaque page qu'une fois.
 *
 * Remplit `AbilityEntry` **sans le modifier** : l'UI de recherche des talents
 * existe déjà pour Elite Redux et se réutilise telle quelle.
 *
 * ## Le piège : la source se contredit, et il faut choisir
 *
 * Un même talent apparaît sur des dizaines de fiches, et **13 d'entre eux y ont
 * deux descriptions différentes**. Ce n'était pas, comme on l'a d'abord supposé,
 * le signe d'un parseur qui décale une cellule : la source mélange deux
 * rédactions, l'une reprise du jeu officiel (« This Pokemon's Speed is raised
 * 1 stage at the end of each full turn on the field. »), l'autre réécrite par le
 * hack (« Increase Speed by 1 stage at the end of each turn »). Le cas le plus net
 * est `Run Away`, dont une fiche sur dix-huit dit seulement « No competitive
 * use. ».
 *
 * **La majorité l'emporte.** C'est la règle la plus défendable : elle prend ce que
 * la source dit le plus constamment, et elle corrige au passage les coquilles
 * isolées (`Athletic` est donné « 66?% » sur une fiche, « 66% » sur trois).
 *
 * Prendre la description **la plus longue** aurait été tentant et faux : sur
 * `Keen Eye`, la formulation du jeu officiel est la plus longue des deux, et c'est
 * précisément celle qu'on ne veut pas — l'app affiche ce que l'écran affiche.
 *
 * À égalité stricte, on écarte la formulation du jeu officiel, reconnaissable à
 * son « This Pokemon… ». C'est le cas de `Rain Dish`, à six contre six.
 *
 * Le garde-fou n'est donc pas « aucune divergence » mais **leur nombre**, épinglé
 * ci-dessous : s'il bouge, la source a changé et il faut aller regarder.
 */
import { expectCount, header, quote, slugify, SOURCES, fetchPage } from './seaglass.mjs'
import { readIndexEntries, readSpeciesAbilities } from './gen-seaglass-pokedex.mjs'

/**
 * Talents distincts sur l'ensemble des fiches.
 *
 * Compte **vérifié indépendamment du parseur**, en dénombrant les `td.thh3` des
 * 447 pages en cache. À ne pas ajuster sans refaire cette vérification : il ne
 * bouge que si le hack ajoute ou retire un talent.
 */
const ABILITY_COUNT = 195

/** Talents dont la source donne deux rédactions. Voir l'en-tête du module. */
const DIVERGENT_COUNT = 13

/** La formulation reprise du jeu officiel, qu'on écarte à égalité de voix. */
const isVanillaPhrasing = description => /^This Pokemon/i.test(description)

/**
 * La description qui l'emporte : la plus fréquente, et à égalité celle qui n'est
 * pas la formulation du jeu officiel.
 */
function winner(counts) {
  return [...counts.entries()]
    .sort((a, b) =>
      b[1] - a[1]
      || Number(isVanillaPhrasing(a[0])) - Number(isVanillaPhrasing(b[0]))
      || a[0].localeCompare(b[0]),
    )[0][0]
}

export async function generate({ fresh = false } = {}) {
  const index = await readIndexEntries({ fresh })

  /** name → (description → nombre de fiches qui la donnent) */
  const byName = new Map()

  for (const entry of index) {
    const html = await fetchPage(`/pokedex/${entry.slug}/`, { fresh })
    for (const ability of readSpeciesAbilities(html, entry)) {
      if (!byName.has(ability.name)) byName.set(ability.name, new Map())
      const counts = byName.get(ability.name)
      counts.set(ability.description, (counts.get(ability.description) ?? 0) + 1)
    }
  }

  const divergent = [...byName.values()].filter(counts => counts.size > 1).length

  const abilities = [...byName.entries()]
    .map(([name, counts]) => ({ name, description: winner(counts) }))
    .sort((a, b) => a.name.localeCompare(b.name))

  expectCount('Talents', abilities.length, ABILITY_COUNT)
  expectCount('Talents à descriptions divergentes', divergent, DIVERGENT_COUNT)

  for (const ability of abilities) {
    if (!ability.description) throw new Error(`le talent « ${ability.name} » n'a pas de description`)
  }

  const lines = abilities.map(ability =>
    `  { id: ${quote(slugify(ability.name))}, name: ${quote(ability.name)}, description: ${quote(ability.description)} },`,
  )

  return header(
    'Talents d\'Emerald Seaglass, avec la description que l\'écran affiche.',
    SOURCES.pokedex,
    `${abilities.length} talents distincts, agrégés depuis les ${index.length} fiches d'espèces`
    + ` · ${divergent} dont la source donne deux rédactions, tranchées à la majorité`,
  )
    + '\nimport type { AbilityEntry } from \'../types\'\n\n'
    + 'export const abilities: AbilityEntry[] = [\n'
    + `${lines.join('\n')}\n`
    + ']\n'
}
