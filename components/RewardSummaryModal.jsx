"use client";

import { RESOURCES } from "@/data/resources";
import { getRarityColor, getRarityLabel } from "@/lib/rarity";
import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
import styles from "./RewardSummaryModal.module.css";

const RESOURCE_STAGGER_MS = 60;
const ITEMS_BASE_DELAY_MS = 200;

function getSubline(rewards) {
  const items = rewards.items || [];
  const resources = rewards.resources || {};
  const hasRarePlus = items.some(
    (it) => it.rarity === "rare" || it.rarity === "epic"
  );
  if (hasRarePlus) return "The woods were generous.";

  const totalResources = Object.values(resources).reduce(
    (sum, n) => sum + (n || 0),
    0
  );
  if (totalResources > 20) return "A good haul. The forge waits.";

  if (totalResources <= 5 && items.length === 0) {
    return "Lean, but the road remembers you.";
  }
  return null;
}

export default function RewardSummaryModal({ rewards, expeditionName, onCollect }) {
  const hasItems = rewards.items && rewards.items.length > 0;
  const hasResources = rewards.resources && Object.keys(rewards.resources).length > 0;

  const resourceEntries = hasResources
    ? Object.entries(rewards.resources).filter(([, amount]) => amount > 0)
    : [];
  const resourceCount = resourceEntries.length;

  const subline = getSubline(rewards);

  return (
    <Modal title="Return from the Field" onClose={onCollect}>
      <div className={styles.summary}>
        <h3 className={styles.expName}>{expeditionName}</h3>
        {subline && <p className={styles.subline}>{subline}</p>}

        {hasResources && (
          <div className={styles.section}>
            <h4 className={styles.label}>Resources</h4>
            <div className={styles.resourceList}>
              {resourceEntries.map(([res, amount], idx) => (
                <div
                  key={res}
                  className={styles.resourceChip}
                  style={{ animationDelay: `${idx * RESOURCE_STAGGER_MS}ms` }}
                >
                  <span className={styles.resourceIcon}>
                    <Sprite name={RESOURCES[res]?.icon || res} size={20} />
                  </span>
                  <span className={styles.resourceAmount}>+{amount}</span>
                  <span className={styles.resourceName}>
                    {RESOURCES[res]?.name || res}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasItems && (
          <div className={styles.section}>
            <h4 className={styles.label}>Salvage</h4>
            <div className={styles.itemList}>
              {rewards.items.map((item, idx) => {
                const isRarePlus =
                  item.rarity === "rare" || item.rarity === "epic";
                const chipClass = isRarePlus
                  ? `${styles.itemChip} ${
                      item.rarity === "epic"
                        ? styles.itemChipEpic
                        : styles.itemChipRare
                    }`
                  : styles.itemChip;
                // Delay items until after the resource stagger completes
                const delayMs =
                  ITEMS_BASE_DELAY_MS +
                  resourceCount * RESOURCE_STAGGER_MS +
                  idx * RESOURCE_STAGGER_MS;
                return (
                  <div
                    key={item.id}
                    className={chipClass}
                    style={{
                      borderColor: getRarityColor(item.rarity),
                      "--rarity-color": getRarityColor(item.rarity),
                      animationDelay: `${delayMs}ms`,
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
                );
              })}
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
