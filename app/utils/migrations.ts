/**
 * Migrations de sauvegarde.
 *
 * Isolées du composable pour la même raison que `sync.ts` : c'est du code qui
 * peut faire *perdre* une progression, donc il doit être testable sans
 * navigateur. `pnpm test:migration` en est la contrepartie obligatoire — ne pas
 * toucher à ce fichier sans étendre le test.
 *
 * Une migration est indexée par la version *d'origine* et doit poser la version
 * suivante elle-même ; `normalize()` refuse une migration qui n'avance pas,
 * plutôt que de boucler.
 */

/** Forme minimale sur laquelle les migrations travaillent. */
type RawSave = Record<string, unknown>

/**
 * v1 → v2 : `quests.ts` est absorbé par `missions.ts`.
 *
 * Les six quêtes que le guide retenait (§12) étaient un sous-ensemble arbitraire
 * des 84 missions du jeu, choisi pour son intérêt d'optimisation d'équipe.
 * Maintenant que les 84 sont inventoriées, garder les deux listes voudrait dire
 * cocher deux fois les mêmes missions. On reporte donc les clés `quest:<id>`
 * vers `mission:<code>`.
 *
 * `objets-pouvoir` était un *lot* : une seule case pour les cinq missions qui
 * donnent un Power item. Elle se déplie en cinq — c'est le seul endroit où une
 * clé en produit plusieurs, et la raison pour laquelle cette table associe un
 * tableau plutôt qu'une chaîne.
 */
const QUEST_TO_MISSIONS: Record<string, string[]> = {
  'seasonal-research': ['053'],
  'portal-purge': ['050'],
  'all-the-right-moves': ['006'],
  'as-hard-as-they-come': ['010'],
  'exp-millionaire': ['020'],
  // #003 Power Bracer · #005 Power Belt · #033 Power Anklet · #052 Power Band
  // · #071 Power Weight.
  'objets-pouvoir': ['003', '005', '033', '052', '071'],
}

export function migrateV1ToV2(save: RawSave): RawSave {
  const next: RawSave = { ...save, version: 2 }

  const resources = save.resources
  if (!resources || typeof resources !== 'object') return next

  const migrated: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(resources as Record<string, unknown>)) {
    if (!key.startsWith('quest:')) {
      migrated[key] = value
      continue
    }

    const codes = QUEST_TO_MISSIONS[key.slice('quest:'.length)]
    /*
     * Une clé `quest:` inconnue est laissée telle quelle plutôt que jetée : elle
     * ne correspond à rien dans le contenu, donc la purge la proposera — c'est
     * à l'utilisateur de trancher, pas à une migration silencieuse.
     */
    if (!codes) {
      migrated[key] = value
      continue
    }

    /*
     * Seul un `true` se reporte. Un `false` explicite est indiscernable d'une
     * case jamais touchée — le défaut est décoché — donc le déplier sur cinq
     * missions n'écrirait que du bruit.
     */
    if (value !== true) continue

    for (const code of codes) migrated[`mission:${code}`] = true
  }

  next.resources = migrated
  return next
}

export const migrations: Record<number, (save: RawSave) => RawSave> = {
  1: migrateV1ToV2,
}
