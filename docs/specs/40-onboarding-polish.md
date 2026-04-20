# Task 40: OnboardingModal Polish

## Objective
OnboardingModal is literally the first impression — 5 slides shown once on first boot. The content is solid (forge → gather → craft → expeditions → seasons), but the presentation is generic: plain overlay, flat icon, no transitions between slides, dots are bullets-basic. This is the only place Wave 1 PixelFrame polish didn't reach because OnboardingModal doesn't use the shared `Modal` component — it has its own overlay. This spec gives the onboarding a parchment-scroll feel, a page-turn-style slide transition, and an ember accent on the step dots.

## Context Files
- `components/onboarding/OnboardingModal.jsx` (~90 lines) — read the full file first
- `components/onboarding/OnboardingModal.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/sprites/Sprite.jsx` — reuse. DO NOT modify.
- Voice reference: "quiet warm authority" (see `docs/PROJECT_PLAN.md` Phase 1B)

## What To Build

### 1. Parchment PixelFrame wrap
This component has its own `.modal` div (not the shared Modal). Wrap `.modal`'s inner content in a parchment PixelFrame — or, preferred: turn the `.modal` itself into a parchment-styled panel by applying PixelFrame as a wrapper around the slide content, dots, and actions.

Keep the `.overlay` backdrop as-is. The PixelFrame goes inside.

### 2. Page-turn slide transition
When `slide` changes, the current slide content should fade/slide out and the new slide fades/slides in from the direction of travel (next = slide in from right, back = slide in from left). Target ~200ms each direction.

Implementation approach (pick one, whichever is cleanest):
- Track previous slide index in a `useRef` or `useState`, compute direction, key a CSS class on the `.slideContent` div.
- OR: render with a `key={slide}` on `.slideContent` + CSS `@keyframes` entrance to force a mount animation.

Respect `prefers-reduced-motion: reduce` — instant swap, no animation.

### 3. Icon ember glow
The slide icon sprite gets a soft ember-colored glow behind it — ~300ms fade-in on slide change, static afterward. Pure CSS `radial-gradient` or `box-shadow` on a wrapper. Not a loop.

### 4. Dots → ember pips
The step dots currently use `.dot` + `.dotActive`. Upgrade:
- Inactive dot: small muted circle.
- Active dot: ember-colored, slightly larger, warm glow.
- Passed dots (index < slide): medium tone, no glow — "already read."
- Future dots (index > slide): most muted.

Add a thin connecting line UNDER the dots (parchment-tone), so they read as a step track, not scattered bullets.

### 5. Button juice
- `nextBtn` (including its "Start Playing" final state): iron-style press-down (~2px translateY, 80ms). On the final "Start Playing" slide only, add a subtle warm glow behind the button — this is the moment the journey begins.
- `backBtn`: same press-down, no glow.

### 6. Title + body voice
Current copy is serviceable but functional. Lightly rewrite the 5 slide `text` fields to match the "quiet warm authority" voice from PROJECT_PLAN Phase 1B. Keep the same information; change the register. Target ~1 sentence each, no more than +10 words vs. current. Example register:

- Before: "Resources generate passively over time — even while you're away. Check back to collect your stockpile."
- After: "The forge fills its own coffers in your absence. When you return, the iron waits."

DO NOT change the `title` fields (those are crisp). DO NOT add or remove slides. Preserve icon names.

## Files You MUST Touch
- `components/onboarding/OnboardingModal.jsx`
- `components/onboarding/OnboardingModal.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Modal panel wears parchment PixelFrame.
- Slide transitions animate direction-aware (right for next, left for back), reduced-motion-safe.
- Icon has ember glow that fades in on slide change.
- Step dots form a track: passed / active / future each visually distinct; active dot has warm glow.
- Next and Back buttons have press feedback; "Start Playing" final state has additional warm glow.
- 5 slide text fields rewritten in voice; titles unchanged; slide count unchanged; icons unchanged.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Clear localStorage in devtools to force the onboarding to show (or devtools-set the relevant flag).
3. Click Next/Back through all 5 slides; confirm direction-aware transitions.
4. Confirm dot track: previous-active-future states visible.
5. Confirm final "Start Playing" state has warm glow on the button.
6. `curl http://localhost:3000` → 200.
7. Reduced-motion emulation: transitions degrade to instant; glows can stay static (they are not loops).

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Add parchment frame + page-turn transitions + ember dot track to OnboardingModal`. Do NOT push.
