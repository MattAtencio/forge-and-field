import { HERO_TEMPLATES } from "@/data/heroes";
import { getHeroLevelCost } from "@/data/progression";
import { applyPassiveBonuses } from "./skills";

export function getHeroTemplate(templateId) {
  return HERO_TEMPLATES.find((h) => h.id === templateId);
}

export function getEffectiveStats(hero, inventory) {
  const base = { ...hero.stats };
  const slots = ["weapon", "armor", "accessory"];

  for (const slot of slots) {
    const itemId = hero.equipment[slot];
    if (!itemId) continue;
    const item = inventory.find((i) => i.id === itemId);
    if (!item) continue;
    // Items at 0 durability contribute no stats
    if (item.durability && item.durability.current <= 0) continue;
    for (const [stat, value] of Object.entries(item.stats)) {
      if (base[stat] !== undefined) {
        base[stat] += value;
      }
    }
  }

  return base;
}

export function getEffectiveStatsWithSkills(hero, inventory, context) {
  const base = getEffectiveStats(hero, inventory);
  return applyPassiveBonuses(hero, base, context);
}

export function getHeroPower(hero, inventory) {
  const stats = getEffectiveStats(hero, inventory);
  return stats.atk + stats.def + Math.floor(stats.spd / 2) + Math.floor(stats.hp / 5);
}

export function canLevelUp(hero, gold) {
  const cost = getHeroLevelCost(hero.level);
  return gold >= cost;
}

export function createHeroFromTemplate(template) {
  const maxEndurance = template.baseEndurance || 100;
  return {
    id: `hero_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    templateId: template.id,
    name: template.name,
    title: template.title,
    level: 1,
    xp: 0,
    stats: { ...template.baseStats },
    equipment: { weapon: null, armor: null, accessory: null },
    endurance: { current: maxEndurance, max: maxEndurance },
    activeTitle: null,
    status: "idle",
  };
}

export function getHeroMaxEndurance(hero) {
  const template = getHeroTemplate(hero.templateId);
  if (!template) return 100;
  return (template.baseEndurance || 100) + ((hero.level - 1) * (template.enduranceGrowth || 5));
}

export function getExpeditionEnduranceCost(expedition) {
  const base = 15;
  const levelScale = (expedition.unlockLevel || 1) * 2;
  return Math.round(base + levelScale);
}

export function getRestDuration(hero) {
  const missing = (hero.endurance?.max || 100) - (hero.endurance?.current || 0);
  // 1 second per 1 endurance point
  return missing * 1000;
}

export function getPotionCost(hero) {
  const missing = (hero.endurance?.max || 100) - (hero.endurance?.current || 0);
  return {
    herbs: Math.max(3, Math.round(missing * 0.15)),
    gold: Math.round(missing * 0.5),
  };
}

export function getUnequippedItems(inventory, slot) {
  return inventory.filter(
    (item) => item.equippedBy === null && item.slot === slot
  );
}
