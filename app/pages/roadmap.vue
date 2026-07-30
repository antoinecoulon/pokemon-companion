<script setup lang="ts">
import { phases } from '~/data/phases'

useHead({ title: 'Roadmap · Pokémon Companion' })

const { byPhase, overall } = useProgress()
const { blockersFor } = useNextActions()

const open = ref<string[]>([])

onMounted(() => {
  const hash = useRoute().hash.slice(1)
  const fromHash = phases.find(phase => phase.id === hash)
  const firstIncomplete = phases.find(phase => (byPhase.value.get(phase.id)?.percent ?? 100) < 100)
  const target = fromHash ?? firstIncomplete ?? phases[0]
  if (target) open.value = [target.id]
})
</script>

<template>
  <div class="space-y-10">
    <AppCard tone="raised" density="compact">
      <div class="flex items-center gap-4">
        <ProgressRing :percent="overall.percent" :size="64" :thickness="6" />
        <div>
          <h2 class="font-semibold text-highlighted">
            {{ overall.done }} / {{ overall.total }} tâches
          </h2>
          <p class="text-sm text-muted">
            Les 6 phases du guide, de l’état des lieux au Battle Frontier.
          </p>
        </div>
      </div>
    </AppCard>

    <UAccordion
      v-model="open"
      type="multiple"
      :items="phases.map(phase => ({ value: phase.id, label: phase.title }))"
      :ui="{ item: 'border-default' }"
    >
      <template #default="{ item }">
        <div :id="item.value" class="flex items-center gap-3 flex-1 min-w-0 text-left scroll-mt-20">
          <span
            class="grid place-items-center size-7 shrink-0 rounded-full text-xs font-semibold tabular-nums"
            :class="(byPhase.get(item.value)?.percent ?? 0) === 100
              ? 'bg-success/15 text-success'
              : 'bg-elevated text-muted'"
          >
            {{ phases.find(p => p.id === item.value)?.number }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-highlighted truncate">
              {{ item.label }}
            </p>
            <p
              v-if="phases.find(p => p.id === item.value)?.subtitle"
              class="text-xs text-dimmed truncate"
            >
              {{ phases.find(p => p.id === item.value)?.subtitle }}
            </p>
          </div>
          <span class="text-xs text-dimmed tabular-nums shrink-0">
            {{ byPhase.get(item.value)?.done }}/{{ byPhase.get(item.value)?.total }}
          </span>
        </div>
      </template>

      <template #content="{ item }">
        <div class="space-y-3 pb-2">
          <ContentBlocks
            v-if="phases.find(p => p.id === item.value)?.intro"
            :blocks="phases.find(p => p.id === item.value)!.intro!"
            compact
          />
          <div class="divide-y divide-default">
            <TaskItem
              v-for="task in phases.find(p => p.id === item.value)?.tasks ?? []"
              :key="task.id"
              :task="task"
              :blocked-by="blockersFor(task.id)"
            />
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
