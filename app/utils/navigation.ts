export interface NavItem {
  label: string
  /** Route absolue, préfixe de jeu compris (`/unbound/completion`). */
  to: string
  icon: string
  /**
   * Affiché dans la bottom-nav mobile, limitée à 5 entrées pour rester tapable
   * à 390 px. Ce qui en sort part dans le header mobile — avec un libellé, pas
   * une icône seule.
   */
  primary: boolean
}

/** Une entrée telle qu'un jeu la déclare : `to` relatif à sa racine. */
export type NavItemDef = Omit<NavItem, 'to'> & { to: string }

/*
 * Toute icône utilisée par une nav de jeu doit aussi figurer dans
 * `icon.clientBundle.icons` de `nuxt.config.ts` : le scan de @nuxt/icon ne lit
 * pas les fichiers .ts, et une icône non déclarée rend un <svg> vide, sans la
 * moindre erreur. `pnpm validate` échoue sinon.
 */

/**
 * Préfixe les routes d'un jeu.
 *
 * `to: '/'` devient `/unbound` et non `/unbound/` : le layout compare les routes
 * par préfixe pour trouver le titre courant, et une barre finale ferait échouer
 * la comparaison exacte sur l'accueil.
 */
export function navFor(basePath: string, items: NavItemDef[]): NavItem[] {
  return items.map(item => ({
    ...item,
    to: item.to === '/' ? basePath : `${basePath}${item.to}`,
  }))
}

export const primaryOf = (items: NavItem[]) => items.filter(item => item.primary)

export const secondaryOf = (items: NavItem[]) => items.filter(item => !item.primary)
