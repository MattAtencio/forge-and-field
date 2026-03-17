"use client";

import { getRarityColor, getRarityLabel } from "@/lib/rarity";
import styles from "./ItemCard.module.css";

export default function ItemCard({ item, onClick, compact = false }) {
  const rarityColor = getRarityColor(item.rarity);

  if (compact) {
    return (
      <button
        className={styles.compact}
        style={{ borderColor: rarityColor }}
        onClick={onClick}
      >
        <span className={styles.compactIcon}>{item.icon}</span>
      </button>
    );
  }

  return (
    <button
      className={styles.card}
      style={{ borderColor: rarityColor, "--rarity-color": rarityColor }}
      onClick={onClick}
    >
      <div className={styles.iconWrap}>
        <span className={styles.icon}>{item.icon}</span>
      </div>
      <div className={styles.info}>
        <span className={styles.name} style={{ color: rarityColor }}>
          {item.name}
        </span>
        <span className={styles.rarity}>{getRarityLabel(item.rarity)}</span>
        <div className={styles.stats}>
          {item.stats.atk > 0 && <span className={styles.stat}>ATK {item.stats.atk}</span>}
          {item.stats.def > 0 && <span className={styles.stat}>DEF {item.stats.def}</span>}
          {item.stats.spd !== 0 && <span className={styles.stat}>SPD {item.stats.spd > 0 ? "+" : ""}{item.stats.spd}</span>}
        </div>
      </div>
      {item.equippedBy && <span className={styles.equipped}>E</span>}
    </button>
  );
}
