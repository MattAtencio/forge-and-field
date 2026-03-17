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
