# Task 36: HubScreen Polish

## Objective
HubScreen is the landing screen — the first surface a returning player sees after any modal dismisses. Waves 1–3 polished nearly every screen the Hub navigates TO (Forge, Barracks, Expedition, Season, Village, Prestige, Welcome Back, Reward Summary). The Hub itself is still the weakest link: portal tiles are flat, the "next goal" banner doesn't earn its space, and a newly-unlocked portal has zero ceremony. This spec makes the Hub feel like the heart it's supposed to be.

## Context Files
- `components/HubScreen.jsx` (~450 lines — already imports PixelFrame at line 14; inspect current usage first)
- `components/HubScreen.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/sprites/Sprite.jsx` — reuse. DO NOT modify.
- Voice reference: "quiet warm authority" (see `docs/PROJECT_PLAN.md` Phase 1B)

## What To Build

### 1. Audit + extend PixelFrame coverage
HubScreen already imports PixelFrame. Read it first and identify which sections are framed. Goal: the three load-bearing sections (resource bar cluster, `NAV_TILES` grid, Next Goal banner) each sit in a PixelFrame — parchment for info cards, iron for the portal grid wrapper if it reads better there. Pick ONE consistent treatment per section; do not double-frame.

### 2. Portal tile press + hover feel
Each `NAV_TILES` entry renders as a tile. Give each tile:
- Hover: subtle brightness lift + 1px translateY up (100ms).
- Active/press: 2px translateY down + slight inset shadow (80ms).
- Locked tiles (`unlockLevel > playerLevel`): dim + muted, no hover lift, cursor `not-allowed`.

### 3. Newly-unlocked portal ember pulse
If a tile's `unlockLevel` equals `player.level` (meaning it JUST became available this level), add a soft ember halo pulse around the tile — ~2s loop, ~15% opacity peak, pure CSS `@keyframes`. Respect `prefers-reduced-motion: reduce` (no animation, keep static warm border instead).

Detection: since the level-up moment isn't tracked here, use the heuristic "level === unlockLevel" as the ember-pulse trigger. Acceptable to pulse for the whole level the tile was unlocked on.

### 4. Next Goal banner emphasis
`getNextGoal` returns `{ icon, title, hint, action }`. The banner currently renders plainly. Upgrade:
- Parchment frame.
- Icon left-aligned, larger (Sprite size 32–40).
- Title in title-font, hint in body-font muted tone.
- If `action` is non-null, the banner becomes clickable — press-down feel on the whole banner (not a separate button). Clicking routes to the named screen via existing dispatch.

### 5. Resource row: milestone tick
The resource row uses `getResourceTarget` to show milestones. Add a small tick mark / notch on each resource row's ProgressBar indicating the milestone, and the milestone number in muted tone to the right of the resource amount (e.g., "1,240 / 2,500"). Pure CSS tick, no new component.

## Files You MUST Touch
- `components/HubScreen.jsx`
- `components/HubScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only
- `components/shared/ProgressBar.jsx` — do NOT modify; the tick mark is an overlay div in HubScreen's CSS, not a prop on ProgressBar
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Three load-bearing Hub sections sit in PixelFrames (resources / portals / next-goal), no double-framing.
- Portal tiles have hover lift + press feedback; locked tiles are clearly dimmed and non-interactive.
- At least one unlockable portal in the roster shows the ember pulse when player.level matches its unlockLevel; pulse disabled under `prefers-reduced-motion`.
- Next Goal banner is visually heavier than before; clicking it (when action is non-null) navigates to the action screen.
- Resource rows show milestone tick and target number.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Load `/`, confirm the three framed sections + portal hover/press/lock states by eye.
3. Level up to hit an unlockLevel (or devtools-edit state) and confirm the ember pulse appears on that tile.
4. `curl http://localhost:3000` → 200.
5. Reduced-motion emulation: ember pulse reduces to static warm border.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Polish HubScreen portals, next-goal banner, and resource ticks`. Do NOT push.
