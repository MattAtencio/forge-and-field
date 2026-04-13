#!/bin/bash
# Sync art pipeline assets to public/sprites/ for the app to serve.
# Source of truth: art/    Deployment target: public/sprites/
# Run after any art pipeline changes.

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Syncing art/ → public/sprites/ ..."

# Concepts: pixellab iterations
mkdir -p "$PROJECT_DIR/public/sprites/pixellab"
cp -r "$PROJECT_DIR/art/concepts/pixellab/"* "$PROJECT_DIR/public/sprites/pixellab/" 2>/dev/null || true

# Concepts: v2 (DALL-E hero concepts + enemy concepts)
mkdir -p "$PROJECT_DIR/public/sprites/v2" "$PROJECT_DIR/public/sprites/v2/enemies"
cp -r "$PROJECT_DIR/art/concepts/heroes/"* "$PROJECT_DIR/public/sprites/v2/" 2>/dev/null || true
cp -r "$PROJECT_DIR/art/concepts/enemies/"* "$PROJECT_DIR/public/sprites/v2/enemies/" 2>/dev/null || true

# Production sprites
mkdir -p "$PROJECT_DIR/public/sprites/production/heroes"
cp -r "$PROJECT_DIR/art/production/heroes/"* "$PROJECT_DIR/public/sprites/production/heroes/" 2>/dev/null || true

for region in greenwood stormridge dusthaven frostpeak dragons-reach; do
  if [ -d "$PROJECT_DIR/art/production/enemies/$region" ]; then
    mkdir -p "$PROJECT_DIR/public/sprites/production/enemies/$region"
    cp -r "$PROJECT_DIR/art/production/enemies/$region/"* "$PROJECT_DIR/public/sprites/production/enemies/$region/" 2>/dev/null || true
  fi
done

echo "Done. public/sprites/ is up to date."
