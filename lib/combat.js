import { ENCOUNTER_TABLE, getEnemyTemplate } from "@/data/enemies";
import { getEffectiveStatsWithSkills } from "./hero";
import { getActiveSkills, getPassiveSkills } from "./skills";

const MAX_TURNS = 30;

export function generateEnemyParty(expeditionId, scaleFactor) {
  const encounters = ENCOUNTER_TABLE[expeditionId];
  if (!encounters || encounters.length === 0) return null;

  // Roll for encounter
  const roll = Math.random();
  let cumulative = 0;
  let selectedEncounter = null;

  for (const enc of encounters) {
    cumulative += enc.chance;
    if (roll < cumulative) {
      selectedEncounter = enc;
      break;
    }
  }

  if (!selectedEncounter) return null;

  return selectedEncounter.enemies.map((enemyId, i) => {
    const template = getEnemyTemplate(enemyId);
    if (!template) return null;

    const scale = scaleFactor || 1;
    return {
      id: `enemy_${i}_${enemyId}`,
      templateId: enemyId,
      name: template.name,
      icon: template.icon,
      isBoss: template.isBoss || false,
      stats: {
        hp: Math.round(template.baseStats.hp * scale),
        atk: Math.round(template.baseStats.atk * scale),
        def: Math.round(template.baseStats.def * scale),
        spd: Math.round(template.baseStats.spd * scale),
      },
      maxHp: Math.round(template.baseStats.hp * scale),
      isEnemy: true,
    };
  }).filter(Boolean);
}

export function calculateDamage(attacker, defender, defIgnore) {
  const effectiveDef = defIgnore
    ? Math.floor(defender.def * (1 - defIgnore))
    : defender.def;
  return Math.max(1, attacker.atk - Math.floor(effectiveDef / 2));
}

function buildTurnOrder(combatants) {
  return [...combatants]
    .filter((c) => c.hp > 0)
    .sort((a, b) => b.spd - a.spd);
}

function pickTarget(attacker, combatants) {
  const enemies = combatants.filter(
    (c) => c.hp > 0 && c.isEnemy !== attacker.isEnemy
  );
  if (enemies.length === 0) return null;
  // Target highest HP
  return enemies.reduce((best, e) => (e.hp > best.hp ? e : best), enemies[0]);
}

function buildHeroCombatant(hero, inventory) {
  const stats = getEffectiveStatsWithSkills(hero, inventory, "combat");
  return {
    id: hero.id,
    templateId: hero.templateId,
    name: hero.name,
    icon: "",
    stats: { ...stats },
    hp: stats.hp,
    maxHp: stats.hp,
    atk: stats.atk,
    def: stats.def,
    spd: stats.spd,
    isEnemy: false,
    skills: getActiveSkills(hero),
    passives: getPassiveSkills(hero),
    cooldowns: {},
    heroRef: hero,
  };
}

function buildEnemyCombatant(enemy) {
  return {
    ...enemy,
    hp: enemy.stats.hp,
    atk: enemy.stats.atk,
    def: enemy.stats.def,
    spd: enemy.stats.spd,
    skills: [],
    passives: [],
    cooldowns: {},
  };
}

function applyPartyPassives(combatants) {
  const heroes = combatants.filter((c) => !c.isEnemy);
  for (const hero of heroes) {
    for (const skill of hero.passives) {
      if (skill.effect.partyStats) {
        for (const ally of heroes) {
          for (const [stat, pct] of Object.entries(skill.effect.partyStats)) {
            if (ally[stat] !== undefined) {
              ally[stat] = Math.round(ally[stat] * (1 + pct));
            }
          }
        }
      }
    }
  }
}

export function resolveCombat(heroParty, enemies, inventory) {
  const combatants = [
    ...heroParty.map((h) => buildHeroCombatant(h, inventory)),
    ...enemies.map(buildEnemyCombatant),
  ];

  applyPartyPassives(combatants);

  const log = [];
  let turn = 0;
  let victory = false;

  while (turn < MAX_TURNS) {
    turn++;
    const order = buildTurnOrder(combatants);
    if (order.length === 0) break;

    const heroesAlive = order.filter((c) => !c.isEnemy);
    const enemiesAlive = order.filter((c) => c.isEnemy);

    if (heroesAlive.length === 0 || enemiesAlive.length === 0) {
      victory = enemiesAlive.length === 0;
      break;
    }

    for (const actor of order) {
      if (actor.hp <= 0) continue;

      // Decrement cooldowns
      for (const key of Object.keys(actor.cooldowns)) {
        if (actor.cooldowns[key] > 0) actor.cooldowns[key]--;
      }

      // Check if actor should use a skill
      let usedSkill = false;

      if (!actor.isEnemy && actor.skills.length > 0) {
        const allies = combatants.filter((c) => !c.isEnemy && c.hp > 0);
        const foes = combatants.filter((c) => c.isEnemy && c.hp > 0);

        for (const skill of actor.skills) {
          if (actor.cooldowns[skill.id] > 0) continue;

          // Heal if any ally below 40% HP
          if (skill.effect.heal) {
            const wounded = allies.some((a) => a.hp < a.maxHp * 0.4);
            if (wounded) {
              const healAmt = Math.round(actor.maxHp * skill.effect.heal);
              const targets = skill.effect.aoe ? allies : [allies.find((a) => a.hp < a.maxHp * 0.4)];
              for (const t of targets) {
                if (t) {
                  t.hp = Math.min(t.maxHp, t.hp + healAmt);
                }
              }
              actor.cooldowns[skill.id] = skill.cooldown;
              log.push({ turn, actor: actor.name, action: skill.name, type: "heal", heal: healAmt, aoe: skill.effect.aoe });
              usedSkill = true;
              break;
            }
            continue;
          }

          // Damage skills
          if (skill.effect.damage && foes.length > 0) {
            const targets = skill.effect.aoe ? foes : [pickTarget(actor, combatants)];
            const defIgnore = skill.effect.defIgnore || 0;

            for (const t of targets) {
              if (!t || t.hp <= 0) continue;
              const dmg = Math.max(1, Math.round(actor.atk * skill.effect.damage) - Math.floor(t.def * (1 - defIgnore) / 2));
              t.hp = Math.max(0, t.hp - dmg);

              // Apply debuffs
              if (skill.effect.debuff) {
                const db = skill.effect.debuff;
                t[db.stat] = Math.round(t[db.stat] * (1 - db.amount));
              }
            }

            actor.cooldowns[skill.id] = skill.cooldown;
            log.push({ turn, actor: actor.name, action: skill.name, type: "skill" });
            usedSkill = true;
            break;
          }
        }
      }

      // Regular attack if no skill used
      if (!usedSkill) {
        const target = pickTarget(actor, combatants);
        if (!target) continue;

        let dmg = calculateDamage(actor, target);

        // Iron Will passive: +15% DEF when below 50% HP
        if (!actor.isEnemy) {
          for (const p of actor.passives) {
            if (p.effect.trigger === "hp_below_50" && actor.hp < actor.maxHp * 0.5) {
              // Already applied to def — but this is reactive, apply to incoming damage reduction
              // Actually we apply it as a stat buff for the actor's def
            }
          }
        }

        target.hp = Math.max(0, target.hp - dmg);

        log.push({
          turn,
          actor: actor.name,
          action: "Attack",
          target: target.name,
          damage: dmg,
          targetHp: target.hp,
          type: "attack",
        });

        // Quick Draw: 25% chance to act again
        if (!actor.isEnemy) {
          for (const p of actor.passives) {
            if (p.effect.doubleActionChance && Math.random() < p.effect.doubleActionChance) {
              const t2 = pickTarget(actor, combatants);
              if (t2 && t2.hp > 0) {
                const dmg2 = calculateDamage(actor, t2);
                t2.hp = Math.max(0, t2.hp - dmg2);
                log.push({
                  turn,
                  actor: actor.name,
                  action: "Quick Draw",
                  target: t2.name,
                  damage: dmg2,
                  targetHp: t2.hp,
                  type: "attack",
                });
              }
              break;
            }
          }
        }
      }

      // Check for combat end
      const heroesLeft = combatants.filter((c) => !c.isEnemy && c.hp > 0);
      const enemiesLeft = combatants.filter((c) => c.isEnemy && c.hp > 0);
      if (heroesLeft.length === 0 || enemiesLeft.length === 0) {
        victory = enemiesLeft.length === 0;
        break;
      }
    }

    // Re-check after full turn
    const heroesLeft = combatants.filter((c) => !c.isEnemy && c.hp > 0);
    const enemiesLeft = combatants.filter((c) => c.isEnemy && c.hp > 0);
    if (heroesLeft.length === 0 || enemiesLeft.length === 0) {
      victory = enemiesLeft.length === 0;
      break;
    }
  }

  // If we hit max turns, it's a draw
  const heroesLeft = combatants.filter((c) => !c.isEnemy && c.hp > 0);
  const enemiesLeft = combatants.filter((c) => c.isEnemy && c.hp > 0);
  const isDraw = turn >= MAX_TURNS && heroesLeft.length > 0 && enemiesLeft.length > 0;

  return {
    victory,
    isDraw,
    turns: turn,
    log,
    survivors: combatants.filter((c) => c.hp > 0).map((c) => ({
      name: c.name,
      hp: c.hp,
      maxHp: c.maxHp,
      isEnemy: c.isEnemy,
    })),
    enemies: enemies.map((e) => ({ name: e.name, icon: e.icon, isBoss: e.isBoss })),
  };
}

export function getCombatRewardMultiplier(result) {
  if (result.victory) return 1.5;
  if (result.isDraw) return 0.75;
  return 0.5;
}
