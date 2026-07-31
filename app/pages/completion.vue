<script setup lang="ts">
import type { CompletionGoal, ResourceKey } from '~/data/types'
import { completionSections } from '~/data/completion'

useHead({ title: 'Complétion · Pokémon Companion' })

const { isAcquired, setAcquired } = useSave()
const { completion, byCompletionSection } = useProgress()

function keyOf(goal: CompletionGoal): ResourceKey {
  return `goal:${goal.id}`
}

function toggle(key: ResourceKey, value: unknown) {
  setAcquired(key, Boolean(value))
}

/*
 * Même motif que les PNJ de /ressources : ce qui est fait descend dans le repli
 * de sa section. Sur vingt légendaires, garder les cochés en tête noierait les
 * quelques-uns qui restent.
 */
function pending(goals: CompletionGoal[]) {
  return goals.filter(goal => !isAcquired(keyOf(goal)))
}

function acquired(goals: CompletionGoal[]) {
  return goals.filter(goal => isAcquired(keyOf(goal)))
}

/** `label` est en markdown inline ; l'attribut aria le veut en texte brut. */
function plain(label: string) {
  return label.replace(/\*/g, '')
}

/** Une source est soit un renvoi au guide (« §9.1 »), soit l'URL consultée. */
function sourceLabel(source: string) {
  if (source.startsWith('§')) return `Guide ${source}`
  return source.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

const hideDone = ref(false)
</script>

<template>
  <div class="space-y-10">
    <!-- Vue d'ensemble -->
    <AppCard tone="raised">
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing
          :percent="completion.percent"
          :size="112"
          :sublabel="`${completion.done}/${completion.total}`"
        />
        <div class="flex-1 space-y-3 text-center sm:text-left">
          <h2 class="text-lg font-semibold tracking-tight text-highlighted">
            Complétion post-game
          </h2>
          <p class="text-sm leading-relaxed text-toned">
            Ce que le jeu propose après la Ligue, en dehors de l’optimisation d’équipe.
            <strong class="text-highlighted">Ce compteur est indépendant de la roadmap</strong> —
            cocher ici ne fait pas bouger la progression des phases, et inversement.
          </p>
          <div class="flex flex-wrap justify-center sm:justify-start items-center gap-2">
            <UBadge color="neutral" variant="subtle">
              {{ completion.total }} objectifs
            </UBadge>
            <USwitch v-model="hideDone" label="Masquer ce qui est fait" size="sm" />
          </div>
        </div>
      </div>
    </AppCard>

    <SectionBlock
      v-for="section in completionSections"
      :key="section.id"
      :title="section.title"
      :description="section.description"
    >
      <template #action>
        <span class="text-xs text-dimmed whitespace-nowrap tabular-nums">
          {{ byCompletionSection.get(section.id)?.done ?? 0 }}/{{ section.goals.length }}
        </span>
      </template>

      <div v-if="pending(section.goals).length" class="grid sm:grid-cols-2 gap-4">
        <AppCard
          v-for="goal in pending(section.goals)"
          :key="goal.id"
          density="compact"
          class="space-y-2"
        >
          <div class="flex items-start gap-3">
            <UCheckbox
              :model-value="isAcquired(keyOf(goal))"
              :aria-label="`Marquer comme fait : ${plain(goal.label)}`"
              class="mt-0.5 shrink-0"
              @update:model-value="toggle(keyOf(goal), $event)"
            />
            <h3 class="text-sm font-medium text-highlighted flex-1" v-html="formatInline(goal.label)" />
            <UBadge v-if="goal.optional" color="neutral" variant="subtle" size="sm" class="shrink-0">
              optionnel
            </UBadge>
          </div>

          <div class="pl-7 space-y-1.5">
            <p v-if="goal.location" class="text-[0.8125rem] leading-relaxed text-toned" v-html="formatInline(goal.location)" />
            <p v-if="goal.reward" class="text-xs text-primary" v-html="formatInline(goal.reward)" />
            <p
              v-for="(detail, index) in goal.details"
              :key="index"
              class="text-xs leading-relaxed text-dimmed"
              v-html="formatInline(detail)"
            />
            <p class="text-[0.6875rem] text-dimmed/80 break-all">
              {{ sourceLabel(goal.source) }}
            </p>
          </div>
        </AppCard>
      </div>

      <p v-else class="text-sm text-dimmed">
        Section terminée.
      </p>

      <ResourceArchive
        v-if="acquired(section.goals).length && !hideDone"
        :label="`Déjà fait (${acquired(section.goals).length})`"
      >
        <li v-for="goal in acquired(section.goals)" :key="goal.id" class="flex items-start gap-3">
          <UCheckbox
            :model-value="isAcquired(keyOf(goal))"
            :aria-label="`Marquer comme non fait : ${plain(goal.label)}`"
            class="mt-0.5 shrink-0"
            @update:model-value="toggle(keyOf(goal), $event)"
          />
          <div class="min-w-0">
            <p class="text-[0.8125rem] text-muted line-through decoration-1" v-html="formatInline(goal.label)" />
            <p v-if="goal.location" class="text-xs text-dimmed" v-html="formatInline(goal.location)" />
          </div>
        </li>
      </ResourceArchive>
    </SectionBlock>
  </div>
</template>
