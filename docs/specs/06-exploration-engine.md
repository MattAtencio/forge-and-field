# Task 06: Exploration Engine (Movement + Endurance)

## Objective
Build the core exploration logic — moving between nodes, draining endurance, and handling node effects.

## Input Files
- `lib/gameReducer.js` — exploration state slice (from Task 01)
- `data/explorationMaps.js` — node map data (from Task 02)
- `data/enemies.js` — encounter tables, CREATURE_LOOT

## What To Build

Create `lib/exploration.js`:

```js
import { getExplorationMap } from "@/data/explorationMaps";

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
```

### Design Notes
- Pure functions — no side effects, no state mutation
- The reducer (Task 11) calls these functions and applies state changes
- Combat encounters return enemy IDs — the combat system (Task 08) generates full enemy objects
- Resource nodes use ranges (min/max) — actual amount rolled on arrival
- Revisiting nodes: combat always triggers, resources/POI don't repeat, rest always works

## Acceptance Criteria
- `lib/exploration.js` exports all functions listed above
- `startExploration()` creates valid initial exploration state
- `getAdjacentNodes()` correctly finds connected nodes from edges
- `processNodeArrival()` returns appropriate outcomes for each node type
- Revisit logic works (combat replays, resources don't)
- `npm run dev` succeeds

## Files Created
- `lib/exploration.js`
