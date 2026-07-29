<script setup lang="ts">
import type { CounterDef } from '~/data/types'

const props = defineProps<{ counter: CounterDef }>()

const { counterValue, setCounter } = useSave()

const value = computed({
  get: () => counterValue(props.counter.id),
  set: next => setCounter(props.counter.id, Number(next)),
})

const percent = computed(() => {
  if (!props.counter.goal) return null
  return Math.min(100, Math.round((value.value / props.counter.goal) * 100))
})

const formatter = new Intl.NumberFormat('fr-FR')
</script>

<template>
  <div class="p-3 rounded-[var(--ui-radius)] border border-default bg-elevated/30 space-y-2">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 min-w-0">
        <UIcon :name="counter.icon" class="size-4 shrink-0 text-muted" />
        <span class="text-xs font-medium text-toned truncate">{{ counter.label }}</span>
      </div>
      <UTooltip v-if="counter.hint" :text="counter.hint" :delay-duration="150">
        <UIcon name="i-lucide-info" class="size-3.5 text-dimmed shrink-0" />
      </UTooltip>
    </div>

    <UInputNumber
      v-model="value"
      :min="0"
      :step="counter.id === 'money' ? 10000 : 1"
      size="sm"
      :aria-label="counter.label"
      class="w-full"
    />

    <div v-if="counter.goal" class="space-y-1">
      <UProgress :model-value="percent" size="xs" :color="percent === 100 ? 'success' : 'primary'" />
      <p class="text-[0.65rem] text-dimmed tabular-nums">
        objectif {{ formatter.format(counter.goal) }}
      </p>
    </div>
  </div>
</template>
