"""
Generate enemy sprites via PixelLab using pixflux (freeform, no template).
"""
import os, sys, json, time, base64, subprocess, urllib.request, urllib.error
import numpy as np
from PIL import Image

result = subprocess.run(
    ["powershell", "-Command",
     "[System.Environment]::GetEnvironmentVariable('PIXELLAB_API_KEY', 'User')"],
    capture_output=True, text=True
)
API_KEY = result.stdout.strip()

BASE_URL = "https://api.pixellab.ai/v2"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "sprites", "pixellab")
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

ENEMIES = [
    {
        "name": "goblin",
        "description": (
            "Small green goblin with rusty dagger, pointed ears, red eyes, "
            "leather scraps armor, hunched menacing stance, fantasy RPG enemy"
        ),
    },
    {
        "name": "dire-wolf",
        "description": (
            "Large aggressive grey wolf, bristling fur, bared fangs, red eyes, "
            "muscular hunting crouch, dark fur, forest predator"
        ),
        "template": "wolf",
    },
    {
        "name": "forest-spider",
        "description": (
            "Large dark venomous spider, eight legs spread wide, multiple red eyes, "
            "red markings on dark body, menacing forest creature"
        ),
    },
    {
        "name": "treant-elder",
        "description": (
            "Ancient massive tree creature, gnarled bark body, branch arms, "
            "golden glowing eyes, hanging moss, towering forest guardian boss"
        ),
    },
    {
        "name": "mountain-goat",
        "description": (
            "Aggressive mountain ram, massive curled horns, thick grey fur, "
            "stocky muscular build, charging stance, mountain beast"
        ),
        "template": "horse",
    },
    {
        "name": "rock-golem",
        "description": (
            "Humanoid made of stacked boulders, purple arcane energy in cracks, "
            "massive stone fists, red eyes in dark gap, heavy chunky build"
        ),
    },
    {
        "name": "harpy",
        "description": (
            "Half-woman half-bird, large dark wings spread, taloned feet, "
            "wild feathers, shrieking face, dark blue-grey, airborne menacing"
        ),
    },
    {
        "name": "stone-colossus",
        "description": (
            "Enormous ancient stone statue, cracked surface with glowing runes, "
            "golden eyes, massive hammer-fist raised, towering imposing boss"
        ),
    },
]


def generate_pixflux(sprite):
    """Use create-image-pixflux for freeform creature generation."""
    payload = {
        "description": sprite["description"] + ", pixel art style, 32x32 sprite",
        "image_size": {"width": 32, "height": 32},
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/create-image-pixflux",
        data=data, headers=HEADERS, method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else str(e)
        print(f"    pixflux error {e.code}: {body[:300]}")
        return None


def generate_character(sprite):
    """Use create-character with animal template."""
    template = sprite.get("template", "mannequin")
    payload = {
        "description": sprite["description"],
        "image_size": {"width": 32, "height": 32},
        "outline": "thin",
        "shading": "hard",
        "detail": "high",
        "template_id": template,
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/create-character-with-4-directions",
        data=data, headers=HEADERS, method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else str(e)
        print(f"    character error {e.code}: {body[:300]}")
        return None


def save_result(result, name):
    """Save image from various response formats."""
    if not result:
        return False

    # Check for direct image data (pixflux returns immediately)
    if "image" in result:
        img_data = result["image"]
        if isinstance(img_data, dict) and "base64" in img_data:
            raw = base64.b64decode(img_data["base64"])
            img_type = img_data.get("type", "")
            w = img_data.get("width", 32)
            h = img_data.get("height", 32)

            if img_type == "rgba_bytes":
                arr = np.frombuffer(raw, dtype=np.uint8).reshape((h, w, 4))
                img = Image.fromarray(arr, "RGBA")
            else:
                # Probably PNG bytes
                from io import BytesIO
                img = Image.open(BytesIO(raw))

            path = os.path.join(OUTPUT_DIR, f"{name}-south.png")
            img.save(path)
            print(f"    Saved: {path} ({w}x{h})")
            return True

    # Check for background job
    job_id = result.get("background_job_id")
    if job_id:
        print(f"    Job {job_id[:12]}... polling...")
        for poll in range(30):
            time.sleep(10)
            try:
                req = urllib.request.Request(
                    f"{BASE_URL}/background-jobs/{job_id}",
                    headers=HEADERS, method="GET"
                )
                with urllib.request.urlopen(req, timeout=30) as resp:
                    status_resp = json.loads(resp.read().decode("utf-8"))

                status = status_resp.get("status", "unknown")
                if status == "completed":
                    last = status_resp.get("last_response", {})
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
                    cost = status_resp.get("usage", {}).get("usd", "?")
                    print(f"    DONE (${cost})")
                    return True
                elif status in ("failed", "error"):
                    print(f"    Job failed")
                    return False
            except Exception:
                pass
        print(f"    Timed out")
        return False

    # Save raw response for debugging
    debug_path = os.path.join(OUTPUT_DIR, f"{name}-debug.json")
    with open(debug_path, "w") as f:
        def trunc(o):
            if isinstance(o, str) and len(o) > 100:
                return o[:50] + f"...[{len(o)}]"
            if isinstance(o, dict):
                return {k: trunc(v) for k, v in o.items()}
            if isinstance(o, list):
                return [trunc(v) for v in o]
            return o
        json.dump(trunc(result), f, indent=2)
    print(f"    Unknown format, saved debug: {debug_path}")
    return False


def main():
    print("Forge & Field -- PixelLab Enemy Generation")
    print(f"Generating {len(ENEMIES)} enemy sprites")
    print("=" * 50)

    for sprite in ENEMIES:
        name = sprite["name"]
        south_path = os.path.join(OUTPUT_DIR, f"{name}-south.png")
        if os.path.exists(south_path):
            print(f"  SKIP {name} (exists)")
            continue

        print(f"  {name}...")

        # Try pixflux first (freeform, works for any creature)
        result = generate_pixflux(sprite)
        if result and save_result(result, name):
            continue

        # Fallback: try character endpoint with animal template if specified
        if "template" in sprite:
            print(f"    Trying character template '{sprite['template']}'...")
            result = generate_character(sprite)
            if result and save_result(result, name):
                continue

        print(f"    FAILED all approaches for {name}")

    print("\n" + "=" * 50)
    pngs = [f for f in os.listdir(OUTPUT_DIR) if f.endswith(".png")]
    print(f"Total PNGs in output: {len(pngs)}")


if __name__ == "__main__":
    main()
