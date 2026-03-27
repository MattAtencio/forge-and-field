const RARITIES = [
  { id: "common", label: "Common", color: "#9ca3af", weight: 58, multiplier: 1.0 },
  { id: "uncommon", label: "Uncommon", color: "#22c55e", weight: 25, multiplier: 1.3 },
  { id: "rare", label: "Rare", color: "#3b82f6", weight: 12, multiplier: 1.7 },
  { id: "epic", label: "Epic", color: "#a855f7", weight: 5, multiplier: 2.5 },
];

export function rollRarity() {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const rarity of RARITIES) {
    cumulative += rarity.weight;
    if (roll < cumulative) return rarity;
  }
  return RARITIES[0];
}

// Roll rarity with boosted weights for uncommon+ (creature loot)
export function rollRarityBoosted(boost) {
  const boosted = RARITIES.map((r, i) => ({
    ...r,
    weight: i === 0 ? Math.max(20, r.weight - boost * 2) : r.weight + boost,
  }));
  const total = boosted.reduce((s, r) => s + r.weight, 0);
  const roll = Math.random() * total;
  let cumulative = 0;
  for (const rarity of boosted) {
    cumulative += rarity.weight;
    if (roll < cumulative) return rarity;
  }
  return RARITIES[0];
}

export function getRarityById(id) {
  return RARITIES.find((r) => r.id === id) || RARITIES[0];
}

export function applyRarityMultiplier(baseStats, rarity) {
  const r = typeof rarity === "string" ? getRarityById(rarity) : rarity;
  const result = {};
  for (const [stat, value] of Object.entries(baseStats)) {
    result[stat] = Math.round(value * r.multiplier);
  }
  return result;
}

export function getRarityColor(rarityId) {
  return (getRarityById(rarityId) || RARITIES[0]).color;
}

export function getRarityLabel(rarityId) {
  return (getRarityById(rarityId) || RARITIES[0]).label;
}

// ── Item Level System ──
const LEVEL_MULTIPLIERS = { 1: 1.0, 2: 1.35, 3: 1.8 };

export function getLevelMultiplier(level) {
  return LEVEL_MULTIPLIERS[level] || 1.0;
}

export function applyLevelMultiplier(stats, level) {
  const mult = getLevelMultiplier(level);
  const result = {};
  for (const [stat, value] of Object.entries(stats)) {
    result[stat] = Math.round(value * mult);
  }
  return result;
}

export function getUpgradeCost(item) {
  const nextLevel = (item.level || 1) + 1;
  if (nextLevel > 3) return null;
  const tierMult = item.tier || 1;
  const rarityObj = getRarityById(item.rarity);
  return {
    gold: Math.round(tierMult * 50 * nextLevel * rarityObj.multiplier),
    iron: Math.round(tierMult * 10 * nextLevel),
    gems: nextLevel >= 3 ? Math.round(tierMult * 2) : 0,
  };
}

export function rollItemLevel(expeditionUnlockLevel) {
  // Higher level expeditions have better chance of Lv 2/3 drops
  const roll = Math.random() * 100;
  if (expeditionUnlockLevel >= 10 && roll < 5) return 3;
  if (expeditionUnlockLevel >= 7 && roll < 15) return 2;
  if (expeditionUnlockLevel >= 4 && roll < 25) return 2;
  return 1;
}

const CHEST_LEVEL_WEIGHTS = {
  uncommon: [70, 25, 5],   // Green chest: base weights
  rare:     [55, 35, 10],  // Blue chest: shifted toward better levels
  epic:     [40, 40, 20],  // Purple chest: best level distribution
};

export function rollItemLevelForChest(chestTier) {
  const weights = CHEST_LEVEL_WEIGHTS[chestTier] || CHEST_LEVEL_WEIGHTS.uncommon;
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (roll < cumulative) return i + 1;
  }
  return 1;
}

// ── Durability System ──
const BASE_DURABILITY = { 1: 30, 2: 50, 3: 80 };
const RARITY_DURABILITY_MULT = { common: 1.0, uncommon: 1.2, rare: 1.5, epic: 2.0 };

export function getMaxDurability(tier, rarity) {
  const base = BASE_DURABILITY[tier] || 30;
  const mult = RARITY_DURABILITY_MULT[rarity] || 1.0;
  return Math.round(base * mult);
}

export function getRepairCost(item) {
  const missing = (item.durability?.max || 30) - (item.durability?.current || 0);
  if (missing <= 0) return null;
  const tierMult = item.tier || 1;
  return {
    gold: Math.round(missing * tierMult * 0.5),
    iron: Math.round(missing * 0.3),
  };
}

export function getDismantleReturns(item) {
  const tierMult = item.tier || 1;
  const rarityObj = getRarityById(item.rarity);
  const durabilityRatio = (item.durability?.current || 0) / (item.durability?.max || 1);
  const baseMult = 0.2 + durabilityRatio * 0.3; // 20-50% return based on durability
  return {
    iron: Math.round(tierMult * 8 * rarityObj.multiplier * baseMult),
    stone: Math.round(tierMult * 5 * baseMult),
    gold: Math.round(tierMult * 15 * rarityObj.multiplier * baseMult),
  };
}

export function getExpeditionDurabilityCost(expedition) {
  // Higher level expeditions cost more durability
  const base = 5;
  const levelScale = (expedition.unlockLevel || 1) * 0.8;
  return Math.round(base + levelScale);
}

export function getSellValue(recipe, rarity, level) {
  const r = typeof rarity === "string" ? getRarityById(rarity) : rarity;
  const lvMult = getLevelMultiplier(level || 1);
  // Base sell = 40% of gold ingredient cost + tier bonus
  const goldCost = recipe.ingredients.gold || 0;
  const tierBonus = recipe.tier * 10;
  return Math.round((goldCost * 0.4 + tierBonus) * r.multiplier * lvMult);
}
