# Two-Track Overlay Plan — Mechanics Polish + Town Prototype

**Date:** 2026-04-16
**Author:** Claude (Orchestrator)
**Status:** APPROVED with locks (2026-04-16) — reviewed by Marcus (game-pm), art director, and senior indie dev
**Overlays:** `docs/PROJECT_PLAN.md` (Marcus, 2026-04-10)

---

## Principle

Run two independent tracks in parallel. The existing plan continues, but a second parallel track begins building toward the town-based v2 endgoal NOW, as a standalone lightweight prototype — not integrated into the game yet. This lets us see-and-decide the visual direction early while polish keeps landing, without double-work if either side pivots.

> **Founder's framing (Apr 16):** "Polish is fine as long as it's about mechanics, gameplay, and things that will be reused. But we need to start creating the main town or we could do all this work and decide the vision doesn't look right later. First iteration is just a lightweight view of a town we can see, scroll/pan and zoom around to explore different parts, and click on buildings. No part of the game wired in. It acts as a pointless diorama at first so we can see it in the app and make design decisions."

---

## Track A — Mechanics Polish (Background Agent Cohort)

**Owner:** Orchestrator + parallel background agents (like today's Wave 1).
**Branch:** continues on `feature/v2-phase3-push` (current), then future `feature/v2-phase4-*` branches as we move through PROJECT_PLAN phases.
**Surface:** everything INSIDE the buildings — forge, barracks, expeditions/exploration, village buildings, season, prestige, combat, consumables, inventory, items, balance. These systems survive the town hub transition unchanged; they just get accessed from different entry points.
**Out of scope for Track A:** the top-level hub/landing screen, the town as a visual location, any building illustrations or walk-around logic.
**Cadence:** wave-based, 4–6 parallel agents per wave against non-overlapping file surfaces. ~1 wave per working day based on today's throughput.
**Wave 2 candidates (for Marcus's call, all parallelizable, reusable post-town):**
- PrestigePanel UI polish (apply PixelFrame + button juice)
- ExpeditionScreen UI polish
- WorldMapScreen polish (will become the "World Map portal" interior)
- SettingsModal additions (SFX toggle, animation speed, localStorage only)
- ExplorationScreen ambient atmosphere polish
- Expedition streak bonus (engagement — +25% after 3 same-region)
- Login streak gentle reward (engagement)

## Track B — Town Prototype (Expert Track)

**Owner:** Orchestrator directly (design-heavy, single driver) with support from specialist skills (pixel-artist, game-art-review). Optionally a focused background agent when work is well-scoped.
**Branch:** NEW dedicated branch `feature/town-prototype`, off `v2/visual-overhaul`. Isolated from Track A. Never touches reducer, save, or existing game screens.
**Surface:** new route `/preview/town` (or `/town-prototype`) — a standalone scene. A wrapper component `TownPrototype.jsx`, a pan/zoom viewport, a town canvas, building illustrations with clickable hotspots, ambient effects. No pawn, no walk-around, no character movement. No game state. No routing into real screens.
**Cadence:** iteration-based, not wave-based. Each iteration produces a playable artifact the founder can see in-browser. Founder approves/redirects at each gate.

### Track B Iteration 1 — "Lookable Diorama" (target: 3–5 days, hard kill at end of week 2)

**Visual Locks (from art review, non-negotiable before a single pixel is drawn):**
- **Angle:** shallow 3/4 orthographic (Moonlighter / Stardew / Eastward lineage). NOT pure top-down. NOT pure isometric.
- **Scene size:** 2.5× viewport wide, 1.5× tall. Enough to reward panning, small enough to finish.
- **Time of day:** late dusk. One lighting condition only. Maximum contrast between forge glow and cool ambient.
- **Signature lighting:** forge door is the ONLY warm emissive light source in the scene. Everything else lit by dusk ambient. This is the hero shot.
- **Palette extension:** exactly 2 environment tones added on top of Ember Glow palette — "Loam" (~`#6b5d3e`) for ground/dirt midtone, dusk-sky (~`#2a2438`) for atmospheric band. No water, no additional browns, no more colors.
- **Zoom levels:** integer multiples only — `0.5× / 1× / 2×`. Non-integer zoom on pixel art is a visual crime in this genre.

**Scope Locks (from art review):**
- **4 buildings, hero-rendered:** Forge (2× detail budget of anything else), Barracks, Gate/Portal to World Map, Market stall.
- **1 background silhouette cluster** (3–5 rooftops, no interior detail) to imply "town continues."
- **10 props:** anvil outside forge, woodpile, cart, 2 crates, well, signpost, 2 lanterns, fence segment.
- **3 tile types** (dirt path, grass, cobble) OR a single hand-painted ground pass.
- **NO NPCs in Iter 1.** Purposeless pacing NPCs read as MMO background. Add them in Iter 2 with narrative intent (blacksmith at the forge, quartermaster at barracks door).
- **2 ambient motion loops:** chimney smoke, forge ember flicker. `prefers-reduced-motion`-safe.
- **Layered PNG authoring from day 1:** separate ground / buildings / props / weather-overlay layers so seasonal variants in Iter 3+ are overlay swaps, not full repaints.

**Silhouette Locks (from art review):**
- **Forge:** tall asymmetric chimney + squat stone base. Chimney is the logo. Ember glow spills from door aperture.
- **Barracks:** long low rectangle, pitched roof, pennants/banners on the roofline, weapon rack outside (Darkest Dungeon Guild cue).
- **Gate (World Map portal):** archway silhouette — negative space is the read. Sky visible through it. Only building you see *through*.
- **Market:** angular striped awning. Parchment + one accent stripe. Color-pop against stone/wood buildings.
- **Rule:** no two buildings share a roofline angle. Four distinct silhouette families.

**Camera/Input Locks (from mechanics review):**
- **Library:** `react-zoom-pan-pinch` (~15KB, solves pinch/drag/bounds/cursor-zoom/click-vs-drag out of the box). Do not hand-roll.
- **Bounds clamp every frame.** Non-negotiable. Without it, users scroll into the void in 3 seconds and the illusion dies.
- **Cursor-anchored zoom** (NOT center-zoom). Math: offset pan by `(cursor - center) * (1 - scaleRatio)`.
- **~300ms inertia decay** on drag release.
- **Rubber-band at bounds** (resist with ~0.3 multiplier past edge, spring back on release). Hard stops feel broken even when they aren't.
- **Click-vs-drag via 5px movement hysteresis** — NOT timing thresholds.
- **Pointer Events API** — one code path for mouse/finger/stylus.

**Deliverable:** a new page at `/preview/town` that shows:
1. The hand-painted 3/4 dusk town scene with the 4 buildings, background silhouette cluster, and ~10 props.
2. Pan (drag) + zoom (wheel / pinch, integer multiples only) + click-hotspots on buildings (logs `console.log("would enter Forge")` — no real navigation).
3. Two ambient motion loops: chimney smoke, forge ember flicker.
4. Forge door glow as the sole warm emissive, with dusk ambient elsewhere.

**Not in Iteration 1:**
- Player pawn / character movement / walk-around
- NPCs of any kind (including "ambient silhouettes" — explicitly cut by art review)
- Real navigation into game screens
- Save persistence, game state
- Multiple scenes or transitions
- Day/night, weather, seasons (other than the dusk lock)
- NPC dialogue
- Collision or physics of any kind
- Non-integer zoom

**Art Pipeline (from art review):**
- PixelLab stays on character sprites. It is wrong for architecture.
- Buildings: DALL-E 3 concept → Aseprite hand-pixel. ~4–6h per building → ~25h for 4 buildings.
- Props: Aseprite direct, ~10h total.
- Ground/sky: Aseprite hand-paint, layered PNG.
- Total Iter 1 art budget: **~35h Aseprite time.** This competes with the hero/enemy sprint pipeline.
- Optional: itch.io atmospheric medieval tileset (<$30, e.g. Szadi Art, Limezu) as reference/temp only. Kill before ship.

### Track B Iteration 2 — "Directional Calls" (target: 3–5 days after Iter 1 review)

Based on founder feedback from Iteration 1. Typical next moves:
- Tile-based vs. hand-painted scene commitment
- Top-down vs. 3/4 isometric vs. side-view commitment
- Scene-scale and camera bounds (how much map is there to pan across?)
- Building roster additions (which buildings deserve their own hotspot in the demo?)
- First seasonal dressing layer (swap a texture or add decoration to validate the seasonal-town idea)
- Richer hotspot affordance — floating icons, tooltips, or callout frames

### Track B Iteration 3+ — "Ready-to-Integrate"

When the founder says "this is the town," we freeze the prototype and draft the integration spec. That spec gets scheduled into PROJECT_PLAN — likely as a new Phase 3B sprint or (if it slips) a post-Next-Fest launch sprint.

---

## Coordination Rules

1. **No surface overlap.** Track A never touches `/preview/town` or `components/town/*`. Track B never touches reducers, save state, or any existing screen component (`HubScreen`, `ForgeScreen`, `BarracksScreen`, etc.).
2. **One branch per track.** `feature/v2-phase3-push` for Track A work, `feature/town-prototype` for Track B. Both eventually merge into `v2/visual-overhaul`, but independently.
3. **Shared foundations only.** Both tracks read from `components/sprites/*`, `components/shared/PixelFrame.*`, `data/*` (existing, not new gameplay data). Neither modifies these except through dedicated waves.
4. **No integration code in Track B.** Building click handlers do nothing. No `useGameState`. The prototype is sealed from game state by design.
5. **Review at each Iter gate.** After each Track B iteration, founder reviews in-browser, then decides: next iteration / freeze / redirect.

---

## Decision Gates

Per Marcus: gates stay lean. No bloating.

| Gate | What's decided (and ONLY this) | Consulted |
|---|---|---|
| Iter 1 review | (a) Does the visual direction land? (b) Go/no-go on Iter 2. That's it. | Founder |
| Iter 2 review | Building roster for demo, ambient atmosphere level, seasonal theming approach, NPC intent | Founder + game-narrative-review + vp-design-review |
| Freeze gate | Prototype is the town. Schedule integration work. Must be "screenshot-ready" — defined as: a dusk hero shot of the forge compound that could ship as a Steam capsule-art crop unedited. | Founder + game-pm |
| Integration gate (post-freeze) | Does Town Hub ship IN the demo build for Next Fest, or post-launch? | game-pm owns, founder signs |

**Hard kill:** if Iter 1 isn't lookable by end of week 2, kill Track B immediately. Absorb findings as concept art for the eventual post-launch town. Demo ships menu-based with Track A polish + "town hub coming in 1.0" teaser on Steam.

---

## Schedule Impact (Honest — corrected per Marcus)

- **Track A throughput drops 15–25% while Track B is hot.** Single orchestrator brain and single founder attention. Previous "Track A is unaffected" framing was too optimistic. Wave cadence slows from ~1/day to ~3/week during Track B active periods.
- **Freeze by early May:** integration becomes Phase 3B sprint (May 23–Jun 8 window). Tight but Marcus would take the bet at 60/40. Town Hub sells the demo in screenshots; higher wishlist conversion.
- **Freeze by mid-May:** integration slips to post-Fest. Demo ships menu-based. **This is fine.** Do not force Town Hub into the demo from a mid-May freeze — that's the pattern where both streams lose.
- **Freeze not until June:** abandon integration for the demo. Town becomes the Q1 2027 launch headline feature. Better story for launch-week press anyway.
- **Art cost not in original PROJECT_PLAN budget:** ~35h Aseprite time for Iter 1, competing with hero/enemy sprint hours. Or $300–800 if commissioned.

---

## Why This Works (and Why It's Honest)

- **Parallelism without conflict.** Today's Wave 1 showed 5 agents can run on non-overlapping file surfaces. Scaling to two tracks is the same principle, larger scale.
- **Reduces risk of sunk cost.** Menu polish that becomes obsolete when town lands is acceptable risk (~10% of Wave 1's output). Building town hub scaffolding that turns out to be the wrong visual is catastrophic risk. Track B de-risks the bigger bet.
- **Makes the vision visible to the founder NOW.** A prototype in the browser beats any number of plan docs for judging "does this feel like my game?"
- **Doesn't require a schedule decision today.** Marcus's plan keeps running. We add information (the prototype) that informs a later call — don't pre-commit.

---

## Review Team Answers (2026-04-16)

### Marcus / game-pm: Approve with conditions
- Wave 2 Track A roster: **take** WorldMap polish, ExpeditionScreen polish, SettingsModal, Expedition streak bonus. **Defer** PrestigePanel polish (low session freq), Exploration ambient (don't polish a placeholder). **Cut** Login streak (his Phase 4 item — don't pull forward).
- Track B is a shadow stream on Phase 3 — no new line item needed, but the -15–25% throughput drop and ~35h art budget need honest accounting (now in Schedule Impact above).
- Freeze gate MUST have a concrete screenshot-ready bar. Now defined in Decision Gates.

### Art director: Greenlight with visual/scope/palette locks
- Shallow 3/4 orthographic angle, late dusk lighting, forge-glow as sole warm emissive — all captured in Visual Locks above.
- 4 buildings + 10 props + 3 tiles. No NPCs in Iter 1.
- Hand-painted scene (not tiled) for a singular hub. Tile the World Map regions later.
- PixelLab stays on characters only. Buildings via DALL-E concept → Aseprite hand-pixel.
- Palette: +2 tones (Loam, dusk-sky) and NO MORE.
- Integer zoom multiples only.

### Senior indie dev (mechanics): Greenlight, library pick
- Use `react-zoom-pan-pinch`. ~15KB, handles pinch/drag/bounds/cursor-zoom/click-vs-drag out of the box. Hand-rolling is a 2-day tax you can't afford in a 3–5 day scope.
- Camera feel musts: bounds clamp, cursor-anchored zoom, 300ms inertia decay, rubber-band edges, 5px click-vs-drag hysteresis, Pointer Events. All baked into Camera/Input Locks above.
- Zero reusable pan/zoom scaffolding in the existing ExplorationScreen — rewrite from zero.

### Deeper questions the prototype will surface (from mechanics review, eyes-open for Iter 2)
- Should traversal between buildings have time/animation cost, or is instant teleport the fantasy?
- Is zoomed-out (0.5×) or zoomed-in (2×) the "default" the player lives in? Decides art detail level.
- What happens at scene edges — hard town border, or does the world map bleed in? Core vision call disguised as a camera bound.

### (Deferred to later rounds)
- **game-narrative-review:** environmental storytelling pass after Iter 2 lands
- **customer-voice:** first-10-seconds gut check at Freeze gate (not before)

---

## Immediate Next Actions (APPROVED 2026-04-16)

1. ✅ Founder approved the overlay plan.
2. ✅ Reviewers (Marcus, art, mechanics) delivered. Locks baked in above.
3. Cut `feature/town-prototype` branch off `v2/visual-overhaul` (in progress).
4. Dispatch Track A Wave 2: WorldMap polish, ExpeditionScreen polish, SettingsModal, Expedition streak bonus (parallel background agents).
5. Install `react-zoom-pan-pinch`, scaffold `/preview/town` route with placeholder buildings. Get pan/zoom feeling right with rectangles BEFORE art lands.
6. Kick DALL-E concept passes for the 4 buildings in parallel (agent).
7. First Iter 1 review happens in-browser with the founder at end of week 1 or start of week 2.
