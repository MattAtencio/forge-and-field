# Task 10: Flee Mechanic

## Objective
Implement the flee mechanic for exploration combat — costs endurance and has a chance to fail.

## Input Files
- `lib/interactiveCombat.js` (from Task 08) — flee action type
- `lib/exploration.js` (from Task 06) — endurance checking

## What To Build

Add flee logic to `lib/interactiveCombat.js` and `lib/exploration.js`.

### In `lib/exploration.js`, add:

```js
export const FLEE_ENDURANCE_COST = 12;  // fleeing costs endurance
export const FLEE_SUCCESS_RATE = 0.7;   // 70% chance to flee successfully
export const BOSS_FLEE_SUCCESS_RATE = 0.4; // 40% chance to flee from bosses
```

### Update `processHeroAction` in `lib/interactiveCombat.js`:

When `action.type === "flee"`:
1. Roll against `FLEE_SUCCESS_RATE` (or `BOSS_FLEE_SUCCESS_RATE` if fighting a boss)
2. On success: set `status: "fled"`, log the escape
3. On failure: log the failed attempt, enemy gets a free attack, advance turn
4. Either way: the reducer (Task 11) will deduct `FLEE_ENDURANCE_COST` from hero endurance

```js
case "flee": {
  const isBoss = state.combatants.some((c) => c.isEnemy && c.isBoss && c.hp > 0);
  const rate = isBoss ? BOSS_FLEE_SUCCESS_RATE : FLEE_SUCCESS_RATE;
  const success = Math.random() < rate;

  if (success) {
    newState.status = "fled";
    newState.log.push({
      turn: state.turn,
      actor: hero.name,
      action: "flee",
      success: true,
      message: `${hero.name} breaks away and escapes.`,
    });
  } else {
    // Failed flee — enemy gets a free hit
    const attacker = enemies[0];
    const damage = calculateDamage(attacker.stats, hero.stats);
    hero.hp = Math.max(0, hero.hp - damage);
    newState.log.push({
      turn: state.turn,
      actor: hero.name,
      action: "flee",
      success: false,
      message: `${hero.name} tries to run but ${attacker.name} blocks the way! Takes ${damage} damage.`,
    });
  }
  newState.turn = state.turn + 1;
  break;
}
```

### Design Notes
- Fleeing is intentionally risky (30% failure rate, 60% for bosses)
- Failed flee means taking a free hit — which could kill the hero
- Flee always costs endurance regardless of success (prevents spam)
- Escape Scroll (Task 09) bypasses the roll entirely — guaranteed flee
- The endurance deduction happens in the reducer (Task 11), not here

## Acceptance Criteria
- Flee rolls against appropriate success rate
- Failed flee results in enemy free attack
- Boss encounters have lower flee success rate
- Flee endurance cost constant exported for reducer use
- Combat log records success/failure with appropriate messages
- `npm run dev` succeeds

## Files Modified
- `lib/interactiveCombat.js` (update flee case)
- `lib/exploration.js` (add flee constants)
