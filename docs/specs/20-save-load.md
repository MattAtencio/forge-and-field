# Task 20: Save/Load Exploration State

## Objective
Ensure exploration state persists correctly through save/load cycles and page refresh.

## Input Files
- `lib/save.js` — existing save/load logic (LocalStorage)
- `lib/gameReducer.js` — `createInitialState()` with exploration state (from Task 01)
- `lib/tick.js` — game loop and offline progress calculation

## What To Build

### 1. Verify save includes exploration state

In `lib/save.js`, the save function should already serialize the full state object. Verify that `state.exploration` is included in what gets saved to LocalStorage. If the save function cherry-picks fields, add `exploration` to the list.

### 2. Handle version migration

If the save system uses version numbers (current: `version: 5`), bump to version 6 and add a migration:

```js
// Migration from v5 to v6: add exploration state
if (savedState.version === 5) {
  savedState.exploration = {
    active: false,
    regionId: null,
    heroId: null,
    currentNode: null,
    visitedNodes: [],
    lootBag: { resources: {}, items: [] },
    nodeMap: null,
    combat: null,
  };
  // Add new resources
  if (!savedState.resources.ancientWood) savedState.resources.ancientWood = 0;
  if (!savedState.resources.starIron) savedState.resources.starIron = 0;
  if (!savedState.generators.ancientWood) savedState.generators.ancientWood = { level: 0, ratePerMin: 0.0 };
  if (!savedState.generators.starIron) savedState.generators.starIron = { level: 0, ratePerMin: 0.0 };
  // Add tutorial flag
  if (savedState.player.explorationTutorialDone === undefined) {
    savedState.player.explorationTutorialDone = false;
  }
  savedState.version = 6;
}
```

### 3. Handle mid-exploration save/load

If the player saves while exploring (page refresh, close browser):
- On load, if `exploration.active === true`:
  - Restore the map, current node, loot bag, visited nodes
  - If `exploration.combat` is non-null, restore combat state
  - Hero should still have status "exploring"
- The nodeMap data needs to be loadable — it's stored in state, so it saves with everything else

### 4. Handle offline time during exploration

In `lib/tick.js`, when calculating offline progress:
- If `state.exploration.active === true`: do NOT apply offline time to exploration
- Exploration is real-time, not idle — you can't progress while away
- Passive resource generation and expedition timers still work for non-exploring heroes
- Log a note in WelcomeBackModal: "Your exploration awaits where you left it."

### 5. Add WelcomeBackModal exploration state

In `components/WelcomeBackModal.jsx`, if exploration was active:
- Show: "You left mid-exploration in [Region Name]. Your hero awaits."
- Don't calculate any exploration progress for offline time

## Acceptance Criteria
- Game saves correctly with exploration state
- Page refresh during exploration restores exact state (node, loot bag, combat)
- Version migration handles existing v5 saves gracefully
- New resources (ancientWood, starIron) added to old saves
- Offline time doesn't affect exploration progress
- WelcomeBackModal mentions active exploration
- No data loss on save/load cycle
- `npm run dev` succeeds

## Files Modified
- `lib/save.js` (migration, version bump)
- `lib/tick.js` (exploration guard for offline progress)
- `lib/gameReducer.js` (version bump in createInitialState)
- `components/WelcomeBackModal.jsx` (exploration status message)
