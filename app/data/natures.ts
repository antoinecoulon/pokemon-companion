import type { Nature } from './types'

// §13.1 — Table complète des natures.
export const natures: Nature[] = [
  {
    fr: 'Rigide',
    en: 'Adamant',
    up: 'atk',
    down: 'spa',
    usage: 'Sweeper physique lent, bulky offense',
  },
  {
    fr: 'Solo',
    en: 'Lonely',
    up: 'atk',
    down: 'def',
  },
  {
    fr: 'Brave',
    en: 'Brave',
    up: 'atk',
    down: 'spe',
  },
  {
    fr: 'Mauvais',
    en: 'Naughty',
    up: 'atk',
    down: 'spd',
  },
  {
    fr: 'Assuré',
    en: 'Bold',
    up: 'def',
    down: 'atk',
    usage: 'Tank physique',
  },
  {
    fr: 'Malin',
    en: 'Impish',
    up: 'def',
    down: 'spa',
    usage: 'Tank physique qui frappe physique',
  },
  {
    fr: 'Relax',
    en: 'Relaxed',
    up: 'def',
    down: 'spe',
  },
  {
    fr: 'Lâche',
    en: 'Lax',
    up: 'def',
    down: 'spd',
  },
  {
    fr: 'Modeste',
    en: 'Modest',
    up: 'spa',
    down: 'atk',
    usage: 'Sweeper spécial puissant',
  },
  {
    fr: 'Doux',
    en: 'Mild',
    up: 'spa',
    down: 'def',
  },
  {
    fr: 'Discret',
    en: 'Quiet',
    up: 'spa',
    down: 'spe',
  },
  {
    fr: 'Foufou',
    en: 'Rash',
    up: 'spa',
    down: 'spd',
  },
  {
    fr: 'Calme',
    en: 'Calm',
    up: 'spd',
    down: 'atk',
    usage: 'Tank spécial',
  },
  {
    fr: 'Gentil',
    en: 'Gentle',
    up: 'spd',
    down: 'def',
  },
  {
    fr: 'Malpoli',
    en: 'Sassy',
    up: 'spd',
    down: 'spe',
  },
  {
    fr: 'Prudent',
    en: 'Careful',
    up: 'spd',
    down: 'spa',
    usage: 'Tank spécial qui frappe physique',
  },
  {
    fr: 'Timide',
    en: 'Timid',
    up: 'spe',
    down: 'atk',
    usage: 'Sweeper spécial rapide',
  },
  {
    fr: 'Pressé',
    en: 'Hasty',
    up: 'spe',
    down: 'def',
  },
  {
    fr: 'Jovial',
    en: 'Jolly',
    up: 'spe',
    down: 'spa',
    usage: 'Sweeper physique rapide',
  },
  {
    fr: 'Naïf',
    en: 'Naive',
    up: 'spe',
    down: 'spd',
  },
] satisfies Nature[]

const normalize = (value: string) => value.trim().toLowerCase()

/**
 * Ramène une nature saisie à son nom anglais, quelle que soit la langue écrite.
 *
 * Le contenu est passé en VO, mais `progress.nature` est une chaîne libre déjà
 * écrite dans les sauvegardes — en français pour tout ce qui a été saisi avant
 * la bascule. Sans cette résolution, une nature valide saisie il y a six mois
 * cesserait d'être reconnue en silence, ce qui est exactement le genre de
 * régression que les sauvegardes ne signalent jamais.
 *
 * Renvoie `undefined` si l'entrée ne correspond à aucune nature connue.
 */
export function toNatureEn(input: string | undefined): string | undefined {
  if (!input?.trim()) return undefined
  return natures.find(
    nature => normalize(nature.fr) === normalize(input) || normalize(nature.en) === normalize(input),
  )?.en
}

/** Vrai si la nature saisie est bien `target` (nom anglais), écrite dans l'une ou l'autre langue. */
export function matchesNature(input: string | undefined, target: string): boolean {
  const resolved = toNatureEn(input)
  return !!resolved && normalize(resolved) === normalize(target)
}
