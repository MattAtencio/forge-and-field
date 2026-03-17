const RARITIES = [
  { id: "common", label: "Common", color: "#9ca3af", weight: 60, multiplier: 1.0 },
  { id: "uncommon", label: "Uncommon", color: "#22c55e", weight: 25, multiplier: 1.3 },
  { id: "rare", label: "Rare", color: "#3b82f6", weight: 12, multiplier: 1.7 },
  { id: "epic", label: "Epic", color: "#a855f7", weight: 3, multiplier: 2.5 },
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

export function getSellValue(recipe, rarity) {
  const r = typeof rarity === "string" ? getRarityById(rarity) : rarity;
  // Base sell = 40% of gold ingredient cost + tier bonus
  const goldCost = recipe.ingredients.gold || 0;
  const tierBonus = recipe.tier * 10;
  return Math.round((goldCost * 0.4 + tierBonus) * r.multiplier);
}
