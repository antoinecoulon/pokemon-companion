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
const roster = useRoster()

/** Statut et slot effectifs : la composition jouée, pas celle de la fiche. */
const entry = computed(() => (mon.value ? roster.bySlug.value.get(mon.value.slug) : undefined))
const status = computed(() => entry.value?.status ?? mon.value?.status ?? 'retired')

/**
 * Un formulaire est proposé dès que le Pokémon est dans l'équipe : niveau, IV,
 * EV et objet ne dépendent d'aucun build. Sans cette règle, Excadrill et
 * Motisma-Lavage — les deux fiches `incomplete` de §7.3 — affichaient un anneau
 * de progression sur /equipe qu'aucune UI ne pouvait faire monter.
 */
const trackable = computed(() =>
  status.value === 'active' || !!mon.value?.builds?.length || !!mon.value?.tasks?.length,
)
</script>

<template>
  <div v-if="mon" class="space-y-10">
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

    <!-- En-tête. Le h1 est ici et non dans la barre du layout, qui affiche
         « Équipe » sur toutes les routes /equipe/*. -->
    <header class="space-y-4">
      <div class="flex items-start gap-5">
        <PokemonSprite :sheet="mon" variant="home" :size="128" class="hidden sm:block" />

        <div class="min-w-0 flex-1 space-y-3">
          <div class="flex items-start gap-2 flex-wrap">
            <PokemonSprite :sheet="mon" variant="pixel" :size="40" class="sm:hidden" />
            <h1 class="text-xl font-semibold tracking-tight text-highlighted">
              {{ mon.name }}
            </h1>
            <span v-if="mon.nameEn" class="text-sm text-dimmed self-center">({{ mon.nameEn }})</span>
            <UBadge v-if="entry?.slot" color="neutral" variant="subtle">
              slot {{ entry.slot }}
            </UBadge>
            <UBadge :color="STATUS_BADGE[status].color" variant="subtle">
              {{ STATUS_BADGE[status].label }}
            </UBadge>
            <!-- Prose du guide, masquée dès que la composition jouée s'en écarte. -->
            <UBadge v-if="mon.badge && status === mon.status" color="neutral" variant="outline">
              {{ mon.badge }}
            </UBadge>
          </div>

          <p class="text-sm leading-relaxed text-toned">
            {{ mon.role }}
          </p>

          <div class="flex flex-wrap items-center gap-1.5">
            <UBadge v-for="type in mon.types" :key="type" color="neutral" variant="outline">
              {{ type }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Stats de base -->
      <div v-if="mon.baseStats" class="space-y-2">
        <div class="grid grid-cols-6 gap-2">
          <div
            v-for="key in STAT_KEYS"
            :key="key"
            class="p-2 rounded-[var(--ui-radius)] bg-elevated/50 text-center"
          >
            <p class="text-[0.65rem] text-dimmed">
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
      <AppCard v-if="mon.mega" density="compact" tone="raised" class="space-y-3">
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
      </AppCard>

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
    <SectionBlock v-if="mon.analysis?.length" title="Analyse critique">
      <ContentBlocks :blocks="mon.analysis" />
    </SectionBlock>

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
    <SectionBlock v-if="mon.tasks?.length" :title="`TODO ${mon.name}`">
      <template #action>
        <span class="text-xs text-dimmed tabular-nums whitespace-nowrap">
          {{ forPokemon(mon).done }}/{{ forPokemon(mon).total }}
        </span>
      </template>
      <div class="rounded-[var(--ui-radius)] border border-default divide-y divide-default">
        <TaskItem
          v-for="task in mon.tasks"
          :key="task.id"
          :task="task"
          :blocked-by="blockersFor(task.id)"
          :route="task.link"
        />
      </div>
    </SectionBlock>
  </div>
</template>
