# Task 03: Exploration Consumable Recipes

## Objective
Add 3 exploration consumable items to the crafting system: Health Tonic, Stamina Draught, Escape Scroll.

## Input Files
- `data/recipes.js` — existing recipe definitions (Tier 1-3 equipment)

## What To Build

Add 3 new recipes to `data/recipes.js`. These are consumable items (slot: "consumable") that can be crafted at the forge and used during exploration.

```js
// Add after existing recipes array entries:

// Exploration Consumables — craftable at forge, consumed during exploration
{
  id: "health_tonic",
  name: "Health Tonic",
  icon: "health_tonic",
  tier: 1,
  slot: "consumable",
  ingredients: { herbs: 10, gold: 5 },
  duration: 15000,
  effect: { type: "heal", value: 0.3 },  // restore 30% max HP
  maxStack: 5,
  unlockLevel: 6,
  description: "Bitter herbs steeped in forge-warmed water. It mends what rest alone cannot.",
},
{
  id: "stamina_draught",
  name: "Stamina Draught",
  icon: "stamina_draught",
  tier: 1,
  slot: "consumable",
  ingredients: { herbs: 8, wood: 5 },
  duration: 15000,
  effect: { type: "restore_endurance", value: 20 },  // restore 20 endurance points
  maxStack: 5,
  unlockLevel: 6,
  description: "Tastes like bark and determination. The legs stop complaining for a while.",
},
{
  id: "escape_scroll",
  name: "Escape Scroll",
  icon: "escape_scroll",
  tier: 1,
  slot: "consumable",
  ingredients: { herbs: 5, gems: 1 },
  duration: 20000,
  effect: { type: "instant_flee", keepLoot: true },  // flee combat, keep loot bag
  maxStack: 3,
  unlockLevel: 6,
  description: "Ink that moves on its own. Break the seal and the forest spits you out where you started, pack and all.",
},
```

### Design Notes
- All unlock at level 6 (same level exploration unlocks)
- `slot: "consumable"` distinguishes them from equipment
- `maxStack` limits how many you can carry into exploration
- Consumables go to inventory like items but don't have rarity/stats — they have `effect`
- The `effect` field is data only — actual usage logic is in Task 09

### Inventory Handling
- Consumables stack in inventory (1 inventory slot per type, with count)
- When crafted, if a stack of the same consumable exists and is under maxStack, increment count
- If at maxStack, goes to a new slot

Add to `gameReducer.js` in the `COLLECT_CRAFTED` action — when the crafted item has `slot === "consumable"`, check for existing stack:

```js
// In COLLECT_CRAFTED handler, after creating the item:
if (recipe.slot === "consumable") {
  const existingStack = newInventory.find(
    (item) => item.recipeId === recipe.id && (item.count || 1) < recipe.maxStack
  );
  if (existingStack) {
    existingStack.count = (existingStack.count || 1) + 1;
    // don't push to inventory, we incremented in place
  } else {
    newInventory.push({ ...craftedItem, count: 1 });
  }
} else {
  newInventory.push(craftedItem);
}
```

## Acceptance Criteria
- 3 consumable recipes appear in RECIPES array
- Recipes have `slot: "consumable"`, `effect`, `maxStack`, and `description` fields
- Crafting a consumable works at the forge (can queue, craft, collect)
- Consumables stack in inventory (up to maxStack)
- `npm run dev` succeeds, forge screen renders without errors

## Files Modified
- `data/recipes.js`
- `lib/gameReducer.js` (COLLECT_CRAFTED action — stacking logic)
