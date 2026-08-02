<script setup lang="ts">

useHead({ title: 'Accueil · Pokémon Companion' })

const { current } = useGame()
const { overall, completion, byCompletionSection, readyRatio } = useProgress()
const { next, actionable, blocked } = useNextActions()
const { active } = useRoster()

/*
 * Les six groupes les plus loin d'être finis. La roadmap donnait ce rôle aux
 * phases, dans un ordre imposé ; la complétion n'en a pas, donc c'est le reste
 * à faire qui classe — voir beaucoup de groupes à 100 % n'apprend rien.
 */
const counters = computed(() => current.value.content.counters)

/*
 * Les textes qui nomment le contenu du jeu, avec des replis **neutres**.
 *
 * Ils étaient en dur, en vocabulaire d'Unbound : le dashboard d'un autre jeu
 * parlait de ses missions, de sa Frontier et de ses Bottle Caps. Un repli
 * emprunté à un jeu précis reproduirait le bug, d'où des replis qui ne nomment
 * rien.
 */
const copy = computed(() => ({
  completionSummary: current.value.content.dashboard?.completionSummary ?? '.',
  overallLabel: current.value.content.dashboard?.overallLabel ?? 'Progression suivie',
  nextActionsHint: current.value.content.dashboard?.nextActionsHint
    ?? 'Une tâche n’apparaît ici que si tous ses prérequis sont cochés.',
  allDone: current.value.content.dashboard?.allDone ?? 'Tout est coché.',
}))

const topGroups = computed(() =>
  current.value.content.completionGroups
    .map(group => ({ group, ratio: byCompletionSection.value.get(group.id) }))
    .filter(item => (item.ratio?.percent ?? 100) < 100)
    .sort((a, b) => (a.ratio?.percent ?? 0) - (b.ratio?.percent ?? 0))
    .slice(0, 6),
)

const readyCount = computed(() => active.value.filter(entry => readyRatio(entry.sheet).percent === 100).length)
</script>

<template>
  <div class="space-y-10">
    <!-- Vue d'ensemble -->
    <AppCard tone="raised">
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <!--
          L'anneau porte la complétion depuis le retrait de la roadmap : c'est
          elle qui mesure ce qu'il reste à faire du jeu. `overall` ne compte plus
          que la Frontier et l'optimisation d'équipe, et passe en badge.
        -->
        <ProgressRing
          :percent="completion.percent"
          :size="112"
          :sublabel="`${completion.done}/${completion.total}`"
        />
        <div class="flex-1 space-y-3 text-center sm:text-left">
          <h2 class="text-lg font-semibold tracking-tight text-highlighted">
            Complétion
          </h2>
          <p class="text-sm leading-relaxed text-toned">
            {{ completion.done }} entrées sur {{ completion.total }}{{ copy.completionSummary }}
          </p>
          <div class="flex flex-wrap justify-center sm:justify-start gap-2">
            <!--
              NuxtLink autour du badge, et pas `:to` dessus : UBadge ignore la
              prop et rend un <span>, donc un badge d'apparence cliquable qui ne
              navigue nulle part — sans la moindre erreur.
            -->
            <NuxtLink :to="`${current.basePath}/completion`">
              <!--
                Le compte plutôt que le pourcentage : « 12 tâches sur 88 »
                situe l'effort restant, là où « 14 % » ne dit pas s'il reste
                trois cases ou trente.
              -->
              <UBadge color="primary" variant="subtle" icon="i-lucide-swords" class="hover:bg-elevated">
                {{ copy.overallLabel }} — {{ overall.done }} tâches sur {{ overall.total }}
              </UBadge>
            </NuxtLink>
            <UBadge color="neutral" variant="subtle">
              {{ readyCount }}/{{ active.length }} Endgame Ready
            </UBadge>
            <UBadge v-if="blocked.length" color="warning" variant="subtle">
              {{ blocked.length }} tâches bloquées
            </UBadge>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Prochaines actions -->
    <SectionBlock
      title="Prochaines actions"
      :description="copy.nextActionsHint"
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
          ? `Il reste ${blocked.length} tâches, mais toutes attendent un prérequis. Regarde la Complétion pour voir ce qui les bloque.`
          : copy.allDone"
      />
    </SectionBlock>

    <!-- Compteurs -->
    <SectionBlock title="Ressources">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CounterCard v-for="counter in counters" :key="counter.id" :counter="counter" />
      </div>
    </SectionBlock>

    <!-- Ce qu'il reste à compléter -->
    <SectionBlock v-if="topGroups.length" title="Ce qu’il reste à faire">
      <template #action>
        <NuxtLink :to="`${current.basePath}/completion`" class="text-xs text-primary hover:underline whitespace-nowrap">
          Voir la complétion
        </NuxtLink>
      </template>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <NuxtLink
          v-for="{ group, ratio } in topGroups"
          :key="group.id"
          :to="`/completion#${group.id}`"
          class="flex flex-col items-center gap-2 p-3 rounded-[var(--ui-radius)] border border-default hover:border-inverted/20 hover:bg-elevated/60 transition-colors"
        >
          <ProgressRing :percent="ratio?.percent ?? 0" :size="52" :thickness="5" />
          <span class="text-[0.7rem] text-muted text-center leading-tight">
            {{ group.title }}
          </span>
        </NuxtLink>
      </div>
    </SectionBlock>

    <!-- Équipe -->
    <SectionBlock title="Équipe">
      <template #action>
        <NuxtLink :to="`${current.basePath}/equipe`" class="text-xs text-primary hover:underline whitespace-nowrap">
          Voir l’équipe
        </NuxtLink>
      </template>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <AppCard
          v-for="{ sheet: mon } in active"
          :key="mon.slug"
          :to="`${current.basePath}/equipe/${mon.slug}`"
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
