<script setup lang="ts">
import type { PartialStats, StatKey } from '~/utils/stats'

const props = defineProps<{
  kind: 'iv' | 'ev'
  /** Cible du build choisi, affichée sous chaque champ. */
  target?: PartialStats
  /** Stats à prioriser (§6, section IV de chaque fiche). */
  focus?: StatKey[]
  /** Stats à ne pas toucher — une Attack basse est parfois voulue. */
  ignore?: StatKey[]
}>()

const stats = defineModel<PartialStats>({ required: true })

const max = computed(() => (props.kind === 'iv' ? IV_MAX : EV_MAX_PER_STAT))
const step = computed(() => (props.kind === 'iv' ? 1 : 4))

const total = computed(() => statsTotal(stats.value))
const wasted = computed(() => wastedEvs(stats.value))
const remaining = computed(() => EV_TOTAL_MAX - total.value)

function set(key: StatKey, value: number | null) {
  const next = { ...stats.value }
  if (value === null || Number.isNaN(value)) delete next[key]
  else next[key] = Math.min(max.value, Math.max(0, Math.round(value)))
  stats.value = next
}

function toneFor(key: StatKey) {
  if (props.ignore?.includes(key)) return 'text-dimmed'
  if (props.focus?.includes(key)) return 'text-secondary font-medium'
  return 'text-muted'
}

/** Écart à la cible, pour les EV uniquement (les IV se lisent contre 31). */
function gapFor(key: StatKey): string | null {
  if (props.kind === 'iv') {
    const value = stats.value[key]
    if (value === undefined) return null
    if (props.ignore?.includes(key)) return 'ignorée'
    return value >= IV_MAX ? 'à 31 ✓' : `${IV_MAX - value} à gagner`
  }
  const want = props.target?.[key]
  if (want === undefined) return null
  const have = stats.value[key] ?? 0
  if (have === want) return `cible ${want} ✓`
  return `cible ${want}`
}
</script>

<template>
  <div class="space-y-2">
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
      <div v-for="key in STAT_KEYS" :key="key" class="space-y-1">
        <label :for="`${kind}-${key}`" class="block text-xs" :class="toneFor(key)">
          {{ STAT_LABELS[key] }}
          <UIcon
            v-if="ignore?.includes(key)"
            name="i-lucide-minus-circle"
            class="size-3 align-text-bottom"
          />
        </label>
        <UInputNumber
          :id="`${kind}-${key}`"
          :model-value="stats[key] ?? null"
          :min="0"
          :max="max"
          :step="step"
          :placeholder="'—'"
          size="sm"
          :aria-label="`${kind === 'iv' ? 'IV' : 'EV'} ${STAT_LABELS_LONG[key]}`"
          :ui="{ base: 'text-center tabular-nums' }"
          @update:model-value="set(key, $event)"
        />
        <p class="text-[0.6rem] leading-tight tabular-nums" :class="toneFor(key)">
          {{ gapFor(key) ?? ' ' }}
        </p>
      </div>
    </div>

    <div v-if="kind === 'ev'" class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span class="tabular-nums" :class="total > EV_TOTAL_MAX ? 'text-error' : 'text-muted'">
        {{ total }} / {{ EV_TOTAL_MAX }} EV
      </span>
      <span v-if="remaining > 0 && total > 0" class="text-dimmed tabular-nums">
        {{ remaining }} restants
      </span>
      <span v-if="total > EV_TOTAL_MAX" class="text-error">
        au-delà du plafond
      </span>
      <span v-if="wasted > 0" class="text-warning tabular-nums">
        {{ wasted }} EV perdus — seuls les multiples de 4 comptent
      </span>
      <UBadge v-if="isOptimalEvSpread(stats)" color="success" variant="subtle" size="sm">
        252 / 252 / 4
      </UBadge>
    </div>
  </div>
</template>
