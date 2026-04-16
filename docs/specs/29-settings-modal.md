# Task 29: SettingsModal Additions

## Objective
Add three player-facing settings to the existing SettingsModal: an animation intensity control, an audio volume slider stub, and an Export/Import save pair. All persisted via `localStorage` — NO reducer or save-state changes. Keep SettingsModal the only file modified (plus its CSS module).

## Context Files
- `components/SettingsModal.jsx` (93 lines) — current modal
- `components/SettingsModal.module.css` (if it exists — otherwise add one)
- `lib/save.js` — export `exportSave`, `importSave` functions already exist. Do NOT modify that file. Just import its helpers.

## What To Build

### 1. Animation intensity control (localStorage key `ff_anim_intensity`)
Radio or segmented toggle with three options:
- **Full** (default — browser handles everything)
- **Reduced** (adds `data-anim-intensity="reduced"` to `<html>` or `<body>`, which we'll rely on CSS to honor in future — for this spec just set the attribute; no CSS wiring required)
- **Off** (adds `data-anim-intensity="off"`)

On modal open, read from `localStorage.getItem("ff_anim_intensity") || "full"`. On change, write the value AND set the attribute on `document.documentElement` immediately.

If the attribute is respected by `prefers-reduced-motion` listeners elsewhere already, great — but this spec does NOT wire animation code to read it. The surface for this spec is the SettingsModal only.

### 2. SFX volume slider (localStorage key `ff_sfx_volume`)
Range input 0–100 (default 80). Persist on change. No audio API wiring required — SFX isn't shipped yet; this is UI plumbing only. Show current value as a percentage next to the slider.

### 3. Export / Import save
Two buttons:
- **Export save:** calls `exportSave(state)` from `@/lib/save`, gets the JSON string, and triggers a browser download of a file named `forge-and-field-save-<yyyy-mm-dd>.json`. Use a `Blob` + `URL.createObjectURL` + an ephemeral `<a download>` click. Standard pattern.
- **Import save:** an `<input type="file" accept=".json">` — on change, read the file with `FileReader`, call `importSave(text)`, then `localStorage.setItem("forgeAndField_save", JSON.stringify(migrated))` and `location.reload()`. Show a confirmation dialog before replacing the save ("This will overwrite your current save. Continue?" — use `window.confirm()` for simplicity).

You will need access to `state` (for export) — read it via `useGameState()` as other components do. Dispatch is NOT needed (import triggers a page reload).

### 4. Narrative voice
Labels should match the quiet warm authority voice. Suggestions (pick one each):
- "Animation" / "Motion" — use "Motion" (shorter, fits the voice)
- "Sound Effects Volume" → "Forge Hum" is nicer but may confuse; stick with plain "Sound" or "Effects"
- "Export save" / "Import save" → "Save a backup" / "Restore a backup" are more in-voice. Use those.

## Files You MUST Touch
- `components/SettingsModal.jsx`
- `components/SettingsModal.module.css` (create if it doesn't exist)

## Files You MUST NOT Touch
- `lib/save.js` (import helpers only)
- `lib/gameReducer.js` (no reducer changes)
- `components/shared/*`
- Any other component

## Acceptance Criteria
- Three new controls render in SettingsModal
- Motion toggle sets a `data-anim-intensity` attribute on `<html>` on change and reads from localStorage on mount
- SFX volume slider persists value in localStorage, shows %
- Export downloads a JSON file with today's date in the name
- Import reads a JSON file, replaces localStorage save after user confirmation, reloads
- No reducer or save-state-schema changes
- `npm run dev` succeeds, HTTP 200
- No new console errors/warnings

## Verification
1. `npm run dev`
2. Open Settings modal. Toggle motion → check `document.documentElement.dataset.animIntensity` in console
3. Move slider — check `localStorage.getItem("ff_sfx_volume")`
4. Click Export — confirm file downloads
5. `curl` → 200

## Code Style
- Narrative voice on labels per above. No exclamation points.
- No new trailing summary comments. WHY-only.
- No new .md files.

## Commit
One commit on the current worktree branch. Suggested message: `Add motion toggle, SFX volume, export/import to SettingsModal`. Do NOT push.
