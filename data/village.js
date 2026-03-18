export const BUILDINGS = [
  {
    id: "storehouse",
    name: "Storehouse",
    icon: "\u{1F3E0}",
    description: "Expand your inventory capacity",
    effectLabel: (level) => `+${level * 10} inventory slots`,
    upgrades: [
      { level: 1, cost: { wood: 50, stone: 30 }, effect: { inventoryCapacity: 30 } },
      { level: 2, cost: { wood: 100, stone: 60, gold: 50 }, effect: { inventoryCapacity: 40 } },
      { level: 3, cost: { wood: 200, stone: 120, gold: 100 }, effect: { inventoryCapacity: 50 } },
      { level: 4, cost: { wood: 350, stone: 200, gold: 200 }, effect: { inventoryCapacity: 60 } },
      { level: 5, cost: { wood: 500, stone: 300, gold: 400 }, effect: { inventoryCapacity: 70 } },
    ],
  },
  {
    id: "war_camp",
    name: "War Camp",
    icon: "\u26FA",
    description: "Reduce expedition duration",
    effectLabel: (level) => `-${level * 8}% expedition time`,
    upgrades: [
      { level: 1, cost: { iron: 30, gold: 80 }, effect: { expeditionDurationMult: 0.92 } },
      { level: 2, cost: { iron: 60, gold: 160 }, effect: { expeditionDurationMult: 0.84 } },
      { level: 3, cost: { iron: 100, gold: 300 }, effect: { expeditionDurationMult: 0.76 } },
      { level: 4, cost: { iron: 160, gold: 500 }, effect: { expeditionDurationMult: 0.68 } },
      { level: 5, cost: { iron: 250, gold: 800 }, effect: { expeditionDurationMult: 0.60 } },
    ],
  },
  {
    id: "apothecary",
    name: "Apothecary",
    icon: "\u{1F9EA}",
    description: "Reduce hero rest time",
    effectLabel: (level) => `-${level * 12}% rest time`,
    upgrades: [
      { level: 1, cost: { herbs: 30, gold: 60 }, effect: { restDurationMult: 0.88 } },
      { level: 2, cost: { herbs: 60, gold: 120 }, effect: { restDurationMult: 0.76 } },
      { level: 3, cost: { herbs: 100, gold: 250 }, effect: { restDurationMult: 0.64 } },
      { level: 4, cost: { herbs: 160, gold: 400 }, effect: { restDurationMult: 0.52 } },
      { level: 5, cost: { herbs: 250, gold: 700 }, effect: { restDurationMult: 0.40 } },
    ],
  },
  {
    id: "smithy",
    name: "Smithy",
    icon: "\u2692\uFE0F",
    description: "Reduce repair costs",
    effectLabel: (level) => `-${level * 8}% repair cost`,
    upgrades: [
      { level: 1, cost: { iron: 25, gems: 1 }, effect: { repairCostMult: 0.92 } },
      { level: 2, cost: { iron: 50, gems: 2, gold: 100 }, effect: { repairCostMult: 0.84 } },
      { level: 3, cost: { iron: 80, gems: 4, gold: 200 }, effect: { repairCostMult: 0.76 } },
      { level: 4, cost: { iron: 130, gems: 6, gold: 400 }, effect: { repairCostMult: 0.68 } },
      { level: 5, cost: { iron: 200, gems: 10, gold: 700 }, effect: { repairCostMult: 0.60 } },
    ],
  },
];

export function getBuildingById(id) {
  return BUILDINGS.find((b) => b.id === id);
}

export function getBuildingEffect(buildingId, level) {
  const building = getBuildingById(buildingId);
  if (!building || level <= 0) return null;
  const upgrade = building.upgrades[level - 1];
  return upgrade ? upgrade.effect : building.upgrades[building.upgrades.length - 1].effect;
}

export function getNextUpgrade(buildingId, currentLevel) {
  const building = getBuildingById(buildingId);
  if (!building) return null;
  if (currentLevel >= building.upgrades.length) return null;
  return building.upgrades[currentLevel];
}
