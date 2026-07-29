/**
 * Tests de la logique EV/IV.
 *
 * `isOptimalEvSpread` alimente un des trois critères « Endgame Ready » déduits
 * automatiquement : s'il se trompe, la fiche affiche un faux vert. Les cas
 * limites intéressants viennent de §2.2 — 510 EV au total mais 4 EV = 1 point,
 * donc 250/250/10 gaspille 6 EV alors que le total est légal.
 *
 * Usage : pnpm test:stats
 */
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)
const { isOptimalEvSpread, wastedEvs, statsTotal, EV_TOTAL_MAX } = await jiti.import('../app/utils/stats.ts')

const failures = []

function check(label, actual, expected) {
  if (actual !== expected) failures.push(`${label} — attendu ${expected}, obtenu ${actual}`)
}

/* --- Motif 252 / 252 / 4 ----------------------------------------------- */

check('252/252/4 canonique', isOptimalEvSpread({ hp: 252, atk: 252, spd: 4 }), true)
check('252/252/4 autre ordre', isOptimalEvSpread({ atk: 252, spe: 252, hp: 4 }), true)
check('aucun EV saisi', isOptimalEvSpread({}), false)
check('252/252 sans le 4', isOptimalEvSpread({ hp: 252, def: 252 }), false)
check('250/250/10 — total légal mais mal réparti', isOptimalEvSpread({ hp: 250, def: 250, spd: 10 }), false)
check('252/252/6 — 2 EV perdus', isOptimalEvSpread({ hp: 252, def: 252, spd: 6 }), false)
check('trois stats à 252 — au-delà du plafond', isOptimalEvSpread({ hp: 252, def: 252, spd: 252 }), false)
check('252/252/4/4 — une stat de trop', isOptimalEvSpread({ hp: 252, def: 252, spd: 4, spe: 4 }), false)

/* --- EV perdus (§2.2 : seuls les multiples de 4 comptent) --------------- */

check('EV perdus sur 250/250/10', wastedEvs({ hp: 250, def: 250, spd: 10 }), 6)
check('EV perdus sur 252/252/4', wastedEvs({ hp: 252, def: 252, spd: 4 }), 0)
check('EV perdus sur 1 EV', wastedEvs({ hp: 1 }), 1)

/* --- Totaux ------------------------------------------------------------ */

check('total du motif optimal', statsTotal({ hp: 252, def: 252, spd: 4 }), 508)
check('le plafond du jeu reste 510', EV_TOTAL_MAX, 510)
check('total sur objet vide', statsTotal({}), 0)

/* --- Rapport ----------------------------------------------------------- */

if (failures.length) {
  console.error(`\n${failures.length} test(s) en échec :`)
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log('Logique EV/IV : 15 assertions, tout passe.')
