# Task 28: ExpeditionScreen Polish

## Objective
Apply the v2 visual treatment to the Expedition screen — PixelFrame wrapping, improved progress-bar styling, and small juice on the Send/Cancel buttons. ExpeditionScreen is currently less polished than Forge/Barracks/WorldMap; bring it to parity.

## Context Files
- `components/ExpeditionScreen.jsx` (194 lines)
- `components/ExpeditionScreen.module.css`
- `components/shared/PixelFrame.jsx` — reuse only, do NOT modify
- `components/WorldMapScreen.jsx` — look here for the PixelFrame pattern (uses `variant="iron"` for active/completed expedition cards)

## What To Build

### 1. PixelFrame wrapping
- Wrap the expedition-summary/list cards in `<PixelFrame variant="iron">` where appropriate. Mirror the pattern from `WorldMapScreen.jsx` (see its `.activeCard` / `.completedCard` usage) — same variant for same kind of UI element.
- If the screen has a top section showing current active expeditions, wrap each in `<PixelFrame variant="iron">` matching WorldMap's active-expedition card treatment.
- Strip duplicate `border`, `background`, `border-radius` from wrapped card selectors in the CSS module so the frame doesn't double up.

### 2. Progress bar upgrade
Wherever an expedition's progress is shown (fill bar, percent, etc.), replace it with the existing `components/shared/ProgressBar.jsx` component if it isn't already using it. If the progress bar is custom, bring it in line with the Hub/Forge progress bar visual (warm orange fill `#f97316` with neutral track).

### 3. Button juice
The Send / Cancel / Dismiss-completed buttons should use the existing `juiceBtn` global class (it's used in `components/ForgeScreen.jsx` — search for `juiceBtn`) to get the press-down bounce. If `juiceBtn` doesn't exist globally yet, ship this spec without it — don't define new global classes.

### 4. Scope red flags
If you find yourself wanting to restructure the screen's information architecture, add new features, or change expedition logic — STOP. This is a visual parity pass.

## Files You MUST Touch
- `components/ExpeditionScreen.jsx`
- `components/ExpeditionScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/PixelFrame.jsx`, `ProgressBar.jsx`, or any other shared component
- `components/WorldMapScreen.jsx` (read only; do NOT edit)
- `lib/*`, `data/*`
- any other component

## Acceptance Criteria
- Active / completed expedition cards render inside `<PixelFrame variant="iron">` with no duplicate borders
- Progress bar matches the warm-orange visual of the Hub/Forge progress bars
- Send/Cancel buttons feel "pressable" (bounce or press-down) — this requires `juiceBtn` to exist; if not, skip gracefully
- `npm run dev` succeeds, HTTP 200 on `/`
- No new console errors/warnings, no layout regression

## Verification
1. `npm run dev`
2. Navigate to Expeditions screen from the Hub
3. Send an expedition if possible; confirm the card treatment and progress bar look
4. `curl` → 200

## Code Style
- No narrative summary comments, no new .md files
- WHY-only comments

## Commit
One commit on the current worktree branch. Suggested message: `Apply PixelFrame + progress-bar polish to ExpeditionScreen`. Do NOT push.
