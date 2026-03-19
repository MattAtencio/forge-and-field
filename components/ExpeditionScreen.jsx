"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getAvailableExpeditions, canSendExpedition, generateRewards } from "@/lib/expedition";
import { getHeroPower } from "@/lib/hero";
import { RESOURCES } from "@/data/resources";
import HeroCard from "./shared/HeroCard";
import Modal from "./shared/Modal";
import styles from "./ExpeditionScreen.module.css";

export default function ExpeditionScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [selectedHeroes, setSelectedHeroes] = useState([]);

  const expeditions = getAvailableExpeditions(state.player.level);
  const idleHeroes = state.heroes.filter((h) => h.status === "idle");
  const now = Date.now();

  const handleToggleHero = (heroId) => {
    setSelectedHeroes((prev) =>
      prev.includes(heroId)
        ? prev.filter((id) => id !== heroId)
        : selectedExpedition && prev.length < selectedExpedition.heroSlots
        ? [...prev, heroId]
        : prev
    );
  };

  const handleSend = () => {
    if (!selectedExpedition) return;
    if (!canSendExpedition(selectedExpedition, selectedHeroes, state.heroes, state.inventory)) return;

    dispatch({
      type: "SEND_EXPEDITION",
      expedition: selectedExpedition,
      heroIds: selectedHeroes,
    });
    setSelectedExpedition(null);
    setSelectedHeroes([]);
  };

  const handleClaim = (exp) => {
    const template = expeditions.find((e) => e.id === exp.templateId) || expeditions[0];
    const rewards = generateRewards(template, exp.heroIds, state.heroes, state.inventory);
    dispatch({
      type: "CLAIM_REWARDS",
      expeditionId: exp.id,
      rewards,
    });
  };

  const formatDuration = (ms) => {
    const sec = Math.ceil(ms / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    if (min < 60) return remSec > 0 ? `${min}m ${remSec}s` : `${min}m`;
    const hrs = Math.floor(min / 60);
    const remMin = min % 60;
    return `${hrs}h ${remMin}m`;
  };

  return (
    <div className={styles.screen}>
      <h2 className={styles.heading}>Expeditions</h2>

      {/* Active Expeditions */}
      {state.expeditions.active.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.subheading}>Active</h3>
          {state.expeditions.active.map((exp) => {
            const remaining = Math.max(0, (exp.startedAt + exp.duration) - now);
            const pct = Math.min(((now - exp.startedAt) / exp.duration) * 100, 100);
            const template = expeditions.find((e) => e.id === exp.templateId);

            return (
              <div key={exp.id} className={styles.activeCard}>
                <div className={styles.activeHeader}>
                  <span>{template?.icon || "?"}</span>
                  <span className={styles.activeName}>{template?.name || "Unknown"}</span>
                  <span className={styles.activeTime}>{formatDuration(remaining)}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Expeditions */}
      {state.expeditions.completed.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.subheading}>Completed</h3>
          {state.expeditions.completed.map((exp) => {
            const template = expeditions.find((e) => e.id === exp.templateId);
            return (
              <div key={exp.id} className={styles.completedCard}>
                <span>{template?.icon || "?"} {template?.name || "Unknown"}</span>
                <button className={styles.claimBtn} onClick={() => handleClaim(exp)}>
                  Claim Rewards
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Expeditions */}
      <div className={styles.section}>
        <h3 className={styles.subheading}>Available Missions</h3>
        <div className={styles.missionList}>
          {expeditions.map((exp) => (
            <button
              key={exp.id}
              className={styles.missionCard}
              onClick={() => {
                setSelectedExpedition(exp);
                setSelectedHeroes([]);
              }}
            >
              <div className={styles.missionHeader}>
                <span className={styles.missionIcon}>{exp.icon}</span>
                <div>
                  <span className={styles.missionName}>{exp.name}</span>
                  <span className={styles.missionDesc}>{exp.description}</span>
                </div>
              </div>
              <div className={styles.missionMeta}>
                <span>Power: {exp.requiredPower}</span>
                <span>Heroes: {exp.heroSlots}</span>
                <span>{formatDuration(exp.duration)}</span>
              </div>
              <div className={styles.missionRewards}>
                {Object.entries(exp.rewards.resources).map(([res, [min, max]]) => (
                  <span key={res} className={styles.rewardChip}>
                    {RESOURCES[res]?.icon} {min}-{max}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Send Expedition Modal */}
      {selectedExpedition && (
        <Modal
          title={selectedExpedition.name}
          onClose={() => {
            setSelectedExpedition(null);
            setSelectedHeroes([]);
          }}
        >
          <div className={styles.sendModal}>
            <p className={styles.modalDesc}>{selectedExpedition.description}</p>
            <p className={styles.modalMeta}>
              Required Power: {selectedExpedition.requiredPower} &middot; Heroes: {selectedHeroes.length}/{selectedExpedition.heroSlots}
            </p>

            <h4 className={styles.subheading}>Select Heroes</h4>
            <div className={styles.heroPicker}>
              {idleHeroes.length === 0 ? (
                <p className={styles.empty}>No idle heroes available</p>
              ) : (
                idleHeroes.map((hero) => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    inventory={state.inventory}
                    selected={selectedHeroes.includes(hero.id)}
                    onClick={() => handleToggleHero(hero.id)}
                  />
                ))
              )}
            </div>

            <button
              className={styles.sendBtn}
              disabled={!canSendExpedition(selectedExpedition, selectedHeroes, state.heroes, state.inventory)}
              onClick={handleSend}
            >
              Send Expedition
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
