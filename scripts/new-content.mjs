/**
 * Imprime le squelette d'une entrée de contenu, avec la bonne convention d'id.
 *
 * Le contenu est du TypeScript, pas un CMS : ajouter une entrée veut dire coller
 * un objet dans le bon fichier. Ce script évite de retrouver la convention d'id à
 * chaque fois — et un id mal formé est ce qui casse une sauvegarde.
 *
 * Il n'écrit rien : il affiche, on relit, on colle. Seule exception, les fiches
 * Pokémon : leur squelette est du JSON, que `pnpm import:pokemon` valide et écrit
 * — elles sont trop grosses pour être collées à la main sans erreur.
 *
 * Usage :
 *   pnpm new:pokemon Lucario
 *   pnpm new:npc "Move Tutor de Dehara"
 *   pnpm new:task phase-2          # tâche dans une phase existante
 *   pnpm new:goal portails "Regirock"
 */
import { loadUnbound, loadPokemon } from './lib/data.mjs'

const [kind, ...args] = process.argv.slice(2)

/** Erreur d'usage : message seul, pas de trace de pile. */
function fail(message) {
  console.error(`✖ ${message}`)
  process.exit(1)
}

/**
 * kebab-case ASCII : les ids servent de clé de sauvegarde.
 *
 * L'ordre compte. Les ligatures (œ, æ) doivent être remplacées explicitement —
 * `normalize('NFD')` ne les décompose pas, elles seraient donc simplement
 * supprimées : `Œuf` deviendrait `uf`. Et il faut passer en minuscules avant,
 * sinon seule la forme minuscule est traitée.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function block(title, file, body) {
  console.log(`\n${title}`)
  console.log(`  → à coller dans ${file}\n`)
  console.log(body)
}

switch (kind) {
  case 'pokemon': {
    const [nameArg] = args
    if (!nameArg) fail('usage : pnpm new:pokemon <nom>')
    const slug = slugify(nameArg)

    const { pokemon } = await loadPokemon()
    if (pokemon.some(mon => mon.slug === slug)) {
      fail(`la fiche « ${slug} » existe déjà`)
    }
    const activeCount = pokemon.filter(mon => mon.status === 'active').length

    /*
     * Un squelette JSON et non TypeScript : une fiche s'intègre désormais par
     * `pnpm import:pokemon`, qui la valide et l'écrit. Le slot est volontairement
     * absent — c'est l'import qui prend la première place libre, alors que
     * l'ancien squelette proposait joyeusement un septième slot.
     */
    block(
      `Fiche Pokémon « ${nameArg} »`,
      `un fichier .json, puis : pnpm import:pokemon <fichier>`,
      JSON.stringify({
        slug,
        name: nameArg,
        status: 'retired',
        role: '',
        types: [],
        incomplete: true,
        incompleteNote: 'Aucune fiche dans le guide source.',
        tasks: [
          { id: `mon-${slug}-1`, label: '' },
          { id: `mon-${slug}-2`, label: '' },
        ],
      }, null, 2),
    )
    console.log('\nLe contrat complet — champs, blocs de prose, builds, tâches — est dans')
    console.log('docs/fiche-pokemon.md, écrit pour être collé dans un prompt.')
    console.log(`\n« status » est mis à "retired" par défaut : l'équipe compte ${activeCount} membre(s)`)
    console.log('actif(s), et un échange se fait dans l’app (/equipe → Modifier), pas dans le contenu.')
    break
  }

  case 'npc': {
    const [service] = args
    if (!service) fail('usage : pnpm new:npc "<service>"')
    const id = slugify(service)

    const { npcs } = await loadUnbound('npcs.ts')
    if (npcs.some(npc => npc.id === id)) fail(`le PNJ « ${id} » existe déjà`)

    block(`PNJ « ${service} »`, 'app/data/unbound/npcs.ts', `  {
    id: '${id}',
    service: '${service}',
    location: '',
    cost: '',
    priority: 3, // 1 à 5 ; ★5 = à faire en tout premier
  },`)
    console.log(`\nClé de sauvegarde : npc:${id} — ne la renomme plus une fois cochée.`)
    break
  }

  case 'task': {
    const [phaseId] = args
    if (!phaseId) fail('usage : pnpm new:task <phase-id>  (ex. phase-2)')

    const { phases } = await loadUnbound('phases.ts')
    const phase = phases.find(item => item.id === phaseId)
    if (!phase) {
      fail(`phase « ${phaseId} » inconnue. Disponibles : ${phases.map(p => p.id).join(', ')}`)
    }

    const used = phase.tasks
      .map(task => Number(task.id.split('.')[1]))
      .filter(Number.isFinite)
    const next = Math.max(0, ...used) + 1

    block(`Tâche dans « ${phase.title} »`, 'app/data/unbound/phases.ts', `      {
        id: '${phaseId}.${next}',
        label: '',
        // requires: ['phase-1.4'], // prérequis explicites du guide uniquement
        // details: [],
        // ref: '§',
      },`)
    console.log('\nRappel : n\'encode un `requires` que si le guide l\'énonce — une')
    console.log('dépendance inventée bloque une tâche pour de bon dans le moteur.')
    break
  }

  case 'goal': {
    const [sectionId, label] = args
    if (!sectionId || !label) fail('usage : pnpm new:goal "<section-id>" "<libellé>"')
    const id = slugify(label)

    const { completionSections } = await loadUnbound('completion.ts')
    const section = completionSections.find(item => item.id === sectionId)
    if (!section) {
      fail(`section « ${sectionId} » inconnue. Disponibles : ${completionSections.map(s => s.id).join(', ')}`)
    }

    /*
     * L'unicité se vérifie sur TOUTES les sections, pas seulement la cible : la
     * clé persistée est `goal:<id>` sans mention de section, deux objectifs
     * homonymes dans deux sections différentes ne feraient qu'une case.
     */
    const taken = completionSections.flatMap(item => item.goals).some(goal => goal.id === id)
    if (taken) fail(`l'objectif « ${id} » existe déjà`)

    block(`Objectif « ${label} » dans « ${section.title} »`, 'app/data/unbound/completion.ts', `      {
        id: '${id}',
        label: '${label}',
        // location: '',
        // details: [],
        source: '', // '§9.1' pour le guide, sinon l'URL consultée
      },`)
    console.log(`\nClé de sauvegarde : goal:${id} — ne la renomme plus une fois cochée.`)
    console.log('\n« source » est obligatoire, et ce n\'est pas une formalité : hors du guide,')
    console.log('rien ne s\'écrit ici qui n\'ait été lu sur unboundwiki.com ou romhackdex.net.')
    break
  }

  default:
    console.error(`Type inconnu : « ${kind ?? '(aucun)'} »\n`)
    console.error('  pnpm new:pokemon <nom>')
    console.error('  pnpm new:npc "<service>"')
    console.error('  pnpm new:task <phase-id>')
    console.error('  pnpm new:goal "<section-id>" "<libellé>"')
    console.error('')
    console.error('Missions, tutors, collectibles et objets clés ne s\'écrivent pas ici :')
    console.error('ils sont générés — pnpm scrape:wiki <missions|collectibles|tutors|items|all>')
    process.exit(1)
}

// Une fiche Pokémon ne se colle pas : `import:pokemon` imprime ses propres suites.
if (kind !== 'pokemon') console.log('\nAprès collage : pnpm check')
