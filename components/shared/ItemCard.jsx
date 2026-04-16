"use client";

import { getRarityColor, getRarityLabel } from "@/lib/rarity";
import Sprite from "@/components/sprites/Sprite";
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
        <span className={styles.compactIcon}>
          <Sprite name={item.icon} size={24} />
        </span>
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
        <Sprite name={item.icon} size={28} />
      </div>
      <div className={styles.info}>
        <span className={styles.name} style={{ color: rarityColor }}>
          {item.name}{(item.level || 1) > 1 ? ` Lv.${item.level}` : ""}
        </span>
        <span className={styles.rarity}>{item.rarity ? getRarityLabel(item.rarity) : item.slot === "consumable" ? `×${item.count || 1}` : ""}</span>
        <div className={styles.stats}>
          {item.stats ? (
            <>
              {item.stats.atk > 0 && <span className={styles.stat}>ATK {item.stats.atk}</span>}
              {item.stats.def > 0 && <span className={styles.stat}>DEF {item.stats.def}</span>}
              {item.stats.spd !== 0 && <span className={styles.stat}>SPD {item.stats.spd > 0 ? "+" : ""}{item.stats.spd}</span>}
            </>
          ) : item.effect ? (
            <span className={styles.stat}>{item.description}</span>
          ) : null}
        </div>
      </div>
      {item.equippedBy && <span className={styles.equipped}>E</span>}
      {item.durability && (
        <div className={styles.durabilityBar}>
          <div
            className={styles.durabilityFill}
            style={{
              width: `${(item.durability.current / item.durability.max) * 100}%`,
              background: item.durability.current <= 0
                ? "#ef4444"
                : item.durability.current < item.durability.max * 0.3
                ? "#f59e0b"
                : "#22c55e",
            }}
          />
        </div>
      )}
    </button>
  );
}
