# Forge & Field — Town Prototype (Iter 1) — DALL-E 3 Concept Direction

**Scope:** 4 buildings + 1 background silhouette cluster + 10 props for the `/preview/town` dusk diorama.
**Intent:** Produce reference images a hand-pixel artist imports into Aseprite as a bottom layer, then redraws clean against the 14-color Ember Glow palette + Loam + Dusk Sky (16 total).
**NOT for direct asset use.** DALL-E output is concept reference only — no AI pixels ship.

---

## 1. Art Direction Locks (non-negotiable)

| Lock | Value |
|---|---|
| Angle | Shallow 3/4 orthographic (Moonlighter / Stardew / Eastward lineage). NOT 45° isometric. NOT 90° top-down. Front wall visible, roof visible, slight foreshortening. |
| Time of day | Late dusk — sky deepening to violet, ground losing warmth, long low-angle ambient. One lighting condition, no variants. |
| Lighting | Forge door aperture is the ONLY warm emissive in the scene. Everything else is dusk-ambient (cool, low-saturation, no rim light). |
| Palette (16 total, strict) | Ember Glow 14: `#f97316` Ember Core, `#fb923c` Flame, `#fbbf24` Gold, `#92400e` Leather, `#e8e0d4` Parchment, `#cbd5e1` Steel Light, `#94a3b8` Steel Mid, `#64748b` Steel Dark, `#22c55e` Forest, `#a855f7` Arcane, `#0f0e17` Void, `#1a1824` Dark Surface, `#fcd5b0` Skin, `#ef4444` Danger Red. **+ Loam `#6b5d3e` (ground/dirt midtone), + Dusk Sky `#2a2438` (atmospheric band).** No additional hues, no gradients, no dithering beyond Aseprite-native patterns. |
| Scene footprint | 2.5× viewport wide × 1.5× tall ≈ **1075 × 645 px base**. Render concept refs at 2–3× (2150–3225 px wide) so the hand-pixel artist has sub-pixel room to read shapes. |
| Zoom read-layers | Every building must survive two tests: (a) **0.5× silhouette thumb** (~32 px tall) — identifiable by shape alone, no color; (b) **2× detail zoom** — props on facade, forge-touched accents, material breaks readable. |
| Zoom levels | Integer only: 0.5× / 1× / 2×. Non-integer is a visual crime in this genre. |
| Signature move | The "Ember Glow" forge-touched accent: ember-orange spill from the forge door and nowhere else. The forge is the only light source in the town. |

---

## 2. Per-Building DALL-E 3 Prompts

Each building is generated on an **isolated neutral charcoal canvas** (not composited into the scene — composition happens in Aseprite). Native resolution is specified so DALL-E produces crisp shapes the pixel artist can downsample cleanly.

---

### 2.1 The FORGE (hero building — double detail budget)

**Silhouette brief:** Tall asymmetric chimney + squat stone base. Chimney is the logo of the entire game — it must be legible as a pictogram at 32 px tall.

**DALL-E 3 prompt:**
> Pixel art concept reference, 1024×1024 native resolution, of a medieval fantasy blacksmith's forge building rendered in a shallow three-quarter orthographic perspective — front wall and left side wall both visible, slight top-down tilt showing the roof. The building has a squat asymmetric stone base built from irregular cobbles in warm leather-brown (#92400e) and dark steel-grey (#64748b), a single wide rectangular doorway with no door attached, and a tall mismatched brick chimney rising off-center from the roofline with rising smoke implied by silhouette. A warm ember-orange glow (#f97316, #fb923c) spills from the doorway as the only light source, casting a low dusk-lit cast onto the cobble apron in front. Roof is dark slate with wooden structural ribs in leather-brown. Late dusk atmosphere, deep violet sky tone (#2a2438) behind the building, cool ambient everywhere except the door glow. Limited palette — approximately 14 colors, warm forge palette against cool dusk. Flat shading, crisp hard pixel edges, no anti-aliasing, no gradients, no blur. Style reference: **Moonlighter**'s shop exterior and **Graveyard Keeper**'s village buildings. Concept reference for a pixel artist to redraw in Aseprite — isolate building on a clean neutral charcoal (#1a1824) background, no ground tiles drawn past the immediate cobble apron, building centered with ~10% margin.

**Negative prompt / exclusions:** No characters, no NPCs, no smoke particles rendered (silhouette-only smoke), no interior view, no open door, no sign hung outside, no modern elements (no screws, no corrugated metal, no industrial pipes), no 45° isometric angle, no 90° top-down angle, no side-scroller flat 2D, no cute chibi proportions, no Disney rounding, no blue/green/purple magical glow — warm ember orange is the ONLY emissive, no rim lighting on other surfaces, no lens flare, no painterly brush strokes, no watercolor texture.

**Reference games:** Moonlighter (warm-interior shop readability), Graveyard Keeper (medieval village architecture fidelity).

---

### 2.2 The BARRACKS

**Silhouette brief:** Long low rectangle + pitched roof, pennants/banners breaking the roofline, weapon rack outside. Profile is horizontal — the widest building in the scene.

**DALL-E 3 prompt:**
> Pixel art concept reference, 1024×768 native resolution, of a medieval barracks/guild hall building rendered in shallow three-quarter orthographic perspective — front wall and right side wall both visible. The building is a long low rectangle with a shallow pitched roof in dark slate, built from horizontal wooden timber beams in warm leather-brown (#92400e) over a half-stone foundation in steel-grey (#94a3b8, #64748b). Two small windows along the front wall with dark interiors (no candlelight — barracks is unlit at dusk). A single heavy reinforced wooden door, closed. Three triangular pennants/banners fly from the roof peak in muted parchment (#e8e0d4) with a faded gold (#fbbf24) emblem. A wooden weapon rack leans against the front wall to the right of the door, holding the silhouettes of two spears and one training sword (no ember glow — these are training arms, not crafted). Surrounded by cool dusk ambient light, deep violet sky (#2a2438) behind. No warm light from the building itself. Flat shading, crisp hard pixel edges, no anti-aliasing, no gradients. Style reference: **Darkest Dungeon**'s Guild building and **Moonlighter**'s town exteriors. Isolate building on clean neutral charcoal (#1a1824) background, ~10% margin.

**Negative prompt / exclusions:** No characters, no NPCs, no guards standing outside, no interior view, no open door, no light coming from windows, no modern elements, no 45° isometric, no 90° top-down, no side-scroller flat 2D, no ember-orange or warm glow on the building itself (the forge is the ONLY warm emissive in the town — barracks reads cool), no saturated banner colors (parchment + faded gold only), no blood splatter, no grimdark gore, no dithering over 20% coverage, no painterly brush.

**Reference games:** Darkest Dungeon (guild silhouette language and palette discipline), Moonlighter (town exterior scale/feel).

---

### 2.3 The GATE (World Map portal)

**Silhouette brief:** Archway — the negative space IS the read. Sky visible through the arch. Only building you see *through*. Dusk sky gradient framed by stone.

**DALL-E 3 prompt:**
> Pixel art concept reference, 1024×1024 native resolution, of a standalone stone archway gate at the edge of a medieval town, rendered in shallow three-quarter orthographic perspective — front face and slight left interior face visible. The arch is built from large irregular cobbles in steel-grey and dark steel (#94a3b8, #64748b) with warm leather-brown (#92400e) wooden lintel beams at the top. Critical: the center of the arch is open negative space — the deep violet dusk sky (#2a2438) is visible through the opening, with a faint suggestion of distant rolling hills in a darker violet silhouette on the horizon line. Two iron-bound torch brackets flank the arch but are unlit (no warm glow — the forge remains the only emissive light in the town). A simple cobble path of Loam (#6b5d3e) leads into the arch. Cool dusk ambient everywhere, low-angle shadow falling to the right. Flat shading, crisp hard pixel edges, no anti-aliasing, no gradients. Style reference: **Hollow Knight**'s stone arch entrances and **Moonlighter**'s town gate. Isolate on clean neutral charcoal (#1a1824) background, ~10% margin, arch centered.

**Negative prompt / exclusions:** No characters, no NPCs, no gate guard, no portcullis or fence panel blocking the opening (the opening must be readable as a portal — negative space is load-bearing), no torches lit, no magical portal glow, no swirling arcane energy, no blue/purple/green emissive, no ember orange on this building, no banners, no signage, no modern elements, no 45° isometric, no 90° top-down, no painterly.

**Reference games:** Hollow Knight (silhouette-first architecture, negative-space readability), Moonlighter (town-edge gate idiom).

---

### 2.4 The MARKET (stall)

**Silhouette brief:** Angular striped awning + open stall frame. Parchment + one accent stripe in muted red or gold. Color-pop against stone/wood of the other buildings.

**DALL-E 3 prompt:**
> Pixel art concept reference, 1024×1024 native resolution, of a medieval market stall rendered in shallow three-quarter orthographic perspective — front face and right-side face visible. The stall is a simple open timber frame in warm leather-brown (#92400e) supporting an angular peaked awning in parchment/off-white fabric (#e8e0d4) with two vertical stripes in muted danger red (#ef4444, desaturated). Stall counter is a rough wooden plank at waist height, empty (no merchant present). A wooden signboard hangs from one awning corner showing a simple painted goods icon (a loaf or coin silhouette) in gold (#fbbf24). Dusk ambient light, cool violet sky (#2a2438) behind. No warm light from the stall itself. The stripes are the chromatic pop in an otherwise muted town — this is the visual rhythm break against the stone and wood buildings. Flat shading, crisp hard pixel edges, no anti-aliasing, no gradients. Style reference: **Stardew Valley**'s festival stalls and **Moonlighter**'s market exteriors. Isolate on clean neutral charcoal (#1a1824) background, ~10% margin.

**Negative prompt / exclusions:** No merchant, no NPCs, no customers, no goods/produce/wares piled on the counter (counter is intentionally empty in Iter 1 — goods come in Iter 2 with narrative), no modern elements, no bright saturated reds (muted only), no rainbow striping, no multiple accent colors (exactly one stripe color), no ember-orange glow on the stall itself, no lanterns lit, no 45° isometric, no 90° top-down, no painterly brush, no watercolor.

**Reference games:** Stardew Valley (16×16 stall readability and cozy register), Moonlighter (market-stall compositional template).

---

## 3. Background Silhouette Cluster Prompt

Target: 3–5 rooftops that sit at ~0.7 opacity behind the hero buildings, implying "the town continues past what you can see." These are shapes only — no facades, no doors, no props. The eye should read "more town" in 0.3 seconds and move on.

**DALL-E 3 prompt:**
> Pixel art concept reference, 1536×512 native resolution (wide horizontal strip), of a medieval town rooftop silhouette cluster — 3 to 5 buildings seen from shallow three-quarter orthographic angle, rendered as near-silhouettes against a late dusk sky. Each building shows ONLY its roofline and upper wall — no doors, no windows lit, no ground, no props. Rooflines must all differ: one steeply peaked, one shallow-pitch with a chimney offset left, one with a dormer, one flat-topped with a low parapet, one with a cross-gable. All roofs in dark slate/steel-dark (#64748b, #1a1824); upper walls hinted in leather-brown (#92400e) and steel-mid (#94a3b8) at low contrast — these are background elements, not focal. Behind: deep violet dusk sky (#2a2438) with a subtle warmer horizon band near the bottom (desaturated amber suggestion, NOT saturated, NOT emissive). No smoke, no banners, no warm interior light leaking from any window, no forge glow (the forge sits in the foreground layer, not here). Style reference: **Darkest Dungeon**'s hamlet backdrop and **Eastward**'s distant-town silhouettes. Flat shading, crisp hard pixel edges, no anti-aliasing, no gradients. Output as a horizontal silhouette strip on clean neutral charcoal (#1a1824) background, sized to composite behind the foreground scene at ~0.7 opacity.

**Negative prompt / exclusions:** No foreground buildings (this strip is background-only), no ground plane, no props, no NPCs, no warm window lights, no ember glow, no smoke trails, no banners or flags, no sharp detail on any building (silhouette first), no varying opacity within the strip itself (even charcoal), no sky clouds, no moon, no stars, no modern elements, no 45° isometric, no painterly.

**Reference games:** Darkest Dungeon (hamlet backdrop), Eastward (distant-town silhouette treatment).

---

## 4. Props — Single Batch Sheet Prompt

**Decision: batched sheet.** Ten props at 16×16 target, laid out on a 5×2 grid with generous gutters, renders faster than ten single-prop calls and gives the pixel artist a consistent lighting/angle treatment across the set. If any single prop comes back weak, re-generate that one individually.

**Props roster (5×2 grid, left-to-right, top-to-bottom):**
1. Anvil (with faint ember-orange glow on top face — this prop is forge-adjacent)
2. Woodpile (stacked logs, leather-brown, no glow)
3. Cart (wooden hand-cart, two wheels, empty)
4. Crate A (square, wood-slat)
5. Crate B (rectangular, reinforced with iron bands — shape contrast with Crate A)
6. Well (round stone base, wooden roof, bucket on rope)
7. Signpost (wooden post + blank plank, no text)
8. Lantern A (standing iron pole lantern, unlit)
9. Lantern B (hanging wall-bracket lantern, unlit)
10. Fence segment (3-rail wooden fence, ~24px wide, tileable left/right edges)

**DALL-E 3 prompt:**
> Pixel art concept reference sheet, 1280×512 native resolution, of ten small medieval props laid out on a clean 5-column × 2-row grid with 20-pixel gutters between each prop and a 40-pixel outer margin. Clean neutral charcoal (#1a1824) background throughout, no ground shadows touching between props. All props rendered in shallow three-quarter orthographic perspective matching a town dusk scene. Props, in grid order (row 1 left-to-right, then row 2 left-to-right): (1) **anvil** — dark steel (#64748b) body on a leather-brown (#92400e) wooden block, faint ember-orange (#f97316) glow on the top striking face indicating recent use (THIS IS THE ONLY EMBER ACCENT IN THE SHEET); (2) **woodpile** — stacked leather-brown (#92400e) logs, end-grain visible; (3) **cart** — wooden handcart with two round wheels, empty bed, leather-brown; (4) **crate A** — square wooden slat crate, leather-brown with steel-mid (#94a3b8) nail details; (5) **crate B** — rectangular reinforced crate with iron bands in steel-dark (#64748b) — visually distinct from crate A; (6) **well** — circular stone base in steel-grey, small peaked wooden roof on two posts, bucket hanging on rope; (7) **signpost** — simple wooden post with a blank horizontal plank, leather-brown; (8) **lantern A** — standing iron pole lantern, steel-dark pole, glass housing unlit (dark); (9) **lantern B** — hanging wall-bracket lantern, iron bracket, glass housing unlit (dark); (10) **fence segment** — three horizontal leather-brown rails on two vertical posts, designed as a tileable middle segment. All props at consistent scale (approximately equal bounding volumes), lit by cool dusk ambient from upper-left. Flat shading, crisp hard pixel edges, no anti-aliasing, no gradients. Style reference: **Stardew Valley** 16×16 item sheets and **Graveyard Keeper** prop inventory icons. Output as a flat reference sheet — pixel artist will cut each cell into individual Aseprite layers.

**Negative prompt / exclusions:** No lit lanterns (both lanterns unlit — the forge is the only warm light in the scene), no ember glow on any prop except the anvil, no characters, no NPCs, no animals, no dropped shadows between props (each prop isolated on charcoal), no backdrop detail, no ground plane, no props touching grid neighbors, no varying perspectives within the sheet (all same three-quarter angle), no modern elements (no screws, no corrugated metal, no plastic), no cutesy Disney rounding, no painterly, no watercolor, no labels or text on the sheet.

**Reference games:** Stardew Valley (16×16 readability), Graveyard Keeper (prop set consistency).

---

## 5. Generation + Handoff Order

### Generate the FORGE first. Always.

- **Why:** The Forge is the only building with the ember-glow signature move. It sets the contrast floor (how warm is warm, how cool is cool), the light-falloff rule, the palette ratio (how much of each of the 16 colors in a "correct" scene), and the detail density that every other building must match. Generating Barracks or Market first risks anchoring on a muted scene and then having the Forge feel over-saturated when it finally lands — forcing a redo of all three non-hero buildings. Forge first = identity lock, then others anchor to it.
- **Second:** Background silhouette cluster — cheap to generate, locks the compositional depth budget before hero buildings are finalized at the pixel level.
- **Third & fourth in parallel:** Barracks + Gate. Both cool-toned, neither competes with the Forge's identity, so they can run concurrently.
- **Fifth:** Market — it has the one chromatic pop (muted red stripe), so it goes last; landing it last lets the pixel artist tune the stripe saturation against the already-finalized neighbors.
- **Sixth:** Props sheet — batched once the four building references are approved, so the prop lighting matches the building lighting the pixel artist has already internalized.

### Variants per prompt before hand-pixeling

**3–4 variants per prompt.** Four if the prompt is novel (Forge, Gate archway). Three if the prompt extends an established look (Barracks once Forge is locked; Market once Barracks is locked). Founder picks one winner per set; pixel artist can steal elements from the runners-up (a window shape from variant B, a chimney angle from variant C). No more than four per prompt — past four the variance is noise, not signal, and the spend compounds.

### Hand-pixel estimates (DALL-E ref → Aseprite-finished asset)

| Asset | Hours |
|---|---|
| Forge (hero, 2× detail budget) | 8–10h |
| Barracks | 5–7h |
| Gate | 4–6h |
| Market | 4–5h |
| Background silhouette cluster | 2–3h |
| Props sheet (10 props) | 8–10h |
| Ground pass (Loam dirt path + grass + cobble, hand-painted, layered) | 4–6h |
| **Total hand-pixel** | **35–47h** |

### Cross-check against the 35h plan budget

The plan locks ~35h of Aseprite time for Iter 1. My estimate lands **35h at the low end, 47h at the high end**. The low end is achievable only if the Forge DALL-E reference comes back strong on pass 1 and the pixel artist doesn't re-pass it. Realistic expectation: **~40h**, a 5h overrun on the plan's 35h budget. Flag to founder now: the plan budget is tight, not impossible. Options if 35h is hard: (a) cut the hand-painted ground pass to a simpler single-tone Loam flat (saves ~3h), or (b) defer Lantern B and Crate B variants to Iter 2 (saves ~2h).

---

## 6. Temp-Tile Fallback Strategy

Per art review, a sub-$30 itch.io medieval town tileset is acceptable as **temp visual reference** while the hand-pixel passes happen. This lets the `/preview/town` route render *something* in-browser during the 3–5 day iteration window, so the founder can judge the camera/pan/zoom feel on a plausible-looking town before the final pixel art lands.

**Recommended packs (pick one):**
- **Szadi Art — Medieval Fantasy Character Pack / Tiny Town** (itch.io, commercial-allowed license, ~$10–15). Clean 16×16 pixel art, dusk-compatible palette, readable silhouettes. Closest match to our target look.
- **Limezu — Serene Village** (itch.io, ~$15–25). Larger tiles, slightly more saturated but the architecture silhouettes align with our Forge/Barracks/Gate/Market brief.

**Usage contract — these NEVER ship:**
- Temp tiles go on a dedicated Aseprite layer marked `TEMP_TILESET_KILL_BEFORE_RELEASE`.
- A build-time lint check (or a pre-commit grep for the filename prefix `tmp-`) blocks any PR that references the temp tileset asset path outside `/preview/town`.
- At the Iter 1 freeze gate, the pixel artist's hand-drawn assets replace every temp tile. Temp layer deleted. Temp asset files deleted from `art/concepts/town/temp/`.
- Attribution is not required if the tiles never ship, but we'd still respect the license terms during the temp window.

If the pixel artist lands final art before Iter 1 review, skip the temp tileset entirely — better to see the real thing a day later than to get anchored on a tileset that isn't ours.

---

## Open Risks Before Generation Spend Is Approved

1. **Palette bleed.** DALL-E 3 will approximate the 16-color palette but will not land exact hex values. Expected, not a problem — the pixel artist re-palettes to the .gpl in Aseprite. Flag: if a DALL-E variant looks great but uses an out-of-palette hue (e.g., a teal sky instead of dusk violet), the pixel artist must resist preserving it. Enforce in the Aseprite pipeline via the "only Ember Glow + Loam + Dusk Sky" lint.
2. **Perspective drift.** DALL-E tends to slide toward 45° isometric when asked for "three-quarter orthographic." Expect 1 in 4 variants to come back isometric. Rejecting these early is cheaper than fighting them in prompt tweaks — just re-roll.
3. **Ember-glow overreach.** DALL-E loves to rim-light everything once you mention warm glow. Watch for ember spill on Barracks roofs or Gate cobbles — that's a palette violation. Reject variants that put warm light outside the Forge door's immediate cast radius.
4. **Generation spend.** 4 buildings × 4 variants + 1 background × 3 variants + 1 props sheet × 3 variants = ~22 DALL-E 3 calls for Iter 1. At current API pricing this is low two-digit dollars, but worth confirming with the founder before kicking off. Re-rolls on rejected variants could push it to ~30 calls.
5. **Props sheet cohesion.** DALL-E 3 struggles with consistent scale across a 10-cell grid. Expect at least one prop (usually the well or fence) to come back at wrong scale. Budget one re-roll on 1–2 individual props after the batch returns.
6. **The 35h art budget.** My hand-pixel estimate is 35–47h; the plan locks 35h. Flagged above. Founder should decide whether to absorb a likely 5h overrun, cut the hand-painted ground pass, or defer two props to Iter 2.
