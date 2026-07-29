<script setup lang="ts">
const route = useRoute()

// Les chemins de `public/` ne sont pas réécrits automatiquement : sous GitHub
// Pages l'app vit dans un sous-chemin, il faut donc préfixer par la baseURL.
const { app } = useRuntimeConfig()
const logo = `${app.baseURL}/favicon.svg`.replace(/\/{2,}/g, '/')

const currentLabel = computed(() => {
  const match = navItems
    .filter(item => item.to === '/' ? route.path === '/' : route.path.startsWith(item.to))
    .sort((a, b) => b.to.length - a.to.length)[0]
  return match?.label ?? 'Pokémon Companion'
})

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <!-- Sidebar desktop -->
    <aside
      class="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-default bg-muted/40"
    >
      <NuxtLink to="/" class="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <img :src="logo" alt="" class="size-7">
        <span class="font-semibold tracking-tight">Pokémon Companion</span>
      </NuxtLink>

      <nav class="flex-1 px-3 py-2 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-[var(--ui-radius)] text-sm transition-colors"
          :class="isActive(item.to)
            ? 'bg-elevated text-highlighted font-medium'
            : 'text-muted hover:text-default hover:bg-elevated/60'"
        >
          <UIcon :name="item.icon" class="size-4.5 shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="px-3 py-4 border-t border-default">
        <p class="px-3 text-xs text-dimmed">
          Pokémon Unbound · post-game
        </p>
      </div>
    </aside>

    <!-- Header mobile -->
    <header
      class="lg:hidden sticky top-0 z-20 flex items-center justify-between gap-2 h-14 px-4 border-b border-default bg-default/85 backdrop-blur"
    >
      <div class="flex items-center gap-2 min-w-0">
        <img :src="logo" alt="" class="size-6 shrink-0">
        <h1 class="font-semibold truncate">
          {{ currentLabel }}
        </h1>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <UButton
          to="/journal"
          icon="i-lucide-notebook-pen"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Journal de bord"
        />
        <SaveMenu />
        <UColorModeButton size="sm" />
      </div>
    </header>

    <div class="lg:pl-64">
      <!-- Header desktop -->
      <header
        class="hidden lg:flex sticky top-0 z-20 items-center justify-between h-16 px-8 border-b border-default bg-default/85 backdrop-blur"
      >
        <h1 class="text-lg font-semibold text-highlighted">
          {{ currentLabel }}
        </h1>
        <div class="flex items-center gap-1">
          <SaveMenu />
          <UColorModeButton />
        </div>
      </header>

      <main class="px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-12 max-w-5xl mx-auto">
        <slot />
      </main>
    </div>

    <!-- Bottom-nav mobile -->
    <nav
      class="lg:hidden fixed bottom-0 inset-x-0 z-20 grid grid-cols-5 border-t border-default bg-default/95 backdrop-blur pb-safe"
    >
      <NuxtLink
        v-for="item in primaryNavItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-1 py-2 text-[0.65rem] leading-none transition-colors"
        :class="isActive(item.to) ? 'text-primary' : 'text-muted'"
      >
        <UIcon :name="item.icon" class="size-5" />
        <span class="truncate max-w-full px-0.5">{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
