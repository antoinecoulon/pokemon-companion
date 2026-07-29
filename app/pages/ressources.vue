<script setup lang="ts">
import { npcs } from '~/data/npcs'
import { battleItems, battleItemsTip, consumables } from '~/data/items'
import { quests, questsDisclaimer } from '~/data/quests'
import { farmingTopics } from '~/data/farming'

useHead({ title: 'Ressources · Pokémon Companion' })

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

/* Farming (§11) */
const openFarming = ref<string[]>([])
</script>

<template>
  <div class="space-y-8">
    <!-- PNJ indispensables -->
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          PNJ indispensables
        </h2>
        <p class="text-sm text-muted">
          §8 — les priorités ★5 sont à faire en tout premier, le reste peut attendre.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2">
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

      <div class="grid sm:grid-cols-2 gap-3">
        <div
          v-for="npc in filteredNpcs"
          :key="npc.id"
          class="p-3 rounded-[var(--ui-radius)] border space-y-1.5"
          :class="npc.priority === 5 ? 'border-primary bg-primary/5' : 'border-default'"
        >
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-medium text-highlighted" v-html="formatInline(npc.service)" />
            <span class="flex shrink-0 gap-0.5 pt-0.5">
              <UIcon
                v-for="star in 5"
                :key="star"
                name="i-lucide-star"
                class="size-3.5"
                :class="star <= npc.priority ? 'text-primary fill-current' : 'text-dimmed'"
              />
            </span>
          </div>
          <p class="text-xs text-toned" v-html="formatInline(npc.location)" />
          <p class="text-xs text-dimmed">
            {{ npc.cost }}
          </p>
          <p v-if="npc.note" class="text-xs text-primary italic">
            {{ npc.note }}
          </p>
        </div>
      </div>
    </section>

    <!-- Objets de combat -->
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          Objets de combat
        </h2>
        <p class="text-sm text-muted">
          §9.1 — prix au Battle Tower, et alternative pour économiser tes BP.
        </p>
      </div>

      <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-muted">
            <tr>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                Objet
              </th>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                Effet
              </th>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                BP
              </th>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                Alternative
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in battleItems" :key="item.id" class="border-t border-default align-top">
              <td class="px-3 py-2 text-highlighted font-medium whitespace-nowrap">
                {{ item.name }}
              </td>
              <td class="px-3 py-2 text-toned">
                {{ item.effect }}
              </td>
              <td class="px-3 py-2 text-toned tabular-nums whitespace-nowrap">
                {{ item.bp }}
              </td>
              <td class="px-3 py-2 text-toned" v-html="formatInline(item.alternative ?? '—')" />
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
    </section>

    <!-- Consommables d'optimisation -->
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          Consommables d’optimisation
        </h2>
        <p class="text-sm text-muted">
          §9.2 — ce qui alimente les IV, les talents et l’EV training.
        </p>
      </div>

      <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
        <table class="w-full text-sm border-collapse">
          <thead class="bg-muted">
            <tr>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                Consommable
              </th>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                Rôle
              </th>
              <th class="px-3 py-2 text-left font-medium text-highlighted whitespace-nowrap">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in consumables" :key="item.id" class="border-t border-default align-top">
              <td class="px-3 py-2 text-highlighted font-medium whitespace-nowrap">
                {{ item.name }}
              </td>
              <td class="px-3 py-2 text-toned">
                {{ item.role }}
              </td>
              <td class="px-3 py-2 text-toned" v-html="formatInline(item.source)" />
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Quêtes postgame -->
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          Quêtes postgame
        </h2>
        <p class="text-sm text-muted">
          §12 — celles qui débloquent un service ou un objet, pas une simple récompense d’argent.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        <div
          v-for="quest in quests"
          :key="quest.id"
          class="p-3 rounded-[var(--ui-radius)] border border-default space-y-1.5"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <span class="text-xs text-dimmed tabular-nums">{{ quest.code }}</span>
              <h3 class="text-sm font-medium text-highlighted">
                {{ quest.name }}
              </h3>
            </div>
            <span class="flex shrink-0 gap-0.5 pt-0.5">
              <UIcon
                v-for="star in 5"
                :key="star"
                name="i-lucide-star"
                class="size-3.5"
                :class="star <= quest.interest ? 'text-primary fill-current' : 'text-dimmed'"
              />
            </span>
          </div>
          <p class="text-xs text-toned">
            {{ quest.location }}
          </p>
          <p class="text-xs text-toned" v-html="formatInline(quest.reward)" />
          <p v-if="quest.note" class="text-xs text-primary italic">
            {{ quest.note }}
          </p>
        </div>
      </div>

      <UAlert
        color="info"
        variant="subtle"
        icon="i-lucide-info"
        :description="questsDisclaimer"
      />
    </section>

    <!-- Farming endgame -->
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          Farming endgame
        </h2>
        <p class="text-sm text-muted">
          §11 — à consulter au coup par coup selon ce qu’il te manque.
        </p>
      </div>

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
    </section>
  </div>
</template>
