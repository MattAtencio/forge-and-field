const SAVE_KEY = "forgeAndField_save";
const CURRENT_VERSION = 7;

export function loadGame() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return migrate(data);
  } catch {
    return null;
  }
}

export function saveGame(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        ...state,
        version: CURRENT_VERSION,
        savedAt: Date.now(),
      })
    );
  } catch {
    // quota exceeded — silent fail
  }
}

export function exportSave(state) {
  return JSON.stringify(state, null, 2);
}

export function importSave(jsonString) {
  const data = JSON.parse(jsonString);
  return migrate(data);
}

export function clearSave() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SAVE_KEY);
}

function migrate(data) {
  if (data.version < 2) {
    // Add world map state
    if (!data.worldMap) {
      data.worldMap = {
        unlockedRegions: ["greenwood"],
        clearedRegions: [],
        discoveries: {},
        bossesDefeated: {},
      };
    }
    // Add prestige state
    if (!data.prestige) {
      data.prestige = {
        tier: 0,
        totalStars: 0,
        availableStars: 0,
        bonuses: {},
        titles: [],
      };
    }
    data.version = 2;
  }

  if (data.version < 3) {
    // Add endurance to heroes
    if (data.heroes) {
      data.heroes = data.heroes.map((hero) => {
        if (!hero.endurance) {
          hero.endurance = { current: 100, max: 100 };
        }
        return hero;
      });
    }
    // Add level and durability to items
    if (data.inventory) {
      data.inventory = data.inventory.map((item) => {
        if (!item.level) item.level = 1;
        if (!item.durability) {
          const baseDur = { 1: 30, 2: 50, 3: 80 };
          const rarityMult = { common: 1.0, uncommon: 1.2, rare: 1.5, epic: 2.0 };
          const maxDur = Math.round((baseDur[item.tier] || 30) * (rarityMult[item.rarity] || 1.0));
          item.durability = { current: maxDur, max: maxDur };
        }
        return item;
      });
    }
    // Add activeTitle to heroes
    if (data.heroes) {
      data.heroes = data.heroes.map((hero) => {
        if (hero.activeTitle === undefined) hero.activeTitle = null;
        return hero;
      });
    }
    // Add inventory capacity
    if (!data.inventoryCapacity) data.inventoryCapacity = 20;
    // Add chests
    if (!data.chests) {
      data.chests = {
        common: { lastClaimed: 0, cooldown: 4 * 60 * 60 * 1000 },
        uncommon: { lastClaimed: 0, cooldown: 8 * 60 * 60 * 1000 },
        rare: { lastClaimed: 0, cooldown: 24 * 60 * 60 * 1000 },
      };
    }
    // Add daily quests
    if (!data.dailyQuests) {
      data.dailyQuests = {
        lastReset: Date.now(),
        progress: { craftItems: 0, completeExpeditions: 0, levelUpHero: 0, sellItems: 0 },
        claimed: [],
      };
    }
    // Add village
    if (!data.village) data.village = {};
    data.version = 3;
  }

  if (data.version < 4) {
    // Add maxCraftSlots and retroactively grant bonus if Buried Workshop was discovered
    const hasWorkshop = data.worldMap?.discoveries?.poi_buried_workshop;
    data.maxCraftSlots = hasWorkshop ? 3 : 2;
    data.version = 4;
  }

  if (data.version < 5) {
    // Migrate chest tiers: common→uncommon, uncommon→rare, rare→epic
    // Preserve lastClaimed timestamps so active cooldowns carry over
    const oldChests = data.chests || {};
    data.chests = {
      uncommon: {
        lastClaimed: oldChests.common?.lastClaimed || oldChests.uncommon?.lastClaimed || 0,
        cooldown: 4 * 60 * 60 * 1000,
      },
      rare: {
        lastClaimed: oldChests.uncommon?.lastClaimed || oldChests.rare?.lastClaimed || 0,
        cooldown: 8 * 60 * 60 * 1000,
      },
      epic: {
        lastClaimed: oldChests.rare?.lastClaimed || 0,
        cooldown: 24 * 60 * 60 * 1000,
      },
    };
    data.version = 5;
  }

  if (data.version < 6) {
    // Add exploration state
    if (!data.exploration) {
      data.exploration = {
        active: false,
        regionId: null,
        heroId: null,
        currentNode: null,
        visitedNodes: [],
        lootBag: { resources: {}, items: [] },
        nodeMap: null,
        combat: null,
      };
    }
    // Add new exploration resources
    if (!data.resources.ancientWood) data.resources.ancientWood = 0;
    if (!data.resources.starIron) data.resources.starIron = 0;
    if (!data.generators.ancientWood) data.generators.ancientWood = { level: 0, ratePerMin: 0.0 };
    if (!data.generators.starIron) data.generators.starIron = { level: 0, ratePerMin: 0.0 };
    // Add exploration tutorial flag
    if (data.player && data.player.explorationTutorialDone === undefined) {
      data.player.explorationTutorialDone = false;
    }
    data.version = 6;
  }

  if (data.version < 7) {
    if (data.craftsSinceEpic === undefined) data.craftsSinceEpic = 0;
    data.version = 7;
  }

  return { ...data, version: CURRENT_VERSION };
}
