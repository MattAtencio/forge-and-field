# Task 35: WelcomeBackModal Polish

## Objective
WelcomeBackModal is the return-session hook — the first thing a player sees when they come back after being away. The Phase 0 overhaul got the CONTENT right (expeditions, chests, quests, action prompt). This spec gets the PRESENTATION right: parchment PixelFrame wrap, icon-led section chips, ember divider between sections, and stronger emphasis on the recommended action.

## Context Files
- `components/WelcomeBackModal.jsx` (~150 lines) — read the full file first
- `components/WelcomeBackModal.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/shared/Modal.jsx` — reuse as-is. DO NOT modify.
- `components/sprites/Sprite.jsx` — reuse. DO NOT modify.
- Voice reference: "quiet warm authority" (see `docs/PROJECT_PLAN.md` Phase 1B)

## What To Build

### 1. Parchment PixelFrame wrap
Wrap the main content body in a parchment PixelFrame. Preserve all existing sections, content, and logic. The modal already uses shared `Modal` — the PixelFrame goes INSIDE the Modal's children.

### 2. Section chip styling
The modal renders groups like "Expeditions complete," "Chests ready," "Daily quests reset," "Crafts done." Each group becomes a small chip/card with:
- A Sprite icon on the left matching the section (expedition → map/banner, chests → chest, daily → season, crafts → anvil — use existing sprite names; if unsure, check `components/sprites/Sprite.jsx` registry)
- Main count text
- Subtitle (e.g., "×3" or region/recipe summary) in muted tone

Keep existing conditional logic for when a section appears. Don't invent new sections.

### 3. Ember divider
Between sections, a thin horizontal divider with a subtle ember-color gradient (fades out at edges). Pure CSS. No animation.

### 4. Recommended action emphasis
The `getRecommendedAction` string (e.g., "Chests await your hand.") should be the visual anchor of the modal — larger font, ember accent color, centered. Position it BELOW the section chips so the player reads "here's what changed, here's what to do next."

### 5. Dismiss/primary-action button juice
Whatever the primary close/continue button is, give it iron-style press-down (~2px translateY, 100ms). If there are 2 buttons, only the primary gets the full treatment.

## Files You MUST Touch
- `components/WelcomeBackModal.jsx`
- `components/WelcomeBackModal.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Modal body wears parchment PixelFrame.
- Each section is an icon-led chip (Sprite + count + subtitle).
- Ember divider separates sections, not animated.
- Recommended action is the biggest, warmest element in the modal.
- Primary button has press feedback.
- Existing conditional logic for when sections show is preserved.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Force the modal open (set `state.showWelcomeBack = true` via devtools, or trigger by advancing time in a test save). Visually confirm.
3. `curl http://localhost:3000` → 200
4. Reduced-motion emulation: no animations regress (there shouldn't be any new animated ones here).

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Apply parchment frame + section chips + ember divider to WelcomeBackModal`. Do NOT push.
