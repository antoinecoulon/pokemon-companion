<script setup lang="ts">
/*
 * La roadmap a été remplacée par la complétion. Les phases 0 à 4 du guide
 * étaient faites — la partie les a dépassées — et la phase 5, Battle Frontier,
 * est devenue une section de `/completion`.
 *
 * La route est conservée plutôt que supprimée : le dashboard y renvoyait par
 * ancre (`/roadmap#phase-3`), l'app est installée en PWA sur un téléphone dont
 * l'écran d'accueil peut pointer dessus, et un 404 sur un hébergement statique
 * ne se rattrape pas. Une redirection ne coûte qu'une page vide.
 */
definePageMeta({ redirect: '/completion' })
</script>

<template>
  <div />
</template>
