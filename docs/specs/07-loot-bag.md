# Task 07: Loot Bag System

## Objective
Build the loot bag logic — temporary storage for resources and items collected during exploration. Deposited on safe return, lost on defeat.

## Input Files
- `lib/exploration.js` (from Task 06) — `addToLootBag()` already handles resource additions
- `data/enemies.js` — `CREATURE_LOOT` table with resource drops and exploration loot

## What To Build

Add to `lib/exploration.js`:

```js
/**
 * Process loot from a defeated enemy during exploration.
 * Uses CREATURE_LOOT table + explorationLoot if in exploration mode.
 */
export function generateExplorationLoot(enemyId, isExploration = true) {
  const lootEntry = CREATURE_LOOT[enemyId];
  if (!lootEntry) return { resources: {}, items: [] };

  const result = { resources: {}, items: [] };

  // Standard loot roll
  if (Math.random() < lootEntry.dropChance) {
    for (const [resource, [min, max]] of Object.entries(lootEntry.resources)) {
      result.resources[resource] = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  // Exploration-exclusive loot (always drops if in exploration mode)
  if (isExploration && lootEntry.explorationLoot) {
    for (const [resource, [min, max]] of Object.entries(lootEntry.explorationLoot)) {
      result.resources[resource] = (result.resources[resource] || 0) +
        Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  return result;
}

/**
 * Add an item to the loot bag.
 */
export function addItemToLootBag(lootBag, item) {
  return {
    ...lootBag,
    items: [...lootBag.items, item],
  };
}

/**
 * Calculate total loot bag value for display.
 */
export function getLootBagSummary(lootBag) {
  const resourceCount = Object.values(lootBag.resources).reduce((sum, v) => sum + v, 0);
  const itemCount = lootBag.items.length;
  return { resourceCount, itemCount, isEmpty: resourceCount === 0 && itemCount === 0 };
}
```

### Design Notes
- Loot bag is a temporary holding area — NOT the player's inventory
- On safe return (retreating to start node or using escape scroll), loot bag contents transfer to player resources/inventory
- On defeat, loot bag is cleared — the player loses everything collected this run
- This is the core push-your-luck mechanic: the deeper you go, the more you've collected, the more you risk losing
- The reducer (Task 11) handles the actual state transfer

## Acceptance Criteria
- `generateExplorationLoot()` correctly rolls against drop chance
- Exploration-exclusive loot drops only when `isExploration` is true
- `addItemToLootBag()` immutably adds items
- `getLootBagSummary()` returns correct counts
- All functions are pure (no side effects)
- `npm run dev` succeeds

## Files Modified
- `lib/exploration.js` (add functions)

## Files Created
- None (imports from enemies.js added to exploration.js)
