# Forge & Field — Pixel Art Moodboard & Art Direction

**Created:** 2026-04-10
**Purpose:** Visual north star for the pixel art transformation. Every asset created should be checked against this doc.

---

## The Signature: "Ember Glow"

Everything in Forge & Field relates to **heat**. The forge is the center of the world. Things near it glow warm. Things far from it are cold and dangerous.

- **Forge/Hub:** Warm amber-orange light, ember particles, everything bathed in firelight
- **Barracks:** Torchlight warmth with cooler steel-blue shadows
- **World Map:** Progressive temperature shift — Greenwood (gold-green warmth) → Dragon's Reach (volcanic red-black)
- **The Forge Mark:** Every crafted item carries a visible ember-orange accent (glowing sword edge, amber gem socket, orange stitch). This distinguishes player-made items from loot and IS the visual brand.

**The Steam capsule image:** Dark scene. Glowing forge center. Warrior silhouetted against it, sword edge glowing ember-orange. Cold world visible through a cave mouth behind. One image. One idea. Readable at 200px wide.

---

## Resolution Standards

| Element | Resolution | Render Size | Notes |
|---------|-----------|-------------|-------|
| Characters (heroes, enemies) | 32x32 | 48-64px | 2-3 heads tall, chunky, readable silhouette |
| Items (weapons, armor, accessories) | 16x16 | 24-32px | 3-4 colors max, forge-touched accent |
| Resources (wood, stone, iron, etc.) | 16x16 | 24-32px | Simple, "I want to click that" appeal |
| Tiles (ground, walls, decoration) | 16x16 | 16-32px | Atmospheric, light/shadow for depth |
| UI elements (frames, buttons, icons) | 9-slice | Variable | Parchment (info) and iron (actions) |

---

## Refined 14-Color Palette

Organized by emotional temperature. Forge = warm. Field = cold.

### Forge Family (Warm)
| Name | Hex | Use |
|------|-----|-----|
| Ember Core | `#f97316` | THE accent. Forge fire, crafted item glow, brand color |
| Flame | `#fb923c` | Secondary warmth, fire effects, forge ambient |
| Gold | `#fbbf24` | Currency, rare accents, paladin class color |
| Leather | `#92400e` | Wood, handles, leather armor, warm surfaces |
| Parchment | `#e8e0d4` | Light text, UI labels, warm white |

### Field Family (Cool)
| Name | Hex | Use |
|------|-----|-----|
| Steel Light | `#cbd5e1` | Metal highlights, armor glints |
| Steel Mid | `#94a3b8` | Metal bodies, weapons, neutral surfaces |
| Steel Dark | `#64748b` | Shadows, depth, metal darks |
| Forest | `#22c55e` | Ranger class, herbs, nature, Greenwood |
| Arcane | `#a855f7` | Mage class, gems, magic effects |

### Foundation
| Name | Hex | Use |
|------|-----|-----|
| Void | `#0f0e17` | Deepest shadow, warm-shifted charcoal (not true black) |
| Dark Surface | `#1a1824` | Card backgrounds, panels, UI depth |
| Skin | `#fcd5b0` | Character skin tones |
| Danger Red | `#ef4444` | Enemy accents, damage, HP loss |

---

## Reference Games — What to Take From Each

### Primary References (Study These Closely)

**1. Loop Hero** (Four Quarters, 2021)
- **Take:** Dark-background pixel art UI language. Tile frames, card borders, resource icons. How they make "dark + pixel + readable" work without looking like a phone game.
- **Relevance:** Closest genre match. Idle-meets-active loop. Dark palette. Tile-based world.

**2. Moonlighter** (Digital Sun, 2018)
- **Take:** The shop-to-dungeon visual temperature shift. Warm interior light in the shop, cool tones in dungeons. The transition IS the game feel.
- **Relevance:** Exact same "craft at home, fight abroad" structure.

**3. Shovel Knight** (Yacht Club, 2014)
- **Take:** Character silhouette design at low resolution. Every character reads by shape alone. Round vs angular vs tall vs wide.
- **Relevance:** Our 4 heroes need this: Warrior=rectangle, Ranger=triangle, Mage=inverted triangle, Paladin=cross/shield.

### Secondary References (Study Specific Elements)

**4. Stardew Valley** (ConcernedApe, 2016)
- **Take:** Item design. 16x16 items that are simple, readable, charming. The gold-star quality indicator. Inventory grid beauty through palette consistency.

**5. Darkest Dungeon** (Red Hook, 2016)
- **Take:** Palette discipline. They use red as the ONLY saturated color in a desaturated world. We use ember-orange the same way. One hot color. Everything else serves it.

**6. Eastward** (Pixpil, 2021)
- **Take:** Lighting quality. Warm interiors, cool exteriors, dynamic shadows selling depth. This is the quality ceiling for 32x32 character sprites.

**7. Hades** (Supergiant, 2020)
- **Take:** UI illustration philosophy. Every UI element feels like part of the world — boon cards, resource counters, upgrade mirrors. Our crafting queue and hero cards should feel like parchment and iron, not app UI.

**8. Forager** (HopFrog, 2019)
- **Take:** Resource collection feedback. Items pop, bounce, collect with satisfying motion. Our resource sprites need "I want to click that" energy.

---

## Hero Silhouette Guide

Each hero must be instantly recognizable by shape alone at 32x32:

```
WARRIOR (Aldric)          RANGER (Lyra)           MAGE (Theron)          PALADIN (Sera)
   ████                      ██                     ████                    ██
  ██████                    ████                   ████████                ████
  ██████   Rectangle       ██████   Triangle      ████████  Inverted    ████████  Cross
  ██████   (broad,         ██████   (narrow,      ██████    triangle    ██████████ (wide
  ██████    stocky)         ████    agile)          ████    (robes       ████████   shield
   ████                      ██                      ██     flare)       ██████    frame)
```

- **Warrior:** Broad shoulders, heavy sword, square stance. Ember glow on sword edge.
- **Ranger:** Narrow, hooded, bow visible. Ember glow on arrow tips.
- **Mage:** Wide robes flaring at bottom, tall staff. Ember glow on staff crystal.
- **Paladin:** Shield-and-cross profile, widest at shield. Ember glow on shield emblem.

---

## UI Frame Design

Replace ALL `rgba(255,255,255,0.03)` + `border-radius: 14px` cards with pixel art 9-slice frames:

### Parchment Frame (Information)
- Used for: stat displays, descriptions, tooltips, inventory lists, hero details
- Look: Aged paper texture, slightly torn edges, ink-dark border (2px)
- Colors: `#e8e0d4` (parchment), `#1a1824` (border), `#92400e` (corner rivets)

### Iron Frame (Actions)
- Used for: crafting slots, equipment slots, buttons, recipe cards, expedition cards
- Look: Hammered metal border, rivet corners, slight inner shadow
- Colors: `#94a3b8` (iron body), `#64748b` (shadow), `#cbd5e1` (highlights), `#f97316` (active state glow)

### Implementation
- CSS `border-image` with 9-slice sprite sheets
- `<PixelFrame variant="parchment|iron">` wrapper component
- Replaces the glass-morphism cards screen by screen during Phase 1

---

## Animation Standards

| Animation | Frames | FPS | Use |
|-----------|--------|-----|-----|
| Hero idle | 4 | 4 | Gentle bob + breathing. Frame 1-2 up, 3-4 down. |
| Hero walk | 6 | 8 | For exploration mode. Two-step cycle. |
| Hero attack | 3-4 | 12 | Quick swing/cast. Anticipation → action → follow-through. |
| Enemy idle | 2-3 | 3 | Slower than heroes. Menacing sway. |
| Item sparkle | 3 | 6 | On crit craft or rare drop. 3-frame twinkle. |
| Ember particle | 4 | 6 | Ambient forge screen. Float upward, fade. |

---

## Asset Production Pipeline

### For AI-Assisted Concept Art (Midjourney/DALL-E)
1. Generate high-res concept at target mood (e.g., "pixel art warrior, medieval forge, ember glow, dark background, 32x32 style")
2. Use as reference only — AI cannot produce clean pixel art at 16x16 or 32x32
3. Downscale and re-draw in Aseprite by hand using the 14-color palette
4. Export as PNG sprite sheet (horizontal strip, each frame = 32x32 or 16x16)

### For Hand-Drawn Assets (Aseprite)
1. Work at 1x resolution (32x32 canvas for characters)
2. Strict 14-color palette loaded as Aseprite palette file
3. Every sprite gets the forge-touched ember accent
4. Export as individual PNGs or horizontal sprite strips
5. Place in `/public/sprites/` organized by category

### Quality Checklist (Every Sprite)
- [ ] Readable at 32px render size?
- [ ] Silhouette identifiable without color?
- [ ] Uses only the 14-color palette?
- [ ] Has the forge-touched ember accent?
- [ ] Consistent with the Ember Glow temperature logic?
- [ ] Looks good on `#0f0e17` background?

---

## Priority Asset List (Phase 0-1)

### Phase 0 (Proof of Concept)
1. Aldric (Warrior) — 32x32, 4-frame idle

### Phase 1A (Heroes + UI)
2. Lyra (Ranger) — 32x32, 4-frame idle
3. Theron (Mage) — 32x32, 4-frame idle
4. Sera (Paladin) — 32x32, 4-frame idle
5. Parchment 9-slice frame
6. Iron 9-slice frame

### Phase 1B (Items)
7-33. All 27 items + resources at 16x16 (6 resources + 15 weapons/armor/accessories + 6 consumables)

### Phase 1C (Enemies)
34-55. All 22 enemies at 32x32, 2-4 frame idle

### Phase 2 (Exploration)
56+. Environment tiles, node map elements, exploration UI
