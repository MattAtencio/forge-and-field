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
