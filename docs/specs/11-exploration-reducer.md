# Task 11: Exploration Reducer Actions

## Objective
Add all exploration-related actions to the game reducer, wiring the exploration engine, combat, loot bag, and consumables into the state machine.

## Input Files
- `lib/gameReducer.js` — main reducer with `createInitialState()` and action handling
- `lib/exploration.js` (from Task 06) — exploration logic functions
- `lib/interactiveCombat.js` (from Task 08) — interactive combat
- `lib/consumables.js` (from Task 09) — consumable usage
- `lib/exploration.js` — `FLEE_ENDURANCE_COST` (from Task 10)

## What To Build

Add the following action types to the reducer's switch statement in `gameReducer.js`:

### `EXPLORATION_START`
Payload: `{ regionId, heroId }`
- Validate: hero exists, hero status is "idle", region is unlocked
- Call `startExploration(regionId, heroId)` from exploration.js
- Set hero status to "exploring"
- Set `state.exploration` to the returned exploration state

### `EXPLORATION_MOVE`
Payload: `{ nodeId }`
- Validate: node is adjacent to current node, hero has enough endurance
- Deduct endurance cost from hero
- Update `exploration.currentNode` and add to `visitedNodes`
- Call `processNodeArrival()` and store result
- If node is combat/boss: call `initExplorationCombat()`, set `exploration.combat`
- If node is resource: call `addToLootBag()`, update `exploration.lootBag`
- If node is rest: restore hero endurance (capped at max)
- If node is poi: add rewards to loot bag and grant XP

### `EXPLORATION_COMBAT_ACTION`
Payload: `{ action }` where action is `{ type, targetId?, skillId?, consumableId? }`
- Call `advanceCombat(exploration.combat, action)`
- If action is item: call `useConsumable()`, apply effect, call `consumeFromInventory()`
- Update `exploration.combat` with result
- If combat result is "victory": generate loot via `generateExplorationLoot()`, add to loot bag, clear combat
- If combat result is "defeat": end exploration with `safeReturn: false`
- If combat result is "fled": deduct `FLEE_ENDURANCE_COST` from hero endurance, clear combat

### `EXPLORATION_USE_CONSUMABLE`
Payload: `{ consumableId }`
- For use on the exploration map (not in combat)
- Call `useConsumable()` and apply effect (stamina draught restores endurance)
- Call `consumeFromInventory()` to remove from inventory

### `EXPLORATION_RETREAT`
No payload — player manually retreats to start node.
- Set `exploration.active = false`
- Transfer loot bag resources to `state.resources`
- Transfer loot bag items to `state.inventory`
- Set hero status back to "idle"
- Restore hero HP to max (out of exploration, they recover)

### `EXPLORATION_DEFEAT`
No payload — triggered when hero HP reaches 0 in combat.
- Set `exploration.active = false`
- Discard loot bag entirely (the punishment)
- Set hero status to "resting" (needs recovery time)
- Hero endurance set to 0 (must rest before next exploration)

### Implementation Notes
- Import all required functions at the top of gameReducer.js
- Each action should be immutable (spread state, don't mutate)
- Follow the existing reducer pattern (return new state object)
- Hero HP/endurance modifications should find the hero in `state.heroes` by ID and update

## Acceptance Criteria
- All 6 action types handled in the reducer
- `EXPLORATION_START` validates hero/region and sets state
- `EXPLORATION_MOVE` deducts endurance, processes node arrival
- `EXPLORATION_COMBAT_ACTION` advances combat and handles outcomes
- `EXPLORATION_RETREAT` transfers loot to resources
- `EXPLORATION_DEFEAT` discards loot and sets hero to resting
- No mutations of existing state (immutable updates only)
- Existing actions (crafting, expeditions, etc.) still work
- `npm run dev` succeeds

## Files Modified
- `lib/gameReducer.js`
