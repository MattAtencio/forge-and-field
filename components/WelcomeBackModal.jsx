"use client";

import { Fragment } from "react";
import { RESOURCES } from "@/data/resources";
import { RECIPES } from "@/data/recipes";
import { getRegionById } from "@/data/regions";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
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

// Chip wrapper: icon on the left, count + subtitle stacked on the right
function Chip({ iconName, iconSize = 32, count, subtitle, emberCount = false, children }) {
  return (
    <div className={styles.sectionChip}>
      <span className={styles.chipIcon}>
        <Sprite name={iconName} size={iconSize} />
      </span>
      <div className={styles.chipMain}>
        <span
          className={`${styles.chipCount} ${emberCount ? styles.chipCountEmber : ""}`}
        >
          {count}
        </span>
        {subtitle && <span className={styles.chipSubtitle}>{subtitle}</span>}
        {children}
      </div>
    </div>
  );
}

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

  // Explore notice is its own chip below
  const exploreActive = Boolean(state?.exploration?.active);

  // Build an ordered list of chips to render; we insert ember dividers between them
  const chips = [];

  if (gainedEntries.length > 0) {
    const totalGained = gainedEntries.reduce((sum, [, amt]) => sum + Math.floor(amt), 0);
    chips.push({
      key: "resources",
      render: () => (
        <Chip
          iconName={RESOURCES[largestRes]?.icon || largestRes || "gold"}
          count={`+${totalGained.toLocaleString()} gathered`}
          emberCount
          subtitle={null}
        >
          <div className={styles.resourceInline}>
            {gainedEntries.map(([res, amt]) => (
              <span
                key={res}
                className={`${styles.resourceInlineItem} ${res === largestRes ? styles.resourceInlineHighlight : ""}`}
              >
                <Sprite name={RESOURCES[res]?.icon || res} size={14} />
                <span className={styles.resourceInlineAmt}>
                  +{Math.floor(amt).toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        </Chip>
      ),
    });
  }

  if (completedExpeditions.length > 0) {
    const n = completedExpeditions.length;
    chips.push({
      key: "expeditions",
      render: () => (
        <Chip
          iconName="expedition"
          count={`${n} expedition${n === 1 ? "" : "s"} complete`}
          subtitle="Rewards await collection."
        />
      ),
    });
  }

  if (completedCrafts.length > 0) {
    const n = completedCrafts.length;
    const subtitle =
      craftNames.slice(0, 3).join(", ") + (craftNames.length > 3 ? "…" : "");
    chips.push({
      key: "crafts",
      render: () => (
        <Chip
          iconName="forge"
          count={`${n} craft${n === 1 ? "" : "s"} done`}
          subtitle={subtitle}
        />
      ),
    });
  }

  if (readyChests.length > 0) {
    // Use the highest-tier chest icon available for the chip's lead sprite
    const tierOrder = ["epic", "rare", "uncommon"];
    const topTier = tierOrder.find((t) => readyChests.includes(t)) || readyChests[0];
    const subtitle = readyChests
      .map((t) => CHEST_LABELS[t] || t)
      .join(" · ");
    chips.push({
      key: "chests",
      render: () => (
        <Chip
          iconName={`chest_${topTier}`}
          count={`${readyChests.length} chest${readyChests.length === 1 ? "" : "s"} ready`}
          emberCount
          subtitle={subtitle}
        />
      ),
    });
  }

  if (dailyReset) {
    chips.push({
      key: "daily",
      render: () => (
        <Chip
          iconName="season"
          count="Daily quests reset"
          subtitle="A fresh set of tasks awaits."
        />
      ),
    });
  }

  if (exploreActive) {
    const regionName =
      getRegionById(state.exploration.regionId)?.name || "unknown lands";
    chips.push({
      key: "explore",
      render: () => (
        <Chip
          iconName="map"
          count="Exploration paused"
          subtitle={`Your hero waits in ${regionName}.`}
        />
      ),
    });
  }

  const hasSections = chips.length > 0;

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

        {/* Parchment body — wraps chips + recommendation */}
        <PixelFrame variant="parchment" className={styles.bodyFrame}>
          {hasSections && (
            <div className={styles.sections}>
              {chips.map((chip, i) => (
                <Fragment key={chip.key}>
                  {i > 0 && <div className={styles.emberDivider} aria-hidden="true" />}
                  {chip.render()}
                </Fragment>
              ))}
            </div>
          )}

          {hasSections && (
            <div className={styles.emberDivider} aria-hidden="true" />
          )}

          {/* Actionable Prompt — the visual anchor */}
          <p className={styles.recommendation}>{recommendation}</p>
        </PixelFrame>

        {/* CTA */}
        <button className={styles.btn} onClick={onDismiss}>
          Continue
        </button>
      </div>
    </div>
  );
}
