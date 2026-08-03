<script setup lang="ts">
import { synthesizeSheet } from '~/utils/roster'

/**
 * Enregistrer une capture depuis le Pokédex de référence, sans écrire de
 * fiche.
 *
 * Même conventions que `RosterEditor` : tiroir en bas, pas de glisser-déposer.
 * Le filtre reprend l'idiome déjà utilisé pour le Pokédex de `/reference`
 * (nom/types/localisations, seuil de 2 caractères, résultats plafonnés).
 */
const open = defineModel<boolean>({ required: true })

const roster = useRoster()
const toast = useToast()

const search = ref('')
const promoteOnCatch = ref(false)
const LIMIT = 12

const results = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (query.length < 2) return []
  return roster.catchable.value
    .filter(entry =>
      entry.name.toLowerCase().includes(query)
      || entry.types.some(type => type.toLowerCase() === query)
      || entry.locations.some(location => location.toLowerCase().includes(query)),
    )
    .slice(0, LIMIT)
})

function capture(slug: string, name: string) {
  const ok = roster.addCatch(slug, { promote: promoteOnCatch.value })
  if (ok) {
    toast.add({
      title: promoteOnCatch.value ? `${name} ajouté à l’équipe` : `${name} enregistré`,
      color: 'success',
      icon: 'i-lucide-check',
    })
    search.value = ''
    return
  }
  toast.add({
    title: `${name} enregistré, mais pas ajouté à l’équipe`,
    description: roster.lastError.value ?? undefined,
    color: 'warning',
    icon: 'i-lucide-triangle-alert',
  })
}
</script>

<template>
  <UDrawer v-model:open="open" title="Ajouter un Pokémon" direction="bottom">
    <template #body>
      <div class="space-y-4 pb-2">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Nom, type ou lieu…"
          autofocus
          class="w-full"
        />

        <UCheckbox v-model="promoteOnCatch" label="L’envoyer direct en équipe" />

        <p v-if="search.trim().length >= 2 && !results.length" class="text-sm text-dimmed">
          Aucune espèce ne correspond.
        </p>

        <ul v-if="results.length" class="rounded-[var(--ui-radius)] border border-default divide-y divide-default">
          <li
            v-for="entry in results"
            :key="entry.id"
            class="flex items-center gap-3 p-3"
          >
            <PokemonSprite :sheet="synthesizeSheet(entry)" variant="pixel" :size="36" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-highlighted truncate">
                {{ entry.name }}
              </p>
              <div class="flex flex-wrap items-center gap-1.5 mt-1">
                <UBadge v-for="type in entry.types" :key="type" color="neutral" variant="outline" size="sm">
                  {{ type }}
                </UBadge>
              </div>
            </div>
            <UButton
              size="xs"
              color="primary"
              variant="subtle"
              icon="i-lucide-plus"
              @click="capture(entry.id, entry.name)"
            >
              Capturer
            </UButton>
          </li>
        </ul>
      </div>
    </template>
  </UDrawer>
</template>
