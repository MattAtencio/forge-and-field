"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { canPrestige, calculatePrestigeStars, canBuyBonus } from "@/lib/prestige";
import { PRESTIGE_BONUSES } from "@/data/prestige";
import Modal from "./shared/Modal";
import styles from "./PrestigePanel.module.css";

export default function PrestigePanel() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [showShop, setShowShop] = useState(false);
  const [confirmRebirth, setConfirmRebirth] = useState(false);

  const prestige = state.prestige || { tier: 0, totalStars: 0, availableStars: 0, bonuses: {} };
  const eligible = canPrestige(state);
  const starsPreview = eligible ? calculatePrestigeStars(state) : 0;

  const handleRebirth = () => {
    dispatch({ type: "PRESTIGE_REBIRTH", stars: starsPreview });
    setConfirmRebirth(false);
  };

  const handleBuyBonus = (bonusId) => {
    const bonus = PRESTIGE_BONUSES.find((b) => b.id === bonusId);
    if (!bonus || !canBuyBonus(prestige, bonusId)) return;
    dispatch({ type: "BUY_PRESTIGE_BONUS", bonusId, cost: bonus.cost });
  };

  // Don't show if player hasn't reached prestige level and has never prestiged
  if (!eligible && prestige.tier === 0) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>{"\u2B50"} Prestige</h3>
        {prestige.tier > 0 && (
          <span className={styles.tierBadge}>Tier {prestige.tier}</span>
        )}
      </div>

      <div className={styles.starInfo}>
        <span className={styles.starCount}>{"\u2B50"} {prestige.availableStars} stars</span>
        {prestige.totalStars > prestige.availableStars && (
          <span className={styles.totalStars}>({prestige.totalStars} lifetime)</span>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.shopBtn}
          onClick={() => setShowShop(true)}
        >
          Prestige Shop
        </button>

        {eligible && (
          <button
            className={styles.rebirthBtn}
            onClick={() => setConfirmRebirth(true)}
          >
            Rebirth (+{starsPreview} {"\u2B50"})
          </button>
        )}
      </div>

      {/* Confirm Rebirth */}
      {confirmRebirth && (
        <Modal title="Confirm Rebirth" onClose={() => setConfirmRebirth(false)}>
          <div className={styles.confirmModal}>
            <p className={styles.confirmText}>
              You will gain <strong>{starsPreview} {"\u2B50"}</strong> Prestige Stars.
            </p>
            <p className={styles.confirmWarn}>
              Your level, resources, inventory, heroes, and world map progress will be reset.
              Prestige bonuses and discoveries are kept.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmRebirth(false)}>
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={handleRebirth}>
                Rebirth
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Prestige Shop */}
      {showShop && (
        <Modal title={`Prestige Shop (\u2B50 ${prestige.availableStars})`} onClose={() => setShowShop(false)}>
          <div className={styles.shopList}>
            {PRESTIGE_BONUSES.map((bonus) => {
              const stacks = prestige.bonuses[bonus.id] || 0;
              const maxed = stacks >= bonus.maxStacks;
              const affordable = canBuyBonus(prestige, bonus.id);

              return (
                <div key={bonus.id} className={`${styles.bonusCard} ${maxed ? styles.bonusMaxed : ""}`}>
                  <div className={styles.bonusHeader}>
                    <span className={styles.bonusIcon}>{bonus.icon}</span>
                    <div className={styles.bonusInfo}>
                      <span className={styles.bonusName}>{bonus.name}</span>
                      <span className={styles.bonusDesc}>{bonus.description}</span>
                    </div>
                    <span className={styles.bonusStacks}>
                      {stacks}/{bonus.maxStacks}
                    </span>
                  </div>
                  <button
                    className={styles.buyBtn}
                    onClick={() => handleBuyBonus(bonus.id)}
                    disabled={maxed || !affordable}
                  >
                    {maxed ? "Maxed" : `${bonus.cost} \u2B50`}
                  </button>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
