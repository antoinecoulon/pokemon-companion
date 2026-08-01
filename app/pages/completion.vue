<script setup lang="ts">
import type { CompletionEntry } from '~/utils/completion'
import type { ResourceKey } from '~/data/types'
import { phases } from '~/data/phases'
import { completionGroups } from '~/utils/completion'

useHead({ title: 'Complétion · Pokémon Companion' })

const { isAcquired, setAcquired } = useSave()
const { completion, byCompletionSection, byPhase } = useProgress()
const { blockersFor } = useNextActions()

/*
 * La Battle Frontier est tout ce qui reste de la roadmap du guide. Elle est
 * rendue à part, en tâches et non en objectifs : elle a un ordre et des
 * `requires`, et elle alimente « prochaines actions » — ce que la complétion,
 * par construction, ne fait pas.
 */
const frontier = phases[0]

function toggle(key: ResourceKey, value: unknown) {
  setAcquired(key, Boolean(value))
}

/** `label` est en markdown inline ; l'attribut aria le veut en texte brut. */
function plain(label: string) {
  return label.replace(/\*/g, '')
}

/** Une source est soit un renvoi au guide (« §9.1 »), soit l'URL consultée. */
function sourceLabel(source: string) {
  if (source.startsWith('§')) return `Guide ${source}`
  return source.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

const hideDone = ref(false)
const search = ref('')

const query = computed(() => search.value.trim().toLowerCase())

function matches(entry: CompletionEntry) {
  if (!query.value) return true
  return [entry.label, entry.summary, entry.location, entry.reward, ...(entry.details ?? [])]
    .join(' ')
    .toLowerCase()
    .includes(query.value)
}

/*
 * Chercher le nom d'une catégorie doit la ramener entière. Les 100 Zygarde
 * Cells s'appellent « Cell #001 » : le mot « Zygarde » n'apparaît que dans le
 * titre du groupe, donc filtrer entrée par entrée ne remontait rien.
 */
function groupMatches(group: { title: string, description?: string }) {
  if (!query.value) return false
  return `${group.title} ${group.description ?? ''}`.toLowerCase().includes(query.value)
}

/*
 * Une entrée répétable ne quitte jamais la liste. Un raid den ou un move tutor
 * se refait indéfiniment : cocher y veut dire « déjà fait au moins une fois »,
 * pas « rayé ». L'archiver le ferait disparaître de la seule liste où on vient
 * le rechercher.
 */
const isArchived = (entry: CompletionEntry) => isAcquired(entry.key) && !entry.repeatable

const groups = computed(() =>
  completionGroups
    .map((group) => {
      const all = groupMatches(group)
      const kept = group.entries.filter(entry => all || matches(entry))
      return {
        ...group,
        shown: kept.filter(entry => !isArchived(entry)),
        done: kept.filter(entry => isArchived(entry)),
        ratio: byCompletionSection.value.get(group.id),
      }
    })
    .filter(group => group.shown.length || group.done.length),
)

/*
 * ~350 entrées : tout déplier d'un coup rend la page inutilisable au pouce. On
 * n'ouvre donc que le premier groupe encore incomplet — et, pendant une
 * recherche, tous ceux qui ont un résultat, sans quoi on chercherait à l'aveugle.
 */
const open = ref<string[]>([])

watch(query, (value) => {
  if (value) open.value = groups.value.map(group => group.id)
})

onMounted(() => {
  const firstIncomplete = completionGroups.find(
    group => (byCompletionSection.value.get(group.id)?.percent ?? 100) < 100,
  )
  const target = firstIncomplete ?? completionGroups[0]
  if (target) open.value = [target.id]
})
</script>

<template>
  <div class="space-y-10">
    <!-- Vue d'ensemble -->
    <AppCard tone="raised">
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing
          :percent="completion.percent"
          :size="112"
          :sublabel="`${completion.done}/${completion.total}`"
        />
        <div class="flex-1 space-y-3 text-center sm:text-left">
          <h2 class="text-lg font-semibold tracking-tight text-highlighted">
            Complétion
          </h2>
          <p class="text-sm leading-relaxed text-toned">
            Tout ce qu’il reste à voir du jeu : missions, légendaires, tutors, objets clés,
            collectibles. <strong class="text-highlighted">Ce compteur est indépendant de
              l’avancement d’équipe</strong> — cocher ici ne fait pas bouger la progression
            des fiches, et inversement.
          </p>
          <div class="flex flex-wrap justify-center sm:justify-start items-center gap-2">
            <UBadge color="neutral" variant="subtle">
              {{ completion.total }} entrées
            </UBadge>
            <USwitch v-model="hideDone" label="Masquer ce qui est fait" size="sm" />
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Battle Frontier : la dernière phase du guide, en tâches -->
    <SectionBlock
      v-if="frontier"
      :title="frontier.title"
      description="La destination de tout le parcours, et le seul reste de la roadmap du guide. Ces tâches-là ont un ordre, et alimentent « prochaines actions »."
    >
      <template #action>
        <span class="text-xs text-dimmed whitespace-nowrap tabular-nums">
          {{ byPhase.get(frontier.id)?.done ?? 0 }}/{{ frontier.tasks.length }}
        </span>
      </template>

      <ContentBlocks v-if="frontier.intro" :blocks="frontier.intro" compact />
      <div class="divide-y divide-default">
        <TaskItem
          v-for="task in frontier.tasks"
          :key="task.id"
          :task="task"
          :blocked-by="blockersFor(task.id)"
        />
      </div>
    </SectionBlock>

    <!-- Recherche : indispensable à 84 missions et 100 cells -->
    <UInput
      v-model="search"
      icon="i-lucide-search"
      placeholder="Chercher une mission, un objet, un lieu…"
      size="lg"
      class="w-full"
      :ui="{ trailing: 'pe-1' }"
    >
      <template v-if="search" #trailing>
        <UButton
          color="neutral"
          variant="link"
          icon="i-lucide-x"
          aria-label="Effacer la recherche"
          @click="search = ''"
        />
      </template>
    </UInput>

    <p v-if="query && !groups.length" class="text-sm text-dimmed">
      Aucun résultat pour « {{ search }} ».
    </p>

    <!--
      `label: min-w-0` n'est pas décoratif : le slot de libellé de UAccordion ne
      porte pas de `min-w-0`, contrairement au bouton qui l'entoure. Un titre
      long — « Portal Purge — les légendaires des portails » — poussait donc
      l'en-tête à 378 px dans un écran de 375, et `pnpm smoke` le voyait en
      débordement horizontal.
    -->
    <UAccordion
      v-model="open"
      type="multiple"
      :items="groups.map(group => ({ value: group.id, label: group.title }))"
      :ui="{ item: 'border-default', label: 'min-w-0 flex-1' }"
    >
      <template #default="{ item }">
        <div :id="item.value" class="flex items-center gap-3 flex-1 min-w-0 text-left scroll-mt-20">
          <span
            class="grid place-items-center size-7 shrink-0 rounded-full"
            :class="(groups.find(g => g.id === item.value)?.ratio?.percent ?? 0) === 100
              ? 'bg-success/15 text-success'
              : 'bg-elevated text-muted'"
          >
            <UIcon
              :name="(groups.find(g => g.id === item.value)?.ratio?.percent ?? 0) === 100
                ? 'i-lucide-check'
                : 'i-lucide-circle-dashed'"
              class="size-4"
            />
          </span>
          <!-- Le titre passe à la ligne plutôt que de se faire tronquer : à
               375 px, « Missions — avant la Ligue » perdrait sa moitié utile. -->
          <p class="text-sm font-medium text-highlighted flex-1 min-w-0">
            {{ item.label }}
          </p>
          <span class="text-xs text-dimmed tabular-nums shrink-0">
            {{ groups.find(g => g.id === item.value)?.ratio?.done ?? 0 }}/{{
              groups.find(g => g.id === item.value)?.ratio?.total ?? 0 }}
          </span>
        </div>
      </template>

      <template #content="{ item }">
        <template v-for="group in [groups.find(g => g.id === item.value)!]" :key="group.id">
          <div class="space-y-4 pb-2">
            <p v-if="group.description" class="text-sm leading-relaxed text-toned" v-html="formatInline(group.description)" />

            <div v-if="group.shown.length" class="grid sm:grid-cols-2 gap-4">
              <AppCard
                v-for="entry in group.shown"
                :key="entry.key"
                density="compact"
                class="space-y-2"
              >
                <div class="flex items-start gap-3">
                  <UCheckbox
                    :model-value="isAcquired(entry.key)"
                    :aria-label="`Marquer comme fait : ${plain(entry.label)}`"
                    class="mt-0.5 shrink-0"
                    @update:model-value="toggle(entry.key, $event)"
                  />
                  <h3
                    class="text-sm font-medium flex-1"
                    :class="isAcquired(entry.key) ? 'text-muted line-through decoration-1' : 'text-highlighted'"
                    v-html="formatInline(entry.label)"
                  />
                  <UIcon
                    v-if="entry.repeatable"
                    name="i-lucide-repeat"
                    class="size-4 shrink-0 text-dimmed"
                    :aria-label="isAcquired(entry.key) ? 'Refaisable — déjà fait au moins une fois' : 'Refaisable'"
                  />
                  <UBadge v-if="entry.optional" color="neutral" variant="subtle" size="sm" class="shrink-0">
                    optionnel
                  </UBadge>
                </div>

                <div class="pl-7 space-y-1.5">
                  <p v-if="entry.summary" class="text-[0.8125rem] leading-relaxed text-toned" v-html="formatInline(entry.summary)" />
                  <p v-if="entry.location" class="text-xs text-muted" v-html="formatInline(entry.location)" />
                  <p v-if="entry.reward" class="text-xs text-primary" v-html="formatInline(entry.reward)" />
                  <p
                    v-for="(detail, index) in entry.details"
                    :key="index"
                    class="text-xs leading-relaxed text-dimmed"
                    v-html="formatInline(detail)"
                  />
                  <!--
                    Un vrai <a>, pas le texte inerte d'avant : la source est une
                    page wiki qu'on vient consulter. `UBadge :to` rendrait un
                    <span> sans navigation, et NuxtLink n'ouvrirait pas d'onglet.
                  -->
                  <a
                    v-if="entry.source.startsWith('https://')"
                    :href="entry.source"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-[0.6875rem] text-dimmed/80 hover:text-primary hover:underline break-all"
                  >
                    <UIcon name="i-lucide-external-link" class="size-3 shrink-0" />
                    {{ sourceLabel(entry.source) }}
                  </a>
                  <p v-else class="text-[0.6875rem] text-dimmed/80">
                    {{ sourceLabel(entry.source) }}
                  </p>
                </div>
              </AppCard>
            </div>

            <p v-else-if="!group.done.length" class="text-sm text-dimmed">
              Section terminée.
            </p>

            <ResourceArchive
              v-if="group.done.length && !hideDone"
              :label="`Déjà fait (${group.done.length})`"
            >
              <li v-for="entry in group.done" :key="entry.key" class="flex items-start gap-3">
                <UCheckbox
                  :model-value="isAcquired(entry.key)"
                  :aria-label="`Marquer comme non fait : ${plain(entry.label)}`"
                  class="mt-0.5 shrink-0"
                  @update:model-value="toggle(entry.key, $event)"
                />
                <div class="min-w-0">
                  <p class="text-[0.8125rem] text-muted line-through decoration-1" v-html="formatInline(entry.label)" />
                  <p v-if="entry.location" class="text-xs text-dimmed" v-html="formatInline(entry.location)" />
                </div>
              </li>
            </ResourceArchive>
          </div>
        </template>
      </template>
    </UAccordion>
  </div>
</template>
