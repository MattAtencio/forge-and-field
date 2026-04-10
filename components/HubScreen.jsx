"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { XP_TABLE, LEVEL_UNLOCKS } from "@/data/progression";
import { EXPEDITIONS } from "@/data/expeditions";
import { rollRarityBoosted, applyRarityMultiplier, applyLevelMultiplier, getMaxDurability, getRarityColor, getRarityLabel, rollItemLevelForChest } from "@/lib/rarity";
import { RECIPES } from "@/data/recipes";
import { RESOURCES } from "@/data/resources";
import ProgressBar from "./shared/ProgressBar";
import PrestigePanel from "./PrestigePanel";
import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./HubScreen.module.css";

const NAV_TILES = [
  { screen: "forge", icon: "forge", label: "Forge", desc: "Craft weapons & gear", color: "#f97316" },
  { screen: "barracks", icon: "barracks", label: "Barracks", desc: "Manage your heroes", color: "#3b82f6", unlockLevel: 3 },
  { screen: "expedition", icon: "map", label: "Expeditions", desc: "Send heroes on quests", color: "#22c55e", unlockLevel: 5 },
  { screen: "season", icon: "season", label: "Season", desc: "Weekly events & rewards", color: "#a855f7", unlockLevel: 7 },
  { screen: "village", icon: "village", label: "Village", desc: "Upgrade your settlement", color: "#f59e0b", unlockLevel: 8 },
];

const GOAL_ICONS = {
  forge: "forge",
  barracks: "barracks",
  expedition: "map",
  star: "season",
  dragon: "elder_dragon",
  prestige: "settings",
};

function getNextGoal(player) {
  const lv = player.level;
  const screens = player.unlockedScreens || [];
  if (lv === 1) return { icon: "forge", title: "Start Crafting", hint: "Head to the Forge and craft your first item to earn XP.", action: "forge" };
  if (lv < 3) return { icon: "season", title: "Reach Level 3", hint: "Keep crafting to unlock the Barracks and equip your heroes.", action: "forge" };
  if (lv < 5 && screens.includes("barracks")) return { icon: "barracks", title: "Gear Up Your Hero", hint: "Visit the Barracks to equip crafted items and level up Aldric.", action: "barracks" };
  if (lv < 5) return { icon: "warrior", title: "Reach Level 5", hint: "Craft & level heroes to unlock Expeditions — the real adventure begins.", action: "forge" };
  if (lv < 7 && screens.includes("expedition")) return { icon: "map", title: "Send an Expedition", hint: "Your heroes are ready! Send them on quests for rare loot and big XP.", action: "expedition" };
  if (lv < 7) return { icon: "season", title: "Unlock Seasons", hint: "Reach Level 7 to access weekly events and bonus rewards.", action: null };
  if (lv < 15) return { icon: "elder_dragon", title: "Explore the World", hint: "Defeat region bosses to unlock new lands and powerful gear.", action: "expedition" };
  return { icon: "settings", title: "Prestige Awaits", hint: "Reach Level 15 to Rebirth — reset with permanent bonuses.", action: null };
}

function getNextUnlock(playerLevel) {
  const unlockLevels = Object.keys(LEVEL_UNLOCKS).map(Number).sort((a, b) => a - b);
  for (const lv of unlockLevels) {
    if (lv > playerLevel) {
      const u = LEVEL_UNLOCKS[lv];
      const label = u.screens?.[0] || u.features?.[0] || "new content";
      const names = { barracks: "Barracks", expedition: "Expeditions", season: "Seasons", village: "Village", hero_2: "New Hero", hero_3: "Mage Hero", hero_4: "Paladin Hero", hero_equipment: "Equipment", tier3_recipes: "Tier 3 Recipes", gem_generation: "Gem Generation", season_rewards: "Season Rewards", village_buildings: "Village" };
      return { level: lv, label: names[label] || label };
    }
  }
  return null;
}

const CHEST_CONFIG = {
  uncommon: { icon: "chest_uncommon", label: "Green Chest", color: "#22c55e", minRarity: "uncommon", resources: { gold: [25, 60], iron: [10, 20], herbs: [5, 15] } },
  rare: { icon: "chest_rare", label: "Blue Chest", color: "#3b82f6", minRarity: "rare", resources: { gold: [60, 120], gems: [2, 5], iron: [15, 30] } },
  epic: { icon: "chest_epic", label: "Purple Chest", color: "#a855f7", minRarity: "epic", resources: { gold: [100, 200], gems: [5, 10], iron: [20, 40] } },
};

const RARITY_ORDER = ["common", "uncommon", "rare", "epic"];

function generateChestRewards(chestType, playerLevel) {
  const config = CHEST_CONFIG[chestType];
  const resources = {};
  for (const [res, [min, max]] of Object.entries(config.resources)) {
    resources[res] = Math.round(min + Math.random() * (max - min));
  }

  const items = [];
  const eligible = RECIPES.filter((r) => r.unlockLevel <= playerLevel);
  if (eligible.length > 0) {
    const recipe = eligible[Math.floor(Math.random() * eligible.length)];
    const minRarityIdx = RARITY_ORDER.indexOf(config.minRarity);

    // Roll rarity with a floor — re-roll if below minimum
    let rarity;
    for (let attempt = 0; attempt < 20; attempt++) {
      rarity = rollRarityBoosted(3);
      if (RARITY_ORDER.indexOf(rarity.id) >= minRarityIdx) break;
    }
    // Safety: if still below floor after retries, force the minimum
    if (RARITY_ORDER.indexOf(rarity.id) < minRarityIdx) {
      rarity = { id: config.minRarity, label: config.minRarity, color: config.color, multiplier: { uncommon: 1.3, rare: 1.7, epic: 2.5 }[config.minRarity] };
    }

    const level = rollItemLevelForChest(chestType);
    const maxDur = getMaxDurability(recipe.tier, rarity.id);
    const rarityStats = applyRarityMultiplier(recipe.baseStats, rarity);
    const finalStats = applyLevelMultiplier(rarityStats, level);

    items.push({
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      recipeId: recipe.id,
      name: recipe.name,
      icon: recipe.icon,
      slot: recipe.slot,
      tier: recipe.tier,
      rarity: rarity.id,
      level,
      durability: { current: maxDur, max: maxDur },
      stats: finalStats,
      equippedBy: null,
    });
  } else {
    // No eligible recipes — fall back to bonus resources
    for (const [res, [min, max]] of Object.entries(config.resources)) {
      resources[res] += Math.round((min + Math.random() * (max - min)) * 0.5);
    }
  }

  return { resources, items };
}

export default function HubScreen({ onOpenSettings }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const { player, expeditions, craftingQueue } = state;
  const [chestReveal, setChestReveal] = useState(null); // { type, config, rewards, phase: 'opening' | 'reveal' }

  const xpForCurrent = XP_TABLE[player.level - 1] || 0;
  const xpForNext = XP_TABLE[player.level] || XP_TABLE[XP_TABLE.length - 1];
  const xpProgress = player.xp - xpForCurrent;
  const xpNeeded = xpForNext - xpForCurrent;

  // Notifications
  const notifications = [];
  const completedExps = expeditions.completed.length;
  if (completedExps > 0) {
    notifications.push(`${completedExps} expedition${completedExps > 1 ? "s" : ""} complete!`);
  }
  const readyCrafts = craftingQueue.filter(
    (c) => Date.now() >= c.startedAt + c.duration
  ).length;
  if (readyCrafts > 0) {
    notifications.push(`${readyCrafts} item${readyCrafts > 1 ? "s" : ""} ready to collect!`);
  }

  return (
    <div className={styles.hub}>
      {/* Player Info */}
      <PixelFrame variant="parchment" className={styles.playerCard}>
        <div className={styles.playerHeader}>
          <span className={styles.playerIcon}>
            <Sprite name="hub" size={28} />
          </span>
          <div className={styles.playerInfo}>
            <h2 className={styles.playerTitle}>Commander</h2>
            <span className={styles.levelBadge}>Lv. {player.level}</span>
          </div>
          <button className={styles.settingsBtn} onClick={onOpenSettings}>
            <Sprite name="settings" size={20} />
          </button>
        </div>
        <ProgressBar
          value={xpProgress}
          max={xpNeeded}
          color="#f97316"
          label="XP"
        />
      </PixelFrame>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className={styles.notifications}>
          {notifications.map((msg, i) => (
            <div key={i} className={styles.notification}>
              <span className={styles.notifDot} />
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Active Expeditions Banner */}
      {expeditions.active.length > 0 && (
        <div className={styles.expeditionBanner}>
          <div className={styles.bannerHeader}>
            <span className={styles.bannerIcon}>
              <Sprite name="map" size={18} />
            </span>
            <span className={styles.bannerTitle}>Active Expeditions</span>
            {player.unlockedScreens.includes("expedition") && (
              <button
                className={styles.bannerViewBtn}
                onClick={() => dispatch({ type: "SET_SCREEN", screen: "expedition" })}
              >
                View
              </button>
            )}
          </div>
          {expeditions.active.map((exp) => {
            const template = EXPEDITIONS.find((e) => e.id === exp.templateId);
            const now = Date.now();
            const remaining = Math.max(0, (exp.startedAt + exp.duration) - now);
            const pct = Math.min(((now - exp.startedAt) / exp.duration) * 100, 100);
            const sec = Math.ceil(remaining / 1000);
            const min = Math.floor(sec / 60);
            const timeLabel = min > 0 ? `${min}m ${sec % 60}s` : `${sec}s`;

            return (
              <div key={exp.id} className={styles.expCard}>
                <div className={styles.expInfo}>
                  <span className={styles.expIcon}>
                    <Sprite name={template?.icon || "map"} size={18} />
                  </span>
                  <span className={styles.expName}>{template?.name || "Unknown"}</span>
                  <span className={styles.expTime}>{remaining > 0 ? timeLabel : "Done!"}</span>
                </div>
                <div className={styles.expBar}>
                  <div
                    className={styles.expFill}
                    style={{ width: `${pct}%`, background: remaining <= 0 ? "#22c55e" : "#f59e0b" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next Goal */}
      {(() => {
        const goal = getNextGoal(player);
        const nextUnlock = getNextUnlock(player.level);
        return (
          <PixelFrame variant="parchment" className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <span className={styles.goalIcon}>
                <Sprite name={goal.icon} size={24} />
              </span>
              <div className={styles.goalText}>
                <h3 className={styles.goalTitle}>{goal.title}</h3>
                <p className={styles.goalHint}>{goal.hint}</p>
              </div>
              {goal.action && player.unlockedScreens.includes(goal.action) && (
                <button
                  className={styles.goalAction}
                  onClick={() => dispatch({ type: "SET_SCREEN", screen: goal.action })}
                >
                  Go
                </button>
              )}
            </div>
            {nextUnlock && (
              <div className={styles.goalUnlock}>
                <ProgressBar value={xpProgress} max={xpNeeded} color="#f97316" />
                <span className={styles.goalUnlockLabel}>
                  Lv.{nextUnlock.level} unlocks {nextUnlock.label}
                </span>
              </div>
            )}
          </PixelFrame>
        );
      })()}

      {/* Loot Chests */}
      {state.chests && (
        <PixelFrame variant="iron" className={styles.chestsSection}>
          <h3 className={styles.sectionTitle}>Loot Chests</h3>
          <div className={styles.chestList}>
            {Object.entries(state.chests).map(([type, chest]) => {
              const config = CHEST_CONFIG[type];
              const now = Date.now();
              const remaining = Math.max(0, chest.cooldown - (now - chest.lastClaimed));
              const ready = remaining <= 0;
              const hrs = Math.floor(remaining / 3600000);
              const mins = Math.floor((remaining % 3600000) / 60000);
              const timeLabel = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

              return (
                <button
                  key={type}
                  className={`${styles.chestCard} ${ready ? styles.chestReady : ""}`}
                  style={{ "--chest-color": config.color, "--pulse-duration": type === "epic" ? "1.2s" : type === "rare" ? "1.6s" : "2s" }}
                  disabled={!ready}
                  onClick={() => {
                    if (!ready) return;
                    const rewards = generateChestRewards(type, player.level);
                    setChestReveal({ type, config, rewards, phase: "opening" });
                    setTimeout(() => {
                      setChestReveal((prev) => prev ? { ...prev, phase: "reveal" } : null);
                    }, 800);
                    dispatch({ type: "CLAIM_CHEST", chestType: type, rewards });
                  }}
                >
                  <span className={styles.chestIcon}>
                    <Sprite name={config.icon} size={28} animate={ready ? "pulse" : ""} />
                  </span>
                  <div className={styles.chestInfo}>
                    <span className={styles.chestLabel}>{config.label}</span>
                    <span className={styles.chestTimer} style={{ color: ready ? "#22c55e" : "#8888a0" }}>
                      {ready ? "Ready!" : timeLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </PixelFrame>
      )}

      {/* Nav Tiles */}
      <div className={styles.grid}>
        {NAV_TILES.map((tile) => {
          const locked = !player.unlockedScreens.includes(tile.screen);
          return (
            <button
              key={tile.screen}
              className={`${styles.tile} ${locked ? styles.tileLocked : ""}`}
              style={{
                "--tile-color": tile.color,
                "--tile-glow": locked ? "transparent" : tile.color,
              }}
              onClick={() => {
                if (!locked) dispatch({ type: "SET_SCREEN", screen: tile.screen });
              }}
              disabled={locked}
            >
              <span className={styles.tileIcon}>
                <Sprite
                  name={locked ? "lock" : tile.icon}
                  size={28}
                  muted={locked}
                />
              </span>
              <span className={styles.tileLabel}>
                {locked ? `Unlock Lv.${tile.unlockLevel}` : tile.label}
              </span>
              {!locked && (
                <span className={styles.tileDesc}>{tile.desc}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Prestige */}
      <PrestigePanel />

      {/* Hero Summary */}
      <PixelFrame variant="parchment" className={styles.heroSummary}>
        <h3 className={styles.sectionTitle}>Heroes</h3>
        <div className={styles.heroList}>
          {state.heroes.map((hero) => (
            <button
              key={hero.id}
              className={styles.heroChip}
              onClick={() => dispatch({ type: "SET_SCREEN", screen: "barracks", payload: { heroId: hero.id } })}
            >
              <span className={styles.heroStatus}>
                <Sprite name={hero.templateId} size={18} />
              </span>
              <span>{hero.name}</span>
              <span className={styles.heroLevel}>Lv.{hero.level}</span>
            </button>
          ))}
        </div>
      </PixelFrame>
      {/* Chest Reveal Modal */}
      {chestReveal && (
        <Modal title={chestReveal.config.label} onClose={() => setChestReveal(null)}>
          <div className={styles.chestReveal}>
            <div className={`${styles.chestRevealIcon} ${chestReveal.phase === "opening" ? styles.chestOpening : styles.chestOpened}`}>
              <Sprite name={chestReveal.config.icon} size={64} />
            </div>
            {chestReveal.phase === "reveal" && (
              <div className={styles.chestContents}>
                {Object.entries(chestReveal.rewards.resources).map(([res, amount]) =>
                  amount > 0 ? (
                    <div key={res} className={styles.chestRewardChip}>
                      <Sprite name={RESOURCES[res]?.icon || res} size={20} />
                      <span className={styles.chestRewardAmount}>+{amount}</span>
                      <span className={styles.chestRewardName}>{RESOURCES[res]?.name || res}</span>
                    </div>
                  ) : null
                )}
                {chestReveal.rewards.items.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.chestItemReveal} ${styles.chestItemFlash}`}
                    style={{ borderColor: getRarityColor(item.rarity), "--item-rarity-color": getRarityColor(item.rarity) }}
                  >
                    <Sprite name={item.icon} size={24} />
                    <div className={styles.chestItemInfo}>
                      <span style={{ color: getRarityColor(item.rarity) }}>{item.name}</span>
                      <span className={styles.chestItemRarity}>{getRarityLabel(item.rarity)}</span>
                    </div>
                    {item.level > 1 && (
                      <span className={styles.chestItemLevel} style={{ background: getRarityColor(item.rarity) }}>
                        Lv.{item.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button className={styles.chestCollectBtn} onClick={() => setChestReveal(null)}>
              {chestReveal.phase === "opening" ? "Opening..." : "Collect"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
