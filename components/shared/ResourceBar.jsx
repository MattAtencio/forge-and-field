"use client";

import { useState, useEffect, useRef } from "react";
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
  const [mounted, setMounted] = useState(false);
  const [flashKey, setFlashKey] = useState(null);
  const prevResources = useRef({});
  const flashTimer = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const prev = prevResources.current;
    for (const { key } of RESOURCE_CONFIG) {
      const oldVal = Math.floor(prev[key] || 0);
      const newVal = Math.floor(state.resources[key] || 0);
      if (newVal > oldVal && oldVal > 0) {
        setFlashKey(key);
        clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => setFlashKey(null), 450);
        break;
      }
    }
    prevResources.current = { ...state.resources };
  }, [state.resources, mounted]);

  return (
    <div className={styles.bar}>
      {RESOURCE_CONFIG.map(({ key, color }) => (
        <div key={key} className={styles.resource}>
          <Sprite name={key} size={14} />
          <span
            className={`${styles.amount} ${flashKey === key ? styles.goldFlash : ""}`}
            style={{ color }}
            suppressHydrationWarning
          >
            {mounted ? Math.floor(state.resources[key]) : 0}
          </span>
        </div>
      ))}
    </div>
  );
}
