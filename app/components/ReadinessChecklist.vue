<script setup lang="ts">
import type { PokemonSheet } from '~/data/types'

const props = defineProps<{ mon: PokemonSheet }>()

const { readinessFor } = useProgress()
const { isDone, toggleDone } = useSave()

const result = computed(() => readinessFor(props.mon))
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-3">
      <ProgressRing :percent="result.ratio.percent" :size="52" :thickness="5" />
      <div>
        <h3 class="text-sm font-semibold text-highlighted">
          Endgame Ready
        </h3>
        <p class="text-xs text-muted tabular-nums">
          {{ result.ratio.done }} / {{ result.ratio.total }} critères — §13.2
        </p>
      </div>
    </div>

    <ul class="rounded-[var(--ui-radius)] border border-default divide-y divide-default">
      <li
        v-for="row in result.rows"
        :key="row.key"
        class="flex items-start gap-3 px-3 py-2"
      >
        <!-- Critère déduit du formulaire : pas de case, une pastille d'état. -->
        <div v-if="row.derived" class="mt-0.5 shrink-0">
          <UIcon
            :name="row.met ? 'i-lucide-circle-check' : 'i-lucide-circle-dashed'"
            class="size-4.5"
            :class="row.met ? 'text-success' : 'text-dimmed'"
          />
        </div>
        <UCheckbox
          v-else
          :model-value="isDone(row.taskId)"
          :aria-label="row.label"
          class="mt-0.5 shrink-0"
          @update:model-value="toggleDone(row.taskId)"
        />

        <div class="min-w-0 flex-1 space-y-0.5">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="text-sm" :class="row.met ? 'text-toned' : 'text-muted'">
              {{ row.label }}
            </p>
            <UBadge v-if="row.derived" color="neutral" variant="subtle" size="sm">
              auto
            </UBadge>
          </div>
          <p v-if="row.detail" class="text-xs tabular-nums" :class="row.met ? 'text-dimmed' : 'text-warning'">
            {{ row.detail }}
          </p>
          <p v-else-if="row.hint" class="text-xs text-dimmed">
            {{ row.hint }}
          </p>
        </div>
      </li>
    </ul>

    <UAlert
      v-if="result.duplicates.length"
      color="warning"
      variant="subtle"
      icon="i-lucide-copy"
      title="Objet en double dans l’équipe"
      :description="`${mon.name} porte le même objet que ${result.duplicates.join(', ')}. Certains formats de la Battle Frontier interdisent les objets doublons — §7.3 signale trois candidats aux Leftovers.`"
    />
  </div>
</template>
