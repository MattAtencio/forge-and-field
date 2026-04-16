"use client";

import { useState, useRef } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { REGIONS } from "@/data/regions";
import { EXPEDITIONS } from "@/data/expeditions";
import { getRegionExpeditions, canSendExpedition, generateRewards, getEffectiveExpeditionDuration } from "@/lib/expedition";
import { getExpeditionDurabilityCost } from "@/lib/rarity";
import { getExpeditionEnduranceCost } from "@/lib/hero";
import { getBuildingEffect } from "@/data/village";
import { RESOURCES } from "@/data/resources";
import HeroCard from "./shared/HeroCard";
import Modal from "./shared/Modal";
import CombatReplayModal from "./CombatReplayModal";
import RewardSummaryModal from "./RewardSummaryModal";
import RegionDetailModal from "./RegionDetailModal";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./WorldMapScreen.module.css";

export default function WorldMapScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [combatPending, setCombatPending] = useState(null);
  const [rewardPending, setRewardPending] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [lockToast, setLockToast] = useState(null);
  const lockToastRef = useRef(null);
  const [discoveryPending, setDiscoveryPending] = useState(null);
  const [exploreHeroSelect, setExploreHeroSelect] = useState(null);

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

    let effectiveDuration = getEffectiveExpeditionDuration(
      selectedExpedition, selectedHeroes, state.heroes
    );
    const warCampLevel = state.village?.war_camp || 0;
    if (warCampLevel > 0) {
      const warEffect = getBuildingEffect("war_camp", warCampLevel);
      if (warEffect?.expeditionDurationMult) {
        effectiveDuration = Math.round(effectiveDuration * warEffect.expeditionDurationMult);
      }
    }

    dispatch({
      type: "SEND_EXPEDITION",
      expedition: { ...selectedExpedition, duration: effectiveDuration },
      heroIds: selectedHeroes,
    });
    setSelectedExpedition(null);
    setSelectedHeroes([]);
  };

  const handleStartExploration = (regionId) => {
    if (state.exploration?.active) return;
    if (idleHeroes.length === 0) return;
    if (idleHeroes.length === 1) {
      dispatch({ type: "EXPLORATION_START", regionId, heroId: idleHeroes[0].id });
    } else {
      setExploreHeroSelect(regionId);
    }
  };

  const handleSelectExploreHero = (heroId) => {
    if (!exploreHeroSelect) return;
    dispatch({ type: "EXPLORATION_START", regionId: exploreHeroSelect, heroId });
    setExploreHeroSelect(null);
  };

  const handleClaim = (exp) => {
    const template = EXPEDITIONS.find((e) => e.id === exp.templateId);
    if (!template) return;
    const rewards = generateRewards(template, exp.heroIds, state.heroes, state.inventory);

    if (rewards.combatResult) {
      setCombatPending({ combatResult: rewards.combatResult, rewards, expeditionId: exp.id, templateId: exp.templateId });
    } else {
      setRewardPending({ rewards, expeditionId: exp.id, templateId: exp.templateId, expeditionName: template?.name || "Expedition" });
    }
  };

  const finalizeClaim = (expeditionId, rewards, templateId, combatOutcome) => {
    const claimTemplate = EXPEDITIONS.find((e) => e.id === templateId);
    const baseDurabilityCost = claimTemplate ? getExpeditionDurabilityCost(claimTemplate) : 0;
    const baseEnduranceCost = claimTemplate ? getExpeditionEnduranceCost(claimTemplate) : 0;

    let durabilityMult = 1.0;
    let enduranceMult = 1.0;
    if (combatOutcome === "draw") {
      durabilityMult = 1.5;
      enduranceMult = 1.5;
    } else if (combatOutcome === "defeat") {
      durabilityMult = 2.0;
      enduranceMult = 2.0;
    }

    dispatch({
      type: "CLAIM_REWARDS",
      expeditionId,
      rewards,
      durabilityCost: Math.round(baseDurabilityCost * durabilityMult),
      enduranceCost: Math.round(baseEnduranceCost * enduranceMult),
    });

    const template = EXPEDITIONS.find((e) => e.id === templateId);
    if (template?.isBoss && rewards.combatResult?.victory) {
      const region = REGIONS.find((r) => r.bossExpedition === templateId);
      if (region && !isRegionCleared(region.id)) {
        dispatch({ type: "CLEAR_BOSS", regionId: region.id, bossExpeditionId: templateId });
        const nextRegion = REGIONS.find((r) => r.unlockCondition === region.id);
        if (nextRegion) {
          dispatch({ type: "UNLOCK_REGION", regionId: nextRegion.id });
        }
      }
    }

    let discovery = null;
    if (template?.regionId) {
      const region = REGIONS.find((r) => r.id === template.regionId);
      if (region) {
        for (const poi of region.pointsOfInterest) {
          if (!isDiscovered(poi.id) && Math.random() < poi.discoveryChance) {
            dispatch({ type: "DISCOVER_POI", poiId: poi.id, reward: poi.reward });
            discovery = poi;
            break;
          }
        }
      }
    }

    if (discovery) {
      setDiscoveryPending(discovery);
    }

    setCombatPending(null);
  };

  const handleCombatDone = () => {
    if (combatPending) {
      const outcome = combatPending.combatResult.victory
        ? "victory"
        : combatPending.combatResult.isDraw
        ? "draw"
        : "defeat";
      finalizeClaim(combatPending.expeditionId, combatPending.rewards, combatPending.templateId, outcome);
    }
  };

  // Temperature-band tints per region — reinforces warm-forge / cold-frontier
  // palette storytelling. Used as an outer box-shadow via --region-temp.
  const REGION_TEMP_TINT = {
    greenwood: "rgba(245, 158, 11, 0.15)",    // warm-gold
    stormridge: "rgba(148, 163, 184, 0.15)",  // cool-stone
    dusthaven: "rgba(251, 146, 60, 0.15)",    // amber
    frostpeak: "rgba(125, 211, 252, 0.15)",   // icy-cyan
    dragons_reach: "rgba(239, 68, 68, 0.15)", // volcanic-red
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
      <h2 className={styles.heading}>
        <Sprite name="map" size={22} /> World Map
      </h2>

      {/* Active Expeditions */}
      {state.expeditions.active.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.subheading}>Active</h3>
          {state.expeditions.active.map((exp) => {
            const remaining = Math.max(0, (exp.startedAt + exp.duration) - now);
            const pct = Math.min(((now - exp.startedAt) / exp.duration) * 100, 100);
            const template = EXPEDITIONS.find((e) => e.id === exp.templateId);

            return (
              <PixelFrame key={exp.id} variant="iron" className={styles.activeCard}>
                <div className={styles.activeHeader}>
                  <span><Sprite name={template?.icon || "map"} size={18} /></span>
                  <span className={styles.activeName}>{template?.name || "Unknown"}</span>
                  <span className={styles.activeTime}>{formatDuration(remaining)}</span>
                  {cancelConfirm === exp.id ? (
                    <div className={styles.cancelConfirm}>
                      <button
                        className={styles.cancelYes}
                        onClick={() => {
                          dispatch({ type: "CANCEL_EXPEDITION", expeditionId: exp.id });
                          setCancelConfirm(null);
                        }}
                      >
                        Yes
                      </button>
                      <button
                        className={styles.cancelNo}
                        onClick={() => setCancelConfirm(null)}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setCancelConfirm(exp.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                </div>
              </PixelFrame>
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
              <PixelFrame key={exp.id} variant="iron" glow className={styles.completedCard}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Sprite name={template?.icon || "map"} size={18} /> {template?.name || "Unknown"}
                </span>
                <button className={`${styles.claimBtn} juiceBtn`} onClick={() => handleClaim(exp)}>
                  Claim Rewards
                </button>
              </PixelFrame>
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
              <div
                key={region.id}
                role="button"
                tabIndex={0}
                className={`${styles.regionCard} ${!unlocked ? styles.regionLocked : ""} ${cleared ? styles.regionCleared : ""}`}
                style={{
                  "--region-accent": region.theme.accent,
                  "--region-temp": REGION_TEMP_TINT[region.id] || "rgba(148, 163, 184, 0.12)",
                  cursor: "pointer",
                }}
                aria-disabled={!unlocked}
                onClick={() => {
                  if (unlocked) {
                    setSelectedRegion(region);
                  } else {
                    clearTimeout(lockToastRef.current);
                    setLockToast(`Region locked \u00b7 Clear ${region.unlockCondition} boss to unlock`);
                    lockToastRef.current = setTimeout(() => setLockToast(null), 2500);
                  }
                }}
              >
                <PixelFrame variant="iron" glow={cleared} className={styles.regionCardInner}>
                  {cleared && (
                    <span className={styles.clearedTrophy} aria-hidden="true">
                      <Sprite name={region.icon} size={96} />
                    </span>
                  )}
                  <div className={styles.regionHeader}>
                    <span className={styles.regionIcon}>
                      <Sprite
                        name={unlocked ? region.icon : "lock"}
                        size={28}
                        muted={!unlocked}
                      />
                    </span>
                    <div className={styles.regionInfo}>
                      <span className={styles.regionName}>
                        {unlocked ? region.name : "Locked"}
                      </span>
                      {unlocked && (
                        <span className={styles.regionDesc}>{region.description}</span>
                      )}
                      {!unlocked && (
                        <>
                          <span className={styles.regionDesc}>
                            Clear {region.unlockCondition} boss to unlock
                          </span>
                          {region.lockedHint && (
                            <span className={styles.regionLockedHint}>{region.lockedHint}</span>
                          )}
                        </>
                      )}
                    </div>
                    {cleared && <span className={styles.clearedBadge}>Cleared</span>}
                  </div>
                  {unlocked && (
                    <div className={styles.regionMeta}>
                      <span>{region.expeditions.length + 1} missions</span>
                      {discoveredCount > 0 && (
                        <span>{discoveredCount}/{region.pointsOfInterest.length} discoveries</span>
                      )}
                    </div>
                  )}
                  {unlocked && state.player.level >= 6 && (
                    <button
                      className={`${styles.exploreBtn} juiceBtn`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartExploration(region.id);
                      }}
                      disabled={idleHeroes.length === 0 || state.exploration?.active}
                    >
                      Explore
                    </button>
                  )}
                  {unlocked && state.player.level === 5 && (
                    <span className={styles.exploreLocked}>
                      Explore — Unlocks at Level 6
                    </span>
                  )}
                </PixelFrame>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lock Toast */}
      {lockToast && (
        <div className={styles.lockToast}>
          <Sprite name="lock" size={16} /> {lockToast}
        </div>
      )}

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
                <span key={res} className={styles.rewardChip} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                  <Sprite name={RESOURCES[res]?.icon || res} size={14} /> {min}-{max}
                </span>
              ))}
            </div>

            <h4 className={styles.subheading}>Select Heroes</h4>
            <div className={styles.heroPicker}>
              {idleHeroes.length === 0 ? (
                <p className={styles.empty}>All hands are spoken for.</p>
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
              className={`${styles.sendBtn} juiceBtn`}
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

      {/* Reward Summary Modal (non-combat expeditions) */}
      {rewardPending && (
        <RewardSummaryModal
          rewards={rewardPending.rewards}
          expeditionName={rewardPending.expeditionName}
          onCollect={() => {
            finalizeClaim(rewardPending.expeditionId, rewardPending.rewards, rewardPending.templateId, "victory");
            setRewardPending(null);
          }}
        />
      )}

      {/* Explore Hero Selection */}
      {exploreHeroSelect && (
        <Modal title="Choose a Hero to Explore" onClose={() => setExploreHeroSelect(null)}>
          <div className={styles.heroPicker}>
            {idleHeroes.length === 0 ? (
              <p className={styles.empty}>All hands are spoken for.</p>
            ) : (
              idleHeroes.map((hero) => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  inventory={state.inventory}
                  onClick={() => handleSelectExploreHero(hero.id)}
                />
              ))
            )}
          </div>
        </Modal>
      )}

      {/* Discovery Callout */}
      {discoveryPending && !combatPending && !rewardPending && (
        <Modal title="Something Found" onClose={() => setDiscoveryPending(null)}>
          <div className={styles.discoveryCallout}>
            <div className={styles.discoveryIcon}>
              <Sprite name={discoveryPending.icon} size={48} />
            </div>
            <h3 className={styles.discoveryName}>{discoveryPending.name}</h3>
            <p className={styles.discoveryDesc}>{discoveryPending.description}</p>
            <button
              className={styles.discoveryBtn}
              onClick={() => setDiscoveryPending(null)}
            >
              Continue
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
