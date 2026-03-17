import { getSeasonBonusMultiplier } from "./season";
import { getPrestigeMultiplier } from "./prestige";

// Max offline progress: 8 hours
const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000;

export function calculateOfflineProgress(state) {
  const now = Date.now();
  const rawDelta = now - state.player.lastOnline;
  const delta = Math.min(rawDelta, MAX_OFFLINE_MS);
  if (delta <= 0) return null;

  const minutes = delta / 60000;
  const gained = {};

  // Apply prestige generator multiplier
  const genMult = getPrestigeMultiplier(state.prestige, "generator_mult");

  for (const [resource, gen] of Object.entries(state.generators)) {
    if (gen.ratePerMin > 0) {
      const bonus = getSeasonBonusMultiplier(resource);
      const amount = gen.ratePerMin * bonus * genMult * minutes;
      if (amount > 0) {
        gained[resource] = Math.round(amount * 100) / 100;
      }
    }
  }

  return {
    elapsed: rawDelta,
    capped: rawDelta > MAX_OFFLINE_MS,
    gained,
  };
}
