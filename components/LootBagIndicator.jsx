"use client";

import { getLootBagSummary } from "@/lib/exploration";
import Sprite from "@/components/sprites/Sprite";
import styles from "./LootBagIndicator.module.css";

export default function LootBagIndicator({ lootBag, onClick }) {
  const summary = getLootBagSummary(lootBag);

  return (
    <button
      className={`${styles.indicator} ${!summary.isEmpty ? styles.hasLoot : ""}`}
      onClick={onClick}
    >
      <Sprite name="chest" size={18} />
      <span className={styles.count}>
        {summary.isEmpty
          ? "Empty"
          : `${summary.resourceCount}${summary.itemCount > 0 ? ` +${summary.itemCount}` : ""}`}
      </span>
    </button>
  );
}
