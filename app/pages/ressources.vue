<script setup lang="ts">
import { npcs } from '~/data/npcs'
import { battleItems, battleItemsTip, consumables } from '~/data/items'
import { farmingTopics } from '~/data/farming'
import type { ResourceKey } from '~/data/types'

useHead({ title: 'Ressources · Pokémon Companion' })

const { isAcquired, setAcquired } = useSave()

/*
 * Seuls les PNJ sont marquables ici : on les débloque une fois pour toutes. Les
 * objets de combat et les consommables, eux, se rachètent — une case « acquis »
 * n'y voudrait rien dire. Les quêtes ont quitté cette page : elles font partie
 * des 84 missions, inventoriées dans /completion.
 */
function toggle(key: ResourceKey, value: unknown) {
  setAcquired(key, Boolean(value))
}

/* PNJ indispensables (§8) */
const npcSearch = ref('')
const minPriority = ref(0)

const priorityItems = [
  { label: 'Toutes priorités', value: 0 },
  { label: '★5 uniquement', value: 5 },
  { label: '★4 et plus', value: 4 },
  { label: '★3 et plus', value: 3 },
  { label: '★2 et plus', value: 2 },
  { label: '★1 et plus', value: 1 },
]

const filteredNpcs = computed(() => {
  const query = npcSearch.value.trim().toLowerCase()
  return npcs.filter((npc) => {
    if (npc.priority < minPriority.value) return false
    if (!query) return true
    return `${npc.service} ${npc.location}`.toLowerCase().includes(query)
  })
})

const pendingNpcs = computed(() => filteredNpcs.value.filter(npc => !isAcquired(`npc:${npc.id}`)))
const acquiredNpcs = computed(() => filteredNpcs.value.filter(npc => isAcquired(`npc:${npc.id}`)))

/* Farming (§11) */
const openFarming = ref<string[]>([])
</script>

<template>
  <div class="space-y-10">
    <!-- PNJ indispensables -->
    <SectionBlock
      title="PNJ indispensables"
      description="§8 — les priorités ★5 sont à faire en tout premier, le reste peut attendre. Coche un PNJ une fois débloqué : il descend au bas de la section."
    >
      <div class="flex flex-col sm:flex-row gap-3">
        <UInput
          v-model="npcSearch"
          icon="i-lucide-search"
          placeholder="Chercher un service ou un lieu…"
          class="flex-1"
        />
        <USelectMenu
          v-model="minPriority"
          :items="priorityItems"
          value-key="value"
          class="sm:w-48"
        />
      </div>

      <p v-if="!filteredNpcs.length" class="text-sm text-dimmed">
        Aucun PNJ ne correspond à ce filtre.
      </p>

      <div v-if="pendingNpcs.length" class="grid sm:grid-cols-2 gap-4">
        <AppCard
          v-for="npc in pendingNpcs"
          :key="npc.id"
          density="compact"
          class="space-y-2"
          :class="npc.priority === 5 ? 'border-primary bg-primary/5' : ''"
        >
          <div class="flex items-start gap-3">
            <UCheckbox
              :model-value="isAcquired(`npc:${npc.id}`)"
              :aria-label="`Marquer comme acquis : ${npc.service.replace(/\*/g, '')}`"
              class="mt-0.5 shrink-0"
              @update:model-value="toggle(`npc:${npc.id}`, $event)"
            />
            <h3 class="text-sm font-medium text-highlighted flex-1" v-html="formatInline(npc.service)" />
            <span
              class="flex shrink-0 gap-0.5 pt-0.5"
              role="img"
              :aria-label="`Priorité ${npc.priority} sur 5`"
            >
              <UIcon
                v-for="star in 5"
                :key="star"
                name="i-lucide-star"
                class="size-4"
                :class="star <= npc.priority ? 'text-primary fill-current' : 'text-dimmed'"
              />
            </span>
          </div>
          <div class="pl-7 space-y-1.5">
            <p class="text-[0.8125rem] leading-relaxed text-toned" v-html="formatInline(npc.location)" />
            <p class="text-xs text-dimmed">
              {{ npc.cost }}
            </p>
            <p v-if="npc.note" class="text-xs text-primary italic">
              {{ npc.note }}
            </p>
          </div>
        </AppCard>
      </div>

      <ResourceArchive
        v-if="acquiredNpcs.length"
        :label="`PNJ déjà débloqués (${acquiredNpcs.length})`"
      >
        <li v-for="npc in acquiredNpcs" :key="npc.id" class="flex items-start gap-3">
          <UCheckbox
            :model-value="isAcquired(`npc:${npc.id}`)"
            :aria-label="`Marquer comme non acquis : ${npc.service.replace(/\*/g, '')}`"
            class="mt-0.5 shrink-0"
            @update:model-value="toggle(`npc:${npc.id}`, $event)"
          />
          <div class="min-w-0">
            <p class="text-[0.8125rem] text-muted line-through decoration-1" v-html="formatInline(npc.service)" />
            <p class="text-xs text-dimmed" v-html="formatInline(npc.location)" />
          </div>
        </li>
      </ResourceArchive>
    </SectionBlock>

    <!-- Objets de combat -->
    <SectionBlock
      title="Objets de combat"
      description="§9.1 — prix au Battle Tower, et alternative pour économiser tes BP."
    >
      <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-muted">
            <tr>
              <th class="px-4 py-2.5 text-left font-medium text-highlighted whitespace-nowrap">
                Objet
              </th>
              <th class="px-4 py-2.5 text-left font-medium text-highlighted whitespace-nowrap">
                Effet
              </th>
              <th class="px-4 py-2.5 text-left font-medium text-highlighted whitespace-nowrap">
                BP
              </th>
              <th class="px-4 py-2.5 text-left font-medium text-highlighted whitespace-nowrap">
                Alternative
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in battleItems" :key="item.id" class="border-t border-default align-top">
              <td class="px-4 py-2.5 text-highlighted font-medium whitespace-nowrap">
                {{ item.name }}
              </td>
              <td class="px-4 py-2.5 text-toned">
                {{ item.effect }}
              </td>
              <td class="px-4 py-2.5 text-toned tabular-nums whitespace-nowrap">
                {{ item.bp }}
              </td>
              <td class="px-4 py-2.5 text-toned" v-html="formatInline(item.alternative ?? '—')" />
            </tr>
          </tbody>
        </table>
      </div>

      <UAlert
        color="secondary"
        variant="subtle"
        icon="i-lucide-lightbulb"
      >
        <template #description>
          <span class="text-sm/relaxed" v-html="formatInline(battleItemsTip)" />
        </template>
      </UAlert>
    </SectionBlock>

    <!-- Consommables d'optimisation -->
    <SectionBlock
      title="Consommables d’optimisation"
      description="§9.2 — ce qui alimente les IV, les talents et l’EV training."
    >
      <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-muted">
            <tr>
              <th class="px-4 py-2.5 text-left font-medium text-highlighted whitespace-nowrap">
                Consommable
              </th>
              <th class="px-4 py-2.5 text-left font-medium text-highlighted whitespace-nowrap">
                Rôle
              </th>
              <th class="px-4 py-2.5 text-left font-medium text-highlighted whitespace-nowrap">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in consumables" :key="item.id" class="border-t border-default align-top">
              <td class="px-4 py-2.5 text-highlighted font-medium whitespace-nowrap">
                {{ item.name }}
              </td>
              <td class="px-4 py-2.5 text-toned">
                {{ item.role }}
              </td>
              <td class="px-4 py-2.5 text-toned" v-html="formatInline(item.source)" />
            </tr>
          </tbody>
        </table>
      </div>
    </SectionBlock>

    <!-- Farming endgame -->
    <SectionBlock
      title="Farming endgame"
      description="§11 — à consulter au coup par coup selon ce qu’il te manque."
    >
      <template #action>
        <NuxtLink to="/completion" class="text-xs text-primary hover:underline whitespace-nowrap">
          Complétion post-game
        </NuxtLink>
      </template>

      <UAccordion
        v-model="openFarming"
        type="multiple"
        :items="farmingTopics.map(topic => ({ value: topic.id, label: topic.title }))"
        :ui="{ item: 'border-default' }"
      >
        <template #content="{ item }">
          <div class="pb-2">
            <ContentBlocks
              :blocks="farmingTopics.find(topic => topic.id === item.value)!.blocks"
              compact
            />
          </div>
        </template>
      </UAccordion>
    </SectionBlock>
  </div>
</template>
