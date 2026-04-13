# Sprint: Phase 2 — Exploration MVP

**Branch:** `feature/autonomous-v2` (branched from `v2/visual-overhaul`)
**Goal:** Build the "Field" half of Forge & Field — node-based exploration with player-controlled combat, loot bags, endurance drain, and consumables.
**Timeline:** Target completion in autonomous run, then manual review + merge to `v2/visual-overhaul`.

---

## Task Board

Status key: `[ ]` pending | `[~]` in-progress | `[x]` done | `[!]` blocked

### Wave 1: State & Data Foundation (no UI, no dependencies between tasks)

| # | Task | Spec | Size | Status | Depends On |
|---|------|------|------|--------|------------|
| 01 | Exploration state slice | [01-exploration-state.md](specs/01-exploration-state.md) | S | [x] | — |
| 02 | Node map data structure | [02-node-map-data.md](specs/02-node-map-data.md) | S | [x] | — |
| 03 | Exploration consumable recipes | [03-consumable-recipes.md](specs/03-consumable-recipes.md) | S | [x] | — |
| 04 | Exploration-only resources & recipes | [04-exploration-resources.md](specs/04-exploration-resources.md) | S | [x] | — |
| 05 | Exploration difficulty multipliers | [05-difficulty-multipliers.md](specs/05-difficulty-multipliers.md) | S | [x] | — |

### Wave 2: Core Logic (depends on Wave 1)

| # | Task | Spec | Size | Status | Depends On |
|---|------|------|------|--------|------------|
| 06 | Exploration engine (movement + endurance) | [06-exploration-engine.md](specs/06-exploration-engine.md) | M | [ ] | 01, 02 |
| 07 | Loot bag system | [07-loot-bag.md](specs/07-loot-bag.md) | S | [ ] | 01 |
| 08 | Interactive combat mode | [08-interactive-combat.md](specs/08-interactive-combat.md) | M | [ ] | 01, 05 |
| 09 | Consumable usage in combat & exploration | [09-consumable-usage.md](specs/09-consumable-usage.md) | S | [ ] | 03, 08 |
| 10 | Flee mechanic | [10-flee-mechanic.md](specs/10-flee-mechanic.md) | S | [ ] | 06, 08 |

### Wave 3: Reducer Integration (depends on Wave 2)

| # | Task | Spec | Size | Status | Depends On |
|---|------|------|------|--------|------------|
| 11 | Exploration reducer actions | [11-exploration-reducer.md](specs/11-exploration-reducer.md) | M | [ ] | 06, 07, 08 |
| 12 | Hero status "exploring" integration | [12-hero-exploring-status.md](specs/12-hero-exploring-status.md) | S | [ ] | 01 |

### Wave 4: UI Components (depends on Wave 3)

| # | Task | Spec | Size | Status | Depends On |
|---|------|------|------|--------|------------|
| 13 | ExplorationMap component | [13-exploration-map-ui.md](specs/13-exploration-map-ui.md) | M | [ ] | 11 |
| 14 | Interactive combat UI | [14-combat-ui.md](specs/14-combat-ui.md) | M | [ ] | 11 |
| 15 | Loot bag UI + deposit/lose flow | [15-loot-bag-ui.md](specs/15-loot-bag-ui.md) | S | [ ] | 11 |
| 16 | Exploration entry point in WorldMapScreen | [16-exploration-entry.md](specs/16-exploration-entry.md) | S | [ ] | 13 |

### Wave 5: Polish & Integration (depends on Wave 4)

| # | Task | Spec | Size | Status | Depends On |
|---|------|------|------|--------|------------|
| 17 | Exploration tutorial (contextual onboarding) | [17-exploration-tutorial.md](specs/17-exploration-tutorial.md) | S | [ ] | 16 |
| 18 | Node maps for all 5 regions | [18-all-region-maps.md](specs/18-all-region-maps.md) | M | [ ] | 02 |
| 19 | Exploration narrative text | [19-narrative-text.md](specs/19-narrative-text.md) | S | [ ] | 13 |
| 20 | Save/load exploration state | [20-save-load.md](specs/20-save-load.md) | S | [ ] | 11 |

---

## Execution Rules

1. **Wave order matters.** All tasks in Wave N must complete before Wave N+1 starts. Within a wave, independent tasks run in parallel.
2. **Each task = one commit.** Agent reads the spec, does the work, commits with message referencing the task number.
3. **No scope creep.** If a task surfaces work not in the spec, note it in a `TODO.md` at repo root — don't build it.
4. **Test by running.** After each wave, `npm run dev` must succeed with no console errors. Game must still be playable (existing features unbroken).
5. **Art stays as-is.** No new sprite work in this sprint. Use existing sprites or colored placeholder nodes.
6. **Voice consistency.** Any player-facing text must match the "quiet warm authority" narrative voice from the ART_BIBLE and existing region descriptions.

---

## Definition of Done (Full Sprint)

- [ ] Player can enter exploration from World Map for any unlocked region
- [ ] Node-based map renders with connected nodes (combat, resource, rest, POI, boss)
- [ ] Player moves hero between nodes, draining endurance
- [ ] Combat encounters are interactive (player chooses Attack/Skill/Item/Flee)
- [ ] Exploration enemies deal 2-3x more damage than idle expedition enemies
- [ ] Loot bag collects resources during exploration, deposited on safe return
- [ ] Defeat during exploration loses loot bag contents
- [ ] 3 consumables craftable and usable (Health Tonic, Stamina Draught, Escape Scroll)
- [ ] Hero can only explore OR go on expedition, not both
- [ ] Exploration state persists through save/load
- [ ] `npm run dev` succeeds, no console errors, existing game features unbroken
