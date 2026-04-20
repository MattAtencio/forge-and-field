# Task 37: CombatReplayModal Polish

## Objective
CombatReplayModal narrates the offscreen idle-expedition combat — a short, paced replay of who hit whom that ends with Victory/Draw/Defeat and rewards. The content is right (highlights filter, ~600ms stagger, skip button). The PRESENTATION is flat: log lines slide in plainly, enemy chips are a basic row, and the result verdict (Victory/Draw/Defeat) lands with no weight. This spec gives the replay the parchment-report feel of reading the day's dispatch from the field.

## Context Files
- `components/CombatReplayModal.jsx` (~150 lines) — read the full file first
- `components/CombatReplayModal.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/shared/Modal.jsx` — reuse as-is. DO NOT modify.
- `components/sprites/Sprite.jsx` — reuse. DO NOT modify.
- Voice reference: "quiet warm authority" (see `docs/PROJECT_PLAN.md` Phase 1B)

## What To Build

### 1. Parchment PixelFrame wrap
Wrap the main `.combat` container in a parchment PixelFrame. The modal already uses shared `Modal` — the PixelFrame goes INSIDE the Modal's children, around the combat content. Preserve all existing sections and logic.

### 2. Enemy chip upgrade
`enemyRow` currently renders each enemy in a simple chip. Upgrade:
- Iron-style sub-frame or bordered plate look via CSS.
- Boss enemies (`e.isBoss`) get a subtle gold/ember accent border or ember underline — they should read as "the big one" instantly.
- Icon sprite gets a dim backing plate behind it so silhouettes don't disappear on parchment.

### 3. Log line stagger juice
Each highlight line currently appears via `visibleLines++`. Add per-line entrance:
- Fade + 4px translateY from below, ~180ms ease-out.
- Respect `prefers-reduced-motion: reduce` (no translate, fade only or instant).

Use CSS animation keyed on mount — no JS animation libs. Lines already stagger via the 600ms interval; this adds per-line polish on top.

### 4. Kill-line emphasis
When a log entry renders a defeat (`entry.targetHp === 0`), the text gets a brief warm flash on appearance (~400ms warm glow fades to neutral) and the defeated enemy name is bolder. Pure CSS — trigger via a `kill` modifier class already implied by the data.

### 5. Verdict reveal
`resultLabel` (Victory / Draw / Defeat) currently renders plain. Upgrade:
- Larger font, centered, letter-spaced.
- Victory: ember/gold glow behind the text (~600ms ease-in, no loop).
- Draw: muted amber, no glow.
- Defeat: desaturated, slightly translated down like a dropped banner.
- `multLabel` (1.5x / 0.75x / 0.5x) and `consequenceLabel` render below in a tighter, muted style as "the cost."

Verdict entrance animates once on `showResult` becoming true; static afterward. Respect `prefers-reduced-motion`.

### 6. Skip-button feel
Skip button gets iron-style press-down (~2px translateY, 80ms). No other changes to click-through behavior.

## Files You MUST Touch
- `components/CombatReplayModal.jsx`
- `components/CombatReplayModal.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only
- `components/sprites/*` — read-only
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Modal body wears parchment PixelFrame.
- Enemy chips have bordered plate look; bosses read as boss.
- Log lines fade + slide in per entry, reduced-motion-safe.
- Kill lines flash warm on appearance.
- Verdict (Victory/Draw/Defeat) is the visual anchor of the result phase — distinct color + animation per outcome.
- Skip button has press feedback.
- Existing filter logic (`highlights` slice, 12-line cap, 600ms stagger, skip flow) is preserved byte-for-byte in behavior.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Force an expedition to complete (devtools or wait) and open the modal via the Hub. Trigger victory, defeat, draw separately (stub enemy HP if needed) to verify each verdict state.
3. `curl http://localhost:3000` → 200.
4. Reduced-motion emulation: log lines and verdict should degrade gracefully (no translate/glow).

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Add parchment frame + log stagger + verdict reveal to CombatReplayModal`. Do NOT push.
