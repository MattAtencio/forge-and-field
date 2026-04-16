"use client";

import { getHeroPower } from "@/lib/hero";
import Sprite from "@/components/sprites/Sprite";
import styles from "./HeroCard.module.css";

const STATUS_SPRITE = {
  idle: "idle",
  expedition: "expedition",
  resting: "resting",
  exploring: "exploring",
};

export default function HeroCard({ hero, inventory, onClick, selected = false }) {
  const power = getHeroPower(hero, inventory);
  const statusColors = {
    idle: "#22c55e",
    expedition: "#f59e0b",
    resting: "#6b7280",
    exploring: "#a855f7",
  };

  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <span className={styles.icon}>
          <Sprite
            name={hero.templateId}
            size={28}
            animate={hero.status === "idle" ? "float" : ""}
          />
        </span>
        <div>
          <span className={styles.name}>{hero.name}</span>
          <span className={styles.title}>{hero.title}</span>
        </div>
        <span className={styles.level}>Lv.{hero.level}</span>
      </div>

      <div className={styles.statsRow}>
        <span className={styles.stat}><Sprite name="heart" size={11} /> {hero.stats.hp}</span>
        <span className={styles.stat}><Sprite name="attack" size={11} /> {hero.stats.atk}</span>
        <span className={styles.stat}><Sprite name="defense" size={11} /> {hero.stats.def}</span>
        <span className={styles.stat}><Sprite name="speed" size={11} /> {hero.stats.spd}</span>
      </div>

      {hero.endurance && (
        <div className={styles.enduranceBar}>
          <div
            className={styles.enduranceFill}
            style={{
              width: `${(hero.endurance.current / hero.endurance.max) * 100}%`,
              background: hero.endurance.current <= hero.endurance.max * 0.2
                ? "#ef4444"
                : hero.endurance.current <= hero.endurance.max * 0.5
                ? "#f59e0b"
                : "#22c55e",
            }}
          />
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.power}>Power: {power}</span>
        <span className={styles.status} style={{ color: statusColors[hero.status] }}>
          {hero.status}
        </span>
      </div>
    </button>
  );
}
