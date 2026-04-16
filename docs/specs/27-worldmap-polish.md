# Task 27: WorldMap Polish

## Objective
Incremental polish on the World Map screen. PixelFrame is already applied everywhere that needs it — don't redo that. Focus on the three remaining gaps: a clearer **cleared-region flourish**, a **locked-region atmospheric tooltip** replacing the bare "requires Lv N" text, and **region temperature cues** that reinforce the warm-forge / cold-frontier palette storytelling.

## Context Files
- `components/WorldMapScreen.jsx` (491 lines) — the whole screen
- `components/WorldMapScreen.module.css`
- `components/shared/PixelFrame.jsx` — already imported and in use. Do NOT modify.
- `data/regions.js` — each region has an id (greenwood, stormridge, dusthaven, frostpeak, dragons_reach) and name/description

## What To Build

### 1. Cleared-region flourish
When a region's boss has been defeated (`state.worldMap.bossesDefeated[regionId]` is truthy), the region card shows:
- A small ember-tinted "Cleared" badge in the corner — reuse the iron-frame style; do NOT introduce a new color token
- A subtle permanent glow on the card border (~0.3 opacity, no animation — or use the existing PixelFrame `glow` prop if that already does it)
- The boss silhouette sprite shown at low opacity (~0.25) in the card background as a trophy

### 2. Locked-region atmospheric tooltip
When a region is `requiredLevel > player.level`, instead of a bare "Level N" lock label:
- Keep the lock icon but add a small flavor subtitle below the level requirement
- Subtitle text lives in `data/regions.js` — if the data field doesn't exist, ADD a `lockedHint` string to each region matching the narrative voice. Examples:
  - Stormridge: "The mountain road is rough. Travel it when you are ready."
  - Dusthaven: "The dust-road swallows the unprepared."
  - Frostpeak: "The cold up there does not forgive inexperience."
  - Dragon's Reach: "The black road is not for this season."
  - Greenwood should already be unlocked and not need one
- This small data edit is in-scope for THIS spec.

### 3. Region temperature cue
On each region card, apply a subtle outer drop-shadow tinted by the region's temperature band. Greenwood warm-gold, Stormridge cool-stone, Dusthaven amber, Frostpeak icy-cyan, Dragon's Reach volcanic-red. Use `box-shadow` with `rgba()` at ~0.15 opacity — it should be barely noticeable but add up across the screen to communicate "as you go further from the forge, the air gets colder."

Wrap the glow animation (if any) in `@media (prefers-reduced-motion: reduce) { animation: none; }`.

## Files You MUST Touch
- `components/WorldMapScreen.jsx`
- `components/WorldMapScreen.module.css`
- `data/regions.js` (add `lockedHint` per region — read the file, only add the field)

## Files You MUST NOT Touch
- `components/shared/PixelFrame.jsx`
- `components/ExpeditionScreen.jsx`, `components/HubScreen.jsx`, or any other screen
- `lib/*` — no reducer or save changes
- Any other `data/*` file

## Acceptance Criteria
- Cleared regions show a small "Cleared" badge + subtle trophy silhouette. Not yet cleared regions look unchanged.
- Locked regions show atmospheric flavor subtitle in addition to the level lock.
- Region cards have subtle temperature-band drop-shadows that reinforce palette storytelling.
- `prefers-reduced-motion: reduce` disables any new animations.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors/warnings.

## Verification
1. `npm run dev`
2. Navigate to World Map — confirm visual changes on a cleared vs. unlocked vs. locked region
3. `curl` (or node http.get if blocked) → 200
4. Reduced-motion emulation → no new animations

## Code Style
- No trailing summary comments, no planning .md output
- Comments only for non-obvious WHY

## Commit
One commit on the current worktree branch. Suggested message: `Add WorldMap cleared flourish + locked hints + region temperature cues`. Do NOT push.
