import { calculateDamage } from "./combat";
import { getActiveSkills } from "./skills";
import { applyExplorationDifficulty } from "./explorationDifficulty";
import { getEnemyTemplate } from "@/data/enemies";
import { FLEE_SUCCESS_RATE, BOSS_FLEE_SUCCESS_RATE } from "./exploration";

/**
 * Initialize an interactive combat encounter for exploration.
 * Unlike auto-combat, this pauses for player input on hero turns.
 */
export function initExplorationCombat(hero, enemyIds) {
  // Create enemy party from encounter IDs
  const enemyParty = enemyIds.map((id, i) => {
    const template = getEnemyTemplate(id);
    return {
      id: `enemy_${i}_${id}`,
      templateId: id,
      name: template.name,
      icon: template.icon,
      isBoss: template.isBoss || false,
      stats: { ...template.baseStats },
      maxHp: template.baseStats.hp,
      hp: template.baseStats.hp,
      isEnemy: true,
    };
  });

  // Apply exploration difficulty
  const scaledEnemies = applyExplorationDifficulty(
    enemyParty,
    enemyParty.some((e) => e.isBoss)
  );

  // Build hero combatant
  const heroCombatant = {
    id: hero.id,
    name: hero.name,
    templateId: hero.templateId,
    stats: { ...hero.stats },
    hp: hero.stats.hp,
    maxHp: hero.stats.hp,
    isEnemy: false,
    skills: getActiveSkills(hero),
    equipment: hero.equipment,
  };

  return {
    status: "active",       // "active" | "victory" | "defeat" | "fled"
    turn: 0,
    heroTurn: false,        // true when waiting for player input
    combatants: [heroCombatant, ...scaledEnemies],
    log: [],                // array of { turn, actor, action, target, damage, message }
    pendingAction: null,    // set when it's hero's turn: { heroId, availableActions }
  };
}

/**
 * Get available actions for the hero on their turn.
 */
export function getHeroActions(combatState) {
  const hero = combatState.combatants.find((c) => !c.isEnemy && c.hp > 0);
  if (!hero) return [];

  const actions = [
    { type: "attack", label: "Attack", description: "Strike the nearest enemy." },
  ];

  // Add skills if available
  if (hero.skills) {
    for (const skill of hero.skills) {
      actions.push({
        type: "skill",
        skillId: skill.id,
        label: skill.name,
        description: skill.description,
      });
    }
  }

  // Item option (consumables — actual inventory checked by UI)
  actions.push({
    type: "item",
    label: "Item",
    description: "Use a consumable from your pack.",
  });

  // Flee option
  actions.push({
    type: "flee",
    label: "Flee",
    description: "Attempt to escape. Costs endurance.",
  });

  return actions;
}

/**
 * Execute one turn of interactive combat.
 * If it's the hero's turn and no action provided, returns with heroTurn: true.
 * If action provided or it's an enemy turn, resolves and advances.
 */
export function advanceCombat(combatState, heroAction = null) {
  const state = { ...combatState, log: [...combatState.log] };
  const living = state.combatants.filter((c) => c.hp > 0);
  const hero = living.find((c) => !c.isEnemy);
  const enemies = living.filter((c) => c.isEnemy);

  // Check win/lose
  if (!hero) return { ...state, status: "defeat", heroTurn: false };
  if (enemies.length === 0) return { ...state, status: "victory", heroTurn: false };

  // Build turn order
  const turnOrder = [...living].sort((a, b) => b.stats.spd - a.stats.spd);
  const nextActor = turnOrder[state.turn % turnOrder.length];

  if (!nextActor || nextActor.hp <= 0) {
    return { ...state, turn: state.turn + 1 };
  }

  // Hero's turn — wait for input
  if (!nextActor.isEnemy) {
    if (!heroAction) {
      return { ...state, heroTurn: true, pendingAction: { heroId: nextActor.id, availableActions: getHeroActions(state) } };
    }
    // Process hero action
    return processHeroAction(state, nextActor, heroAction, enemies);
  }

  // Enemy turn — auto-resolve
  return processEnemyTurn(state, nextActor, hero);
}

function processHeroAction(state, hero, action, enemies) {
  const newState = { ...state, heroTurn: false, pendingAction: null };
  const target = enemies[0]; // default target: first living enemy

  switch (action.type) {
    case "attack": {
      const damage = calculateDamage(hero.stats, target.stats);
      target.hp = Math.max(0, target.hp - damage);
      newState.log.push({
        turn: state.turn,
        actor: hero.name,
        action: "attack",
        target: target.name,
        damage,
        message: `${hero.name} strikes ${target.name} for ${damage} damage.`,
      });
      break;
    }
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
      return newState;
    }
    case "item": {
      // If a consumable effect was resolved, apply it
      if (action.effect) {
        if (action.effect.type === "heal") {
          hero.hp = Math.min(hero.maxHp, hero.hp + action.effect.value);
          newState.log.push({
            turn: state.turn,
            actor: hero.name,
            action: "item",
            message: `${hero.name} drinks a tonic. ${action.effect.message}`,
          });
        } else if (action.effect.type === "instant_flee") {
          newState.status = "fled";
          newState.log.push({
            turn: state.turn,
            actor: hero.name,
            action: "item",
            message: action.effect.message,
          });
          return newState;
        }
      } else {
        newState.log.push({
          turn: state.turn,
          actor: hero.name,
          action: "item",
          message: `${hero.name} uses an item.`,
        });
      }
      break;
    }
    default:
      break;
  }

  newState.turn = state.turn + 1;
  return newState;
}

function processEnemyTurn(state, enemy, hero) {
  const newState = { ...state };
  const damage = calculateDamage(enemy.stats, hero.stats);
  hero.hp = Math.max(0, hero.hp - damage);
  newState.log.push({
    turn: state.turn,
    actor: enemy.name,
    action: "attack",
    target: hero.name,
    damage,
    message: `${enemy.name} attacks ${hero.name} for ${damage} damage.`,
  });
  newState.turn = state.turn + 1;
  return newState;
}
