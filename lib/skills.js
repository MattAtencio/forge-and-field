import { HERO_SKILLS } from "@/data/skills";

export function getHeroSkills(templateId) {
  return HERO_SKILLS[templateId] || [];
}

export function getSkillTier(skill, heroLevel) {
  if (!skill.tiers || skill.tiers.length === 0) return { tier: 1, tierData: null };
  let currentTier = 0;
  for (let i = skill.tiers.length - 1; i >= 0; i--) {
    if (heroLevel >= skill.tiers[i].level) {
      currentTier = i;
      break;
    }
  }
  return { tier: currentTier + 1, tierData: skill.tiers[currentTier] };
}

export function getResolvedEffect(skill, heroLevel) {
  const base = { ...skill.effect };
  if (!skill.tiers) return base;

  const { tierData } = getSkillTier(skill, heroLevel);
  if (!tierData) return base;

  // Merge tier-specific overrides into the base effect
  if (tierData.bonus !== undefined) base.bonus = tierData.bonus;
  if (tierData.doubleActionChance !== undefined) base.doubleActionChance = tierData.doubleActionChance;
  if (tierData.damage !== undefined) base.damage = tierData.damage;
  if (tierData.defIgnore !== undefined) base.defIgnore = tierData.defIgnore;
  if (tierData.debuffAmount !== undefined && base.debuff) base.debuff = { ...base.debuff, amount: tierData.debuffAmount };
  if (tierData.durationMult !== undefined) base.durationMult = tierData.durationMult;
  if (tierData.stats) base.stats = tierData.stats;
  if (tierData.partyStats) base.partyStats = tierData.partyStats;
  if (tierData.heal !== undefined) base.heal = tierData.heal;
  if (tierData.statBonus !== undefined) base.statBonus = tierData.statBonus;

  return base;
}

export function getUnlockedSkills(hero) {
  const skills = getHeroSkills(hero.templateId);
  return skills.filter((s) => hero.level >= s.unlockHeroLevel);
}

export function getActiveSkills(hero) {
  return getUnlockedSkills(hero).filter((s) => s.type === "active").map((s) => ({
    ...s,
    effect: getResolvedEffect(s, hero.level),
  }));
}

export function getPassiveSkills(hero) {
  return getUnlockedSkills(hero).filter((s) => s.type === "passive").map((s) => ({
    ...s,
    effect: getResolvedEffect(s, hero.level),
  }));
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
