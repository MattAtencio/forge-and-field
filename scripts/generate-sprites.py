"""
Forge & Field sprite generation — thin wrapper around global PixelLab SDK.

Usage:
  py scripts/generate-sprites.py                    # generate all
  py scripts/generate-sprites.py heroes             # heroes only
  py scripts/generate-sprites.py enemies            # all enemies
  py scripts/generate-sprites.py enemies/greenwood  # one region
  py scripts/generate-sprites.py aldric             # single sprite by name
"""
import os
import sys

# Add global SDK to path
sys.path.insert(0, os.path.expanduser("~/.claude/lib"))

from pixellab import ProjectConfig, batch_generate

SPRITES_JSON = os.path.join(os.path.dirname(__file__), "..", "art", "sprites.json")


def main():
    config = ProjectConfig.load(SPRITES_JSON)
    target = sys.argv[1] if len(sys.argv) > 1 else "all"

    # Filter sprites based on target
    if target == "all":
        specs = config.sprites
    elif target == "heroes":
        specs = config.sprites_by_category("heroes")
    elif target == "enemies":
        specs = config.sprites_by_category("enemies")
    elif "/" in target:
        # e.g. enemies/greenwood
        category, region = target.split("/", 1)
        specs = [s for s in config.sprites if s.category == category and s.region == region]
    else:
        # Single sprite by name
        spec = config.sprite_by_name(target)
        specs = [spec] if spec else []

    if not specs:
        print(f"No sprites matched target: {target}")
        print("Options: all, heroes, enemies, enemies/<region>, or a sprite name")
        sys.exit(1)

    print(f"Forge & Field — Generating {len(specs)} sprites via PixelLab")
    print("=" * 50)

    results = batch_generate(config, specs)

    # Run art sync after generation
    print("\nSyncing art/ → public/sprites/...")
    os.system("bash scripts/sync-art.sh")


if __name__ == "__main__":
    main()
