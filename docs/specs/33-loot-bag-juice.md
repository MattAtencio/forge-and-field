# Task 33: LootBagIndicator Juice

## Objective
The loot bag indicator is currently a plain button with a chest icon and a count. In exploration, the loot bag is the thing the player is constantly weighing ("is this enough to retreat with?"). It deserves weight. Add fill-state visuals, a pulse when loot is added, and a subtle ember glow when non-empty.

## Context Files
- `components/LootBagIndicator.jsx` (~23 lines) — small file, read the full thing
- `components/LootBagIndicator.module.css`
- `lib/exploration.js` — read-only reference for `getLootBagSummary` shape. DO NOT modify.
- The indicator is imported by `ExplorationScreen.jsx` — do NOT modify that file (another agent may be touching exploration-adjacent code in Wave 3).

## What To Build

### 1. Fill-state visual tiers
The indicator currently shows Empty / `N +M` text. Add tiered visual states based on total resource+item count:
- **Empty:** current rendering (dim chest icon, muted text)
- **Light (1–5):** chest icon tinted neutral, slight bump in opacity
- **Full (6–15):** chest icon tinted warm, count slightly larger
- **Heavy (16+):** chest icon with ember tint, count bold, subtle rim glow

Compute the tier from `summary.resourceCount + summary.itemCount`. All thresholds go in CSS via utility classes + a small React prop-to-className helper.

### 2. Pulse on increment
When the loot bag gains items/resources (bag count goes up from last render), fire a one-shot pulse animation on the indicator (~300ms scale 1 → 1.08 → 1). Implementation: track previous count in a `useRef`, when current > previous briefly toggle a CSS class. Honor `prefers-reduced-motion`: no pulse under reduce, but still flash a brief ember glow fade-in as feedback (0.3s opacity rise+fall).

### 3. Ember glow (non-empty idle)
While `!summary.isEmpty`, a soft warm halo around the button (CSS `box-shadow` with ember color at low opacity). Not animated — just a steady tell. Empty = no glow. This reinforces "the bag has weight."

### 4. Micro press-down on click
Light `:active` press (~1–2px translateY, 80ms). Nothing else.

## Files You MUST Touch
- `components/LootBagIndicator.jsx`
- `components/LootBagIndicator.module.css`

## Files You MUST NOT Touch
- `components/ExplorationScreen.jsx`, `components/ExplorationCombat.jsx` — explicitly off limits this wave
- `lib/exploration.js` — read-only
- `components/shared/*` — read-only
- Any other component file

## Acceptance Criteria
- Indicator shows 4 fill-state visual tiers (empty / light / full / heavy) by total count.
- Gaining loot triggers a one-shot pulse (or fade-in-glow under reduced-motion).
- Non-empty bag has a steady ember halo; empty bag does not.
- Tactile click feel.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Inspect the rendered indicator via devtools in each state (empty / light / full / heavy) — easy to force via className toggles in devtools if test save isn't set up.
3. `curl http://localhost:3000` → 200
4. Reduced-motion emulation: no pulse, fade-in-glow fallback present.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Add fill-tier visuals + pulse + ember glow to LootBagIndicator`. Do NOT push.
