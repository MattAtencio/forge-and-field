import { getPrestigeMultiplier, getPrestigeStartingGold, getPrestigeStartingLevel, shouldUnlockAllHeroes, calculatePrestigeStars } from "./prestige";
import { HERO_TEMPLATES } from "@/data/heroes";
import { getUnlocksForLevel } from "@/data/progression";
import { createHeroFromTemplate } from "./hero";

export function createInitialState() {
  return {
    version: 2,

    // Player
    player: {
      level: 1,
      xp: 0,
      tutorialDone: false,
      unlockedScreens: ["hub", "forge"],
      lastOnline: Date.now(),
    },

    // Resources
    resources: {
      wood: 50,
      stone: 30,
      iron: 10,
      herbs: 5,
      gems: 0,
      gold: 100,
    },

    // Passive generation rates
    generators: {
      wood: { level: 1, ratePerMin: 2.0 },
      stone: { level: 1, ratePerMin: 1.0 },
      iron: { level: 1, ratePerMin: 0.5 },
      herbs: { level: 1, ratePerMin: 0.3 },
      gems: { level: 0, ratePerMin: 0.0 },
      gold: { level: 1, ratePerMin: 1.0 },
    },

    // Crafted items
    inventory: [],

    // Active crafting (max 2 slots)
    craftingQueue: [],

    // Hero roster
    heroes: [
      {
        id: "hero_001",
        templateId: "warrior",
        name: "Aldric",
        title: "Iron Vanguard",
        level: 1,
        xp: 0,
        stats: { hp: 60, atk: 12, def: 10, spd: 4 },
        equipment: { weapon: null, armor: null, accessory: null },
        status: "idle",
      },
    ],

    // Expeditions
    expeditions: {
      active: [],
      completed: [],
    },

    // Weekly season
    season: {
      currentWeek: 0,
      weeklyXP: 0,
      claimedRewards: [],
    },

    // Lifetime stats
    stats: {
      totalItemsCrafted: 0,
      totalExpeditions: 0,
      totalResourcesGathered: 0,
      highestHeroLevel: 1,
      daysPlayed: 1,
      firstPlayDate: Date.now(),
    },

    // World Map
    worldMap: {
      unlockedRegions: ["greenwood"],
      clearedRegions: [],
      discoveries: {},
      bossesDefeated: {},
    },

    // Prestige
    prestige: {
      tier: 0,
      totalStars: 0,
      availableStars: 0,
      bonuses: {},
      titles: [],
    },

    // UI state (not persisted meaningfully, but part of state for simplicity)
    currentScreen: "hub",
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, currentScreen: action.screen };

    case "TICK": {
      const now = action.now || Date.now();
      const delta = now - state.player.lastOnline;
      if (delta <= 0) return state;

      const minutes = delta / 60000;
      const newResources = { ...state.resources };
      let totalGathered = 0;

      // Apply prestige generator multiplier
      const genMult = getPrestigeMultiplier(state.prestige, "generator_mult");

      for (const [resource, gen] of Object.entries(state.generators)) {
        if (gen.ratePerMin > 0) {
          const gained = gen.ratePerMin * minutes * genMult;
          newResources[resource] =
            Math.round((newResources[resource] + gained) * 100) / 100;
          totalGathered += gained;
        }
      }

      // Check expedition completions
      const completedExpeditions = [];
      const stillActive = [];
      for (const exp of state.expeditions.active) {
        if (now >= exp.startedAt + exp.duration) {
          completedExpeditions.push({ ...exp, resolved: true });
        } else {
          stillActive.push(exp);
        }
      }

      return {
        ...state,
        resources: newResources,
        // craftingQueue stays as-is; completed crafts remain until user collects
        expeditions: {
          ...state.expeditions,
          active: stillActive,
          completed: [
            ...state.expeditions.completed,
            ...completedExpeditions,
          ],
        },
        player: {
          ...state.player,
          lastOnline: now,
        },
        stats: {
          ...state.stats,
          totalResourcesGathered:
            state.stats.totalResourcesGathered + totalGathered,
        },
      };
    }

    case "START_CRAFT": {
      if (state.craftingQueue.length >= 2) return state;
      const { recipe } = action;

      // Deduct resources
      const newResources = { ...state.resources };
      for (const [resource, cost] of Object.entries(recipe.ingredients)) {
        if (newResources[resource] < cost) return state;
        newResources[resource] -= cost;
      }

      // Apply prestige crafting speed bonus
      const craftSpeedMult = getPrestigeMultiplier(state.prestige, "craft_speed");
      const adjustedDuration = Math.round(recipe.duration / craftSpeedMult);

      const craftEntry = {
        id: `craft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        recipeId: recipe.id,
        startedAt: Date.now(),
        duration: adjustedDuration,
      };

      return {
        ...state,
        resources: newResources,
        craftingQueue: [...state.craftingQueue, craftEntry],
      };
    }

    case "COMPLETE_CRAFT": {
      const { craftId, item } = action;
      const xpMult = getPrestigeMultiplier(state.prestige, "player_xp_mult");
      const xpGain = Math.round(10 * xpMult);

      return {
        ...state,
        craftingQueue: state.craftingQueue.filter((c) => c.id !== craftId),
        inventory: [...state.inventory, item],
        player: {
          ...state.player,
          xp: state.player.xp + xpGain,
        },
        season: {
          ...state.season,
          weeklyXP: state.season.weeklyXP + xpGain,
        },
        stats: {
          ...state.stats,
          totalItemsCrafted: state.stats.totalItemsCrafted + 1,
        },
      };
    }

    case "CANCEL_CRAFT": {
      const { craftId, refund } = action;
      const newResources = { ...state.resources };
      if (refund) {
        for (const [resource, amount] of Object.entries(refund)) {
          newResources[resource] += amount;
        }
      }
      return {
        ...state,
        resources: newResources,
        craftingQueue: state.craftingQueue.filter((c) => c.id !== craftId),
      };
    }

    case "SELL_ITEM": {
      const { itemId, goldValue } = action;
      return {
        ...state,
        inventory: state.inventory.filter((i) => i.id !== itemId),
        resources: {
          ...state.resources,
          gold: state.resources.gold + goldValue,
        },
      };
    }

    case "EQUIP_ITEM": {
      const { heroId, itemId, slot } = action;

      const hero = state.heroes.find((h) => h.id === heroId);
      if (!hero) return state;

      const currentEquipped = hero.equipment[slot];
      const newInventory = state.inventory.map((item) => {
        if (item.id === itemId) return { ...item, equippedBy: heroId };
        if (item.id === currentEquipped)
          return { ...item, equippedBy: null };
        return item;
      });

      const newHeroes = state.heroes.map((h) => {
        if (h.id !== heroId) return h;
        return {
          ...h,
          equipment: { ...h.equipment, [slot]: itemId },
        };
      });

      return { ...state, inventory: newInventory, heroes: newHeroes };
    }

    case "UNEQUIP_ITEM": {
      const { heroId: uhId, slot: uSlot } = action;
      const uHero = state.heroes.find((h) => h.id === uhId);
      if (!uHero || !uHero.equipment[uSlot]) return state;

      const removedItemId = uHero.equipment[uSlot];
      return {
        ...state,
        inventory: state.inventory.map((item) =>
          item.id === removedItemId ? { ...item, equippedBy: null } : item
        ),
        heroes: state.heroes.map((h) =>
          h.id === uhId
            ? { ...h, equipment: { ...h.equipment, [uSlot]: null } }
            : h
        ),
      };
    }

    case "LEVEL_UP_HERO": {
      const { heroId: lvHeroId, cost, statGrowth } = action;
      if (state.resources.gold < cost) return state;

      const heroXpMult = getPrestigeMultiplier(state.prestige, "hero_xp_mult");
      const xpMult = getPrestigeMultiplier(state.prestige, "player_xp_mult");
      const playerXpGain = Math.round(50 * xpMult);

      const newHeroes = state.heroes.map((h) => {
        if (h.id !== lvHeroId) return h;
        return {
          ...h,
          level: h.level + 1,
          stats: {
            hp: h.stats.hp + statGrowth.hp,
            atk: h.stats.atk + statGrowth.atk,
            def: h.stats.def + statGrowth.def,
            spd: h.stats.spd + statGrowth.spd,
          },
        };
      });

      const maxLevel = Math.max(...newHeroes.map((h) => h.level));

      return {
        ...state,
        resources: { ...state.resources, gold: state.resources.gold - cost },
        heroes: newHeroes,
        player: { ...state.player, xp: state.player.xp + playerXpGain },
        season: {
          ...state.season,
          weeklyXP: state.season.weeklyXP + playerXpGain,
        },
        stats: {
          ...state.stats,
          highestHeroLevel: Math.max(state.stats.highestHeroLevel, maxLevel),
        },
      };
    }

    case "RECRUIT_HERO": {
      const { hero } = action;
      if (state.heroes.find((h) => h.templateId === hero.templateId))
        return state;
      return { ...state, heroes: [...state.heroes, hero] };
    }

    case "SEND_EXPEDITION": {
      const { expedition, heroIds } = action;
      const newHeroes = state.heroes.map((h) =>
        heroIds.includes(h.id) ? { ...h, status: "expedition" } : h
      );

      const entry = {
        id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        templateId: expedition.id,
        heroIds,
        startedAt: Date.now(),
        duration: expedition.duration,
        resolved: false,
      };

      return {
        ...state,
        heroes: newHeroes,
        expeditions: {
          ...state.expeditions,
          active: [...state.expeditions.active, entry],
        },
        stats: {
          ...state.stats,
          totalExpeditions: state.stats.totalExpeditions + 1,
        },
      };
    }

    case "CLAIM_REWARDS": {
      const { expeditionId, rewards } = action;
      const exp = state.expeditions.completed.find(
        (e) => e.id === expeditionId
      );
      if (!exp) return state;

      // Free up heroes
      const newHeroes = state.heroes.map((h) =>
        exp.heroIds.includes(h.id) ? { ...h, status: "idle" } : h
      );

      // Add resource rewards
      const newResources = { ...state.resources };
      if (rewards.resources) {
        for (const [resource, amount] of Object.entries(rewards.resources)) {
          newResources[resource] = (newResources[resource] || 0) + amount;
        }
      }

      // Add item rewards
      const newInventory = rewards.items
        ? [...state.inventory, ...rewards.items]
        : state.inventory;

      const xpMult = getPrestigeMultiplier(state.prestige, "player_xp_mult");
      const xpGain = Math.round(25 * xpMult);

      return {
        ...state,
        heroes: newHeroes,
        resources: newResources,
        inventory: newInventory,
        expeditions: {
          ...state.expeditions,
          completed: state.expeditions.completed.filter(
            (e) => e.id !== expeditionId
          ),
        },
        player: { ...state.player, xp: state.player.xp + xpGain },
        season: {
          ...state.season,
          weeklyXP: state.season.weeklyXP + xpGain,
        },
      };
    }

    case "CLAIM_SEASON_REWARD": {
      const { rewardId, reward } = action;
      if (state.season.claimedRewards.includes(rewardId)) return state;

      let newState = {
        ...state,
        season: {
          ...state.season,
          claimedRewards: [...state.season.claimedRewards, rewardId],
        },
      };

      if (reward.type === "resources") {
        const newResources = { ...newState.resources };
        for (const [r, amount] of Object.entries(reward.value)) {
          newResources[r] = (newResources[r] || 0) + amount;
        }
        newState = { ...newState, resources: newResources };
      } else if (reward.type === "hero_xp") {
        newState = {
          ...newState,
          heroes: newState.heroes.map((h) => ({
            ...h,
            xp: h.xp + reward.value,
          })),
        };
      }

      return newState;
    }

    case "GAIN_XP": {
      const { amount } = action;
      const xpMult = getPrestigeMultiplier(state.prestige, "player_xp_mult");
      const adjusted = Math.round(amount * xpMult);
      return {
        ...state,
        player: { ...state.player, xp: state.player.xp + adjusted },
        season: {
          ...state.season,
          weeklyXP: state.season.weeklyXP + adjusted,
        },
      };
    }

    case "LEVEL_UP_PLAYER": {
      const { newLevel, newUnlocks } = action;
      return {
        ...state,
        player: {
          ...state.player,
          level: newLevel,
          unlockedScreens: [
            ...new Set([...state.player.unlockedScreens, ...newUnlocks]),
          ],
        },
      };
    }

    case "SET_TUTORIAL_DONE":
      return {
        ...state,
        player: { ...state.player, tutorialDone: true },
      };

    // ── World Map Actions ──

    case "UNLOCK_REGION": {
      const { regionId } = action;
      const regions = state.worldMap?.unlockedRegions || [];
      if (regions.includes(regionId)) return state;
      return {
        ...state,
        worldMap: {
          ...state.worldMap,
          unlockedRegions: [...regions, regionId],
        },
      };
    }

    case "CLEAR_BOSS": {
      const { regionId, bossExpeditionId } = action;
      const cleared = state.worldMap?.clearedRegions || [];
      if (cleared.includes(regionId)) return state;
      return {
        ...state,
        worldMap: {
          ...state.worldMap,
          clearedRegions: [...cleared, regionId],
          bossesDefeated: {
            ...(state.worldMap?.bossesDefeated || {}),
            [bossExpeditionId]: true,
          },
        },
      };
    }

    case "DISCOVER_POI": {
      const { poiId, reward } = action;
      if (state.worldMap?.discoveries?.[poiId]) return state;

      let newState = {
        ...state,
        worldMap: {
          ...state.worldMap,
          discoveries: {
            ...(state.worldMap?.discoveries || {}),
            [poiId]: true,
          },
        },
      };

      // Apply POI reward
      if (reward.type === "generator_boost") {
        const gen = newState.generators[reward.resource];
        if (gen) {
          newState = {
            ...newState,
            generators: {
              ...newState.generators,
              [reward.resource]: {
                ...gen,
                ratePerMin: Math.round((gen.ratePerMin * (1 + reward.bonus)) * 100) / 100,
              },
            },
          };
        }
      } else if (reward.type === "xp_boost") {
        // XP boost is handled via discoveries check — stored in worldMap.discoveries
        // The prestige multiplier system handles it
      }

      return newState;
    }

    // ── Prestige Actions ──

    case "PRESTIGE_REBIRTH": {
      const { stars } = action;
      const prestige = state.prestige || { tier: 0, totalStars: 0, availableStars: 0, bonuses: {}, titles: [] };
      const newPrestige = {
        ...prestige,
        tier: prestige.tier + 1,
        totalStars: prestige.totalStars + stars,
        availableStars: prestige.availableStars + stars,
      };

      // Build fresh state preserving prestige + discoveries + stats
      const fresh = createInitialState();
      const startLevel = getPrestigeStartingLevel(newPrestige);
      const startGold = getPrestigeStartingGold(newPrestige);
      const allHeroes = shouldUnlockAllHeroes(newPrestige);

      // Get screen unlocks for starting level
      const unlocks = getUnlocksForLevel(startLevel);

      // Build hero roster
      let heroes = [fresh.heroes[0]]; // Always start with warrior
      if (allHeroes) {
        heroes = HERO_TEMPLATES.map((t) => createHeroFromTemplate(t));
      }

      return {
        ...fresh,
        player: {
          ...fresh.player,
          level: startLevel,
          tutorialDone: true, // Skip tutorial on rebirth
          unlockedScreens: [...new Set([...fresh.player.unlockedScreens, ...unlocks.screens])],
        },
        resources: {
          ...fresh.resources,
          gold: startGold,
        },
        heroes,
        worldMap: {
          ...fresh.worldMap,
          // Preserve discoveries across rebirths
          discoveries: state.worldMap?.discoveries || {},
        },
        prestige: newPrestige,
        stats: {
          ...state.stats, // Preserve lifetime stats
          daysPlayed: state.stats.daysPlayed,
          firstPlayDate: state.stats.firstPlayDate,
        },
        currentScreen: "hub",
      };
    }

    case "BUY_PRESTIGE_BONUS": {
      const { bonusId, cost } = action;
      const prestige = state.prestige || { tier: 0, totalStars: 0, availableStars: 0, bonuses: {}, titles: [] };
      if (prestige.availableStars < cost) return state;

      return {
        ...state,
        prestige: {
          ...prestige,
          availableStars: prestige.availableStars - cost,
          bonuses: {
            ...prestige.bonuses,
            [bonusId]: (prestige.bonuses[bonusId] || 0) + 1,
          },
        },
      };
    }

    case "LOAD_SAVE":
      return { ...action.state, currentScreen: "hub" };

    case "RESET_GAME":
      return { ...createInitialState(), currentScreen: "hub" };

    default:
      return state;
  }
}
