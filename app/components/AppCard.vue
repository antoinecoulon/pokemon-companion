<script setup lang="ts">
/*
 * Import explicite indispensable : `:is="'NuxtLink'"` — la chaîne — ne résout
 * pas et rend un élément littéral `<nuxtlink>`, sans `<a>` ni navigation. Il
 * faut passer le composant lui-même.
 */
import { NuxtLink } from '#components'

/**
 * La boîte de l'app : bordure, rayon, fond et padding définis à un seul endroit.
 *
 * `tone` et `interactive` portent la hiérarchie qui manquait : un bloc de
 * lecture et une carte cliquable ne doivent pas se ressembler. Voir l'échelle
 * d'espacement en tête de `app/assets/css/main.css`.
 */
const props = withDefaults(defineProps<{
  density?: 'comfortable' | 'compact'
  /** `raised` pour un bloc de synthèse ; `plain` pour une carte de liste. */
  tone?: 'plain' | 'raised'
  /** Survol et curseur. À réserver aux cartes réellement cliquables. */
  interactive?: boolean
  /** Renseigné, la carte devient un lien. */
  to?: string
}>(), {
  density: 'comfortable',
  tone: 'plain',
  interactive: false,
})

const padding = computed(() => props.density === 'compact' ? 'p-4' : 'p-5')

const background = computed(() => props.tone === 'raised' ? 'bg-elevated/30' : 'bg-default')

// Un lien est interactif par nature : pas besoin de le déclarer deux fois.
const clickable = computed(() => props.interactive || Boolean(props.to))
</script>

<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="block rounded-[var(--ui-radius)] border border-default transition-colors"
    :class="[
      padding,
      background,
      clickable ? 'hover:border-inverted/20 hover:bg-elevated/60' : '',
    ]"
  >
    <slot />
  </component>
</template>
