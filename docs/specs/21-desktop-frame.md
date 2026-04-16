# Task 21: Desktop Frame

## Objective
Wrap the 430px game viewport with a decorative forge-workshop frame on wide screens so the game does not look like a phone emulator sitting in black void on a 1080p monitor. Required before Steam submission (Phase 3A).

## Problem Statement
Game viewport is capped at `max-width: 430px`. On desktop (≥768px), 75% of the screen is dead black. On Steam the screenshot looks like a phone mock-up. We need atmosphere on the sides.

## What To Build

### 1. New component `components/DesktopFrame.jsx` (client component)
A wrapper that renders children centered. On screens `<768px` wide, render children as-is (no frame). On screens `≥768px`, render a decorative border/vignette around the children slot.

```jsx
"use client";
import styles from "./DesktopFrame.module.css";

export default function DesktopFrame({ children }) {
  return (
    <div className={styles.frame}>
      <div className={styles.vignetteLeft} aria-hidden="true" />
      <div className={styles.vignetteRight} aria-hidden="true" />
      <div className={styles.viewport}>{children}</div>
    </div>
  );
}
```

### 2. New file `components/DesktopFrame.module.css`
- `.frame` — full viewport (100vw / 100vh), `display: flex; justify-content: center; align-items: center;`, background `radial-gradient` from `#1a0f08` (warm dark) at center to `#0a0604` at edges, overflow hidden.
- `.viewport` — `max-width: 430px; width: 100%;`, on desktop a subtle border (1px `#b45309` with low opacity) and a warm inner shadow to frame the game.
- `.vignetteLeft` / `.vignetteRight` — absolute positioned panels filling the dead space on either side. Use a CSS `background` of radial/linear gradients with warm `#78350f` / `#a16207` / `#b45309` ember-stone palette; layer in a subtle dotted or noise pattern via `background-image` using inline SVG data URI for a stone texture feel. Include a soft ember glow at the top (50% opacity, radial from `#f97316` fading out). Keep it tasteful — decorative, not busy.
- Media query `@media (max-width: 767px)`: hide `.vignetteLeft` and `.vignetteRight`, strip the border on `.viewport`, set frame background to the existing page background so mobile is unchanged.
- Respect `@media (prefers-reduced-motion)` — no animation either way, but if you add any ember flicker keep it off under reduced motion.

### 3. Modify `app/page.js`
Wrap the dynamically-imported `ForgeAndField` render in `<DesktopFrame>`. Do NOT touch anything inside `components/ForgeAndField.jsx` — just the page shell.

Current `app/page.js` is short (~16 lines) and uses `next/dynamic` with `ssr: false`. Import `DesktopFrame` directly (it's a client component so it's fine inside a client-only dynamic mount).

## Palette (from `art/ART_BIBLE.md`)
- `#1a0f08` — warm dark base (anchors the frame)
- `#78350f` — forge stone shadow
- `#a16207` — worn iron
- `#b45309` — leather/ember-lit edge
- `#f97316` — forge ember (use sparingly — one glow only)

## Files You MUST Touch
- `components/DesktopFrame.jsx` (new)
- `components/DesktopFrame.module.css` (new)
- `app/page.js` (wrap)

## Files You MUST NOT Touch
- `components/ForgeAndField.jsx`
- any other component
- any `lib/` or `data/` file

## Acceptance Criteria
- At 1920x1080 viewport: game viewport centered at 430px, warm stone/ember decor fills the void on both sides, no ugly dead black
- At 375x667 (mobile viewport): game renders unchanged — no frame artifacts, no layout shift
- `npm run dev` succeeds, `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` returns 200
- No new console warnings
- `prefers-reduced-motion: reduce` honored (no animation by default is fine)

## Verification
1. `npm run dev` in your worktree
2. Open DevTools, toggle device mode between "Responsive 1920x1080" and "iPhone SE" — frame appears only on desktop
3. Confirm HTTP 200 with curl

## Code Style
- No trailing summary comments, no planning docs, no `.md` output
- Only add a code comment if the WHY is non-obvious
- Keep CSS compact, no `!important` unless fighting a specific override

## Commit
One commit on the current branch. Suggested message: `Add DesktopFrame for wide-screen Steam presentation`. Do NOT push.
