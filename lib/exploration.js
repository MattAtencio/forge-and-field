import { getExplorationMap } from "@/data/explorationMaps";
import { CREATURE_LOOT } from "@/data/enemies";

/**
 * Start an exploration session.
 * Returns the initial exploration state to merge into game state.
 */
export function startExploration(regionId, heroId) {
  const map = getExplorationMap(regionId);
  if (!map) return null;

  const startNode = map.nodes.find((n) => n.type === "start");

  return {
    active: true,
    regionId,
    heroId,
    currentNode: startNode.id,
    visitedNodes: [startNode.id],
    lootBag: { resources: {}, items: [] },
    nodeMap: map,
    combat: null,
  };
}

/**
 * Get nodes adjacent to the current node that the player can move to.
 */
export function getAdjacentNodes(explorationState) {
  const { currentNode, nodeMap } = explorationState;
  if (!nodeMap) return [];

  const adjacentIds = [];
  for (const [a, b] of nodeMap.edges) {
    if (a === currentNode) adjacentIds.push(b);
    if (b === currentNode) adjacentIds.push(a);
  }

  return nodeMap.nodes.filter((n) => adjacentIds.includes(n.id));
}

/**
 * Calculate endurance cost to move to a node.
 * Base cost from map, modified by node type.
 */
export function getMoveCost(nodeMap, targetNode) {
  let cost = nodeMap.enduranceCostPerNode;
  // Rest nodes cost less to reach (incentivize finding them)
  if (targetNode.type === "rest") cost = Math.ceil(cost * 0.5);
  // Boss nodes cost more
  if (targetNode.type === "boss") cost = Math.ceil(cost * 1.5);
  return cost;
}

/**
 * Check if hero can move to a node (has enough endurance).
 */
export function canMove(hero, nodeMap, targetNode) {
  const cost = getMoveCost(nodeMap, targetNode);
  return hero.endurance.current >= cost;
}

/**
 * Process arriving at a node. Returns an object describing what happens.
 * Possible outcomes: { type: "combat", enemies: [...] }
 *                    { type: "resource", drops: {...} }
 *                    { type: "rest", enduranceRestored: N }
 *                    { type: "poi", rewards: {...} }
 *                    { type: "boss", enemies: [...] }
 *                    { type: "start" } (safe, nothing happens)
 */
export function processNodeArrival(node, visited) {
  // Already-visited resource/rest/poi nodes give nothing on revisit
  const isRevisit = visited.includes(node.id);

  switch (node.type) {
    case "start":
      return { type: "start" };

    case "combat":
      // Combat always triggers (even on revisit — the forest is dangerous)
      return { type: "combat", enemies: node.encounter };

    case "resource":
      if (isRevisit) return { type: "empty", message: "Already gathered. Nothing remains." };
      return { type: "resource", drops: node.resourceDrop };

    case "rest":
      // Rest always works (even on revisit)
      return { type: "rest", enduranceRestored: node.restoreEndurance };

    case "poi":
      if (isRevisit) return { type: "empty", message: "You have been here before." };
      return { type: "poi", rewards: node.poiReward };

    case "boss":
      return { type: "boss", enemies: node.encounter };

    default:
      return { type: "empty" };
  }
}

/**
 * Add resources to the loot bag (temporary storage during exploration).
 */
export function addToLootBag(lootBag, resources) {
  const updated = { ...lootBag, resources: { ...lootBag.resources } };
  for (const [key, range] of Object.entries(resources)) {
    const amount = Array.isArray(range)
      ? Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]
      : range;
    updated.resources[key] = (updated.resources[key] || 0) + amount;
  }
  return updated;
}

/**
 * End exploration — either safe return or defeat.
 * safeReturn: true = deposit loot bag to inventory, false = lose everything
 */
export function endExploration(safeReturn) {
  return {
    safeReturn,
    // The reducer will handle transferring loot bag to resources or discarding it
  };
}

/**
 * Check if hero should be forced to retreat (0 endurance).
 */
export function mustRetreat(hero) {
  return hero.endurance.current <= 0;
}

// ── Flee constants (Task 10) ──

export const FLEE_ENDURANCE_COST = 12;  // fleeing costs endurance
export const FLEE_SUCCESS_RATE = 0.7;   // 70% chance to flee successfully
export const BOSS_FLEE_SUCCESS_RATE = 0.4; // 40% chance to flee from bosses

// ── Loot Bag System (Task 07) ──

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
