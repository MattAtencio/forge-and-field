# Task 04: Exploration-Only Resources & Recipes

## Objective
Add exploration-exclusive resource drops and special recipes that require them, creating a reason to explore beyond idle expeditions.

## Input Files
- `data/resources.js` — existing 6 resources
- `data/recipes.js` — existing recipes
- `data/enemies.js` — CREATURE_LOOT table

## What To Build

### 1. Add 2 exploration-only resources to `data/resources.js`:

```js
// Add to RESOURCES object:
ancientWood: { name: "Ancient Wood", icon: "ancient_wood", color: "#5c3d1e" },
starIron: { name: "Star Iron", icon: "star_iron", color: "#b8c4d4" },
```

### 2. Add exploration loot to enemy drops in `data/enemies.js`:

Add an `explorationLoot` field to CREATURE_LOOT entries. This only drops during exploration, never from idle expeditions:

```js
// Add explorationLoot field to select enemies:
treant:        { ..., explorationLoot: { ancientWood: [1, 3] } },
treant_elder:  { ..., explorationLoot: { ancientWood: [3, 6] } },
rock_golem:    { ..., explorationLoot: { starIron: [1, 2] } },
stone_golem:   { ..., explorationLoot: { starIron: [2, 4] } },
```

### 3. Add 2 special recipes to `data/recipes.js` that require exploration resources:

```js
{
  id: "ancient_bow",
  name: "Ancient Bow",
  icon: "ancient_bow",
  tier: 2,
  slot: "weapon",
  ingredients: { ancientWood: 5, wood: 15, iron: 10 },
  duration: 60000,
  baseStats: { atk: 12, def: 0, spd: 6 },
  unlockLevel: 7,
},
{
  id: "star_iron_shield",
  name: "Star Iron Shield",
  icon: "star_iron_shield",
  tier: 2,
  slot: "armor",
  ingredients: { starIron: 4, iron: 20, stone: 10 },
  duration: 60000,
  baseStats: { atk: 0, def: 14, spd: -1 },
  unlockLevel: 7,
},
```

### 4. Add exploration resources to initial state

In `lib/gameReducer.js` `createInitialState()`, add to `resources` and `generators`:

```js
resources: { ..., ancientWood: 0, starIron: 0 },
generators: { ..., ancientWood: { level: 0, ratePerMin: 0.0 }, starIron: { level: 0, ratePerMin: 0.0 } },
```

Note: These resources have 0 passive generation. They can ONLY be obtained through exploration.

## Acceptance Criteria
- 2 new resources defined and appear in resource bar (with 0 count initially)
- Exploration loot fields on relevant enemies (not used yet — Task 07 and 11 will wire this up)
- 2 new recipes craftable at forge IF player has the exploration resources
- `npm run dev` succeeds, resource bar renders all resources

## Files Modified
- `data/resources.js`
- `data/enemies.js` (add `explorationLoot` field to 4 entries)
- `data/recipes.js`
- `lib/gameReducer.js` (initial state)
