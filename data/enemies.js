// Balance multipliers (from March 2026 balance review)
// Regular enemies: 2x HP, 1.3x ATK to make combat dangerous
// Bosses: 2.5x HP, 1.3x ATK to survive 8-12 turns instead of 4-6
const ENEMY_HP_MULT = 2.0;
const ENEMY_ATK_MULT = 1.3;
const BOSS_HP_MULT = 2.5;
const BOSS_ATK_MULT = 1.3;

function scaleEnemy(base, isBoss = false) {
  const hpMult = isBoss ? BOSS_HP_MULT : ENEMY_HP_MULT;
  const atkMult = isBoss ? BOSS_ATK_MULT : ENEMY_ATK_MULT;
  return {
    hp: Math.round(base.hp * hpMult),
    atk: Math.round(base.atk * atkMult),
    def: base.def,
    spd: base.spd,
  };
}

export const ENEMY_TEMPLATES = [
  // Greenwood
  { id: "goblin", name: "Goblin", icon: "goblin", baseStats: scaleEnemy({ hp: 20, atk: 6, def: 3, spd: 7 }) },
  { id: "wolf", name: "Dire Wolf", icon: "wolf", baseStats: scaleEnemy({ hp: 30, atk: 8, def: 4, spd: 9 }) },
  { id: "treant", name: "Treant", icon: "treant", baseStats: scaleEnemy({ hp: 50, atk: 6, def: 12, spd: 2 }) },
  // Stormridge
  { id: "rock_golem", name: "Rock Golem", icon: "rock_golem", baseStats: scaleEnemy({ hp: 60, atk: 10, def: 15, spd: 2 }) },
  { id: "harpy", name: "Harpy", icon: "harpy", baseStats: scaleEnemy({ hp: 25, atk: 12, def: 4, spd: 11 }) },
  // Dusthaven
  { id: "bandit", name: "Bandit", icon: "bandit", baseStats: scaleEnemy({ hp: 35, atk: 10, def: 6, spd: 8 }) },
  { id: "bandit_leader", name: "Bandit Leader", icon: "bandit_leader", baseStats: scaleEnemy({ hp: 55, atk: 14, def: 8, spd: 6 }) },
  { id: "sandworm", name: "Sandworm", icon: "sandworm", baseStats: scaleEnemy({ hp: 70, atk: 16, def: 10, spd: 3 }) },
  // Frostpeak
  { id: "ice_wraith", name: "Ice Wraith", icon: "ice_wraith", baseStats: scaleEnemy({ hp: 30, atk: 14, def: 5, spd: 10 }) },
  { id: "frost_bear", name: "Frost Bear", icon: "frost_bear", baseStats: scaleEnemy({ hp: 60, atk: 16, def: 12, spd: 4 }) },
  // Dragon's Reach
  { id: "fire_imp", name: "Fire Imp", icon: "fire_imp", baseStats: scaleEnemy({ hp: 25, atk: 18, def: 4, spd: 12 }) },
  { id: "drake", name: "Drake", icon: "drake", baseStats: scaleEnemy({ hp: 80, atk: 20, def: 14, spd: 5 }) },
  // Bosses — 2.5x HP, 1.3x ATK for meaningful multi-turn fights
  { id: "treant_elder", name: "Treant Elder", icon: "treant_elder", baseStats: scaleEnemy({ hp: 160, atk: 13, def: 16, spd: 3 }, true), isBoss: true },
  { id: "stone_golem", name: "Stone Golem", icon: "stone_golem", baseStats: scaleEnemy({ hp: 200, atk: 18, def: 20, spd: 2 }, true), isBoss: true },
  { id: "sandworm_queen", name: "Sandworm Queen", icon: "sandworm_queen", baseStats: scaleEnemy({ hp: 240, atk: 23, def: 12, spd: 4 }, true), isBoss: true },
  { id: "frost_dragon", name: "Frost Dragon", icon: "frost_dragon", baseStats: scaleEnemy({ hp: 300, atk: 28, def: 16, spd: 6 }, true), isBoss: true },
  { id: "elder_dragon", name: "Elder Dragon", icon: "elder_dragon", baseStats: scaleEnemy({ hp: 500, atk: 36, def: 20, spd: 5 }, true), isBoss: true },
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

// Creature loot tables — each defeated enemy has a chance to drop resources/items
// dropChance: probability of any drop (0.0 - 1.0)
// resources: guaranteed resource drops on successful roll (min-max)
// itemChance: chance of item drop in addition to resources (boss = always)
// rarityBoost: added to rarity weights for uncommon+ rolls
export const CREATURE_LOOT = {
  // Greenwood
  goblin:        { dropChance: 0.25, resources: { gold: [2, 8] }, itemChance: 0.05, rarityBoost: 0 },
  wolf:          { dropChance: 0.20, resources: { herbs: [3, 8] }, itemChance: 0.05, rarityBoost: 0 },
  treant:        { dropChance: 0.30, resources: { wood: [8, 20] }, itemChance: 0.08, rarityBoost: 0 },
  // Stormridge
  rock_golem:    { dropChance: 0.30, resources: { stone: [10, 25], iron: [3, 8] }, itemChance: 0.08, rarityBoost: 5 },
  harpy:         { dropChance: 0.25, resources: { gold: [5, 15] }, itemChance: 0.06, rarityBoost: 5 },
  // Dusthaven
  bandit:        { dropChance: 0.35, resources: { gold: [8, 20] }, itemChance: 0.08, rarityBoost: 5 },
  bandit_leader: { dropChance: 0.45, resources: { gold: [15, 35] }, itemChance: 0.12, rarityBoost: 10 },
  sandworm:      { dropChance: 0.30, resources: { stone: [10, 20], gems: [1, 3] }, itemChance: 0.10, rarityBoost: 10 },
  // Frostpeak
  ice_wraith:    { dropChance: 0.30, resources: { gems: [1, 4], herbs: [5, 12] }, itemChance: 0.10, rarityBoost: 10 },
  frost_bear:    { dropChance: 0.35, resources: { iron: [8, 18] }, itemChance: 0.12, rarityBoost: 10 },
  // Dragon's Reach
  fire_imp:      { dropChance: 0.35, resources: { gems: [2, 5], gold: [10, 25] }, itemChance: 0.12, rarityBoost: 15 },
  drake:         { dropChance: 0.40, resources: { iron: [10, 25], gems: [2, 6] }, itemChance: 0.15, rarityBoost: 15 },
  // Bosses — always drop, guaranteed item with rarity boost
  treant_elder:   { dropChance: 1.0, resources: { wood: [30, 60], herbs: [15, 30] }, itemChance: 1.0, rarityBoost: 25 },
  stone_golem:    { dropChance: 1.0, resources: { stone: [40, 80], iron: [20, 40] }, itemChance: 1.0, rarityBoost: 30 },
  sandworm_queen: { dropChance: 1.0, resources: { gold: [50, 100], gems: [5, 12] }, itemChance: 1.0, rarityBoost: 35 },
  frost_dragon:   { dropChance: 1.0, resources: { gems: [8, 16], iron: [30, 60] }, itemChance: 1.0, rarityBoost: 40 },
  elder_dragon:   { dropChance: 1.0, resources: { gems: [12, 24], gold: [80, 150] }, itemChance: 1.0, rarityBoost: 50 },
};
