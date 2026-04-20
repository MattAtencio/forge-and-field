"use client";

import { EXPEDITIONS } from "@/data/expeditions";
import { RESOURCES } from "@/data/resources";
import Modal from "./shared/Modal";
import PixelFrame from "@/components/shared/PixelFrame";
import Sprite from "@/components/sprites/Sprite";
import styles from "./RegionDetailModal.module.css";

// Temperature accent classes are CSS-variable-driven to keep theming out of JSX.
// Unknown region ids fall through to the neutral default on .detail.
const TEMP_CLASS_BY_REGION_ID = {
  greenwood: styles.tempGreenwood,
  stormridge: styles.tempStormridge,
  dusthaven: styles.tempDusthaven,
  frostpeak: styles.tempFrostpeak,
  dragons_reach: styles.tempDragonsReach,
};

export default function RegionDetailModal({ region, playerLevel, worldMap, onSelectExpedition, onClose }) {
  const allRegionExpeditions = EXPEDITIONS.filter(
    (e) => e.regionId === region.id && !e.isBoss
  );
  const regionExpeditions = allRegionExpeditions.filter((e) => e.unlockLevel <= playerLevel);
  const lockedExpeditions = allRegionExpeditions.filter((e) => e.unlockLevel > playerLevel);
  const bossExpedition = EXPEDITIONS.find((e) => e.id === region.bossExpedition);
  const bossAvailable = bossExpedition && bossExpedition.unlockLevel <= playerLevel;
  const bossDefeated = worldMap?.bossesDefeated?.[region.bossExpedition] || false;

  const tempClass = TEMP_CLASS_BY_REGION_ID[region.id] || "";

  const formatDuration = (ms) => {
    const sec = Math.ceil(ms / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hrs = Math.floor(min / 60);
    const remMin = min % 60;
    return `${hrs}h ${remMin}m`;
  };

  return (
    <Modal title={region.name} onClose={onClose}>
      <div className={`${styles.detail} ${tempClass}`}>
        <PixelFrame variant="parchment" className={styles.bodyFrame}>
          <p className={styles.desc}>{region.description}</p>

          {/* Expeditions */}
          <h4 className={styles.subheading}>Expeditions</h4>
          <div className={styles.missionList}>
            {regionExpeditions.map((exp) => (
              <button
                key={exp.id}
                className={styles.missionCard}
                onClick={() => onSelectExpedition(exp)}
              >
                <div className={styles.missionHeader}>
                  <span className={styles.missionIcon}>
                    <Sprite name={exp.icon} size={24} />
                  </span>
                  <div>
                    <span className={styles.missionName}>{exp.name}</span>
                    <span className={styles.missionDesc}>{exp.description}</span>
                  </div>
                </div>
                <div className={styles.missionMeta}>
                  <span>Power: {exp.requiredPower}</span>
                  <span>Heroes: {exp.heroSlots}</span>
                  <span>{formatDuration(exp.duration)}</span>
                </div>
                <div className={styles.missionRewards}>
                  {Object.entries(exp.rewards.resources).map(([res, [min, max]]) => (
                    <span key={res} className={styles.rewardChip}>
                      <Sprite name={RESOURCES[res]?.icon || res} size={14} /> {min}-{max}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            {lockedExpeditions.map((exp) => (
              <div key={exp.id} className={`${styles.missionCard} ${styles.missionLocked}`}>
                <div className={styles.missionHeader}>
                  <span className={`${styles.missionIcon} ${styles.lockIcon}`}>
                    <Sprite name="lock" size={24} muted />
                  </span>
                  <div>
                    {/* Em-dash placeholder hides the mission name until unlocked; level requirement stays visible. */}
                    <span className={`${styles.missionName} ${styles.missionNameHidden}`} aria-label={`Locked expedition, requires level ${exp.unlockLevel}`}>
                      — — — — —
                    </span>
                    <span className={styles.lockRequirement}>
                      Requires Forgemaster Lvl {exp.unlockLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Boss */}
          {bossExpedition && (
            <>
              <h4 className={styles.subheading}>Boss</h4>
              {bossAvailable ? (
                <button
                  className={`${styles.missionCard} ${styles.bossCard} ${bossDefeated ? styles.bossCleared : ""}`}
                  onClick={() => onSelectExpedition(bossExpedition)}
                >
                  <div className={styles.missionHeader}>
                    <span className={styles.missionIcon}>
                      <Sprite name={bossExpedition.icon} size={28} />
                    </span>
                    <div>
                      <span className={styles.missionName}>
                        {bossExpedition.name}
                        {bossDefeated && (
                          <span className={styles.clearedChip}>&#10003; cleared</span>
                        )}
                      </span>
                      <span className={styles.missionDesc}>{bossExpedition.description}</span>
                    </div>
                  </div>
                  <div className={styles.missionMeta}>
                    <span>Power: {bossExpedition.requiredPower}</span>
                    <span>Heroes: {bossExpedition.heroSlots}</span>
                    <span>{formatDuration(bossExpedition.duration)}</span>
                  </div>
                </button>
              ) : (
                <div className={`${styles.missionCard} ${styles.bossCard} ${styles.bossLocked} ${styles.missionLocked}`}>
                  <div className={styles.missionHeader}>
                    <span className={`${styles.missionIcon} ${styles.lockIcon}`}>
                      <Sprite name="lock" size={28} muted />
                    </span>
                    <div>
                      <span className={`${styles.missionName} ${styles.missionNameHidden}`}>
                        — — — — —
                      </span>
                      <span className={styles.lockRequirement}>
                        Requires Commander Lvl {bossExpedition.unlockLevel}
                      </span>
                      <span className={styles.bossLockedHint}>
                        Prove yourself. Return when ready.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Discoveries */}
          <h4 className={styles.subheading}>
            Discoveries ({region.pointsOfInterest.filter((p) => worldMap?.discoveries?.[p.id]).length}/{region.pointsOfInterest.length})
          </h4>
          <div className={styles.poiList}>
            {region.pointsOfInterest.map((poi) => {
              const discovered = worldMap?.discoveries?.[poi.id] || false;
              return (
                <div
                  key={poi.id}
                  className={`${styles.poiCard} ${discovered ? styles.poiDiscovered : styles.poiHidden}`}
                >
                  <span className={styles.poiIcon}>
                    {discovered ? <Sprite name={poi.icon} size={20} /> : "?"}
                  </span>
                  <div className={styles.poiInfo}>
                    <span className={styles.poiName}>{discovered ? poi.name : "Undiscovered"}</span>
                    <span className={styles.poiDesc}>
                      {discovered ? poi.description : "Send your champions. The land reveals itself to those who walk it."}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </PixelFrame>
      </div>
    </Modal>
  );
}
