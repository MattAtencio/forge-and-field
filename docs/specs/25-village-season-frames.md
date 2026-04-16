# Task 25: Apply Pixel Frames to Village + Season Screens

## Objective
Phase 1C deliverable: apply the existing `PixelFrame` component to the Village and Season screens so they match the Forge and Barracks visual treatment. Purely CSS + a couple of JSX wrapper edits. Isolated to two screens and their CSS modules.

## Context Files (READ to understand)
- `components/shared/PixelFrame.jsx` — the reusable 9-slice pixel art frame component. Props: `tone` (likely "parchment" | "iron" or similar — inspect the file to confirm), children.
- `components/HubScreen.jsx` or `components/ForgeScreen.jsx` — look for how `PixelFrame` is already applied to cards/panels on existing screens. Mirror that pattern.
- `components/VillageScreen.jsx` + `components/VillageScreen.module.css` — target
- `components/SeasonScreen.jsx` + `components/SeasonScreen.module.css` — target

## What To Build

### 1. VillageScreen
Wrap the primary building cards (one per village building) in `<PixelFrame tone="parchment">…card content…</PixelFrame>`. Wrap the screen header/section titles in `<PixelFrame tone="iron">…</PixelFrame>` if and only if the existing Forge/Barracks screens do the same for their headers — match the pattern, don't invent.

Adjust `VillageScreen.module.css` so the outer card styles that previously drew their own borders defer to the frame (remove duplicate `border`, `box-shadow`, and rounded corners that now conflict with PixelFrame).

### 2. SeasonScreen
Same treatment for the weekly progress tiers, reward cards, and any claimed/unclaimed reward boxes. Use `tone="parchment"` for information cards, `tone="iron"` for action buttons or call-to-action blocks — again, match the Forge/Barracks precedent.

### 3. Narrative voice
Do NOT rewrite copy. This is purely a visual wrap — text stays as-is.

## Files You MUST Touch
- `components/VillageScreen.jsx`
- `components/VillageScreen.module.css`
- `components/SeasonScreen.jsx`
- `components/SeasonScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/PixelFrame.jsx` (reuse only, do not modify)
- `components/HubScreen.*`, `ForgeScreen.*`, `BarracksScreen.*` (do not touch)
- `lib/*`, `data/*`
- any other component

## Acceptance Criteria
- Village and Season cards render with the same parchment/iron frame treatment as Forge/Barracks
- No layout regression (widths, scroll, clickable regions unchanged)
- No duplicate borders or double-nested frames
- `npm run dev` succeeds, HTTP 200 on `/`
- No new console errors/warnings

## Verification
1. `npm run dev`
2. Navigate to Village — confirm building cards now wear the frame
3. Navigate to Season — confirm reward tiers use the frame
4. Visual diff against Forge screen should show consistent treatment
5. Curl HTTP 200

## Code Style
- No narrative summary comments, no new .md files
- Only add comments where WHY is non-obvious
- If you find yourself wanting to refactor a screen layout significantly, stop — this is a frame-wrap pass only. Out-of-scope changes get reverted.

## Commit
One commit on the current branch. Suggested message: `Apply PixelFrame to Village and Season screens`. Do NOT push.
