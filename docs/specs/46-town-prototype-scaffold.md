# Task 46: Town Prototype Scaffold (Track B Iter 1 — Camera Feel)

## Objective
Per `docs/TWO_TRACK_PLAN.md` Track B Iteration 1 and the founder's Apr 16 framing: scaffold a standalone `/preview/town` route with a pan/zoom viewport and PLACEHOLDER RECTANGLES in place of buildings. The goal of this scaffold is to validate the camera/input feel BEFORE any pixel art lands. Real DALL-E concept art will replace the rectangles in Iteration 2.

This spec is **sealed from game state**: no `useGameState`, no `useGameDispatch`, no save, no reducer touch. It exists in its own corner of the app.

## Context Files
- `docs/TWO_TRACK_PLAN.md` — read the Camera/Input Locks + Visual Locks sections fully
- `app/preview/page.js` (existing — read for app-router conventions used in this project)
- `app/layout.js` (READ-ONLY — to understand global wrappers)
- `package.json`

## What To Build

### 1. Add dependency
Add `react-zoom-pan-pinch` (latest stable) to `package.json` dependencies. Run `npm install` in this worktree to update `package-lock.json` and install into the worktree's `node_modules`.

If the worktree shares `node_modules` with main repo via junction, install into main is acceptable — but `package.json` + `package-lock.json` MUST update in this worktree's git.

### 2. Create the route
New file: `app/preview/town/page.jsx`
- "use client" if it imports the client-only TownPrototype component.
- Renders `<TownPrototype />` only. No header, no nav, no game state.
- This page MUST work standalone — visiting `/preview/town` must not require any game state to exist.

### 3. Create the component
New files:
- `components/town/TownPrototype.jsx`
- `components/town/TownPrototype.module.css`

Implementation:
- Wrap a fixed-size scene canvas in `react-zoom-pan-pinch`'s `<TransformWrapper>` + `<TransformComponent>`.
- Scene canvas: 2.5× viewport wide, 1.5× tall (per Visual Locks). Use absolute viewport units derived from window size, OR a fixed pixel canvas (e.g., 1920×1080 baseline) — pick whichever the camera lib expects.
- Background: dusk-sky tone (~`#2a2438`) with a thin "Loam" tone (~`#6b5d3e`) at the lower 1/3 to suggest ground.
- Render 4 placeholder rectangles labeled in CSS for the 4 buildings: Forge (large warm-tinted), Barracks (long low cool-tinted), Gate (archway shape — narrow tall with cutout), Market (small bright awning-tinted). Use distinct sizes and silhouette aspect ratios per Silhouette Locks.
- Render 1 background silhouette cluster (3–5 tinted rectangles, smaller, behind the 4 hero buildings).
- Render ~10 prop placeholders (small uniform squares).
- Each of the 4 buildings has a click handler: `console.log("would enter Forge")` etc. NOT actual navigation.

### 4. Camera/Input locks (per TWO_TRACK_PLAN.md)
Configure `react-zoom-pan-pinch` with:
- **Bounds clamp** every frame (`limitToBounds: true` or equivalent). Non-negotiable.
- **Cursor-anchored zoom** (NOT center-zoom). The lib supports this via wheel handler config.
- **Zoom levels: integer multiples only — 0.5× / 1× / 2×.** Use `minScale: 0.5`, `maxScale: 2`, and `step` configured so wheel zoom snaps to integer levels (or use the lib's `centerZoomedOut` + custom button controls).
- **~300ms inertia decay** on drag release.
- **Rubber-band at bounds** (resist with ~0.3 multiplier past edge, spring back on release). The lib provides `panning.lockAxisX/Y` and bounds; if rubber-band isn't built-in, implement via CSS transform on the wrapper during overpan and reset onPanningStop.
- **Click-vs-drag via 5px movement hysteresis.** NOT timing thresholds. Track pointer-down position and only fire click if movement < 5px.
- **Pointer Events API** — lib uses these by default; verify.

### 5. Ambient motion (placeholder)
Two CSS-only ambient loops:
- "Chimney smoke": a small light-gray oval rising from the top of the Forge rectangle, fading out. ~3s loop.
- "Forge ember flicker": a warm dot near the Forge's bottom edge, opacity oscillates 0.5–1.0 at irregular timing. ~1.2s loop.
Both loops respect `prefers-reduced-motion: reduce` (static).

### 6. Hero shot lighting cue
The Forge rectangle gets a warm radial-gradient overlay around it (~150px radius, warm orange center → transparent). This is the "forge door is the only warm emissive light in the scene" lock. Everything else stays cool dusk-tinted. Pure CSS.

### 7. Dev affordances
- Visible zoom level indicator in the top-left corner ("0.5× / 1× / 2×") for debugging the camera feel.
- Three buttons "0.5× / 1× / 2×" in the top-right that snap to that zoom level. Useful for the founder review.
- Both indicators sit OUTSIDE the `<TransformComponent>` so they don't pan.

### 8. NOT in this iteration (DO NOT build)
- Real building art (DALL-E concepts staged in `art/` will land in Iter 2).
- NPCs of any kind.
- Real navigation into game screens.
- Game state, save persistence.
- Day/night/weather/seasons.
- Collision or physics.
- Non-integer zoom.
- Player pawn / character movement.

## Files You MUST Touch
- `package.json`
- `package-lock.json` (auto-updated by npm install)
- `app/preview/town/page.jsx` (new)
- `components/town/TownPrototype.jsx` (new)
- `components/town/TownPrototype.module.css` (new)

## Files You MUST NOT Touch
- Any existing `components/*.jsx` or `.module.css` in `components/` (other than the new `components/town/` files)
- `components/shared/*`, `components/sprites/*`
- `app/page.js`, `app/layout.js`, `app/preview/page.js`
- `lib/*`, `data/*`
- Any other route or component

## Acceptance Criteria
- `react-zoom-pan-pinch` installed, listed in `package.json` dependencies, `package-lock.json` updated.
- `/preview/town` route loads standalone without requiring game state.
- Pan via drag works; zoom via wheel works.
- Zoom snaps to integer multiples 0.5× / 1× / 2× only.
- Cursor-anchored zoom (zooming in zooms toward the cursor, not the center).
- Bounds clamped — cannot pan into the void; rubber-band visible at edges with spring-back on release.
- 300ms inertia on drag release.
- Click vs drag distinguished via 5px movement hysteresis (clicking a building logs to console; dragging does NOT log).
- Each of 4 building rectangles is clickable and logs `"would enter <Name>"`.
- Background silhouette cluster + ~10 prop placeholders render but are NOT clickable.
- Forge has warm radial-gradient lighting; rest of scene is cool dusk.
- Chimney smoke + ember flicker animate; reduced-motion: static.
- Zoom indicator + zoom buttons visible and functional.
- `npm run dev` succeeds, HTTP 200 on `/preview/town` (NOT just `/`).
- HTTP 200 on `/` still works (sanity — main game unaffected).
- No new console errors or warnings on either route.

## Verification
1. `npm install` (or confirm install happened) in this worktree.
2. `npm run dev`.
3. `curl http://localhost:3000/preview/town` → 200.
4. `curl http://localhost:3000/` → 200 (regression check).
5. Open `/preview/town` in browser. Test pan, zoom (wheel + buttons), click each building, drag without click, hold scroll past bounds for rubber-band, release for spring-back.
6. Reduced-motion: ambient loops degrade.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Scaffold /preview/town pan-zoom prototype with placeholder rectangles`. Do NOT push.
