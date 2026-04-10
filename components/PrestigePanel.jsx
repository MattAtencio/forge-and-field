"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { canPrestige, calculatePrestigeStars, canBuyBonus } from "@/lib/prestige";
import { PRESTIGE_BONUSES } from "@/data/prestige";
import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
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

  // Don't show if player hasn't reached reforging level and has never reforged
  if (!eligible && prestige.tier === 0) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}><Sprite name="season" size={14} /> The Reforging</h3>
        {prestige.tier > 0 && (
          <span className={styles.tierBadge}>Tier {prestige.tier}</span>
        )}
      </div>

      <div className={styles.starInfo}>
        <span className={styles.starCount}><Sprite name="season" size={14} /> {prestige.availableStars} Forge Marks</span>
        {prestige.totalStars > prestige.availableStars && (
          <span className={styles.totalStars}>({prestige.totalStars} lifetime)</span>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.shopBtn}
          onClick={() => setShowShop(true)}
        >
          Marks of the Forge
        </button>

        {eligible && (
          <button
            className={`${styles.rebirthBtn} juiceBtn`}
            onClick={() => setConfirmRebirth(true)}
          >
            Reforge (+{starsPreview} <Sprite name="season" size={14} />)
          </button>
        )}
      </div>

      {/* Confirm Reforging */}
      {confirmRebirth && (
        <Modal title="Confirm Reforging" onClose={() => setConfirmRebirth(false)}>
          <div className={styles.confirmModal}>
            <p className={styles.confirmText}>
              Return to the flames. Your level, resources, and inventory will be consumed. In return, the forge remembers — <strong>{starsPreview} <Sprite name="season" size={14} /></strong> Forge Marks to carry forward.
            </p>
            <p className={styles.confirmWarn}>
              Heroes and world map progress will also be reset.
              Marks of the Forge and discoveries are kept.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmRebirth(false)}>
                Cancel
              </button>
              <button className={`${styles.confirmBtn} juiceBtn`} onClick={handleRebirth}>
                Reforge
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Marks of the Forge */}
      {showShop && (
        <Modal title={`Marks of the Forge (\u2B50 ${prestige.availableStars})`} onClose={() => setShowShop(false)}>
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
