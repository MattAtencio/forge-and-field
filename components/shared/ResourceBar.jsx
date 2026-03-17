"use client";

import { useGameState } from "@/lib/gameContext";
import styles from "./ResourceBar.module.css";

const RESOURCE_CONFIG = [
  { key: "wood", icon: "\u{1FAB5}", color: "#8B4513" },
  { key: "stone", icon: "\u{1FAA8}", color: "#808080" },
  { key: "iron", icon: "\u26CF\uFE0F", color: "#B0C4DE" },
  { key: "herbs", icon: "\u{1F33F}", color: "#228B22" },
  { key: "gems", icon: "\u{1F48E}", color: "#9B59B6" },
  { key: "gold", icon: "\u{1FA99}", color: "#FFD700" },
];

export default function ResourceBar() {
  const state = useGameState();

  return (
    <div className={styles.bar}>
      {RESOURCE_CONFIG.map(({ key, icon, color }) => (
        <div key={key} className={styles.resource}>
          <span className={styles.icon}>{icon}</span>
          <span className={styles.amount} style={{ color }}>
            {Math.floor(state.resources[key])}
          </span>
        </div>
      ))}
    </div>
  );
}
