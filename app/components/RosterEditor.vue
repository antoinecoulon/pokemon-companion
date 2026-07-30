<script setup lang="ts">
import { TEAM_SIZE } from '~/data/types'

/**
 * Édition de la composition jouée.
 *
 * Pas de glisser-déposer : l'app est d'abord consultée au téléphone, une main sur
 * la manette. Des boutons ↑/↓ et un choix explicite du sortant sont plus sûrs et
 * accessibles au clavier.
 */
const open = defineModel<boolean>({ required: true })

const roster = useRoster()
const toast = useToast()

/** Slug de l'entrant en attente du choix de son sortant, quand l'équipe est pleine. */
const pendingIncoming = ref<string | null>(null)

const full = computed(() => roster.active.value.length >= TEAM_SIZE)

function run(action: () => boolean, success?: string) {
  if (action()) {
    if (success) toast.add({ title: success, color: 'success', icon: 'i-lucide-check' })
    return
  }
  toast.add({
    title: 'Composition inchangée',
    description: roster.lastError.value ?? undefined,
    color: 'warning',
    icon: 'i-lucide-triangle-alert',
  })
}

function bringIn(slug: string) {
  if (full.value) {
    pendingIncoming.value = slug
    return
  }
  run(() => roster.promote(slug), 'Ajouté à l’équipe')
}

function confirmSwap(outgoing: string) {
  const incoming = pendingIncoming.value
  if (!incoming) return
  pendingIncoming.value = null
  run(() => roster.swap(incoming, outgoing), 'Échange effectué')
}

const pendingName = computed(() =>
  pendingIncoming.value ? roster.bySlug.value.get(pendingIncoming.value)?.sheet.name : null,
)
</script>

<template>
  <UDrawer v-model:open="open" title="Modifier la composition" direction="bottom">
    <template #body>
      <div class="space-y-6 pb-2">
        <UAlert
          v-if="pendingIncoming"
          color="info"
          variant="subtle"
          icon="i-lucide-arrow-left-right"
          title="Qui sort de l’équipe ?"
          :description="`Les ${TEAM_SIZE} slots sont pris. Choisis le membre que ${pendingName} remplace.`"
          :actions="[{ label: 'Annuler', color: 'neutral', variant: 'subtle', onClick: () => (pendingIncoming = null) }]"
        />

        <!-- Les six slots -->
        <SectionBlock
          title="Composition"
          :description="`${roster.active.value.length} membre(s) sur ${TEAM_SIZE}.`"
        >
          <ul class="rounded-[var(--ui-radius)] border border-default divide-y divide-default">
            <li
              v-for="(entry, index) in roster.active.value"
              :key="entry.sheet.slug"
              class="flex items-center gap-3 p-3"
            >
              <span class="text-xs text-dimmed tabular-nums w-6 shrink-0">#{{ entry.slot }}</span>
              <PokemonSprite :sheet="entry.sheet" variant="pixel" :size="36" />
              <span class="flex-1 min-w-0 text-sm font-medium text-highlighted truncate">
                {{ entry.sheet.name }}
              </span>

              <UButton
                v-if="pendingIncoming"
                size="xs"
                color="primary"
                variant="subtle"
                @click="confirmSwap(entry.sheet.slug)"
              >
                Remplacer
              </UButton>

              <template v-else>
                <UButton
                  icon="i-lucide-arrow-up"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :disabled="index === 0"
                  :aria-label="`Monter ${entry.sheet.name}`"
                  @click="roster.move(entry.sheet.slug, -1)"
                />
                <UButton
                  icon="i-lucide-arrow-down"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :disabled="index === roster.active.value.length - 1"
                  :aria-label="`Descendre ${entry.sheet.name}`"
                  @click="roster.move(entry.sheet.slug, 1)"
                />
                <UButton
                  icon="i-lucide-log-out"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :aria-label="`Sortir ${entry.sheet.name} de l’équipe`"
                  @click="run(() => roster.demote(entry.sheet.slug), 'Sorti de l’équipe')"
                />
              </template>
            </li>
          </ul>
        </SectionBlock>

        <!-- Le reste de la boîte -->
        <SectionBlock
          title="Hors équipe"
          description="Les utilitaires (§6.7) ne combattent pas — les faire entrer n’a de sens que le temps d’un test."
        >
          <ul class="rounded-[var(--ui-radius)] border border-default divide-y divide-default">
            <li
              v-for="entry in roster.others.value"
              :key="entry.sheet.slug"
              class="flex items-center gap-3 p-3"
            >
              <PokemonSprite :sheet="entry.sheet" variant="pixel" :size="36" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-highlighted truncate">
                  {{ entry.sheet.name }}
                </p>
                <UBadge :color="STATUS_BADGE[entry.status].color" variant="subtle" size="sm">
                  {{ STATUS_BADGE[entry.status].label }}
                </UBadge>
              </div>
              <UButton
                size="xs"
                color="neutral"
                variant="subtle"
                icon="i-lucide-log-in"
                :disabled="!!pendingIncoming"
                @click="bringIn(entry.sheet.slug)"
              >
                {{ full ? 'Échanger' : 'Faire entrer' }}
              </UButton>
            </li>
          </ul>
        </SectionBlock>

        <div v-if="roster.modified.value" class="flex justify-end">
          <UButton
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="subtle"
            size="sm"
            @click="roster.reset(); pendingIncoming = null"
          >
            Revenir à la composition du guide
          </UButton>
        </div>
      </div>
    </template>
  </UDrawer>
</template>
