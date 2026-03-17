import { HERO_SKILLS } from "@/data/skills";

export function getHeroSkills(templateId) {
  return HERO_SKILLS[templateId] || [];
}

export function getUnlockedSkills(hero) {
  const skills = getHeroSkills(hero.templateId);
  return skills.filter((s) => hero.level >= s.unlockHeroLevel);
}

export function getActiveSkills(hero) {
  return getUnlockedSkills(hero).filter((s) => s.type === "active");
}

export function getPassiveSkills(hero) {
  return getUnlockedSkills(hero).filter((s) => s.type === "passive");
}

export function applyPassiveBonuses(hero, baseStats, context) {
  const passives = getPassiveSkills(hero);
  const result = { ...baseStats };

  for (const skill of passives) {
    const eff = skill.effect;

    // Context-specific stat bonuses (e.g., +20% ATK in combat, +10% ATK/DEF on expeditions)
    if (eff.stats && (!eff.context || eff.context === context)) {
      for (const [stat, pct] of Object.entries(eff.stats)) {
        if (result[stat] !== undefined) {
          result[stat] = Math.round(result[stat] * (1 + pct));
        }
      }
    }
  }

  return result;
}

export function getExpeditionDurationMultiplier(heroes) {
  let mult = 1;
  for (const hero of heroes) {
    const passives = getPassiveSkills(hero);
    for (const skill of passives) {
      if (skill.effect.context === "expedition" && skill.effect.durationMult) {
        mult *= skill.effect.durationMult;
      }
    }
  }
  return mult;
}

export function getCraftingDurationMultiplier(heroes) {
  let mult = 1;
  for (const hero of heroes) {
    const passives = getPassiveSkills(hero);
    for (const skill of passives) {
      if (skill.effect.context === "crafting" && skill.effect.durationMult) {
        mult *= skill.effect.durationMult;
      }
    }
  }
  return mult;
}

export function getCraftingStatBonus(heroes) {
  let bonus = 0;
  for (const hero of heroes) {
    const passives = getPassiveSkills(hero);
    for (const skill of passives) {
      if (skill.effect.context === "crafting" && skill.effect.statBonus) {
        bonus += skill.effect.statBonus;
      }
    }
  }
  return bonus;
}
