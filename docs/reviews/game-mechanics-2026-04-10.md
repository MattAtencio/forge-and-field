# Forge & Field -- Exploration Transformation Review

**Date:** 2026-04-10
**Reviewer:** Kira Volkov (game mechanics review persona)
**Focus:** Evaluating the transformation from idle/incremental to visual exploration with turn-based combat. What translates, what breaks, and how to bridge the two modes.

---

## Verdict

Forge & Field has a genuinely solid idle core -- the forge-craft-equip-expedition loop is well-structured, the progression math is mostly sound (with known issues from the March balance pass), and the Forgelight visual identity gives it a clear personality. **This is a better-than-average foundation for the transformation you're planning.** But the word "transformation" is doing a lot of heavy lifting. What you're describing isn't a feature addition -- it's a genre shift from idle management to action-adventure with idle management. That's the difference between bolting a sunroof onto a car and converting a sedan into a pickup truck. Both start with the same chassis, but one of them requires rethinking the frame.

The good news: your existing systems (crafting, equipment, hero stats, combat resolution) are almost perfectly designed to support exploration. The bad news: your current progression pacing, combat model, and UI architecture all assume a passive player who checks in every few hours. An active exploration mode inverts every one of those assumptions. This review will map exactly where the seams are and how to stitch them.

**Bottom line: this is achievable, but only if you treat exploration as a *mode* that coexists with idle play, not a replacement for it. Think Moonlighter, not Zelda.**

---

## The Three Things That Are Working

### 1. The crafting-to-combat pipeline is already built

Most idle games that try to add action gameplay have to retrofit a reason for the player to care about their items. You don't. The forge -> craft item -> equip hero -> send on expedition pipeline (`lib/crafting.js` -> `gameReducer.js:EQUIP_ITEM` -> `lib/expedition.js:generateRewards`) is a clean data path. Every item has stats that feed directly into combat math (`lib/combat.js:calculateDamage`). When you put a hero into a visual exploration scene, their Wooden Sword +5 ATK still matters. The stat system doesn't need to change -- it needs to be *surfaced differently*.

This is the same structural advantage Moonlighter has: the shop (your forge) feeds the dungeon (your exploration). The loop direction is already correct.

### 2. The region/world map system is an exploration skeleton waiting for flesh

`data/regions.js` already defines five distinct biomes with themed colors, enemy rosters, points of interest with discovery chances, and boss gates. `data/expeditions.js` defines missions per region with power requirements and combat encounters. This is, structurally, a dungeon map. The translation from "send hero, wait, claim rewards" to "walk through Greenwood Forest, fight goblins, find the Abandoned Lumber Camp" is a *presentation* change, not a data model change. The POI discovery system (`gameReducer.js:DISCOVER_POI`, line 874) is already built for exploration -- it just fires on a random roll after expeditions instead of when you physically walk to a location.

### 3. The combat system has real tactical bones

`lib/combat.js` implements a proper turn-based system with speed-ordered initiative, skill cooldowns, passive triggers, AOE, healing, debuffs, and double-action chances. The `resolveCombat` function (line 122) produces a structured log that your `CombatReplayModal` already renders as a turn-by-turn replay. This isn't a "multiply two numbers" auto-battler -- it has actual decision space, even though the player currently can't interact with it. The jump from auto-resolved to player-controlled is smaller than it looks.

---

## The Three Things That Will Kill the Game If Not Fixed

### 1. Combat is currently zero-tension -- exploration will expose this brutally

The March balance report (`docs/reviews/balance-2026-03-19.md`) already proved it: every simulated fight is trivially easy. L1 Warrior beats a Goblin in 2 turns taking 2 damage. The Treant Elder boss dies in 6 rounds with the party taking 6 total damage. The Elder Dragon -- the *final boss* -- is a formality.

In an idle game, this is tolerable. The player isn't watching. In an exploration game where the player is physically walking their hero into combat and watching every swing, **a fight that's never dangerous is a fight that's never exciting.** Look at how Loop Hero handles this: every fight could kill you if you're not paying attention to your build. The threat of the roguelike loop reset creates stakes. Slay the Spire's genius is that every fight *could* end your run.

**Fix:** You need two combat difficulty curves -- one for idle auto-expeditions (current, keep it easy, it's background content) and one for active exploration (significantly harder). In exploration mode:
- Enemies should deal 2-3x more damage
- Enemy DEF should matter (currently heroes punch through it trivially)
- Introduce enemy abilities (currently only heroes have skills)
- Add a "flee" option with a resource/endurance penalty
- Consider permadeath-lite: exploration failure sends heroes to "wounded" for a long rest, losing the resources you found

### 2. There is no moment-to-moment gameplay loop for exploration

Your current 30-second loop is: check crafting queue -> collect or start craft -> check expedition -> claim or send. This is a management loop. It works for idle.

Exploration needs its own 30-second loop, and right now you have zero code or design for it. What does the player *do* every 30 seconds while exploring? This is the question that separates good exploration games from walking simulators.

**Fix -- steal from Loop Hero and Moonlighter:**

Loop Hero's insight: exploration can be *semi-passive*. The hero walks automatically along a path. The player's agency is in *preparation* (equipping, placing cards/tiles) and *reaction* (deciding when to use items, when to retreat). Apply this to Forge & Field:

- Hero walks automatically through a region (left-to-right, or node-to-node on a simple map)
- Random encounters trigger based on the region's encounter table (you already have `ENCOUNTER_TABLE` in `data/enemies.js`)
- Between encounters, the player finds resource nodes (tap to gather -- replaces passive generation during exploration)
- POIs appear on the path (your existing POI system, but discoverable by walking to them instead of random chance)
- The player's moment-to-moment decisions: "Do I keep pushing deeper (better loot, harder enemies) or retreat to the forge with what I have?"

This gives you a 30-second loop: walk -> encounter -> fight or flee -> loot -> decide: push or retreat.

### 3. The idle and exploration economies will cannibalize each other

Right now, resources come from two sources: passive generators (`generators` in state, ticking in `gameReducer.js:TICK`) and expedition rewards. If exploration also grants resources (which it must, or why explore?), you have three sources competing. The passive generators will feel pointless once exploration is available ("why wait 30 minutes for 60 wood when I can get 80 wood from a 5-minute forest run?"), and expedition rewards will feel like a worse version of exploration with no player agency.

**Fix -- create clear economic lanes:**

- **Passive generators** = baseline income. Always running. This is your "away from the game" economy. Keep it.
- **Idle expeditions** = targeted farming. You send heroes to specific regions for specific resources while you're away. Longer duration, guaranteed returns, no risk. This is your "I know what I need, go get it" economy.
- **Active exploration** = high-risk/high-reward. Better drops, unique materials (exploration-only resources for special recipes), but you can lose it all if you die. This is your "I'm engaged right now" economy.

The key insight from Moonlighter: the dungeon (exploration) produces *raw materials* that are useless until processed. Your forge is the processor. Exploration should drop "unidentified" items, rare crafting components, and monster parts that unlock *new recipes* you can't access any other way. This makes the forge the bottleneck that keeps both economies feeding into the same funnel.

---

## Mechanics Deep-Dive: What Translates to Exploration

### Resources System (STRONG -- translates directly)
`data/resources.js` defines 6 resources. These map perfectly to exploration:
- **Wood, Stone, Iron, Herbs** = harvestable nodes in the world (chop trees, mine rocks, gather plants)
- **Gems** = hidden/rare finds in exploration (secret rooms, POI rewards)
- **Gold** = enemy drops and chest loot

No changes needed to the resource model. The generation *source* changes (from passive ticks to active gathering), but the resources themselves are stable.

### Crafting System (STRONG -- becomes more important)
`data/recipes.js` and `lib/crafting.js` are the bridge between idle and active play. In exploration mode, crafting becomes *preparation*: you craft before exploring, not as the primary activity. This is exactly the Moonlighter model -- craft/buy gear at the shop, then go dungeon crawling.

**Enhancement needed:** Add exploration-specific recipes. Consumables (health potions, stamina potions, escape scrolls) that are crafted at the forge and consumed during exploration. This creates a new crafting sink and makes the forge essential even when the player is spending most of their time exploring.

### Hero System (MODERATE -- needs expansion)
`data/heroes.js` defines 4 heroes with stats, growth, and skills. In exploration, you control one hero at a time (or a party -- your choice, but I'd start with one for scope). The stat system works: ATK determines damage, DEF determines survivability, SPD determines turn order. Equipment matters.

**What's missing:** Movement speed. Currently no hero stat affects how fast they traverse the world. SPD only affects combat turn order. For exploration, you need a traversal stat (could be SPD doing double duty, or a new "stamina" mechanic that gates how far you can explore before returning).

The endurance system (`hero.endurance`) is already a proto-stamina system. Each expedition costs endurance. In exploration mode, endurance should drain as you walk, with combat draining it faster. When endurance hits zero, you can't fight -- you have to retreat. This creates the "push your luck" tension that every good exploration game needs.

### Combat System (NEEDS REWORK for active mode)
`lib/combat.js` resolves fights automatically. For exploration, you have a choice:

**Option A: Keep auto-combat, add player intervention points.** Fights play out like they do now (turn-based, SPD-ordered), but the player can tap to use active skills on specific turns, choose targets, and decide when to use consumables. This is the Loop Hero model -- combat is mostly automatic, but the player's preparation and occasional intervention determine outcomes.

**Option B: Full turn-based combat.** Player selects actions each turn: attack, skill, item, defend, flee. This is Shovel Knight's "pause and think" combat, or classic JRPG. More engaging but massively more scope.

**My recommendation: Option A for v1.** You already have the auto-combat engine. Adding intervention points (target selection, skill activation, item use, flee) is a UI layer on top of existing logic, not a rewrite. Option B is a v2 feature after you've validated that people enjoy the exploration loop.

### World Map / Regions (STRONG -- direct translation)
`data/regions.js` is your exploration map. Each region becomes a playable area. The existing structure:
- 5 regions with progression gating (clear boss to unlock next) -- this is a world map
- 3-4 expeditions per region -- these become dungeon layouts or area sections  
- 1 boss per region -- gate to progression
- POIs with discovery chances -- exploration rewards

The translation: instead of a list of expedition buttons, each region is a visual area the hero walks through. Expeditions become paths/rooms within the region. POIs are discoverable locations on the map.

### Prestige System (WORKS AS-IS)
`data/prestige.js` and `gameReducer.js:PRESTIGE_REBIRTH` reset progress with permanent bonuses. This works identically for exploration -- prestige bonuses (resource generation, crafting speed, starting level) affect both idle and active play. No changes needed.

### Village Buildings (WORKS AS-IS)
`data/village.js` defines buildings that modify rates (expedition duration, rest time, repair cost, inventory). These all still matter in exploration mode. Consider adding exploration-specific buildings later (e.g., "Cartographer" that reveals POI locations, "Training Ground" that increases exploration stamina).

---

## Progression Pacing Analysis for Exploration Integration

### Phase 1: Pure Idle (Levels 1-4)
Player has only the forge. No exploration exists yet. This is correct -- teach the crafting loop first. Current pacing is fine. The player learns: gather resources -> craft items -> gain XP -> level up.

**Exploration integration:** None. Keep this pure idle. The player needs to understand the forge before you send them into the field.

### Phase 2: Heroes & Expeditions (Levels 5-7)
Player unlocks barracks and expeditions. Currently these are send-and-wait. This is where exploration should first appear.

**Recommended approach:** At level 5, unlock "Explore" as an alternative to "Send Expedition." The player can either:
- Send the hero on an idle expedition (current behavior, passive, guaranteed rewards)
- Explore the region actively (new behavior, active, better rewards but risk)

This is the Moonlighter fork: dungeon crawling is optional but rewarding. Players who want to stay idle can. Players who want active gameplay get it.

**Danger zone:** The Level 5-7 stretch is currently where the second hero (Ranger) unlocks and expeditions begin. That's already a lot of new systems. Adding exploration here needs careful tutorial design. Consider unlocking exploration at Level 6 or 7 instead, after the player has done a few idle expeditions and understands the system.

### Phase 3: Multi-region Expansion (Levels 7-12)
Stormridge, Dusthaven, Frostpeak unlock via boss gates. In exploration mode, each of these becomes a new playable area. The boss gate system works perfectly -- clear the Treant Elder in exploration to unlock Stormridge.

**Pacing concern:** Current expedition durations range from 1 minute (Forest Trail) to 60 minutes (Ancient Ruins). Exploration sessions should be 5-15 minutes each. If exploration replaces expeditions of equivalent difficulty, the time compression is dramatic. A mission that used to take 10 minutes idle now takes 5 minutes active. This means the player progresses 2x faster when actively playing. **This is correct and intentional** -- active play should be faster than idle, or there's no reason to play actively. But it means your resource economy needs rebalancing for the faster throughput.

### Phase 4: Late Game (Levels 12-15+)
Dragon's Reach, prestige. In exploration, this is where the difficulty should spike. The Elder Dragon should be a genuine multi-attempt challenge, not the faceroll the balance report showed. Prestige resets your exploration progress (regions re-lock, hero levels reset) but you keep permanent bonuses. This is the roguelike "new game plus" loop.

**The prestige hook gets stronger with exploration.** Currently, prestige means "do the same idle loop faster." With exploration, prestige means "re-explore all regions with better stats, finding new secrets and harder challenges." This is exactly what makes Hades' runs compelling -- each loop is the same map but the player is stronger and discovers new narrative/mechanical wrinkles.

---

## Cut List: What to Remove from Exploration v1

1. **Multi-hero party in exploration.** Start with single-hero exploration. Party management in real-time is a massive scope increase. Let the player pick one hero to explore with. Other heroes can still run idle expeditions simultaneously. (v2: add co-op party exploration.)

2. **Full free-roam movement.** Don't build a 2D open world. Build a *node-based* exploration map (think FTL or Slay the Spire's map). Each node is an encounter, a resource node, a rest point, or a POI. The player chooses paths through the map. This is massively cheaper to build and still feels like exploration.

3. **Real-time combat.** Keep turn-based. You already have the engine. Real-time combat is a different game and a different skill set to develop. Turn-based with player intervention is the sweet spot for a solo dev.

4. **Procedural map generation.** For v1, each region has a hand-authored node map (8-12 nodes per region, branching paths). Procedural generation is v2 after you've proven the loop works with authored content.

5. **Exploration-specific enemies.** Use the existing enemy roster. Don't design new enemies for exploration. The goblins, wolves, treants, etc. are already themed per region. New enemies are a v2 polish item.

6. **Weather/time-of-day systems.** These are atmosphere features, not gameplay features. Cut entirely from v1. Your existing season system provides enough temporal variety.

---

## Comparable Games and Positioning

### 1. Loop Hero (Four Quarters, 2021)
**How you compare:** Loop Hero is the closest mechanical comp. Idle-ish exploration (hero walks automatically), with player agency in preparation and strategic card placement. Your forge is Loop Hero's card deck. Your regions are Loop Hero's biome tiles. Your equipment system is Loop Hero's gear loop.

**Where you differ:** Loop Hero has no crafting. Its "preparation" phase is deck-building, not item-crafting. Your forge gives the player a more tangible connection to their power growth -- "I built this sword" vs "I placed this tile." This is a genuine differentiator. Lean into it.

**Key lesson to steal:** Loop Hero's expedition timer. Each loop gets harder. The player watches their hero weaken and decides when to retreat. Your endurance system can replicate this exactly.

### 2. Moonlighter (Digital Sun, 2018)
**How you compare:** Moonlighter is the gold standard for "shop management + dungeon crawling." Your forge = Will's shop. Your expeditions = Moonlighter's dungeons. Your crafting recipes = Moonlighter's item catalog.

**Where you differ:** Moonlighter's combat is real-time action. Yours is turn-based. This actually works in your favor for the idle-game audience -- turn-based is less demanding and more compatible with "pick up and play for 5 minutes."

**Key lesson to steal:** Moonlighter's inventory risk. You can carry items out of the dungeon, but dying means losing some. Your exploration mode should have a "loot bag" that you keep only if you escape. Die? Lose the bag. This creates the push-your-luck tension that makes exploration sessions exciting.

### 3. Shovel Knight: Shovel of Hope (Yacht Club, 2014)
**How you compare:** Less direct, but relevant for the turn-based combat feel and the "village hub" structure. Shovel Knight has a town where you upgrade, then levels where you fight. Your forge/village = Shovel Knight's town. Your regions = Shovel Knight's levels.

**Where you differ:** Shovel Knight is pure action platformer. But the *structure* -- hub -> preparation -> level -> boss -> unlock next area -- maps perfectly to your region progression system.

**Key lesson to steal:** Shovel Knight's death penalty: lose gold, but it's recoverable if you reach the spot where you died. Consider a similar mechanic: exploration failure drops your loot bag at a "last safe point" that you can recover on the next run.

**One-sentence pitch for the combined game:** "Craft gear at your medieval forge, then take it into the field -- explore dangerous regions, fight monsters in tactical turn-based combat, and haul rare materials back to fuel your next creation."

---

## Top 5 Actions to Take This Week

### 1. Build the node-based exploration map for Greenwood Forest (Owner: Developer)
Create a simple node map component: 8-10 nodes connected by paths. Node types: combat, resource, rest, POI, boss. Player taps a connected node to move to it. Each node triggers its encounter from the existing `ENCOUNTER_TABLE` or generates resources from the region's expedition reward tables. **No new game logic needed** -- this is a UI layer on top of existing data.

Estimated scope: 1-2 days for the component + node data structure.

### 2. Add player intervention to combat (Owner: Developer)
Modify `CombatReplayModal` to pause before each hero turn and present action choices: Attack (auto-target), Skill (if available), Item (if carrying consumables), Flee. Feed the player's choice into the existing `resolveCombat` loop. The combat engine already handles skills, targeting, and damage -- you just need to make the player the decision-maker instead of the AI.

Estimated scope: 1-2 days. The combat engine stays, the modal becomes interactive.

### 3. Define the exploration endurance drain curve (Owner: Developer)
Decide: how many nodes can a hero explore before endurance hits zero? Current endurance ranges from 70 (Mage) to 120 (Paladin). If each node costs 5-10 endurance, that's 7-24 nodes per run -- roughly 1-3 minutes of active play per hero stamina bar. This feels right for a mobile-first idle game hybrid. Tune the numbers, implement the drain in the exploration map component.

Estimated scope: 0.5 days, mostly math and tuning.

### 4. Create 3 exploration-only consumable recipes (Owner: Developer)
Add to `data/recipes.js`:
- **Health Tonic** (herbs 10, gold 20, 15s craft): Restore 30% HP during combat
- **Stamina Draught** (herbs 15, iron 5, gold 30, 20s craft): Restore 20 endurance during exploration
- **Escape Scroll** (herbs 5, gems 1, gold 50, 25s craft): Instantly flee exploration with all loot kept

These create the crafting sink that connects the forge to exploration and gives the player preparation decisions.

Estimated scope: 0.5 days.

### 5. Implement the "loot bag" risk mechanic (Owner: Developer)
During exploration, resources and items found go into a temporary "loot bag" (not directly into inventory). If the hero returns to the entrance node, loot is deposited. If the hero's HP hits zero, loot is lost (or a percentage is lost -- tune to taste). This is the core tension mechanic that makes exploration exciting. Without it, exploration is just "walk and collect" with no stakes.

Estimated scope: 0.5-1 day. Add a `explorationLoot` temporary state, deposit it on successful return, clear it on defeat.

---

## Architecture Recommendation: Dual-Mode State

The cleanest implementation is a new state slice for exploration:

```
state.exploration = {
  active: false,
  regionId: null,
  heroId: null,
  currentNode: null,
  visitedNodes: [],
  lootBag: { resources: {}, items: [] },
  nodeMap: [...],  // generated from region data
}
```

New reducer actions: `START_EXPLORATION`, `MOVE_TO_NODE`, `RESOLVE_NODE`, `FLEE_EXPLORATION`, `COMPLETE_EXPLORATION`. The exploration state machine is: idle -> exploring -> (combat | gathering | resting | poi) -> moving -> ... -> exit. This is separate from but parallel to the existing expedition system.

The hero sent on exploration gets `status: "exploring"` (same pattern as `"expedition"` and `"resting"`). They can't be sent on idle expeditions simultaneously. Other heroes can still run idle expeditions while one hero explores. This preserves the idle loop for players who don't want to explore and creates a meaningful resource: hero time.

---

## Final Note

This transformation is the right move for the game. The forge-and-field name *already implies* two modes: the forge (idle crafting) and the field (active exploration). The vision is baked into the brand. The question isn't whether to do it -- it's whether to do it at the right scope. Everything I've outlined above is achievable by a solo developer in 2-3 focused weeks. The node-based map, the intervention-based combat, the loot bag risk mechanic, and the consumable recipes -- that's your exploration MVP.

Don't try to build Breath of the Wild. Build Loop Hero with a forge.
