export const TITLES = [
  // Expedition milestones
  {
    id: "first_blood",
    name: "Blooded",
    description: "Complete your first expedition",
    bonus: { type: "expedition_gold", value: 0.05, label: "+5% expedition gold" },
    condition: { stat: "totalExpeditions", threshold: 1 },
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Complete 25 expeditions",
    bonus: { type: "expedition_gold", value: 0.10, label: "+10% expedition gold" },
    condition: { stat: "totalExpeditions", threshold: 25 },
  },
  {
    id: "warlord",
    name: "Warlord",
    description: "Complete 100 expeditions",
    bonus: { type: "endurance_drain", value: -0.10, label: "-10% endurance drain" },
    condition: { stat: "totalExpeditions", threshold: 100 },
  },

  // Crafting milestones
  {
    id: "apprentice",
    name: "Apprentice Smith",
    description: "Craft 10 items",
    bonus: { type: "craft_speed", value: 0.05, label: "+5% craft speed" },
    condition: { stat: "totalItemsCrafted", threshold: 10 },
  },
  {
    id: "master_smith",
    name: "Master Smith",
    description: "Craft 50 items",
    bonus: { type: "craft_speed", value: 0.10, label: "+10% craft speed" },
    condition: { stat: "totalItemsCrafted", threshold: 50 },
  },

  // Boss milestones
  {
    id: "boss_slayer",
    name: "Boss Slayer",
    description: "Defeat your first region boss",
    bonus: { type: "durability_save", value: 1, label: "+1 durability saved per expedition" },
    condition: { stat: "bossesDefeated", threshold: 1 },
  },
  {
    id: "dragonslayer",
    name: "Dragonslayer",
    description: "Defeat 4 region bosses",
    bonus: { type: "durability_save", value: 3, label: "+3 durability saved per expedition" },
    condition: { stat: "bossesDefeated", threshold: 4 },
  },

  // Level milestones
  {
    id: "seasoned",
    name: "Seasoned",
    description: "Reach hero level 10",
    bonus: { type: "rest_speed", value: -0.15, label: "-15% rest time" },
    condition: { stat: "highestHeroLevel", threshold: 10 },
  },
  {
    id: "legendary",
    name: "Legendary",
    description: "Reach hero level 20",
    bonus: { type: "rest_speed", value: -0.25, label: "-25% rest time" },
    condition: { stat: "highestHeroLevel", threshold: 20 },
  },

  // Discovery milestones
  {
    id: "explorer",
    name: "Explorer",
    description: "Discover 5 points of interest",
    bonus: { type: "discovery_chance", value: 0.10, label: "+10% discovery chance" },
    condition: { stat: "totalDiscoveries", threshold: 5 },
  },

  // Prestige milestones
  {
    id: "reborn",
    name: "Reborn",
    description: "Complete your first prestige rebirth",
    bonus: { type: "xp_bonus", value: 0.05, label: "+5% player XP" },
    condition: { stat: "prestigeTier", threshold: 1 },
  },
];

export function getUnlockedTitles(stats, worldMap, prestige) {
  const statMap = {
    totalExpeditions: stats.totalExpeditions || 0,
    totalItemsCrafted: stats.totalItemsCrafted || 0,
    highestHeroLevel: stats.highestHeroLevel || 1,
    bossesDefeated: Object.keys(worldMap?.bossesDefeated || {}).length,
    totalDiscoveries: Object.keys(worldMap?.discoveries || {}).length,
    prestigeTier: prestige?.tier || 0,
  };

  return TITLES.filter((title) => {
    const value = statMap[title.condition.stat] || 0;
    return value >= title.condition.threshold;
  });
}

export function getTitleById(id) {
  return TITLES.find((t) => t.id === id) || null;
}
