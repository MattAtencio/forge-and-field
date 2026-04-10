"use client";

import { RESOURCES } from "@/data/resources";
import { RECIPES } from "@/data/recipes";
import Sprite from "@/components/sprites/Sprite";
import styles from "./WelcomeBackModal.module.css";

function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getReadyChests(chests) {
  if (!chests) return [];
  const now = Date.now();
  const ready = [];
  for (const [type, chest] of Object.entries(chests)) {
    if (now - chest.lastClaimed >= chest.cooldown) {
      ready.push(type);
    }
  }
  return ready;
}

function getCompletedCrafts(craftingQueue) {
  if (!craftingQueue) return [];
  const now = Date.now();
  return craftingQueue.filter((c) => now >= c.startedAt + c.duration);
}

function isDailyQuestReset(dailyQuests) {
  if (!dailyQuests) return false;
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const nowDay = fmt.format(new Date());
  const lastDay = fmt.format(new Date(dailyQuests.lastReset));
  return nowDay !== lastDay;
}

function getRecommendedAction(state, readyChests, completedCrafts) {
  if (readyChests.length > 0) return "Chests await your hand.";

  const emptyCraftSlots =
    (state.maxCraftSlots || 2) - (state.craftingQueue?.length || 0);
  if (emptyCraftSlots > 0 && completedCrafts.length === 0) return "The anvil is cold.";

  const idleHeroes = state.heroes?.filter((h) => h.status === "idle") || [];
  if (idleHeroes.length > 0) return "Idle hands in the Barracks.";

  return "Welcome back, Forgemaster.";
}

const CHEST_LABELS = {
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
};

const CHEST_SPRITES = {
  uncommon: "chest_uncommon",
  rare: "chest_rare",
  epic: "chest_epic",
};

export default function WelcomeBackModal({ offlineData, state, onDismiss }) {
  if (!offlineData) return null;

  const { elapsed, capped, gained } = offlineData;
  const gainedEntries = Object.entries(gained).filter(([, amt]) => amt > 0);

  // Find the largest resource gain for highlighting
  let largestRes = null;
  let largestAmt = 0;
  for (const [res, amt] of gainedEntries) {
    if (amt > largestAmt) {
      largestRes = res;
      largestAmt = amt;
    }
  }

  // Derive sections from state
  const completedExpeditions = state?.expeditions?.completed || [];
  const completedCrafts = getCompletedCrafts(state?.craftingQueue);
  const readyChests = getReadyChests(state?.chests);
  const dailyReset = isDailyQuestReset(state?.dailyQuests);
  const recommendation = getRecommendedAction(state || {}, readyChests, completedCrafts);

  // Resolve craft names from recipes
  const craftNames = completedCrafts.map((c) => {
    const recipe = RECIPES.find((r) => r.id === c.recipeId);
    return recipe ? recipe.name : "Unknown Item";
  });

  const hasSections =
    gainedEntries.length > 0 ||
    completedExpeditions.length > 0 ||
    completedCrafts.length > 0 ||
    readyChests.length > 0 ||
    dailyReset;

  return (
    <div className={styles.overlay} onClick={onDismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerIcon}>
            <Sprite name="forge" size={40} />
          </span>
          <h2 className={styles.title}>Welcome Back!</h2>
        </div>

        {/* Time Away */}
        <div className={styles.timeCard}>
          <span className={styles.timeLabel}>Time away</span>
          <span className={styles.timeValue}>
            {formatTime(elapsed)}
            {capped && <span className={styles.timeCap}> (max 8h)</span>}
          </span>
        </div>

        {/* Scrollable sections */}
        {hasSections && (
          <div className={styles.sections}>
            {/* Resources Earned */}
            {gainedEntries.length > 0 && (
              <div className={styles.section}>
                <p className={styles.sectionLabel}>Resources Gathered</p>
                <div className={styles.resourceGrid}>
                  {gainedEntries.map(([res, amt]) => (
                    <div
                      key={res}
                      className={`${styles.resourceItem} ${res === largestRes ? styles.resourceHighlight : ""}`}
                    >
                      <Sprite name={RESOURCES[res]?.icon || res} size={20} />
                      <span className={styles.resourceName}>
                        {RESOURCES[res]?.name || res}
                      </span>
                      <span
                        className={styles.resourceAmt}
                        style={{ color: RESOURCES[res]?.color }}
                      >
                        +{Math.floor(amt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expeditions Completed */}
            {completedExpeditions.length > 0 && (
              <div className={styles.section}>
                <p className={styles.sectionLabel}>Expeditions Completed</p>
                <div className={styles.infoCard}>
                  <Sprite name="expedition" size={22} />
                  <span className={styles.infoText}>
                    {completedExpeditions.length}{" "}
                    {completedExpeditions.length === 1 ? "expedition" : "expeditions"}{" "}
                    finished — rewards await!
                  </span>
                </div>
              </div>
            )}

            {/* Crafts Completed */}
            {completedCrafts.length > 0 && (
              <div className={styles.section}>
                <p className={styles.sectionLabel}>Crafts Completed</p>
                <div className={styles.infoCard}>
                  <Sprite name="forge" size={22} />
                  <div className={styles.craftList}>
                    {craftNames.map((name, i) => (
                      <span key={i} className={styles.craftName}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chests Ready */}
            {readyChests.length > 0 && (
              <div className={styles.section}>
                <p className={styles.sectionLabel}>Chests Ready</p>
                <div className={styles.chestRow}>
                  {readyChests.map((type) => (
                    <div key={type} className={styles.chestItem}>
                      <Sprite name={CHEST_SPRITES[type] || "chest_uncommon"} size={28} />
                      <span className={styles.chestLabel}>
                        {CHEST_LABELS[type] || type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Quests Reset */}
            {dailyReset && (
              <div className={styles.section}>
                <div className={styles.dailyReset}>
                  <Sprite name="season" size={20} />
                  <span className={styles.dailyText}>
                    Daily quests have reset!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actionable Prompt */}
        <p className={styles.recommendation}>{recommendation}</p>

        {/* CTA */}
        <button className={styles.btn} onClick={onDismiss}>
          Continue
        </button>
      </div>
    </div>
  );
}
