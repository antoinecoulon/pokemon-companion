<script setup lang="ts">
/**
 * Une section de page : titre, sous-titre optionnel, action à droite, contenu.
 *
 * Remplace le motif « h2 + lien Voir X » qui était recopié dans chaque page avec
 * des tailles et des espacements différents. Le titre de la page, lui, est rendu
 * par la barre du layout — une section n'a donc jamais de `h1`.
 */
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-1 min-w-0">
        <h2 class="text-lg font-semibold tracking-tight text-highlighted">
          {{ title }}
        </h2>
        <p v-if="description" class="text-sm leading-relaxed text-muted max-w-3xl">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.action" class="shrink-0 pt-1">
        <slot name="action" />
      </div>
    </div>

    <slot />
  </section>
</template>
