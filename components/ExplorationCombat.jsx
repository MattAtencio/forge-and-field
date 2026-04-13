"use client";

import { useState, useEffect, useRef } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getHeroActions } from "@/lib/interactiveCombat";
import { getUsableConsumables } from "@/lib/consumables";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./ExplorationCombat.module.css";

export default function ExplorationCombat() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [showItems, setShowItems] = useState(false);
  const [autoAdvancing, setAutoAdvancing] = useState(false);
  const logRef = useRef(null);
  const timerRef = useRef(null);

  const combat = state.exploration?.combat;
  if (!combat) return null;

  const hero = combat.combatants.find((c) => !c.isEnemy);
  const enemies = combat.combatants.filter((c) => c.isEnemy);
  const isHeroTurn = combat.heroTurn;
  const isOver = combat.status !== "active";

  // Auto-advance enemy turns
  useEffect(() => {
    if (isOver || isHeroTurn || autoAdvancing) return;

    setAutoAdvancing(true);
    timerRef.current = setTimeout(() => {
      dispatch({ type: "EXPLORATION_COMBAT_ACTION", action: null });
      setAutoAdvancing(false);
    }, 600);

    return () => clearTimeout(timerRef.current);
  }, [combat.turn, isHeroTurn, isOver]);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combat.log.length]);

  const handleAction = (action) => {
    setShowItems(false);
    dispatch({ type: "EXPLORATION_COMBAT_ACTION", action });
  };

  const handleItemUse = (consumableId) => {
    setShowItems(false);
    dispatch({
      type: "EXPLORATION_COMBAT_ACTION",
      action: { type: "item", consumableId },
    });
  };

  const handleCombatEnd = () => {
    if (combat.status === "defeat") {
      dispatch({ type: "EXPLORATION_DEFEAT" });
    }
    // Victory and fled: just clear combat, stay on map
  };

  const combatConsumables = getUsableConsumables(state.inventory, "combat");

  return (
    <div className={styles.screen}>
      {/* Battlefield */}
      <div className={styles.battlefield}>
        {/* Hero Side */}
        <div className={styles.heroSide}>
          {hero && (
            <div className={`${styles.combatant} ${hero.hp <= 0 ? styles.defeated : ""}`}>
              <Sprite name={hero.templateId} size={48} />
              <span className={styles.combatantName}>{hero.name}</span>
              <div className={styles.hpBar}>
                <div
                  className={styles.hpFill}
                  style={{
                    width: `${(hero.hp / hero.maxHp) * 100}%`,
                    background: hero.hp / hero.maxHp <= 0.25 ? "#ef4444" : "#22c55e",
                  }}
                />
              </div>
              <span className={styles.hpText}>{hero.hp}/{hero.maxHp}</span>
            </div>
          )}
        </div>

        <span className={styles.vsLabel}>vs</span>

        {/* Enemy Side */}
        <div className={styles.enemySide}>
          {enemies.map((enemy) => (
            <div
              key={enemy.id}
              className={`${styles.combatant} ${enemy.hp <= 0 ? styles.defeated : ""}`}
            >
              <Sprite name={enemy.icon} size={enemy.isBoss ? 64 : 40} />
              <span className={styles.combatantName}>{enemy.name}</span>
              <div className={styles.hpBar}>
                <div
                  className={styles.hpFill}
                  style={{
                    width: `${(enemy.hp / enemy.maxHp) * 100}%`,
                    background: enemy.hp / enemy.maxHp <= 0.25 ? "#ef4444" : "#ef4444cc",
                  }}
                />
              </div>
              <span className={styles.hpText}>{Math.max(0, enemy.hp)}/{enemy.maxHp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Combat Log */}
      <PixelFrame variant="parchment" className={styles.logFrame}>
        <div className={styles.log} ref={logRef}>
          {combat.log.map((entry, i) => (
            <p key={i} className={styles.logEntry}>
              {entry.message}
            </p>
          ))}
          {combat.log.length === 0 && (
            <p className={styles.logEntry} style={{ color: "#64748b" }}>
              The encounter begins...
            </p>
          )}
        </div>
      </PixelFrame>

      {/* Action Bar — only on hero turn */}
      {isHeroTurn && !isOver && (
        <div className={styles.actionBar}>
          {showItems ? (
            <div className={styles.itemMenu}>
              {combatConsumables.length === 0 ? (
                <p className={styles.noItems}>No usable items.</p>
              ) : (
                combatConsumables.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.itemBtn} juiceBtn`}
                    onClick={() => handleItemUse(item.id)}
                  >
                    <Sprite name={item.icon} size={16} />
                    <span>{item.name}</span>
                    <span className={styles.itemCount}>x{item.count || 1}</span>
                  </button>
                ))
              )}
              <button
                className={styles.backBtn}
                onClick={() => setShowItems(false)}
              >
                Back
              </button>
            </div>
          ) : (
            <div className={styles.actionButtons}>
              <button
                className={`${styles.actionBtn} ${styles.attackBtn} juiceBtn`}
                onClick={() => handleAction({ type: "attack" })}
              >
                Attack
              </button>
              <button
                className={`${styles.actionBtn} ${styles.itemActionBtn} juiceBtn`}
                onClick={() => setShowItems(true)}
              >
                Item
              </button>
              <button
                className={`${styles.actionBtn} ${styles.fleeBtn} juiceBtn`}
                onClick={() => handleAction({ type: "flee" })}
              >
                Flee
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result Overlay */}
      {isOver && (
        <div className={styles.resultOverlay}>
          <PixelFrame variant="parchment" className={styles.resultCard}>
            {combat.status === "victory" && (
              <>
                <h2 className={styles.resultHeading} style={{ color: "#fbbf24" }}>Victory</h2>
                <p className={styles.resultMessage}>The way forward clears.</p>
              </>
            )}
            {combat.status === "defeat" && (
              <>
                <h2 className={styles.resultHeading} style={{ color: "#ef4444" }}>Defeated</h2>
                <p className={styles.resultMessage}>The forge remembers.</p>
              </>
            )}
            {combat.status === "fled" && (
              <>
                <h2 className={styles.resultHeading} style={{ color: "#94a3b8" }}>Escaped</h2>
                <p className={styles.resultMessage}>Discretion serves the living.</p>
              </>
            )}
            <button
              className={`${styles.continueBtn} juiceBtn`}
              onClick={handleCombatEnd}
            >
              Continue
            </button>
          </PixelFrame>
        </div>
      )}
    </div>
  );
}
