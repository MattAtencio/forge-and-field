# Task 41: ExplorationScreen Full Polish Pass

## Objective
ExplorationScreen is the node-map overworld a player traverses during an exploration run — the surface where push-or-retreat decisions happen. Spec 32 polished the COMBAT inside it; this spec polishes the MAP itself: node tiles, path lines, the current-node, the endurance bar, the retreat/defeat summary cards. Marcus deferred this in Wave 2 ("don't polish a placeholder") — exploration is now shipped, so it's no longer a placeholder.

## Context Files
- `components/ExplorationScreen.jsx` (~400 lines) — read fully first
- `components/ExplorationScreen.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/sprites/Sprite.jsx` — reuse. DO NOT modify.
- Voice reference: "quiet warm authority" (see `docs/PROJECT_PLAN.md` Phase 1B)

## What To Build

### 1. PixelFrame audit + extension
ExplorationScreen already imports PixelFrame. Read first and identify usage. Goal: the three load-bearing panels (top hero/endurance bar, the node-map viewport, the action drawer with consumables/flee) each sit in a PixelFrame — parchment for info, iron for the action drawer. No double-framing.

### 2. Node tile feel
Each node currently renders as a colored circle/square with a label. Upgrade:
- Each node type (combat/resource/rest/poi/boss/start) gets a distinct silhouette treatment via CSS — keep colors, add inner border / icon hint / shape variation so type reads at a glance even desaturated.
- Visited nodes: muted opacity + a subtle "✓" or dimmed checkmark.
- Adjacent reachable nodes: warm halo (~2s pulse, ~15% opacity), telegraphing "you can move here next."
- Unreachable / locked nodes: heavier mute, no halo.
- Current node: ember pulse ring + slight scale lift (1.05x). Pure CSS; respect `prefers-reduced-motion`.

### 3. Path lines between nodes
Connection lines should read as paths, not abstract lines:
- Reachable-from-current path: warm gold/ember tone.
- Visited path: muted parchment tone.
- Unreachable path: cool/dim.
Keep SVG/CSS implementation lightweight.

### 4. Endurance bar emphasis
The endurance display should feel scarce — it IS the push-or-retreat clock:
- ProgressBar wrapped with iron sub-frame styling (bordered plate look, NOT a nested PixelFrame).
- Below 30% endurance: bar shifts to warm-amber tone + subtle pulse.
- Below 15%: red tone, faster pulse, with a small in-voice subline ("Your strength wanes." or similar — pick one short line).
- Reduced-motion: drop pulses; keep color shift.

### 5. Boss-node distinction
Boss nodes get the heaviest treatment: ember accent border, slightly larger render, and if the player is adjacent to a boss node, the warm halo from §2 is replaced with a deeper golden glow + a one-line in-voice hint near the action drawer ("The deep iron waits." or similar — keep voice quiet).

### 6. Retreat/defeat summary polish
The `retreatSummary` and `defeatSummary` overlay states already render. Each gets a parchment PixelFrame, an in-voice headline (Retreat: warm; Defeat: muted/cool), the loot summary as bordered chips, and a primary "Return to Forge" button with iron-style press-down (~2px, 80ms). Preserve all existing data displayed.

## Files You MUST Touch
- `components/ExplorationScreen.jsx`
- `components/ExplorationScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only
- `components/ExplorationCombat.*` — separate component (was spec 32)
- `components/LootBagIndicator.*` — separate component (was spec 33)
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Three load-bearing panels framed (top bar / map viewport / action drawer), no double-framing.
- Node types read distinct via shape/inner cue, not just color.
- Adjacent reachable nodes pulse warm; current node has ember ring.
- Path lines tinted by traversal state (visited / reachable / locked).
- Endurance bar shifts color + pulses at <30% and <15%; in-voice subline appears at <15%.
- Boss nodes are visually heavier; adjacent-to-boss state gets a unique cue + in-voice hint.
- Retreat and defeat overlays each wear parchment frame with in-voice headline + loot chips + iron press button.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Force an exploration run (devtools-set state.exploration.active or play to a region). Visually walk through node states.
3. Drop endurance to <30% then <15% via devtools to verify color/pulse/subline.
4. Trigger retreat AND defeat to verify both overlays.
5. `curl http://localhost:3000` → 200.
6. Reduced-motion: pulses degrade gracefully; color/state still readable.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Polish ExplorationScreen node tiles, paths, endurance bar, and summary overlays`. Do NOT push.
