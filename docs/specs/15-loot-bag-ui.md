# Task 15: Loot Bag UI + Deposit/Lose Flow

## Objective
Build the loot bag display and the deposit (safe return) / lose (defeat) flows.

## Input Files
- `lib/exploration.js` (from Task 06/07) — `getLootBagSummary()`
- `components/ExplorationScreen.jsx` (from Task 13) — parent component
- `components/shared/PixelFrame.jsx` — pixel art frames

## What To Build

### 1. LootBagIndicator (floating badge on ExplorationScreen)

Small indicator in the corner of the exploration map showing current loot bag state:

```jsx
// Compact display: icon + count
// "Bag: 23 resources, 1 item"
// Tap to expand and see full breakdown
// Pulses briefly when new loot is added
// Turns red when bag has items (more to lose)
```

### 2. LootBagModal (expanded view)

Tapping the indicator opens a detailed view in a PixelFrame (parchment):
- Lists each resource type and amount
- Lists each item with name and rarity
- "Close" button
- Narrative flavor: "Your pack grows heavier."

### 3. Deposit Flow (on safe retreat)

When player dispatches `EXPLORATION_RETREAT`:
- Show a summary modal: "Safe Return"
- List all resources gained and items found
- "The forge receives your haul." message
- "Continue" button returns to World Map
- Resources are already transferred by the reducer

### 4. Defeat Flow (on hero death)

When `EXPLORATION_DEFEAT` fires:
- Show a defeat modal: "Fallen"
- "The forest takes what it is owed. Your pack is lost."
- Show what was lost (the loot bag contents, crossed out or faded)
- "Return to Forge" button
- Hero set to resting status by reducer

### Visual Design
- Loot bag indicator: small, bottom-right of exploration map
- Modals: centered, PixelFrame (parchment), dark overlay
- Deposit: warm tones (gold, amber) — victory feeling
- Defeat: cold tones (grey, muted red) — loss feeling
- Voice: matches "quiet warm authority" (not dramatic, understated)

## Acceptance Criteria
- Floating loot bag indicator visible during exploration
- Indicator updates in real-time as loot is collected
- Tap indicator opens full breakdown modal
- Safe retreat shows deposit summary with all loot
- Defeat shows loss summary with crossed-out contents
- Modals use PixelFrame and match existing visual style
- Narrative text in the game's voice
- `npm run dev` succeeds

## Files Created
- `components/LootBagIndicator.jsx`
- `components/LootBagIndicator.module.css`
- `components/LootBagModal.jsx`
- `components/LootBagModal.module.css`
