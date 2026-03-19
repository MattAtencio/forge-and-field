"use client";

import { useGameState } from "@/lib/gameContext";
import Sprite from "@/components/sprites/Sprite";
import styles from "./ResourceBar.module.css";

const RESOURCE_CONFIG = [
  { key: "wood", color: "#a16207" },
  { key: "stone", color: "#9ca3af" },
  { key: "iron", color: "#94a3b8" },
  { key: "herbs", color: "#22c55e" },
  { key: "gems", color: "#a855f7" },
  { key: "gold", color: "#fbbf24" },
];

export default function ResourceBar() {
  const state = useGameState();

  return (
    <div className={styles.bar}>
      {RESOURCE_CONFIG.map(({ key, color }) => (
        <div key={key} className={styles.resource}>
          <Sprite name={key} size={14} />
          <span className={styles.amount} style={{ color }}>
            {Math.floor(state.resources[key])}
          </span>
        </div>
      ))}
    </div>
  );
}
