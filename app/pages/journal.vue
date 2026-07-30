<script setup lang="ts">
import type { JournalEntry } from '~/data/types'

useHead({ title: 'Journal · Pokémon Companion' })

const { journal, addJournalEntry, updateJournalEntry, removeJournalEntry } = useSave()
const toast = useToast()

function today() {
  return new Date().toISOString().slice(0, 10)
}

/** `null` = formulaire fermé, `''` = création, sinon id de l'entrée éditée. */
const editing = ref<string | null>(null)
const draft = ref({ date: today(), title: '', body: '' })

const isCreating = computed(() => editing.value === '')
const canSave = computed(() => draft.value.title.trim().length > 0 && !!draft.value.date)

function startCreate() {
  draft.value = { date: today(), title: '', body: '' }
  editing.value = ''
}

function startEdit(entry: JournalEntry) {
  draft.value = { date: entry.date, title: entry.title, body: entry.body }
  editing.value = entry.id
}

function cancel() {
  editing.value = null
}

function save() {
  if (!canSave.value) return
  const payload = {
    date: draft.value.date,
    title: draft.value.title.trim(),
    body: draft.value.body.trim(),
  }
  if (isCreating.value) {
    addJournalEntry(payload)
    toast.add({ title: 'Entrée ajoutée', icon: 'i-lucide-check', color: 'success' })
  }
  else if (editing.value) {
    updateJournalEntry(editing.value, payload)
    toast.add({ title: 'Entrée modifiée', icon: 'i-lucide-check', color: 'success' })
  }
  editing.value = null
}

const confirmingDelete = ref<string | null>(null)

function remove(id: string) {
  removeJournalEntry(id)
  confirmingDelete.value = null
  if (editing.value === id) editing.value = null
  toast.add({ title: 'Entrée supprimée', icon: 'i-lucide-trash-2', color: 'warning' })
}

function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-10">
    <SectionBlock
      title="Journal de bord"
      description="Ce que tu constates run après run. Le guide suggère d’ajuster l’équipe selon ces observations — par exemple basculer sur Roigada si tu meurs surtout à des attaques spéciales."
    >
      <template #action>
        <UButton
          v-if="editing === null"
          icon="i-lucide-plus"
          size="sm"
          class="shrink-0"
          @click="startCreate"
        >
          Nouvelle entrée
        </UButton>
      </template>

      <!-- Formulaire -->
      <AppCard v-if="editing !== null" tone="raised" density="compact">
        <form class="space-y-3" @submit.prevent="save">
          <p class="text-sm font-medium text-highlighted">
            {{ isCreating ? 'Nouvelle entrée' : 'Modifier l’entrée' }}
          </p>

          <div class="grid sm:grid-cols-[10rem_1fr] gap-3">
            <UFormField label="Date" size="sm">
              <UInput v-model="draft.date" type="date" class="w-full" />
            </UFormField>
            <UFormField label="Titre" size="sm" required>
              <UInput
                v-model="draft.title"
                placeholder="Run Battle Tower : 21 victoires"
                class="w-full"
                autofocus
              />
            </UFormField>
          </div>

          <UFormField label="Notes" size="sm">
            <UTextarea
              v-model="draft.body"
              :rows="5"
              autoresize
              placeholder="Mort sur un attaquant Glace au match 22. Scorvol est trop exposé — prévoir le switch Flagadoss plus tôt."
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" size="sm" @click="cancel">
              Annuler
            </UButton>
            <UButton type="submit" :disabled="!canSave" size="sm" icon="i-lucide-check">
              {{ isCreating ? 'Ajouter' : 'Enregistrer' }}
            </UButton>
          </div>
        </form>
      </AppCard>

      <!-- Entrées -->
      <div v-if="journal.length" class="space-y-3">
        <AppCard
          v-for="entry in journal"
          :key="entry.id"
          density="compact"
        >
          <article class="space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-highlighted">
                  {{ entry.title }}
                </h3>
                <p class="text-xs text-dimmed first-letter:uppercase">
                  {{ formatDate(entry.date) }}
                </p>
              </div>
              <div class="flex items-center gap-0.5 shrink-0">
                <UButton
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Modifier"
                  @click="startEdit(entry)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  size="xs"
                  aria-label="Supprimer"
                  @click="confirmingDelete = entry.id"
                />
              </div>
            </div>

            <p v-if="entry.body" class="text-sm/relaxed text-toned whitespace-pre-line">
              {{ entry.body }}
            </p>

            <div
              v-if="confirmingDelete === entry.id"
              class="flex items-center justify-between gap-3 p-2 rounded-[var(--ui-radius)] bg-error/10"
            >
              <span class="text-xs text-error">Supprimer cette entrée définitivement ?</span>
              <div class="flex gap-1.5 shrink-0">
                <UButton color="neutral" variant="ghost" size="xs" @click="confirmingDelete = null">
                  Annuler
                </UButton>
                <UButton color="error" size="xs" @click="remove(entry.id)">
                  Oui, supprimer
                </UButton>
              </div>
            </div>
          </article>
        </AppCard>
      </div>

      <UAlert
        v-else-if="editing === null"
        color="neutral"
        variant="subtle"
        icon="i-lucide-notebook-pen"
        title="Journal vide"
        description="Note tes runs de Battle Frontier, ce qui t’a tué, ce que tu veux changer. C’est ce qui te permettra d’arbitrer les choix d’équipe sur des faits plutôt que des impressions."
      />
    </SectionBlock>
  </div>
</template>
