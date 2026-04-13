# Task 16: Exploration Entry Point in WorldMapScreen

## Objective
Add the "Explore" button to the World Map so players can enter exploration mode for unlocked regions.

## Input Files
- `components/WorldMapScreen.jsx` — existing region display and expedition sending
- `components/ForgeAndField.jsx` — main game shell with screen routing
- `data/progression.js` — level unlock definitions

## What To Build

### 1. Add "Explore" button to WorldMapScreen

In `components/WorldMapScreen.jsx`, add an "Explore" button to each unlocked region card:

```jsx
// Next to the existing "Expeditions" section for each region:
{playerLevel >= 6 && isRegionUnlocked(region) && (
  <button
    className={styles.exploreButton}
    onClick={() => handleStartExploration(region.id)}
    disabled={!hasIdleHero || state.exploration.active}
  >
    Explore {region.name}
  </button>
)}
```

- Unlock at level 6 (aligns with demo scope)
- Disabled if no idle heroes available or exploration already active
- Shows hero selection if multiple heroes are idle

### 2. Hero selection for exploration

When player clicks "Explore":
- If only 1 idle hero: start immediately
- If multiple idle heroes: show selection modal (reuse existing hero card style)
- Selected hero dispatches `EXPLORATION_START` with `{ regionId, heroId }`

### 3. Screen routing in ForgeAndField.jsx

Add exploration as a screen state in the main game shell:

```jsx
// In ForgeAndField.jsx screen rendering:
{state.exploration.active && (
  <ExplorationScreen />
)}
```

When `exploration.active` is true, show ExplorationScreen instead of the normal tab content. The nav bar should show "Exploring..." or hide entirely during exploration.

### 4. Add to progression unlocks

In `data/progression.js`, add exploration unlock at level 6:

```js
{ level: 6, type: "feature", feature: "exploration", label: "Exploration Unlocked" },
```

### 5. Unlock teaser

At level 5, show a locked "Explore" button with tooltip: "Unlocks at Level 6"
This creates the hook — player sees what's coming.

## Acceptance Criteria
- "Explore" button appears on World Map for unlocked regions at level 6+
- Hero selection works when multiple heroes are idle
- Clicking Explore dispatches EXPLORATION_START and shows ExplorationScreen
- ExplorationScreen overlays normal game UI during exploration
- Level 5 shows locked teaser
- Cannot start exploration when one is already active
- `npm run dev` succeeds, World Map renders without errors

## Files Modified
- `components/WorldMapScreen.jsx`
- `components/ForgeAndField.jsx`
- `data/progression.js`
