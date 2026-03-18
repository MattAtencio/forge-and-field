import { RECIPES } from "@/data/recipes";
import { rollRarity, applyRarityMultiplier, getMaxDurability } from "./rarity";

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

export function getCraftRefund(recipe) {
  const refund = {};
  for (const [resource, cost] of Object.entries(recipe.ingredients)) {
    refund[resource] = Math.floor(cost * 0.5);
  }
  return refund;
}
