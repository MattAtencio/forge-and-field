const SAVE_KEY = "forgeAndField_save";
const CURRENT_VERSION = 2;

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
  return { ...data, version: CURRENT_VERSION };
}
