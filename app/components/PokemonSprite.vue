<script setup lang="ts">
import type { PokemonSheet } from '~/data/types'

/**
 * Sprite d'un Pokémon, servi depuis `public/sprites/` (voir
 * `scripts/fetch-sprites.mjs`). Deux variantes : `home` pour un en-tête de
 * fiche, `pixel` pour une vignette.
 *
 * Les fiches concept (mule à objets, porteur de Synchro) n'ont pas de `sprite` :
 * on affiche une icône neutre plutôt qu'une image cassée.
 */
const props = withDefaults(defineProps<{
  sheet: PokemonSheet
  variant?: 'home' | 'pixel'
  size?: number
}>(), {
  variant: 'pixel',
  size: 48,
})

// Les chemins de `public/` ne sont pas réécrits : sous GitHub Pages l'app vit
// dans un sous-chemin, il faut donc préfixer par la baseURL.
const { app } = useRuntimeConfig()

const source = computed(() => props.sheet.sprite
  ? `${app.baseURL}/sprites/${props.variant}/${props.sheet.slug}.png`.replace(/\/{2,}/g, '/')
  : null)
</script>

<template>
  <img
    v-if="source"
    :src="source"
    :alt="`Sprite de ${sheet.name}`"
    :width="size"
    :height="size"
    loading="lazy"
    decoding="async"
    class="shrink-0 object-contain"
    :class="variant === 'pixel' ? 'image-render-pixel' : ''"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
  <span
    v-else
    class="shrink-0 inline-flex items-center justify-center rounded-full bg-elevated text-dimmed"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-label="`Pas de sprite pour ${sheet.name}`"
  >
    <UIcon name="i-lucide-circle-dashed" class="size-1/2" />
  </span>
</template>
