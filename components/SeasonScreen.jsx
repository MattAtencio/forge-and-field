"use client";

import { useState, useRef, useEffect } from "react";
import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getCurrentSeason, getSeasonTimeRemaining, formatTimeRemaining } from "@/lib/season";
import { RESOURCES } from "@/data/resources";
import ProgressBar from "./shared/ProgressBar";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./SeasonScreen.module.css";

// 24h threshold drives countdown urgency tint; one place to change later
const URGENCY_MS = 24 * 60 * 60 * 1000;
// Burst beat duration must outlive the longest claim keyframe (reward-fly = 400ms, ember = 600ms)
const CLAIM_BEAT_MS = 650;

export default function SeasonScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const season = getCurrentSeason();
  const timeRemaining = getSeasonTimeRemaining();
  const { weeklyXP, claimedRewards } = state.season;

  // Tracks which tier/quest is mid-celebration so CSS can briefly overlay the burst.
  // Cleared by setTimeout — no reducer/save involvement.
  const [burstingTier, setBurstingTier] = useState(null);
  const [burstingQuest, setBurstingQuest] = useState(null);
  const burstTimers = useRef([]);

  useEffect(() => {
    return () => {
      // Avoid setState on unmount if the player navigates away mid-beat
      burstTimers.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const handleClaim = (tierIndex, reward) => {
    const rewardId = `${season.id}_tier_${tierIndex}`;
    if (claimedRewards.includes(rewardId)) return;
    setBurstingTier(tierIndex);
    burstTimers.current.push(setTimeout(() => setBurstingTier(null), CLAIM_BEAT_MS));
    dispatch({
      type: "CLAIM_SEASON_REWARD",
      rewardId,
      reward,
    });
  };

  const maxTrackXP = season.rewardTrack[season.rewardTrack.length - 1]?.xp || 800;
  // XP marker pinned to the connector line; capped at 100 so over-XP doesn't overshoot the rail
  const xpPct = Math.min((weeklyXP / maxTrackXP) * 100, 100);

  const dailyQuests = state.dailyQuests || { progress: {}, claimed: [] };
  const DAILY_QUEST_DEFS = [
    { id: "craft_3", label: "Craft 3 Items", key: "craftItems", target: 3, reward: { resources: { gold: 30 }, xp: 15 } },
    { id: "expedition_2", label: "Complete 2 Expeditions", key: "completeExpeditions", target: 2, reward: { resources: { gold: 50, herbs: 10 }, xp: 25 } },
    { id: "level_hero", label: "Level Up a Hero", key: "levelUpHero", target: 1, reward: { resources: { gold: 40 }, xp: 20 } },
    { id: "sell_5", label: "Sell 5 Items", key: "sellItems", target: 5, reward: { resources: { gold: 20 }, xp: 10 } },
  ];

  // "Fresh week" empty-state: zero progress AND nothing claimed yet
  const noDailyProgress =
    DAILY_QUEST_DEFS.every((q) => (dailyQuests.progress[q.key] || 0) === 0) &&
    dailyQuests.claimed.length === 0;

  const handleClaimDailyQuest = (quest) => {
    setBurstingQuest(quest.id);
    burstTimers.current.push(setTimeout(() => setBurstingQuest(null), CLAIM_BEAT_MS));
    dispatch({ type: "CLAIM_DAILY_QUEST", questId: quest.id, reward: quest.reward });
  };

  const urgent = timeRemaining > 0 && timeRemaining < URGENCY_MS;

  return (
    <div className={styles.screen}>
      {/* Season Banner — name + bonus + countdown all live inside the parchment frame */}
      <div style={{ "--season-color": RESOURCES[season.bonusResource]?.color || "#f97316" }}>
        <PixelFrame variant="parchment" className={styles.banner}>
          <span className={styles.bannerIcon}><Sprite name="season" size={32} /></span>
          <div className={styles.bannerBody}>
            <h2 className={styles.bannerName}>{season.name}</h2>
            <p className={styles.bannerBonus}>
              <Sprite name={RESOURCES[season.bonusResource]?.icon || season.bonusResource} size={14} />
              <span>
                {season.bonusResource} <span className={styles.bonusPct}>+{Math.round((season.bonusMultiplier - 1) * 100)}%</span>
              </span>
            </p>
            <p className={`${styles.bannerCountdown} ${urgent ? styles.bannerCountdownUrgent : ""}`}>
              <span className={styles.countdownLabel}>Ends in</span>
              <span className={styles.countdownValue}>{formatTimeRemaining(timeRemaining)}</span>
            </p>
          </div>
        </PixelFrame>
      </div>

      {/* XP Progress — keeps the existing top-line summary above the ladder */}
      <div className={styles.xpSection}>
        <ProgressBar
          value={weeklyXP}
          max={maxTrackXP}
          color={RESOURCES[season.bonusResource]?.color || "#f97316"}
          label="Season XP"
        />
      </div>

      {/* Daily Quests */}
      <div className={styles.section}>
        <h3 className={styles.subheading}>Daily Quests</h3>
        <div className={styles.questList}>
          {DAILY_QUEST_DEFS.map((quest) => {
            const progress = dailyQuests.progress[quest.key] || 0;
            const complete = progress >= quest.target;
            const claimed = dailyQuests.claimed.includes(quest.id);
            const bursting = burstingQuest === quest.id;

            const cardClass = [
              styles.questCard,
              claimed ? styles.questClaimed : "",
              complete && !claimed ? styles.questReady : "",
              bursting ? styles.bursting : "",
            ].filter(Boolean).join(" ");

            return (
              <PixelFrame key={quest.id} variant="parchment" className={cardClass}>
                <div className={styles.questHead}>
                  <span className={styles.questLabel}>{quest.label}</span>
                  {claimed && <span className={styles.claimedChip}>✓ claimed</span>}
                </div>
                <div className={styles.questProgress}>
                  <ProgressBar
                    value={Math.min(progress, quest.target)}
                    max={quest.target}
                    color="#f97316"
                    height={4}
                  />
                </div>
                <div className={styles.questFoot}>
                  <div className={styles.questRewards}>
                    {quest.reward.resources && Object.entries(quest.reward.resources).map(([res, amt]) => (
                      <span key={res} className={styles.rewardChip}>
                        <Sprite name={RESOURCES[res]?.icon || res} size={12} /> {amt}
                      </span>
                    ))}
                    {quest.reward.xp > 0 && (
                      <span className={styles.rewardChip}><Sprite name="season" size={12} /> {quest.reward.xp} XP</span>
                    )}
                  </div>
                  {!claimed && (
                    <button
                      className={`${styles.claimBtn} ${complete ? styles.claimBtnReady : ""}`}
                      disabled={!complete}
                      onClick={() => handleClaimDailyQuest(quest)}
                    >
                      {complete ? "Claim" : `${Math.min(progress, quest.target)}/${quest.target}`}
                    </button>
                  )}
                </div>
                {bursting && (
                  <>
                    <span className={styles.burst} aria-hidden="true" />
                    <span className={styles.flyA} aria-hidden="true" />
                    <span className={styles.flyB} aria-hidden="true" />
                  </>
                )}
              </PixelFrame>
            );
          })}
        </div>
        {noDailyProgress && (
          <p className={styles.emptyLine}>The week is fresh.</p>
        )}
      </div>

      {/* Reward Track — vertical ladder with a connector rail + XP marker */}
      <div className={styles.section}>
        <h3 className={styles.subheading}>Reward Track</h3>
        <div className={styles.ladder}>
          {/* Rail backdrop + warm fill = visual progress between tier plates */}
          <div className={styles.rail} aria-hidden="true">
            <div className={styles.railFill} style={{ height: `${xpPct}%` }} />
            <div className={styles.railMarker} style={{ top: `${xpPct}%` }} />
          </div>
          <div className={styles.ladderRungs}>
            {season.rewardTrack.map((tier, i) => {
              const rewardId = `${season.id}_tier_${i}`;
              const claimed = claimedRewards.includes(rewardId);
              const unlocked = weeklyXP >= tier.xp;
              const bursting = burstingTier === i;

              const tierClass = [
                styles.rung,
                claimed ? styles.rungClaimed : "",
                unlocked && !claimed ? styles.rungReady : "",
                !unlocked ? styles.rungLocked : "",
                bursting ? styles.bursting : "",
              ].filter(Boolean).join(" ");

              return (
                <PixelFrame key={i} variant={unlocked ? "iron" : "parchment"} className={tierClass}>
                  <div className={styles.rungXP}>{tier.xp} <span className={styles.rungXPUnit}>XP</span></div>
                  <div className={styles.rungReward}>
                    {tier.reward.type === "resources" &&
                      Object.entries(tier.reward.value).map(([res, amt]) => (
                        <span key={res} className={styles.rewardChip}>
                          <Sprite name={RESOURCES[res]?.icon || res} size={12} /> {amt} {RESOURCES[res]?.name}
                        </span>
                      ))}
                    {tier.reward.type === "hero_xp" && (
                      <span className={styles.rewardChip}>
                        <Sprite name="season" size={12} /> {tier.reward.value} Hero XP
                      </span>
                    )}
                  </div>
                  {claimed ? (
                    <span className={styles.claimedChip}>✓ claimed</span>
                  ) : (
                    <button
                      className={`${styles.claimBtn} ${unlocked ? styles.claimBtnReady : ""}`}
                      disabled={!unlocked}
                      onClick={() => handleClaim(i, tier.reward)}
                    >
                      {unlocked ? "Claim" : "Locked"}
                    </button>
                  )}
                  {bursting && (
                    <>
                      <span className={styles.burst} aria-hidden="true" />
                      <span className={styles.flyA} aria-hidden="true" />
                      <span className={styles.flyB} aria-hidden="true" />
                      <span className={styles.flyC} aria-hidden="true" />
                    </>
                  )}
                </PixelFrame>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
