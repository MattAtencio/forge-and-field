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
