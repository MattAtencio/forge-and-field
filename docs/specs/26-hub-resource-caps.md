# Task 26: Hub Resource Cap Indicators

## Objective
In the Hub screen's resource summary row (top of the Hub), show a visual cap indicator per resource: a small progress bar or ring that fills as the resource approaches some cap or notable threshold. Gives the player an at-a-glance sense of storage pressure and creates a light return-session hook.

This is intentionally small. Scope: visual-only. No reducer changes. No new data fields. Hub file only.

## Context Files (READ to understand)
- `components/HubScreen.jsx` — where resources are displayed
- `components/HubScreen.module.css`
- `data/resources.js` — the resource dictionary (name, icon, color)
- `lib/gameReducer.js` — DO NOT modify; just read to understand `state.resources` shape

## Current Behavior
The Hub shows resource counts as plain numbers next to icons. There is no cap concept in the game yet for most resources. Rather than inventing one, we use an "aspirational target" scale that shows progress toward round-number milestones the player is most likely to care about next.

## What To Build

### 1. Target calculation
In `HubScreen.jsx`, add a pure local helper:
```js
function getResourceTarget(resourceKey, amount) {
  // Find the next milestone in this cap ladder for the resource.
  const ladder = [50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000];
  for (const tier of ladder) {
    if (amount < tier) return tier;
  }
  return Math.ceil(amount / 10000) * 10000 + 10000;
}
```

(Why: gives a visually-satisfying fill that moves on normal timescales without us needing a real cap system.)

### 2. Indicator UI
For each resource row or chip already rendered in the Hub's resource bar:
- Keep the existing icon + number unchanged
- Below (or beside, depending on existing layout) add a thin progress bar (~2–3px tall) that fills from 0 to `amount / target`
- Fill color: the resource's own `color` from `RESOURCES[key].color`
- Background color: a dim neutral (e.g. `rgba(255,255,255,0.08)`)
- When `amount >= target`, pulse gently (1.5s loop, low-opacity). Under `prefers-reduced-motion: reduce`, the pulse disables.

Aim for a subtle, information-rich look — these are background signals, not alarms.

### 3. Do not touch
- Do NOT add a cap concept to reducer or save state
- Do NOT change any resource data in `data/resources.js`
- Do NOT change how resources are actually generated or consumed

## Files You MUST Touch
- `components/HubScreen.jsx`
- `components/HubScreen.module.css`

## Files You MUST NOT Touch
- `lib/gameReducer.js`, `lib/tick.js`, `lib/save.js`
- `data/resources.js`, any other `data/*`
- `components/shared/*`
- any other component

## Acceptance Criteria
- Each resource in the Hub's resource row shows a thin fill bar below/beside the number
- Fill is tinted with the resource's color
- Bar animates/pulses once filled to target, respects `prefers-reduced-motion`
- Numbers and existing layout unchanged
- `npm run dev` succeeds, HTTP 200 on `/`
- No new console errors/warnings

## Verification
1. `npm run dev`
2. Open Hub — bars render below/beside resource numbers
3. Watch a bar fill as the resource ticks up
4. Toggle DevTools reduced-motion emulation — confirm pulse disables
5. Curl HTTP 200

## Code Style
- No narrative summary comments
- One comment explaining the ladder WHY (already drafted above, keep that)
- No new .md files
- No `!important` unless strictly necessary

## Commit
One commit on the current branch. Suggested message: `Add Hub resource cap indicators with milestone ladder`. Do NOT push.
