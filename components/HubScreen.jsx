"use client";

import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { XP_TABLE } from "@/data/progression";
import ProgressBar from "./shared/ProgressBar";
import PrestigePanel from "./PrestigePanel";
import styles from "./HubScreen.module.css";

const NAV_TILES = [
  { screen: "forge", icon: "\u{1F525}", label: "Forge", desc: "Craft weapons & gear", color: "#f97316" },
  { screen: "barracks", icon: "\u2694\uFE0F", label: "Barracks", desc: "Manage your heroes", color: "#3b82f6", unlockLevel: 3 },
  { screen: "expedition", icon: "\u{1F5FA}\uFE0F", label: "Expeditions", desc: "Send heroes on quests", color: "#22c55e", unlockLevel: 5 },
  { screen: "season", icon: "\u{1F31F}", label: "Season", desc: "Weekly events & rewards", color: "#a855f7", unlockLevel: 7 },
];

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
