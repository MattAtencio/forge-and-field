# Task 39: RegionDetailModal Polish

## Objective
RegionDetailModal opens when the player clicks a region on the World Map — it's the "what can I do here" surface for a region. Waves 1–3 gave WorldMap polish (spec 27) but this modal is still plain: mission cards look like generic rows, the boss card doesn't feel like a boss, locked missions have zero mystique, and there's no sense of the region's identity (Greenwood's warmth vs. Frostpeak's chill). This spec gives the modal parchment framing, a region temperature accent, and a boss card that reads as THE objective.

## Context Files
- `components/RegionDetailModal.jsx` (~150 lines) — read the full file first
- `components/RegionDetailModal.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/shared/Modal.jsx` — reuse as-is. DO NOT modify.
- `components/sprites/Sprite.jsx` — reuse. DO NOT modify.
- `data/regions.js` (READ-ONLY — to look up what fields a region has for temperature cue)
- Voice reference: "quiet warm authority" (see `docs/PROJECT_PLAN.md` Phase 1B)

## What To Build

### 1. Parchment PixelFrame wrap
Wrap the `.detail` div in a parchment PixelFrame. Description, headings, mission list, boss card all inside.

### 2. Region temperature accent
Read the region's identity (check `region` prop fields — likely `id`, `name`, or a climate tag). Apply a single color accent to the modal's top border or heading underline:
- Greenwood → warm gold/green
- Stormridge → muted blue-slate
- Dusthaven → desert amber
- Frostpeak → cool ice-blue
- Dragon's Reach → volcanic ember-red

Fallback to neutral if the region id isn't in the map. This is a single CSS accent — a border-top color or an underline gradient under the region name — not a full-screen tint.

Implement as a CSS-variable-driven class derived from `region.id`. Do NOT hardcode inline styles — keep theming in the .module.css.

### 3. Mission card upgrade
Each `.missionCard` button gets:
- A subtle parchment-sub-card look (thin border, slightly warmer background on hover).
- Hover: warm lift (~1px translateY, 100ms) + brighter border.
- Press: 2px translateY down + inset shadow (80ms).
- The reward chips row already uses Sprites — give each chip a thin parchment border so they read as discrete tokens, not glued text.

### 4. Locked mission mystique
Locked missions render via the `missionLocked` modifier. Upgrade:
- Increase muting (lower opacity on icon + text).
- The lock icon gets a very subtle cool-blue tint.
- Mission name renders as "— — — — —" (em-dash placeholder) instead of the real name. Keep the level requirement text intact.
- Hover does nothing (already non-interactive).

### 5. Boss card emphasis
The boss expedition block currently shares styling with regular missions. Upgrade:
- Iron-style frame (use styling, NOT another PixelFrame inside the parchment one).
- Ember accent underline/border specific to boss.
- If `bossDefeated`, show a subtle desaturated "cleared" state — boss art dimmed, a small ember-colored "✓ cleared" chip, no press feedback.
- If `bossAvailable && !bossDefeated`, press-down feedback is slightly heavier than missions (~3px translateY) — this is the big commitment.
- If `bossExpedition && !bossAvailable`, lock state like other locked missions but with a warning-flavored hint ("Prove yourself. Return when ready." or similar in-voice).

### 6. Subheading style
The `h4` subheadings ("Expeditions", etc.) get a thin ember divider underline (the same pattern from spec 35 WelcomeBackModal — fades at edges).

## Files You MUST Touch
- `components/RegionDetailModal.jsx`
- `components/RegionDetailModal.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only
- `lib/*`, `data/*` — no reducer, save, or data changes (reading is fine for the temperature map)
- Any other component file

## Acceptance Criteria
- Modal body wears parchment PixelFrame.
- Region temperature accent is visible and differs across the 5 regions (spot-check by switching regions).
- Mission cards have hover lift + press feedback; reward chips have parchment borders.
- Locked missions hide name via em-dash placeholder, keep level requirement visible.
- Boss card is visually distinct: iron frame + ember accent, desaturated cleared state, heavier press for the available-but-undefeated state.
- Subheadings have ember divider underline.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Open the World Map, click each of the 5 regions — confirm temperature accent shifts per region.
3. Confirm locked missions render em-dash names and the level requirement.
4. If a boss is defeated in the save, confirm cleared state. If not, confirm press weight differs from regular missions.
5. `curl http://localhost:3000` → 200.
6. Reduced-motion: no animation regressions (no new animated loops added here; hover/press use short transitions, which are fine).

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Add parchment frame + region temp accent + boss emphasis to RegionDetailModal`. Do NOT push.
