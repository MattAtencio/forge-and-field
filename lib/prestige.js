import { PRESTIGE_MIN_LEVEL, PRESTIGE_BONUSES } from "@/data/prestige";
import { RECIPES } from "@/data/recipes";
import { getHeroPower } from "./hero";
import { getRarityById, applyRarityMultiplier, getMaxDurability } from "./rarity";

export function canPrestige(state) {
  return state.player.level >= PRESTIGE_MIN_LEVEL;
}

export function calculatePrestigeStars(state) {
  const levelStars = (state.player.level - 14) * 2;
  const totalPower = state.heroes.reduce((sum, h) => {
    return sum + getHeroPower(h, state.inventory);
  }, 0);
  const powerStars = Math.floor(totalPower / 50);
  return Math.max(0, Math.floor(levelStars + powerStars));
}

export function getPrestigeMultiplier(prestige, effectType) {
  if (!prestige?.bonuses) return 1;
  let mult = 1;
  for (const bonus of PRESTIGE_BONUSES) {
    if (bonus.effect.type !== effectType) continue;
    const stacks = prestige.bonuses[bonus.id] || 0;
    if (stacks > 0) {
      mult += bonus.effect.value * stacks;
    }
  }
  return mult;
}

export function getPrestigeStartingGold(prestige) {
  if (!prestige?.bonuses) return 100;
  const stacks = prestige.bonuses.patrons_gift || 0;
  return 100 + stacks * 100;
}

export function getPrestigeStartingLevel(prestige) {
  if (!prestige?.bonuses) return 1;
  if (prestige.bonuses.masters_start) return 5;
  if (prestige.bonuses.veterans_start) return 3;
  return 1;
}

export function shouldUnlockAllHeroes(prestige) {
  return prestige?.bonuses?.masters_start > 0;
}

export function getPrestigeStartingItems(prestige) {
  if (!prestige?.bonuses?.forgemasters_memory) return [];

  const t1Recipes = RECIPES.filter((r) => r.tier === 1);
  const bySlot = { weapon: [], armor: [], accessory: [] };
  for (const r of t1Recipes) {
    if (bySlot[r.slot]) bySlot[r.slot].push(r);
  }

  const items = [];
  const rarity = getRarityById("common");
  for (const slot of ["weapon", "armor", "accessory"]) {
    const pool = bySlot[slot];
    if (pool.length === 0) continue;
    const recipe = pool[Math.floor(Math.random() * pool.length)];
    const stats = applyRarityMultiplier(recipe.baseStats, rarity);
    const maxDur = getMaxDurability(recipe.tier, rarity.id);
    items.push({
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
    });
  }

  return items;
}

export function canBuyBonus(prestige, bonusId) {
  const bonus = PRESTIGE_BONUSES.find((b) => b.id === bonusId);
  if (!bonus) return false;
  const currentStacks = prestige?.bonuses?.[bonusId] || 0;
  if (currentStacks >= bonus.maxStacks) return false;
  return (prestige?.availableStars || 0) >= bonus.cost;
}
