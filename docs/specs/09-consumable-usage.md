# Task 09: Consumable Usage in Combat & Exploration

## Objective
Wire up the 3 consumable items so they can be used during exploration and combat.

## Input Files
- `lib/interactiveCombat.js` (from Task 08) — combat state with item action
- `data/recipes.js` — consumable recipes with `effect` field (from Task 03)

## What To Build

Create `lib/consumables.js`:

```js
/**
 * Apply a consumable effect during exploration or combat.
 * Returns the modified state and whether the consumable was consumed.
 */
export function useConsumable(consumableItem, context) {
  const effect = consumableItem.effect;
  if (!effect) return { applied: false, reason: "Item has no effect." };

  switch (effect.type) {
    case "heal": {
      // Restore % of max HP to the exploring hero
      const healAmount = Math.floor(context.hero.stats.hp * effect.value);
      return {
        applied: true,
        type: "heal",
        value: healAmount,
        message: `Restored ${healAmount} HP.`,
      };
    }

    case "restore_endurance": {
      // Restore flat endurance points
      return {
        applied: true,
        type: "restore_endurance",
        value: effect.value,
        message: `Restored ${effect.value} endurance.`,
      };
    }

    case "instant_flee": {
      // Immediately flee combat, keep loot bag
      return {
        applied: true,
        type: "instant_flee",
        keepLoot: effect.keepLoot,
        message: "The scroll flares. You are elsewhere.",
      };
    }

    default:
      return { applied: false, reason: "Unknown effect type." };
  }
}

/**
 * Get consumables from hero's inventory that can be used in current context.
 * @param {Array} inventory - player inventory
 * @param {string} context - "combat" or "exploration" (on map, not fighting)
 */
export function getUsableConsumables(inventory, context) {
  return inventory.filter((item) => {
    if (item.slot !== "consumable") return false;
    if (!item.effect) return false;

    // Heal and escape scroll are combat-only
    if (item.effect.type === "heal" && context !== "combat") return false;
    if (item.effect.type === "instant_flee" && context !== "combat") return false;

    // Stamina draught is exploration-map-only (not during combat)
    if (item.effect.type === "restore_endurance" && context !== "exploration") return false;

    return true;
  });
}

/**
 * Remove one use of a consumable from inventory.
 * Decrements count; removes item if count reaches 0.
 */
export function consumeFromInventory(inventory, consumableId) {
  return inventory
    .map((item) => {
      if (item.id !== consumableId) return item;
      const newCount = (item.count || 1) - 1;
      if (newCount <= 0) return null;
      return { ...item, count: newCount };
    })
    .filter(Boolean);
}
```

### Integration with Interactive Combat (Task 08)

Update the `processHeroAction` function in `lib/interactiveCombat.js` to handle the `item` action type:

When `action.type === "item"` and `action.consumableId` is provided:
1. Find the consumable in inventory
2. Call `useConsumable()` to get the effect
3. Apply the effect (heal hero HP, or trigger instant_flee status)
4. Return updated combat state with the effect applied

This integration will be minimal — just replacing the placeholder item handling.

## Acceptance Criteria
- `useConsumable()` correctly processes all 3 effect types
- `getUsableConsumables()` filters by context (combat vs exploration map)
- `consumeFromInventory()` decrements count and removes empty stacks
- Health Tonic heals 30% max HP during combat
- Stamina Draught restores 20 endurance during exploration (not combat)
- Escape Scroll triggers instant flee with loot bag preserved
- `npm run dev` succeeds

## Files Created
- `lib/consumables.js`

## Files Modified
- `lib/interactiveCombat.js` (update item action handling)
