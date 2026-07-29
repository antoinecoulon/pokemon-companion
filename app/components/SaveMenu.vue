<script setup lang="ts">
const { lastSavedAt, exportJson, importJson, reset } = useSave()
const toast = useToast()

const fileInput = ref<HTMLInputElement>()
const resetOpen = ref(false)

const lastSaved = computed(() => {
  if (!lastSavedAt.value) return null
  return new Date(lastSavedAt.value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
})

function download() {
  const blob = new Blob([exportJson()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `pokemon-companion-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
  toast.add({ title: 'Sauvegarde exportée', icon: 'i-lucide-download', color: 'success' })
}

async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const result = importJson(await file.text())
  if (result.ok) {
    toast.add({ title: 'Sauvegarde importée', icon: 'i-lucide-upload', color: 'success' })
  }
  else {
    toast.add({ title: 'Import impossible', description: result.error, icon: 'i-lucide-triangle-alert', color: 'error' })
  }
  if (fileInput.value) fileInput.value.value = ''
}

function confirmReset() {
  reset()
  resetOpen.value = false
  toast.add({ title: 'Progression réinitialisée', icon: 'i-lucide-rotate-ccw', color: 'warning' })
}

const items = computed(() => [[
  { label: 'Exporter la sauvegarde', icon: 'i-lucide-download', onSelect: download },
  { label: 'Importer une sauvegarde', icon: 'i-lucide-upload', onSelect: () => fileInput.value?.click() },
], [
  { label: 'Tout réinitialiser', icon: 'i-lucide-rotate-ccw', color: 'error' as const, onSelect: () => { resetOpen.value = true } },
]])
</script>

<template>
  <div>
    <UDropdownMenu :items="items" :content="{ align: 'end' }">
      <UButton
        icon="i-lucide-database"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Gérer la sauvegarde"
      />
    </UDropdownMenu>

    <input
      ref="fileInput"
      type="file"
      accept="application/json,.json"
      class="hidden"
      @change="onFileChange"
    >

    <UModal v-model:open="resetOpen" title="Tout réinitialiser ?">
      <template #body>
        <div class="space-y-3">
          <p class="text-sm text-toned">
            Toute ta progression, tes statistiques saisies et ton journal seront effacés.
            Les cases cochées repartiront de l’état initial du guide.
          </p>
          <p class="text-sm text-toned">
            <strong class="text-highlighted">Cette action est irréversible.</strong>
            Exporte ta sauvegarde d’abord si tu veux pouvoir revenir en arrière.
          </p>
          <p v-if="lastSaved" class="text-xs text-dimmed">
            Dernière sauvegarde : {{ lastSaved }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton color="neutral" variant="ghost" @click="resetOpen = false">
            Annuler
          </UButton>
          <UButton color="error" icon="i-lucide-rotate-ccw" @click="confirmReset">
            Réinitialiser
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
