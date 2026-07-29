<script setup lang="ts">
import { counters } from '~/data/counters'
import { phases } from '~/data/phases'
import { activePokemon } from '~/data/pokemon'

useHead({ title: 'Accueil · Pokémon Companion' })

const { overall, byPhase, readyRatio } = useProgress()
const { next, actionable, blocked } = useNextActions()

const currentPhase = computed(() =>
  phases.find(phase => (byPhase.value.get(phase.id)?.percent ?? 100) < 100) ?? phases.at(-1),
)

const readyCount = computed(() => activePokemon.filter(mon => readyRatio(mon).percent === 100).length)
</script>

<template>
  <div class="space-y-8">
    <!-- Vue d'ensemble -->
    <section
      class="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-[var(--ui-radius)] border border-default bg-elevated/30"
    >
      <ProgressRing
        :percent="overall.percent"
        :size="112"
        :sublabel="`${overall.done}/${overall.total}`"
      />
      <div class="flex-1 space-y-2 text-center sm:text-left">
        <h2 class="text-lg font-semibold text-highlighted">
          Progression globale
        </h2>
        <p class="text-sm text-toned">
          {{ overall.done }} tâches sur {{ overall.total }} — la roadmap des 6 phases
          plus les fiches des {{ activePokemon.length }} membres de l’équipe.
        </p>
        <div class="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
          <UBadge v-if="currentPhase" color="primary" variant="subtle">
            Phase {{ currentPhase.number }} · {{ currentPhase.title }}
          </UBadge>
          <UBadge color="neutral" variant="subtle">
            {{ readyCount }}/{{ activePokemon.length }} Endgame Ready
          </UBadge>
          <UBadge v-if="blocked.length" color="warning" variant="subtle">
            {{ blocked.length }} tâches bloquées
          </UBadge>
        </div>
      </div>
    </section>

    <!-- Prochaines actions -->
    <section class="space-y-3">
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-base font-semibold text-highlighted">
          Prochaines actions
        </h2>
        <span class="text-xs text-dimmed">
          {{ actionable.length }} actionnable{{ actionable.length > 1 ? 's' : '' }}
        </span>
      </div>

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

      <p class="text-xs text-dimmed">
        Une tâche n’apparaît ici que si tous ses prérequis sont cochés — pas d’EV avant le Macho Brace
        amélioré, pas de Bottle Caps avant d’avoir lu les IV.
      </p>
    </section>

    <!-- Compteurs -->
    <section class="space-y-3">
      <h2 class="text-base font-semibold text-highlighted">
        Ressources
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <CounterCard v-for="counter in counters" :key="counter.id" :counter="counter" />
      </div>
    </section>

    <!-- Progression par phase -->
    <section class="space-y-3">
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-base font-semibold text-highlighted">
          Par phase
        </h2>
        <NuxtLink to="/roadmap" class="text-xs text-primary hover:underline">
          Voir la roadmap
        </NuxtLink>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <NuxtLink
          v-for="phase in phases"
          :key="phase.id"
          :to="`/roadmap#${phase.id}`"
          class="flex flex-col items-center gap-1 p-2 rounded-[var(--ui-radius)] border border-default hover:bg-elevated/60 transition-colors"
        >
          <ProgressRing
            :percent="byPhase.get(phase.id)?.percent ?? 0"
            :size="52"
            :thickness="5"
          />
          <span class="text-[0.65rem] text-muted text-center leading-tight">
            {{ phase.number }} · {{ phase.title }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Équipe -->
    <section class="space-y-3">
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-base font-semibold text-highlighted">
          Équipe
        </h2>
        <NuxtLink to="/equipe" class="text-xs text-primary hover:underline">
          Voir l’équipe
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <NuxtLink
          v-for="mon in activePokemon"
          :key="mon.slug"
          :to="`/equipe/${mon.slug}`"
          class="flex items-center gap-3 p-3 rounded-[var(--ui-radius)] border border-default hover:bg-elevated/60 transition-colors"
        >
          <ProgressRing :percent="readyRatio(mon).percent" :size="44" :thickness="4" />
          <div class="min-w-0">
            <p class="text-sm font-medium text-highlighted truncate">
              {{ mon.name }}
            </p>
            <p class="text-[0.65rem] text-dimmed tabular-nums">
              {{ readyRatio(mon).done }}/{{ readyRatio(mon).total }} critères
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
