# Task 14: Interactive Combat UI

## Objective
Build the combat UI for exploration encounters — shows hero vs enemies with action buttons when it's the hero's turn.

## Input Files
- `lib/interactiveCombat.js` (from Task 08) — combat state, `advanceCombat()`, `getHeroActions()`
- `lib/consumables.js` (from Task 09) — `getUsableConsumables()`
- `components/sprites/Sprite.jsx` — existing sprite rendering
- `components/CombatReplayModal.jsx` — existing auto-combat replay (reference for style)
- `components/shared/PixelFrame.jsx` — pixel art frames

## What To Build

Create `components/ExplorationCombat.jsx` and `components/ExplorationCombat.module.css`.

### Component Structure

```jsx
ExplorationCombat
├── BattleField
│   ├── HeroPanel (sprite, HP bar, name, status effects)
│   └── EnemyPanel (sprite(s), HP bars, names)
├── CombatLog (scrollable text log of actions, auto-scrolls)
├── ActionBar (only visible on hero turn)
│   ├── Attack button
│   ├── Skill button(s) (if hero has skills)
│   ├── Item button (opens consumable submenu)
│   └── Flee button
└── ResultOverlay (victory/defeat/fled outcome)
```

### Visual Design
- Full-screen overlay on top of ExplorationScreen (dim the map behind it)
- Dark background (`#0f0e17` void)
- Hero on left, enemies on right (classic RPG layout)
- HP bars: green gradient, red when low
- Action buttons in PixelFrame (iron type) with the press-down/bounce animation from v2
- Combat log in PixelFrame (parchment type) with Crimson Pro font
- Enemy sprites use existing sprite system
- Boss enemies rendered larger (64-96px per ART_BIBLE)

### Turn Flow
1. Combat starts — auto-advance enemy turns with 500ms delay between
2. On hero turn — action bar appears, combat pauses
3. Player picks action — dispatch `EXPLORATION_COMBAT_ACTION`
4. If item selected — show submenu of usable consumables
5. After action — auto-advance next turns until hero turn again or combat ends
6. On victory — show loot dropped, "Continue" button returns to map
7. On defeat — show "Defeated" overlay, "The forge remembers" message, fade to hub
8. On fled — show "Escaped" message, return to current node on map

### Animation (keep it simple)
- Damage numbers float up and fade (CSS animation)
- HP bar smooth transitions
- Action buttons press-down on click (existing button juice from v2)
- Enemy sprite shakes on hit
- Hero sprite shakes on taking damage

### Item Submenu
When player clicks "Item":
- Show list of usable consumables from `getUsableConsumables(inventory, "combat")`
- Each shows: name, count, effect description
- Clicking one dispatches `EXPLORATION_COMBAT_ACTION` with `{ type: "item", consumableId }`
- "Back" button returns to main action bar

## Acceptance Criteria
- Combat UI renders hero and enemies with correct sprites
- HP bars update smoothly as damage is dealt
- Action bar appears only on hero turns
- All 4 action types work (attack, skill, item, flee)
- Item submenu shows available consumables
- Combat log displays all actions
- Victory/defeat/fled outcomes display correctly
- Auto-advance enemy turns with visible delay
- Uses existing sprite system and pixel art frames
- `npm run dev` succeeds, no console errors

## Files Created
- `components/ExplorationCombat.jsx`
- `components/ExplorationCombat.module.css`
