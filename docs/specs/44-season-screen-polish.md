# Task 44: SeasonScreen Deeper Polish

## Objective
SeasonScreen renders the current season's reward track + daily quests. Spec 25 added the PixelFrame banner. This spec is the full pass: reward-track ladder feel, claim-beat juice, daily quest cards, and the time-remaining countdown.

## Context Files
- `components/SeasonScreen.jsx` (~250 lines) — read fully first
- `components/SeasonScreen.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/shared/ProgressBar.jsx` — read-only. DO NOT modify.
- `components/sprites/Sprite.jsx` — read-only. DO NOT modify.
- Voice reference: "quiet warm authority"

## What To Build

### 1. Banner upgrade
Season banner already uses parchment PixelFrame (spec 25). Upgrade content within:
- Season name in title-font, larger.
- Bonus resource icon + label one line below.
- Time-remaining countdown: monospace font (or near-monospace tabular nums) for stable digit width, muted tone.
- When <24h remaining: countdown shifts to warm amber with a slow gentle pulse (~2s loop). Reduced-motion: color shift only.

### 2. Reward track ladder
The reward track currently renders as a list/grid of tiers. Reframe as a vertical or horizontal LADDER:
- Each tier is a bordered plate (iron or parchment-sub).
- Connecting line between tiers shows progress fill (warm tone for completed, muted for upcoming).
- Current XP marker on the line shows player's exact position.
- Claimed tiers: muted with a small ember "✓ claimed" chip.
- Unclaimed but earned tiers: ember pulse + "Claim" button glow.
- Locked tiers (XP not yet reached): muted + reqs visible.

### 3. Claim beat
When `handleClaim` fires, the claimed tier should have a brief celebration:
- Tier card gets a 600ms ember burst overlay.
- Reward icons fly outward briefly (CSS keyframes, ~400ms, fade out).
- Tier transitions to "claimed" muted state at end.
- Preserve dispatch + reducer behavior byte-for-byte. Animation is local CSS only.

### 4. Daily quest cards
Each daily quest (`DAILY_QUEST_DEFS`) renders as a card. Upgrade:
- Bordered parchment-sub plate.
- Progress mini-bar with warm fill.
- Completed but unclaimed: ember accent border + "Claim" button glow.
- Claimed: muted + small ember "✓ claimed" chip.
- Hover/press feedback on the Claim button: 2px translateY press, 80ms.

### 5. Section headings
Major section headings ("Reward Track", "Daily Quests", etc.) get the ember divider underline pattern from spec 35.

### 6. Empty states
If `dailyQuests` has no progress yet, show a quiet in-voice line ("The week is fresh." or similar — pick one). NOT a full-screen empty state, just one muted line at the bottom of the daily-quests section.

## Files You MUST Touch
- `components/SeasonScreen.jsx`
- `components/SeasonScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Banner countdown styled with tabular nums; <24h shifts warm amber with pulse (reduced-motion: color only).
- Reward track reads as a ladder with progress line + tier plates + state-distinct styling (claimed / unclaimed-earned / locked).
- Claim triggers ember burst + reward fly; reduced-motion-safe.
- Daily quest cards bordered with mini progress bar + state styling + button press feedback.
- Section headings carry ember divider underline.
- Empty-state in-voice line if no daily progress.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Navigate to Season. Verify banner, claim a tier (or devtools-set XP high enough to claim), verify daily quest states.
3. Devtools: set season time-remaining <24h to verify countdown tint.
4. `curl http://localhost:3000` → 200.
5. Reduced-motion: animations degrade gracefully.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Polish SeasonScreen reward ladder, claim beat, daily quests, and countdown`. Do NOT push.
