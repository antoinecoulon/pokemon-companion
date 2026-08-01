/**
 * Tests du contrat de fiche : validateur et imprimeur TypeScript.
 *
 * L'aller-retour sur les 12 fiches existantes est le test central. Il prouve
 * deux choses d'un coup : que le validateur accepte le contenu réel (sinon il
 * refuserait aussi une fiche correcte venue de l'IA), et que l'imprimeur ne perd
 * ni ne déforme rien — une fiche réécrite doit rendre exactement les mêmes
 * données, sinon `pnpm import:pokemon` corromprait silencieusement du contenu.
 *
 * Usage : pnpm test:fiche
 */
import { POKEMON_DIR, loadApp, loadUnbound, loadPokemon } from './lib/data.mjs'
import { printFiche, validateFiche } from './lib/fiche.mjs'
import { writeFile, unlink } from 'node:fs/promises'

const { pokemon } = await loadPokemon()
const { phases } = await loadUnbound('phases.ts')
const phaseTaskIds = phases.flatMap(phase => phase.tasks.map(task => task.id))
const failures = []

function check(label, actual, expected) {
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) failures.push(`${label} — attendu ${b}, obtenu ${a}`)
}

/**
 * Comparaison insensible à l'ordre des clés.
 *
 * L'imprimeur réordonne volontairement les champs selon `SHEET_FIELDS` : c'est
 * ce qui rend deux fiches importées à six mois d'écart lisibles pareil. Un
 * `JSON.stringify` brut signalerait donc ce reclassement comme une perte.
 */
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
  }
  return value
}

/** Rapporte le premier champ qui diffère, plutôt que deux fiches entières. */
function checkSame(label, actual, expected) {
  const a = canonical(actual)
  const b = canonical(expected)
  if (JSON.stringify(a) === JSON.stringify(b)) return
  const keys = [...new Set([...Object.keys(b ?? {}), ...Object.keys(a ?? {})])]
  const differing = keys.filter(key => JSON.stringify(a?.[key]) !== JSON.stringify(b?.[key]))
  failures.push(
    `${label} — champ(s) altéré(s) : ${differing.join(', ') || '(structure)'}`
    + differing.map(key => `\n      ${key} attendu ${JSON.stringify(b?.[key])?.slice(0, 200)}`
      + `\n      ${' '.repeat(key.length)} obtenu  ${JSON.stringify(a?.[key])?.slice(0, 200)}`).join(''),
  )
}

/* --- 1. Le contenu existant passe le validateur ------------------------- */

/*
 * Chaque fiche est validée contre les ids des *autres* : se valider contre
 * l'ensemble ferait échouer chaque fiche sur ses propres ids de tâche.
 */
for (const mon of pokemon) {
  const others = pokemon.filter(other => other.slug !== mon.slug)
  const report = validateFiche(mon, {
    knownSlugs: new Set(others.map(other => other.slug)),
    knownTaskIds: new Set([
      ...phaseTaskIds,
      ...others.flatMap(other => (other.tasks ?? []).map(task => task.id)),
    ]),
  })
  if (report.errors.length) {
    failures.push(`fiche « ${mon.slug} » refusée par le validateur : ${report.errors.join(' | ')}`)
  }
}

/* --- 2. Aller-retour d'impression --------------------------------------- */

/*
 * On écrit le module imprimé, on le relit par le même chemin que l'app, et on
 * compare les données. Passer par le disque est volontaire : c'est la seule
 * façon de prouver que le TypeScript produit est réellement analysable.
 */
/*
 * Un fichier par fiche, et non un fichier réécrit : jiti met les modules en
 * cache par chemin, et un suffixe de requête ne le contourne pas — toutes les
 * fiches se comparaient à la première. Le nom est préfixé `_` pour rester hors
 * du barrel, et chaque fichier est supprimé aussitôt relu.
 */
for (const mon of pokemon) {
  const name = `_roundtrip-${mon.slug}.ts`
  const scratch = `${POKEMON_DIR}${name}`
  await writeFile(scratch, printFiche(mon))
  try {
    const reread = (await loadApp(`data/unbound/pokemon/${name}`)).default
    checkSame(`aller-retour « ${mon.slug} »`, reread, mon)
  }
  finally {
    await unlink(scratch)
  }
}

/* --- 3. Ce que le validateur doit refuser ------------------------------- */

const base = {
  slug: 'lucario',
  name: 'Lucario',
  status: 'retired',
  role: 'Sweeper mixte',
  types: ['Fighting', 'Steel'],
}

const errorsOf = patch => validateFiche({ ...base, ...patch }).errors

check('une fiche minimale est acceptée', errorsOf({}), [])

check('slug non kebab-case', errorsOf({ slug: 'Lucario' }).length, 1)
check('slug avec accent', errorsOf({ slug: 'motismà' }).length, 1)
check('statut inconnu', errorsOf({ status: 'box' }).length, 1)
check('type mal orthographié', errorsOf({ types: ['Electrik'] }).length, 1)
check('type resté en français', errorsOf({ types: ['Électrik'] }).length, 1)
check('trois types', errorsOf({ types: ['Fire', 'Water', 'Ground'] }).length, 1)
check('champ inventé', errorsOf({ weaknesses: ['Fire'] }).length, 1)
check('rôle manquant', errorsOf({ role: '' }).length, 1)

check('slot sur un non-actif', errorsOf({ slot: 2 }).length, 1)
check('slot hors bornes', errorsOf({ status: 'active', slot: 9, incomplete: true, incompleteNote: 'x' }).length, 1)
check('actif sans build ni incomplete', errorsOf({ status: 'active', slot: 1 }).length, 1)
check('incomplete sans note', errorsOf({ incomplete: true }).length, 1)

check(
  'bst incohérent avec les stats de base',
  errorsOf({ baseStats: { hp: 70, atk: 110, def: 70, spa: 115, spd: 70, spe: 90 }, bst: 999 }).length,
  1,
)
check(
  'stat de base manquante',
  errorsOf({ baseStats: { hp: 70, atk: 110, def: 70, spa: 115, spd: 70 } }).length,
  1, // l'absence de « bst » n'est qu'un avertissement
)
check('talent visé absent des talents', errorsOf({ abilities: [{ name: 'Steadfast' }], targetAbility: 'Justified' }).length, 1)

/* Builds */
const withBuild = build => errorsOf({ builds: [{ id: 'a', name: 'Test', item: 'Life Orb', nature: 'Adamant', evs: { atk: 252, spe: 252, hp: 4 }, moves: ['a', 'b', 'c', 'd'], ...build } ] })

check('build valide', withBuild({}), [])
check('nature inconnue', withBuild({ nature: 'Rigolo' }).length, 1)
check('nature en français', withBuild({ nature: 'Rigide' }).length, 1)
check('trois capacités', withBuild({ moves: ['a', 'b', 'c'] }).length, 1)
check('EV au-delà de 510', withBuild({ evs: { hp: 252, atk: 252, def: 252 } }).length, 1)
check('EV au-delà de 252 sur une stat', withBuild({ evs: { hp: 300 } }).length, 1)
check('stat EV inconnue', withBuild({ evs: { luck: 4 } }).length, 1)

/* Tâches */
const withTask = task => errorsOf({ tasks: [{ id: 'mon-lucario-1', label: 'Choisir le build', ...task }] })

check('tâche valide', withTask({}), [])
check('id de tâche hors convention', withTask({ id: 'lucario-1' }).length, 1)
check('id de tâche d’un autre slug', withTask({ id: 'mon-tyranitar-99' }).length, 1)
check('libellé vide', withTask({ label: '' }).length, 1)
check('requires mort', withTask({ requires: ['phase-9.9'] }).length, 1)
check(
  'requires vers une tâche du contenu existant',
  validateFiche(
    { ...base, tasks: [{ id: 'mon-lucario-1', label: 'x', requires: ['phase-1.4'] }] },
    { knownTaskIds: new Set(['phase-1.4']) },
  ).errors,
  [],
)
check(
  'id de tâche déjà pris ailleurs',
  validateFiche(
    { ...base, tasks: [{ id: 'mon-lucario-1', label: 'x' }] },
    { knownTaskIds: new Set(['mon-lucario-1']) },
  ).errors.length,
  1,
)

/* Blocs de prose */
check('bloc de kind inconnu', errorsOf({ analysis: [{ kind: 'admonition', text: 'x' }] }).length, 1)
check('paragraphe sans texte', errorsOf({ analysis: [{ kind: 'p' }] }).length, 1)
check('ton de citation inconnu', errorsOf({ analysis: [{ kind: 'quote', text: 'x', tone: 'danger' }] }).length, 1)
check(
  'tableau à colonnes incohérentes',
  errorsOf({ analysis: [{ kind: 'table', head: ['a', 'b'], rows: [['1']] }] }).length,
  1,
)
check(
  'tableau valide',
  errorsOf({ analysis: [{ kind: 'table', head: ['a', 'b'], rows: [['1', '2']] }] }),
  [],
)

/* --- Rapport ----------------------------------------------------------- */

if (failures.length) {
  console.error(`\n${failures.length} test(s) en échec :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log(`Contrat de fiche : ${pokemon.length} fiches en aller-retour, 34 assertions, tout passe.`)
