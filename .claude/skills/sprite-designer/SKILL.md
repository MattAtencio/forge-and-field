---
name: sprite-designer
description: "Generate or refine SVG sprites for the Forgelight visual system. Use when adding new game entities (heroes, enemies, items, buildings) or improving existing sprite art. Invoke with /sprite-designer <name> [description]."
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Sprite Designer — Forgelight SVG Generator

Generate or refine SVG sprites that conform to the Forgelight visual identity for Forge & Field.

**Scope:** `$ARGUMENTS` specifies the sprite name to create/refine, optionally followed by a description. If empty, list all sprites with a quality assessment.

## Step 1: Load Constraints

Use `Read` to load `docs/VISUAL_IDENTITY.md` for the Forgelight palette and style rules.
Use `Read` to load `components/sprites/spriteRegistry.js` to see existing sprites and the shape format.

Key constraints:
- ViewBox: `0 0 32 32`
- Shape types: `path` (d, fill), `rect` (x, y, w, h, fill, rx), `circle` (cx, cy, r, fill), `ellipse` (cx, cy, rx, ry, fill)
- Use ONLY palette colors from the `S` object in spriteRegistry.js
- Style: chunky medieval fantasy, bold shapes, clear silhouettes, 2-4 colors per sprite
- No gradients, no strokes, no text elements

## Step 2: Design the Sprite

If creating a new sprite:
1. Determine the category (hero, enemy, resource, item, building, UI)
2. Design with clear silhouette readable at 16-32px render size
3. Use the helper functions: `p(d, fill)` for paths, `r(x,y,w,h,fill,rx)` for rects, `c(cx,cy,r,fill)` for circles, `e(cx,cy,rx,ry,fill)` for ellipses
4. Keep shapes under 25 elements for performance
5. Layer back-to-front (background shapes first)

If refining an existing sprite:
1. Read the current definition from spriteRegistry.js
2. Identify issues (readability, color consistency, silhouette clarity)
3. Redesign while maintaining the same visual identity

## Step 3: Output

Add or update the sprite in `components/sprites/spriteRegistry.js` using `Edit`.

If it's a new sprite for a recipe/item, also add the mapping to `RECIPE_SPRITE_MAP` if applicable.

After editing, run `npm run build 2>&1 | tail -5` via `Bash` to verify no syntax errors.

Print a summary: sprite name, category, element count, palette colors used.

## Step 4: Integration Check

If the sprite is for a new game entity, check if data files (`data/*.js`) and components need updating to reference the new sprite name. List any files that should be updated but do NOT modify them without explicit instruction.

## Guardrails

- ONLY use colors from the Forgelight palette (`S` object in spriteRegistry.js)
- Do NOT add new dependencies or libraries
- Do NOT modify component files unless explicitly asked
- Do NOT use strokes, gradients, filters, or text SVG elements
- Keep element count under 25 per sprite for render performance
- Verify build passes after any edit
