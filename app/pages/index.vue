<script setup lang="ts">
import { counters } from '~/data/counters'
import { phases } from '~/data/phases'

useHead({ title: 'Accueil · Pokémon Companion' })

const { overall, completion, byPhase, readyRatio } = useProgress()
const { next, actionable, blocked } = useNextActions()
const { active } = useRoster()

const currentPhase = computed(() =>
  phases.find(phase => (byPhase.value.get(phase.id)?.percent ?? 100) < 100) ?? phases.at(-1),
)

const readyCount = computed(() => active.value.filter(entry => readyRatio(entry.sheet).percent === 100).length)
</script>

<template>
  <div class="space-y-10">
    <!-- Vue d'ensemble -->
    <AppCard tone="raised">
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing
          :percent="overall.percent"
          :size="112"
          :sublabel="`${overall.done}/${overall.total}`"
        />
        <div class="flex-1 space-y-3 text-center sm:text-left">
          <h2 class="text-lg font-semibold tracking-tight text-highlighted">
            Progression globale
          </h2>
          <p class="text-sm leading-relaxed text-toned">
            {{ overall.done }} tâches sur {{ overall.total }} — la roadmap des 6 phases
            plus les fiches des {{ active.length }} membres de l’équipe.
          </p>
          <div class="flex flex-wrap justify-center sm:justify-start gap-2">
            <UBadge v-if="currentPhase" color="primary" variant="subtle">
              Phase {{ currentPhase.number }} · {{ currentPhase.title }}
            </UBadge>
            <UBadge color="neutral" variant="subtle">
              {{ readyCount }}/{{ active.length }} Endgame Ready
            </UBadge>
            <UBadge v-if="blocked.length" color="warning" variant="subtle">
              {{ blocked.length }} tâches bloquées
            </UBadge>
            <!--
              Compteur séparé, et pas fondu dans l'anneau : la complétion mesure
              ce qu'il reste à voir du jeu, la roadmap ce qu'il reste à faire pour
              la Frontier. Les additionner diluerait les deux.
            -->
            <!--
              NuxtLink autour du badge, et pas `:to` dessus : UBadge ignore la
              prop et rend un <span>, donc un badge d'apparence cliquable qui ne
              navigue nulle part — sans la moindre erreur.
            -->
            <NuxtLink to="/completion">
              <UBadge color="neutral" variant="subtle" icon="i-lucide-trophy" class="hover:bg-elevated">
                Complétion {{ completion.percent }} %
              </UBadge>
            </NuxtLink>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Prochaines actions -->
    <SectionBlock
      title="Prochaines actions"
      description="Une tâche n’apparaît ici que si tous ses prérequis sont cochés — pas d’EV avant le Macho Brace amélioré, pas de Bottle Caps avant d’avoir lu les IV."
    >
      <template #action>
        <span class="text-xs text-dimmed whitespace-nowrap">
          {{ actionable.length }} actionnable{{ actionable.length > 1 ? 's' : '' }}
        </span>
      </template>

      <div
        v-if="next.length"
        class="rounded-[var(--ui-radius)] border border-default divide-y divide-default"
      >
        <TaskItem
          v-for="entry in next"
          :key="entry.task.id"
          :task="entry.task"
          :origin="entry.originLabel"
          :route="entry.route"
        />
      </div>

      <UAlert
        v-else
        color="success"
        variant="subtle"
        icon="i-lucide-party-popper"
        title="Plus rien d’actionnable"
        :description="blocked.length
          ? `Il reste ${blocked.length} tâches, mais toutes attendent un prérequis. Regarde la Roadmap pour voir ce qui les bloque.`
          : 'Tout est coché. Direction le Battle Frontier.'"
      />
    </SectionBlock>

    <!-- Compteurs -->
    <SectionBlock title="Ressources">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CounterCard v-for="counter in counters" :key="counter.id" :counter="counter" />
      </div>
    </SectionBlock>

    <!-- Progression par phase -->
    <SectionBlock title="Par phase">
      <template #action>
        <NuxtLink to="/roadmap" class="text-xs text-primary hover:underline whitespace-nowrap">
          Voir la roadmap
        </NuxtLink>
      </template>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <NuxtLink
          v-for="phase in phases"
          :key="phase.id"
          :to="`/roadmap#${phase.id}`"
          class="flex flex-col items-center gap-2 p-3 rounded-[var(--ui-radius)] border border-default hover:border-inverted/20 hover:bg-elevated/60 transition-colors"
        >
          <ProgressRing
            :percent="byPhase.get(phase.id)?.percent ?? 0"
            :size="52"
            :thickness="5"
          />
          <span class="text-[0.7rem] text-muted text-center leading-tight">
            {{ phase.number }} · {{ phase.title }}
          </span>
        </NuxtLink>
      </div>
    </SectionBlock>

    <!-- Équipe -->
    <SectionBlock title="Équipe">
      <template #action>
        <NuxtLink to="/equipe" class="text-xs text-primary hover:underline whitespace-nowrap">
          Voir l’équipe
        </NuxtLink>
      </template>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <AppCard
          v-for="{ sheet: mon } in active"
          :key="mon.slug"
          :to="`/equipe/${mon.slug}`"
          density="compact"
        >
          <div class="flex items-center gap-3">
            <ProgressRing :percent="readyRatio(mon).percent" :size="44" :thickness="4" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-highlighted truncate">
                {{ mon.name }}
              </p>
              <p class="text-[0.7rem] text-dimmed tabular-nums">
                {{ readyRatio(mon).done }}/{{ readyRatio(mon).total }} critères
              </p>
            </div>
          </div>
        </AppCard>
      </div>
    </SectionBlock>
  </div>
</template>
