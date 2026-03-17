"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { REGIONS } from "@/data/regions";
import { EXPEDITIONS } from "@/data/expeditions";
import { getRegionExpeditions, canSendExpedition, generateRewards, getEffectiveExpeditionDuration } from "@/lib/expedition";
import { RESOURCES } from "@/data/resources";
import HeroCard from "./shared/HeroCard";
import Modal from "./shared/Modal";
import CombatReplayModal from "./CombatReplayModal";
import RegionDetailModal from "./RegionDetailModal";
import styles from "./WorldMapScreen.module.css";

export default function WorldMapScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [combatPending, setCombatPending] = useState(null); // { combatResult, rewards, expeditionId }

  const now = Date.now();
  const idleHeroes = state.heroes.filter((h) => h.status === "idle");

  const isRegionUnlocked = (region) => {
    if (!region.unlockCondition) return true;
    return state.worldMap?.clearedRegions?.includes(region.unlockCondition) || false;
  };

  const isRegionCleared = (regionId) => {
    return state.worldMap?.clearedRegions?.includes(regionId) || false;
  };

  const isDiscovered = (poiId) => {
    return state.worldMap?.discoveries?.[poiId] || false;
  };

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

    const effectiveDuration = getEffectiveExpeditionDuration(
      selectedExpedition, selectedHeroes, state.heroes
    );

    dispatch({
      type: "SEND_EXPEDITION",
      expedition: { ...selectedExpedition, duration: effectiveDuration },
      heroIds: selectedHeroes,
    });
    setSelectedExpedition(null);
    setSelectedHeroes([]);
  };

  const handleClaim = (exp) => {
    const template = EXPEDITIONS.find((e) => e.id === exp.templateId);
    if (!template) return;
    const rewards = generateRewards(template, exp.heroIds, state.heroes, state.inventory);

    if (rewards.combatResult) {
      setCombatPending({ combatResult: rewards.combatResult, rewards, expeditionId: exp.id, templateId: exp.templateId });
    } else {
      finalizeClaim(exp.id, rewards, exp.templateId);
    }
  };

  const finalizeClaim = (expeditionId, rewards, templateId) => {
    dispatch({
      type: "CLAIM_REWARDS",
      expeditionId,
      rewards,
    });

    // Check if this is a boss expedition
    const template = EXPEDITIONS.find((e) => e.id === templateId);
    if (template?.isBoss && rewards.combatResult?.victory) {
      const region = REGIONS.find((r) => r.bossExpedition === templateId);
      if (region && !isRegionCleared(region.id)) {
        dispatch({ type: "CLEAR_BOSS", regionId: region.id, bossExpeditionId: templateId });
        // Unlock next region
        const nextRegion = REGIONS.find((r) => r.unlockCondition === region.id);
        if (nextRegion) {
          dispatch({ type: "UNLOCK_REGION", regionId: nextRegion.id });
        }
      }
    }

    // Discovery roll
    if (template?.regionId) {
      const region = REGIONS.find((r) => r.id === template.regionId);
      if (region) {
        for (const poi of region.pointsOfInterest) {
          if (!isDiscovered(poi.id) && Math.random() < poi.discoveryChance) {
            dispatch({ type: "DISCOVER_POI", poiId: poi.id, reward: poi.reward });
            break; // Only discover one per expedition
          }
        }
      }
    }

    setCombatPending(null);
  };

  const handleCombatDone = () => {
    if (combatPending) {
      finalizeClaim(combatPending.expeditionId, combatPending.rewards, combatPending.templateId);
    }
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
      <h2 className={styles.heading}>{"\u{1F5FA}\uFE0F"} World Map</h2>

      {/* Active Expeditions */}
      {state.expeditions.active.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.subheading}>Active</h3>
          {state.expeditions.active.map((exp) => {
            const remaining = Math.max(0, (exp.startedAt + exp.duration) - now);
            const pct = Math.min(((now - exp.startedAt) / exp.duration) * 100, 100);
            const template = EXPEDITIONS.find((e) => e.id === exp.templateId);

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
            const template = EXPEDITIONS.find((e) => e.id === exp.templateId);
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

      {/* Region Map */}
      <div className={styles.section}>
        <h3 className={styles.subheading}>Regions</h3>
        <div className={styles.regionList}>
          {REGIONS.map((region) => {
            const unlocked = isRegionUnlocked(region);
            const cleared = isRegionCleared(region.id);
            const discoveredCount = region.pointsOfInterest.filter(
              (p) => isDiscovered(p.id)
            ).length;

            return (
              <button
                key={region.id}
                className={`${styles.regionCard} ${!unlocked ? styles.regionLocked : ""} ${cleared ? styles.regionCleared : ""}`}
                style={{
                  "--region-accent": region.theme.accent,
                  "--region-bg": region.theme.bg,
                  "--region-border": region.theme.border,
                }}
                onClick={() => unlocked && setSelectedRegion(region)}
                disabled={!unlocked}
              >
                <div className={styles.regionHeader}>
                  <span className={styles.regionIcon}>
                    {unlocked ? region.icon : "\u{1F512}"}
                  </span>
                  <div className={styles.regionInfo}>
                    <span className={styles.regionName}>
                      {unlocked ? region.name : "Locked"}
                    </span>
                    {unlocked && (
                      <span className={styles.regionDesc}>{region.description}</span>
                    )}
                    {!unlocked && (
                      <span className={styles.regionDesc}>
                        Clear {region.unlockCondition} boss to unlock
                      </span>
                    )}
                  </div>
                  {cleared && <span className={styles.clearedBadge}>{"\u2714"}</span>}
                </div>
                {unlocked && (
                  <div className={styles.regionMeta}>
                    <span>{region.expeditions.length + 1} missions</span>
                    {discoveredCount > 0 && (
                      <span>{discoveredCount}/{region.pointsOfInterest.length} discoveries</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Region Detail Modal */}
      {selectedRegion && !selectedExpedition && (
        <RegionDetailModal
          region={selectedRegion}
          playerLevel={state.player.level}
          worldMap={state.worldMap}
          onSelectExpedition={(exp) => {
            setSelectedExpedition(exp);
            setSelectedHeroes([]);
          }}
          onClose={() => setSelectedRegion(null)}
        />
      )}

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
              {selectedExpedition.isBoss && <span className={styles.bossLabel}> BOSS</span>}
            </p>
            <div className={styles.rewardPreview}>
              {Object.entries(selectedExpedition.rewards.resources).map(([res, [min, max]]) => (
                <span key={res} className={styles.rewardChip}>
                  {RESOURCES[res]?.icon} {min}-{max}
                </span>
              ))}
            </div>

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
              Send Expedition ({formatDuration(
                getEffectiveExpeditionDuration(selectedExpedition, selectedHeroes, state.heroes)
              )})
            </button>
          </div>
        </Modal>
      )}

      {/* Combat Replay Modal */}
      {combatPending && (
        <CombatReplayModal
          combatResult={combatPending.combatResult}
          rewards={combatPending.rewards}
          onDone={handleCombatDone}
        />
      )}
    </div>
  );
}
