<script setup lang="ts">
import { activePokemon, retiredPokemon, utilityPokemon } from '~/data/pokemon'

useHead({ title: 'Équipe · Pokémon Companion' })

const { readyRatio, forPokemon } = useProgress()

const badgeColor = (badge?: string) =>
  badge === 'Nouveau' ? 'secondary' : badge?.startsWith('Sorti') ? 'neutral' : 'success'
</script>

<template>
  <div class="space-y-8">
    <!-- Composition finale -->
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          Composition finale validée
        </h2>
        <p class="text-sm text-muted">
          Les 6 slots de §7.3. L’anneau indique les critères « Endgame Ready » atteints.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        <NuxtLink
          v-for="mon in activePokemon"
          :key="mon.slug"
          :to="`/equipe/${mon.slug}`"
          class="flex gap-4 p-4 rounded-[var(--ui-radius)] border border-default hover:bg-elevated/60 transition-colors"
        >
          <ProgressRing
            :percent="readyRatio(mon).percent"
            :size="60"
            :thickness="6"
            :sublabel="`${readyRatio(mon).done}/${readyRatio(mon).total}`"
          />
          <div class="min-w-0 flex-1 space-y-1">
            <div class="flex items-start gap-2 flex-wrap">
              <span class="text-xs text-dimmed tabular-nums">#{{ mon.slot }}</span>
              <h3 class="text-sm font-semibold text-highlighted">
                {{ mon.name }}
              </h3>
              <UBadge v-if="mon.badge" :color="badgeColor(mon.badge)" variant="subtle" size="sm">
                {{ mon.badge }}
              </UBadge>
              <UBadge v-if="mon.incomplete" color="warning" variant="subtle" size="sm">
                fiche à compléter
              </UBadge>
            </div>
            <p class="text-xs text-toned">
              {{ mon.role }}
            </p>
            <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
              <UBadge v-for="type in mon.types" :key="type" color="neutral" variant="outline" size="sm">
                {{ type }}
              </UBadge>
            </div>
            <p v-if="mon.tasks?.length" class="text-[0.65rem] text-dimmed tabular-nums pt-0.5">
              TODO {{ forPokemon(mon).done }}/{{ forPokemon(mon).total }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Sortis -->
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          Sortis de l’équipe
        </h2>
        <p class="text-sm text-muted">
          Fiches conservées pour référence. Elles ne comptent pas dans la progression globale.
        </p>
      </div>
      <div class="grid sm:grid-cols-3 gap-3">
        <NuxtLink
          v-for="mon in retiredPokemon"
          :key="mon.slug"
          :to="`/equipe/${mon.slug}`"
          class="p-3 rounded-[var(--ui-radius)] border border-default hover:bg-elevated/60 transition-colors space-y-1"
        >
          <h3 class="text-sm font-medium text-toned">
            {{ mon.name }}
          </h3>
          <p class="text-xs text-dimmed">
            {{ mon.role }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- Utilitaires -->
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold text-highlighted">
          Utilitaires en boîte
        </h2>
        <p class="text-sm text-muted">
          §6.7 — ils ne combattent pas, ils font gagner des dizaines d’heures sur la capture et le farm.
        </p>
      </div>
      <div class="grid sm:grid-cols-3 gap-3">
        <NuxtLink
          v-for="mon in utilityPokemon"
          :key="mon.slug"
          :to="`/equipe/${mon.slug}`"
          class="p-3 rounded-[var(--ui-radius)] border border-default hover:bg-elevated/60 transition-colors space-y-1"
        >
          <h3 class="text-sm font-medium text-toned">
            {{ mon.name }}
          </h3>
          <p class="text-xs text-dimmed">
            {{ mon.role }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
