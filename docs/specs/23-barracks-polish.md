# Task 23: Barracks UI Polish — Inventory Grid + Equipment Slot Redesign

## Objective
Two polish items in the Barracks screen, both isolated to `BarracksScreen.jsx` and its CSS module:
1. **Inventory grid view toggle** — let the player switch between list (current) and a 4-column compact grid
2. **Equipment slot visual redesign** — bordered squares for weapon/armor/accessory slots, with empty-slot silhouettes

## Context Files (READ to understand)
- `components/BarracksScreen.jsx` (~357 lines) — the whole screen, has hero selector, equipment panel, and inventory list
- `components/BarracksScreen.module.css` — existing styles
- `components/shared/ItemCard.jsx` — use as a reference; it supports a `compact` prop. Do NOT modify it.
- `components/sprites/Sprite.jsx` — the `"weapon"`, `"armor"`, `"accessory"` sprite names exist for slot icons

## What To Build

### 1. Inventory Grid Toggle

- Add local state: `const [inventoryView, setInventoryView] = useState("list");`
- Above the inventory list, add a small segmented toggle (two buttons: List / Grid, or icons for each)
- When `inventoryView === "grid"`, render the inventory as a 4-column CSS grid. Each cell uses the existing `ItemCard` component with `compact` prop (it already exists and renders as a small square)
- When `inventoryView === "list"`, render the existing layout unchanged
- Keep the toggle visually small and unobtrusive — it lives in the inventory header row
- No persistence needed — defaults to "list" each session (keep scope tight)

CSS sketch in `BarracksScreen.module.css`:
```css
.invGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.viewToggle { display: flex; gap: 4px; /* small segmented control */ }
.viewToggleBtn { /* minimal, uses existing button color tokens */ }
.viewToggleBtn.active { /* highlighted */ }
```

### 2. Equipment Slot Redesign

Current equipment panel likely shows three slots (weapon / armor / accessory) inline. Redesign to three bordered square slots, each ~56–64px:

- Bordered square with rounded corners (1–2px iron-grey border, darker when empty)
- **Empty slot**: shows a faint silhouette icon of the slot type (use Sprite names `"weapon"`, `"armor"`, `"accessory"` at ~32px, `opacity: 0.35`)
- **Equipped slot**: shows the item sprite at ~40px, with a rarity-colored border overriding the default (use `getRarityColor(item.rarity)` from `@/lib/rarity` — already imported in BarracksScreen)
- Hover/focus state: subtle scale 1.02 or glow
- Clicking a filled slot retains current unequip behavior; clicking an empty slot is a no-op (or opens inventory — match whatever the current behavior is, don't change reducer logic)

CSS sketch:
```css
.equipSlots { display: flex; gap: 8px; justify-content: center; }
.equipSlot { width: 56px; height: 56px; border-radius: 4px; border: 2px solid #3f3f46; background: #1a1a1a; position: relative; }
.equipSlot.empty { border-style: dashed; border-color: #52525b; }
.equipSlot.filled { /* border-color set inline via rarity */ }
.equipSlotIcon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.equipSlotEmpty { opacity: 0.35; }
```

## Files You MUST Touch
- `components/BarracksScreen.jsx`
- `components/BarracksScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/ItemCard.jsx`
- `components/sprites/*`
- `lib/*`, `data/*`
- any other component

## Acceptance Criteria
- Toggle switches inventory between list and 4-col grid cleanly
- Grid uses existing `ItemCard compact` rendering — no visual regressions
- Equipment panel shows three clearly-bordered squares with silhouettes in empty slots
- Equipped items keep their rarity-colored border
- Unequip still works via click (existing reducer action, do not change)
- `npm run dev` succeeds, HTTP 200 on `/`
- No new console errors/warnings
- `prefers-reduced-motion` honored (no new animations at all is acceptable — keep it static)

## Verification
1. `npm run dev` in worktree
2. Open Barracks, toggle between List / Grid — confirm smooth switch
3. Unequip a weapon via the equipment panel — silhouette appears in the empty slot
4. Equip again from inventory — rarity border shows correctly
5. Curl HTTP 200

## Code Style
- No narrative summary comments
- Only comment WHY-non-obvious things
- No new .md files

## Commit
One commit on the current branch. Suggested message: `Add Barracks inventory grid toggle + equipment slot redesign`. Do NOT push.
