"use client";

import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { XP_TABLE, LEVEL_UNLOCKS } from "@/data/progression";
import ProgressBar from "./shared/ProgressBar";
import PrestigePanel from "./PrestigePanel";
import styles from "./HubScreen.module.css";

const NAV_TILES = [
  { screen: "forge", icon: "\u{1F525}", label: "Forge", desc: "Craft weapons & gear", color: "#f97316" },
  { screen: "barracks", icon: "\u2694\uFE0F", label: "Barracks", desc: "Manage your heroes", color: "#3b82f6", unlockLevel: 3 },
  { screen: "expedition", icon: "\u{1F5FA}\uFE0F", label: "Expeditions", desc: "Send heroes on quests", color: "#22c55e", unlockLevel: 5 },
  { screen: "season", icon: "\u{1F31F}", label: "Season", desc: "Weekly events & rewards", color: "#a855f7", unlockLevel: 7 },
];

function getNextGoal(player) {
  const lv = player.level;
  const screens = player.unlockedScreens || [];
  if (lv === 1) return { icon: "\u{1F528}", title: "Start Crafting", hint: "Head to the Forge and craft your first item to earn XP.", action: "forge" };
  if (lv < 3) return { icon: "\u2B50", title: "Reach Level 3", hint: "Keep crafting to unlock the Barracks and equip your heroes.", action: "forge" };
  if (lv < 5 && screens.includes("barracks")) return { icon: "\u2694\uFE0F", title: "Gear Up Your Hero", hint: "Visit the Barracks to equip crafted items and level up Aldric.", action: "barracks" };
  if (lv < 5) return { icon: "\u{1F4AA}", title: "Reach Level 5", hint: "Craft & level heroes to unlock Expeditions \u2014 the real adventure begins.", action: "forge" };
  if (lv < 7 && screens.includes("expedition")) return { icon: "\u{1F5FA}\uFE0F", title: "Send an Expedition", hint: "Your heroes are ready! Send them on quests for rare loot and big XP.", action: "expedition" };
  if (lv < 7) return { icon: "\u{1F31F}", title: "Unlock Seasons", hint: "Reach Level 7 to access weekly events and bonus rewards.", action: null };
  if (lv < 15) return { icon: "\u{1F409}", title: "Explore the World", hint: "Defeat region bosses to unlock new lands and powerful gear.", action: "expedition" };
  return { icon: "\u{1F504}", title: "Prestige Awaits", hint: "Reach Level 15 to Rebirth \u2014 reset with permanent bonuses.", action: null };
}

function getNextUnlock(playerLevel) {
  const unlockLevels = Object.keys(LEVEL_UNLOCKS).map(Number).sort((a, b) => a - b);
  for (const lv of unlockLevels) {
    if (lv > playerLevel) {
      const u = LEVEL_UNLOCKS[lv];
      const label = u.screens?.[0] || u.features?.[0] || "new content";
      const names = { barracks: "Barracks", expedition: "Expeditions", season: "Seasons", hero_2: "New Hero", hero_3: "Mage Hero", hero_4: "Paladin Hero", hero_equipment: "Equipment", tier3_recipes: "Tier 3 Recipes", gem_generation: "Gem Generation", season_rewards: "Season Rewards" };
      return { level: lv, label: names[label] || label };
    }
  }
  return null;
}

export default function HubScreen({ onOpenSettings }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const { player, expeditions, craftingQueue } = state;

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
      <div className={styles.playerCard}>
        <div className={styles.playerHeader}>
          <span className={styles.playerIcon}>{"\u{1F6E1}\uFE0F"}</span>
          <div className={styles.playerInfo}>
            <h2 className={styles.playerTitle}>Commander</h2>
            <span className={styles.levelBadge}>Lv. {player.level}</span>
          </div>
          <button className={styles.settingsBtn} onClick={onOpenSettings}>
            {"\u2699\uFE0F"}
          </button>
        </div>
        <ProgressBar
          value={xpProgress}
          max={xpNeeded}
          color="#f97316"
          label="XP"
        />
      </div>

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

      {/* Next Goal */}
      {(() => {
        const goal = getNextGoal(player);
        const nextUnlock = getNextUnlock(player.level);
        return (
          <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
              <span className={styles.goalIcon}>{goal.icon}</span>
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
          </div>
        );
      })()}

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
                {locked ? "\u{1F512}" : tile.icon}
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
      <div className={styles.heroSummary}>
        <h3 className={styles.sectionTitle}>Heroes</h3>
        <div className={styles.heroList}>
          {state.heroes.map((hero) => (
            <div key={hero.id} className={styles.heroChip}>
              <span className={styles.heroStatus}>
                {hero.status === "expedition" ? "\u{1F6B6}" : "\u{1F9D1}\u200D\u2694\uFE0F"}
              </span>
              <span>{hero.name}</span>
              <span className={styles.heroLevel}>Lv.{hero.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
