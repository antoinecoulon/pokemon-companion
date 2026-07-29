import type { BattleItem, Consumable } from './types'

// §9.1 — Objets de combat.
export const battleItems: BattleItem[] = [
  {
    id: 'bandeau-choix',
    name: 'Bandeau Choix',
    effect: 'Attaque +50 %, 1 seule capacité',
    bp: '48 BP',
    alternative: 'Code cadeau (Zapdos de Galar)',
  },
  {
    id: 'lunettes-choix',
    name: 'Lunettes Choix',
    effect: 'Att.Spé +50 %, 1 seule capacité',
    bp: '48 BP',
    alternative: 'Code cadeau (Floette Éternelle)',
  },
  {
    id: 'mouchoir-choix',
    name: 'Mouchoir Choix',
    effect: 'Vitesse +50 %, 1 seule capacité',
    bp: '48 BP',
    alternative: 'Crystal Peak 1F (salle vers Cube Corp.)',
  },
  {
    id: 'orbe-vie',
    name: 'Orbe Vie',
    effect: 'Dégâts +30 %, -10 % PV/attaque',
    bp: '48 BP',
    alternative: '**Game Corner Dehara : 7 500 jetons**',
  },
  {
    id: 'restes',
    name: 'Restes',
    effect: '+1/16 PV par tour',
    bp: '48 BP',
    alternative: '**Game Corner : 5 000 jetons** · 1 % dans les poubelles',
  },
  {
    id: 'bottes-epaisses',
    name: 'Bottes Épaisses',
    effect: 'Immunité aux pièges de terrain',
    bp: '48 BP',
    alternative: 'Cootes Bog (nord-est de Ranger Betty)',
  },
  {
    id: 'ceinture-force',
    name: 'Ceinture Force',
    effect: 'Survit à 1 PV si PV pleins',
    bp: '32 BP',
    alternative: 'Route 18, tas de sable près du pêcheur',
  },
  {
    id: 'veste-de-combat',
    name: 'Veste de Combat',
    effect: 'Déf.Spé +50 %, bloque les statuts',
    bp: '48 BP',
    alternative: 'Antisis Port',
  },
  {
    id: 'casque-brut',
    name: 'Casque Brut (Rocky Helmet)',
    effect: 'Dégâts au contact',
    bp: '48 BP',
    alternative: 'PNJ maison près de l’entrée KBT d’Epidimy',
  },
  {
    id: 'herbe-blanche',
    name: 'Herbe Blanche',
    effect: 'Annule une baisse de stat',
    bp: '24 BP',
    alternative: 'Frost Mountain 2F',
  },
  {
    id: 'roche-lisse',
    name: 'Roche Lisse',
    effect: 'Sable de 5 → 8 tours',
    bp: '—',
    alternative: 'Great Desert (nord de Cameron) · minage ADM',
  },
  {
    id: 'ballon',
    name: 'Ballon',
    effect: 'Immunité Sol jusqu’au premier coup',
    bp: '32 BP',
    alternative: 'Game Corner : 3 000 jetons',
  },
  {
    id: 'assurance',
    name: 'Assurance (Weakness Policy)',
    effect: '+2 Atk/Att.Spé si touché super-efficace',
    bp: '32 BP',
    alternative: 'Game Corner : 10 000 jetons',
  },
] satisfies BattleItem[]

/** Arbitrage du guide sur Game Corner vs Battle Tower. */
export const battleItemsTip = '💰 **Arbitrage :** l’Orbe Vie et les Restes sont **bien moins chers au Game Corner** qu’au Battle Tower. Garde tes BP pour les objets **Choix**, qui ne sont pas au Game Corner.'

// §9.2 — Consommables d'optimisation.
export const consumables: Consumable[] = [
  {
    id: 'bottle-cap',
    name: 'Bottle Cap',
    role: '1 IV à 31',
    source: 'Minage ADM (KBT Expressway, Crystal Peak) · raids 5–6★ · missions',
  },
  {
    id: 'gold-bottle-cap',
    name: 'Gold Bottle Cap',
    role: '6 IV à 31',
    source: 'Mission **#006** (les 120 CT) · minage très rare',
  },
  {
    id: 'ability-capsule',
    name: 'Ability Capsule',
    role: 'Alterne talent 1 ↔︎ talent 2',
    source: '**Game Corner de Dehara**',
  },
  {
    id: 'dream-mist',
    name: 'Dream Mist',
    role: 'Débloque le talent caché',
    source: 'Raid Musharna 5/6★ Tarmigan Town (~50 %) · 1 offerte par le scientifique devant le Research Center',
  },
  {
    id: 'dream-ball',
    name: 'Dream Ball',
    role: 'Capture avec talent caché',
    source: '3/jour, Dream Research Lab de Tarmigan Town (postgame)',
  },
  {
    id: 'vitamines',
    name: 'Vitamines',
    role: '+10 EV',
    source: 'Dept. Store de Dehara',
  },
  {
    id: 'ecaille-coeur',
    name: 'Écaille Cœur',
    role: 'Monnaie du Move Relearner',
    source: 'Pêche aux Luvdisc (Fouille + Larcin) · minage',
  },
  {
    id: 'objets-pouvoir',
    name: 'Objets Pouvoir',
    role: 'Accélèrent l’EV training',
    source: 'Missions #003, #005, #033, #052, #071 + Vivill Warehouse B5F',
  },
] satisfies Consumable[]
