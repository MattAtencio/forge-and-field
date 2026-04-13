# Task 01: Exploration State Slice

## Objective
Add exploration state to the game state structure so that exploration sessions can be tracked.

## Input Files
- `lib/gameReducer.js` — `createInitialState()` function (line ~22)

## What To Build

Add an `exploration` key to the initial state returned by `createInitialState()`:

```js
exploration: {
  active: false,        // whether an exploration session is in progress
  regionId: null,       // which region is being explored
  heroId: null,         // which hero is exploring (single-hero exploration)
  currentNode: null,    // current node ID on the map
  visitedNodes: [],     // array of visited node IDs
  lootBag: {            // temporary loot collected during exploration
    resources: {},      // { wood: 5, iron: 3, ... }
    items: [],          // array of item objects found during exploration
  },
  nodeMap: null,        // the generated/loaded node map for the region (set on exploration start)
  combat: null,         // current combat state if in a fight (null when not fighting)
},
```

## Acceptance Criteria
- `createInitialState()` includes the `exploration` key with all fields above
- Existing game loads without errors (the new state is additive, no breaking changes)
- `npm run dev` succeeds

## Files Modified
- `lib/gameReducer.js`

## Files Created
- None
