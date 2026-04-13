# Task 12: Hero Status "exploring" Integration

## Objective
Ensure the "exploring" hero status integrates correctly with existing systems — heroes can't go on expeditions, craft, or be sent elsewhere while exploring.

## Input Files
- `lib/gameReducer.js` — hero status checks
- `components/BarracksScreen.jsx` — hero management UI
- `components/WorldMapScreen.jsx` — expedition sending
- `lib/expedition.js` — `canSendExpedition()` function

## What To Build

### 1. Update expedition guard in `lib/expedition.js`

In `canSendExpedition()`, add a check for "exploring" status:

```js
// Hero must be idle to go on an expedition
if (hero.status !== "idle") return false;
```

This already works IF the status is set correctly. Verify this check exists and covers "exploring".

### 2. Update BarracksScreen hero display

In `components/BarracksScreen.jsx`, add "exploring" as a recognized status:
- Show "Exploring [Region Name]" as the hero's current activity
- Disable the "Send on Expedition" button for exploring heroes
- Show exploration-specific info (current endurance, loot bag summary)

Add to the status display logic:
```jsx
{hero.status === "exploring" && (
  <span className={styles.statusExploring}>
    Exploring {getRegionById(state.exploration.regionId)?.name}
  </span>
)}
```

### 3. Update WorldMapScreen expedition UI

In `components/WorldMapScreen.jsx`, filter out exploring heroes from the available hero list when sending expeditions:

```js
const idleHeroes = state.heroes.filter((h) => h.status === "idle");
// This already works — "exploring" heroes have status !== "idle"
```

Verify this filter is in place and renders correctly.

### 4. Prevent tick/offline from breaking exploration

In `lib/tick.js`, ensure the tick system doesn't interfere with exploring heroes:
- Don't auto-complete expeditions for exploring heroes (they're not on expeditions)
- Don't modify exploring hero's endurance via passive regen

## Acceptance Criteria
- Heroes with status "exploring" cannot be sent on expeditions
- Barracks shows "Exploring [Region]" for exploring heroes
- World Map hero selector only shows idle heroes
- Tick system ignores exploring heroes
- No console errors when a hero is exploring
- `npm run dev` succeeds

## Files Modified
- `components/BarracksScreen.jsx`
- `lib/tick.js` (if needed — verify exploring heroes aren't affected)

## Files NOT Modified (verify only)
- `lib/expedition.js` — confirm idle check covers exploring
- `components/WorldMapScreen.jsx` — confirm filter covers exploring
