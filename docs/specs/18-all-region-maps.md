# Task 18: Node Maps for All 5 Regions

## Objective
Add exploration node maps for Stormridge, Dusthaven, Frostpeak, and Dragon's Reach (Greenwood already exists from Task 02).

## Input Files
- `data/explorationMaps.js` (from Task 02) — Greenwood map as template
- `data/regions.js` — region definitions, enemies, descriptions
- `data/enemies.js` — enemy IDs per region

## What To Build

Add 4 more region maps to `EXPLORATION_MAPS` in `data/explorationMaps.js`. Each map should follow the Greenwood template structure.

### Stormridge Mountains (10 nodes)
- Theme: vertical ascent, exposed ridgelines, finding shelter from storms
- Enemies: rock_golem, harpy
- Boss: stone_golem
- Unique: more combat nodes (mountains are hostile), fewer resource nodes
- Endurance cost per node: 10 (harder terrain)

### Dusthaven Wastes (10 nodes)
- Theme: desert crossing, finding water and shade, bandit ambushes
- Enemies: bandit, bandit_leader, sandworm
- Boss: sandworm_queen
- Unique: branching paths with risk/reward (bandit camp = gold but combat, oasis = rest)
- Endurance cost per node: 9

### Frostpeak Tundra (11 nodes)
- Theme: descending cold, finding warmth, navigating ice
- Enemies: ice_wraith, frost_bear
- Boss: frost_dragon
- Unique: rest nodes are rare and precious, resource nodes give gems
- Endurance cost per node: 11

### Dragon's Reach (12 nodes)
- Theme: volcanic endgame, overwhelming heat, the final challenge
- Enemies: fire_imp, drake
- Boss: elder_dragon
- Unique: most combat nodes, highest endurance cost, multiple paths to boss
- Endurance cost per node: 12

### Design Rules (apply to all maps)
- Start node at bottom (y: 85-95), boss node at top (y: 0-10)
- x/y positions as percentages (0-100)
- At least 2 distinct paths from start to boss (branching)
- 1-2 rest nodes per map
- At least 1 POI per map
- Node descriptions match the "quiet warm authority" narrative voice
- Use region-appropriate enemy IDs from data/enemies.js
- Resource drops should match region theme (Stormridge = stone/iron, Dusthaven = gold, Frostpeak = gems, Dragon's Reach = gems/gold)

## Acceptance Criteria
- All 5 regions have complete node maps in EXPLORATION_MAPS
- Each map has start and boss nodes
- All nodes have valid types, labels, descriptions, positions
- Edges create connected graphs with no orphan nodes
- Multiple paths exist from start to boss in each map
- Enemy IDs match what exists in enemies.js for each region
- Resource drops make thematic sense
- `npm run dev` succeeds

## Files Modified
- `data/explorationMaps.js`
