/**
 * TM et HM d'Emerald Seaglass, avec leur lieu et leurs prérequis.
 *
 * ⚠️ **Fichier généré — ne pas le corriger à la main.** Toute correction
 * serait perdue à la régénération suivante : elle se fait dans le parseur
 * (`scripts/lib/gen-seaglass-*.mjs`), puis `pnpm gen:seaglass`.
 *
 * Source : https://mrwalkthroughs.com/pokemon-emerald-seaglass/tms-hms/
 * Non recoupable : la doc officielle ne couvre pas cette donnée.
 * 68 TM et HM · 14 demandent un déplacement ou un badge
 *
 * Rien ici n'est persisté : aucun id n'entre dans `knownContent`, donc une
 * régénération ne peut pas faire perdre une progression.
 */

import type { TmEntry } from '../types'

export const tms: TmEntry[] = [
  { id: 'HM01', move: 'Cut', location: 'Rustboro City: From the Cutter by talking to him inside his house, west of the city’s PokeCenter' },
  { id: 'HM02', move: 'Fly', location: 'Route 119: Given by Rival May/Brendan after defeating them near the entrance to Fortree City' },
  { id: 'HM03', move: 'Surf', location: 'Petalburg City: Given by Wally’s father as a token of gratitude after defeating Gym Leader Norman' },
  { id: 'HM04', move: 'Strength', location: 'Rusturf Tunnel: Gifted by the couple in the middle of the tunnel after smashing the rocks separating them from one another' },
  { id: 'HM05', move: 'Flash', location: 'Granite Cave: Given by the hiker standing near the entrance of the cave' },
  { id: 'HM06', move: 'Rock Smash', location: 'Mauville City: Gifted by the Rock Smash Guy for visiting his home in the southeastern corner of the city' },
  { id: 'HM07', move: 'Waterfall', location: 'Pacifidlog Town: From the sailor hosting the Scuba Safari game upon scoring a high score, in the northeastern edge of the town' },
  { id: 'HM08', move: 'Dive', location: 'Mossdeep City: Received from Steven by visiting his house after stopping Team Magma from stealing Rocket Fuel from the Space Station' },
  { id: 'TM01', move: 'Focus Punch', requires: ['Surf'], location: 'Route 115: PokeBall in the northern end of the route, next to a rock west of the slippery slope' },
  { id: 'TM02', move: 'Dragon Claw', requires: ['Surf', 'Waterfall'], location: 'Meteor Falls: PokeBall in the backroom featuring a small pond in the northern end of the cave on B1F' },
  { id: 'TM03', move: 'Water Pulse', location: 'Sootopolis City: Purchase from the PokeMart in the western side of the city' },
  { id: 'TM04', move: 'Calm Mind', location: 'Mossdeep City: Reward for defeating Gym Leaders Liza & Tate' },
  { id: 'TM05', move: 'Roar', location: 'Route 114: Gifted by the man with a Poochyena, standing at the first turn near the start of the route' },
  { id: 'TM06', move: 'Toxic', requires: ['Strength'], location: 'Fiery Path: PokéBall in the northwestern corner of the cave, past the pushable boulders' },
  { id: 'TM07', move: 'Hail', location: 'Shoal Cave: PokéBall in the northern side of the ice room' },
  { id: 'TM08', move: 'Bulk Up', location: 'Mossdeep City: Reward for defeating Gym Leader Brawly' },
  { id: 'TM09', move: 'Bullet Seed', location: 'Route 104: Received from the man standing next to the exit of Petalburg Woods' },
  { id: 'TM10', move: 'Hidden Power', location: 'Fortree City: Received from the woman in the second house east from the PokéCenter for winning her guessing game (Right, Right, Left)' },
  { id: 'TM11', move: 'Sunny Day', requires: ['Devon Scope', 'Surf'], location: 'Route 120: PokeBall in the northern end of the Scorched Slab' },
  { id: 'TM12', move: 'Taunt', requires: ['Feather Badge'], location: 'Route 110: Reward for solving Trickmaster’s fifth puzzle in the Trick House' },
  { id: 'TM13', move: 'Ice Beam', location: 'Sootopolis City: Obtained by defeating Gym Leader Juan' },
  { id: 'TM14', move: 'Blizzard', location: 'Lilycove City: Purchase from 4F of the Lilycove Department Store' },
  { id: 'TM15', move: 'Hyper Beam', location: 'Lilycove City: Purchase from 4F of the Lilycove Department Store' },
  { id: 'TM16', move: 'Light Screen', location: 'Lilycove City: Purchase from 4F of the Lilycove Department Store' },
  { id: 'TM17', move: 'Protect', location: 'Lilycove City: Purchase from 4F of the Lilycove Department Store' },
  { id: 'TM18', move: 'Rain Dance', requires: ['Surf', 'Dive'], location: 'Route 105: PokeBall in Room 1 of the Abandoned Ship' },
  { id: 'TM19', move: 'Giga Drain', requires: ['Surf'], location: 'Route 123: Gifted by the woman in the northeastern corner of the route after showing her a Grass-type Pokemon' },
  { id: 'TM20', move: 'Safeguard', location: 'Lilycove City: Purchase from 4F of the Lilycove Department Store' },
  { id: 'TM21', move: 'Frustration', location: 'Pacifidlog Town: Obtained from the man in the southwesternmost house if your lead Pokémon’s friendship level is low' },
  { id: 'TM22', move: 'Solar Beam', requires: ['Surf'], location: 'Safari Zone: PokeBall in the northern area of the zone, east of the Area 4 Pond' },
  { id: 'TM23', move: 'Iron Tail', requires: ['Waterfall'], location: 'Meteor Falls: PokeBall in the northwestern corner of the main area, accessible from B1F' },
  { id: 'TM24', move: 'Thunderbolt', requires: ['Surf'], location: 'Mauville City: Gifted by Gym Leader Wattson for turning off the generator in Old Mauville' },
  { id: 'TM25', move: 'Thunder', location: 'Lilycove City: Purchase from 4F of the Lilycove Department Store' },
  { id: 'TM26', move: 'Earthquake', location: 'Seafloor Cavern: PokéBall in the northeastern corner of the final room' },
  { id: 'TM27', move: 'Return', location: 'Pacifidlog Town: Obtained from the man in the southwesternmost house if your lead Pokémon’s friendship level is high' },
  { id: 'TM28', move: 'Dig', requires: ['Surf', 'Dive'], location: 'Route 114: Gifted by the Fossil Maniac’s little brother, inside the Fossil Maniac’s home at the start of the route' },
  { id: 'TM29', move: 'Psychic (Flash recommended)', location: 'Victory Road: PokéBall on the upper platform in the northeastern corner of B1F, between the 3 rocks, accessible from the northeastern ladder of B2F' },
  { id: 'TM30', move: 'Shadow Ball', location: 'Mt. Pyre: PokéBall on the southern side of 6F' },
  { id: 'TM31', move: 'Brick Break', location: 'Sootopolis City: Gifted by the Black-Belt man with a Kecleon by visiting his home in the northwestern side of the city' },
  { id: 'TM32', move: 'Double Team (Hidden)', location: 'Route 113: In the soot pile down the ledge, west of the Glass Workshop' },
  { id: 'TM33', move: 'Reflect', location: 'Lilycove City: Purchase from 4F of the Lilycove Department Store' },
  { id: 'TM34', move: 'Shock Wave', location: 'Mauville City: Obtained by defeating Gym Leader Wattson' },
  { id: 'TM35', move: 'Flamethrower', requires: ['Coin Case'], location: 'Mauville City: Purchase from the Mauville Game Corner' },
  { id: 'TM36', move: 'Sludge Bomb', requires: ['Balance Badge'], location: 'Dewford Town: Gifted by the PokeManiac standing inside Dewford Hall' },
  { id: 'TM37', move: 'Sandstorm', requires: ['Go-Goggles'], location: 'Route 111: PokeBall in the small corridor in the southern end of the area, south from the Desert Ruins' },
  { id: 'TM38', move: 'Fire Blast', location: 'Lilycove City: Purchase from 4F of the Lilycove Department Store' },
  { id: 'TM39', move: 'Rock Tomb', location: 'Rustboro City: Obtained by defeating Gym Leader Roxanne' },
  { id: 'TM40', move: 'Aerial Ace', location: 'Fortree City: Obtained by defeating Gym Leader Winona' },
  { id: 'TM41', move: 'Torment', location: 'Slateport City: From the sailor standing next to the counter in the Battle Tent, in the northwestern corner of the city' },
  { id: 'TM42', move: 'Facade', location: 'Petalburg City: Obtained by defeating Gym Leader Winona' },
  { id: 'TM43', move: 'Secret Power', location: 'Route 111: Gifted by the man standing in front of the suspiciously large tree, up the stairs near the entrance of the route' },
  { id: 'TM44', move: 'Rest', location: 'Lilycove City: Gifted by the man in the blue house in the eastern end of the city' },
  { id: 'TM45', move: 'Attract', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM46', move: 'Thief', location: 'Slateport City: Given by the Team Aqua member standing in the center of the ground floor of the Oceanic Museum' },
  { id: 'TM47', move: 'Steel Wing', location: 'Granite Cave: Given by Steven for successfully delivering the letter to him' },
  { id: 'TM48', move: 'Skill Swap', location: 'Mt. Pyre: PokéBall on the plateau near the start of the exterior area, between the first and second set of stairs' },
  { id: 'TM49', move: 'Snatch', location: 'S.S Tidal: Gifted by the sick man staying in the northeasternmost room' },
  { id: 'TM50', move: 'Overheat', location: 'Lavaridge Town: Obtained by defeating Gym Leader Flanner' },
  { id: 'TM51', move: 'Poison Fang', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM52', move: 'Thunder Fang', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM53', move: 'Ice Fang', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM54', move: 'Fire Fang', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM55', move: 'Psychic Fangs', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM56', move: 'Stomping Tantrum', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM57', move: 'Dazzling Gleam', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM58', move: 'Play Rough', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM59', move: 'Volt Switch', location: 'Slateport City: Purchase from the PokeMart' },
  { id: 'TM60', move: 'U-Turn', location: 'Slateport City: Purchase from the PokeMart' },
]
