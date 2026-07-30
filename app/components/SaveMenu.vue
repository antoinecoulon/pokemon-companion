<script setup lang="ts">
const { lastSavedAt, exportJson, importJson, reset, orphans, prune } = useSave()
const toast = useToast()

const fileInput = ref<HTMLInputElement>()
const resetOpen = ref(false)
const pruneOpen = ref(false)

/** Détail lisible de ce que la purge supprimerait, catégorie par catégorie. */
const orphanLines = computed(() => {
  const report = orphans.value
  return [
    { label: 'fiches supprimées du contenu', keys: report.pokemon },
    { label: 'tâches disparues', keys: report.tasks },
    { label: 'ressources disparues', keys: report.resources },
    { label: 'compteurs disparus', keys: report.counters },
    { label: 'composition pointant vers une fiche absente', keys: report.roster },
  ].filter(line => line.keys.length)
})

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

function confirmPrune() {
  const report = prune()
  pruneOpen.value = false
  toast.add({
    title: `${report.total} clé(s) supprimée(s)`,
    icon: 'i-lucide-broom',
    color: 'success',
  })
}

const items = computed(() => [[
  { label: 'Exporter la sauvegarde', icon: 'i-lucide-download', onSelect: download },
  { label: 'Importer une sauvegarde', icon: 'i-lucide-upload', onSelect: () => fileInput.value?.click() },
], [
  {
    label: orphans.value.total
      ? `Nettoyer la sauvegarde (${orphans.value.total})`
      : 'Nettoyer la sauvegarde',
    icon: 'i-lucide-broom',
    // Rien à nettoyer : l'entrée reste visible mais inerte, pour que l'absence
    // de clé morte soit une information et non un doute.
    disabled: orphans.value.total === 0 && orphans.value.empty.length === 0,
    onSelect: () => { pruneOpen.value = true },
  },
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

    <UModal v-model:open="pruneOpen" title="Nettoyer la sauvegarde ?">
      <template #body>
        <div class="space-y-3">
          <p class="text-sm text-toned">
            Ces clés ne correspondent plus à aucun contenu : elles proviennent d’une fiche
            supprimée ou d’une tâche retirée du guide. Elles ne s’affichent nulle part, mais
            voyagent dans chaque export.
          </p>
          <ul v-if="orphanLines.length" class="space-y-2">
            <li v-for="line in orphanLines" :key="line.label" class="text-sm">
              <span class="text-highlighted tabular-nums">{{ line.keys.length }}</span>
              <span class="text-toned"> {{ line.label }}</span>
              <p class="mt-0.5 text-xs text-dimmed break-words">
                {{ line.keys.slice(0, 8).join(', ') }}{{ line.keys.length > 8 ? `, +${line.keys.length - 8}` : '' }}
              </p>
            </li>
          </ul>
          <p v-if="orphans.empty.length" class="text-xs text-dimmed">
            S’ajoutent {{ orphans.empty.length }} fiche(s) ouverte(s) sans rien y saisir
            ({{ orphans.empty.join(', ') }}) : rien n’y est perdu, l’export s’allège.
          </p>
          <p class="text-sm text-toned">
            <strong class="text-highlighted">Rien d’autre n’est touché.</strong>
            Si une fiche a seulement disparu le temps d’une branche, exporte d’abord.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton color="neutral" variant="ghost" @click="pruneOpen = false">
            Annuler
          </UButton>
          <UButton color="primary" icon="i-lucide-broom" @click="confirmPrune">
            Nettoyer
          </UButton>
        </div>
      </template>
    </UModal>

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
