"use client";

import { useState, useEffect, useRef } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getHeroActions } from "@/lib/interactiveCombat";
import { getUsableConsumables } from "@/lib/consumables";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./ExplorationCombat.module.css";

// FX lifetimes (kept in JS so hit-flash timeout matches CSS duration exactly)
const DAMAGE_FLOAT_MS = 800;
const HIT_FLASH_MS = 150;

export default function ExplorationCombat() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [showItems, setShowItems] = useState(false);
  const [autoAdvancing, setAutoAdvancing] = useState(false);
  const [damageFloats, setDamageFloats] = useState([]); // { id, combatantId, amount, tone }
  const [hitFlashes, setHitFlashes] = useState({}); // { [combatantId]: true }
  const logRef = useRef(null);
  const timerRef = useRef(null);
  const processedLogRef = useRef(0);
  const fxIdRef = useRef(0);

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

  // Observe new log entries for damage/hit FX. We diff against processedLogRef
  // rather than adding actions to the reducer — the log is the source of truth.
  useEffect(() => {
    const log = combat.log;
    if (log.length <= processedLogRef.current) {
      // Log was cleared/reset (new encounter) — resync baseline.
      processedLogRef.current = log.length;
      return;
    }

    const fresh = log.slice(processedLogRef.current);
    processedLogRef.current = log.length;

    const newFloats = [];
    const newlyHit = new Set();

    for (const entry of fresh) {
      if (typeof entry.damage !== "number" || entry.damage <= 0) continue;
      const targetCombatant = combat.combatants.find((c) => c.name === entry.target);
      if (!targetCombatant) continue;

      fxIdRef.current += 1;
      newFloats.push({
        id: fxIdRef.current,
        combatantId: targetCombatant.id,
        amount: entry.damage,
        // ember = hero hit enemy, red = enemy hit hero
        tone: targetCombatant.isEnemy ? "ember" : "red",
      });
      newlyHit.add(targetCombatant.id);
    }

    if (newFloats.length) {
      setDamageFloats((prev) => [...prev, ...newFloats]);
      for (const f of newFloats) {
        const id = f.id;
        setTimeout(() => {
          setDamageFloats((prev) => prev.filter((x) => x.id !== id));
        }, DAMAGE_FLOAT_MS);
      }
    }

    if (newlyHit.size) {
      setHitFlashes((prev) => {
        const next = { ...prev };
        for (const cid of newlyHit) next[cid] = (next[cid] || 0) + 1;
        return next;
      });
      for (const cid of newlyHit) {
        setTimeout(() => {
          setHitFlashes((prev) => {
            const count = prev[cid];
            if (!count) return prev;
            const next = { ...prev };
            if (count <= 1) delete next[cid];
            else next[cid] = count - 1;
            return next;
          });
        }, HIT_FLASH_MS);
      }
    }
  }, [combat.log, combat.combatants]);

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

  const floatsFor = (combatantId) =>
    damageFloats.filter((f) => f.combatantId === combatantId);

  return (
    <div className={styles.screen}>
      {/* Turn indicator */}
      <div className={styles.turnIndicatorRow}>
        <span
          className={[
            styles.turnPill,
            isOver
              ? styles.turnPillIdle
              : isHeroTurn
              ? styles.turnPillHero
              : styles.turnPillEnemy,
          ].join(" ")}
          aria-live="polite"
        >
          {isOver
            ? "—"
            : isHeroTurn
            ? "Your turn"
            : "Enemy turn"}
        </span>
      </div>

      {/* Battlefield */}
      <div className={styles.battlefield}>
        {/* Hero Side */}
        <div className={styles.heroSide}>
          {hero && (
            <div className={`${styles.combatant} ${hero.hp <= 0 ? styles.defeated : ""}`}>
              <div className={styles.spriteWrap}>
                <Sprite name={hero.templateId} size={48} />
                {hitFlashes[hero.id] ? (
                  <span className={`${styles.hitFlash} ${styles.hitFlashRed}`} aria-hidden="true" />
                ) : null}
                {floatsFor(hero.id).map((f) => (
                  <span
                    key={f.id}
                    className={`${styles.damageFloat} ${styles.damageRed}`}
                    aria-hidden="true"
                  >
                    -{f.amount}
                  </span>
                ))}
              </div>
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
              <div className={styles.spriteWrap}>
                <Sprite name={enemy.icon} size={enemy.isBoss ? 64 : 40} />
                {hitFlashes[enemy.id] ? (
                  <span className={`${styles.hitFlash} ${styles.hitFlashWhite}`} aria-hidden="true" />
                ) : null}
                {floatsFor(enemy.id).map((f) => (
                  <span
                    key={f.id}
                    className={`${styles.damageFloat} ${styles.damageEmber}`}
                    aria-hidden="true"
                  >
                    -{f.amount}
                  </span>
                ))}
              </div>
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

      {/* Action Bar — only on hero turn. Iron frame = action context. */}
      {isHeroTurn && !isOver && (
        <PixelFrame variant="iron" className={styles.actionFrame}>
          <div className={styles.actionBar}>
            {showItems ? (
              <div className={styles.itemMenu}>
                {combatConsumables.length === 0 ? (
                  <p className={styles.noItems}>No usable items.</p>
                ) : (
                  combatConsumables.map((item) => (
                    <button
                      key={item.id}
                      className={`${styles.itemBtn} ${styles.pressBtn} juiceBtn`}
                      onClick={() => handleItemUse(item.id)}
                    >
                      <Sprite name={item.icon} size={16} />
                      <span>{item.name}</span>
                      <span className={styles.itemCount}>x{item.count || 1}</span>
                    </button>
                  ))
                )}
                <button
                  className={`${styles.backBtn} ${styles.pressBtn}`}
                  onClick={() => setShowItems(false)}
                >
                  Back
                </button>
              </div>
            ) : (
              <div className={styles.actionButtons}>
                <button
                  className={`${styles.actionBtn} ${styles.attackBtn} ${styles.pressBtn} juiceBtn`}
                  onClick={() => handleAction({ type: "attack" })}
                >
                  Attack
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.itemActionBtn} ${styles.pressBtn} juiceBtn`}
                  onClick={() => setShowItems(true)}
                >
                  Item
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.fleeBtn} ${styles.pressBtn} juiceBtn`}
                  onClick={() => handleAction({ type: "flee" })}
                >
                  Flee
                </button>
              </div>
            )}
          </div>
        </PixelFrame>
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
              className={`${styles.continueBtn} ${styles.pressBtn} juiceBtn`}
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
