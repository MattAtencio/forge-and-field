// Streak bonus tuning. Lives separately from the reducer so future streak
// types (combat wins, daily logins, etc.) can reuse the same module.
export const STREAK_THRESHOLD = 3;          // 3 expeditions to trigger bonus
export const STREAK_RESOURCE_MULT = 1.25;   // +25% resources on bonus expedition
export const STREAK_ITEM_CHANCE_BONUS = 0.10; // +10 percentage points to item chance

export const STREAK_TOAST = "The road knows you now — the woods give more.";
