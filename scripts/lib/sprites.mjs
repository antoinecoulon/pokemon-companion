/**
 * Résolution d'un slug de sprite sur pokemondb.
 *
 * Le slug pokemondb est en anglais et ne se déduit pas du slug français de la
 * fiche (`motisma-lavage` → `rotom-wash`). Il était donc cherché à la main, et
 * une faute ne se voyait qu'au 404 de `pnpm sprites` — voire pas du tout, un
 * `sprite: ''` étant falsy.
 *
 * Le jeu du sprite pixel est sondé plutôt que codé en dur : un Pokémon
 * postérieur à Noir/Blanc n'y a aucun sprite, ce qui faisait échouer la seule
 * variante pixel.
 */

const BASE = 'https://img.pokemondb.net/sprites'

/** Du plus ancien au plus récent : on préfère le pixel art 2D quand il existe. */
const PIXEL_SETS = ['black-white', 'sword-shield', 'scarlet-violet']

async function exists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  }
  catch {
    // Réseau coupé : on ne peut rien affirmer, donc on ne prétend pas que ça manque.
    return null
  }
}

export const homeUrl = sprite => `${BASE}/home/normal/${sprite}.png`
export const pixelUrl = (sprite, set) => `${BASE}/${set}/normal/${sprite}.png`

/**
 * Vérifie un slug et détermine le jeu de son sprite pixel.
 *
 * Rend `null` si le rendu 3D « home » est introuvable : c'est le jeu complet,
 * donc un slug qui n'y figure pas est faux.
 */
export async function resolveSprite(sprite) {
  const home = await exists(homeUrl(sprite))
  if (home === null) throw new Error('pokemondb injoignable — vérifie la connexion')
  if (!home) return null

  for (const set of PIXEL_SETS) {
    if (await exists(pixelUrl(sprite, set))) return { sprite, pixelSet: set }
  }

  // Rendu 3D présent mais aucun pixel : la variante pixel échouera, autant le dire.
  return { sprite, pixelSet: PIXEL_SETS[0], pixelMissing: true }
}
