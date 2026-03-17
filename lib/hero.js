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
  return {
    id: `hero_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    templateId: template.id,
    name: template.name,
    title: template.title,
    level: 1,
    xp: 0,
    stats: { ...template.baseStats },
    equipment: { weapon: null, armor: null, accessory: null },
    status: "idle",
  };
}

export function getUnequippedItems(inventory, slot) {
  return inventory.filter(
    (item) => item.equippedBy === null && item.slot === slot
  );
}
