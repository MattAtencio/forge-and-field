# Task 13: ExplorationMap Component

## Objective
Build the visual exploration map UI — a node-based graph where the player sees connected locations and taps to move their hero.

## Input Files
- `data/explorationMaps.js` (from Task 02) — node positions, types, edges
- `lib/exploration.js` (from Task 06) — `getAdjacentNodes()`, `canMove()`
- `lib/gameReducer.js` — exploration state
- `components/shared/PixelFrame.jsx` — existing pixel art frame component
- `app/globals.css` — existing theme variables and fonts

## What To Build

Create `components/ExplorationScreen.jsx` and `components/ExplorationScreen.module.css`.

### Component Structure

```jsx
ExplorationScreen
├── ExplorationHeader (region name, hero info, endurance bar, loot bag count)
├── NodeMap (SVG-based map with nodes and edges)
│   ├── Edge lines (SVG paths between connected nodes)
│   ├── Node circles (colored by type, sized for interaction)
│   └── Hero marker (current position indicator)
├── NodeDetail (selected node info + "Move Here" button)
└── LootBagPreview (floating indicator showing bag contents)
```

### Visual Design Rules (from ART_BIBLE.md)
- Background: region theme color from `data/regions.js` (e.g., Greenwood = `#0d1f0d`)
- Nodes: colored circles based on type:
  - start: `#e8e0d4` (parchment)
  - combat: `#ef4444` (danger red)
  - resource: `#fbbf24` (gold)
  - rest: `#22c55e` (forest green)
  - poi: `#a855f7` (arcane purple)
  - boss: `#f97316` (ember core) with pulsing glow
- Edges: thin lines in `#64748b` (steel dark), brightened for walkable paths
- Current node: highlighted ring in `#f97316` (ember core)
- Visited nodes: slightly dimmed
- Unreachable nodes (no adjacent path): greyed out
- Use PixelFrame around the node detail panel

### Endurance Bar
- Horizontal bar below hero name
- Green when >50%, yellow 25-50%, red <25%
- Shows current/max (e.g., "Endurance: 72/100")

### Node Interaction
1. Player taps a node adjacent to current position
2. Node detail panel shows: node label, description, type icon, endurance cost
3. "Move Here" button (disabled if not enough endurance)
4. On move: dispatch `EXPLORATION_MOVE` action

### Retreat Button
- Always visible in header area
- "Return to Forge" — dispatches `EXPLORATION_RETREAT`
- Only enabled when hero is on start node OR any non-combat node
- Shows loot bag summary ("Return with 15 wood, 8 herbs, 1 item")

### CSS Module
- Mobile-first layout (430px max-width, matching existing game)
- Dark background with region theme colors
- Smooth transitions on node selection
- Fonts: Crimson Pro body, JetBrains Mono for numbers, DM Serif Display for node labels

## Acceptance Criteria
- Map renders all nodes at correct positions with correct colors
- Edges drawn between connected nodes
- Player can tap adjacent nodes to see detail
- "Move Here" dispatches EXPLORATION_MOVE
- Endurance bar updates as hero moves
- Hero position indicator moves to new node
- Visited nodes visually dimmed
- Retreat button works from non-combat nodes
- Responsive within 430px viewport
- Uses existing font stack and color palette
- `npm run dev` succeeds, no console errors

## Files Created
- `components/ExplorationScreen.jsx`
- `components/ExplorationScreen.module.css`
