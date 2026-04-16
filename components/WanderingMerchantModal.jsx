"use client";

import { useEffect, useState } from "react";
import Sprite from "@/components/sprites/Sprite";
import styles from "./WanderingMerchantModal.module.css";

function formatRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export default function WanderingMerchantModal({ offer, expiresAt, canAfford, onAccept, onDecline }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, expiresAt - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (!offer) return null;

  const costEntries = Object.entries(offer.cost || {});
  const grantEntries = Object.entries(offer.grants?.resources || {});

  return (
    <div className={styles.overlay} onClick={onDecline}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>A Traveler Waits</h3>
          <span className={styles.countdown} aria-label="time remaining">
            {formatRemaining(remaining)}
          </span>
        </div>

        <div className={styles.body}>
          <div className={styles.offerName}>{offer.name}</div>
          <p className={styles.description}>{offer.description}</p>

          <div className={styles.exchange}>
            <div className={styles.column}>
              <div className={styles.label}>He offers</div>
              <ul className={styles.list}>
                {grantEntries.map(([res, amt]) => (
                  <li key={res} className={styles.item}>
                    <Sprite name={res} size={16} />
                    <span className={styles.amount}>+{amt}</span>
                    <span className={styles.resName}>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.divider} aria-hidden="true" />
            <div className={styles.column}>
              <div className={styles.label}>For</div>
              <ul className={styles.list}>
                {costEntries.map(([res, amt]) => (
                  <li key={res} className={styles.item}>
                    <Sprite name={res} size={16} />
                    <span className={styles.amount}>{amt}</span>
                    <span className={styles.resName}>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!canAfford && (
            <div className={styles.shortfall}>The purse is light. Come back when it isn&apos;t.</div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.decline}
            onClick={onDecline}
          >
            Send him on
          </button>
          <button
            type="button"
            className={styles.accept}
            onClick={onAccept}
            disabled={!canAfford}
          >
            Take the trade
          </button>
        </div>
      </div>
    </div>
  );
}
