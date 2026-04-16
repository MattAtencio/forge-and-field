"""Generate 4 DALL-E 3 variants of the FORGE building.

Prompt: VERBATIM from art/concepts/town/DIRECTION.md section 2.1.
Quality: standard (4 x ~$0.04 = ~$0.16 to respect ~$5 budget).
Output: art/concepts/town/forge/forge-v{1..4}.png
"""
import os
import sys
import concurrent.futures

sys.path.insert(0, os.path.expanduser("~/.claude/lib"))
from pixellab.dalle import generate_concept

FORGE_PROMPT = (
    "Pixel art concept reference, 1024x1024 native resolution, of a medieval fantasy "
    "blacksmith's forge building rendered in a shallow three-quarter orthographic "
    "perspective \u2014 front wall and left side wall both visible, slight top-down "
    "tilt showing the roof. The building has a squat asymmetric stone base built from "
    "irregular cobbles in warm leather-brown (#92400e) and dark steel-grey (#64748b), "
    "a single wide rectangular doorway with no door attached, and a tall mismatched "
    "brick chimney rising off-center from the roofline with rising smoke implied by "
    "silhouette. A warm ember-orange glow (#f97316, #fb923c) spills from the doorway "
    "as the only light source, casting a low dusk-lit cast onto the cobble apron in "
    "front. Roof is dark slate with wooden structural ribs in leather-brown. Late dusk "
    "atmosphere, deep violet sky tone (#2a2438) behind the building, cool ambient "
    "everywhere except the door glow. Limited palette \u2014 approximately 14 colors, "
    "warm forge palette against cool dusk. Flat shading, crisp hard pixel edges, no "
    "anti-aliasing, no gradients, no blur. Style reference: Moonlighter's shop "
    "exterior and Graveyard Keeper's village buildings. Concept reference for a pixel "
    "artist to redraw in Aseprite \u2014 isolate building on a clean neutral charcoal "
    "(#1a1824) background, no ground tiles drawn past the immediate cobble apron, "
    "building centered with ~10% margin. "
    "Negative prompt: No characters, no NPCs, no smoke particles rendered "
    "(silhouette-only smoke), no interior view, no open door, no sign hung outside, "
    "no modern elements (no screws, no corrugated metal, no industrial pipes), no "
    "45\u00b0 isometric angle, no 90\u00b0 top-down angle, no side-scroller flat 2D, "
    "no cute chibi proportions, no Disney rounding, no blue/green/purple magical "
    "glow \u2014 warm ember orange is the ONLY emissive, no rim lighting on other "
    "surfaces, no lens flare, no painterly brush strokes, no watercolor texture."
)

OUT_DIR = r"C:/dev/forge-and-field/art/concepts/town/forge"


def gen_variant(i: int):
    path = f"{OUT_DIR}/forge-v{i}.png"
    result = generate_concept(
        prompt=FORGE_PROMPT,
        output_path=path,
        size="1024x1024",
        quality="standard",
        skip_existing=True,
    )
    return i, result


if __name__ == "__main__":
    print(f"Generating 4 FORGE variants (standard quality) -> {OUT_DIR}")
    results = {}
    # Parallel generation — 4 concurrent DALL-E calls
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        futures = [ex.submit(gen_variant, i) for i in range(1, 5)]
        for fut in concurrent.futures.as_completed(futures):
            i, result = fut.result()
            results[i] = result

    print("\n=== Summary ===")
    for i in sorted(results):
        status = "OK" if results[i] else "FAIL"
        print(f"  v{i}: {status} -> {results.get(i)}")

    n_ok = sum(1 for r in results.values() if r)
    print(f"\n{n_ok}/4 variants generated successfully.")
    sys.exit(0 if n_ok == 4 else 1)
