"use client";

import { useGameState, useGameDispatch } from "@/lib/gameContext";
import Sprite from "@/components/sprites/Sprite";
import styles from "./NavBar.module.css";

const TABS = [
  { key: "hub", label: "Hub", icon: "hub", unlockLevel: 1 },
  { key: "forge", label: "Forge", icon: "forge", unlockLevel: 1 },
  { key: "barracks", label: "Barracks", icon: "barracks", unlockLevel: 3 },
  { key: "expedition", label: "Explore", icon: "map", unlockLevel: 5 },
  { key: "season", label: "Season", icon: "season", unlockLevel: 7 },
  { key: "village", label: "Village", icon: "village", unlockLevel: 8 },
];

export default function NavBar() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const handleTab = (tab) => {
    if (state.player.unlockedScreens.includes(tab.key)) {
      dispatch({ type: "SET_SCREEN", screen: tab.key });
    }
  };

  // Count notifications
  const completedCrafts = state.craftingQueue.filter(
    (c) => Date.now() >= c.startedAt + c.duration
  ).length;
  const completedExpeditions = state.expeditions.completed.length;

  const getBadge = (key) => {
    if (key === "forge" && completedCrafts > 0) return completedCrafts;
    if (key === "expedition" && completedExpeditions > 0) return completedExpeditions;
    return 0;
  };

  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => {
        const locked = !state.player.unlockedScreens.includes(tab.key);
        const active = state.currentScreen === tab.key;
        const badge = getBadge(tab.key);

        return (
          <button
            key={tab.key}
            className={`${styles.tab} ${active ? styles.active : ""} ${locked ? styles.locked : ""}`}
            onClick={() => handleTab(tab)}
            disabled={locked}
          >
            <span className={styles.tabIcon}>
              <Sprite
                name={locked ? "lock" : tab.icon}
                size={20}
                muted={locked}
              />
            </span>
            <span className={styles.tabLabel}>
              {locked ? `Lv.${tab.unlockLevel}` : tab.label}
            </span>
            {badge > 0 && <span className={styles.badge}>{badge}</span>}
          </button>
        );
      })}
    </nav>
  );
}
