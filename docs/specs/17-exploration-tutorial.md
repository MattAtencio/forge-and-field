# Task 17: Exploration Tutorial (Contextual Onboarding)

## Objective
Add a brief contextual tutorial when the player first enters exploration mode.

## Input Files
- `components/ExplorationScreen.jsx` (from Task 13)
- `lib/gameReducer.js` — player state (`player.tutorialDone`)
- `components/shared/PixelFrame.jsx`

## What To Build

### 1. Tutorial state tracking

Add to `createInitialState()` in `lib/gameReducer.js`:
```js
player: {
  ...,
  explorationTutorialDone: false,
},
```

### 2. Tutorial overlay in ExplorationScreen

When `state.player.explorationTutorialDone === false` and exploration starts:

Show a 3-step tutorial overlay:

**Step 1:** (highlight the node map)
> "The forest opens before you. Each mark on the trail is a choice — shelter, danger, or fortune."

**Step 2:** (highlight the endurance bar)
> "Your strength is not infinite. Every step costs endurance. Press too far and you will not make it back."

**Step 3:** (highlight the loot bag indicator)
> "What you find stays in your pack until you return to the forge. If you fall, the forest takes it all."

Each step: "Next" button to advance, final step: "Begin" button.

On completion: dispatch action to set `player.explorationTutorialDone = true`.

### 3. Add reducer action

`EXPLORATION_TUTORIAL_COMPLETE`:
```js
case "EXPLORATION_TUTORIAL_COMPLETE":
  return {
    ...state,
    player: { ...state.player, explorationTutorialDone: true },
  };
```

### Design Notes
- Tutorial shows ONCE per save file (persisted in state)
- Overlay is semi-transparent dark background with spotlight on relevant UI element
- Text in the game's narrative voice (not instructional — atmospheric)
- Keep it brief — 3 steps max, ~30 seconds to read

## Acceptance Criteria
- Tutorial shows on first exploration entry
- 3 steps with narrative-voice text
- "Begin" on final step starts exploration
- Tutorial never shows again after completion
- Persists through save/load
- `npm run dev` succeeds

## Files Modified
- `lib/gameReducer.js` (initial state + action)
- `components/ExplorationScreen.jsx` (tutorial overlay)
