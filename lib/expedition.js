import { EXPEDITIONS } from "@/data/expeditions";
import { getHeroPower } from "./hero";
import { rollRarity, applyRarityMultiplier } from "./rarity";
import { RECIPES } from "@/data/recipes";
import { generateEnemyParty, resolveCombat, getCombatRewardMultiplier } from "./combat";
import { getExpeditionDurationMultiplier } from "./skills";

export function getExpeditionById(id) {
  return EXPEDITIONS.find((e) => e.id === id);
}

export function getAvailableExpeditions(playerLevel) {
  return EXPEDITIONS.filter((e) => e.unlockLevel <= playerLevel);
}

export function getRegionExpeditions(regionId, playerLevel) {
  return EXPEDITIONS.filter(
    (e) => e.regionId === regionId && e.unlockLevel <= playerLevel
  );
}

export function canSendExpedition(expedition, selectedHeroes, allHeroes, inventory) {
  if (selectedHeroes.length < 1 || selectedHeroes.length > expedition.heroSlots) {
    return false;
  }

  // Check all selected heroes are idle
  for (const heroId of selectedHeroes) {
    const hero = allHeroes.find((h) => h.id === heroId);
    if (!hero || hero.status !== "idle") return false;
  }

  // Check combined power
  const totalPower = selectedHeroes.reduce((sum, heroId) => {
    const hero = allHeroes.find((h) => h.id === heroId);
    return sum + (hero ? getHeroPower(hero, inventory) : 0);
  }, 0);

  return totalPower >= expedition.requiredPower;
}

export function getEffectiveExpeditionDuration(expedition, heroIds, allHeroes) {
  const heroes = heroIds
    .map((id) => allHeroes.find((h) => h.id === id))
    .filter(Boolean);
  const mult = getExpeditionDurationMultiplier(heroes);
  return Math.round(expedition.duration * mult);
}

export function generateRewards(expedition, heroIds, allHeroes, inventory) {
  const totalPower = heroIds.reduce((sum, heroId) => {
    const hero = allHeroes.find((h) => h.id === heroId);
    return sum + (hero ? getHeroPower(hero, inventory) : 0);
  }, 0);

  // Power ratio affects reward quantity (1.0 = minimum, up to 1.5x at double power)
  const powerRatio = Math.min(totalPower / expedition.requiredPower, 2);
  let rewardMult = 0.5 + powerRatio * 0.5;

  // Combat resolution
  let combatResult = null;
  if (expedition.hasCombat) {
    const enemies = generateEnemyParty(
      expedition.id,
      expedition.enemyScaleFactor || 1
    );
    if (enemies && enemies.length > 0) {
      const heroes = heroIds
        .map((id) => allHeroes.find((h) => h.id === id))
        .filter(Boolean);
      combatResult = resolveCombat(heroes, enemies, inventory);
      rewardMult *= getCombatRewardMultiplier(combatResult);
    }
  }

  const resources = {};
  for (const [resource, [min, max]] of Object.entries(expedition.rewards.resources)) {
    const base = min + Math.random() * (max - min);
    resources[resource] = Math.round(base * rewardMult);
  }

  // Item drop chance
  const items = [];
  if (Math.random() < expedition.rewards.itemChance * rewardMult) {
    const eligible = RECIPES.filter((r) => r.unlockLevel <= expedition.unlockLevel);
    if (eligible.length > 0) {
      const recipe = eligible[Math.floor(Math.random() * eligible.length)];
      const rarity = rollRarity();
      items.push({
        id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        recipeId: recipe.id,
        name: recipe.name,
        icon: recipe.icon,
        slot: recipe.slot,
        tier: recipe.tier,
        rarity: rarity.id,
        stats: applyRarityMultiplier(recipe.baseStats, rarity),
        equippedBy: null,
      });
    }
  }

  return { resources, items, combatResult };
}
