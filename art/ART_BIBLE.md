# Forge & Field — Art Bible

**Version:** 2.0
**Last Updated:** 2026-04-12
**Status:** Active — all sprite work must conform to this document

> This file is the single source of truth for all visual decisions in Forge & Field.
> The `/pixel-artist` skill reads this file before producing any asset.
> If a decision isn't in this file, it hasn't been made yet.

---

## 1. Identity

**Game:** Forge & Field
**Genre:** Idle/incremental RPG with active exploration
**Platform:** Steam (desktop, $14.99)
**Visual Style:** Pixel art — Aseprite-drawn, limited palette, dark backgrounds
**Signature:** "Ember Glow" — every crafted item and hero carries a visible ember-orange forge-touched accent

**One-sentence art direction:**
A warm forge in a cold world — everything radiates from the anvil.

---

## 2. Palette — Ember Glow (14 Colors)

This is a strict palette. No additional colors without explicit approval and an update to this document.

### Forge Family (Warm)
| ID | Name | Hex | RGB | Use |
|----|------|-----|-----|-----|
| W1 | Ember Core | `#f97316` | 249,115,22 | THE accent. Forge fire, crafted item glow, brand color |
| W2 | Flame | `#fb923c` | 251,146,60 | Secondary warmth, fire effects, forge ambient |
| W3 | Gold | `#fbbf24` | 251,191,36 | Currency, rare accents, paladin class color |
| W4 | Leather | `#92400e` | 146,64,14 | Wood, handles, leather armor, warm surfaces |
| W5 | Parchment | `#e8e0d4` | 232,224,212 | Light text, UI labels, warm white |

### Field Family (Cool)
| ID | Name | Hex | RGB | Use |
|----|------|-----|-----|-----|
| C1 | Steel Light | `#cbd5e1` | 203,213,225 | Metal highlights, armor glints |
| C2 | Steel Mid | `#94a3b8` | 148,163,184 | Metal bodies, weapons, neutral surfaces |
| C3 | Steel Dark | `#64748b` | 100,116,139 | Shadows, depth, metal darks |
| C4 | Forest | `#22c55e` | 34,197,94 | Ranger class, herbs, nature, Greenwood |
| C5 | Arcane | `#a855f7` | 168,85,247 | Mage class, gems, magic effects |

### Foundation
| ID | Name | Hex | RGB | Use |
|----|------|-----|-----|-----|
| F1 | Void | `#0f0e17` | 15,14,23 | Deepest shadow, background (NOT true black) |
| F2 | Dark Surface | `#1a1824` | 26,24,36 | Card backgrounds, panels, UI depth |
| F3 | Skin | `#fcd5b0` | 252,213,176 | Character skin tones |
| F4 | Danger Red | `#ef4444` | 239,68,68 | Enemy accents, damage, HP loss |

### Palette Rules
- Heroes and crafted items use warm colors (W1-W5) as accents
- Enemies use cool colors (C1-C3, C4, C5) — they LACK the forge-touch. No ember orange on enemies.
- Boss enemies get Gold (W3) glowing eyes as their ONLY warm accent
- Background is always Void (F1) or Dark Surface (F2)
- Aseprite palette file: `art/palettes/ember-glow.gpl`

---

## 3. Resolution Standards

| Element | Canvas | Render Size | Frames | FPS | Notes |
|---------|--------|-------------|--------|-----|-------|
| Heroes | 32x32 | 48-64px | 4 idle | 3-4 | 2-heads-tall, chunky proportions |
| Enemies (regular) | 32x32 | 48-64px | 2-3 idle | 2-3 | Slower than heroes, menacing sway |
| Enemies (boss) | 32x32 | 64-96px | 3-4 idle | 2-3 | Same canvas, render larger |
| Items (weapons/armor) | 16x16 | 24-32px | 1 (static) | — | 3-4 colors max per item |
| Resources | 16x16 | 24-32px | 1 (static) | — | Simple, "I want to click that" appeal |
| UI frames (9-slice) | Variable | Variable | 1 | — | Parchment (info) and Iron (actions) |
| Environment tiles | 16x16 | 16-32px | 1-2 | — | Atmospheric, light/shadow for depth |

---

## 4. Hero Design Rules

### Silhouette Principles
Each hero must be instantly recognizable by silhouette alone at 32x32:

| Hero | Class | Shape | Key Visual | Ember Accent |
|------|-------|-------|------------|--------------|
| Aldric | Warrior | Rectangle (broad, stocky) | Heavy sword, plate armor | Glowing sword edge |
| Lyra | Ranger | Triangle (narrow, agile) | Hooded cloak, longbow | Glowing arrow tips |
| Theron | Mage | Inverted triangle (robes flare) | Tall staff, flowing robes | Glowing staff crystal |
| Sera | Paladin | Cross (wide shield frame) | Large ornate shield | Glowing shield emblem |

### Hero Color Mapping
| Hero | Primary | Secondary | Accent |
|------|---------|-----------|--------|
| Aldric | Steel Mid/Dark | Leather | Ember Core (sword) |
| Lyra | Forest | Leather | Ember Core (arrows) |
| Theron | Arcane | Gold | Ember Core (crystal) |
| Sera | Gold | Steel Light | Ember Core (emblem) |

### Animation Standards
- **Idle:** 4 frames, 3-4 fps — gentle breathing bob (frame 1-2 up, 3-4 down)
- **Walk:** 6 frames, 8 fps — two-step cycle (future, for exploration)
- **Attack:** 3-4 frames, 12 fps — anticipation → action → follow-through (future)
- **Damage:** 2 frames, flash white then return (future)

---

## 5. Enemy Design Rules

### General
- Enemies are COLD — they lack the forge-touch
- No ember orange on regular enemies
- Use Steel, Forest, Arcane, Danger Red for enemy palettes
- Silhouettes should contrast with heroes (organic vs geometric, hunched vs upright)

### Boss Enemies
- Same 32x32 canvas but rendered at 64-96px
- Golden glowing eyes (Gold W3) as the ONLY warm accent
- More animation frames than regular enemies (3-4 vs 2-3)
- More detail and visual weight than regular enemies

### Enemy Roster by Region

| Region | Color Temperature | Enemies | Boss |
|--------|------------------|---------|------|
| Greenwood | Warm gold-green | Goblin, Dire Wolf, Forest Spider | Treant Elder |
| Stormridge | Cool grey-blue | Mountain Goat, Rock Golem, Harpy | Stone Colossus |
| Dusthaven | Warm tan-brown | Sand Scorpion, Bandit, Dust Wraith | Bandit King |
| Frostpeak | Cold ice-blue | Ice Wolf, Frost Elemental, Snow Troll | Frost Wyrm |
| Dragon's Reach | Hot red-black | Fire Imp, Drake, Lava Serpent, Obsidian Guardian | Elder Dragon |

---

## 6. Item & Resource Design Rules

### Items (16x16)
- 3-4 colors maximum per item
- Crafted items get the forge-touched ember accent (glowing edge, orange stitch, amber gem)
- Loot/found items do NOT get the ember accent — this is how players visually distinguish them
- Weapon silhouettes must be distinct (sword ≠ dagger ≠ axe)
- Armor reads as "wearable" even at 16x16

### Resources (16x16)
- Even simpler than items — 2-3 colors
- Must read clearly in an inventory grid at 24px
- "I want to click that" energy — satisfying shapes, clean outlines
- Wood = Leather tones, Stone = Steel tones, Iron = Steel Dark, Herbs = Forest, Gems = Arcane, Gold = Gold

---

## 7. UI Design Rules

### Frames (9-Slice)

**Parchment Frame** — for information (stat displays, descriptions, tooltips):
- Aged paper texture, slightly torn edges
- Colors: Parchment (F5), Dark Surface (F2) border, Leather (W4) corner rivets

**Iron Frame** — for actions (crafting slots, buttons, equipment, recipes):
- Hammered metal border, rivet corners
- Colors: Steel Mid (C2) body, Steel Dark (C3) shadow, Steel Light (C1) highlights
- Active state: Ember Core (W1) inner glow

### Typography
| Use | Font | Weight |
|-----|------|--------|
| Titles, headings | DM Serif Display | Regular |
| Body text, descriptions | Crimson Pro | Regular/SemiBold |
| Stat numbers, data | JetBrains Mono | Regular |

### Background
- App background: Void (#0f0e17) — NOT true black
- Card/panel background: Dark Surface (#1a1824)
- Never use pure white text — use Parchment (#e8e0d4)

---

## 8. Temperature Gradient

The world gets colder the further from the forge:

```
🔥 FORGE (warmest) ──────────────────────── DRAGON'S REACH (volcanic heat)
   Hub        Greenwood    Stormridge    Dusthaven    Frostpeak
   Amber      Gold-Green   Grey-Blue     Tan-Brown    Ice-Blue
   ← warm ────────────────────────────────────────── cold →
                                                      (then hot again at Dragon's Reach)
```

This gradient should be felt in:
- Region card colors on the World Map
- Enemy color temperatures
- Environment tile palettes
- Ambient particle colors

---

## 9. Reference Games

Study these for specific elements:

| Game | What to Take |
|------|-------------|
| **Loop Hero** | Dark-background pixel UI, tile frames, card borders, resource icons |
| **Moonlighter** | Warm interior → cool dungeon temperature shift |
| **Shovel Knight** | Character silhouette design at low resolution |
| **Stardew Valley** | 16x16 item design — simple, readable, charming |
| **Darkest Dungeon** | Palette discipline — one hot accent in a cold world |
| **Eastward** | Lighting quality ceiling for 32x32 sprites |
| **Hades** | UI that feels like part of the world, not pasted on |
| **Forager** | Resource collection feedback — "I want to click that" |

---

## 10. File Organization

```
art/                        # All art pipeline assets (tracked in git)
  ART_BIBLE.md              # This file — single source of truth
  sprites.json              # Game-specific sprite definitions (feeds global SDK)
  palettes/
    ember-glow.gpl          # Aseprite-compatible palette
  concepts/                 # AI-generated concept art (DALL-E, reference only)
    heroes/
    enemies/
    pixellab/               # PixelLab raw outputs and iterations
  production/               # Final PixelLab sprites (source of truth)
    heroes/
    enemies/
      greenwood/
      stormridge/
      dusthaven/
      frostpeak/
      dragons-reach/
    items/
    resources/
    ui/
    environment/

public/sprites/             # Game-ready assets (copied from art/production/)
  heroes/                   # What the app actually renders
  enemies/
    greenwood/
    ...
```

**Pipeline flow:** `art/concepts/` → `art/production/` → `public/sprites/`
The `pixel-artist` skill copies final assets to `public/sprites/` as its last step.

### Naming Convention
- All lowercase, hyphens for multi-word: `warrior-idle.png`, `goblin-idle-sheet.png`
- Sprite sheets: `{name}-sheet.png` with accompanying `{name}-sheet.json`
- Concepts: `{name}-concept.png` (in `art/concepts/`)
- Frame suffix for individual frames: `{name}-frame-{n}.png`

---

## 11. Quality Checklist (Every Sprite)

Before any sprite is considered done:

- [ ] Uses ONLY the 14-color Ember Glow palette?
- [ ] Readable at intended render size (24px for items, 48px for characters)?
- [ ] Silhouette identifiable without color?
- [ ] Has the forge-touched ember accent (if hero/crafted item)?
- [ ] Does NOT have ember accent (if enemy/loot)?
- [ ] Consistent with the temperature gradient for its region?
- [ ] Looks good on Void (#0f0e17) background?
- [ ] Follows the naming convention?
- [ ] Registered in the sprite system?
- [ ] Animation frame count and FPS match the standards table?

---

## 12. AI Generation Guidelines

When using DALL-E or other AI tools for concept generation:

### Prompt Template
```
Professional pixel art game sprite, Aseprite style, clean crisp pixels,
NO anti-aliasing, NO gradients, NO blurring.
[RESOLUTION] pixel resolution upscaled to show detail.
Dark charcoal background (#0f0e17).
[SUBJECT DESCRIPTION with silhouette notes].
[COLOR NOTES from palette].
[EMBER ACCENT placement].
Inspired by [REFERENCE GAMES from Section 9].
```

### What AI output IS
- **Concept art** and **reference images** for hand-refinement
- Direction-setting for mood, pose, and composition
- Batch exploration of variations

### What AI output is NOT
- Final game assets (AI cannot produce clean pixels at 16x16 or 32x32)
- Palette-accurate (AI will approximate but not match exact hex values)
- Animation-ready (AI generates single poses, not frame sequences)

### The Pipeline
1. Generate DALL-E concept at target mood
2. Import as reference layer in Aseprite
3. Hand-draw clean version at target resolution using Ember Glow palette
4. Animate (add idle frames)
5. Export as PNG sprite sheet
6. Register in sprite system and update preview page

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-04-12 | v2.0 — Consolidated from MOODBOARD.md, AI_ART_PROMPTS.md, VISUAL_IDENTITY.md | Session |
| 2026-04-10 | v1.0 — Original visual identity doc (SVG era) | Session |
