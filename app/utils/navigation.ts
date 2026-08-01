export interface NavItem {
  label: string
  to: string
  icon: string
  /**
   * Affiché dans la bottom-nav mobile, limitée à 5 entrées pour rester tapable
   * à 390 px. Ce qui en sort part dans le header mobile — avec un libellé, pas
   * une icône seule.
   */
  primary: boolean
}

/*
 * Toute icône listée ici doit aussi figurer dans `icon.clientBundle.icons` de
 * `nuxt.config.ts` : le scan de @nuxt/icon ne lit pas les fichiers .ts, et une
 * icône non déclarée rend un <svg> vide. `pnpm validate` échoue sinon.
 */
export const navItems: NavItem[] = [
  { label: 'Accueil', to: '/', icon: 'i-lucide-house', primary: true },
  /*
   * La complétion a pris la place de la roadmap : les phases 0 à 4 du guide
   * étaient faites, seule la Battle Frontier en restait, et elle tient
   * désormais dans une section de cette page. `/roadmap` reste routé et
   * redirige — des liens et des favoris pointent encore dessus.
   */
  { label: 'Complétion', to: '/completion', icon: 'i-lucide-trophy', primary: true },
  { label: 'Équipe', to: '/equipe', icon: 'i-lucide-users', primary: true },
  { label: 'Ressources', to: '/ressources', icon: 'i-lucide-package', primary: true },
  { label: 'Journal', to: '/journal', icon: 'i-lucide-notebook-pen', primary: true },
  // Pages consultées ponctuellement : accessibles depuis la sidebar, le header
  // mobile et les liens de tâches. La bottom-nav est pleine à 5 entrées — toute
  // nouvelle page passe forcément par ici.
  { label: 'Référence', to: '/reference', icon: 'i-lucide-book-open', primary: false },
]

export const primaryNavItems = navItems.filter(item => item.primary)

export const secondaryNavItems = navItems.filter(item => !item.primary)
