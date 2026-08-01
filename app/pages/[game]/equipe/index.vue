<script setup lang="ts">
useHead({ title: 'Équipe · Pokémon Companion' })

const { current } = useGame()
const { readyRatio, forPokemon } = useProgress()
const roster = useRoster()

const editing = ref(false)

/*
 * Les fiches que le guide laisse en plan (§6 ne couvre ni Excadrill ni
 * Rotom-Wash, que §7.3 place pourtant dans l'équipe). Les réunir ici en fait
 * une liste de travail — c'est exactement ce que `pnpm import:pokemon` sert à
 * combler, une fois la fiche rédigée à partir du guide.
 */
const incomplete = computed(() => roster.entries.value.filter(entry => entry.sheet.incomplete))
</script>

<template>
  <div class="space-y-10">
    <!-- Composition finale : le sujet de la page -->
    <SectionBlock
      title="Composition finale validée"
      description="Les 6 slots de §7.3. L’anneau indique les critères « Endgame Ready » atteints."
    >
      <template #action>
        <UButton
          icon="i-lucide-arrow-left-right"
          color="neutral"
          variant="subtle"
          size="xs"
          @click="editing = true"
        >
          Modifier
        </UButton>
      </template>

      <UAlert
        v-if="roster.modified.value"
        color="info"
        variant="subtle"
        icon="i-lucide-info"
        title="Composition modifiée"
        description="Elle s’écarte de celle du guide (§7.3). La progression globale suit l’équipe réellement jouée."
        :actions="[{
          label: 'Revenir à celle du guide',
          color: 'neutral',
          variant: 'subtle',
          onClick: () => roster.reset(),
        }]"
      />

      <div class="grid lg:grid-cols-2 gap-4">
        <AppCard
          v-for="entry in roster.active.value"
          :key="entry.sheet.slug"
          :to="`${current.basePath}/equipe/${entry.sheet.slug}`"
        >
          <div class="flex items-start gap-4">
            <PokemonSprite :sheet="entry.sheet" variant="home" :size="88" />

            <div class="min-w-0 flex-1 space-y-2.5">
              <div class="flex items-baseline gap-2 flex-wrap">
                <span class="text-xs text-dimmed tabular-nums">#{{ entry.slot }}</span>
                <h3 class="text-base font-semibold tracking-tight text-highlighted">
                  {{ entry.sheet.name }}
                </h3>
                <!--
                  `badge` est de la prose du guide : on ne l'affiche que si la
                  composition jouée est encore celle du guide, sinon « Conservé »
                  contredirait un échange qu'on vient de faire.
                -->
                <UBadge
                  v-if="entry.sheet.badge && entry.status === entry.sheet.status"
                  color="neutral"
                  variant="outline"
                  size="sm"
                >
                  {{ entry.sheet.badge }}
                </UBadge>
                <UBadge v-if="entry.sheet.incomplete" color="warning" variant="subtle" size="sm">
                  fiche à compléter
                </UBadge>
              </div>

              <p class="text-[0.8125rem] leading-relaxed text-toned">
                {{ entry.sheet.role }}
              </p>

              <div class="flex flex-wrap items-center gap-1.5">
                <UBadge v-for="type in entry.sheet.types" :key="type" color="neutral" variant="outline" size="sm">
                  {{ type }}
                </UBadge>
              </div>
            </div>

            <div class="shrink-0 flex flex-col items-center gap-1.5">
              <ProgressRing
                :percent="readyRatio(entry.sheet).percent"
                :size="60"
                :thickness="6"
                :sublabel="`${readyRatio(entry.sheet).done}/${readyRatio(entry.sheet).total}`"
              />
              <p v-if="entry.sheet.tasks?.length" class="text-[0.7rem] text-dimmed tabular-nums whitespace-nowrap">
                TODO {{ forPokemon(entry.sheet).done }}/{{ forPokemon(entry.sheet).total }}
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
          <li v-for="entry in roster.others.value" :key="entry.sheet.slug">
            <AppCard :to="`${current.basePath}/equipe/${entry.sheet.slug}`" density="compact" class="w-56 h-full">
              <div class="flex items-center gap-3">
                <PokemonSprite :sheet="entry.sheet" variant="pixel" :size="48" />
                <div class="min-w-0 space-y-1.5">
                  <h3 class="text-sm font-medium text-highlighted truncate">
                    {{ entry.sheet.name }}
                  </h3>
                  <UBadge :color="STATUS_BADGE[entry.status].color" variant="subtle" size="sm">
                    {{ STATUS_BADGE[entry.status].label }}
                  </UBadge>
                </div>
              </div>
              <p class="mt-3 text-xs leading-relaxed text-dimmed line-clamp-2">
                {{ entry.sheet.role }}
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

    <!-- Ce qu'il reste à écrire, plutôt qu'un drapeau isolé sur chaque carte -->
    <SectionBlock
      v-if="incomplete.length"
      title="Fiches à compléter"
      description="Le guide les cite sans leur consacrer de section. Rédige-les à partir du guide, puis intègre-les avec pnpm import:pokemon."
    >
      <ul class="rounded-[var(--ui-radius)] border border-default divide-y divide-default">
        <li v-for="entry in incomplete" :key="entry.sheet.slug">
          <NuxtLink
            :to="`${current.basePath}/equipe/${entry.sheet.slug}`"
            class="flex items-center gap-3 p-3 hover:bg-elevated/60 transition-colors"
          >
            <PokemonSprite :sheet="entry.sheet" variant="pixel" :size="36" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-highlighted">
                {{ entry.sheet.name }}
              </p>
              <p class="text-xs text-dimmed line-clamp-1">
                {{ entry.sheet.incompleteNote }}
              </p>
            </div>
            <UBadge :color="STATUS_BADGE[entry.status].color" variant="subtle" size="sm">
              {{ STATUS_BADGE[entry.status].label }}
            </UBadge>
          </NuxtLink>
        </li>
      </ul>
    </SectionBlock>

    <RosterEditor v-model="editing" />
  </div>
</template>
