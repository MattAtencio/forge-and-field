"use client";

import { useGameState, useGameDispatch } from "@/lib/gameContext";
import styles from "./NavBar.module.css";

const TABS = [
  { key: "hub", label: "Hub", icon: "\u{1F3E0}", unlockLevel: 1 },
  { key: "forge", label: "Forge", icon: "\u{1F525}", unlockLevel: 1 },
  { key: "barracks", label: "Barracks", icon: "\u2694\uFE0F", unlockLevel: 3 },
  { key: "expedition", label: "Explore", icon: "\u{1F5FA}\uFE0F", unlockLevel: 5 },
  { key: "season", label: "Season", icon: "\u{1F31F}", unlockLevel: 7 },
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
              {locked ? "\u{1F512}" : tab.icon}
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
