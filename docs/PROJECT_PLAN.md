# Forge & Field -- Master Project Plan

**EP:** Marcus Hale
**Date:** 2026-04-10 (updated 2026-04-16)
**Status:** APPROVED (Apr 10, 2026) — augmented by two-track overlay (Apr 16, 2026)

---

## Status Update — 2026-04-16

Execution is ahead of the original plan. Phase 0, Phase 1A–C, and Phase 2 (Exploration MVP) have shipped on `feature/v2-phase3-push` (merged from `v2/visual-overhaul` + `feature/autonomous-v2`). The March balance report's final open item (Epic pity system) shipped the same day.

**Shipped (not updated inline below to preserve original plan):**
- ✅ Phase 0 — Combat balance fixes, Crit Craft mechanic, Welcome Back modal overhaul, Prestige rebalance (Veteran's Start 5 stars + Forgemaster's Memory), Aldric 32×32 pixel art with 4-frame idle, Sprite component dual-mode, Demo Scope document. **Open:** Steamworks registration ($100 fee) — founder action.
- ✅ Phase 1A — 4 hero sprites with forge-touched ember accents, PixelFrame (parchment + iron), frames applied to Hub/Forge/Barracks, font swap (Crimson Pro, JetBrains Mono, DM Serif Display).
- ✅ Phase 1B — Narrative voice rewrite of regions + expeditions, The Reforging rename, in-voice microcopy, item sprites, narrative event text.
- ✅ Phase 1C — Enemy sprites, button juice, craft sparkle + gold-coin fly (shipped today as part of Wave 1), hero flavor text, PixelFrame on Village/Season/Modal screens. **Open:** Steam Coming Soon page — founder action.
- ✅ Phase 2 — Full Exploration MVP (20-spec autonomous sprint). Node maps for all 5 regions, player-controlled interactive combat, loot bag, 3 consumables, flee, exploration-only resources, save/load integration.
- ✅ **Wave 1 polish (2026-04-16):** DesktopFrame for Steam wide-screen, Forge juice (craft sparkle + coin fly), Barracks inventory grid toggle, Wandering Merchant event (cadence 30–45 min), Hub resource cap indicators, Epic pity system.

**Two-track overlay active (2026-04-16):** See `docs/TWO_TRACK_PLAN.md`. Track A continues mechanics polish on `feature/v2-phase3-push`. Track B begins a Town Hub visual prototype on new `feature/town-prototype` branch (pan/zoom diorama, pixel-art 3/4 dusk scene, sealed from game state). Reviewed and locked by art director + senior indie dev + Marcus. Hard kill at week 2 if Iter 1 isn't lookable.

**Net effect on the timeline below:** Phase 3 (Demo & Steam Prep, Jul 20 – Sep 1) can begin earlier with Track A polish already banked. Town Hub's integration — if prototype converges by early May — drops into Phase 3 as a new Sprint 3B item. If it slips past mid-May, it becomes the Q1 2027 launch centerpiece (not a demo feature).
**Founder Decisions:**
- Plan: APPROVED as-is
- Steamworks: Founder will register after first major MVP showing (not this week)
- Capsule art: Start with AI-generated (free), replace with commissioned before go-live if needed
- Narrative voice: Will review when delivered, may expedite timeline
- Aldric proof-of-concept: Approved as Phase 0 gate

---

## Vision Statement

Forge & Field transforms from a solid but visually placeholder idle/incremental RPG into a visually stunning pixel art game with real exploration, where players craft gear at a medieval forge, walk heroes through dangerous regions on node-based maps, fight turn-based combat with player agency, and haul rare materials back to fuel the next creation. The idle core stays intact. Exploration layers on top. The result: "Loop Hero with a forge" -- a game that is idle when you want and active when you are here, with pixel art quality that earns the $14.99 Steam price point.

---

## Success Criteria

| Metric | Target | Deadline |
|--------|--------|----------|
| Coming Soon page live on Steam | Published | May 1, 2026 |
| Pixel art heroes + UI chrome in-game | 4 heroes + 2 frame types playable | Jun 1, 2026 |
| Exploration MVP playable (Greenwood) | Node map, player combat, loot bag | Jul 15, 2026 |
| Demo feature-complete | Greenwood exploration, 2 heroes, T1 crafting | Sep 1, 2026 |
| Next Fest demo submitted | Reviewed and approved by Valve | Oct 5, 2026 |
| October Next Fest participation | Live with demo | Oct 19-26, 2026 |
| Wishlists at launch | 7,000 (floor) / 15,000 (target) | Q1 2027 |
| Full game launch on Steam | All regions, all heroes, polish complete | Jan-Mar 2027 |

---

## Critical Path

The October 2026 Next Fest is the fixed deadline that everything works backwards from. Missing it pushes launch to H2 2027, costing 4-6 months of wishlist accumulation. Every phase below is sequenced to hit that date.

---

## Phase 0: Foundation (Apr 10 - Apr 25, 2 weeks)
**Theme: Unblock everything. No visual change yet.**

### Deliverables
1. **Steamworks registration + $100 app fee paid** -- unblocks Coming Soon page
2. **Combat balance fixes** from March report -- enemies deal meaningful damage in exploration difficulty mode
3. **Crit Craft mechanic** -- 10% chance of +1 rarity tier on craft completion (highest-ROI engagement fix, 0.5 days)
4. **Welcome Back modal overhaul** -- show expeditions complete, chests ready, daily quests reset, actionable prompt
5. **Prestige cost rebalance** -- Veteran's Start: 10 -> 5 stars. Add 2-star "Forgemaster's Memory" bonus (start with 3 T1 items)
6. **First hero pixel art proof-of-concept** -- Aldric at 32x32 in Aseprite, 4-frame idle animation, using the refined 14-color palette
7. **Sprite component dual-mode** -- modify Sprite.jsx + spriteRegistry.js to support both SVG arrays (current) and sprite sheet objects (new)
8. **Demo scope document** -- define exactly what is in/out of the demo, written and approved

### Approval Gate
**Founder reviews:** Aldric pixel art proof-of-concept. If it looks right at 32x32 on the dark background with the ember accent, Phase 1 proceeds at this resolution. If not, we iterate before investing 100+ hours.

### Risk Flags
- If Aldric pixel art does not hit the quality bar in week 2, the entire art timeline shifts. This is the highest-risk item in the plan. Mitigate by generating AI concept art in parallel (Midjourney references) so the founder can approve the direction even if the first hand-drawn attempt needs iteration.

---

## Phase 1: Visual Transformation (Apr 25 - Jun 8, 6 weeks)
**Theme: The game looks like a game, not a fintech app.**

### Sprint 1A: Heroes + UI Chrome (Apr 25 - May 9, 2 weeks)

**Deliverables:**
1. **4 hero sprites at 32x32** with idle animation (4 frames each) -- following silhouette principles from art review (Warrior=rectangle, Ranger=triangle, Mage=inverted triangle, Paladin=cross)
2. **Forge-touched ember accent** on every hero sprite (glowing sword edge, ember arrows, staff spark, shield emblem)
3. **2 pixel art 9-slice frames** -- parchment (information cards) and iron (action elements). Implement as `<PixelFrame>` component using CSS `border-image`.
4. **Apply frames to Hub, Forge, and Barracks screens** -- every card transforms from SaaS glass-morphism to medieval fantasy
5. **Font swap** -- replace Outfit with Crimson Pro (body), add JetBrains Mono (stat numbers), keep DM Serif Display (titles)

**Agents/Skills:** sprite-designer for hero concept references. Dev agent for Sprite component migration and PixelFrame implementation.

### Sprint 1B: Narrative Voice + Items (May 9 - May 23, 2 weeks)

**Deliverables:**
1. **Rewrite all 5 region descriptions + 18 expedition descriptions** -- kill functional copy, establish the quiet-warm-authority voice
2. **Rename prestige system** -- "The Reforging," currency = "Forge Marks," rewrite rebirth confirmation text
3. **In-voice microcopy pass** on the 10 highest-frequency surfaces: empty crafting slot ("The anvil waits"), empty inventory, notifications, button labels (Craft -> contextual, Collect -> "Take from the anvil")
4. **27 item + resource sprites at 16x16** -- hand-drawn in Aseprite, 3-4 colors each, forge-touched accent on crafted items
5. **Narrative event text for 10 milestones** -- first craft, first expedition, first boss, first death, prestige eligibility, first rebirth, etc. Wire as modal overlays.

**Agents/Skills:** game-narrative-review for voice consistency check after rewrites. Dev agent for microcopy integration.

### Sprint 1C: Enemies + Polish (May 23 - Jun 8, 2 weeks)

**Deliverables:**
1. **22 enemy sprites at 32x32** with idle animation (2-4 frames) -- cold palette, no ember orange, boss enemies get golden glowing eyes
2. **Button juice** -- press-down/bounce animation on Craft, Collect, Send, Level Up buttons
3. **Craft completion sparkle/glow animation**
4. **Gold coin fly animation on sell**
5. **Apply pixel art frames to remaining screens** -- World Map, Village, Season, all modals
6. **Hero flavor text** -- 2-3 sentence descriptions + personality tags in data/heroes.js
7. **Steam Coming Soon page live** -- current build screenshots with "art in progress" note, About copy from launch review, capsule art (Midjourney concept or commissioned), tags set

**Approval Gate:**
**Founder reviews:** The game with all pixel art sprites, new UI frames, and narrative voice. Full walkthrough of Hub -> Forge -> Barracks -> World Map -> back. This is the "does this look and feel like a Steam game?" gate.

### Risk Flags
- 22 enemy sprites in 2 weeks at 32x32 is aggressive. If pipeline stalls, deprioritize enemy animations (static sprites are acceptable for v1) and ship Phase 2 on time. Enemies can get animation polish later.
- Coming Soon page requires Steamworks review (5-7 business days). Submit by May 25 to be live by Jun 1.

---

## Phase 2: Exploration MVP (Jun 8 - Jul 20, 6 weeks)
**Theme: The "Field" half of "Forge & Field" comes alive.**

### Sprint 2A: Exploration Skeleton (Jun 8 - Jun 22, 2 weeks)

**Deliverables:**
1. **Node-based exploration map component** for Greenwood Forest -- 8-10 nodes connected by paths. Node types: combat, resource, rest, POI, boss. Player taps connected node to move.
2. **Exploration state slice** -- `state.exploration = { active, regionId, heroId, currentNode, visitedNodes, lootBag, nodeMap }`
3. **Endurance drain system** -- each node costs 5-10 endurance. Hero with 0 endurance must retreat. Push-your-luck tension.
4. **Loot bag mechanic** -- resources/items go to temporary bag during exploration. Deposit on safe return, lose on defeat.
5. **Hero status: "exploring"** -- parallels "expedition" and "resting." Hero can't be sent on idle expeditions while exploring.
6. **Dual economy lanes defined** -- passive generators = baseline, idle expeditions = targeted farming, active exploration = high-risk/high-reward with unique drops.

**Agents/Skills:** game-mechanics-review for exploration loop validation after prototype is playable.

### Sprint 2B: Player Combat + Consumables (Jun 22 - Jul 6, 2 weeks)

**Deliverables:**
1. **Interactive combat mode** -- pause before each hero turn, present choices: Attack (auto-target), Skill (if available), Item (consumable), Flee. Feed choice into existing `resolveCombat` engine. This is Option A from mechanics review -- player intervention on existing auto-combat.
2. **Exploration difficulty curve** -- enemies deal 2-3x damage in exploration mode vs idle expeditions. Enemy DEF matters. Fleeing costs endurance.
3. **3 exploration consumable recipes** -- Health Tonic (restore 30% HP), Stamina Draught (restore 20 endurance), Escape Scroll (instant flee, keep loot). Added to data/recipes.js and craftable at forge.
4. **Exploration-only resource drops** -- rare crafting components from exploration that unlock special recipes unavailable through idle play. Makes the forge essential for exploration preparation.
5. **Node map for Stormridge** -- second region with 10-12 nodes, harder enemies, branching paths.

### Sprint 2C: Full Exploration Loop + Environment Art (Jul 6 - Jul 20, 2 weeks)

**Deliverables:**
1. **Node maps for Dusthaven, Frostpeak, Dragon's Reach** -- complete all 5 regions
2. **Boss encounters in exploration** -- the Treant Elder, Stone Colossus, Bandit King, Frost Wyrm, Elder Dragon as interactive multi-turn fights
3. **Environment tile concepts** -- 16x16 tiles for at least Greenwood (ground, trees, paths, decorative). Other regions can use palette-swapped variants for demo.
4. **Region temperature gradient** -- warm near forge (Greenwood = gold-green), cold far from forge (Frostpeak = ice blue, Dragon's Reach = volcanic red). Visual storytelling through palette.
5. **Exploration tutorial** -- at level 6 or 7, "Explore" appears as alternative to "Send Expedition" with a 3-step contextual tutorial
6. **Expedition streak bonus** -- 3 expeditions to same region = +25% resources, +10% item drop chance. Return-session hook.

**Approval Gate:**
**Founder plays through:** Full exploration run in Greenwood. Craft consumables at forge, enter exploration, traverse nodes, fight with player choices, find loot, decide push-or-retreat, return to forge. If the 30-second loop (walk -> encounter -> fight/flee -> loot -> decide) feels right, Phase 3 proceeds.

### Risk Flags
- Exploration is the largest new feature. If Sprint 2A skeleton takes longer than 2 weeks, cut Sprint 2C environment tiles (use colored placeholder nodes) and cut Dragon's Reach exploration (keep as idle-only for demo). Greenwood + Stormridge exploration is enough for demo.
- Interactive combat is a UI challenge. If the combat intervention UX is clunky, fall back to auto-combat with a "use item" and "flee" button overlay only (reduced player agency, but ships faster).

---

## Phase 3: Demo & Steam Prep (Jul 20 - Sep 1, 6 weeks)
**Theme: Everything a stranger needs to understand and want this game.**

### Sprint 3A: Demo Build (Jul 20 - Aug 3, 2 weeks)

**Deliverables:**
1. **Demo scope enforced** -- Greenwood only, Warrior + Ranger only, T1 recipes only, level cap 6, Forge + Barracks + World Map. Lock Village, Season, Prestige, T2/T3, Mage, Paladin.
2. **Demo end state** -- player defeats Treant Elder in exploration, sees "The way forward opens... continue in the full game" message
3. **Save carry-over system** -- demo save transfers to full game seamlessly
4. **25-40 minute target completion time** validated by 3+ test sessions
5. **Desktop frame** -- decorative border around 430px viewport for Steam (forge workshop illustration, ambient particles). Prevents "phone emulator on 1080p monitor" appearance.

### Sprint 3B: Marketing Assets (Aug 3 - Aug 17, 2 weeks)

**Deliverables:**
1. **Capsule art finalized** -- header (616x353), small (231x87), hero (374x448), library (600x900). Professional quality. Commission if AI does not hit the bar.
2. **10 screenshots at 1920x1080** -- captured from pixel art build with desktop frame
3. **45-60 second trailer** -- forge ember hook (0-3s), crafting (3-7s), equipping (7-12s), exploration (12-28s), bosses (28-38s), prestige (38-43s), climax + title card (43-55s), CTA (55-60s)
4. **Press kit** on presskit.gg -- screenshots, capsules, logo, description, developer bio, trailer embed
5. **Discord server launched** -- 6 channels, invite link on Steam page

### Sprint 3C: Polish & Submission (Aug 17 - Sep 1, 2 weeks)

**Deliverables:**
1. **Bug sweep** -- play through entire demo 5+ times, fix all crashes, softlocks, save corruption
2. **Accessibility pass** -- aria-labels on icon buttons, focus-visible styles, prefers-reduced-motion media query
3. **Inventory grid view** -- toggleable grid/list for item management (4-column compact grid)
4. **Equipment slot visual redesign** -- bordered squares with item icons, empty slot silhouettes
5. **Wandering Merchant event** -- appears every 30-45 min, limited-time offer, creates active play incentive
6. **Steam Coming Soon page updated** with final capsule, screenshots, trailer, About copy
7. **Demo build submitted to Valve** for Next Fest press preview (deadline: Sep 21)

**Approval Gate:**
**Founder plays the demo cold** -- as if seeing it for the first time. 25-40 minutes. Does it hook? Does it end with "I want more"? Does it look like a $14.99 game? Ship/no-ship decision.

---

## Phase 4: Next Fest & Launch Prep (Sep 1 - Q1 2027)
**Theme: Accumulate wishlists, ship the full game.**

### Sep 1 - Oct 19: Pre-Fest

- Demo testing by 5-10 external playtesters
- Press/creator key distribution (50 keys, 2 weeks before Fest)
- First devlog on Steam: pixel art transformation, exploration mode, "here's what's coming"
- Reddit posts: r/incremental_games, r/indiegames, r/PixelArt (one per sub)
- TikTok clips: 3-5 short-form videos showing satisfying moments

### Oct 19-26: Next Fest

- Demo live, monitored daily
- Respond to every Steam discussion post within 2 hours
- Post daily devlog on Discord
- Capture feedback for post-Fest patch
- Track wishlist growth daily

### Oct 27 - Q1 2027: Full Game Completion

- **Remaining exploration regions** polish (Dusthaven, Frostpeak, Dragon's Reach with full environment art)
- **Remaining pixel art** -- any deferred enemy animations, environment tiles for all 5 regions
- **Engagement systems** -- login streak (gentle, no punishment), expedition streaks, additional prestige bonuses
- **Electron/Tauri wrapper** for Steam distribution (PWA in browser tab at $14.99 will get review backlash)
- **Final balance pass** -- combat difficulty tuning with exploration data from Next Fest feedback
- **Launch day prep** -- press keys sent 2 weeks prior, 10% launch discount, Tuesday 10AM PST launch

---

## Cut List (Explicitly Deferred to Post-Launch)

| Feature | Why Deferred | When to Revisit |
|---------|-------------|-----------------|
| Multi-hero party exploration | Massive scope increase. Single-hero exploration is the MVP. | Post-launch update 1 |
| Free-roam 2D movement | Node-based maps are cheaper to build and still feel like exploration. | v2 if wishlists indicate demand |
| Real-time combat | Turn-based with player intervention is the sweet spot. Real-time is a different game. | Never (genre mismatch) |
| Procedural node maps | Hand-authored maps for v1. Procedural is a v2 feature after loop is validated. | Post-launch update 2 |
| New enemy types for exploration | Use existing enemy roster. 22 enemies is enough for launch. | Post-launch content updates |
| Weather/time-of-day systems | Atmosphere, not gameplay. Season system provides temporal variety. | Post-launch polish |
| Full 32x32 environment tiles for all regions | Greenwood gets full tiles. Others get palette-swapped variants or simplified tilesets. | Post-launch art updates |
| Mobile app store release | Steam first. Mobile is a different distribution problem. | 3 months post-launch if Steam succeeds |
| T4 crafting tier | Reserved for prestige tier 2+. Designed but not built. | Post-launch update 1 |
| Multiplayer/leaderboards | Zero scope for this in v1. | Post-launch if community demands it |

---

## Dependencies & Blockers Requiring Founder Input

| Item | What I Need | When I Need It |
|------|-------------|----------------|
| Aldric pixel art direction | Approve the 32x32 proof-of-concept. Does this look and feel right? | End of Phase 0 (Apr 25) |
| Capsule art approach | AI-generated (free, may not hit bar) vs. commissioned ($200-500)? | Phase 1C (late May) |
| Narrative voice approval | Read the rewritten region descriptions. Is this the voice of the game? | Sprint 1B (mid-May) |
| Exploration loop feel | Play the Greenwood exploration prototype. Does the 30-second loop work? | End of Phase 2 (Jul 20) |
| Demo ship/no-ship | Cold playthrough of the demo build. Would you wishlist this? | End of Phase 3 (Sep 1) |
| Launch timing | Q1 2027 window (Jan-Mar). Specific date TBD based on Fest results. | Nov 2026 |

---

## Reviewer Synthesis: Where the Experts Agree and Disagree

### Universal Agreement (All 6 reviews align)
- The mechanical foundation is strong. Crafting-equip-explore pipeline is well-architected.
- The visual presentation is the weakest element. "SaaS dashboard" appearance is fatal for Steam.
- Pixel art is the correct art direction for this genre and platform.
- The forge is the emotional center. Everything should radiate from it.
- Combat is too easy and needs difficulty scaling for active play.
- The prestige loop needs to feel more transformative on first rebirth.

### Contradictions Resolved
- **Art review says 9-13 weeks for art alone. Launch review says Coming Soon page in 30 days.** Resolution: Coming Soon page uses current SVG screenshots with "art in progress" note. Art pipeline runs in parallel. No blocking dependency.
- **Mechanics review recommends exploration at Level 5. Engagement review says Level 5-7 is already the most dangerous plateau.** Resolution: Unlock exploration at Level 7, after player has done several idle expeditions and understands the system. This also means exploration is in the demo (level cap 6 in demo means they SEE the unlock coming but don't reach it -- the hook).
- **Narrative review wants atmospheric button labels ("Take from the anvil"). UI review wants more game juice on buttons.** Resolution: Both. Atmospheric labels AND press-down/bounce animations. The label IS the juice for text; the animation IS the juice for feel. They complement, not compete.
- **Engagement review wants more simultaneous progress tracks. Mechanics review recommends single-hero exploration for scope.** Resolution: Single-hero exploration + other heroes on idle expeditions simultaneously. The player has active play (exploration) and passive play (expeditions + crafting) running at the same time. This IS the dual-track engagement without building party exploration.

### Sequencing Rationale
I sequenced by three principles:
1. **What unblocks the most?** Steamworks registration and Sprite component dual-mode unblock everything. They go first.
2. **What has the highest visual impact per hour?** Hero sprites + 9-slice UI frames transform the game's perceived quality by 80% (art review's estimate). They go before enemies, items, and environment tiles.
3. **What de-risks October Next Fest?** The demo must be feature-complete by Sep 1. Exploration MVP must be done by mid-July to allow 6 weeks of demo polish. Working backwards: exploration development starts Jun 8, which means pixel art must be mostly done by then.

---

## Resource Budget

| Phase | Duration | Dev Hours (est.) | Art Hours (est.) | Total |
|-------|----------|-----------------|-----------------|-------|
| Phase 0: Foundation | 2 weeks | 30h | 10h | 40h |
| Phase 1: Visual Transformation | 6 weeks | 60h | 80h | 140h |
| Phase 2: Exploration MVP | 6 weeks | 120h | 30h | 150h |
| Phase 3: Demo & Steam Prep | 6 weeks | 80h | 20h | 100h |
| Phase 4: Next Fest & Launch | 12-20 weeks | 120h | 40h | 160h |
| **Total** | **~32-40 weeks** | **~410h** | **~180h** | **~590h** |

At 4-5 hours/day (realistic for a solo dev with other projects), this is 120-150 working days, or ~6-7 months. Aligns with the Q1 2027 launch target.

---

## Revenue Outlook

From the launch strategy review's target scenario:
- Month 1 (launch): ~$28K net
- Months 2-3: ~$12K net
- Months 4-6: ~$8.5K net ($2,835/mo)
- Months 7-12: ~$11K net ($1,890/mo)
- **Year 1 total: ~$94K net**

The $500-1,000/month revenue goal from revenue.json is achievable by Month 4-6 in the target scenario and sustainable into Year 2 with sale events and content updates.

---

## Immediate Next Actions (This Week, Apr 10-17)

1. **Register Steamworks + pay $100 app fee** (20 min, founder action)
2. **Implement Crit Craft mechanic** in lib/crafting.js (0.5 day, dev agent)
3. **Overhaul Welcome Back modal** to show expeditions, chests, daily quests, actionable prompt (0.5 day, dev agent)
4. **Rebalance prestige costs** -- Veteran's Start to 5 stars, add Forgemaster's Memory (0.25 day, dev agent)
5. **Generate AI moodboard** -- 10 Midjourney/DALL-E concepts for the pixel art direction (2-3 hours, dev)
6. **Draw Aldric at 32x32** with 4-frame idle animation in Aseprite (4-6 hours, dev)
7. **Write demo scope document** (1 hour, Marcus drafts, founder approves)

---

**This plan is ready for founder approval. I recommend approving the full plan with the understanding that Phase 2 scope may flex based on the Aldric pixel art proof-of-concept and the exploration prototype feel test. I will not proceed with execution until you say "go."**
