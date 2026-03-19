// Cumulative XP required to reach each level (index = level - 1)
export const XP_TABLE = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  500, // Level 4
  800, // Level 5
  1200, // Level 6
  1700, // Level 7
  2400, // Level 8
  3200, // Level 9
  4200, // Level 10
  5500, // Level 11
  7000, // Level 12
  7500, // Level 13
  9500, // Level 14
  12000, // Level 15
  18000, // Level 16
  22000, // Level 17
  27000, // Level 18
  33000, // Level 19
  40000, // Level 20
];

export const LEVEL_UNLOCKS = {
  1: { screens: ["hub", "forge"], features: ["basic_crafting"] },
  3: { screens: ["barracks"], features: ["hero_equipment"] },
  5: { screens: ["expedition"], features: ["hero_2"] },
  7: { screens: ["season"], features: ["season_rewards"] },
  8: { screens: ["village"], features: ["village_buildings"] },
  10: { features: ["hero_3", "tier3_recipes"] },
  12: { features: ["hero_4"] },
  15: { features: ["gem_generation"] },
};

export function getHeroLevelCost(level) {
  return 40 + level * 30;
}

export function getPlayerLevel(xp) {
  for (let i = XP_TABLE.length - 1; i >= 0; i--) {
    if (xp >= XP_TABLE[i]) return i + 1;
  }
  return 1;
}

export function getUnlocksForLevel(level) {
  const unlocks = { screens: [], features: [] };
  for (let l = 1; l <= level; l++) {
    const lu = LEVEL_UNLOCKS[l];
    if (lu) {
      if (lu.screens) unlocks.screens.push(...lu.screens);
      if (lu.features) unlocks.features.push(...lu.features);
    }
  }
  return unlocks;
}
