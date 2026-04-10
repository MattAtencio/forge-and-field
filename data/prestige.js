export const PRESTIGE_MIN_LEVEL = 15;

export const PRESTIGE_BONUSES = [
  {
    id: "resource_surge",
    name: "Resource Surge",
    icon: "\u{1F4C8}",
    description: "+10% resource generation per stack",
    cost: 3,
    maxStacks: 5,
    effect: { type: "generator_mult", value: 0.1 },
  },
  {
    id: "swift_forge",
    name: "Swift Forge",
    icon: "\u26A1",
    description: "-12% crafting time per stack",
    cost: 4,
    maxStacks: 3,
    effect: { type: "craft_speed", value: 0.12 },
  },
  {
    id: "battle_wisdom",
    name: "Battle Wisdom",
    icon: "\u{1F4DA}",
    description: "+10% hero XP gain per stack",
    cost: 5,
    maxStacks: 5,
    effect: { type: "hero_xp_mult", value: 0.1 },
  },
  {
    id: "lucky_crafter",
    name: "Lucky Crafter",
    icon: "\u{1F340}",
    description: "+5% rare+ craft chance per stack",
    cost: 6,
    maxStacks: 3,
    effect: { type: "rarity_bonus", value: 0.05 },
  },
  {
    id: "patrons_gift",
    name: "Patron's Gift",
    icon: "\u{1F381}",
    description: "Start with +200 gold per stack",
    cost: 3,
    maxStacks: 3,
    effect: { type: "starting_gold", value: 200 },
  },
  {
    id: "forgemasters_memory",
    name: "Forgemaster's Memory",
    icon: "\uD83D\uDD25",
    description: "The forge remembers. Begin each new life with basic equipment.",
    cost: 2,
    maxStacks: 1,
    effect: { type: "starting_items", value: 1 },
  },
  {
    id: "rapid_growth",
    name: "Rapid Growth",
    icon: "\u{1F331}",
    description: "+15% player XP gain per stack",
    cost: 8,
    maxStacks: 3,
    effect: { type: "player_xp_mult", value: 0.15 },
  },
  {
    id: "veterans_start",
    name: "Veteran's Start",
    icon: "\u{1F396}\uFE0F",
    description: "Start at player level 3",
    cost: 5,
    maxStacks: 1,
    effect: { type: "starting_level", value: 3 },
  },
  {
    id: "masters_start",
    name: "Master's Start",
    icon: "\u{1F451}",
    description: "Start at player level 5 with all heroes",
    cost: 15,
    maxStacks: 1,
    effect: { type: "starting_level_heroes", value: 5 },
  },
];

export function getPrestigeBonusById(id) {
  return PRESTIGE_BONUSES.find((b) => b.id === id);
}
