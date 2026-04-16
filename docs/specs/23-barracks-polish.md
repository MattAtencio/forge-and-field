# Task 23: Barracks Inventory Grid Toggle

## Objective
Add a list / grid view toggle to the Barracks inventory panel so players can see more of their items at once. Isolated to `BarracksScreen.jsx` and its CSS module.

> Note: The equipment slot redesign that used to be part of this spec is already done — the current BarracksScreen already renders slots inside `<PixelFrame variant="iron">` with proper borders. Do NOT touch the equipment panel.

## Context Files (READ to understand)
- `components/BarracksScreen.jsx` — the whole screen
- `components/BarracksScreen.module.css`
- `components/shared/ItemCard.jsx` — already supports a `compact` prop for small squares. Do NOT modify it.

## What To Build

- Add local state: `const [inventoryView, setInventoryView] = useState("list");`
- Above the inventory list, add a small segmented toggle (two buttons — list icon + grid icon, or "List" / "Grid" text)
- When `inventoryView === "grid"`, render the inventory as a 4-column CSS grid. Each cell uses the existing `<ItemCard item={...} compact onClick={...} />`.
- When `inventoryView === "list"`, render the existing layout unchanged.
- Keep the toggle visually small and unobtrusive — it lives in the inventory header row
- No persistence — session state only (keep scope tight)

CSS sketch in `BarracksScreen.module.css`:
```css
.invGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.viewToggle { display: flex; gap: 4px; }
.viewToggleBtn { /* use existing button token colors */ }
.viewToggleBtn.active { /* highlighted with forge-orange accent */ }
```

## Files You MUST Touch
- `components/BarracksScreen.jsx`
- `components/BarracksScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/ItemCard.jsx`
- `components/shared/PixelFrame.jsx`
- `components/sprites/*`
- Equipment slot code in BarracksScreen (the `.equipSlots` / `.equipSlot` sections — already done)
- `lib/*`, `data/*`
- any other component

## Acceptance Criteria
- Toggle switches inventory cleanly between list and 4-col grid
- Grid uses existing `ItemCard compact` rendering — no visual regression
- Equipment panel untouched
- Item click handler (selection or detail modal) continues to work in both views
- `npm run dev` succeeds, HTTP 200 on `/`
- No new console errors/warnings

## Verification
1. `npm run dev`
2. Open Barracks, toggle between list / grid
3. Click an item in grid view — detail/selection behavior matches list view
4. Curl HTTP 200

## Code Style
- No trailing summary comments, no planning .md output, WHY-only comments

## Commit
One commit on the current worktree branch. Suggested message: `Add Barracks inventory grid-view toggle`. Do NOT push.
