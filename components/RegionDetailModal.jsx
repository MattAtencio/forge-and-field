"use client";

import { EXPEDITIONS } from "@/data/expeditions";
import { RESOURCES } from "@/data/resources";
import Modal from "./shared/Modal";
import styles from "./RegionDetailModal.module.css";

export default function RegionDetailModal({ region, playerLevel, worldMap, onSelectExpedition, onClose }) {
  const regionExpeditions = EXPEDITIONS.filter(
    (e) => e.regionId === region.id && e.unlockLevel <= playerLevel && !e.isBoss
  );
  const bossExpedition = EXPEDITIONS.find((e) => e.id === region.bossExpedition);
  const bossAvailable = bossExpedition && bossExpedition.unlockLevel <= playerLevel;
  const bossDefeated = worldMap?.bossesDefeated?.[region.bossExpedition] || false;

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
    <Modal title={`${region.icon} ${region.name}`} onClose={onClose}>
      <div className={styles.detail}>
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
                <span className={styles.missionIcon}>{exp.icon}</span>
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
                    {RESOURCES[res]?.icon} {min}-{max}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Boss */}
        {bossAvailable && (
          <>
            <h4 className={styles.subheading}>Boss</h4>
            <button
              className={`${styles.missionCard} ${styles.bossCard}`}
              onClick={() => onSelectExpedition(bossExpedition)}
            >
              <div className={styles.missionHeader}>
                <span className={styles.missionIcon}>{bossExpedition.icon}</span>
                <div>
                  <span className={styles.missionName}>
                    {bossExpedition.name}
                    {bossDefeated && <span className={styles.defeatedTag}> Defeated</span>}
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
                <span className={styles.poiIcon}>{discovered ? poi.icon : "?"}</span>
                <div className={styles.poiInfo}>
                  <span className={styles.poiName}>{discovered ? poi.name : "Undiscovered"}</span>
                  <span className={styles.poiDesc}>
                    {discovered ? poi.description : "Complete expeditions to discover"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
