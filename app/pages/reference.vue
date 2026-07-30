<script setup lang="ts">
import { mechanics, tools } from '~/data/mechanics'
import { natures } from '~/data/natures'
import { glossary } from '~/data/glossary'

useHead({ title: 'Référence · Pokémon Companion' })

/* Mécaniques (§1–4, §10, §13.0) */
const openMechanics = ref<string[]>([])

function sectionOf(id: string) {
  return mechanics.find(section => section.id === id)
}

function openSection(id: string) {
  if (!openMechanics.value.includes(id)) openMechanics.value.push(id)
  nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

onMounted(() => {
  const hash = useRoute().hash.slice(1)
  const match = sectionOf(hash) ?? mechanics.find(section => section.subsections?.some(sub => sub.id === hash))
  if (match) openSection(match.id)
})

/* Natures (§13.1) */
const natureSearch = ref('')
const filteredNatures = computed(() => {
  const query = natureSearch.value.trim().toLowerCase()
  if (!query) return natures
  return natures.filter(nature => `${nature.fr} ${nature.en}`.toLowerCase().includes(query))
})
</script>

<template>
  <div class="space-y-10">
    <!-- Mécaniques -->
    <SectionBlock
      title="Mécaniques"
      description="§1–4, §10, §13.0 — les fondamentaux du endgame : IV, EV, natures, talents, rôles, Battle Frontier."
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
              <div class="flex items-baseline gap-2 flex-wrap">
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
                <div class="flex items-baseline gap-2 flex-wrap">
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

    <!-- Table des natures -->
    <SectionBlock
      title="Table des natures"
      description="§13.1 — seules 8 natures ont un usage recommandé, les 12 autres sont des natures « miroir » peu utilisées."
    >
      <UInput
        v-model="natureSearch"
        icon="i-lucide-search"
        placeholder="Chercher une nature (fr ou en)…"
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
            <tr v-for="nature in filteredNatures" :key="nature.fr" class="border-t border-default align-top">
              <td class="px-3 py-2 text-highlighted font-medium whitespace-nowrap">
                {{ nature.fr }} <span class="text-dimmed font-normal">({{ nature.en }})</span>
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
      description="§13.0 — à garder ouverts dans un onglet pendant l’optimisation."
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
      description="§13.3 — le vocabulaire compétitif utilisé partout ailleurs dans ce companion."
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
