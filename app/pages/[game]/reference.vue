<script setup lang="ts">
import type { EncounterMethodId, ReferenceSection } from '~/data/types'
import { natures } from '~/data/natures'
import { STAT_KEYS, STAT_LABELS } from '~/utils/stats'

const { current } = useGame()

/*
 * Contenu facultatif : un jeu qui ne le fournit pas ne met pas non plus cette
 * page dans sa nav. Répondre 404 plutôt que rendre une page vide, pour qu'une
 * URL tapée à la main dise la vérité.
 */
const reference = current.value.content.reference
if (!reference) {
  throw createError({ statusCode: 404, statusMessage: 'Page indisponible pour ce jeu', fatal: true })
}
const { mechanics, tools, glossary } = reference

/*
 * Chapeaux de section : ils vivaient en dur ici et citaient le guide Unbound
 * (« §13.1 — … »), ce qu'un jeu sans guide numéroté ne peut pas porter. Le repli
 * n'est pas décoratif — une chaîne vide masque la description côté SectionBlock.
 */
const captions = reference.descriptions ?? {}

useHead({ title: 'Référence · Pokémon Companion' })

/* Mécaniques (§1–4, §10, §13.0) */
const openMechanics = ref<string[]>([])

function sectionOf(id: string) {
  return mechanics.find(section => section.id === id)
}

/**
 * Ouvre la section de premier niveau `id`, puis fait défiler jusqu'à `target`.
 *
 * Les deux diffèrent quand l'ancre visée est une **sous-section** : seul le
 * premier niveau est un panneau d'accordéon, donc c'est lui qu'il faut déplier,
 * mais c'est bien la sous-section qu'on veut à l'écran.
 */
function openSection(id: string, target: string = id) {
  if (!openMechanics.value.includes(id)) openMechanics.value.push(id)
  nextTick(() => {
    const element = document.getElementById(target) ?? document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

/**
 * Section de premier niveau contenant `id`, à n'importe quelle profondeur.
 *
 * `pnpm validate` accepte une ancre de sous-section **à tout niveau** : ne
 * chercher que `subsections[].id` laissait une ancre plus profonde ouvrir la
 * page en haut, sans rien signaler.
 */
function rootSectionOf(id: string) {
  const contains = (sections: ReferenceSection[]): boolean =>
    sections.some(section => section.id === id || contains(section.subsections ?? []))
  return mechanics.find(section => section.id === id || contains(section.subsections ?? []))
}

onMounted(() => {
  const hash = useRoute().hash.slice(1)
  if (!hash) return
  const match = rootSectionOf(hash)
  if (match) openSection(match.id, hash)
})

/*
 * Encounters et talents — fournis par les jeux dont le code est ouvert, donc
 * Elite Redux seul aujourd'hui. Unbound ne les a pas : les sections
 * disparaissent, elles ne se rendent pas vides.
 */
const encounters = reference.encounters ?? []
const abilities = reference.abilities ?? []
const bySpecies = current.value.encountersBySpecies

const METHOD_LABELS: Record<EncounterMethodId, string> = {
  'land': 'Herbes',
  'water': 'Surf',
  'fishing': 'Pêche',
  'rock-smash': 'Rock Smash',
  'honey': 'Honey',
}

/*
 * Un seul champ pour les deux entrées : le joueur cherche « Route 116 » ou
 * « Larvitar » sans vouloir choisir un mode au préalable. On interroge donc les
 * deux index et on montre ce qui répond.
 */
const encounterSearch = ref('')

/*
 * Rien n'est rendu tant qu'on n'a pas cherché : 142 zones dépliées, ce sont des
 * milliers de lignes de tableau dans le DOM d'un téléphone. Les puces de zone
 * suffisent à parcourir, et remplissent le champ au clic.
 */
const matchedZones = computed(() => {
  const query = encounterSearch.value.trim().toLowerCase()
  if (!query) return []
  return encounters.filter(zone => zone.label.toLowerCase().includes(query)).slice(0, 6)
})

const matchedSpecies = computed(() => {
  const query = encounterSearch.value.trim().toLowerCase()
  if (query.length < 2) return []
  return [...bySpecies.keys()]
    .filter(species => species.toLowerCase().includes(query))
    .sort((a, b) => a.length - b.length || a.localeCompare(b))
    .slice(0, 6)
    .map(species => ({ species, spots: bySpecies.get(species) ?? [] }))
})

const speciesCount = computed(() => bySpecies.size)

/*
 * Pokédex d'espèces — fourni par Seaglass seul, dont la source publie la donnée
 * par espèce plutôt que par zone.
 *
 * Rien n'est rendu tant qu'on n'a pas cherché : 447 fiches dépliées, c'est le
 * même problème de DOM que les 142 zones ci-dessus.
 */
const pokedex = reference.pokedex ?? []
const dexSearch = ref('')
const DEX_LIMIT = 12

const matchedDex = computed(() => {
  const query = dexSearch.value.trim().toLowerCase()
  if (query.length < 2) return []
  return pokedex
    .filter(entry =>
      entry.name.toLowerCase().includes(query)
      || entry.types.some(type => type.toLowerCase() === query)
      || entry.locations.some(location => location.toLowerCase().includes(query)),
    )
    .slice(0, DEX_LIMIT)
})

const dexMatches = computed(() => {
  const query = dexSearch.value.trim().toLowerCase()
  if (query.length < 2) return 0
  return pokedex.filter(entry =>
    entry.name.toLowerCase().includes(query)
    || entry.types.some(type => type.toLowerCase() === query)
    || entry.locations.some(location => location.toLowerCase().includes(query)),
  ).length
})

/** Les espèces dont une stat s'écarte du jeu officiel : ce que l'écran ne dit pas. */
const retunedCount = computed(() =>
  pokedex.filter(entry => STAT_KEYS.some(key => entry.stats[key].seaglass !== entry.stats[key].official)).length,
)

/* TM et HM : une seule table, courte, donc rendue entière et filtrable. */
const tms = reference.tms ?? []
const tmSearch = ref('')

const filteredTms = computed(() => {
  const query = tmSearch.value.trim().toLowerCase()
  if (!query) return tms
  return tms.filter(tm =>
    tm.id.toLowerCase().includes(query)
    || tm.move.toLowerCase().includes(query)
    || tm.location.toLowerCase().includes(query),
  )
})

/* Talents */
const abilitySearch = ref('')
const ABILITY_LIMIT = 60

const filteredAbilities = computed(() => {
  const query = abilitySearch.value.trim().toLowerCase()
  if (!query) return abilities.slice(0, ABILITY_LIMIT)
  return abilities
    .filter(ability =>
      ability.name.toLowerCase().includes(query)
      || ability.description.toLowerCase().includes(query)
      || (ability.expanded ?? '').toLowerCase().includes(query),
    )
    .slice(0, ABILITY_LIMIT)
})

const abilityMatches = computed(() => {
  const query = abilitySearch.value.trim().toLowerCase()
  if (!query) return abilities.length
  return abilities.filter(ability =>
    ability.name.toLowerCase().includes(query)
    || ability.description.toLowerCase().includes(query)
    || (ability.expanded ?? '').toLowerCase().includes(query),
  ).length
})

/* Natures (§13.1) */
const natureSearch = ref('')
const filteredNatures = computed(() => {
  const query = natureSearch.value.trim().toLowerCase()
  if (!query) return natures
  return natures.filter(nature => `${nature.en} ${nature.fr}`.toLowerCase().includes(query))
})
</script>

<template>
  <div class="space-y-10">
    <!-- Mécaniques -->
    <SectionBlock
      title="Mécaniques"
      :description="captions.mechanics"
    >
      <!-- Sommaire -->
      <nav class="flex flex-wrap gap-1.5">
        <button
          v-for="section in mechanics"
          :key="section.id"
          type="button"
          class="px-2.5 py-1 rounded-[var(--ui-radius)] border border-default text-xs text-toned hover:bg-elevated/60 transition-colors"
          @click="openSection(section.id)"
        >
          <span v-if="section.ref" class="text-dimmed tabular-nums mr-1">{{ section.ref }}</span>{{ section.title }}
        </button>
      </nav>

      <UAccordion
        v-model="openMechanics"
        type="multiple"
        :items="mechanics.map(section => ({ value: section.id, label: section.title }))"
        :ui="{ item: 'border-default', label: 'min-w-0' }"
      >
        <template #default="{ item }">
          <div :id="item.value" class="flex items-center gap-2 flex-1 min-w-0 text-left scroll-mt-20">
            <span v-if="sectionOf(item.value)?.ref" class="text-xs text-dimmed tabular-nums shrink-0">
              {{ sectionOf(item.value)?.ref }}
            </span>
            <p class="text-sm font-medium text-highlighted truncate min-w-0 flex-1">
              {{ item.label }}
            </p>
          </div>
        </template>

        <template #content="{ item }">
          <div class="space-y-4 pb-2">
            <ContentBlocks
              v-if="sectionOf(item.value)?.blocks.length"
              :blocks="sectionOf(item.value)!.blocks"
              compact
            />

            <div
              v-for="sub in sectionOf(item.value)?.subsections ?? []"
              :key="sub.id"
              class="space-y-3 pl-3 border-l border-default"
            >
              <div :id="sub.id" class="flex items-baseline gap-2 flex-wrap scroll-mt-20">
                <h4 class="text-sm font-semibold text-highlighted">
                  {{ sub.title }}
                </h4>
                <span v-if="sub.ref" class="text-xs text-dimmed tabular-nums">{{ sub.ref }}</span>
              </div>

              <ContentBlocks v-if="sub.blocks.length" :blocks="sub.blocks" compact />

              <div
                v-for="subsub in sub.subsections ?? []"
                :key="subsub.id"
                class="space-y-2 pl-3 border-l border-default"
              >
                <div :id="subsub.id" class="flex items-baseline gap-2 flex-wrap scroll-mt-20">
                  <h5 class="text-xs font-semibold text-highlighted">
                    {{ subsub.title }}
                  </h5>
                  <span v-if="subsub.ref" class="text-xs text-dimmed tabular-nums">{{ subsub.ref }}</span>
                </div>
                <ContentBlocks v-if="subsub.blocks.length" :blocks="subsub.blocks" compact />
              </div>
            </div>
          </div>
        </template>
      </UAccordion>
    </SectionBlock>

    <!--
      Pokédex d'espèces. La colonne « Officiel » est la raison d'être de la
      section : c'est la seule chose que le Pokédex du jeu ne peut pas montrer.
    -->
    <SectionBlock
      v-if="pokedex.length"
      title="Pokédex"
      :description="captions.pokedex"
    >
      <UInput
        v-model="dexSearch"
        icon="i-lucide-search"
        placeholder="Une espèce (« Feraligatr »), un type (« Dark ») ou un lieu (« Fiery Path »)…"
      />

      <div v-for="entry in matchedDex" :key="entry.id" class="space-y-3">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 class="text-sm font-semibold text-highlighted">
            {{ entry.name }}
          </h3>
          <span class="text-xs text-dimmed tabular-nums">
            #{{ String(entry.hoennDex).padStart(3, '0') }} · Nat. #{{ entry.nationalDex }}
          </span>
          <span class="text-xs text-toned">{{ entry.types.join(' / ') }}</span>
        </div>

        <p class="text-xs text-toned">
          <span class="text-dimmed">Obtention :</span> {{ entry.locations.join(' · ') }}
        </p>
        <p v-if="entry.evolution" class="text-xs text-toned">
          <span class="text-dimmed">Évolution :</span> {{ entry.evolution }}
        </p>

        <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-muted">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-highlighted">Stat</th>
                <th class="px-3 py-2 text-right font-medium text-highlighted">Seaglass</th>
                <th class="px-3 py-2 text-right font-medium text-highlighted">Officiel</th>
                <th class="px-3 py-2 text-right font-medium text-highlighted">Écart</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="key in STAT_KEYS" :key="key" class="border-t border-default">
                <td class="px-3 py-1.5 text-toned">
                  {{ STAT_LABELS[key] }}
                </td>
                <td class="px-3 py-1.5 text-right text-highlighted tabular-nums">
                  {{ entry.stats[key].seaglass }}
                </td>
                <td class="px-3 py-1.5 text-right text-dimmed tabular-nums">
                  {{ entry.stats[key].official }}
                </td>
                <td
                  class="px-3 py-1.5 text-right tabular-nums"
                  :class="entry.stats[key].seaglass === entry.stats[key].official
                    ? 'text-dimmed'
                    : entry.stats[key].seaglass > entry.stats[key].official ? 'text-success' : 'text-error'"
                >
                  {{ entry.stats[key].seaglass === entry.stats[key].official
                    ? '–'
                    : (entry.stats[key].seaglass > entry.stats[key].official ? '+' : '')
                      + (entry.stats[key].seaglass - entry.stats[key].official) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="space-y-1">
          <p v-for="ability in entry.abilities" :key="ability.name" class="text-xs text-toned">
            <span class="font-medium text-highlighted">{{ ability.name }}</span>
            <UBadge v-if="ability.hidden" color="neutral" variant="subtle" size="sm" class="ml-1.5">
              caché
            </UBadge>
            <span class="text-dimmed"> — {{ ability.description }}</span>
          </p>
        </div>

        <p v-if="entry.eggGroups.length" class="text-xs text-dimmed">
          Groupes d’œufs : {{ entry.eggGroups.join(', ') }}
        </p>
      </div>

      <p v-if="dexSearch.trim().length >= 2 && !matchedDex.length" class="text-sm text-dimmed">
        Aucune espèce ne correspond, sur les {{ pokedex.length }} du dex.
      </p>
      <p v-else-if="dexMatches > matchedDex.length" class="text-xs text-dimmed">
        {{ dexMatches }} espèces correspondent, les {{ DEX_LIMIT }} premières sont affichées.
      </p>
      <p v-else-if="!dexSearch.trim()" class="text-sm text-dimmed">
        {{ pokedex.length }} espèces, dont <strong>{{ retunedCount }}</strong> dont au moins une stat
        s’écarte du jeu officiel. Cherche une espèce, un type ou un lieu ci-dessus.
      </p>
    </SectionBlock>

    <!-- TM et HM, avec leurs lieux et leurs prérequis -->
    <SectionBlock
      v-if="tms.length"
      title="TM et HM"
      :description="captions.tms"
    >
      <UInput
        v-model="tmSearch"
        icon="i-lucide-search"
        placeholder="Un numéro (« TM26 »), une capacité (« Earthquake ») ou un lieu…"
      />
      <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-muted">
            <tr>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">TM</th>
              <th class="px-3 py-2 text-left font-medium text-highlighted">Capacité</th>
              <th class="px-3 py-2 text-left font-medium text-highlighted">Où</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tm in filteredTms" :key="tm.id" class="border-t border-default">
              <td class="px-3 py-1.5 text-dimmed tabular-nums whitespace-nowrap">
                {{ tm.id }}
              </td>
              <td class="px-3 py-1.5 text-highlighted">
                {{ tm.move }}
                <span v-if="tm.requires?.length" class="block text-[0.7rem] text-dimmed">
                  demande {{ tm.requires.join(', ') }}
                </span>
              </td>
              <td class="px-3 py-1.5 text-toned">
                {{ tm.location }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="!filteredTms.length" class="text-sm text-dimmed">
        Aucune TM ne correspond, sur les {{ tms.length }} du jeu.
      </p>
    </SectionBlock>

    <!-- Encounters : fournis par les jeux au code ouvert -->
    <SectionBlock
      v-if="encounters.length"
      title="Où trouver quoi"
      :description="captions.encounters"
    >
      <UInput
        v-model="encounterSearch"
        icon="i-lucide-search"
        placeholder="Un lieu (« Route 116 ») ou une espèce (« Larvitar »)…"
      />

      <!-- Espèces : la question « où vit-il ? », posée dans ce sens -->
      <div v-for="match in matchedSpecies" :key="match.species" class="space-y-2">
        <h3 class="text-sm font-semibold text-highlighted">
          {{ match.species }}
          <span class="text-dimmed font-normal">· {{ match.spots.length }} zone{{ match.spots.length > 1 ? 's' : '' }}</span>
        </h3>
        <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-muted">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-highlighted">Lieu</th>
                <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">Méthode</th>
                <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">Niveaux</th>
                <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">Slots</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="spot in match.spots" :key="`${spot.zoneId}-${spot.method}`" class="border-t border-default">
                <td class="px-3 py-2 text-highlighted">
                  {{ spot.zoneLabel }}
                </td>
                <td class="px-3 py-2 text-toned whitespace-nowrap">
                  {{ METHOD_LABELS[spot.method] }}
                </td>
                <td class="px-3 py-2 text-toned tabular-nums whitespace-nowrap">
                  {{ spot.min === spot.max ? spot.min : `${spot.min}–${spot.max}` }}
                </td>
                <td class="px-3 py-2 text-dimmed tabular-nums whitespace-nowrap">
                  {{ spot.slots }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Zones : la table complète d'un lieu -->
      <div v-for="zone in matchedZones" :key="zone.id" class="space-y-2">
        <h3 class="text-sm font-semibold text-highlighted">
          {{ zone.label }}
        </h3>
        <p v-if="zone.note" class="text-xs text-dimmed">
          {{ zone.note }}
        </p>
        <div v-for="method in zone.methods" :key="method.method" class="space-y-1">
          <p class="text-xs text-toned">
            <span class="font-medium text-highlighted">{{ METHOD_LABELS[method.method] }}</span>
            <span class="text-dimmed"> · taux {{ method.rate }}</span>
          </p>
          <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
            <table class="w-full text-sm border-collapse">
              <tbody>
                <tr v-for="slot in method.slots" :key="slot.species" class="border-t border-default first:border-t-0">
                  <td class="px-3 py-1.5 text-highlighted">
                    {{ slot.species }}
                  </td>
                  <td class="px-3 py-1.5 text-toned tabular-nums whitespace-nowrap w-24">
                    {{ slot.min === slot.max ? slot.min : `${slot.min}–${slot.max}` }}
                  </td>
                  <td class="px-3 py-1.5 text-dimmed tabular-nums whitespace-nowrap w-20">
                    {{ slot.slots }} slot{{ slot.slots > 1 ? 's' : '' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p v-if="encounterSearch.trim() && !matchedZones.length && !matchedSpecies.length" class="text-sm text-dimmed">
        Ni lieu ni espèce ne correspond. {{ encounters.length }} zones et {{ speciesCount }} espèces indexées.
      </p>

      <!-- Sommaire des lieux : rien n'est déplié tant qu'on n'a pas cherché -->
      <div v-if="!encounterSearch.trim()" class="space-y-2">
        <p class="text-sm text-dimmed">
          {{ encounters.length }} zones, {{ speciesCount }} espèces. Cherche un lieu ou une espèce ci-dessus, ou pioche&nbsp;:
        </p>
        <nav class="flex flex-wrap gap-1.5">
          <button
            v-for="zone in encounters"
            :key="zone.id"
            type="button"
            class="px-2.5 py-1 rounded-[var(--ui-radius)] border border-default text-xs text-toned hover:bg-elevated/60 transition-colors"
            @click="encounterSearch = zone.label"
          >
            {{ zone.label }}
          </button>
        </nav>
      </div>
    </SectionBlock>

    <!-- Talents -->
    <SectionBlock
      v-if="abilities.length"
      title="Talents"
      :description="captions.abilities"
    >
      <UInput
        v-model="abilitySearch"
        icon="i-lucide-search"
        placeholder="Chercher un talent, ou un effet (« sandstorm », « contact »)…"
      />

      <p class="text-xs text-dimmed">
        {{ abilityMatches }} talent{{ abilityMatches > 1 ? 's' : '' }}
        <span v-if="abilityMatches > filteredAbilities.length">· {{ filteredAbilities.length }} affichés, affine la recherche</span>
      </p>

      <div class="space-y-2">
        <AppCard v-for="ability in filteredAbilities" :key="ability.id" density="compact">
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-highlighted">
              {{ ability.name }}
            </h3>
            <p class="text-xs text-toned">
              {{ ability.description }}
            </p>
            <details v-if="ability.expanded" class="text-xs">
              <summary class="cursor-pointer text-primary hover:underline">
                Détail des interactions
              </summary>
              <p class="pt-1 text-dimmed">
                {{ ability.expanded }}
              </p>
            </details>
          </div>
        </AppCard>
      </div>

      <p v-if="!filteredAbilities.length" class="text-sm text-dimmed">
        Aucun talent ne correspond à cette recherche.
      </p>
    </SectionBlock>

    <!-- Table des natures -->
    <SectionBlock
      title="Table des natures"
      :description="captions.natures"
    >
      <UInput
        v-model="natureSearch"
        icon="i-lucide-search"
        placeholder="Chercher une nature (VO ou français)…"
      />

      <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-muted">
            <tr>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                Nature
              </th>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                +
              </th>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                −
              </th>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                Usage
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nature in filteredNatures" :key="nature.en" class="border-t border-default align-top">
              <td class="px-3 py-2 text-highlighted font-medium whitespace-nowrap">
                {{ nature.en }} <span class="text-dimmed font-normal">({{ nature.fr }})</span>
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <span class="text-success font-medium">+{{ STAT_LABELS[nature.up] }}</span>
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <span class="text-error font-medium">−{{ STAT_LABELS[nature.down] }}</span>
              </td>
              <td class="px-3 py-2 text-toned">
                <span v-if="nature.usage">{{ nature.usage }}</span>
                <span v-else class="text-dimmed">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!filteredNatures.length" class="text-sm text-dimmed">
        Aucune nature ne correspond à cette recherche.
      </p>
    </SectionBlock>

    <!-- Outils -->
    <SectionBlock
      title="Outils"
      :description="captions.tools"
    >
      <div class="space-y-2">
        <AppCard
          v-for="tool in tools"
          :key="tool.name"
          density="compact"
        >
          <div class="space-y-1">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <h3 class="text-sm font-medium text-highlighted">
                {{ tool.name }}
              </h3>
              <a
                :href="`https://${tool.url}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-primary hover:underline break-all"
              >
                {{ tool.url }}
              </a>
            </div>
            <p class="text-xs text-toned" v-html="formatInline(tool.usage)" />
          </div>
        </AppCard>
      </div>
    </SectionBlock>

    <!-- Glossaire -->
    <SectionBlock
      title="Glossaire"
      :description="captions.glossary"
    >
      <dl class="rounded-[var(--ui-radius)] border border-default divide-y divide-default">
        <div
          v-for="entry in glossary"
          :key="entry.term"
          class="p-3 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-3"
        >
          <dt class="text-sm font-medium text-highlighted">
            {{ entry.term }}
          </dt>
          <dd class="text-sm text-toned" v-html="formatInline(entry.definition)" />
        </div>
      </dl>
    </SectionBlock>
  </div>
</template>
