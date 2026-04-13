# Task 05: Exploration Difficulty Multipliers

## Objective
Create a difficulty scaling system so exploration enemies are significantly harder than idle expedition enemies.

## Input Files
- `data/enemies.js` — existing `ENEMY_HP_MULT`, `ENEMY_ATK_MULT`, `BOSS_HP_MULT`, `BOSS_ATK_MULT` constants
- `lib/combat.js` — `generateEnemyParty()` function that uses scaleFactor

## What To Build

Create `lib/explorationDifficulty.js`:

```js
// Exploration enemies are tougher than idle expedition enemies
// Idle expeditions use the base enemy stats (already scaled by ENEMY_HP/ATK_MULT in enemies.js)
// Exploration adds an additional multiplier on top

export const EXPLORATION_SCALE = {
  damage: 2.0,    // enemies deal 2x more damage in exploration
  hp: 1.5,        // enemies have 50% more HP in exploration
  boss_damage: 2.5,
  boss_hp: 2.0,
};

/**
 * Scale an enemy party for exploration difficulty.
 * Takes already-created enemy objects and applies exploration multipliers.
 * @param {Array} enemies - array of enemy objects from generateEnemyParty
 * @param {boolean} isBoss - whether this is a boss encounter
 * @returns {Array} scaled enemy objects
 */
export function applyExplorationDifficulty(enemies, isBoss = false) {
  const dmgMult = isBoss ? EXPLORATION_SCALE.boss_damage : EXPLORATION_SCALE.damage;
  const hpMult = isBoss ? EXPLORATION_SCALE.boss_hp : EXPLORATION_SCALE.hp;

  return enemies.map((enemy) => ({
    ...enemy,
    stats: {
      ...enemy.stats,
      hp: Math.round(enemy.stats.hp * hpMult),
      atk: Math.round(enemy.stats.atk * dmgMult),
    },
    maxHp: Math.round(enemy.maxHp * hpMult),
  }));
}
```

### Design Notes
- This is a pure function that transforms enemy objects — no side effects
- Applied AFTER `generateEnemyParty()` produces the base enemies
- The exploration combat UI (Task 08/14) will call this when creating encounters
- Boss fights in exploration are intentionally very hard — the player should need to prepare with consumables and good gear

## Acceptance Criteria
- `lib/explorationDifficulty.js` exports `EXPLORATION_SCALE` and `applyExplorationDifficulty()`
- Function correctly multiplies HP and ATK on enemy objects
- Boss flag applies separate (higher) multipliers
- `npm run dev` succeeds (file not imported anywhere yet)

## Files Created
- `lib/explorationDifficulty.js`
