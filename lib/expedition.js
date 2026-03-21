import { EXPEDITIONS } from "@/data/expeditions";
import { CREATURE_LOOT } from "@/data/enemies";
import { getHeroPower } from "./hero";
import { rollRarity, rollRarityBoosted, applyRarityMultiplier, applyLevelMultiplier, rollItemLevel, getMaxDurability } from "./rarity";
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

  // Check all selected heroes are idle and have enough endurance
  const enduranceCost = getExpeditionEnduranceCost(expedition);
  for (const heroId of selectedHeroes) {
    const hero = allHeroes.find((h) => h.id === heroId);
    if (!hero || hero.status !== "idle") return false;
    // Need at least minimum endurance to go on expedition
    if (hero.endurance && hero.endurance.current < Math.min(enduranceCost, 10)) return false;
  }

  // Check combined power
  const totalPower = selectedHeroes.reduce((sum, heroId) => {
    const hero = allHeroes.find((h) => h.id === heroId);
    return sum + (hero ? getHeroPower(hero, inventory) : 0);
  }, 0);

  return totalPower >= expedition.requiredPower;
}

function getExpeditionEnduranceCost(expedition) {
  const base = 15;
  const levelScale = (expedition.unlockLevel || 1) * 2;
  return Math.round(base + levelScale);
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

  // Item drop chance — no items on draw or defeat
  const items = [];
  const canDropItems = !combatResult || combatResult.victory;
  if (canDropItems && Math.random() < expedition.rewards.itemChance * rewardMult) {
    const eligible = RECIPES.filter((r) => r.unlockLevel <= expedition.unlockLevel);
    if (eligible.length > 0) {
      const recipe = eligible[Math.floor(Math.random() * eligible.length)];
      const rarity = rollRarity();
      const level = rollItemLevel(expedition.unlockLevel);
      const baseStats = applyRarityMultiplier(recipe.baseStats, rarity);
      const stats = level > 1 ? applyLevelMultiplier(baseStats, level) : baseStats;
      const maxDur = getMaxDurability(recipe.tier, rarity.id);
      items.push({
        id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        recipeId: recipe.id,
        name: recipe.name,
        icon: recipe.icon,
        slot: recipe.slot,
        tier: recipe.tier,
        rarity: rarity.id,
        level,
        durability: { current: maxDur, max: maxDur },
        stats,
        equippedBy: null,
      });
    }
  }

  // Creature loot drops — each defeated enemy can drop resources and items
  const creatureLoot = [];
  if (combatResult && combatResult.victory && combatResult.enemies) {
    const eligible = RECIPES.filter((r) => r.unlockLevel <= expedition.unlockLevel);
    for (const enemy of combatResult.enemies) {
      const loot = CREATURE_LOOT[enemy.templateId];
      if (!loot || Math.random() >= loot.dropChance) continue;

      // Resource drops from creature
      const lootResources = {};
      for (const [res, [min, max]] of Object.entries(loot.resources)) {
        lootResources[res] = Math.round(min + Math.random() * (max - min));
        resources[res] = (resources[res] || 0) + lootResources[res];
      }

      // Item drop from creature
      if (eligible.length > 0 && Math.random() < loot.itemChance) {
        const recipe = eligible[Math.floor(Math.random() * eligible.length)];
        const rarity = loot.rarityBoost > 0 ? rollRarityBoosted(loot.rarityBoost) : rollRarity();
        const level = rollItemLevel(expedition.unlockLevel);
        const baseStats = applyRarityMultiplier(recipe.baseStats, rarity);
        const stats = level > 1 ? applyLevelMultiplier(baseStats, level) : baseStats;
        const maxDur = getMaxDurability(recipe.tier, rarity.id);
        const item = {
          id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${enemy.templateId}`,
          recipeId: recipe.id,
          name: recipe.name,
          icon: recipe.icon,
          slot: recipe.slot,
          tier: recipe.tier,
          rarity: rarity.id,
          level,
          durability: { current: maxDur, max: maxDur },
          stats,
          equippedBy: null,
          droppedBy: enemy.name,
        };
        items.push(item);
      }

      creatureLoot.push({ enemyName: enemy.name, enemyIcon: enemy.icon, resources: lootResources });
    }
  }

  return { resources, items, combatResult, creatureLoot };
}
