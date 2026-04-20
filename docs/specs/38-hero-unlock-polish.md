# Task 38: HeroUnlockModal Polish

## Objective
HeroUnlockModal fires when a new champion joins the roster — a genuine "new hero" moment that currently reads as a stat card in a modal. This is one of the game's biggest reward beats; it should feel ceremonial. This spec gives it a silhouette-to-full reveal, parchment scroll framing, and an ember-forged accent that ties the new champion to the forge (per the "forge-touched" hero art direction).

## Context Files
- `components/HeroUnlockModal.jsx` (~60 lines) — read the full file first
- `components/HeroUnlockModal.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/shared/Modal.jsx` — reuse as-is. DO NOT modify.
- `components/sprites/Sprite.jsx` — reuse. DO NOT modify.
- Voice reference: "quiet warm authority" (see `docs/PROJECT_PLAN.md` Phase 1B)

## What To Build

### 1. Parchment PixelFrame wrap
Wrap the `.content` div in a parchment PixelFrame. Modal container stays shared-Modal. PixelFrame goes INSIDE.

### 2. Silhouette-to-full reveal
Each hero card should briefly render the hero sprite as a dark silhouette, then fade to full color over ~500–700ms on mount — the "forging the champion" beat.

Implementation: CSS `@keyframes` on the sprite wrapper — start with `filter: brightness(0) saturate(0)`, transition to `filter: none`. Layer an ember-colored glow pulse behind the sprite during the transition (peaks at ~50% of the animation, fades out by end).

Respect `prefers-reduced-motion: reduce` — skip the reveal, render full color immediately, no glow pulse.

### 3. Stat-row stagger
The four stat chips (HP / ATK / DEF / SPD) should fade + rise in one-by-one AFTER the silhouette reveal completes (~80ms between chips, ~200ms per chip).

Use CSS `animation-delay` keyed off `nth-child`. No JS staggering needed.

### 4. Ember accent border on hero card
Each `.heroCard` gets a subtle ember-colored inner border or left-edge accent bar (~3px, ember gradient). Ties the champions back to the forge visually. One accent, not a full frame — PixelFrame already wraps the content.

### 5. Title emphasis
The modal title ("A New Champion" / "New Arrivals") stays driven by the Modal component. Inside the content, add a one-line subtitle below the hero list, in voice: something quiet like "The forge remembers their name." Place BEFORE the existing hint line ("They await your craft in the Barracks."), not as a replacement.

### 6. Continue button juice
The Continue button gets iron-style press-down (~2px translateY, 80ms) and a subtle warm glow on hover (~300ms ease). Preserve click handler.

## Files You MUST Touch
- `components/HeroUnlockModal.jsx`
- `components/HeroUnlockModal.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Modal wears parchment PixelFrame inside the shared Modal.
- Hero sprite does silhouette-to-full reveal on mount with ember glow pulse, reduced-motion-safe.
- Stat chips fade + rise one after another after the silhouette reveal.
- Each hero card has an ember accent (inner border or edge bar).
- A one-line in-voice subtitle appears above the existing hint.
- Continue button has press + hover feedback.
- Multi-hero case (`multiple`) still renders correctly — each card animates independently.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Trigger the modal — either devtools-set `showHeroUnlock` or reach a level that unlocks a hero (level 3 unlocks Barracks + Mira; level 5 / 7 unlock others).
3. Visually confirm silhouette reveal + staggered stats + ember accent + subtitle.
4. Test the multi-hero case by forcing `heroes=[h1, h2]` in devtools if possible, or rapidly leveling through two unlock gates in the same session.
5. `curl http://localhost:3000` → 200.
6. Reduced-motion emulation: reveal degrades to immediate full-color, no glow, no stat stagger.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Add silhouette reveal + stat stagger + ember accent to HeroUnlockModal`. Do NOT push.
