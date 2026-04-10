# Forge & Field — Steam Demo Scope

**Created:** 2026-04-10
**Status:** APPROVED
**Target:** October 2026 Next Fest
**Completion Time:** 25-40 minutes

---

## What's IN the Demo

### Systems
| System | Included | Scope Limit |
|--------|----------|-------------|
| Forge (Crafting) | Yes | Tier 1 recipes only (6 items) |
| Barracks (Heroes) | Yes | Warrior + Ranger only |
| World Map (Expeditions) | Yes | Greenwood Forest only |
| Exploration Mode | Yes | Greenwood node map only |
| Resource Generation | Yes | All 6 resources, standard rates |
| Loot Chests | Yes | Common + Rare only (no Epic) |
| Daily Quests | Yes | Full system |

### Content
- **Heroes:** Aldric (Warrior, unlocked at start), Lyra (Ranger, unlocked at L5)
- **Recipes:** 6 Tier 1 items (Wooden Sword, Leather Vest, Hunting Bow, Stone Shield, Herb Pouch, Stone Hammer)
- **Exploration consumables:** Health Tonic, Stamina Draught, Escape Scroll
- **Region:** Greenwood Forest — 3 regular expeditions + 1 boss (Treant Elder) + node-based exploration
- **Enemies:** Greenwood enemies only (Goblin, Wolf, Forest Spider, Treant Elder boss)
- **Level cap:** 6 (player sees L7 unlock teaser for Village but can't reach it)

### Player Journey (25-40 min)
1. **Minutes 0-5:** Tutorial. Craft first Wooden Sword. Equip Aldric. Learn the forge.
2. **Minutes 5-10:** First expedition (Goblin Clearing). Get resources. Craft armor.
3. **Minutes 10-15:** Upgrade gear, level up. First loot chest opens.
4. **Minutes 15-20:** Unlock Lyra (Ranger) at L5. Equip her. Two-hero expeditions.
5. **Minutes 20-30:** Unlock Exploration at L6. First active adventure through Greenwood nodes. Player-controlled turn-based combat. Loot bag risk/reward.
6. **Minutes 30-40:** Push toward Treant Elder boss in exploration. Defeat or retreat. Final screen.

### Demo End State
After defeating the Treant Elder in exploration OR reaching level cap:
> *"The forest parts. Beyond the ancient trees, mountains rise — cold and sharp against the sky. The forge burns brighter. There is more to build, more to discover."*
>
> **Continue in the full game. Your save carries over.**
>
> [Wishlist on Steam] [Join Discord]

---

## What's OUT of the Demo

| Feature | Why Excluded |
|---------|-------------|
| Village (Buildings) | Unlocks at L8, beyond demo cap |
| Seasons (Weekly Events) | Unlocks at L7, beyond demo cap |
| Prestige (Reforging) | Unlocks at L15, endgame system |
| Tier 2/3 Recipes | Teased in locked recipe list but uncraftable |
| Mage (Theron) | Shown locked at L10 in Barracks |
| Paladin (Sera) | Shown locked at L12 in Barracks |
| Regions 2-5 | Shown locked on World Map with "?" |
| Epic Loot Chests | Locked with "Full game" label |

**Tease strategy:** Locked content is VISIBLE but inaccessible. Player sees what they're missing:
- Locked hero silhouettes in Barracks with level requirement
- Locked regions on World Map with atmospheric descriptions
- Locked recipe tiers with "Requires [region name] materials"
- Village button in nav with "Unlocks at Level 8" tooltip

---

## Save Carry-Over

- Demo save transfers seamlessly to full game
- Player keeps: level, resources, inventory, hero progress, exploration discoveries
- Stored in LocalStorage with `forgeAndField_demo_v1` key
- Full game checks for demo save on first launch and offers import

---

## Technical Requirements

### Desktop Frame
The demo must not look like a phone app on a 1080p monitor. At 430px max-width, 75% of the screen is dead black.

**Solution:** Decorative frame around the game viewport:
- Forge workshop illustration (pixel art) as a border
- Ambient ember particles in the frame area
- Game title and version in the frame
- The game viewport is the "window" of the workshop

### Performance Targets
- 60fps on integrated graphics (Intel UHD 620+)
- < 100MB total download size
- < 2 second initial load
- Offline play after first load (PWA)

### Platform
- **Primary:** Tauri-wrapped desktop app for Steam
- **Fallback:** Web build on itch.io (if Tauri timeline slips)

---

## Quality Bar

The demo must pass these tests before submission:

- [ ] Cold player can reach first combat in < 3 minutes
- [ ] No softlocks or dead states in 25-40 min play session
- [ ] Save persists correctly across close/reopen
- [ ] All pixel art sprites render correctly at target sizes
- [ ] UI frames (parchment/iron) applied to all visible screens
- [ ] Narrative voice consistent across all player-facing text
- [ ] Exploration mode completes full loop (enter → traverse → fight → loot → return)
- [ ] Boss fight has genuine tension (player can lose)
- [ ] Demo end screen appears correctly
- [ ] Wishlist CTA is prominent and functional
- [ ] Desktop frame renders correctly at 1920x1080
- [ ] No console errors or warnings in production build
