"use client";

import { RESOURCES } from "@/data/resources";
import styles from "./WelcomeBackModal.module.css";

export default function WelcomeBackModal({ offlineData, onDismiss }) {
  if (!offlineData) return null;

  const { elapsed, capped, gained } = offlineData;
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const timeStr =
    hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes}m`;

  const gainedEntries = Object.entries(gained).filter(([, amt]) => amt > 0);

  return (
    <div className={styles.overlay} onClick={onDismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span className={styles.icon}>{"\u{1F44B}"}</span>
        <h2 className={styles.title}>Welcome Back!</h2>
        <p className={styles.time}>
          You were away for {timeStr}
          {capped ? " (max 8h)" : ""}
        </p>

        {gainedEntries.length > 0 && (
          <div className={styles.rewards}>
            <p className={styles.rewardsLabel}>Resources gathered:</p>
            {gainedEntries.map(([res, amt]) => (
              <div key={res} className={styles.rewardRow}>
                <span>{RESOURCES[res]?.icon} {RESOURCES[res]?.name}</span>
                <span className={styles.rewardAmt} style={{ color: RESOURCES[res]?.color }}>
                  +{Math.floor(amt)}
                </span>
              </div>
            ))}
          </div>
        )}

        <button className={styles.btn} onClick={onDismiss}>
          Continue
        </button>
      </div>
    </div>
  );
}
