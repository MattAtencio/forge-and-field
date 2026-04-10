"use client";

import { useState, useEffect } from "react";
import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
import styles from "./CombatReplayModal.module.css";

export default function CombatReplayModal({ combatResult, rewards, onDone }) {
  const { victory, isDraw, turns, log, enemies } = combatResult;
  const [visibleLines, setVisibleLines] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // Filter log to highlights only (skills, kills, first/last attacks)
  const highlights = log.filter((entry, i) => {
    if (entry.type === "skill" || entry.type === "heal") return true;
    if (entry.targetHp === 0) return true; // kill
    if (i === 0) return true; // first action
    if (i === log.length - 1) return true; // last action
    // Show ~every 3rd attack for pacing
    return i % 3 === 0;
  }).slice(0, 12); // Cap at 12 lines

  useEffect(() => {
    if (skipped) return;
    if (visibleLines >= highlights.length) return;
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [visibleLines, highlights.length, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    setVisibleLines(highlights.length);
  };

  const displayedLines = highlights.slice(0, visibleLines);
  const showResult = skipped || visibleLines >= highlights.length;

  const formatEntry = (entry) => {
    if (entry.type === "heal") {
      return <>{entry.actor} used {entry.action}{entry.aoe ? " (all allies)" : ""} <Sprite name="heart" size={12} /> +{entry.heal}</>;
    }
    if (entry.type === "skill") {
      return <>{entry.actor} used {entry.action}!</>;
    }
    if (entry.targetHp === 0) {
      return <>{entry.actor} defeated {entry.target}! (-{entry.damage})</>;
    }
    return <>{entry.actor} {"\u2192"} {entry.target} (-{entry.damage})</>;
  };

  const resultLabel = victory ? "Victory" : isDraw ? "Draw" : "Defeat";
  const resultColor = victory ? "#22c55e" : isDraw ? "#f59e0b" : "#ef4444";
  const multLabel = victory ? "1.5x" : isDraw ? "0.75x" : "0.5x";
  const consequenceLabel = victory
    ? null
    : isDraw
    ? "1.5x durability & endurance drain, no item drops"
    : "2x durability & endurance drain, no item drops";

  return (
    <Modal title="Combat" onClose={onDone}>
      <div className={styles.combat}>
        {/* Enemy party */}
        <div className={styles.enemyRow}>
          {enemies.map((e, i) => (
            <div key={i} className={styles.enemyChip}>
              <span className={styles.enemyIcon}>
                <Sprite name={e.icon} size={24} />
              </span>
              <span className={styles.enemyName}>{e.name}</span>
              {e.isBoss && <span className={styles.bossTag}>BOSS</span>}
            </div>
          ))}
        </div>

        {/* Combat log */}
        <div className={styles.log}>
          {displayedLines.map((entry, i) => (
            <div
              key={i}
              className={`${styles.logLine} ${entry.targetHp === 0 ? styles.killLine : ""}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className={styles.turnNum}>T{entry.turn}</span>
              <span className={styles.logText}>{formatEntry(entry)}</span>
            </div>
          ))}
        </div>

        {/* Skip button */}
        {!showResult && (
          <button className={styles.skipBtn} onClick={handleSkip}>
            Skip
          </button>
        )}

        {/* Result */}
        {showResult && (
          <div className={styles.result}>
            <h3 className={styles.resultLabel} style={{ color: resultColor }}>
              {resultLabel}
            </h3>
            <span className={styles.turnCount}>{turns} turns</span>
            <span className={styles.multiplier} style={{ color: resultColor }}>
              Rewards {multLabel}
            </span>
            {consequenceLabel && (
              <span className={styles.consequence}>{consequenceLabel}</span>
            )}
            <button className={styles.doneBtn} onClick={onDone}>
              Claim Rewards
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
