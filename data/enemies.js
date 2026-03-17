export const ENEMY_TEMPLATES = [
  // Greenwood
  { id: "goblin", name: "Goblin", icon: "\u{1F47A}", baseStats: { hp: 20, atk: 6, def: 3, spd: 7 } },
  { id: "wolf", name: "Dire Wolf", icon: "\u{1F43A}", baseStats: { hp: 30, atk: 8, def: 4, spd: 9 } },
  { id: "treant", name: "Treant", icon: "\u{1F333}", baseStats: { hp: 50, atk: 6, def: 12, spd: 2 } },
  // Stormridge
  { id: "rock_golem", name: "Rock Golem", icon: "\u{1FAA8}", baseStats: { hp: 60, atk: 10, def: 15, spd: 2 } },
  { id: "harpy", name: "Harpy", icon: "\u{1F985}", baseStats: { hp: 25, atk: 12, def: 4, spd: 11 } },
  // Dusthaven
  { id: "bandit", name: "Bandit", icon: "\u{1F977}", baseStats: { hp: 35, atk: 10, def: 6, spd: 8 } },
  { id: "bandit_leader", name: "Bandit Leader", icon: "\u{1F3F4}\u200D\u2620\uFE0F", baseStats: { hp: 55, atk: 14, def: 8, spd: 6 } },
  { id: "sandworm", name: "Sandworm", icon: "\u{1FAB1}", baseStats: { hp: 70, atk: 16, def: 10, spd: 3 } },
  // Frostpeak
  { id: "ice_wraith", name: "Ice Wraith", icon: "\u{1F47B}", baseStats: { hp: 30, atk: 14, def: 5, spd: 10 } },
  { id: "frost_bear", name: "Frost Bear", icon: "\u{1F43B}\u200D\u2744\uFE0F", baseStats: { hp: 60, atk: 16, def: 12, spd: 4 } },
  // Dragon's Reach
  { id: "fire_imp", name: "Fire Imp", icon: "\u{1F525}", baseStats: { hp: 25, atk: 18, def: 4, spd: 12 } },
  { id: "drake", name: "Drake", icon: "\u{1F432}", baseStats: { hp: 80, atk: 20, def: 14, spd: 5 } },
  // Bosses
  { id: "treant_elder", name: "Treant Elder", icon: "\u{1F332}", baseStats: { hp: 80, atk: 10, def: 16, spd: 3 }, isBoss: true },
  { id: "stone_golem", name: "Stone Golem", icon: "\u{1F5FF}", baseStats: { hp: 100, atk: 14, def: 20, spd: 2 }, isBoss: true },
  { id: "sandworm_queen", name: "Sandworm Queen", icon: "\u{1F40D}", baseStats: { hp: 120, atk: 18, def: 12, spd: 4 }, isBoss: true },
  { id: "frost_dragon", name: "Frost Dragon", icon: "\u2744\uFE0F", baseStats: { hp: 140, atk: 22, def: 16, spd: 6 }, isBoss: true },
  { id: "elder_dragon", name: "Elder Dragon", icon: "\u{1F409}", baseStats: { hp: 200, atk: 28, def: 20, spd: 5 }, isBoss: true },
];

export const ENCOUNTER_TABLE = {
  forest_trail: [
    { enemies: ["goblin"], chance: 0.4 },
    { enemies: ["wolf"], chance: 0.2 },
  ],
  herb_garden: [
    { enemies: ["goblin", "goblin"], chance: 0.3 },
    { enemies: ["treant"], chance: 0.15 },
  ],
  dark_forest: [
    { enemies: ["wolf", "wolf"], chance: 0.5 },
    { enemies: ["treant"], chance: 0.3 },
  ],
  stone_quarry: [
    { enemies: ["rock_golem"], chance: 0.3 },
    { enemies: ["harpy"], chance: 0.25 },
  ],
  iron_mines: [
    { enemies: ["rock_golem", "harpy"], chance: 0.5 },
  ],
  bandit_camp: [
    { enemies: ["bandit", "bandit"], chance: 0.6 },
    { enemies: ["bandit_leader"], chance: 0.3 },
  ],
  scorched_trail: [
    { enemies: ["bandit", "bandit_leader"], chance: 0.5 },
    { enemies: ["sandworm"], chance: 0.25 },
  ],
  oasis_ruins: [
    { enemies: ["sandworm"], chance: 0.5 },
    { enemies: ["bandit_leader", "bandit"], chance: 0.3 },
  ],
  frozen_pass: [
    { enemies: ["ice_wraith", "ice_wraith"], chance: 0.5 },
    { enemies: ["frost_bear"], chance: 0.3 },
  ],
  glacier_cave: [
    { enemies: ["frost_bear", "ice_wraith"], chance: 0.5 },
  ],
  crystal_spire: [
    { enemies: ["ice_wraith", "frost_bear"], chance: 0.5 },
    { enemies: ["frost_bear", "frost_bear"], chance: 0.2 },
  ],
  dragons_peak: [
    { enemies: ["fire_imp", "fire_imp"], chance: 0.5 },
    { enemies: ["drake"], chance: 0.4 },
  ],
  ancient_ruins: [
    { enemies: ["drake", "fire_imp"], chance: 0.6 },
  ],
  volcanic_forge: [
    { enemies: ["drake", "fire_imp", "fire_imp"], chance: 0.5 },
  ],
  // Boss encounters — guaranteed combat
  greenwood_boss: [{ enemies: ["treant_elder"], chance: 1.0 }],
  stormridge_boss: [{ enemies: ["stone_golem"], chance: 1.0 }],
  dusthaven_boss: [{ enemies: ["sandworm_queen"], chance: 1.0 }],
  frostpeak_boss: [{ enemies: ["frost_dragon"], chance: 1.0 }],
  dragons_reach_boss: [{ enemies: ["elder_dragon"], chance: 1.0 }],
};

export function getEnemyTemplate(id) {
  return ENEMY_TEMPLATES.find((e) => e.id === id);
}
