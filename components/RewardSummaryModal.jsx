"use client";

import { RESOURCES } from "@/data/resources";
import { getRarityColor, getRarityLabel } from "@/lib/rarity";
import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
import styles from "./RewardSummaryModal.module.css";

export default function RewardSummaryModal({ rewards, expeditionName, onCollect }) {
  const hasItems = rewards.items && rewards.items.length > 0;
  const hasResources = rewards.resources && Object.keys(rewards.resources).length > 0;

  return (
    <Modal title="Return from the Field" onClose={onCollect}>
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
                      <Sprite name={RESOURCES[res]?.icon || res} size={20} />
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
            <h4 className={styles.label}>Salvage</h4>
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
                  <span className={styles.itemIcon}>
                    <Sprite name={item.icon} size={24} />
                  </span>
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
          <p className={styles.empty}>They returned empty-handed. The road was not kind.</p>
        )}

        <button className={styles.collectBtn} onClick={onCollect}>
          Collect
        </button>
      </div>
    </Modal>
  );
}
