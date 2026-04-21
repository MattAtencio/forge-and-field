# Task 42: BarracksScreen Deeper Polish

## Objective
BarracksScreen is where heroes are managed — selected, leveled, equipped, retitled. Spec 23 added the inventory grid-toggle. This spec is the full chrome pass: roster card feel, equipment slot plates, the level-up moment, and the title-picker sub-modal.

## Context Files
- `components/BarracksScreen.jsx` (~600 lines) — read fully first
- `components/BarracksScreen.module.css`
- `components/shared/PixelFrame.jsx` — reuse as-is. DO NOT modify.
- `components/shared/HeroCard.jsx` — read-only reference. DO NOT modify.
- `components/shared/ItemCard.jsx` — read-only reference. DO NOT modify.
- `components/shared/Modal.jsx` — read-only. DO NOT modify.
- `components/sprites/Sprite.jsx` — read-only. DO NOT modify.
- Voice reference: "quiet warm authority"

## What To Build

### 1. PixelFrame audit + extension
BarracksScreen already imports PixelFrame. Identify current usage. Goal: the three load-bearing zones (hero roster strip, selected-hero detail panel, inventory grid/list) each sit in a PixelFrame. Parchment for info, iron for action zones. No double-framing.

### 2. Roster card hover/select feel
Hero cards in the roster strip get:
- Hover: warm lift (~1px translateY, 100ms) + brighter ember border edge.
- Selected: persistent ember-glow border + slightly raised.
- Press (un-selected): 2px translateY down, 80ms.
HeroCard component itself is shared and READ-ONLY — apply the visual chrome via CSS on the wrapping container in BarracksScreen, not by modifying HeroCard. Use a CSS modifier class.

### 3. Equipment slot plates
The 3 equipment slots (weapon / armor / accessory) currently render as buttons or cards. Upgrade:
- Each slot wears an iron-style square plate with bordered inner well.
- Empty slot shows a muted silhouette icon hint of the slot type (sword / shield / ring — use existing Sprite names if present, otherwise CSS-only silhouette).
- Equipped slot shows the item with a rarity-tinted glow border (use existing `getRarityColor`).
- Hover (when an unequipped item is selected for swap): warm warning ring around incompatible slots, ember ring around compatible.
- Click feel: 2px translateY press.

### 4. Level-up moment
`handleLevelUp` already toggles `levelUpFlash`. Upgrade the flash:
- Brief ember burst overlay around the selected-hero detail panel (~600ms total).
- Stat numbers that increased animate a quick green/ember "+N" rise above each (CSS keyframes, 800ms fade out).
- The level number itself does a quick scale-up bounce (1.0 → 1.2 → 1.0 over 400ms).
- Reduced-motion: drop the burst + rise; keep color flash on the level number.

Use the existing `levelUpFlash` state + ref to drive timing. DO NOT introduce new dispatch actions.

### 5. Title picker sub-modal polish
The title picker (gated by `showTitlePicker`) renders inside a Modal. Inside:
- Each title option gets a bordered card with title name + flavor text.
- Currently-equipped title gets ember accent border.
- Hover: warm lift; press: 2px translateY.
- Confirm button: iron-style press feedback.

### 6. Tab/section heading style
Major section headings ("Roster", "Equipment", "Skills", "Inventory" etc.) get the same ember divider underline pattern from spec 35 (WelcomeBackModal) — fades at edges.

## Files You MUST Touch
- `components/BarracksScreen.jsx`
- `components/BarracksScreen.module.css`

## Files You MUST NOT Touch
- `components/shared/*` — read-only (HeroCard, ItemCard, Modal, PixelFrame, ProgressBar, SkillBadge)
- `components/sprites/*` — read-only
- `lib/*`, `data/*` — no reducer, save, or data changes
- Any other component file

## Acceptance Criteria
- Three load-bearing zones framed, no double-framing.
- Roster card hover/select/press states distinct and visible.
- Equipment slots are bordered iron plates with empty silhouettes + rarity glow when equipped.
- Level-up triggers ember burst + stat "+N" rises + level number scale-bounce; reduced-motion-safe.
- Title picker modal: cards bordered, equipped marked, buttons have press feedback.
- Section headings have ember divider underline.
- `npm run dev` succeeds, HTTP 200 on `/`.
- No new console errors or warnings.

## Verification
1. `npm run dev`
2. Navigate to Barracks. Switch heroes, hover slots, equip/unequip an item, trigger level up, open title picker.
3. `curl http://localhost:3000` → 200.
4. Reduced-motion: animations degrade per spec.

## Code Style
- No narrative summary comments; WHY-only comments if anything.
- No new .md files beyond this spec.

## Commit
One commit on the current worktree branch. Suggested message: `Polish BarracksScreen roster, equipment slots, level-up moment, and title picker`. Do NOT push.
