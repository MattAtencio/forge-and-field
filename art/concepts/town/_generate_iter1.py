"""Generate DALL-E 3 variants for Town Iter 1: background cluster + Barracks + Gate.

Prompts: VERBATIM from art/concepts/town/DIRECTION.md sections 3, 2.2, 2.3.
Quality: standard.
Outputs:
  art/concepts/town/background/bg-cluster-v{1..3}.png  (1792x1024, closest allowed to 1536x512)
  art/concepts/town/barracks/barracks-v{1..4}.png      (1024x1024, closest allowed to 1024x768)
  art/concepts/town/gate/gate-v{1..4}.png              (1024x1024)

Spend (standard quality):
  3 x $0.08 (1792x1024)  = $0.24
  4 x $0.04 (1024x1024)  = $0.16
  4 x $0.04 (1024x1024)  = $0.16
  ---------------------------------
  Total                  = $0.56

Note: the 1792x1024 bg size is slightly above the user's $0.44 estimate
(which assumed all 1024x1024). 1792x1024 is the closest allowed wide format
to the DIRECTION's requested 1536x512 horizontal strip.
"""
import os
import sys
import concurrent.futures

sys.path.insert(0, os.path.expanduser("~/.claude/lib"))
from pixellab.dalle import generate_concept

# ---------------------------------------------------------------------------
# Prompt 1: Background silhouette cluster  (DIRECTION.md section 3)
# ---------------------------------------------------------------------------
BG_PROMPT = (
    "Pixel art concept reference, 1536x512 native resolution (wide horizontal "
    "strip), of a medieval town rooftop silhouette cluster \u2014 3 to 5 "
    "buildings seen from shallow three-quarter orthographic angle, rendered as "
    "near-silhouettes against a late dusk sky. Each building shows ONLY its "
    "roofline and upper wall \u2014 no doors, no windows lit, no ground, no "
    "props. Rooflines must all differ: one steeply peaked, one shallow-pitch "
    "with a chimney offset left, one with a dormer, one flat-topped with a low "
    "parapet, one with a cross-gable. All roofs in dark slate/steel-dark "
    "(#64748b, #1a1824); upper walls hinted in leather-brown (#92400e) and "
    "steel-mid (#94a3b8) at low contrast \u2014 these are background elements, "
    "not focal. Behind: deep violet dusk sky (#2a2438) with a subtle warmer "
    "horizon band near the bottom (desaturated amber suggestion, NOT saturated, "
    "NOT emissive). No smoke, no banners, no warm interior light leaking from "
    "any window, no forge glow (the forge sits in the foreground layer, not "
    "here). Style reference: Darkest Dungeon's hamlet backdrop and Eastward's "
    "distant-town silhouettes. Flat shading, crisp hard pixel edges, no "
    "anti-aliasing, no gradients. Output as a horizontal silhouette strip on "
    "clean neutral charcoal (#1a1824) background, sized to composite behind the "
    "foreground scene at ~0.7 opacity. "
    "Negative prompt: No foreground buildings (this strip is background-only), "
    "no ground plane, no props, no NPCs, no warm window lights, no ember glow, "
    "no smoke trails, no banners or flags, no sharp detail on any building "
    "(silhouette first), no varying opacity within the strip itself (even "
    "charcoal), no sky clouds, no moon, no stars, no modern elements, no "
    "45\u00b0 isometric, no painterly."
)

# ---------------------------------------------------------------------------
# Prompt 2: Barracks  (DIRECTION.md section 2.2)
# ---------------------------------------------------------------------------
BARRACKS_PROMPT = (
    "Pixel art concept reference, 1024x768 native resolution, of a medieval "
    "barracks/guild hall building rendered in shallow three-quarter "
    "orthographic perspective \u2014 front wall and right side wall both "
    "visible. The building is a long low rectangle with a shallow pitched roof "
    "in dark slate, built from horizontal wooden timber beams in warm "
    "leather-brown (#92400e) over a half-stone foundation in steel-grey "
    "(#94a3b8, #64748b). Two small windows along the front wall with dark "
    "interiors (no candlelight \u2014 barracks is unlit at dusk). A single "
    "heavy reinforced wooden door, closed. Three triangular pennants/banners "
    "fly from the roof peak in muted parchment (#e8e0d4) with a faded gold "
    "(#fbbf24) emblem. A wooden weapon rack leans against the front wall to "
    "the right of the door, holding the silhouettes of two spears and one "
    "training sword (no ember glow \u2014 these are training arms, not "
    "crafted). Surrounded by cool dusk ambient light, deep violet sky "
    "(#2a2438) behind. No warm light from the building itself. Flat shading, "
    "crisp hard pixel edges, no anti-aliasing, no gradients. Style reference: "
    "Darkest Dungeon's Guild building and Moonlighter's town exteriors. "
    "Isolate building on clean neutral charcoal (#1a1824) background, ~10% "
    "margin. "
    "Negative prompt: No characters, no NPCs, no guards standing outside, no "
    "interior view, no open door, no light coming from windows, no modern "
    "elements, no 45\u00b0 isometric, no 90\u00b0 top-down, no side-scroller "
    "flat 2D, no ember-orange or warm glow on the building itself (the forge "
    "is the ONLY warm emissive in the town \u2014 barracks reads cool), no "
    "saturated banner colors (parchment + faded gold only), no blood splatter, "
    "no grimdark gore, no dithering over 20% coverage, no painterly brush."
)

# ---------------------------------------------------------------------------
# Prompt 3: Gate  (DIRECTION.md section 2.3)
# ---------------------------------------------------------------------------
GATE_PROMPT = (
    "Pixel art concept reference, 1024x1024 native resolution, of a standalone "
    "stone archway gate at the edge of a medieval town, rendered in shallow "
    "three-quarter orthographic perspective \u2014 front face and slight left "
    "interior face visible. The arch is built from large irregular cobbles in "
    "steel-grey and dark steel (#94a3b8, #64748b) with warm leather-brown "
    "(#92400e) wooden lintel beams at the top. Critical: the center of the "
    "arch is open negative space \u2014 the deep violet dusk sky (#2a2438) is "
    "visible through the opening, with a faint suggestion of distant rolling "
    "hills in a darker violet silhouette on the horizon line. Two iron-bound "
    "torch brackets flank the arch but are unlit (no warm glow \u2014 the "
    "forge remains the only emissive light in the town). A simple cobble path "
    "of Loam (#6b5d3e) leads into the arch. Cool dusk ambient everywhere, "
    "low-angle shadow falling to the right. Flat shading, crisp hard pixel "
    "edges, no anti-aliasing, no gradients. Style reference: Hollow Knight's "
    "stone arch entrances and Moonlighter's town gate. Isolate on clean "
    "neutral charcoal (#1a1824) background, ~10% margin, arch centered. "
    "Negative prompt: No characters, no NPCs, no gate guard, no portcullis or "
    "fence panel blocking the opening (the opening must be readable as a "
    "portal \u2014 negative space is load-bearing), no torches lit, no "
    "magical portal glow, no swirling arcane energy, no blue/purple/green "
    "emissive, no ember orange on this building, no banners, no signage, no "
    "modern elements, no 45\u00b0 isometric, no 90\u00b0 top-down, no "
    "painterly."
)

OUT_ROOT = r"C:/dev/forge-and-field/art/concepts/town"

JOBS = []
# Background: 3 variants @ 1792x1024 (closest allowed wide format)
for i in range(1, 4):
    JOBS.append({
        "name": f"bg-cluster-v{i}",
        "prompt": BG_PROMPT,
        "path": f"{OUT_ROOT}/background/bg-cluster-v{i}.png",
        "size": "1792x1024",
    })
# Barracks: 4 variants @ 1024x1024 (closest allowed square)
for i in range(1, 5):
    JOBS.append({
        "name": f"barracks-v{i}",
        "prompt": BARRACKS_PROMPT,
        "path": f"{OUT_ROOT}/barracks/barracks-v{i}.png",
        "size": "1024x1024",
    })
# Gate: 4 variants @ 1024x1024
for i in range(1, 5):
    JOBS.append({
        "name": f"gate-v{i}",
        "prompt": GATE_PROMPT,
        "path": f"{OUT_ROOT}/gate/gate-v{i}.png",
        "size": "1024x1024",
    })


def run(job):
    result = generate_concept(
        prompt=job["prompt"],
        output_path=job["path"],
        size=job["size"],
        quality="standard",
        skip_existing=True,
    )
    return job["name"], result


if __name__ == "__main__":
    print(f"Generating {len(JOBS)} Town Iter 1 variants (standard quality)")
    for j in JOBS:
        print(f"  - {j['name']} @ {j['size']} -> {j['path']}")
    print()

    results = {}
    # Parallel generation — cap at 6 concurrent to be polite to OpenAI.
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futures = [ex.submit(run, j) for j in JOBS]
        for fut in concurrent.futures.as_completed(futures):
            name, result = fut.result()
            results[name] = result

    print("\n=== Summary ===")
    for j in JOBS:
        name = j["name"]
        status = "OK  " if results.get(name) else "FAIL"
        print(f"  {status} {name}")

    n_ok = sum(1 for r in results.values() if r)
    print(f"\n{n_ok}/{len(JOBS)} variants generated successfully.")
    sys.exit(0 if n_ok == len(JOBS) else 1)
