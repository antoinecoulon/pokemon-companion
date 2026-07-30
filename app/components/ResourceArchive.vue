<script setup lang="ts">
/**
 * Le repli d'une section de ressources : ce qui est acquis descend ici, replié.
 *
 * Chaque section garde son propre repli — mélanger un PNJ débloqué et une quête
 * terminée en bas de page ferait perdre le contexte qui leur donne un sens.
 */
defineProps<{ label: string }>()

const open = ref(false)
</script>

<template>
  <UCollapsible v-model:open="open">
    <UButton
      :label="label"
      color="neutral"
      variant="ghost"
      size="sm"
      :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
      class="w-full justify-start text-dimmed"
    />

    <template #content>
      <ul class="pt-3 pl-1 space-y-3">
        <slot />
      </ul>
    </template>
  </UCollapsible>
</template>
