<script setup lang="ts">
import type { Ability, Build, PokemonSheet, PokemonSheetOverride } from '~/data/types'
import { POKEMON_TYPES } from '~/data/types'
import { natures } from '~/data/natures'
import {
  blocksToText, hasStructuredBlocks, isFieldOverridden, textToBlocks, validatePokemonOverride,
} from '~/utils/pokemon-overrides'

/**
 * Correction locale d'une fiche : brouillon + bouton Enregistrer, pas de
 * sauvegarde au fil de la frappe — un état à moitié corrigé (ex. 3 capacités
 * sur 4) ne doit pas fuiter ailleurs dans l'UI pendant la saisie.
 *
 * `mon` est la fiche déjà fusionnée (voir `useRoster`, qui applique
 * `pokemonOverrides` avant de la rendre) : le brouillon part donc de ce que
 * l'écran affichait à l'ouverture, correction précédente comprise.
 */
const props = defineProps<{ mon: PokemonSheet }>()
const open = defineModel<boolean>({ required: true })

const { pokemonOverride, setPokemonOverride, clearPokemonOverride } = useSave()
const toast = useToast()

const override = computed(() => pokemonOverride(props.mon.slug))
const modified = computed(() => Object.keys(override.value ?? {}).length > 0)

/** Champs scalaires/tableaux simples : comparés par valeur pour détecter un changement réel. */
const draft = reactive({
  role: props.mon.role,
  types: [...props.mon.types],
  badge: props.mon.badge ?? '',
  obtention: props.mon.obtention ?? '',
  bst: props.mon.bst,
  baseStats: props.mon.baseStats ? { ...props.mon.baseStats } : undefined,
  abilities: (props.mon.abilities ?? []).map(ability => ({ ...ability })),
  targetAbility: props.mon.targetAbility ?? '',
  mega: props.mon.mega ? { ...props.mon.mega, stats: { ...props.mon.mega.stats } } : undefined,
  builds: (props.mon.builds ?? []).map(build => ({ ...build, evs: { ...build.evs }, moves: [...build.moves] })),
  ivGuidance: props.mon.ivGuidance
    ? { focus: [...props.mon.ivGuidance.focus], ignore: [...props.mon.ivGuidance.ignore], note: props.mon.ivGuidance.note ?? '' }
    : undefined,
  incomplete: props.mon.incomplete ?? false,
  incompleteNote: props.mon.incompleteNote ?? '',
})

const preambleText = ref(blocksToText(props.mon.preamble))
const analysisText = ref(blocksToText(props.mon.analysis))
const extraText = ref(blocksToText(props.mon.extra))

const typeItems = POKEMON_TYPES.map(type => ({ label: type, value: type as string }))
const natureItems = natures.map(nature => ({ label: `${nature.en} (${nature.fr})`, value: nature.en }))
const abilityItems = computed(() => draft.abilities.map(ability => ({ label: ability.name, value: ability.name })))

function addAbility() {
  draft.abilities.push({ name: '' })
}
function removeAbility(index: number) {
  draft.abilities.splice(index, 1)
}

function newBuild(): Build {
  return {
    id: crypto.randomUUID(),
    name: 'Nouveau build',
    nature: natures[0]!.en,
    item: '',
    moves: ['', '', '', ''],
    evs: {},
  }
}
function addBuild() {
  draft.builds.push(newBuild())
}
function removeBuild(index: number) {
  draft.builds.splice(index, 1)
}

const errors = ref<string[]>([])

function buildPatch(): PokemonSheetOverride {
  const patch: PokemonSheetOverride = {}
  const changed = <T>(current: T, initial: T) => JSON.stringify(current) !== JSON.stringify(initial)

  if (changed(draft.role, props.mon.role)) patch.role = draft.role
  if (changed(draft.types, props.mon.types)) patch.types = draft.types
  if (changed(draft.badge || undefined, props.mon.badge)) patch.badge = draft.badge || undefined
  if (changed(draft.obtention || undefined, props.mon.obtention)) patch.obtention = draft.obtention || undefined
  if (draft.baseStats && changed(draft.baseStats, props.mon.baseStats)) patch.baseStats = draft.baseStats
  if (changed(draft.bst, props.mon.bst)) patch.bst = draft.bst
  if (changed(draft.abilities, props.mon.abilities ?? [])) patch.abilities = draft.abilities as Ability[]
  if (changed(draft.targetAbility || undefined, props.mon.targetAbility)) patch.targetAbility = draft.targetAbility || undefined
  if (draft.mega && changed(draft.mega, props.mon.mega)) patch.mega = draft.mega
  if (changed(draft.builds, props.mon.builds ?? [])) patch.builds = draft.builds
  if (draft.ivGuidance) {
    const clean = { focus: draft.ivGuidance.focus, ignore: draft.ivGuidance.ignore, ...(draft.ivGuidance.note ? { note: draft.ivGuidance.note } : {}) }
    if (changed(clean, props.mon.ivGuidance)) patch.ivGuidance = clean
  }
  if (changed(draft.incomplete, props.mon.incomplete ?? false)) patch.incomplete = draft.incomplete
  if (changed(draft.incompleteNote || undefined, props.mon.incompleteNote)) patch.incompleteNote = draft.incompleteNote || undefined

  if (changed(preambleText.value, blocksToText(props.mon.preamble))) patch.preamble = textToBlocks(preambleText.value)
  if (changed(analysisText.value, blocksToText(props.mon.analysis))) patch.analysis = textToBlocks(analysisText.value)
  if (changed(extraText.value, blocksToText(props.mon.extra))) patch.extra = textToBlocks(extraText.value)

  return patch
}

function save() {
  const patch = buildPatch()
  const validation = validatePokemonOverride(patch)
  if (validation.length > 0) {
    errors.value = validation
    toast.add({ title: 'Correction refusée', description: validation[0], color: 'error', icon: 'i-lucide-triangle-alert' })
    return
  }
  errors.value = []
  if (Object.keys(patch).length === 0) {
    open.value = false
    return
  }
  setPokemonOverride(props.mon.slug, patch)
  toast.add({ title: 'Fiche corrigée', color: 'success', icon: 'i-lucide-check' })
  open.value = false
}

const confirmReset = ref(false)
function reset() {
  clearPokemonOverride(props.mon.slug)
  confirmReset.value = false
  toast.add({ title: 'Fiche réinitialisée', description: 'Retour au contenu canonique.', color: 'neutral', icon: 'i-lucide-rotate-ccw' })
  open.value = false
}
</script>

<template>
  <UDrawer v-model:open="open" :title="`Corriger « ${mon.name} »`" direction="bottom">
    <template #body>
      <div class="space-y-6 pb-2">
        <UAlert
          color="neutral"
          variant="subtle"
          icon="i-lucide-info"
          description="Ces corrections restent personnelles : elles se stockent dans ta sauvegarde, jamais dans le contenu du dépôt."
        />

        <UAlert
          v-for="error in errors"
          :key="error"
          color="error"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          :description="error"
        />

        <!-- Identité -->
        <SectionBlock title="Identité">
          <div class="grid sm:grid-cols-2 gap-3">
            <UFormField label="Rôle" size="sm" class="sm:col-span-2">
              <UInput v-model="draft.role" class="w-full" />
              <template v-if="isFieldOverridden(override, 'role')" #hint>
                <UBadge color="warning" variant="subtle" size="sm">modifié</UBadge>
              </template>
            </UFormField>

            <UFormField label="Types" size="sm">
              <USelectMenu v-model="draft.types" :items="typeItems" value-key="value" multiple class="w-full" />
              <template v-if="isFieldOverridden(override, 'types')" #hint>
                <UBadge color="warning" variant="subtle" size="sm">modifié</UBadge>
              </template>
            </UFormField>

            <UFormField label="Étiquette du guide" size="sm">
              <UInput v-model="draft.badge" placeholder="Conservé, Nouveau…" class="w-full" />
              <template v-if="isFieldOverridden(override, 'badge')" #hint>
                <UBadge color="warning" variant="subtle" size="sm">modifié</UBadge>
              </template>
            </UFormField>

            <UFormField label="Obtention" size="sm" class="sm:col-span-2">
              <UInput v-model="draft.obtention" class="w-full" />
              <template v-if="isFieldOverridden(override, 'obtention')" #hint>
                <UBadge color="warning" variant="subtle" size="sm">modifié</UBadge>
              </template>
            </UFormField>
          </div>
        </SectionBlock>

        <!-- Stats de base -->
        <SectionBlock v-if="draft.baseStats" title="Stats de base">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'baseStats')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <UFormField v-for="key in STAT_KEYS" :key="key" :label="STAT_LABELS[key]" size="sm">
              <UInputNumber v-model="draft.baseStats[key]" :min="0" :max="255" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="BST" size="sm" class="mt-2 max-w-32">
            <UInputNumber v-model="draft.bst" :min="0" class="w-full" />
          </UFormField>
        </SectionBlock>

        <!-- Talents -->
        <SectionBlock v-if="props.mon.abilities" title="Talents">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'abilities')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <div class="space-y-2">
            <div v-for="(ability, index) in draft.abilities" :key="index" class="flex items-center gap-2">
              <UInput v-model="ability.name" placeholder="Nom du talent" class="flex-1" />
              <UCheckbox v-model="ability.hidden" label="caché" />
              <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" @click="removeAbility(index)" />
            </div>
            <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="subtle" @click="addAbility">
              Ajouter un talent
            </UButton>
          </div>
          <UFormField label="Talent visé" size="sm" class="mt-3 max-w-64">
            <USelectMenu v-model="draft.targetAbility" :items="abilityItems" value-key="value" placeholder="—" class="w-full" />
          </UFormField>
        </SectionBlock>

        <!-- Mega -->
        <SectionBlock v-if="draft.mega" title="Mega Evolution">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'mega')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <div class="space-y-3">
            <UFormField label="Pierre" size="sm">
              <UInput v-model="draft.mega.stone" class="w-full" />
            </UFormField>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <UFormField v-for="key in STAT_KEYS" :key="key" :label="STAT_LABELS[key]" size="sm">
                <UInputNumber v-model="draft.mega.stats[key]" :min="0" :max="255" class="w-full" />
              </UFormField>
            </div>
            <UFormField label="BST" size="sm" class="max-w-32">
              <UInputNumber v-model="draft.mega.bst" :min="0" class="w-full" />
            </UFormField>
            <UFormField label="Note" size="sm">
              <UTextarea v-model="draft.mega.note" :rows="2" autoresize class="w-full" />
            </UFormField>
          </div>
        </SectionBlock>

        <!-- Prose -->
        <SectionBlock title="Mises au point (préambule)">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'preamble')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <UAlert
            v-if="hasStructuredBlocks(props.mon.preamble)"
            color="warning"
            variant="subtle"
            size="sm"
            icon="i-lucide-triangle-alert"
            description="Cette section contient des listes/tableaux/citations : les enregistrer ici les aplatit en texte simple."
          />
          <UTextarea v-model="preambleText" :rows="4" autoresize class="w-full" placeholder="Un paragraphe par ligne vide." />
        </SectionBlock>

        <SectionBlock title="Analyse critique">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'analysis')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <UAlert
            v-if="hasStructuredBlocks(props.mon.analysis)"
            color="warning"
            variant="subtle"
            size="sm"
            icon="i-lucide-triangle-alert"
            description="Cette section contient des listes/tableaux/citations : les enregistrer ici les aplatit en texte simple."
          />
          <UTextarea v-model="analysisText" :rows="6" autoresize class="w-full" placeholder="Un paragraphe par ligne vide." />
        </SectionBlock>

        <SectionBlock v-if="props.mon.extra || extraText" title="Contenu libre">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'extra')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <UAlert
            v-if="hasStructuredBlocks(props.mon.extra)"
            color="warning"
            variant="subtle"
            size="sm"
            icon="i-lucide-triangle-alert"
            description="Cette section contient des listes/tableaux/citations : les enregistrer ici les aplatit en texte simple."
          />
          <UTextarea v-model="extraText" :rows="4" autoresize class="w-full" placeholder="Un paragraphe par ligne vide." />
        </SectionBlock>

        <!-- Builds -->
        <SectionBlock title="Builds">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'builds')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <div class="space-y-4">
            <AppCard v-for="(build, index) in draft.builds" :key="build.id" density="compact" tone="raised" class="space-y-3">
              <div class="flex items-center justify-between gap-2">
                <UInput v-model="build.name" placeholder="Nom du build" size="sm" class="max-w-56" />
                <div class="flex items-center gap-2">
                  <UCheckbox v-model="build.recommended" label="conseillé" />
                  <UButton icon="i-lucide-trash-2" size="xs" color="error" variant="ghost" @click="removeBuild(index)" />
                </div>
              </div>
              <UInput v-model="build.tagline" placeholder="Tagline (optionnel)" size="sm" class="w-full" />
              <div class="grid sm:grid-cols-2 gap-2">
                <UFormField label="Nature" size="sm">
                  <USelectMenu v-model="build.nature" :items="natureItems" value-key="value" class="w-full" />
                </UFormField>
                <UFormField label="Objet" size="sm">
                  <UInput v-model="build.item" class="w-full" />
                </UFormField>
                <UFormField label="Talent" size="sm">
                  <UInput v-model="build.ability" placeholder="—" class="w-full" />
                </UFormField>
              </div>
              <div class="grid sm:grid-cols-2 gap-2">
                <UInput
                  v-for="moveIndex in [0, 1, 2, 3]"
                  :key="moveIndex"
                  v-model="build.moves[moveIndex]"
                  :placeholder="`Capacité ${moveIndex + 1}`"
                  size="sm"
                  class="w-full"
                />
              </div>
              <StatInputs v-model="build.evs" kind="ev" />
            </AppCard>
            <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="subtle" @click="addBuild">
              Ajouter un build
            </UButton>
          </div>
        </SectionBlock>

        <!-- IV guidance -->
        <SectionBlock v-if="draft.ivGuidance" title="Priorités IV">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'ivGuidance')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <div class="grid sm:grid-cols-2 gap-3">
            <UFormField label="Stats à prioriser" size="sm">
              <USelectMenu
                v-model="draft.ivGuidance.focus"
                :items="STAT_KEYS.map(k => ({ label: STAT_LABELS[k], value: k }))"
                value-key="value"
                multiple
                class="w-full"
              />
            </UFormField>
            <UFormField label="Stats à ignorer" size="sm">
              <USelectMenu
                v-model="draft.ivGuidance.ignore"
                :items="STAT_KEYS.map(k => ({ label: STAT_LABELS[k], value: k }))"
                value-key="value"
                multiple
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="Note" size="sm" class="mt-2">
            <UTextarea v-model="draft.ivGuidance.note" :rows="2" autoresize class="w-full" />
          </UFormField>
        </SectionBlock>

        <!-- Fiche incomplète -->
        <SectionBlock title="Fiche incomplète">
          <template #action>
            <UBadge v-if="isFieldOverridden(override, 'incomplete') || isFieldOverridden(override, 'incompleteNote')" color="warning" variant="subtle" size="sm">modifié</UBadge>
          </template>
          <UCheckbox v-model="draft.incomplete" label="Fiche incomplète dans le guide source" />
          <UTextarea v-if="draft.incomplete" v-model="draft.incompleteNote" :rows="2" autoresize class="w-full mt-2" />
        </SectionBlock>

        <div class="flex items-center justify-between gap-2">
          <UButton
            v-if="modified"
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="subtle"
            size="sm"
            @click="confirmReset = true"
          >
            Réinitialiser cette fiche
          </UButton>
          <div class="flex-1" />
          <UButton color="primary" size="sm" @click="save">
            Enregistrer
          </UButton>
        </div>
      </div>
    </template>
  </UDrawer>

  <UModal v-model:open="confirmReset" title="Réinitialiser la fiche ?">
    <template #body>
      <p class="text-sm text-toned">
        Toutes les corrections locales de « {{ mon.name }} » seront perdues, sans confirmation possible ensuite.
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <UButton color="neutral" variant="subtle" @click="confirmReset = false">Annuler</UButton>
        <UButton color="error" @click="reset">Réinitialiser</UButton>
      </div>
    </template>
  </UModal>
</template>
