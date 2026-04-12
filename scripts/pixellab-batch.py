"""
Batch generate sprites via PixelLab API.
Submits all jobs, then polls for completion, then decodes PNGs.
Uses ~11 credits (19 remaining after Aldric test).
"""
import os, sys, json, time, base64, subprocess, urllib.request, urllib.error
import numpy as np
from PIL import Image

# Read API key
result = subprocess.run(
    ["powershell", "-Command",
     "[System.Environment]::GetEnvironmentVariable('PIXELLAB_API_KEY', 'User')"],
    capture_output=True, text=True
)
API_KEY = result.stdout.strip()
if not API_KEY:
    print("ERROR: PIXELLAB_API_KEY not set")
    sys.exit(1)

BASE_URL = "https://api.pixellab.ai/v2"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "sprites", "pixellab")
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

# All sprites to generate (Aldric already done)
SPRITES = [
    # Heroes (3 remaining)
    {
        "name": "lyra",
        "description": (
            "Medieval fantasy ranger, slim agile build, hooded green cloak over leather armor, "
            "longbow slung on back, quiver of arrows with glowing orange tips, "
            "narrow triangle silhouette, alert hunting stance, pixel art RPG character"
        ),
    },
    {
        "name": "theron",
        "description": (
            "Medieval fantasy mage, flowing purple robes flaring wide at bottom creating "
            "inverted triangle silhouette, tall wooden staff with glowing orange crystal on top, "
            "elderly wise face with short white beard, gold trim on robes, pixel art RPG character"
        ),
    },
    {
        "name": "sera",
        "description": (
            "Medieval fantasy paladin, heavy gold and steel armor, large ornate shield with "
            "glowing orange cross emblem at center, short sword in other hand, "
            "noble protective stance, wide cross-shaped silhouette from shield, pixel art RPG character"
        ),
    },
    # Greenwood enemies (4)
    {
        "name": "goblin",
        "description": (
            "Small green goblin creature, oversized head, beady red eyes, crude rusty dagger, "
            "scrappy leather scraps, pointed ears, hunched cowardly posture, "
            "fantasy RPG enemy, menacing but small, pixel art"
        ),
    },
    {
        "name": "dire-wolf",
        "description": (
            "Large aggressive grey dire wolf, bristling dark fur, bared fangs, red eyes, "
            "muscular low hunting stance, scars on muzzle, wild forest predator, "
            "fantasy RPG enemy, pixel art"
        ),
    },
    {
        "name": "forest-spider",
        "description": (
            "Large dark green-black venomous forest spider, eight spindly legs spread wide, "
            "multiple glowing red eyes, red markings on abdomen, silk web trailing, "
            "fantasy RPG enemy creature, pixel art"
        ),
    },
    {
        "name": "treant-elder",
        "description": (
            "Ancient massive tree creature boss, gnarled bark body, branch arms reaching out, "
            "thick root legs, glowing golden eyes in knothole sockets, hanging moss and vines, "
            "towering ancient forest guardian, fantasy RPG boss enemy, pixel art"
        ),
    },
    # Stormridge enemies (4)
    {
        "name": "mountain-goat",
        "description": (
            "Aggressive mountain ram, massive curled horns, thick grey fur, red angry eyes, "
            "stocky muscular build, charging stance head lowered, hooves on rocky ground, "
            "mountain beast, fantasy RPG enemy, pixel art"
        ),
    },
    {
        "name": "rock-golem",
        "description": (
            "Humanoid creature made of stacked boulders and stone slabs, purple arcane energy "
            "glowing in cracks between stones, massive stone fists, dark gap for face with "
            "red eyes peering out, chunky heavy silhouette, fantasy RPG enemy, pixel art"
        ),
    },
    {
        "name": "harpy",
        "description": (
            "Half-woman half-bird creature, large dark wings spread wide, taloned feet, "
            "wild feathered hair, shrieking expression, dark blue-grey feathers, "
            "airborne menacing pose, fantasy RPG enemy, pixel art"
        ),
    },
    {
        "name": "stone-colossus",
        "description": (
            "Enormous animated ancient stone statue boss, cracked weathered surface with "
            "glowing arcane runes, golden glowing eyes in carved stone face, "
            "massive hammer-fist raised, towering imposing silhouette, "
            "fantasy RPG boss enemy, pixel art"
        ),
    },
]


def submit_job(sprite):
    """Submit a PixelLab generation job."""
    payload = {
        "description": sprite["description"],
        "image_size": {"width": 32, "height": 32},
        "outline": "thin",
        "shading": "hard",
        "detail": "high",
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/create-character-with-4-directions",
        data=data, headers=HEADERS, method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result.get("background_job_id")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else str(e)
        print(f"    FAIL: {e.code} -- {body[:200]}")
        return None


def check_job(job_id):
    """Check job status."""
    req = urllib.request.Request(
        f"{BASE_URL}/background-jobs/{job_id}",
        headers=HEADERS, method="GET"
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def decode_and_save(job_result, name):
    """Decode RGBA bytes from PixelLab response and save as PNG."""
    last = job_result.get("last_response", {})
    saved = []

    for version in ("images", "quantized_images"):
        images = last.get(version, {})
        suffix = "" if version == "images" else "-q"

        for direction, img_data in images.items():
            w = img_data["width"]
            h = img_data["height"]
            raw = base64.b64decode(img_data["base64"])
            arr = np.frombuffer(raw, dtype=np.uint8).reshape((h, w, 4))
            img = Image.fromarray(arr, "RGBA")

            path = os.path.join(OUTPUT_DIR, f"{name}-{direction}{suffix}.png")
            img.save(path)
            saved.append(path)

    return saved


def main():
    print("Forge & Field -- PixelLab Batch Generation")
    print(f"Generating {len(SPRITES)} sprites ({len(SPRITES)} credits)")
    print("=" * 50)

    # Phase 1: Submit all jobs
    print("\n--- Submitting jobs ---")
    jobs = {}
    for sprite in SPRITES:
        name = sprite["name"]

        # Check if already generated
        south_path = os.path.join(OUTPUT_DIR, f"{name}-south.png")
        if os.path.exists(south_path):
            print(f"  SKIP {name} (already exists)")
            continue

        print(f"  Submitting {name}...")
        job_id = submit_job(sprite)
        if job_id:
            jobs[name] = job_id
            print(f"    Job: {job_id[:12]}...")
        else:
            print(f"    FAILED to submit")

        # Small delay between submissions to avoid rate limiting
        time.sleep(1)

    if not jobs:
        print("\nAll sprites already generated!")
        return

    # Phase 2: Poll all jobs
    print(f"\n--- Polling {len(jobs)} jobs ---")
    completed = {}
    failed = []
    max_polls = 40  # ~7 minutes max

    for poll in range(max_polls):
        pending = {n: j for n, j in jobs.items() if n not in completed and n not in failed}
        if not pending:
            break

        time.sleep(10)
        print(f"  Poll {poll+1}: {len(pending)} pending...")

        for name, job_id in list(pending.items()):
            try:
                result = check_job(job_id)
                status = result.get("status", "unknown")

                if status == "completed":
                    completed[name] = result
                    cost = result.get("usage", {}).get("usd", "?")
                    print(f"    {name}: DONE (${cost})")
                elif status in ("failed", "error"):
                    failed.append(name)
                    print(f"    {name}: FAILED")
            except Exception as e:
                pass  # Will retry next poll

    # Phase 3: Decode and save
    print(f"\n--- Decoding {len(completed)} sprites ---")
    total_cost = 0

    for name, result in completed.items():
        paths = decode_and_save(result, name)
        cost = result.get("usage", {}).get("usd", 0) or 0
        total_cost += cost
        print(f"  {name}: {len(paths)} images saved")

    # Summary
    print("\n" + "=" * 50)
    print(f"Completed: {len(completed)}/{len(SPRITES)}")
    print(f"Failed: {len(failed)}")
    print(f"Skipped: {len(SPRITES) - len(jobs) - len(completed)}")
    print(f"Total cost: ${total_cost:.4f}")
    print(f"\nOutput: {OUTPUT_DIR}")

    # List all files
    files = sorted(os.listdir(OUTPUT_DIR))
    png_files = [f for f in files if f.endswith(".png")]
    print(f"Total PNGs: {len(png_files)}")


if __name__ == "__main__":
    main()
