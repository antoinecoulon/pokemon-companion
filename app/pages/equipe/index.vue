<script setup lang="ts">
import { activePokemon, retiredPokemon, utilityPokemon } from '~/data/pokemon'
import type { PokemonSheet } from '~/data/types'

useHead({ title: 'Équipe · Pokémon Companion' })

const { readyRatio, forPokemon } = useProgress()

const badgeColor = (badge?: string) =>
  badge === 'Nouveau' ? 'secondary' : badge?.startsWith('Sorti') ? 'neutral' : 'success'

/*
 * Sortis et utilitaires partagent un même bandeau : dans les deux cas ce sont
 * des fiches de référence, pas du travail en cours. Le badge dit laquelle est
 * laquelle — il dérive du `status`, les seules catégories que le guide définit.
 */
const others = computed<PokemonSheet[]>(() => [...retiredPokemon, ...utilityPokemon])

const statusLabel: Record<PokemonSheet['status'], string> = {
  active: 'Actif',
  retired: 'Sorti de l’équipe',
  utility: 'Utilitaire',
}
</script>

<template>
  <div class="space-y-10">
    <!-- Composition finale : le sujet de la page -->
    <SectionBlock
      title="Composition finale validée"
      description="Les 6 slots de §7.3. L’anneau indique les critères « Endgame Ready » atteints."
    >
      <div class="grid lg:grid-cols-2 gap-4">
        <AppCard
          v-for="mon in activePokemon"
          :key="mon.slug"
          :to="`/equipe/${mon.slug}`"
        >
          <div class="flex items-start gap-4">
            <PokemonSprite :sheet="mon" variant="home" :size="88" />

            <div class="min-w-0 flex-1 space-y-2.5">
              <div class="flex items-baseline gap-2 flex-wrap">
                <span class="text-xs text-dimmed tabular-nums">#{{ mon.slot }}</span>
                <h3 class="text-base font-semibold tracking-tight text-highlighted">
                  {{ mon.name }}
                </h3>
                <UBadge v-if="mon.badge" :color="badgeColor(mon.badge)" variant="subtle" size="sm">
                  {{ mon.badge }}
                </UBadge>
                <UBadge v-if="mon.incomplete" color="warning" variant="subtle" size="sm">
                  fiche à compléter
                </UBadge>
              </div>

              <p class="text-[0.8125rem] leading-relaxed text-toned">
                {{ mon.role }}
              </p>

              <div class="flex flex-wrap items-center gap-1.5">
                <UBadge v-for="type in mon.types" :key="type" color="neutral" variant="outline" size="sm">
                  {{ type }}
                </UBadge>
              </div>
            </div>

            <div class="shrink-0 flex flex-col items-center gap-1.5">
              <ProgressRing
                :percent="readyRatio(mon).percent"
                :size="60"
                :thickness="6"
                :sublabel="`${readyRatio(mon).done}/${readyRatio(mon).total}`"
              />
              <p v-if="mon.tasks?.length" class="text-[0.7rem] text-dimmed tabular-nums whitespace-nowrap">
                TODO {{ forPokemon(mon).done }}/{{ forPokemon(mon).total }}
              </p>
            </div>
          </div>
        </AppCard>
      </div>
    </SectionBlock>

    <!-- Le reste de la boîte, en second plan -->
    <SectionBlock
      title="Autres Pokémon enregistrés"
      description="Fiches conservées pour référence : elles ne comptent pas dans la progression globale."
    >
      <!--
        Défilement horizontal dans son propre conteneur : la page, elle, ne doit
        jamais déborder — le smoke test échoue dessus. `tabindex` rend le
        bandeau atteignable et défilable au clavier.
      -->
      <div
        class="table-scroll -mx-4 px-4 sm:mx-0 sm:px-0 focus-visible:outline-2 focus-visible:outline-primary rounded-[var(--ui-radius)]"
        tabindex="0"
        role="group"
        aria-label="Autres Pokémon enregistrés"
      >
        <ul class="flex gap-3 pb-1 w-max">
          <li v-for="mon in others" :key="mon.slug">
            <AppCard :to="`/equipe/${mon.slug}`" density="compact" class="w-56 h-full">
              <div class="flex items-center gap-3">
                <PokemonSprite :sheet="mon" variant="pixel" :size="48" />
                <div class="min-w-0 space-y-1.5">
                  <h3 class="text-sm font-medium text-highlighted truncate">
                    {{ mon.name }}
                  </h3>
                  <UBadge
                    :color="mon.status === 'utility' ? 'info' : 'neutral'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ statusLabel[mon.status] }}
                  </UBadge>
                </div>
              </div>
              <p class="mt-3 text-xs leading-relaxed text-dimmed line-clamp-2">
                {{ mon.role }}
              </p>
            </AppCard>
          </li>
        </ul>
      </div>

      <p class="text-xs text-dimmed">
        §6.7 — les utilitaires ne combattent pas : ils font gagner des dizaines d’heures sur la capture
        et le farm.
      </p>
    </SectionBlock>
  </div>
</template>
