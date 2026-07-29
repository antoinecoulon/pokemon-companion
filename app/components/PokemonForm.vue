<script setup lang="ts">
import type { Build, PokemonSheet } from '~/data/types'
import { natures } from '~/data/natures'

const props = defineProps<{ mon: PokemonSheet }>()

const { progressFor } = useSave()
const progress = computed(() => progressFor(props.mon.slug))

/** Build de référence : celui choisi, sinon le recommandé. */
const build = computed<Build | undefined>(() =>
  props.mon.builds?.find(candidate => candidate.id === progress.value.buildId)
  ?? props.mon.builds?.find(candidate => candidate.recommended)
  ?? props.mon.builds?.[0],
)

const natureItems = natures.map(nature => ({
  label: `${nature.fr} (${nature.en})`,
  value: nature.fr,
}))

const abilityItems = computed(() =>
  (props.mon.abilities ?? []).map(ability => ({
    label: ability.hidden ? `${ability.name} — caché` : ability.name,
    value: ability.name,
  })),
)

/** Recopie les valeurs cibles du build dans le formulaire. */
function fillFromBuild() {
  const target = build.value
  if (!target) return
  progress.value.evs = { ...target.evs }
  progress.value.nature = target.natureFr
  progress.value.item = target.item
  progress.value.moves = [0, 1, 2, 3].map(index => target.moves[index] ?? '')
  if (target.ability) progress.value.ability = target.ability
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h3 class="text-sm font-semibold text-highlighted">
          Ma progression
        </h3>
        <p class="text-xs text-muted">
          Les valeurs réelles de ton exemplaire, comparées à la cible du build.
        </p>
      </div>
      <UButton
        v-if="build"
        icon="i-lucide-wand-sparkles"
        color="neutral"
        variant="subtle"
        size="xs"
        @click="fillFromBuild"
      >
        Pré-remplir depuis « {{ build.name }} »
      </UButton>
    </div>

    <!-- Choix du build -->
    <div v-if="mon.builds?.length" class="space-y-2">
      <p class="text-xs font-medium text-toned">
        Build choisi
      </p>
      <div class="grid gap-2" :class="mon.builds.length > 1 ? 'sm:grid-cols-2' : ''">
        <button
          v-for="candidate in mon.builds"
          :key="candidate.id"
          type="button"
          class="text-left p-3 rounded-[var(--ui-radius)] border transition-colors"
          :class="progress.buildId === candidate.id
            ? 'border-primary bg-primary/5'
            : 'border-default hover:bg-elevated/60'"
          @click="progress.buildId = candidate.id"
        >
          <div class="flex items-start justify-between gap-2">
            <span class="text-sm font-medium text-highlighted">{{ candidate.name }}</span>
            <UBadge v-if="candidate.recommended" color="primary" variant="subtle" size="sm">
              conseillé
            </UBadge>
          </div>
          <p v-if="candidate.tagline" class="text-xs text-dimmed italic mt-0.5">
            {{ candidate.tagline }}
          </p>
          <dl class="mt-2 space-y-0.5 text-xs text-muted">
            <div class="flex gap-1.5">
              <dt class="text-dimmed">
                Nature
              </dt>
              <dd>{{ candidate.nature }}</dd>
            </div>
            <div class="flex gap-1.5">
              <dt class="text-dimmed">
                Objet
              </dt>
              <dd>{{ candidate.item }}</dd>
            </div>
            <div class="flex gap-1.5">
              <dt class="text-dimmed">
                EV
              </dt>
              <dd class="tabular-nums">
                {{ STAT_KEYS.filter(k => candidate.evs[k]).map(k => `${candidate.evs[k]} ${STAT_LABELS[k]}`).join(' / ') }}
              </dd>
            </div>
          </dl>
          <ul v-if="candidate.notes?.length" class="mt-2 pl-4 space-y-1 list-disc marker:text-dimmed">
            <li
              v-for="(note, index) in candidate.notes"
              :key="index"
              class="text-[0.7rem]/relaxed text-dimmed"
              v-html="formatInline(note)"
            />
          </ul>
        </button>
      </div>
    </div>

    <!-- Identité -->
    <div class="grid sm:grid-cols-2 gap-3">
      <UFormField label="Niveau" size="sm">
        <UInputNumber v-model="progress.level" :min="1" :max="100" placeholder="—" class="w-full" />
        <template #hint>
          <span class="text-xs text-dimmed">cible 100</span>
        </template>
      </UFormField>

      <UFormField label="Nature actuelle" size="sm">
        <USelectMenu
          v-model="progress.nature"
          :items="natureItems"
          value-key="value"
          placeholder="Choisir…"
          class="w-full"
        />
        <template #hint>
          <span v-if="build" class="text-xs text-dimmed">cible {{ build.natureFr }}</span>
        </template>
      </UFormField>

      <UFormField label="Talent" size="sm">
        <USelectMenu
          v-if="abilityItems.length"
          v-model="progress.ability"
          :items="abilityItems"
          value-key="value"
          placeholder="Choisir…"
          class="w-full"
        />
        <UInput v-else v-model="progress.ability" placeholder="Talent" class="w-full" />
        <template #hint>
          <span v-if="mon.targetAbility" class="text-xs text-dimmed">cible {{ mon.targetAbility }}</span>
        </template>
      </UFormField>

      <UFormField label="Objet tenu" size="sm">
        <UInput v-model="progress.item" placeholder="—" class="w-full" />
        <template #hint>
          <span v-if="build" class="text-xs text-dimmed">cible {{ build.item }}</span>
        </template>
      </UFormField>
    </div>

    <!-- Moveset -->
    <div class="space-y-2">
      <p class="text-xs font-medium text-toned">
        Moveset
      </p>
      <div class="grid sm:grid-cols-2 gap-2">
        <div v-for="index in [0, 1, 2, 3]" :key="index">
          <UInput
            v-model="progress.moves[index]"
            :placeholder="build?.moves[index] ?? `Capacité ${index + 1}`"
            size="sm"
            class="w-full"
            :aria-label="`Capacité ${index + 1}`"
          />
          <p v-if="build?.moves[index] && build.moves[index] !== '—'" class="mt-0.5 text-[0.65rem] text-dimmed">
            cible : {{ build.moves[index] }}
          </p>
        </div>
      </div>
    </div>

    <!-- IV -->
    <div class="space-y-2">
      <div class="flex items-baseline justify-between gap-2">
        <p class="text-xs font-medium text-toned">
          IV
        </p>
        <p v-if="mon.ivGuidance?.note" class="text-[0.65rem] text-dimmed text-right max-w-md" v-html="formatInline(mon.ivGuidance.note)" />
      </div>
      <StatInputs
        v-model="progress.ivs"
        kind="iv"
        :focus="mon.ivGuidance?.focus"
        :ignore="mon.ivGuidance?.ignore"
      />
    </div>

    <!-- EV -->
    <div class="space-y-2">
      <p class="text-xs font-medium text-toned">
        EV
      </p>
      <StatInputs v-model="progress.evs" kind="ev" :target="build?.evs" />
    </div>

    <!-- Notes -->
    <UFormField label="Notes" size="sm">
      <UTextarea
        v-model="progress.notes"
        :rows="4"
        autoresize
        placeholder="Ce que tu veux retenir sur cet exemplaire…"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
