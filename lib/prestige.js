import { PRESTIGE_MIN_LEVEL, PRESTIGE_BONUSES } from "@/data/prestige";
import { getHeroPower } from "./hero";

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

export function canBuyBonus(prestige, bonusId) {
  const bonus = PRESTIGE_BONUSES.find((b) => b.id === bonusId);
  if (!bonus) return false;
  const currentStacks = prestige?.bonuses?.[bonusId] || 0;
  if (currentStacks >= bonus.maxStacks) return false;
  return (prestige?.availableStars || 0) >= bonus.cost;
}
