<script setup lang="ts">
/*
 * Racine : renvoie vers le dernier jeu ouvert.
 *
 * Redirection faite ici et non dans `definePageMeta({ redirect })` : la cible
 * dépend du `localStorage`, donc d'un état qui n'existe qu'une fois le client
 * démarré. Une redirection statique enverrait toujours sur le même jeu.
 */
const { current } = useGame()

onMounted(() => {
  navigateTo(current.value.basePath, { replace: true })
})
</script>

<template>
  <div class="py-16 text-center text-sm text-dimmed">
    Ouverture…
  </div>
</template>
