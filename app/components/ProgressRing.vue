<script setup lang="ts">
const props = withDefaults(defineProps<{
  percent: number
  size?: number
  thickness?: number
  label?: string
  sublabel?: string
}>(), {
  size: 96,
  thickness: 8,
})

const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - Math.min(100, Math.max(0, props.percent)) / 100))

const tone = computed(() => {
  if (props.percent >= 100) return 'text-success'
  if (props.percent >= 50) return 'text-primary'
  return 'text-secondary'
})
</script>

<template>
  <div class="inline-flex flex-col items-center gap-1.5">
    <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :width="size" :height="size" class="-rotate-90" aria-hidden="true">
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          fill="none"
          :stroke-width="thickness"
          class="stroke-accented"
        />
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          fill="none"
          :stroke-width="thickness"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="offset"
          class="transition-[stroke-dashoffset] duration-500 ease-out"
          :class="tone"
          stroke="currentColor"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="font-semibold tabular-nums text-highlighted" :style="{ fontSize: `${size / 4.5}px` }">
          {{ Math.round(percent) }}<span class="text-[0.6em] text-muted">%</span>
        </span>
        <span v-if="sublabel" class="text-[0.6rem] text-dimmed tabular-nums">{{ sublabel }}</span>
      </div>
    </div>
    <span v-if="label" class="text-xs text-muted text-center">{{ label }}</span>
  </div>
</template>
