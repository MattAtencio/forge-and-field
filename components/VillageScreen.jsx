"use client";

import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { BUILDINGS, getNextUpgrade } from "@/data/village";
import { RESOURCES } from "@/data/resources";
import Sprite from "@/components/sprites/Sprite";
import styles from "./VillageScreen.module.css";

export default function VillageScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const buildingLevels = state.village || {};

  const handleUpgrade = (buildingId) => {
    const currentLevel = buildingLevels[buildingId] || 0;
    const upgrade = getNextUpgrade(buildingId, currentLevel);
    if (!upgrade) return;

    dispatch({
      type: "UPGRADE_BUILDING",
      buildingId,
      cost: upgrade.cost,
      newLevel: upgrade.level,
      effect: upgrade.effect,
    });
  };

  return (
    <div className={styles.screen}>
      <h2 className={styles.heading}>
        <Sprite name="village" size={22} /> Village
      </h2>
      <p className={styles.subtitle}>Upgrade buildings to strengthen your settlement</p>

      <div className={styles.buildingList}>
        {BUILDINGS.map((building) => {
          const currentLevel = buildingLevels[building.id] || 0;
          const nextUpgrade = getNextUpgrade(building.id, currentLevel);
          const maxed = !nextUpgrade;

          const canAfford = nextUpgrade
            ? Object.entries(nextUpgrade.cost).every(
                ([res, amt]) => (state.resources[res] || 0) >= amt
              )
            : false;

          return (
            <div
              key={building.id}
              className={`${styles.buildingCard} ${maxed ? styles.maxed : ""}`}
            >
              <div className={styles.buildingHeader}>
                <span className={styles.buildingIcon}>
                  <Sprite name={building.icon} size={28} />
                </span>
                <div className={styles.buildingInfo}>
                  <span className={styles.buildingName}>{building.name}</span>
                  <span className={styles.buildingDesc}>{building.description}</span>
                </div>
                <span className={styles.levelBadge}>
                  {maxed ? "MAX" : `Lv.${currentLevel}`}
                </span>
              </div>

              {currentLevel > 0 && (
                <div className={styles.currentEffect}>
                  {building.effectLabel(currentLevel)}
                </div>
              )}

              {nextUpgrade && (
                <div className={styles.upgradeSection}>
                  <div className={styles.upgradeCost}>
                    {Object.entries(nextUpgrade.cost).map(([res, amt]) => (
                      <span
                        key={res}
                        className={styles.costChip}
                        style={{
                          color: (state.resources[res] || 0) >= amt
                            ? RESOURCES[res]?.color
                            : "#ef4444",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Sprite name={RESOURCES[res]?.icon || res} size={14} /> {amt}
                      </span>
                    ))}
                  </div>
                  <button
                    className={styles.upgradeBtn}
                    disabled={!canAfford}
                    onClick={() => handleUpgrade(building.id)}
                  >
                    {currentLevel === 0 ? "Build" : `Upgrade to Lv.${nextUpgrade.level}`}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
