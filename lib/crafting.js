import { RECIPES } from "@/data/recipes";
import { rollRarity, applyRarityMultiplier, getMaxDurability, getRarityById, getNextRarity } from "./rarity";
import { getPrestigeMultiplier } from "./prestige";

export const CRIT_CRAFT_CHANCE = 0.10;

export function getRecipeById(recipeId) {
  return RECIPES.find((r) => r.id === recipeId);
}

export function canCraft(recipe, resources) {
  for (const [resource, cost] of Object.entries(recipe.ingredients)) {
    if ((resources[resource] || 0) < cost) return false;
  }
  return true;
}

export function getAvailableRecipes(playerLevel) {
  return RECIPES.filter((r) => r.unlockLevel <= playerLevel);
}

export function generateItem(recipe) {
  // Consumables don't have rarity, stats, or durability
  if (recipe.slot === "consumable") {
    return {
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      recipeId: recipe.id,
      name: recipe.name,
      icon: recipe.icon,
      slot: "consumable",
      tier: recipe.tier,
      effect: recipe.effect,
      maxStack: recipe.maxStack,
      description: recipe.description,
      count: 1,
    };
  }

  const rarity = rollRarity();
  const stats = applyRarityMultiplier(recipe.baseStats, rarity);

  const maxDur = getMaxDurability(recipe.tier, rarity.id);
  return {
    id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    recipeId: recipe.id,
    name: recipe.name,
    icon: recipe.icon,
    slot: recipe.slot,
    tier: recipe.tier,
    rarity: rarity.id,
    level: 1,
    durability: { current: maxDur, max: maxDur },
    stats,
    equippedBy: null,
  };
}

export function applyCritCraft(item, prestige) {
  const nextRarity = getNextRarity(item.rarity);
  if (!nextRarity) return item; // Epic can't crit further

  // Base 10% + prestige "Lucky Crafter" rarity_bonus stacks (+5% each)
  const rarityBonus = getPrestigeMultiplier(prestige, "rarity_bonus") - 1;
  const critChance = CRIT_CRAFT_CHANCE + rarityBonus;

  if (Math.random() >= critChance) return item;

  // Bump rarity: recalculate stats and durability
  const oldRarity = getRarityById(item.rarity);
  const newStats = {};
  for (const [stat, value] of Object.entries(item.stats)) {
    const baseValue = Math.round(value / oldRarity.multiplier);
    newStats[stat] = Math.round(baseValue * nextRarity.multiplier);
  }

  const maxDur = getMaxDurability(item.tier, nextRarity.id);

  return {
    ...item,
    rarity: nextRarity.id,
    stats: newStats,
    durability: { current: maxDur, max: maxDur },
    critCraft: true,
  };
}

export function getCraftRefund(recipe) {
  const refund = {};
  for (const [resource, cost] of Object.entries(recipe.ingredients)) {
    refund[resource] = Math.floor(cost * 0.5);
  }
  return refund;
}
