import { getPrestigeMultiplier, getPrestigeStartingGold, getPrestigeStartingLevel, shouldUnlockAllHeroes, calculatePrestigeStars } from "./prestige";
import { applyLevelMultiplier, getLevelMultiplier, getMaxDurability } from "./rarity";
import { HERO_TEMPLATES } from "@/data/heroes";
import { getUnlocksForLevel } from "@/data/progression";
import { createHeroFromTemplate } from "./hero";

function bumpDailyQuest(state, questKey, amount = 1) {
  if (!state.dailyQuests) return state;
  return {
    ...state,
    dailyQuests: {
      ...state.dailyQuests,
      progress: {
        ...state.dailyQuests.progress,
        [questKey]: (state.dailyQuests.progress[questKey] || 0) + amount,
      },
    },
  };
}

export function createInitialState() {
  return {
    version: 3,

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
      herbs: { level: 1, ratePerMin: 0.5 },
      gems: { level: 0, ratePerMin: 0.0 },
      gold: { level: 1, ratePerMin: 1.0 },
    },

    // Crafted items
    inventory: [],
    inventoryCapacity: 20,

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
        endurance: { current: 100, max: 100 },
        activeTitle: null,
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

    // Daily quests
    dailyQuests: {
      lastReset: Date.now(),
      progress: {
        craftItems: 0,
        completeExpeditions: 0,
        levelUpHero: 0,
        sellItems: 0,
      },
      claimed: [],
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

    // Village buildings
    village: {},

    // Loot chests
    chests: {
      common: { lastClaimed: 0, cooldown: 4 * 60 * 60 * 1000 },    // 4 hours
      uncommon: { lastClaimed: 0, cooldown: 8 * 60 * 60 * 1000 },   // 8 hours
      rare: { lastClaimed: 0, cooldown: 24 * 60 * 60 * 1000 },      // 24 hours
    },

    // UI state (not persisted meaningfully, but part of state for simplicity)
    currentScreen: "hub",
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, currentScreen: action.screen, screenPayload: action.payload || null };

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

      // Reset daily quests at midnight (24h from last reset)
      let dailyQuests = state.dailyQuests;
      if (dailyQuests && now - dailyQuests.lastReset >= 24 * 60 * 60 * 1000) {
        dailyQuests = {
          lastReset: now,
          progress: { craftItems: 0, completeExpeditions: 0, levelUpHero: 0, sellItems: 0 },
          claimed: [],
        };
      }

      // Check rest completion for heroes
      const newHeroesTick = state.heroes.map((h) => {
        if (h.status === "resting" && h.restUntil && now >= h.restUntil) {
          return {
            ...h,
            status: "idle",
            endurance: { ...h.endurance, current: h.endurance?.max || 100 },
            restUntil: undefined,
          };
        }
        return h;
      });

      return {
        ...state,
        resources: newResources,
        heroes: newHeroesTick,
        dailyQuests,
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
      if (state.inventory.length >= (state.inventoryCapacity || 20)) return state;
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

      return bumpDailyQuest({
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
      }, "craftItems");
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
      return bumpDailyQuest({
        ...state,
        inventory: state.inventory.filter((i) => i.id !== itemId),
        resources: {
          ...state.resources,
          gold: state.resources.gold + goldValue,
        },
      }, "sellItems");
    }

    case "SELL_ITEMS_BATCH": {
      const { itemIds, totalGold } = action;
      return {
        ...state,
        inventory: state.inventory.filter((i) => !itemIds.includes(i.id)),
        resources: {
          ...state.resources,
          gold: state.resources.gold + totalGold,
        },
      };
    }

    case "UPGRADE_ITEM": {
      const { itemId, cost } = action;
      const item = state.inventory.find((i) => i.id === itemId);
      if (!item) return state;
      const currentLevel = item.level || 1;
      if (currentLevel >= 3) return state;

      // Check resources
      const newResources = { ...state.resources };
      for (const [res, amount] of Object.entries(cost)) {
        if ((newResources[res] || 0) < amount) return state;
        newResources[res] -= amount;
      }

      const newLevel = currentLevel + 1;
      // Recalculate stats from base: strip old level mult, apply new
      const oldMult = getLevelMultiplier(currentLevel);
      const newMult = getLevelMultiplier(newLevel);
      const newStats = {};
      for (const [stat, value] of Object.entries(item.stats)) {
        const baseValue = Math.round(value / oldMult);
        newStats[stat] = Math.round(baseValue * newMult);
      }

      return {
        ...state,
        resources: newResources,
        inventory: state.inventory.map((i) =>
          i.id === itemId ? { ...i, level: newLevel, stats: newStats } : i
        ),
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
      const { heroId: lvHeroId, cost, statGrowth, enduranceGrowth } = action;
      if (state.resources.gold < cost) return state;

      const heroXpMult = getPrestigeMultiplier(state.prestige, "hero_xp_mult");
      const xpMult = getPrestigeMultiplier(state.prestige, "player_xp_mult");
      const playerXpGain = Math.round(50 * xpMult);

      const newHeroes = state.heroes.map((h) => {
        if (h.id !== lvHeroId) return h;
        const endGrowth = enduranceGrowth || 5;
        const newMax = (h.endurance?.max || 100) + endGrowth;
        return {
          ...h,
          level: h.level + 1,
          stats: {
            hp: h.stats.hp + statGrowth.hp,
            atk: h.stats.atk + statGrowth.atk,
            def: h.stats.def + statGrowth.def,
            spd: h.stats.spd + statGrowth.spd,
          },
          endurance: {
            current: Math.min((h.endurance?.current || 100) + endGrowth, newMax),
            max: newMax,
          },
        };
      });

      const maxLevel = Math.max(...newHeroes.map((h) => h.level));

      return bumpDailyQuest({
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
      }, "levelUpHero");
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

    case "REPAIR_ITEM": {
      const { itemId: repItemId, cost: repCost } = action;
      const repItem = state.inventory.find((i) => i.id === repItemId);
      if (!repItem || !repItem.durability) return state;
      if (repItem.durability.current >= repItem.durability.max) return state;

      const repResources = { ...state.resources };
      for (const [res, amount] of Object.entries(repCost)) {
        if ((repResources[res] || 0) < amount) return state;
        repResources[res] -= amount;
      }

      return {
        ...state,
        resources: repResources,
        inventory: state.inventory.map((i) =>
          i.id === repItemId
            ? { ...i, durability: { ...i.durability, current: i.durability.max } }
            : i
        ),
      };
    }

    case "DISMANTLE_ITEM": {
      const { itemId: disItemId, returns } = action;
      const disItem = state.inventory.find((i) => i.id === disItemId);
      if (!disItem || disItem.equippedBy) return state;

      const disResources = { ...state.resources };
      for (const [res, amount] of Object.entries(returns)) {
        disResources[res] = (disResources[res] || 0) + amount;
      }

      return {
        ...state,
        resources: disResources,
        inventory: state.inventory.filter((i) => i.id !== disItemId),
      };
    }

    case "UPGRADE_BUILDING": {
      const { buildingId, cost: bldCost, newLevel, effect } = action;
      const bldResources = { ...state.resources };
      for (const [res, amount] of Object.entries(bldCost)) {
        if ((bldResources[res] || 0) < amount) return state;
        bldResources[res] -= amount;
      }

      const newVillage = { ...(state.village || {}), [buildingId]: newLevel };

      // Apply building effects
      let newState = {
        ...state,
        resources: bldResources,
        village: newVillage,
      };

      // Storehouse increases inventory capacity
      if (effect.inventoryCapacity) {
        newState.inventoryCapacity = effect.inventoryCapacity;
      }

      const xpMult = getPrestigeMultiplier(state.prestige, "player_xp_mult");
      const xpGain = Math.round(30 * newLevel * xpMult);
      newState.player = { ...newState.player, xp: newState.player.xp + xpGain };
      newState.season = { ...newState.season, weeklyXP: newState.season.weeklyXP + xpGain };

      return newState;
    }

    case "CLAIM_DAILY_QUEST": {
      const { questId, reward: dqReward } = action;
      if (!state.dailyQuests || state.dailyQuests.claimed.includes(questId)) return state;

      const dqResources = { ...state.resources };
      if (dqReward.resources) {
        for (const [res, amount] of Object.entries(dqReward.resources)) {
          dqResources[res] = (dqResources[res] || 0) + amount;
        }
      }

      const dqXpMult = getPrestigeMultiplier(state.prestige, "player_xp_mult");
      const dqXpGain = Math.round((dqReward.xp || 0) * dqXpMult);

      return {
        ...state,
        resources: dqResources,
        dailyQuests: {
          ...state.dailyQuests,
          claimed: [...state.dailyQuests.claimed, questId],
        },
        player: { ...state.player, xp: state.player.xp + dqXpGain },
        season: {
          ...state.season,
          weeklyXP: state.season.weeklyXP + dqXpGain,
        },
      };
    }

    case "CLAIM_CHEST": {
      const { chestType, rewards: chestRewards } = action;
      const chest = state.chests?.[chestType];
      if (!chest) return state;

      const now = Date.now();
      if (now - chest.lastClaimed < chest.cooldown) return state;

      const newResources = { ...state.resources };
      if (chestRewards.resources) {
        for (const [res, amount] of Object.entries(chestRewards.resources)) {
          newResources[res] = (newResources[res] || 0) + amount;
        }
      }

      const newInventory = chestRewards.items
        ? [...state.inventory, ...chestRewards.items]
        : [...state.inventory];

      return {
        ...state,
        resources: newResources,
        inventory: newInventory,
        chests: {
          ...state.chests,
          [chestType]: { ...chest, lastClaimed: now },
        },
      };
    }

    case "SET_ACTIVE_TITLE": {
      const { heroId: titleHeroId, titleId } = action;
      return {
        ...state,
        heroes: state.heroes.map((h) =>
          h.id === titleHeroId ? { ...h, activeTitle: titleId } : h
        ),
      };
    }

    case "REST_HERO": {
      const { heroId: restHeroId, duration: restDuration } = action;
      const restHero = state.heroes.find((h) => h.id === restHeroId);
      if (!restHero || restHero.status !== "idle") return state;
      if (restHero.endurance && restHero.endurance.current >= restHero.endurance.max) return state;

      return {
        ...state,
        heroes: state.heroes.map((h) =>
          h.id === restHeroId
            ? { ...h, status: "resting", restUntil: Date.now() + restDuration }
            : h
        ),
      };
    }

    case "USE_POTION": {
      const { heroId: potHeroId, cost: potCost } = action;
      const potHero = state.heroes.find((h) => h.id === potHeroId);
      if (!potHero || potHero.status !== "idle") return state;

      const potResources = { ...state.resources };
      for (const [res, amount] of Object.entries(potCost)) {
        if ((potResources[res] || 0) < amount) return state;
        potResources[res] -= amount;
      }

      return {
        ...state,
        resources: potResources,
        heroes: state.heroes.map((h) =>
          h.id === potHeroId
            ? { ...h, endurance: { ...h.endurance, current: h.endurance?.max || 100 } }
            : h
        ),
      };
    }

    case "CLAIM_REWARDS": {
      const { expeditionId, rewards, durabilityCost, enduranceCost } = action;
      const exp = state.expeditions.completed.find(
        (e) => e.id === expeditionId
      );
      if (!exp) return state;

      // Free up heroes and drain endurance
      const newHeroes = state.heroes.map((h) => {
        if (!exp.heroIds.includes(h.id)) return h;
        const newEndurance = h.endurance
          ? { ...h.endurance, current: Math.max(0, h.endurance.current - (enduranceCost || 0)) }
          : h.endurance;
        return { ...h, status: "idle", endurance: newEndurance };
      });

      // Add resource rewards
      const newResources = { ...state.resources };
      if (rewards.resources) {
        for (const [resource, amount] of Object.entries(rewards.resources)) {
          newResources[resource] = (newResources[resource] || 0) + amount;
        }
      }

      // Degrade durability on equipped weapons of heroes who went on expedition
      let degradedInventory = [...state.inventory];
      if (durabilityCost > 0) {
        const heroesOnExp = state.heroes.filter((h) => exp.heroIds.includes(h.id));
        const equippedItemIds = new Set();
        for (const hero of heroesOnExp) {
          for (const itemId of Object.values(hero.equipment)) {
            if (itemId) equippedItemIds.add(itemId);
          }
        }
        degradedInventory = degradedInventory.map((item) => {
          if (equippedItemIds.has(item.id) && item.durability) {
            return {
              ...item,
              durability: {
                ...item.durability,
                current: Math.max(0, item.durability.current - durabilityCost),
              },
            };
          }
          return item;
        });
      }

      // Add item rewards
      const newInventory = rewards.items
        ? [...degradedInventory, ...rewards.items]
        : degradedInventory;

      const xpMult = getPrestigeMultiplier(state.prestige, "player_xp_mult");
      const xpGain = Math.round(25 * xpMult);

      return bumpDailyQuest({
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
      }, "completeExpeditions");
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
        // Preserve village buildings across rebirths
        village: state.village || {},
        inventoryCapacity: state.inventoryCapacity || 20,
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
