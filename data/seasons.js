// Weekly rotating seasons — determined by week number modulo length
export const SEASONS = [
  {
    id: "harvest_festival",
    name: "Harvest Festival",
    icon: "\u{1F33E}",
    description: "Bountiful harvests increase herb yields.",
    bonusResource: "herbs",
    bonusMultiplier: 1.5,
    exclusiveRecipes: ["healers_charm"],
    rewardTrack: [
      { xp: 50, reward: { type: "resources", value: { herbs: 50 } } },
      { xp: 150, reward: { type: "resources", value: { gold: 200 } } },
      { xp: 300, reward: { type: "resources", value: { herbs: 100, gold: 100 } } },
      { xp: 500, reward: { type: "resources", value: { gems: 5 } } },
      { xp: 800, reward: { type: "hero_xp", value: 100 } },
    ],
  },
  {
    id: "iron_age",
    name: "Iron Age",
    icon: "\u2692\uFE0F",
    description: "Furnaces burn hot — iron production surges.",
    bonusResource: "iron",
    bonusMultiplier: 1.5,
    exclusiveRecipes: ["iron_sword", "iron_shield"],
    rewardTrack: [
      { xp: 50, reward: { type: "resources", value: { iron: 40 } } },
      { xp: 150, reward: { type: "resources", value: { gold: 200 } } },
      { xp: 300, reward: { type: "resources", value: { iron: 80, stone: 50 } } },
      { xp: 500, reward: { type: "resources", value: { gems: 5 } } },
      { xp: 800, reward: { type: "hero_xp", value: 100 } },
    ],
  },
  {
    id: "golden_market",
    name: "Golden Market",
    icon: "\u{1FA99}",
    description: "Merchants flock to trade — gold flows freely.",
    bonusResource: "gold",
    bonusMultiplier: 1.5,
    exclusiveRecipes: ["scouts_ring", "mystic_amulet"],
    rewardTrack: [
      { xp: 50, reward: { type: "resources", value: { gold: 150 } } },
      { xp: 150, reward: { type: "resources", value: { gold: 300 } } },
      { xp: 300, reward: { type: "resources", value: { gold: 500, gems: 2 } } },
      { xp: 500, reward: { type: "resources", value: { gems: 8 } } },
      { xp: 800, reward: { type: "hero_xp", value: 100 } },
    ],
  },
  {
    id: "crystal_convergence",
    name: "Crystal Convergence",
    icon: "\u{1F48E}",
    description: "Gem veins surface — a rare chance to gather crystals.",
    bonusResource: "gems",
    bonusMultiplier: 2.0,
    exclusiveRecipes: ["mystic_amulet", "mithril_blade"],
    rewardTrack: [
      { xp: 50, reward: { type: "resources", value: { gems: 3 } } },
      { xp: 150, reward: { type: "resources", value: { gems: 5, gold: 100 } } },
      { xp: 300, reward: { type: "resources", value: { gems: 8 } } },
      { xp: 500, reward: { type: "resources", value: { gems: 12, gold: 200 } } },
      { xp: 800, reward: { type: "hero_xp", value: 150 } },
    ],
  },
];

// Epoch for week calculation (Monday, Jan 1 2024)
export const SEASON_EPOCH = new Date("2024-01-01T00:00:00").getTime();

export function getCurrentWeekNumber() {
  const now = Date.now();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((now - SEASON_EPOCH) / msPerWeek);
}

export function getCurrentSeason() {
  const week = getCurrentWeekNumber();
  return SEASONS[week % SEASONS.length];
}

export function getSeasonTimeRemaining() {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const elapsed = (Date.now() - SEASON_EPOCH) % msPerWeek;
  return msPerWeek - elapsed;
}
