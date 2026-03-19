# Forge & Field — Visual Identity: "Forgelight"

## Overview

**Forgelight** is the visual identity system for Forge & Field. It replaces all emoji placeholders with a cohesive set of hand-crafted SVG sprites, creating a warm, medieval fantasy aesthetic centered around the forge — the heart of the game.

## Art Direction

### Style
- **Chunky medieval fantasy** — bold shapes, saturated colors, clear silhouettes
- Designed at 32x32 viewBox, rendered at 24-48px depending on context
- `image-rendering: auto` (smooth SVG scaling, not pixel art)
- Every sprite uses the shared Forgelight palette for visual cohesion
- Simple geometry: circles, rounded rectangles, clean paths
- 2-4 colors per sprite, no gradients (flat color fills only)

### Mood
Warm and inviting, like firelight in a medieval workshop. The game should feel **cozy but adventurous** — a place where you craft by the fire and send heroes into the wild. Dark backgrounds make the warm sprite colors pop.

### Color Palette

#### Core Theme
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#07070f` | App background (existing) |
| Surface | `rgba(255,255,255,0.03)` | Card backgrounds (existing) |
| Text Primary | `#e8e8f0` | Body text (existing) |
| Text Muted | `#8888a0` | Labels, secondary text (existing) |
| Brand Orange | `#f97316` | Primary accent, forge fire |

#### Sprite Palette
| Name | Hex | Usage |
|------|-----|-------|
| Steel Light | `#cbd5e1` | Metal highlights, armor |
| Steel Mid | `#94a3b8` | Metal bodies, weapons |
| Steel Dark | `#64748b` | Metal shadows, armor detail |
| Gold | `#fbbf24` | Gold accents, paladin, coins |
| Gold Dark | `#d97706` | Gold shadows |
| Leather | `#92400e` | Leather armor, wood accents |
| Leather Light | `#b45309` | Leather highlights |
| Wood | `#a16207` | Wood, handles |
| Wood Dark | `#78350f` | Wood shadows |
| Skin | `#fcd5b0` | Skin tones |
| Skin Shadow | `#d4a574` | Skin shadows |
| Forest Green | `#22c55e` | Ranger, herbs, nature |
| Forest Dark | `#15803d` | Green shadows |
| Arcane Purple | `#a855f7` | Mage, gems, magic |
| Arcane Dark | `#7c3aed` | Purple shadows |
| Ice Blue | `#38bdf8` | Ice, frost, iron |
| Ice Light | `#7dd3fc` | Ice highlights |
| Ember Red | `#ef4444` | Fire, danger, enemies |
| Ember Dark | `#b91c1c` | Fire shadows |
| Flame Orange | `#fb923c` | Forge fire, warmth |
| Stone | `#9ca3af` | Stone, rocks |
| Stone Dark | `#6b7280` | Stone shadows |

### Typography (unchanged)
- **DM Serif Display** — headings, titles
- **Outfit** — body text, UI labels

## Technical Architecture

### Sprite System
- **Zero dependencies** — pure SVG rendered as React components
- All sprites defined in `components/sprites/spriteRegistry.js`
- Single `<Sprite>` component handles all rendering
- Sprites are inline SVG (no external files, no network requests)
- CSS animations for idle bob, glow effects, combat flashes

### Sprite Component API
```jsx
<Sprite name="warrior" size={32} />           // Basic usage
<Sprite name="wood" size={16} className={s} /> // With custom class
<Sprite name="lock" size={24} muted />         // Dimmed/locked state
```

### Animation System
- CSS `@keyframes` for all animations
- `float` — gentle 2px vertical bob for idle heroes
- `glow` — pulsing opacity for active/highlighted elements
- `shake` — quick horizontal shake for combat hits
- `fadeSlideIn` — entry animation for combat log lines
- `spin` — rotation for loading/crafting states

### Asset Pipeline (Future)
When the AI designer agent (Issue #22) is implemented:
1. Generate sprites via AI with style constraints from this doc
2. Export as SVG with the Forgelight palette
3. Replace entries in `spriteRegistry.js`
4. No component changes needed — same `<Sprite>` API

### Sprite Categories

| Category | Count | Examples |
|----------|-------|---------|
| Heroes | 4 | warrior, ranger, mage, paladin |
| Resources | 6 | wood, stone, iron, herbs, gems, gold |
| Items | 15 | sword, axe, hammer, staff, bow, vest, mail, plate, shield, ring, pouch, charm, amulet, tome, wand |
| Enemies | 17 | goblin, wolf, treant, golem, harpy, bandit, etc. |
| Buildings | 4 | storehouse, war_camp, apothecary, smithy |
| Navigation | 7 | hub, forge, barracks, map, season, village, lock |
| UI Icons | 7 | heart, attack, defense, speed, chest_common/uncommon/rare |
| Status | 3 | idle, expedition, resting |
| **Total** | **63** | |

## Integration Points

Every component that previously rendered emoji text now renders `<Sprite>`. Data files store sprite name strings (e.g., `"warrior"`) instead of emoji Unicode (e.g., `"⚔️"`). The `<Sprite>` component gracefully falls back to text rendering for any unrecognized name, ensuring backwards compatibility with existing save data.

## Ambient Effects

- **Forge screen**: Subtle ember particle CSS animation in header
- **Combat**: Screen flash on hit, shake on critical
- **Crafting complete**: Sparkle pulse animation
- **Region cards**: Subtle ambient glow matching region theme color
