# Task 43: ForgeScreen Deeper Polish

## Objective
ForgeScreen is the heart of the game — the surface the founder named the game after. Spec 22 added craft sparkle + coin fly. This spec is the full chrome pass: recipe browse, queue/in-progress feel, anvil ambient, batch-sell flow, and the inventory tab side.

## Context Files
- `components/ForgeScreen.jsx` (~700 lines) — read fully first
- `components/ForgeScreen.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/shared/ItemCard.jsx` — read-only reference. DO NOT modify.
- `components/shared/Modal.jsx` — read-only. DO NOT modify.
- `components/sprites/Sprite.jsx` — read-only. DO NOT modify.
- `components/sprites/ResourceCost.jsx` — read-only.
- Voice reference: "quiet warm authority"

## What To Build

### 1. PixelFrame audit + extension
ForgeScreen already imports PixelFrame. Identify current usage. Goal: the three load-bearing zones (tab/header strip, recipe-or-inventory main panel, the action drawer with sell/upgrade/dismantle controls) each sit in a PixelFrame. Parchment for info, iron for action zones. No double-framing.

### 2. Tab strip feel
The "Recipes / Inventory" tab strip:
- Active tab wears iron-style plate with ember underline.
- Inactive tab is muted parchment-toned.
- Hover on inactive: warm lift + brighter border (100ms).
- Press: 2px translateY down (80ms).

### 3. Recipe card feel
Each recipe card in the recipes tab:
- Bordered parchment-sub-card look.
- Hover: warm lift + ember border brighten.
- Press: 2px translateY + inset shadow.
- Cannot-craft state (insufficient resources): muted with a thin red-tinted left edge bar.
- Resource cost chips (rendered via `ResourceCost` shared component) get a parchment border applied via wrapping CSS in ForgeScreen — do NOT modify ResourceCost itself.
- Recipe icons get a dim backing plate so silhouettes read on parchment.

### 4. Anvil ambient (subtle)
Add a very subtle ambient cue to the screen — a thin warm glow that lives at the bottom-edge of the main panel, like the forge fire behind it. Pure CSS gradient, ~200ms initial fade-in on mount, then static. NOT a loop. Reduced-motion: render static immediately.

### 5. Inventory tab item card chrome
The inventory tab renders items via shared `ItemCard`. Apply selection-mode chrome via the wrapping container, NOT by modifying ItemCard:
- Selected items in selection mode: ember accent ring around the card.
- Long-press visual feedback: warm grow-pulse during the long-press window, fades when released or fired.
- Sort + filter dropdowns: iron-style press feedback.

### 6. Batch sell flow polish
The batch-sell button + confirm flow:
- "Sell Selected" button: iron press feedback + warm glow on hover when ≥1 item selected.
- Confirm modal (if separate) or inline confirm: parchment frame, primary button has heavier press (3px translateY) — selling N items is a commitment.
- Coin fly already lands per spec 22 — preserve byte-for-byte.

### 7. Section headings
Major section headings get the ember divider underline pattern from spec 35.

## Files You MUST Touch
- `components/ForgeScreen.jsx`
- `components/ForgeScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only (includes ResourceCost)
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Three load-bearing zones framed, no double-framing.
- Tab strip: active vs. inactive distinct, hover/press feedback present.
- Recipe cards: hover/press/cannot-craft states all visible.
- Anvil-glow ambient at bottom edge of main panel; reduced-motion-safe (static).
- Inventory selection-mode shows ember accent on selected items; long-press has growing visual.
- Batch-sell button has hover glow + heavier press.
- Section headings carry ember divider underline.
- Sparkle + coin fly from spec 22 still works byte-for-byte (don't break it).
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Navigate to Forge. Switch tabs, hover recipe cards, craft an item (verify sparkle still fires), open inventory, enter selection mode, batch-sell.
3. `curl http://localhost:3000` → 200.
4. Reduced-motion: anvil-glow static; no other regressions.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Polish ForgeScreen tabs, recipe cards, anvil ambient, and batch-sell flow`. Do NOT push.
