"""Generate DALL-E 3 variants for Town Iter 1: MARKET stall.

Prompt: VERBATIM from art/concepts/town/DIRECTION.md section 2.4.
Quality: standard.
Outputs:
  art/concepts/town/market/market-v{1..4}.png  (1024x1024)
  art/concepts/town/market/market-v{1..4}_prompt.txt  (original + revised prompt)

Spend (standard quality):
  4 x $0.04 (1024x1024)  = $0.16

Calibration notes (from DIRECTION section 5 + user brief):
- Forge v3, Barracks v1, Gate v4 landed because they held shallow 3/4
  orthographic (not iso) and kept warm emissive contained to the Forge only.
- Market must be COOL-toned. Muted red stripe on the awning is the ONLY
  chromatic pop, and it is pigment (fabric), NOT emissive.
- No lanterns lit. No interior glow. No merchant. Empty counter.
- Expect iso drift and warm-spill regressions — reject on sight.
"""
import os
import sys
import concurrent.futures

sys.path.insert(0, os.path.expanduser("~/.claude/lib"))
from pixellab.dalle import generate_concept

# ---------------------------------------------------------------------------
# Prompt: Market stall  (DIRECTION.md section 2.4) — VERBATIM
# ---------------------------------------------------------------------------
MARKET_PROMPT = (
    "Pixel art concept reference, 1024x1024 native resolution, of a medieval "
    "market stall rendered in shallow three-quarter orthographic perspective "
    "\u2014 front face and right-side face visible. The stall is a simple open "
    "timber frame in warm leather-brown (#92400e) supporting an angular peaked "
    "awning in parchment/off-white fabric (#e8e0d4) with two vertical stripes "
    "in muted danger red (#ef4444, desaturated). Stall counter is a rough "
    "wooden plank at waist height, empty (no merchant present). A wooden "
    "signboard hangs from one awning corner showing a simple painted goods "
    "icon (a loaf or coin silhouette) in gold (#fbbf24). Dusk ambient light, "
    "cool violet sky (#2a2438) behind. No warm light from the stall itself. "
    "The stripes are the chromatic pop in an otherwise muted town \u2014 this "
    "is the visual rhythm break against the stone and wood buildings. Flat "
    "shading, crisp hard pixel edges, no anti-aliasing, no gradients. Style "
    "reference: Stardew Valley's festival stalls and Moonlighter's market "
    "exteriors. Isolate on clean neutral charcoal (#1a1824) background, ~10% "
    "margin. "
    "Negative prompt: No merchant, no NPCs, no customers, no goods/produce/"
    "wares piled on the counter (counter is intentionally empty in Iter 1 "
    "\u2014 goods come in Iter 2 with narrative), no modern elements, no "
    "bright saturated reds (muted only), no rainbow striping, no multiple "
    "accent colors (exactly one stripe color), no ember-orange glow on the "
    "stall itself, no lanterns lit, no 45\u00b0 isometric, no 90\u00b0 "
    "top-down, no painterly brush, no watercolor."
)

OUT_ROOT = r"C:/dev/forge-and-field/art/concepts/town/market"

JOBS = []
for i in range(1, 5):
    JOBS.append({
        "name": f"market-v{i}",
        "prompt": MARKET_PROMPT,
        "path": f"{OUT_ROOT}/market-v{i}.png",
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
    print(f"Generating {len(JOBS)} Market Iter 1 variants (standard quality)")
    for j in JOBS:
        print(f"  - {j['name']} @ {j['size']} -> {j['path']}")
    print()

    results = {}
    # Parallel generation — cap at 4 concurrent (4 jobs, all fit).
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
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
