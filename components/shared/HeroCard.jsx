"use client";

import { getHeroPower } from "@/lib/hero";
import styles from "./HeroCard.module.css";

export default function HeroCard({ hero, inventory, onClick, selected = false }) {
  const power = getHeroPower(hero, inventory);
  const statusColors = {
    idle: "#22c55e",
    expedition: "#f59e0b",
    resting: "#6b7280",
  };

  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <span className={styles.icon}>
          {hero.status === "expedition" ? "\u{1F6B6}" : "\u{1F9D1}\u200D\u2694\uFE0F"}
        </span>
        <div>
          <span className={styles.name}>{hero.name}</span>
          <span className={styles.title}>{hero.title}</span>
        </div>
        <span className={styles.level}>Lv.{hero.level}</span>
      </div>

      <div className={styles.statsRow}>
        <span className={styles.stat}>{"\u2764\uFE0F"} {hero.stats.hp}</span>
        <span className={styles.stat}>{"\u2694\uFE0F"} {hero.stats.atk}</span>
        <span className={styles.stat}>{"\u{1F6E1}\uFE0F"} {hero.stats.def}</span>
        <span className={styles.stat}>{"\u{1F4A8}"} {hero.stats.spd}</span>
      </div>

      <div className={styles.footer}>
        <span className={styles.power}>Power: {power}</span>
        <span className={styles.status} style={{ color: statusColors[hero.status] }}>
          {hero.status}
        </span>
      </div>
    </button>
  );
}
