"use client";

import { useState, useRef, useEffect } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { BUILDINGS, getNextUpgrade } from "@/data/village";
import { RESOURCES } from "@/data/resources";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./VillageScreen.module.css";

// 600ms covers both ember-burst overlay and effect fade-in;
// kept local so reducer/save state stay untouched.
const UPGRADE_BEAT_MS = 600;

export default function VillageScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const buildingLevels = state.village || {};
  const [recentlyUpgradedId, setRecentlyUpgradedId] = useState(null);
  const beatTimerRef = useRef(null);

  // Cleanup pending celebration timer on unmount to avoid setState-after-unmount.
  useEffect(() => {
    return () => {
      if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
    };
  }, []);

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

    if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
    setRecentlyUpgradedId(buildingId);
    beatTimerRef.current = setTimeout(() => {
      setRecentlyUpgradedId(null);
      beatTimerRef.current = null;
    }, UPGRADE_BEAT_MS);
  };

  // Heading count chip — built = at least Lv.1; if every building is maxed swap to in-voice line.
  const builtCount = BUILDINGS.filter(
    (b) => (buildingLevels[b.id] || 0) > 0
  ).length;
  const allMaxed = BUILDINGS.every(
    (b) => !getNextUpgrade(b.id, buildingLevels[b.id] || 0)
  );

  return (
    <div className={styles.screen}>
      <div className={styles.headingRow}>
        <h2 className={styles.heading}>
          <Sprite name="village" size={22} /> Village
        </h2>
        <span
          className={`${styles.countChip} ${allMaxed ? styles.countChipMaxed : ""}`}
        >
          {allMaxed ? "All endures." : `Buildings: ${builtCount}/${BUILDINGS.length}`}
        </span>
      </div>
      <p className={styles.subtitle}>Stone by stone, build what endures.</p>

      <div className={styles.buildingList}>
        {BUILDINGS.map((building) => {
          const currentLevel = buildingLevels[building.id] || 0;
          const nextUpgrade = getNextUpgrade(building.id, currentLevel);
          const maxed = !nextUpgrade;
          const isRecentlyUpgraded = recentlyUpgradedId === building.id;

          const canAfford = nextUpgrade
            ? Object.entries(nextUpgrade.cost).every(
                ([res, amt]) => (state.resources[res] || 0) >= amt
              )
            : false;

          const cardClasses = [
            styles.buildingCard,
            maxed ? styles.maxed : "",
            isRecentlyUpgraded ? styles.justUpgraded : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <PixelFrame
              key={building.id}
              variant="iron"
              className={cardClasses}
            >
              <div className={styles.buildingHeader}>
                <span className={styles.buildingIcon}>
                  <Sprite name={building.icon} size={28} />
                </span>
                <div className={styles.buildingInfo}>
                  <span className={styles.buildingName}>{building.name}</span>
                  <span className={styles.buildingDesc}>{building.description}</span>
                </div>
                <span
                  className={`${styles.levelBadge} ${maxed ? styles.levelBadgeMaxed : ""} ${
                    isRecentlyUpgraded ? styles.levelBounce : ""
                  }`}
                >
                  {maxed ? "MAX" : `Lv.${currentLevel}`}
                </span>
              </div>

              {currentLevel > 0 && (
                <div
                  // key forces React to remount on level change so the fade-in plays
                  key={`effect-${currentLevel}`}
                  className={`${styles.currentEffect} ${maxed ? styles.currentEffectMaxed : ""} ${
                    isRecentlyUpgraded ? styles.effectFadeIn : ""
                  }`}
                >
                  {maxed && <span className={styles.maxedCheck} aria-hidden="true">✓</span>}
                  {building.effectLabel(currentLevel)}
                </div>
              )}

              {nextUpgrade ? (
                <div className={styles.upgradeSection}>
                  <div className={styles.upgradeCost}>
                    {Object.entries(nextUpgrade.cost).map(([res, amt]) => {
                      const has = (state.resources[res] || 0) >= amt;
                      return (
                        <span
                          key={res}
                          className={`${styles.costChip} ${has ? styles.costChipOk : styles.costChipShort}`}
                          style={{
                            // Resource color drives the icon tint; chip border stays parchment.
                            color: has ? RESOURCES[res]?.color : "#ef4444",
                          }}
                        >
                          <Sprite name={RESOURCES[res]?.icon || res} size={14} />
                          <span className={styles.costAmt}>{amt}</span>
                        </span>
                      );
                    })}
                  </div>
                  <button
                    className={`${styles.upgradeBtn} ${
                      canAfford ? styles.upgradeBtnReady : styles.upgradeBtnShort
                    }`}
                    disabled={!canAfford}
                    onClick={() => handleUpgrade(building.id)}
                  >
                    {currentLevel === 0 ? "Build" : `Upgrade to Lv.${nextUpgrade.level}`}
                  </button>
                </div>
              ) : (
                <div className={styles.builtChip}>Endured</div>
              )}

              {isRecentlyUpgraded && (
                <span className={styles.emberBurst} aria-hidden="true" />
              )}
            </PixelFrame>
          );
        })}
      </div>
    </div>
  );
}
