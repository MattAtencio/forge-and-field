"use client";

import { RESOURCES } from "@/data/resources";
import Sprite from "./Sprite";

/**
 * Renders a list of resource costs with sprite icons inline.
 * Used in buttons/labels that previously used template literal strings with emoji.
 *
 * @param {Object} costs - { resourceKey: amount, ... }
 * @param {Object} [available] - current resource amounts for color coding
 */
export default function ResourceCost({ costs, available }) {
  const entries = Object.entries(costs).filter(([, v]) => v > 0);
  if (entries.length === 0) return null;

  return entries.map(([res, amt], i) => {
    const canAfford = !available || (available[res] || 0) >= amt;
    return (
      <span key={res} style={{ color: canAfford ? (RESOURCES[res]?.color || "#e8e8f0") : "#ef4444", marginLeft: i > 0 ? 4 : 0, display: "inline-flex", alignItems: "center", gap: 2 }}>
        <Sprite name={RESOURCES[res]?.icon || res} size={12} />
        {amt}
      </span>
    );
  });
}
