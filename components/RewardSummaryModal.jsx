"use client";

import { RESOURCES } from "@/data/resources";
import { getRarityColor, getRarityLabel } from "@/lib/rarity";
import Modal from "./shared/Modal";
import styles from "./RewardSummaryModal.module.css";

export default function RewardSummaryModal({ rewards, expeditionName, onCollect }) {
  const hasItems = rewards.items && rewards.items.length > 0;
  const hasResources = rewards.resources && Object.keys(rewards.resources).length > 0;

  return (
    <Modal title="Expedition Complete" onClose={onCollect}>
      <div className={styles.summary}>
        <h3 className={styles.expName}>{expeditionName}</h3>

        {hasResources && (
          <div className={styles.section}>
            <h4 className={styles.label}>Resources</h4>
            <div className={styles.resourceList}>
              {Object.entries(rewards.resources).map(([res, amount]) =>
                amount > 0 ? (
                  <div key={res} className={styles.resourceChip}>
                    <span className={styles.resourceIcon}>
                      {RESOURCES[res]?.icon || res}
                    </span>
                    <span className={styles.resourceAmount}>+{amount}</span>
                    <span className={styles.resourceName}>
                      {RESOURCES[res]?.name || res}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {hasItems && (
          <div className={styles.section}>
            <h4 className={styles.label}>Items Found</h4>
            <div className={styles.itemList}>
              {rewards.items.map((item) => (
                <div
                  key={item.id}
                  className={styles.itemChip}
                  style={{
                    borderColor: getRarityColor(item.rarity),
                    "--rarity-color": getRarityColor(item.rarity),
                  }}
                >
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <div className={styles.itemInfo}>
                    <span
                      className={styles.itemName}
                      style={{ color: getRarityColor(item.rarity) }}
                    >
                      {item.name}
                    </span>
                    <span className={styles.itemRarity}>
                      {getRarityLabel(item.rarity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasResources && !hasItems && (
          <p className={styles.empty}>No rewards this time.</p>
        )}

        <button className={styles.collectBtn} onClick={onCollect}>
          Collect
        </button>
      </div>
    </Modal>
  );
}
