---
name: game-balance
description: "Analyze and fix game balance — stat curves, progression, combat, loot, economy. Use when evaluating whether the game feels fair, too easy, or too hard. Invoke with /game-balance [focus] where focus is: weapons, heroes, expeditions, loot, economy, combat, or all."
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent
context: fork
---

# Game Balance Agent

Analyze Forge & Field game balance across all systems and produce actionable recommendations.

**Scope:** `$ARGUMENTS` selects the focus area. Default is `all`.
- `weapons` — stat curves by tier/rarity, crafting costs, durability
- `heroes` — progression curves, stat growth, class differentiation
- `expeditions` — difficulty scaling, duration, power requirements
- `loot` — drop rates, rarity distribution, reward calibration
- `economy` — resource generation, gold sinks, inflation
- `combat` — damage formulas, turn balance, boss difficulty
- `all` — full audit across all systems

## Step 1: Load Game Data

Use `Read` to load these files:
- `data/heroes.js` — hero templates and stat growth
- `data/recipes.js` — item stats, costs, tiers
- `data/enemies.js` — enemy stats and encounter tables
- `data/expeditions.js` — expedition configs, rewards, durations
- `data/progression.js` — XP table, level unlocks, hero level costs
- `data/prestige.js` — prestige bonuses
- `data/village.js` — building upgrade costs and effects
- `data/seasons.js` — seasonal bonuses
- `lib/rarity.js` — rarity weights, multipliers, durability
- `lib/combat.js` — damage formula, turn order, max turns
- `lib/hero.js` — power formula, endurance costs
- `lib/expedition.js` — reward generation, power ratios

## Step 2: Run Analysis

Delegate to the balance analysis agent at `.claude/agents/balance-analyst.md` using the `Agent` tool.

The agent should analyze the focus area(s) and produce findings organized as:

### Weapon Balance
- Stat progression across tiers (T1→T2→T3): are jumps consistent?
- Cost-to-power ratio: does gold/resource cost scale with power gained?
- Slot balance: are weapons > armor > accessories in power? Is that intended?
- Crafting duration vs power: longer crafts should yield proportionally better items

### Hero Balance
- Base stat totals per class — should be roughly equal power at level 1
- Growth curves: which class scales best? Is that intended per role?
- Endurance system: does high-endurance Paladin feel meaningfully different from low-endurance Mage?
- Level cost curve: is `level * 50` gold too cheap or too expensive relative to income?

### Expedition Balance
- Power requirement vs hero power at recommended level
- Duration vs reward value (gold/hour equivalent)
- Boss difficulty relative to same-region expeditions
- Region progression: smooth difficulty curve from Greenwood → Dragon's Reach?

### Loot Balance
- Rarity distribution (60/25/12/3) — expected pulls to get Epic?
- Item drops per expedition (chance * runs to get one)
- Loot value vs crafting value at same tier
- Durability as gold sink: repair costs vs income at each tier

### Economy Balance
- Resource generation rate vs consumption rate at each game phase
- Gold sinks: crafting, leveling, repairs, upgrades — are they balanced?
- Gem scarcity: too rare or too common?
- Prestige star accumulation rate vs shop costs

### Combat Balance
- Damage formula: `atk - def/2` — does defense feel impactful?
- 30-turn limit: are draws common? At what power ratios?
- Boss stats relative to hero party (1v1 and 2v2 scenarios)
- Skill impact: are active skills worth the cooldown?

## Step 3: Produce Report

Write the balance report to `docs/reviews/balance-{date}.md` where `{date}` is today's date in YYYY-MM-DD format.

Format:
```markdown
# Game Balance Report — {date}

## Executive Summary
{2-3 sentences on overall health}

## Findings

### {Category}
| Metric | Current | Recommended | Severity |
|--------|---------|-------------|----------|
| ...    | ...     | ...         | low/med/high |

**Analysis:** {explanation}

## Recommended Changes
{Prioritized list of data file changes with exact values}
```

## Step 4: Apply Fixes (if requested)

If the user confirms, apply the recommended changes to the data files using `Edit`.
After applying, run `npm run build` to verify.

## Guardrails

- Do NOT modify any files without producing the report first
- Do NOT change game mechanics (formulas in lib/) — only tune data values
- Do NOT change UI components or sprite system
- Present findings before making changes — let the user decide what to apply
- All numerical analysis should show the math, not just conclusions
- Flag any change that would break existing save data compatibility
