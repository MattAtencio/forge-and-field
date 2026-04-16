# Task 30: Expedition Streak Bonus

## Objective
Reward players for focused region attention with a streak bonus. **After 3 consecutive completed expeditions in the same region, the next expedition in that region gets +25% resources and +10% item drop chance.** Streak resets to 0 when the player completes an expedition in a different region.

Pure backend + toast. **No screen UI modifications** — avoids conflict with Wave 2 Specs 27/28.

## Context Files
- `lib/gameReducer.js` — has a `completeExpedition`-ish action. Search for `"completeExpeditions"` (daily quest counter) and `EXPEDITION` to find the right case. The complete-expedition action applies rewards.
- `lib/save.js` — current version is 8. Bump to 9 and add migration.
- `data/expeditions.js` — has `regionId` per expedition (`greenwood`, `stormridge`, etc.)

## What To Build

### 1. State
In `createInitialState()`:
```js
expeditionStreak: {
  regionId: null,
  count: 0,
},
```

### 2. Constants (top of `lib/gameReducer.js` or in a new data file)
```js
export const STREAK_THRESHOLD = 3;          // 3 expeditions to trigger bonus
export const STREAK_RESOURCE_MULT = 1.25;   // +25% resources on bonus expedition
export const STREAK_ITEM_CHANCE_BONUS = 0.10; // +10 percentage points to item chance
```

These can live at the top of `lib/gameReducer.js` or in a new `data/streaks.js` (your call — pick whichever keeps the change minimal). Prefer a new `data/streaks.js` since it's reusable for later streak types.

### 3. Reducer logic — EXPEDITION_COMPLETE case

Find the reducer case that handles expedition completion (search `completeExpeditions` or `EXPEDITION_COMPLETE` in gameReducer.js). At the START of that case, BEFORE computing rewards:
- Determine whether THIS expedition is the bonus-triggering one:
  - If `state.expeditionStreak.regionId === expedition.regionId && state.expeditionStreak.count >= STREAK_THRESHOLD`, apply the bonus to THIS expedition's rewards (multiply resources by 1.25, add 0.10 to itemChance roll).
  - After applying, reset streak for this region: `count: 0, regionId: expedition.regionId` (i.e. the streak re-builds from scratch but stays in the same region).

Update `expeditionStreak` state after:
- If expedition's `regionId` matches `state.expeditionStreak.regionId`: increment count by 1 (unless bonus was just consumed, in which case it's already reset to 0).
- If regionId differs: reset to `{ regionId: expedition.regionId, count: 1 }`.

On bonus trigger, set `_toast` to: `"The road knows you now — the woods give more."` (quiet warm authority voice, generic enough to apply to any region; don't per-region tailor the toast for scope).

### 4. Save migration (`lib/save.js`)
Bump `CURRENT_VERSION` from 8 to 9. Add:
```js
if (data.version < 9) {
  if (!data.expeditionStreak) {
    data.expeditionStreak = { regionId: null, count: 0 };
  }
  data.version = 9;
}
```
Preserve existing v7 and v8 migrations verbatim.

### 5. No UI changes this spec
Do NOT add streak indicators to WorldMapScreen or ExpeditionScreen (those are separate parallel specs). Just the toast when the bonus fires.

## Files You MUST Touch
- `lib/gameReducer.js` (initial state + EXPEDITION_COMPLETE case)
- `lib/save.js` (version bump + migration)
- `data/streaks.js` (new, optional — constants can live in reducer if you prefer)

## Files You MUST NOT Touch
- `components/WorldMapScreen.jsx`, `components/ExpeditionScreen.jsx`, or any other screen
- `data/expeditions.js`, `data/regions.js`, or any gameplay data
- `lib/expedition.js` (reward calc may live here — read it to understand the shape, but keep streak logic IN the reducer)

## Acceptance Criteria
- Complete 3 expeditions in Greenwood (any mix of successes): `state.expeditionStreak` shows `{ regionId: "greenwood", count: 3 }`
- The NEXT Greenwood expedition: rewards are multiplied by 1.25, item chance gets +0.10, toast fires
- Switching to a Stormridge expedition after a Greenwood streak of 5: streak resets to `{ regionId: "stormridge", count: 1 }`, no bonus
- Save version 8 → 9 migration works on existing saves
- `npm run dev` succeeds, HTTP 200 on `/`
- No new console errors/warnings

## Verification
1. `npm run dev`
2. In browser console, inspect `localStorage` save and confirm `expeditionStreak` present, version 9
3. Manually test via console dispatch or play 3–4 expeditions to see toast fire
4. `curl` → 200

## Code Style
- No narrative summary comments
- WHY-only comments (e.g., the "streak re-builds in same region after bonus is consumed" behavior is non-obvious — one short WHY comment is warranted there)
- No new .md files beyond this spec

## Commit
One commit on the current worktree branch. Suggested message: `Add expedition streak bonus (+25% resources, +10% item chance after 3 same-region runs)`. Do NOT push.
