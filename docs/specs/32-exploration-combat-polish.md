# Task 32: ExplorationCombat UI Polish

## Objective
The interactive combat UI is mechanically complete but visually plain. Add the juice that makes turn-based combat feel good: iron-framed action panel, damage number float-ups, hit-flashes on hero/enemies, and a crisp turn indicator. This is the most-played active surface in the demo — it has to feel alive.

## Context Files
- `components/ExplorationCombat.jsx` (~200 lines) — read the full file first
- `components/ExplorationCombat.module.css`
- `components/shared/PixelFrame.jsx` — already imported in this file. Reuse. DO NOT modify.
- For reference only: `lib/interactiveCombat.js` (don't edit), `lib/consumables.js` (don't edit)

## What To Build

### 1. Iron-framed action panel
The hero-turn action buttons (Attack / Skill / Item / Flee) live in a panel at the bottom. Wrap that panel in an iron PixelFrame. Iron = action context; parchment = information context. Preserve all existing button logic, `onClick` handlers, and disabled states.

### 2. Damage number float-ups
When combat log entries include damage (existing log has entries like `{ type: "damage", targetId, amount, ... }` or similar — inspect the log structure in the `combat.log` array at runtime), render a short-lived floating number over the target combatant's sprite:
- Red-tinted for enemy-hit-hero damage, ember-tinted for hero-hit-enemy damage
- Float ~24px up, fade out over ~800ms
- Honor `prefers-reduced-motion`: static number that fades without movement
- Implementation hint: track recent log entries in a `useEffect`, queue float-ups with unique keys, remove them after their animation. Don't touch the reducer.

If the log doesn't cleanly expose per-event damage numbers, SKIP damage number floats and add a hit-flash only. Don't invent new reducer actions.

### 3. Hit-flash
When a combatant is hit, briefly flash their portrait/sprite (white or red overlay at ~0.4 opacity for ~150ms). Same `useEffect`-off-log pattern as damage numbers. Honor reduced-motion.

### 4. Turn indicator
A clearer "Hero's turn" / "Enemy's turn" label — pill-shaped, parchment for hero-turn, dimmer for enemy-turn. Subtle pulse on hero-turn (reduced-motion safe).

### 5. Action button press-down juice
The 4 action buttons get a short press-down + "thunk" micro-animation on `:active` (~2px translateY, ~100ms). Not a separate library; pure CSS.

## Files You MUST Touch
- `components/ExplorationCombat.jsx`
- `components/ExplorationCombat.module.css`

## Files You MUST NOT Touch
- `lib/interactiveCombat.js`, `lib/gameReducer.js`, or any other `lib/*` — no reducer or engine changes
- `components/shared/*` — read-only
- Any other component file

## Acceptance Criteria
- Action panel wears iron PixelFrame.
- Damage numbers float up from target combatants (or hit-flash if damage numbers can't be extracted from log structure cleanly).
- Hero turn vs enemy turn is visually obvious at a glance.
- Action buttons have tactile press-down feel.
- Reduced-motion disables float/pulse animations but keeps static indicators.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. If you can trigger combat through a test save, play a round. Otherwise inspect the rendered JSX + CSS via devtools.
3. `curl http://localhost:3000` → 200
4. Reduced-motion emulation: animations disabled, static states remain.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Add iron frame + hit-flash + turn indicator to ExplorationCombat`. Do NOT push.
