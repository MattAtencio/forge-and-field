# Task 34: RewardSummaryModal Polish

## Objective
This modal fires at the end of every expedition — it's the "dopamine hit" the player sees dozens of times per session. It currently renders a flat list. Add staggered reveal animation (resources first, salvage second), rarity ember shimmer on Rare+ item chips, and a subtle narrative title refresh.

## Context Files
- `components/RewardSummaryModal.jsx` (~90 lines) — read the full file first
- `components/RewardSummaryModal.module.css`
- `components/shared/Modal.jsx` — reuse as-is. DO NOT modify.
- `lib/rarity.js` — read-only reference for `getRarityColor`, `getRarityLabel`. DO NOT modify.

## What To Build

### 1. Staggered reveal
On mount, resource chips animate in first (translateY 8px → 0 + opacity 0 → 1), one after another with ~60ms stagger. Then item/salvage chips animate in the same way after a ~200ms delay. Use CSS `animation-delay` with an inline style computed from index, or a pure CSS keyframe with per-child `nth-child` delays.

Honor `prefers-reduced-motion`: chips appear immediately at full opacity with no movement.

### 2. Rarity ember shimmer on Rare+ items
For items where `rarity === "rare" || rarity === "epic"`, add a slow left-to-right ember shimmer across the chip (CSS `background-image` + `@keyframes` sweep, ~2s cycle). Epic shimmer is slightly warmer/brighter than Rare. Use the existing `getRarityColor` for base border — don't invent new colors.

Honor `prefers-reduced-motion`: no shimmer, but Rare+ items still wear a subtle ember border glow as a static tell.

### 3. Title refresh (voice)
The current title is "Return from the Field". Keep this — it already hits the voice. But ALSO add a small dynamic subline underneath based on reward scale:
- If items array includes any `rare` or `epic` item: `"The woods were generous."`
- Else if total resource count > 20: `"A good haul. The forge waits."`
- Else if everything came back empty-ish (few resources, no items): `"Lean, but the road remembers you."`
- Else: no subline.

These strings go inline in the component — don't create a new data file.

### 4. Collect button juice
The "Return to Forge" / collect button gets iron-style press-down (~2px translateY, 100ms).

## Files You MUST Touch
- `components/RewardSummaryModal.jsx`
- `components/RewardSummaryModal.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Resource chips stagger-reveal, then item/salvage chips after a short delay.
- Rare+ items have the ember shimmer sweep (or static glow under reduced-motion).
- Dynamic subline reflects reward scale and matches narrative voice.
- Collect button has press feedback.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. If you can trigger an expedition complete + claim, watch the modal. Otherwise mount-test it via devtools with mock `rewards` prop.
3. `curl http://localhost:3000` → 200
4. Reduced-motion emulation: chips appear instantly, shimmer replaced by static glow.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Add stagger + rarity shimmer + voice subline to RewardSummaryModal`. Do NOT push.
