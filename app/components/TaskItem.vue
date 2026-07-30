<script setup lang="ts">
import type { Task } from '~/data/types'

const props = defineProps<{
  task: Task
  /** Prérequis non satisfaits. Non vide = tâche verrouillée. */
  blockedBy?: { id: string, label: string }[]
  /** Origine affichée à droite (utilisé sur le dashboard). */
  origin?: string
  /** Route à ouvrir ; par défaut celle de la tâche. */
  route?: string
}>()

const { isDone, toggleDone } = useSave()

const done = computed(() => isDone(props.task.id))
const blocked = computed(() => (props.blockedBy?.length ?? 0) > 0 && !done.value)
const target = computed(() => props.route ?? props.task.link)
</script>

<template>
  <div
    class="flex gap-3.5 px-4 py-4 rounded-[var(--ui-radius)] transition-colors"
    :class="[
      done ? 'bg-elevated/40' : 'hover:bg-elevated/60',
      blocked && 'opacity-70',
    ]"
  >
    <UCheckbox
      :model-value="done"
      :aria-label="`Marquer comme fait : ${task.label.replace(/\*/g, '')}`"
      class="mt-0.5 shrink-0"
      @update:model-value="toggleDone(task.id)"
    />

    <div class="min-w-0 flex-1 space-y-2.5">
      <div class="flex items-start gap-2">
        <p
          class="text-sm/relaxed flex-1"
          :class="done ? 'text-dimmed line-through decoration-1' : 'text-toned'"
          v-html="formatInline(task.label)"
        />
        <UIcon
          v-if="task.key"
          name="i-lucide-key-round"
          class="size-4 mt-0.5 shrink-0 text-secondary"
          aria-label="Tâche clé"
        />
      </div>

      <ul v-if="task.details?.length" class="pl-4 space-y-1.5 list-disc marker:text-dimmed">
        <li
          v-for="(detail, index) in task.details"
          :key="index"
          class="text-[0.8125rem]/relaxed"
          :class="done ? 'text-dimmed' : 'text-muted'"
          v-html="formatInline(detail)"
        />
      </ul>

      <div v-if="blocked" class="flex items-start gap-1.5 text-xs text-warning">
        <UIcon name="i-lucide-lock" class="size-3.5 mt-0.5 shrink-0" />
        <span>
          Bloqué par
          <span
            v-for="(blocker, index) in blockedBy"
            :key="blocker.id"
          >{{ index > 0 ? ' · ' : ' ' }}<span
            class="underline decoration-dotted"
            v-html="formatInline(blocker.label.split('.')[0]?.slice(0, 70) ?? blocker.id)"
          /></span>
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dimmed">
        <NuxtLink
          v-if="target"
          :to="target"
          class="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <UIcon name="i-lucide-arrow-right" class="size-3.5" />
          {{ origin ?? 'Ouvrir' }}
        </NuxtLink>
        <span v-else-if="origin">{{ origin }}</span>
        <span v-if="task.ref">{{ task.ref }}</span>
      </div>
    </div>
  </div>
</template>
