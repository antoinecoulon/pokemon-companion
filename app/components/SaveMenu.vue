<script setup lang="ts">
const { lastSavedAt, exportJson, importJson, reset, orphans, prune, backup, justRejected, discardBackup } = useSave()
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

function saveAs(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function download() {
  saveAs(exportJson(), `pokemon-companion-${new Date().toISOString().slice(0, 10)}.json`)
  toast.add({ title: 'Sauvegarde exportée', icon: 'i-lucide-download', color: 'success' })
}

/* --- Copie de secours -------------------------------------------------- */

const backupLabel = computed(() => {
  if (!backup.value) return null
  const when = backup.value.savedAt
    ? new Date(backup.value.savedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
    : 'date inconnue'
  const what = {
    reset: 'Copie d’avant réinitialisation',
    replaced: 'Copie de la version remplacée par la synchro',
    rejected: 'Copie de la sauvegarde illisible',
  }[backup.value.reason]
  return `${what} (${when})`
})

function downloadBackup() {
  if (!backup.value) return
  saveAs(backup.value.payload, `pokemon-companion-secours-${backup.value.savedAt.slice(0, 10) || 'inconnue'}.json`)
  toast.add({ title: 'Copie de secours exportée', icon: 'i-lucide-life-buoy', color: 'success' })
}

/* --- Synchronisation --------------------------------------------------- */

const sync = useSync()
const syncOpen = ref(false)
const tokenDraft = ref('')
const linking = ref(false)

const SYNC_LABELS: Record<typeof sync.status.value, string> = {
  unconfigured: 'Synchronisation — appareil non relié',
  idle: 'Synchronisation — en attente',
  syncing: 'Synchronisation en cours…',
  ok: 'Synchronisation — à jour',
  offline: 'Synchronisation — hors-ligne',
  error: 'Synchronisation — échec',
}

const SYNC_ICONS: Record<typeof sync.status.value, string> = {
  unconfigured: 'i-lucide-cloud-off',
  idle: 'i-lucide-cloud',
  syncing: 'i-lucide-refresh-cw',
  ok: 'i-lucide-cloud-check',
  offline: 'i-lucide-cloud-off',
  error: 'i-lucide-cloud-alert',
}

const syncedAt = computed(() => {
  if (!sync.lastSyncedAt.value) return null
  return new Date(sync.lastSyncedAt.value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
})

async function link() {
  linking.value = true
  const ok = await sync.configure(tokenDraft.value)
  linking.value = false
  if (ok) {
    tokenDraft.value = ''
    syncOpen.value = false
    toast.add({ title: 'Appareil relié', description: sync.lastOutcome.value ?? undefined, icon: 'i-lucide-cloud-check', color: 'success' })
  }
  else {
    toast.add({ title: 'Impossible de relier l’appareil', description: sync.lastError.value ?? undefined, icon: 'i-lucide-cloud-alert', color: 'error' })
  }
}

async function syncNow() {
  const ok = await sync.sync()
  if (ok) {
    toast.add({
      title: 'Synchronisé',
      description: sync.lastOutcome.value ?? undefined,
      icon: 'i-lucide-cloud-check',
      color: 'success',
    })
    // Une divergence a fait une victime : elle est récupérable, encore faut-il
    // le savoir. Ce toast ne disparaît pas tout seul.
    if (sync.lastOverwrote.value) {
      toast.add({
        title: 'Une version a été remplacée',
        description: 'Les deux appareils avaient changé. La version écrasée est conservée '
          + 'en copie de secours, téléchargeable depuis ce menu.',
        icon: 'i-lucide-life-buoy',
        color: 'warning',
        duration: 0,
      })
    }
  }
  else {
    toast.add({ title: 'Synchronisation impossible', description: sync.lastError.value ?? undefined, icon: 'i-lucide-cloud-alert', color: 'error' })
  }
}

function confirmUnlink() {
  sync.unlink()
  syncOpen.value = false
  toast.add({ title: 'Appareil délié', description: 'Le gist et la sauvegarde locale sont intacts.', icon: 'i-lucide-cloud-off', color: 'warning' })
}

const discardOpen = ref(false)

function confirmDiscard() {
  discardBackup()
  discardOpen.value = false
  toast.add({ title: 'Copie de secours supprimée', icon: 'i-lucide-trash-2', color: 'warning' })
}

/*
 * L'échec d'hydratation était jusqu'ici muet côté écran : un simple
 * `console.warn`, que personne ne lit sur téléphone. Le toast reste affiché
 * jusqu'à ce qu'on le ferme — c'est le seul moment où la copie de secours est
 * signalée, et la perdre serait perdre la sauvegarde.
 */
onMounted(() => {
  if (!justRejected.value) return
  toast.add({
    title: 'Sauvegarde illisible',
    description: 'Sa version ou sa forme n’a pas été reconnue : l’app est repartie d’une progression vide. '
      + 'Le fichier d’origine est conservé — récupère-le depuis le menu Sauvegarde avant toute chose.',
    icon: 'i-lucide-life-buoy',
    color: 'warning',
    duration: 0,
  })
})

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
    icon: 'i-lucide-brush-cleaning',
    color: 'success',
  })
}

const items = computed(() => [[
  {
    label: SYNC_LABELS[sync.status.value],
    icon: SYNC_ICONS[sync.status.value],
    onSelect: () => { syncOpen.value = true },
  },
  ...(sync.configured.value
    ? [{ label: 'Synchroniser maintenant', icon: 'i-lucide-refresh-cw', onSelect: syncNow }]
    : []),
], [
  { label: 'Exporter la sauvegarde', icon: 'i-lucide-download', onSelect: download },
  { label: 'Importer une sauvegarde', icon: 'i-lucide-upload', onSelect: () => fileInput.value?.click() },
],
// Groupe absent tant qu'aucune copie n'existe : rien à récupérer, rien à dire.
...(backup.value
  ? [[
      { label: backupLabel.value!, icon: 'i-lucide-life-buoy', onSelect: downloadBackup },
      { label: 'Supprimer la copie de secours', icon: 'i-lucide-trash-2', onSelect: () => { discardOpen.value = true } },
    ]]
  : []),
[
  {
    label: orphans.value.total
      ? `Nettoyer la sauvegarde (${orphans.value.total})`
      : 'Nettoyer la sauvegarde',
    icon: 'i-lucide-brush-cleaning',
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
        :color="justRejected ? 'warning' : 'neutral'"
        variant="ghost"
        size="sm"
        :aria-label="justRejected
          ? 'Gérer la sauvegarde — une sauvegarde illisible a été mise de côté'
          : 'Gérer la sauvegarde'"
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
          <UButton color="primary" icon="i-lucide-brush-cleaning" @click="confirmPrune">
            Nettoyer
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="syncOpen" title="Synchronisation entre appareils">
      <template #body>
        <div class="space-y-4">
          <div v-if="sync.configured.value" class="space-y-3">
            <UAlert
              :color="sync.status.value === 'error' ? 'error' : sync.status.value === 'ok' ? 'success' : 'neutral'"
              variant="subtle"
              :icon="SYNC_ICONS[sync.status.value]"
              :title="SYNC_LABELS[sync.status.value]"
              :description="sync.lastError.value ?? sync.lastOutcome.value ?? undefined"
            />
            <p v-if="syncedAt" class="text-xs text-dimmed">
              Dernière synchronisation : {{ syncedAt }}
            </p>
            <p class="text-sm text-toned">
              La sauvegarde part dans un gist privé de ton compte GitHub, et revient à chaque
              ouverture de l’app. Le stockage local reste la source de vérité : tu peux jouer
              hors-ligne, l’envoi se fait au retour du réseau.
            </p>
            <p class="text-sm text-toned">
              En cas de divergence, <strong class="text-highlighted">la version la plus récente
                gagne</strong> — celle qui est écrasée reste téléchargeable en copie de secours.
            </p>
            <div class="flex flex-wrap gap-2 pt-1">
              <UButton
                icon="i-lucide-refresh-cw"
                :loading="sync.status.value === 'syncing'"
                @click="syncNow"
              >
                Synchroniser maintenant
              </UButton>
              <UButton color="neutral" variant="ghost" icon="i-lucide-cloud-off" @click="confirmUnlink">
                Délier cet appareil
              </UButton>
            </div>
          </div>

          <div v-else class="space-y-3">
            <p class="text-sm text-toned">
              Pour retrouver ta progression d’un appareil à l’autre, l’app la range dans un
              <strong class="text-highlighted">gist privé</strong> de ton compte GitHub. Pas de
              serveur à héberger, pas de compte à créer.
            </p>
            <ol class="text-sm text-toned list-decimal ms-5 space-y-1.5">
              <li>
                Ouvre
                <ULink
                  to="https://github.com/settings/tokens/new?scopes=gist&description=Pok%C3%A9mon%20Companion"
                  target="_blank"
                  class="text-primary"
                >
                  cette page de création de token
                </ULink>
                — la portée <code class="text-highlighted">gist</code> y est déjà cochée.
              </li>
              <li>
                Ce doit être un token <strong class="text-highlighted">classic</strong> : les tokens
                « fine-grained » ne savent pas accéder aux gists, ils n’ont pas la permission du tout.
              </li>
              <li>
                Ne coche <strong class="text-highlighted">rien d’autre</strong> que
                <code class="text-highlighted">gist</code>, puis génère et copie le token.
              </li>
              <li>Colle-le ici, sur chacun de tes appareils.</li>
            </ol>
            <UFormField label="Token GitHub" name="token">
              <UInput
                v-model="tokenDraft"
                type="password"
                placeholder="ghp_…"
                autocomplete="off"
                class="w-full"
                @keydown.enter="link"
              />
            </UFormField>
            <UAlert
              color="neutral"
              variant="subtle"
              icon="i-lucide-shield"
              title="Ce que ça implique"
              description="Le token est enregistré sur cet appareil seulement : il ne part jamais dans le gist,
                ni dans un export JSON. La portée « gist » ne touche ni à tes dépôts ni à ton compte, mais
                elle couvre tous tes gists, pas seulement celui-ci — c’est le grain le plus fin que
                GitHub propose pour les gists. Révoque-le si tu perds l’appareil."
            />
            <UButton
              icon="i-lucide-cloud"
              :loading="linking"
              :disabled="!tokenDraft.trim()"
              @click="link"
            >
              Relier cet appareil
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="discardOpen" title="Supprimer la copie de secours ?">
      <template #body>
        <div class="space-y-3">
          <p class="text-sm text-toned">
            Cette copie est le seul exemplaire restant de la sauvegarde que l’app n’a pas su
            relire. La supprimer ne libère rien d’utile.
          </p>
          <p class="text-sm text-toned">
            <strong class="text-highlighted">Télécharge-la d’abord</strong> si tu n’es pas certain
            de ne plus en avoir besoin.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton color="neutral" variant="ghost" @click="discardOpen = false">
            Annuler
          </UButton>
          <UButton color="error" icon="i-lucide-trash-2" @click="confirmDiscard">
            Supprimer
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
            <strong class="text-highlighted">Une copie de secours est conservée</strong> et
            restera téléchargeable depuis ce menu. Elle ne survit toutefois pas à un vidage du
            navigateur : exporte aussi ta sauvegarde si elle compte.
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
