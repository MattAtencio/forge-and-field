"use client";

import { useGameState, useGameDispatch } from "@/lib/gameContext";
import { getCurrentSeason, getSeasonTimeRemaining, formatTimeRemaining } from "@/lib/season";
import { RESOURCES } from "@/data/resources";
import ProgressBar from "./shared/ProgressBar";
import styles from "./SeasonScreen.module.css";

export default function SeasonScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const season = getCurrentSeason();
  const timeRemaining = getSeasonTimeRemaining();
  const { weeklyXP, claimedRewards } = state.season;

  const handleClaim = (tierIndex, reward) => {
    const rewardId = `${season.id}_tier_${tierIndex}`;
    if (claimedRewards.includes(rewardId)) return;
    dispatch({
      type: "CLAIM_SEASON_REWARD",
      rewardId,
      reward,
    });
  };

  const maxTrackXP = season.rewardTrack[season.rewardTrack.length - 1]?.xp || 800;

  const dailyQuests = state.dailyQuests || { progress: {}, claimed: [] };
  const DAILY_QUEST_DEFS = [
    { id: "craft_3", label: "Craft 3 Items", key: "craftItems", target: 3, reward: { resources: { gold: 30 }, xp: 15 } },
    { id: "expedition_2", label: "Complete 2 Expeditions", key: "completeExpeditions", target: 2, reward: { resources: { gold: 50, herbs: 10 }, xp: 25 } },
    { id: "level_hero", label: "Level Up a Hero", key: "levelUpHero", target: 1, reward: { resources: { gold: 40 }, xp: 20 } },
    { id: "sell_5", label: "Sell 5 Items", key: "sellItems", target: 5, reward: { resources: { gold: 20 }, xp: 10 } },
  ];

  const handleClaimDailyQuest = (quest) => {
    dispatch({ type: "CLAIM_DAILY_QUEST", questId: quest.id, reward: quest.reward });
  };

  return (
    <div className={styles.screen}>
      {/* Season Banner */}
      <div className={styles.banner} style={{ "--season-color": RESOURCES[season.bonusResource]?.color || "#f97316" }}>
        <span className={styles.bannerIcon}>{season.icon}</span>
        <div>
          <h2 className={styles.bannerName}>{season.name}</h2>
          <p className={styles.bannerDesc}>{season.description}</p>
        </div>
      </div>

      {/* Timer + Bonus */}
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Ends in</span>
          <span className={styles.metaValue}>{formatTimeRemaining(timeRemaining)}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Bonus</span>
          <span className={styles.metaValue} style={{ color: RESOURCES[season.bonusResource]?.color }}>
            {RESOURCES[season.bonusResource]?.icon} {season.bonusResource} +{Math.round((season.bonusMultiplier - 1) * 100)}%
          </span>
        </div>
      </div>

      {/* XP Progress */}
      <div className={styles.xpSection}>
        <ProgressBar
          value={weeklyXP}
          max={maxTrackXP}
          color={RESOURCES[season.bonusResource]?.color || "#f97316"}
          label="Season XP"
        />
      </div>

      {/* Daily Quests */}
      <div className={styles.track}>
        <h3 className={styles.subheading}>Daily Quests</h3>
        {DAILY_QUEST_DEFS.map((quest) => {
          const progress = dailyQuests.progress[quest.key] || 0;
          const complete = progress >= quest.target;
          const claimed = dailyQuests.claimed.includes(quest.id);

          return (
            <div
              key={quest.id}
              className={`${styles.tier} ${claimed ? styles.tierClaimed : ""} ${complete && !claimed ? styles.tierReady : ""}`}
            >
              <div className={styles.tierXP}>{Math.min(progress, quest.target)}/{quest.target}</div>
              <div className={styles.tierReward}>
                <span className={styles.questLabel}>{quest.label}</span>
                <div className={styles.questRewards}>
                  {quest.reward.resources && Object.entries(quest.reward.resources).map(([res, amt]) => (
                    <span key={res} className={styles.rewardChip}>
                      {RESOURCES[res]?.icon} {amt}
                    </span>
                  ))}
                  {quest.reward.xp > 0 && (
                    <span className={styles.rewardChip}>{"\u2B50"} {quest.reward.xp} XP</span>
                  )}
                </div>
              </div>
              <button
                className={styles.claimBtn}
                disabled={claimed || !complete}
                onClick={() => handleClaimDailyQuest(quest)}
              >
                {claimed ? "Done" : complete ? "Claim" : "..."}
              </button>
            </div>
          );
        })}
      </div>

      {/* Reward Track */}
      <div className={styles.track}>
        <h3 className={styles.subheading}>Reward Track</h3>
        {season.rewardTrack.map((tier, i) => {
          const rewardId = `${season.id}_tier_${i}`;
          const claimed = claimedRewards.includes(rewardId);
          const unlocked = weeklyXP >= tier.xp;

          return (
            <div
              key={i}
              className={`${styles.tier} ${claimed ? styles.tierClaimed : ""} ${unlocked && !claimed ? styles.tierReady : ""}`}
            >
              <div className={styles.tierXP}>{tier.xp} XP</div>
              <div className={styles.tierReward}>
                {tier.reward.type === "resources" &&
                  Object.entries(tier.reward.value).map(([res, amt]) => (
                    <span key={res} className={styles.rewardChip}>
                      {RESOURCES[res]?.icon} {amt} {RESOURCES[res]?.name}
                    </span>
                  ))}
                {tier.reward.type === "hero_xp" && (
                  <span className={styles.rewardChip}>
                    {"\u2B50"} {tier.reward.value} Hero XP
                  </span>
                )}
              </div>
              <button
                className={styles.claimBtn}
                disabled={claimed || !unlocked}
                onClick={() => handleClaim(i, tier.reward)}
              >
                {claimed ? "Claimed" : unlocked ? "Claim" : "Locked"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
