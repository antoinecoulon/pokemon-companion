<script setup lang="ts">
/**
 * Bascule d'un jeu suivi à l'autre.
 *
 * La bascule est une **navigation**, pas un changement d'état : on va sur
 * `/elite-redux`, et le middleware met le jeu actif à jour. C'est ce qui garde
 * la route comme source de vérité et rend le retour arrière du navigateur
 * cohérent.
 *
 * Chaque entrée est donc un vrai lien. Ne pas passer `:to` à un `UBadge` : il
 * rend un `<span>`, ce qui donne un contrôle d'apparence cliquable qui ne
 * navigue nulle part, sans la moindre erreur.
 */
defineProps<{ compact?: boolean }>()

const { games, current } = useGame()
</script>

<template>
  <!-- Un seul jeu suivi : le sélecteur n'aurait rien à proposer. -->
  <UDropdownMenu
    v-if="games.length > 1"
    :items="games.map(game => ({
      label: game.label,
      icon: game.id === current.id ? 'i-lucide-check' : 'i-lucide-gamepad-2',
      to: game.basePath,
    }))"
    :content="{ align: 'start' }"
  >
    <UButton
      :label="compact ? undefined : current.label"
      :icon="compact ? 'i-lucide-gamepad-2' : undefined"
      :trailing-icon="compact ? undefined : 'i-lucide-chevrons-up-down'"
      :aria-label="compact ? `Jeu : ${current.label}` : undefined"
      color="neutral"
      variant="ghost"
      size="xs"
      :block="!compact"
      :class="compact ? undefined : 'justify-between'"
    />
  </UDropdownMenu>
</template>
