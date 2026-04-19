"use client";

import { useEffect, useRef, useState } from "react";
import { getLootBagSummary } from "@/lib/exploration";
import Sprite from "@/components/sprites/Sprite";
import styles from "./LootBagIndicator.module.css";

function tierFor(total) {
  if (total <= 0) return "empty";
  if (total <= 5) return "light";
  if (total <= 15) return "full";
  return "heavy";
}

export default function LootBagIndicator({ lootBag, onClick }) {
  const summary = getLootBagSummary(lootBag);
  const total = summary.resourceCount + summary.itemCount;
  const tier = tierFor(total);

  const prevTotalRef = useRef(total);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (total > prevTotalRef.current) {
      // Re-keyed class toggle restarts the CSS animation even on rapid gains.
      setPulseKey((k) => k + 1);
    }
    prevTotalRef.current = total;
  }, [total]);

  const classes = [
    styles.indicator,
    styles[`tier-${tier}`],
    !summary.isEmpty ? styles.hasLoot : "",
    pulseKey > 0 ? styles.pulse : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      key={pulseKey}
      className={classes}
      onClick={onClick}
    >
      <span className={styles.iconWrap}>
        <Sprite name="chest" size={18} />
      </span>
      <span className={styles.count}>
        {summary.isEmpty
          ? "Empty"
          : `${summary.resourceCount}${summary.itemCount > 0 ? ` +${summary.itemCount}` : ""}`}
      </span>
    </button>
  );
}
