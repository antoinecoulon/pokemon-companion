/**
 * Imprime le squelette d'une entrée de contenu, avec la bonne convention d'id.
 *
 * Le contenu est du TypeScript, pas un CMS : ajouter une entrée veut dire coller
 * un objet dans le bon fichier. Ce script évite de retrouver la convention d'id à
 * chaque fois — et un id mal formé est ce qui casse une sauvegarde.
 *
 * Il n'écrit rien : il affiche, on relit, on colle.
 *
 * Usage :
 *   pnpm new:pokemon lucario
 *   pnpm new:npc "Move Tutor de Dehara"
 *   pnpm new:quest "#042" "Chasse aux Ronflex"
 *   pnpm new:task phase-2          # tâche dans une phase existante
 */
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, { alias: { '~': new URL('../app', import.meta.url).pathname } })

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

    const { pokemon } = await jiti.import('../app/data/pokemon.ts')
    if (pokemon.some(mon => mon.slug === slug)) {
      fail(`la fiche « ${slug} » existe déjà`)
    }
    const nextSlot = Math.max(0, ...pokemon.filter(m => m.status === 'active').map(m => m.slot ?? 0)) + 1

    block(`Fiche Pokémon « ${nameArg} »`, 'app/data/pokemon.ts', `  {
    slug: '${slug}',
    name: '${nameArg}',
    nameEn: '', // nom anglais — sert aussi à retrouver le sprite
    sprite: '', // slug pokemondb, puis : pnpm sprites
    slot: ${nextSlot}, // à retirer si le Pokémon n'est pas dans les 6 actifs
    status: 'active', // 'active' | 'retired' | 'utility'
    role: '',
    types: [],
    // Tant que le guide ne documente pas de build, garder ces deux lignes
    // plutôt que d'inventer des données compétitives :
    incomplete: true,
    incompleteNote: 'Aucune fiche dans le guide source.',
    tasks: [
      { id: 'mon-${slug}-1', label: '' },
      { id: 'mon-${slug}-2', label: '' },
    ],
  },`)
    console.log(`\nRappel : le slot ${nextSlot} suppose que ce Pokémon entre dans la composition finale.`)
    break
  }

  case 'npc': {
    const [service] = args
    if (!service) fail('usage : pnpm new:npc "<service>"')
    const id = slugify(service)

    const { npcs } = await jiti.import('../app/data/npcs.ts')
    if (npcs.some(npc => npc.id === id)) fail(`le PNJ « ${id} » existe déjà`)

    block(`PNJ « ${service} »`, 'app/data/npcs.ts', `  {
    id: '${id}',
    service: '${service}',
    location: '',
    cost: '',
    priority: 3, // 1 à 5 ; ★5 = à faire en tout premier
  },`)
    console.log(`\nClé de sauvegarde : npc:${id} — ne la renomme plus une fois cochée.`)
    break
  }

  case 'quest': {
    const [code, name] = args
    if (!code || !name) fail('usage : pnpm new:quest "<#code>" "<nom>"')
    const id = slugify(name)

    const { quests } = await jiti.import('../app/data/quests.ts')
    if (quests.some(quest => quest.id === id)) fail(`la quête « ${id} » existe déjà`)

    block(`Quête ${code} « ${name} »`, 'app/data/quests.ts', `  {
    id: '${id}',
    code: '${code}',
    name: '${name}',
    location: '',
    reward: '',
    interest: 3, // 1 à 5
  },`)
    console.log(`\nClé de sauvegarde : quest:${id} — ne la renomme plus une fois cochée.`)
    break
  }

  case 'task': {
    const [phaseId] = args
    if (!phaseId) fail('usage : pnpm new:task <phase-id>  (ex. phase-2)')

    const { phases } = await jiti.import('../app/data/phases.ts')
    const phase = phases.find(item => item.id === phaseId)
    if (!phase) {
      fail(`phase « ${phaseId} » inconnue. Disponibles : ${phases.map(p => p.id).join(', ')}`)
    }

    const used = phase.tasks
      .map(task => Number(task.id.split('.')[1]))
      .filter(Number.isFinite)
    const next = Math.max(0, ...used) + 1

    block(`Tâche dans « ${phase.title} »`, 'app/data/phases.ts', `      {
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

  default:
    console.error(`Type inconnu : « ${kind ?? '(aucun)'} »\n`)
    console.error('  pnpm new:pokemon <nom>')
    console.error('  pnpm new:npc "<service>"')
    console.error('  pnpm new:quest "<#code>" "<nom>"')
    console.error('  pnpm new:task <phase-id>')
    process.exit(1)
}

console.log('\nAprès collage : pnpm check')
