<script setup lang="ts">
import { pokemonBySlug } from '~/data/pokemon'

const route = useRoute('equipe-slug')
const mon = computed(() => pokemonBySlug.get(String(route.params.slug)))

if (!mon.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pokémon inconnu', fatal: true })
}

useHead({ title: () => `${mon.value?.name ?? 'Fiche'} · Pokémon Companion` })

const { forPokemon } = useProgress()
const { blockersFor } = useNextActions()

const badgeColor = computed(() =>
  mon.value?.badge === 'Nouveau' ? 'secondary' : mon.value?.badge?.startsWith('Sorti') ? 'neutral' : 'success',
)

/** Une fiche sans build ni TODO n'a pas de formulaire à proposer. */
const trackable = computed(() => !!mon.value?.builds?.length || !!mon.value?.tasks?.length)
</script>

<template>
  <div v-if="mon" class="space-y-7">
    <UButton
      to="/equipe"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="link"
      size="sm"
      class="-ml-2"
    >
      Équipe
    </UButton>

    <!-- En-tête -->
    <header class="space-y-3">
      <div class="flex items-start gap-2 flex-wrap">
        <h1 class="text-xl font-semibold text-highlighted">
          {{ mon.name }}
        </h1>
        <span v-if="mon.nameEn" class="text-sm text-dimmed self-center">({{ mon.nameEn }})</span>
        <UBadge v-if="mon.slot" color="neutral" variant="subtle">
          slot {{ mon.slot }}
        </UBadge>
        <UBadge v-if="mon.badge" :color="badgeColor" variant="subtle">
          {{ mon.badge }}
        </UBadge>
      </div>

      <p class="text-sm text-toned">
        {{ mon.role }}
      </p>

      <div class="flex flex-wrap items-center gap-1.5">
        <UBadge v-for="type in mon.types" :key="type" color="neutral" variant="outline">
          {{ type }}
        </UBadge>
      </div>

      <!-- Stats de base -->
      <div v-if="mon.baseStats" class="space-y-1.5">
        <div class="grid grid-cols-6 gap-1.5">
          <div
            v-for="key in STAT_KEYS"
            :key="key"
            class="p-1.5 rounded-[var(--ui-radius)] bg-elevated/50 text-center"
          >
            <p class="text-[0.6rem] text-dimmed">
              {{ STAT_LABELS[key] }}
            </p>
            <p class="text-sm font-semibold tabular-nums text-highlighted">
              {{ mon.baseStats[key] }}
            </p>
          </div>
        </div>
        <p class="text-xs text-dimmed tabular-nums">
          BST {{ mon.bst }}
        </p>
      </div>

      <!-- Talents -->
      <div v-if="mon.abilities?.length" class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs text-dimmed">Talents</span>
        <UBadge
          v-for="ability in mon.abilities"
          :key="ability.name"
          :color="ability.name === mon.targetAbility ? 'primary' : 'neutral'"
          variant="subtle"
          size="sm"
        >
          {{ ability.name }}{{ ability.hidden ? ' · caché' : '' }}
        </UBadge>
      </div>

      <!-- Méga -->
      <div
        v-if="mon.mega"
        class="p-3 rounded-[var(--ui-radius)] border border-default bg-elevated/30 space-y-2"
      >
        <p class="text-xs font-medium text-toned">
          Méga-Évolution · {{ mon.mega.stone }}
        </p>
        <div class="grid grid-cols-6 gap-1.5">
          <div
            v-for="key in STAT_KEYS"
            :key="key"
            class="text-center"
          >
            <p class="text-[0.6rem] text-dimmed">
              {{ STAT_LABELS[key] }}
            </p>
            <p
              class="text-sm font-semibold tabular-nums"
              :class="mon.baseStats && mon.mega.stats[key] > mon.baseStats[key]
                ? 'text-success'
                : 'text-highlighted'"
            >
              {{ mon.mega.stats[key] }}
            </p>
          </div>
        </div>
        <p class="text-xs text-dimmed tabular-nums">
          BST {{ mon.mega.bst }}
        </p>
        <p v-if="mon.mega.note" class="text-xs text-muted" v-html="formatInline(mon.mega.note)" />
      </div>

      <p v-if="mon.obtention" class="text-xs text-muted" v-html="`<span class='text-dimmed'>Obtention — </span>${formatInline(mon.obtention)}`" />
    </header>

    <UAlert
      v-if="mon.incomplete"
      color="warning"
      variant="subtle"
      icon="i-lucide-file-question"
      title="Fiche incomplète dans le guide source"
      :description="mon.incompleteNote"
    />

    <!-- Mises au point -->
    <section v-if="mon.preamble?.length" class="space-y-3">
      <ContentBlocks :blocks="mon.preamble" />
    </section>

    <!-- Analyse -->
    <section v-if="mon.analysis?.length" class="space-y-3">
      <h2 class="text-base font-semibold text-highlighted">
        Analyse critique
      </h2>
      <ContentBlocks :blocks="mon.analysis" />
    </section>

    <!-- Contenu libre (utilitaires §6.7) -->
    <section v-if="mon.extra?.length" class="space-y-3">
      <ContentBlocks :blocks="mon.extra" />
    </section>

    <!-- Formulaire + checklist -->
    <template v-if="trackable">
      <USeparator />

      <section class="space-y-5">
        <PokemonForm :mon="mon" />
      </section>

      <USeparator />

      <section>
        <ReadinessChecklist :mon="mon" />
      </section>
    </template>

    <!-- TODO de la fiche -->
    <section v-if="mon.tasks?.length" class="space-y-3">
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-base font-semibold text-highlighted">
          TODO {{ mon.name }}
        </h2>
        <span class="text-xs text-dimmed tabular-nums">
          {{ forPokemon(mon).done }}/{{ forPokemon(mon).total }}
        </span>
      </div>
      <div class="rounded-[var(--ui-radius)] border border-default divide-y divide-default">
        <TaskItem
          v-for="task in mon.tasks"
          :key="task.id"
          :task="task"
          :blocked-by="blockersFor(task.id)"
          :route="task.link"
        />
      </div>
    </section>
  </div>
</template>
