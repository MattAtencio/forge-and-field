# Task 45: VillageScreen Deeper Polish

## Objective
VillageScreen renders the village buildings list — passive bonus generators (Lumber Mill, Stone Quarry, etc.) the player upgrades over time. Spec 25 added PixelFrame wraps. This spec is the full chrome pass: building card silhouettes, upgrade beat, max-level state, affordance clarity, and ambient.

## Context Files
- `components/VillageScreen.jsx` (~150 lines) — read fully first
- `components/VillageScreen.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/sprites/Sprite.jsx` — read-only. DO NOT modify.
- Voice reference: "quiet warm authority"

## What To Build

### 1. Heading + subtitle polish
Current heading is "Village" with subtitle "Stone by stone, build what endures." Upgrade:
- Title-font for heading, ember divider underline (spec 35 pattern).
- Subtitle in muted body tone with subtle italic.
- Add a small "Buildings: N/M" count chip on the right (where N = built buildings, M = total). If all M are at max level, replace with "All endures." in voice.

### 2. Building card chrome
Each building card already wraps in PixelFrame. Inside:
- Building icon gets a bordered iron well backing — silhouette reads cleanly.
- Building name in title-font, level (e.g., "Lvl 3") in monospace muted to the right.
- Effect description in body tone, muted.
- Cost row: each resource gets a parchment-bordered chip (do not modify ResourceCost — wrap in CSS).

### 3. Upgrade button states
- Affordable: iron-style with warm glow; press 2px translateY (80ms).
- Unaffordable: muted with thin red-tinted edge; press disabled but cursor: not-allowed.
- Maxed (no `nextUpgrade`): replace button with a static ember chip "Built" or "Endured" (in-voice — pick one). No press feedback.

### 4. Upgrade beat
When `handleUpgrade` fires:
- Building card gets a 600ms ember burst overlay.
- Level number does a scale-bounce (1.0 → 1.2 → 1.0 over 400ms).
- New effect text fades in over 300ms (replacing previous effect).
- Reduced-motion: drop bounce/burst; keep instant level update.

Implementation: track an in-component `recentlyUpgradedId` (useState + setTimeout) to trigger the celebration class. Do NOT add new dispatch actions or state-machine work.

### 5. Maxed-building distinction
A maxed building card reads as "achieved":
- Subtle ember inner glow border (static, not pulsing).
- Effect description gets a small "✓" prefix in ember tone.
- Card opacity unchanged — maxed should feel earned, not muted.

### 6. Hover + ambient
- Building cards hover: warm lift (~1px translateY, 100ms).
- Optional ambient: a very subtle parchment-grain pattern on the screen background. CSS-only, no images. Skip if it competes with PixelFrame; the goal is "feels lived in," not "busy."

## Files You MUST Touch
- `components/VillageScreen.jsx`
- `components/VillageScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only (includes ResourceCost)
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Heading has ember divider underline + count chip ("N/M" or "All endures.").
- Building cards: icon in iron well, level in mono, cost chips bordered.
- Upgrade button states: affordable / unaffordable / maxed each visually distinct.
- Upgrade triggers ember burst + level scale-bounce + effect fade-in; reduced-motion-safe.
- Maxed buildings have ember inner glow (static) + ✓ prefix; not muted.
- Hover lift on cards.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Navigate to Village (level 8+ or devtools-unlock). Trigger an upgrade and confirm the celebration.
3. Devtools: max a building to verify "Built" / "Endured" state.
4. `curl http://localhost:3000` → 200.
5. Reduced-motion: animations degrade gracefully.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Polish VillageScreen building cards, upgrade beat, and maxed state`. Do NOT push.
