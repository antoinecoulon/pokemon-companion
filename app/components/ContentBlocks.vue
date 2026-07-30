<script setup lang="ts">
import type { Block } from '~/data/types'

const props = defineProps<{
  blocks: Block[]
  /** Réduit les marges verticales, pour les blocs imbriqués dans une carte. */
  compact?: boolean
}>()

const QUOTE_TONES = {
  info: { color: 'info', icon: 'i-lucide-info' },
  warning: { color: 'warning', icon: 'i-lucide-triangle-alert' },
  tip: { color: 'secondary', icon: 'i-lucide-lightbulb' },
  success: { color: 'success', icon: 'i-lucide-circle-check' },
} as const

function tone(block: Extract<Block, { kind: 'quote' }>) {
  return QUOTE_TONES[block.tone ?? 'info']
}

const gap = computed(() => (props.compact ? 'space-y-4' : 'space-y-5'))
</script>

<template>
  <div :class="gap">
    <template v-for="(block, index) in blocks" :key="index">
      <p
        v-if="block.kind === 'p'"
        class="text-sm/relaxed text-toned"
        v-html="formatInline(block.text)"
      />

      <component
        :is="block.ordered ? 'ol' : 'ul'"
        v-else-if="block.kind === 'list'"
        class="space-y-1.5 text-sm/relaxed text-toned"
        :class="block.ordered ? 'list-decimal pl-5' : 'list-disc pl-5'"
      >
        <li
          v-for="(item, itemIndex) in block.items"
          :key="itemIndex"
          class="marker:text-dimmed"
          v-html="formatInline(item)"
        />
      </component>

      <UAlert
        v-else-if="block.kind === 'quote'"
        :color="tone(block).color"
        :icon="tone(block).icon"
        variant="subtle"
      >
        <template #description>
          <span class="text-sm/relaxed" v-html="formatInline(block.text)" />
        </template>
      </UAlert>

      <figure v-else-if="block.kind === 'table'" class="space-y-1.5">
        <div class="table-scroll rounded-[var(--ui-radius)] border border-default">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-muted">
              <tr>
                <th
                  v-for="(cell, cellIndex) in block.head"
                  :key="cellIndex"
                  class="px-4 py-2.5 text-left font-medium text-highlighted whitespace-nowrap"
                  v-html="formatInline(cell)"
                />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowIndex) in block.rows"
                :key="rowIndex"
                class="border-t border-default align-top"
              >
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="cellIndex"
                  class="px-4 py-2.5 text-toned"
                  v-html="formatInline(cell)"
                />
              </tr>
            </tbody>
          </table>
        </div>
        <figcaption v-if="block.caption" class="text-xs text-dimmed">
          {{ block.caption }}
        </figcaption>
      </figure>

      <pre
        v-else-if="block.kind === 'code'"
        class="table-scroll p-4 rounded-[var(--ui-radius)] bg-muted border border-default text-xs/relaxed font-mono text-toned"
      >{{ block.text }}</pre>
    </template>
  </div>
</template>
