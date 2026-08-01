/**
 * Générateur de la liste des talents d'Elite Redux.
 *
 * Source : `AbilityList.textproto` de `er-config`, un protobuf textuel très
 * régulier — un bloc `ability { … }` par entrée, avec `id`, `name`,
 * `description` et souvent `expanded_description`.
 *
 * ## Pourquoi embarquer ça plutôt que pointer vers le codex
 *
 * C'est **la** mécanique du jeu : chaque Pokémon porte jusqu'à quatre talents à
 * la fois, et *toutes* les descriptions ont été réécrites. Connaître un talent
 * par son nom ne sert donc à rien — `Battle Armor` ne fait pas ce qu'il fait
 * ailleurs. Or `codex.elite-redux.com` est une SPA VitePress : illisible en
 * ligne de commande, et surtout indisponible hors connexion, alors que le
 * companion est précisément une PWA hors-ligne consultée en jouant.
 *
 * ## Les pièges du fichier
 *
 * - **Des emplacements vides** portent `name: "-------"` (`ABILITY_NONE` et les
 *   trous de l'énumération). Ils sont filtrés, et le compte des entrées réelles
 *   est contrôlé.
 * - **Les chaînes sont échappées en octal** (`Pok\303\251mon` pour « Pokémon ») :
 *   c'est de l'UTF-8 encodé octet par octet, il faut le décoder comme tel et
 *   non caractère par caractère.
 */
import { Buffer } from 'node:buffer'
import { SOURCES, expectAtLeast, expectCount, fetchSource, quote } from './elite-redux.mjs'

/** 1 044 blocs dans le fichier, relevés le 2026-08-01. */
const BLOCK_COUNT = 1044

/** Emplacement vide de l'énumération : un nom fait de tirets. */
const isPlaceholder = name => /^-*$/.test(name)

/**
 * Décode les échappements d'un littéral protobuf textuel.
 *
 * Les séquences `\303\251` sont les **octets** d'un caractère UTF-8, pas des
 * points de code : décoder chaque `\ooo` en `String.fromCharCode` donnerait
 * « PokÃ©mon ». On reconstruit donc la suite d'octets avant de la lire en UTF-8.
 */
function decodeProtoString(raw) {
  const bytes = []
  for (let i = 0; i < raw.length; i += 1) {
    if (raw[i] !== '\\') {
      bytes.push(...Buffer.from(raw[i], 'utf8'))
      continue
    }
    const next = raw[i + 1]
    const octal = /^[0-7]{3}/.exec(raw.slice(i + 1, i + 4))
    if (octal) {
      bytes.push(Number.parseInt(octal[0], 8))
      i += 3
      continue
    }
    const simple = { n: '\n', t: '\t', r: '\r', '"': '"', '\\': '\\', '\'': '\'' }[next]
    bytes.push(...Buffer.from(simple ?? next, 'utf8'))
    i += 1
  }
  return Buffer.from(bytes).toString('utf8')
}

/** Valeur d'un champ scalaire du bloc, décodée. */
function fieldOf(block, name) {
  const match = new RegExp(`^\\s*${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'm').exec(block)
  return match ? decodeProtoString(match[1]).trim() : ''
}

export async function generate({ fresh = false } = {}) {
  const raw = await fetchSource('abilities', { fresh })

  /*
   * Un bloc va d'un `ability {` en début de ligne au suivant. Le fichier n'est
   * pas indenté à l'intérieur des blocs de premier niveau, ce qui rend ce
   * découpage sûr — mais l'ancrage `^` reste nécessaire : `expanded_description`
   * contient des mentions littérales d'autres abilities.
   *
   * L'espace final toléré n'est pas de la coquetterie : un bloc sur 1 044 s'écrit
   * `ability { ` et un ancrage strict le manquait, ce que le contrôle de compte
   * a rattrapé.
   */
  const blocks = raw.split(/^ability \{[ \t]*$/m).slice(1)
  expectCount('blocs ability', blocks.length, BLOCK_COUNT)

  const abilities = []
  const seen = new Set()

  for (const block of blocks) {
    const name = fieldOf(block, 'name')
    if (!name || isPlaceholder(name)) continue

    const idMatch = /^\s*id:\s*(ABILITY_[A-Z0-9_]+)/m.exec(block)
    if (!idMatch) throw new Error(`bloc ability sans id : ${name}`)
    const id = idMatch[1]

    const description = fieldOf(block, 'description')
    if (!description) throw new Error(`ability sans description : ${id}`)

    /*
     * Deux entrées peuvent partager un nom (variantes internes). On garde la
     * première : la liste est un index de lecture, pas un inventaire.
     */
    if (seen.has(name)) continue
    seen.add(name)

    const expanded = fieldOf(block, 'expanded_description')
    abilities.push({
      id,
      name,
      description,
      expanded: expanded && expanded !== description ? expanded : '',
    })
  }

  /*
   * Le wiki du jeu annonce « plus de 370 abilities ». Le fichier en contient
   * davantage — l'énumération inclut des talents non encore attribués. La borne
   * basse est calée sur ce chiffre public : passer en dessous voudrait dire que
   * le filtre des emplacements vides mord sur des entrées réelles.
   */
  expectAtLeast('abilities retenues', abilities.length, 370)

  abilities.sort((a, b) => a.name.localeCompare(b.name))
  return render(abilities, blocks.length)
}

function render(abilities, blockCount) {
  const body = abilities.map((ability) => {
    const lines = [
      '  {',
      `    id: ${quote(ability.id)},`,
      `    name: ${quote(ability.name)},`,
      `    description: ${quote(ability.description)},`,
    ]
    if (ability.expanded) lines.push(`    expanded: ${quote(ability.expanded)},`)
    lines.push('  },')
    return lines.join('\n')
  })

  return `import type { AbilityEntry } from '../types'

/**
 * Les ${abilities.length} talents d'Elite Redux, par ordre alphabétique.
 *
 * **Fichier généré — \`pnpm gen:elite abilities\`.** Ne pas éditer à la main :
 * une donnée fausse se corrige dans \`scripts/lib/gen-abilities.mjs\`, jamais ici.
 *
 * Source : \`AbilityList.textproto\` de \`er-config\` (${blockCount} blocs, dont les
 * emplacements vides de l'énumération sont écartés).
 * ${SOURCES.abilities.human}
 *
 * ⚠️ Ce dépôt n'a **aucune branche stable** : la lecture se fait sur
 * \`upcoming\`, la branche de développement. Un écart avec la ROM installée est
 * donc possible, et c'est le jeu qui a raison.
 *
 * \`description\` est le texte court affiché en combat, \`expanded\` le détail des
 * interactions. Les deux comptent : toutes les descriptions ont été réécrites,
 * donc connaître un talent par son nom d'origine induit en erreur — \`Battle
 * Armor\` retire 20 % des dégâts en plus de bloquer les critiques.
 *
 * Aucun id d'ici n'est persisté : ce sont des données de consultation, pas des
 * cases à cocher. Une régénération est donc sans conséquence sur une sauvegarde.
 */
export const abilities: AbilityEntry[] = [
${body.join('\n')}
] satisfies AbilityEntry[]
`
}
