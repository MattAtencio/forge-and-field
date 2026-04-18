# Task 31: PrestigePanel Polish

## Objective
Bring PrestigePanel up to the Phase 1C visual bar. It currently uses plain div styling while the Hub/Forge/Barracks already wear PixelFrame. Add a parchment PixelFrame wrap, iron-style rebirth button with press juice, and a subtle ember shimmer on the Forge Marks count when it changes.

This is the "Reforging" surface — it should feel reverent, not dashboard-y.

## Context Files
- `components/PrestigePanel.jsx` (~150 lines) — read the full file first
- `components/PrestigePanel.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/shared/Modal.jsx` — reuse as-is. DO NOT modify.
- `data/prestige.js` — for reference only, do not modify
- For voice reference on any new copy: see `docs/PROJECT_PLAN.md` narrative voice section ("quiet warm authority")

## What To Build

### 1. PixelFrame wrap (parchment variant)
Wrap the main panel in a parchment PixelFrame. The Reforging is a solemn, reflective surface — parchment fits. Preserve all existing children.

### 2. Rebirth button juice
The "Rebirth" button (the one gated by `eligible`) is the emotional climax of the panel. Apply:
- An iron-style frame (PixelFrame's iron variant, or CSS border styled to match)
- Press-down animation on `:active` (~2px translateY, ~100ms)
- Subtle idle ember glow when eligible — NOT animated if `prefers-reduced-motion: reduce`
- Hover brightens the glow slightly

### 3. Forge Marks count shimmer
When `prestige.availableStars` changes (bonus purchased or rebirth granted more), the count briefly shimmers — warm ember tint fades in then out over ~600ms. Use a CSS animation keyed off a React `key` change or a `useEffect` that toggles a class. Honor `prefers-reduced-motion`.

### 4. Shop button + Bonus items visual tier
The "Marks of the Forge" shop button should wear the parchment style too (subtler than the iron rebirth). When the shop opens (`showShop` true), the rendered bonus cards get a subtle parchment treatment — already using Modal, so only tweak the card CSS.

### 5. Voice check
Any new player-facing copy you add must match "quiet warm authority." Don't add much — it's not a copy spec. If you need a label, keep the existing ones.

## Files You MUST Touch
- `components/PrestigePanel.jsx`
- `components/PrestigePanel.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only, reuse as-is
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- PrestigePanel wears a parchment PixelFrame, visually consistent with other polished screens.
- Rebirth button has press-down animation, idle ember glow (reduced-motion-safe), hover brightens.
- Forge Marks count shimmers briefly when it changes.
- Shop button matches parchment style.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. If you can trigger prestige in a test save, visually confirm the changes. Otherwise confirm by scanning the rendered DOM/CSS with devtools.
3. `curl http://localhost:3000` → 200
4. Reduced-motion emulation: no new animations fire.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Apply PixelFrame + rebirth juice to PrestigePanel`. Do NOT push.
