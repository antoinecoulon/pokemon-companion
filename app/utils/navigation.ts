export interface NavItem {
  label: string
  to: string
  icon: string
  /** Affiché dans la bottom-nav mobile (limitée à 5 entrées pour rester tapable). */
  primary: boolean
}

export const navItems: NavItem[] = [
  { label: 'Accueil', to: '/', icon: 'i-lucide-house', primary: true },
  { label: 'Roadmap', to: '/roadmap', icon: 'i-lucide-list-checks', primary: true },
  { label: 'Équipe', to: '/equipe', icon: 'i-lucide-users', primary: true },
  { label: 'Ressources', to: '/ressources', icon: 'i-lucide-package', primary: true },
  { label: 'Référence', to: '/reference', icon: 'i-lucide-book-open', primary: true },
  { label: 'Journal', to: '/journal', icon: 'i-lucide-notebook-pen', primary: false },
]

export const primaryNavItems = navItems.filter(item => item.primary)
