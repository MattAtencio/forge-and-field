import { SEASONS, getCurrentWeekNumber, getCurrentSeason, getSeasonTimeRemaining } from "@/data/seasons";

export { getCurrentSeason, getSeasonTimeRemaining };

export function getSeasonBonusMultiplier(resource) {
  const season = getCurrentSeason();
  if (season.bonusResource === resource) {
    return season.bonusMultiplier;
  }
  return 1.0;
}

export function isSeasonExclusiveRecipe(recipeId) {
  const season = getCurrentSeason();
  return season.exclusiveRecipes.includes(recipeId);
}

export function getSeasonRewardTrack() {
  return getCurrentSeason().rewardTrack;
}

export function formatTimeRemaining(ms) {
  if (ms <= 0) return "Ended";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");

  if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}
