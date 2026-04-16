# Task 02: Node Map Data Structure

## Objective
Define the node map data for Greenwood Forest exploration. Each region has a hand-authored set of connected nodes that the player traverses.

## Input Files
- `data/regions.js` — existing region definitions (Greenwood is first, unlocked by default)
- `data/enemies.js` — enemy IDs and encounter tables for Greenwood: goblin, wolf, treant, treant_elder (boss)

## What To Build

Create `data/explorationMaps.js` with:

```js
// Each node map is an object with nodes and edges
// Node types: "start", "combat", "resource", "rest", "poi", "boss"
// Edges define which nodes connect (bidirectional movement)

export const EXPLORATION_MAPS = {
  greenwood: {
    id: "greenwood",
    name: "Greenwood Forest",
    nodes: [
      { id: "gw_start", type: "start", label: "Forest Edge", x: 50, y: 90, description: "The tree line begins. Sunlight thins." },
      { id: "gw_combat_1", type: "combat", label: "Goblin Thicket", x: 30, y: 70, encounter: ["goblin", "goblin"], description: "Movement in the undergrowth. Small, quick shapes." },
      { id: "gw_resource_1", type: "resource", label: "Fallen Oak", x: 70, y: 70, resourceDrop: { wood: [8, 15] }, description: "A great oak, brought down by wind. Timber for the taking." },
      { id: "gw_combat_2", type: "combat", label: "Wolf Den", x: 20, y: 50, encounter: ["wolf", "wolf"], description: "Bones at the entrance. Fresh ones." },
      { id: "gw_rest", type: "rest", label: "Mossy Clearing", x: 50, y: 50, restoreEndurance: 15, description: "A break in the canopy. The ground is soft. Rest comes easily here." },
      { id: "gw_resource_2", type: "resource", label: "Herb Hollow", x: 75, y: 45, resourceDrop: { herbs: [6, 12] }, description: "Wild herbs, stubborn and twice as potent as anything cultivated." },
      { id: "gw_poi", type: "poi", label: "Abandoned Camp", x: 40, y: 30, poiReward: { gold: [10, 25], xp: 20 }, description: "Saws still hang from the pegs. Whoever worked here left in no hurry." },
      { id: "gw_combat_3", type: "combat", label: "Deep Thicket", x: 60, y: 25, encounter: ["treant"], description: "The trees here are old. Some of them are watching." },
      { id: "gw_boss", type: "boss", label: "Ancient Grove", x: 50, y: 5, encounter: ["treant_elder"], description: "The oldest tree in the forest. It has been waiting." },
    ],
    edges: [
      ["gw_start", "gw_combat_1"],
      ["gw_start", "gw_resource_1"],
      ["gw_combat_1", "gw_combat_2"],
      ["gw_combat_1", "gw_rest"],
      ["gw_resource_1", "gw_rest"],
      ["gw_resource_1", "gw_resource_2"],
      ["gw_combat_2", "gw_poi"],
      ["gw_rest", "gw_poi"],
      ["gw_rest", "gw_combat_3"],
      ["gw_resource_2", "gw_combat_3"],
      ["gw_poi", "gw_boss"],
      ["gw_combat_3", "gw_boss"],
    ],
    enduranceCostPerNode: 8,
  },
};

export function getExplorationMap(regionId) {
  return EXPLORATION_MAPS[regionId] || null;
}
```

### Design Notes
- x/y coordinates are percentages (0-100) for layout positioning in the UI
- Start node is always at bottom, boss node at top — player pushes deeper
- Multiple paths create push-your-luck branching (safe resource path vs. risky combat path)
- 9 nodes for Greenwood (the simplest region). Later regions will have 10-12.
- Only Greenwood is defined in this task. Task 18 adds the other 4 regions.

## Acceptance Criteria
- `data/explorationMaps.js` exports `EXPLORATION_MAPS` and `getExplorationMap()`
- Greenwood map has 9 nodes with valid types, labels, descriptions, and positions
- Edges create a connected graph (no orphan nodes)
- Start and boss nodes are present
- `npm run dev` succeeds (no imports break — this file is not imported yet)

## Files Created
- `data/explorationMaps.js`
