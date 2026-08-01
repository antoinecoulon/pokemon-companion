/**
 * Générateur des encounters sauvages d'Elite Redux.
 *
 * Source : `src/data/wild_encounters.json` du decomp, 150 maps décrites par
 * méthode (herbes, surf, pêche, Rock Smash, Honey), chacune avec son taux de
 * rencontre et ses fourchettes de niveaux.
 *
 * ## Trois pièges, tous rencontrés à l'exploration
 *
 * 1. **Une table `land_mons` a 12 *slots*, pas 12 espèces.** Compter les
 *    espèces uniques fait passer une table valide pour tronquée — l'erreur a
 *    déjà été commise sur Granite Cave B1F, qui a bien 12 slots pour 7 espèces.
 *    Le garde-fou porte donc sur `mons.length`.
 *
 * 2. **`hidden_mons` ne se publie pas.** Cette table est à taux 0, donc
 *    inutilisée, et contient des valeurs manifestement de test
 *    (Dialga/Palkia/Giratina niveau 5 sur la Route 116). La publier serait de
 *    la désinformation.
 *
 * 3. **Les formes régionales partagent le nom de base.**
 *    `SPECIES_MEOWTH_GALARIAN` rend « Meowth » dans `species_names.h`, tout
 *    comme `SPECIES_MEOWTH`. Le suffixe du constant est donc ajouté au nom, et
 *    un contrôle final refuse deux constants distincts qui rendraient le même
 *    libellé : c'est exactement le cas où le joueur lirait « Meowth » et
 *    chercherait la mauvaise espèce.
 */
import { SOURCES, expectAtLeast, expectCount, fetchSource, quote, slugify } from './elite-redux.mjs'

/** 150 headers dans `gWildMonHeaders`, relevés le 2026-08-01. */
const MAP_COUNT = 150

/** Toute table terrestre du jeu a douze slots. C'est l'invariant de structure. */
const LAND_SLOTS = 12

/**
 * Méthodes publiées, dans l'ordre d'affichage.
 *
 * `hidden_mons` est volontairement absente — voir le piège 2 en tête de
 * fichier. L'absence est contrôlée plus bas : si le JSON gagnait une méthode,
 * le générateur doit le signaler plutôt que l'ignorer.
 */
const METHODS = [
  { field: 'land_mons', id: 'land' },
  { field: 'water_mons', id: 'water' },
  { field: 'fishing_mons', id: 'fishing' },
  { field: 'rock_smash_mons', id: 'rock-smash' },
  { field: 'honey_mons', id: 'honey' },
]

const KNOWN_FIELDS = new Set([...METHODS.map(m => m.field), 'hidden_mons', 'map', 'base_label'])

/**
 * Suffixes de forme reconnus, avec le libellé accolé au nom d'espèce.
 *
 * Liste fermée à dessein : un suffixe inconnu ne doit pas produire un libellé
 * approximatif, il doit faire échouer le générateur. Voir `nameOf`.
 */
const FORM_LABELS = {
  ALOLAN: 'Alolan',
  GALARIAN: 'Galarian',
  HISUIAN: 'Hisuian',
  PALDEAN: 'Paldean',
  PALDEAN_AQUA_BREED: 'Paldean Aqua',
  PALDEAN_BLAZE_BREED: 'Paldean Blaze',
  PALDEAN_COMBAT_BREED: 'Paldean Combat',
  REDUX: 'Redux',
  SUPER: 'Super',
  LARGE: 'Large',
  SMALL: 'Small',
  EAST_SEA: 'East Sea',
  BLUE_FLOWER: 'Blue Flower',
  WHITE_FLOWER: 'White Flower',
  POKE_BALL: 'Poké Ball',
  CORNERSTONE_MASK: 'Cornerstone Mask',
  HEARTHFLAME_MASK: 'Hearthflame Mask',
  WELLSPRING_MASK: 'Wellspring Mask',
}

/**
 * Libellés de map qui ne se déduisent pas de leur constant.
 *
 * Tout le reste passe par la mise en forme automatique plus bas — ces cas-là
 * sont ceux où elle produirait un nom que le jeu n'écrit pas ainsi.
 */
const MAP_LABELS = {
  MAP_GRANITE_CAVE_STEVENS_ROOM: 'Granite Cave — Steven’s Room',
  MAP_METEOR_FALLS_STEVENS_CAVE: 'Meteor Falls — Steven’s Cave',
  MAP_SCORCHED_SLAB_HEATRANS_ROOM: 'Scorched Slab — Heatran’s Room',
  MAP_CAVE_OF_ORIGIN_DIANCIES_ROOM: 'Cave of Origin — Diancie’s Room',
  MAP_NEW_MAUVILLE_INSIDE: 'New Mauville — Inside',
  MAP_NEW_MAUVILLE_ENTRANCE: 'New Mauville — Entrance',
  MAP_ABANDONED_SHIP_ROOMS_B1F: 'Abandoned Ship — Rooms B1F',
  MAP_ABANDONED_SHIP_HIDDEN_FLOOR_CORRIDORS: 'Abandoned Ship — Hidden Floor Corridors',
  MAP_ROUTE111_RUINS_EXTERIOR: 'Route 111 — Ruins Exterior',
  MAP_DESERT_UNDERPASS: 'Desert Underpass',
  MAP_SECRET_DUNGEON: 'Secret Dungeon',
}

/** Jetons qui restent en majuscules : étages et salles. */
const isFloorToken = token => /^(B?\d+F|\d+R|1F|B1F)$/i.test(token)

/** Mots outils qui restent en minuscules dans un titre. */
const LOWERCASE = new Set(['of', 'the'])

function labelOfMap(constant) {
  if (MAP_LABELS[constant]) return MAP_LABELS[constant]

  return constant
    .replace(/^MAP_/, '')
    /*
     * Les numéros sont collés au mot dans les constants : ROUTE101, ROOM1,
     * MAP2. Les décoller ici, une fois, évite d'avoir à traiter chaque cas.
     * Les étages (1F, B1F, 2R) ne sont pas concernés : ils n'ont pas de lettre
     * avant le chiffre, et `isFloorToken` les reconnaît plus bas.
     */
    .replace(/([A-Z]{2,})(\d+)/g, '$1 $2')
    .split('_')
    .map((token, index) => {
      if (isFloorToken(token)) return token.toUpperCase()
      // `MT` seul est l'abréviation de Mount, et le jeu l'écrit « Mt. ».
      if (token === 'MT') return 'Mt.'
      const lower = token.toLowerCase()
      if (index > 0 && LOWERCASE.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

/** `species_names.h` → `SPECIES_X` : nom affiché par le jeu. */
function parseSpeciesNames(header) {
  const names = new Map()
  for (const match of header.matchAll(/\[(SPECIES_[A-Z0-9_]+)\]\s*=\s*_\("([^"]*)"\)/g)) {
    names.set(match[1], match[2])
  }
  expectAtLeast('species_names.h', names.size, 1500)
  return names
}

/**
 * Nom d'affichage d'une espèce, forme comprise.
 *
 * Le nom vient de la table du jeu ; le suffixe du constant lui est accolé quand
 * il désigne une forme connue. Un suffixe inconnu **ne s'invente pas** : le
 * constant est rendu tel quel et le contrôle de doublons plus bas décidera s'il
 * est ambigu.
 */
function nameOf(constant, names) {
  const base = names.get(constant)
  if (!base) throw new Error(`espèce absente de species_names.h : ${constant}`)

  for (const [suffix, label] of Object.entries(FORM_LABELS)) {
    if (!constant.endsWith(`_${suffix}`)) continue
    // Le suffixe n'en est un que si le constant tronqué est lui-même une espèce.
    const trunk = constant.slice(0, -(suffix.length + 1))
    if (names.has(trunk)) return `${base}-${label}`
  }
  return base
}

export async function generate({ fresh = false } = {}) {
  const [raw, header] = await Promise.all([
    fetchSource('encounters', { fresh }),
    fetchSource('speciesNames', { fresh }),
  ])

  const names = parseSpeciesNames(header)
  const data = JSON.parse(raw)

  const group = data.wild_encounter_groups.find(candidate => candidate.label === 'gWildMonHeaders')
  if (!group) throw new Error('groupe gWildMonHeaders introuvable')
  expectCount('maps', group.encounters.length, MAP_COUNT)

  /* Une méthode nouvelle dans le JSON doit se voir, pas se perdre. */
  for (const encounter of group.encounters) {
    for (const field of Object.keys(encounter)) {
      if (!KNOWN_FIELDS.has(field)) {
        throw new Error(`champ inconnu dans wild_encounters.json : ${field} (map ${encounter.map})`)
      }
    }
  }

  const zones = []
  const seen = new Map()
  let dropped = 0

  for (const encounter of group.encounters) {
    /*
     * `MAP_ALTERING_CAVE` porte neuf tables : la première est celle du jeu, les
     * huit autres sont les variantes vanilla d'Emerald (Mareep, Pineco,
     * Houndour…), inaccessibles sans l'événement Mystery Gift. Elles partagent
     * le même constant de map, donc la même zone : on garde la première et on
     * signale les autres plutôt que de les publier comme des lieux distincts.
     */
    if (seen.has(encounter.map)) {
      seen.get(encounter.map).variants += 1
      dropped += 1
      continue
    }

    const methods = []
    for (const { field, id } of METHODS) {
      const table = encounter[field]
      if (!table?.mons?.length) continue

      if (field === 'land_mons') {
        expectCount(`${encounter.map} · land_mons`, table.mons.length, LAND_SLOTS)
      }

      /*
       * Les slots répètent la même espèce pour lui donner du poids. Le lecteur
       * veut la liste des espèces et leur fourchette, pas douze lignes
       * identiques : on regroupe par espèce en fusionnant les bornes, et on
       * garde le nombre de slots, qui *est* la fréquence.
       */
      const bySpecies = new Map()
      for (const mon of table.mons) {
        const label = nameOf(mon.species, names)
        const entry = bySpecies.get(label)
        if (entry) {
          entry.slots += 1
          entry.min = Math.min(entry.min, mon.min_level)
          entry.max = Math.max(entry.max, mon.max_level)
        }
        else {
          bySpecies.set(label, {
            species: label,
            constant: mon.species,
            slots: 1,
            min: mon.min_level,
            max: mon.max_level,
          })
        }
      }

      methods.push({
        method: id,
        rate: table.encounter_rate ?? 0,
        slots: [...bySpecies.values()].sort((a, b) => b.slots - a.slots || a.species.localeCompare(b.species)),
      })
    }

    if (!methods.length) continue

    const zone = {
      id: slugify(encounter.map.replace(/^MAP_/, '')),
      label: labelOfMap(encounter.map),
      methods,
      variants: 0,
      /*
       * Le constant se déclare lui-même inutilisé (reliquats de Ruby/Saphir).
       * La table existe pourtant, et Elite Redux a pu la reprendre : on ne
       * masque pas la zone, on dit ce qu'on sait — et ce qu'on ignore.
       */
      unused: encounter.map.includes('_UNUSED_'),
    }
    zones.push(zone)
    seen.set(encounter.map, zone)
  }

  expectCount('variantes de map écartées', dropped, 8)
  expectCount('zones publiées', zones.length, MAP_COUNT - dropped)

  /*
   * Deux constants distincts qui rendraient le même libellé rendraient la
   * référence trompeuse : le joueur lirait « Meowth » sans savoir laquelle des
   * deux formes il cherche. C'est le contrôle qui rattrape un suffixe de forme
   * non déclaré dans `FORM_LABELS`.
   */
  const byLabel = new Map()
  for (const zone of zones) {
    for (const method of zone.methods) {
      for (const slot of method.slots) {
        const known = byLabel.get(slot.species)
        if (known && known !== slot.constant) {
          throw new Error(
            `libellé ambigu « ${slot.species} » : ${known} et ${slot.constant}.\n`
            + '  Ajouter le suffixe de forme manquant à FORM_LABELS.',
          )
        }
        byLabel.set(slot.species, slot.constant)
      }
    }
  }

  const uniqueIds = new Set(zones.map(zone => zone.id))
  expectCount('ids de zone uniques', uniqueIds.size, zones.length)

  return render(zones, byLabel.size)
}

function render(zones, speciesCount) {
  const body = zones.map((zone) => {
    const lines = [
      '  {',
      `    id: ${quote(zone.id)},`,
      `    label: ${quote(zone.label)},`,
    ]
    const notes = []
    if (zone.variants) {
      notes.push(
        `${zone.variants} autres tables existent pour cette map — les variantes vanilla d’Emerald (Mareep, Pineco, Houndour…), inaccessibles sans l’événement Mystery Gift.`,
      )
    }
    if (zone.unused) {
      notes.push('Map marquée « unused » dans le code — reliquat de Ruby/Saphir. La table existe, son accessibilité réelle reste à vérifier en jeu.')
    }
    if (notes.length) lines.push(`    note: ${quote(notes.join(' '))},`)
    lines.push('    methods: [')
    for (const method of zone.methods) {
      lines.push(`      { method: ${quote(method.method)}, rate: ${method.rate}, slots: [`)
      for (const slot of method.slots) {
        lines.push(
          `        { species: ${quote(slot.species)}, slots: ${slot.slots}, min: ${slot.min}, max: ${slot.max} },`,
        )
      }
      lines.push('      ] },')
    }
    lines.push('    ],', '  },')
    return lines.join('\n')
  })

  return `import type { EncounterZone } from '../types'

/**
 * Les ${zones.length} zones de rencontre d'Elite Redux, ${speciesCount} espèces au total.
 *
 * **Fichier généré — \`pnpm gen:elite encounters\`.** Ne pas éditer à la main :
 * une donnée fausse se corrige dans \`scripts/lib/gen-encounters.mjs\`, jamais ici.
 *
 * Source : \`src/data/wild_encounters.json\` du decomp, noms d'espèces résolus
 * depuis \`src/data/text/species_names.h\`.
 * ${SOURCES.encounters.human}
 *
 * \`slots\` est le nombre d'emplacements qu'occupe l'espèce dans la table — c'est
 * sa fréquence relative. Une table terrestre en compte toujours douze, et une
 * espèce qui en occupe six apparaît donc une fois sur deux. \`rate\` est le taux
 * de déclenchement de la méthode elle-même.
 *
 * Ce que ce fichier **ne contient pas**, à dessein : les tables \`hidden_mons\`,
 * à taux 0 donc inutilisées, et remplies de données de test
 * (Dialga/Palkia/Giratina niveau 5 sur la Route 116). Les publier serait de la
 * désinformation.
 *
 * Aucun id d'ici n'est persisté : ce sont des données de consultation, pas des
 * cases à cocher. Une régénération est donc sans conséquence sur une sauvegarde.
 */
export const encounters: EncounterZone[] = [
${body.join('\n')}
] satisfies EncounterZone[]
`
}
