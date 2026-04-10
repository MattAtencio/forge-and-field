/**
 * Pixel Art Sprites — SVG-based pixel art using 1x1 rect grids
 *
 * These are v1 mockups using the Ember Glow 14-color palette.
 * Each sprite is a 32x32 grid of filled rectangles.
 * Designed to be replaced with real Aseprite sprite sheets later.
 *
 * Helper: px(x, y, color) creates a 1x1 pixel rect at grid position (x, y).
 * Groups of adjacent same-color pixels are merged into wider rects for efficiency.
 */

// Ember Glow palette
const P = {
  void: "#0f0e17",
  dark: "#1a1824",
  parchment: "#e8e0d4",
  ember: "#f97316",
  flame: "#fb923c",
  gold: "#fbbf24",
  leather: "#92400e",
  steelL: "#cbd5e1",
  steel: "#94a3b8",
  steelD: "#64748b",
  forest: "#22c55e",
  arcane: "#a855f7",
  skin: "#fcd5b0",
  danger: "#ef4444",
  skinS: "#d4a574",
  eye: "#1e293b",
};

// Helper: create a pixel rect (can span multiple pixels wide/tall for efficiency)
const px = (x, y, w, h, fill) => ({ t: "rect", x, y, w, h, fill, rx: 0 });
// Single pixel shorthand
const p1 = (x, y, fill) => px(x, y, 1, 1, fill);

/**
 * Aldric (Warrior) — Pixel Art, 32x32
 * Silhouette: Rectangle (broad, stocky)
 * Forge-touched: Ember glow on sword edge
 *
 * 4 idle animation frames:
 *   Frame 0: Base pose
 *   Frame 1: Slight rise (breathing up)
 *   Frame 2: Base pose (top of breath)
 *   Frame 3: Slight drop (breathing down)
 */
export const warrior_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Helmet
    px(12, 4, 8, 1, P.steelD),      // helmet top
    px(11, 5, 10, 1, P.steel),      // helmet mid
    px(11, 6, 10, 1, P.steelD),     // helmet band
    px(12, 7, 8, 1, P.steel),       // helmet lower
    p1(12, 5, P.steelL),            // helmet highlight

    // Visor
    px(13, 7, 6, 1, P.eye),         // visor slit

    // Face
    px(13, 8, 6, 1, P.skin),        // face top
    px(12, 9, 8, 1, P.skin),        // face mid
    p1(14, 9, P.eye),               // left eye
    p1(17, 9, P.eye),               // right eye
    px(13, 10, 6, 1, P.skinS),      // chin shadow

    // Neck
    px(14, 11, 4, 1, P.skin),

    // Shoulder pauldrons
    px(8, 12, 4, 3, P.steelD),      // left pauldron
    px(20, 12, 4, 3, P.steelD),     // right pauldron
    p1(9, 12, P.steelL),            // left highlight
    p1(21, 12, P.steelL),           // right highlight

    // Chest armor
    px(12, 12, 8, 2, P.steel),      // upper chest
    px(12, 14, 8, 3, P.steelD),     // lower chest
    px(14, 12, 4, 2, P.steelL),     // chest plate highlight
    px(15, 14, 2, 2, P.steelL),     // center detail

    // Belt
    px(11, 17, 10, 1, P.leather),   // belt
    p1(16, 17, P.gold),             // belt buckle

    // Tabard/skirt
    px(12, 18, 3, 2, P.steelD),     // left tabard
    px(17, 18, 3, 2, P.steelD),     // right tabard

    // Legs
    px(12, 20, 3, 4, P.steelD),     // left leg armor
    px(17, 20, 3, 4, P.steelD),     // right leg armor
    p1(13, 20, P.steel),            // left leg highlight
    p1(18, 20, P.steel),            // right leg highlight

    // Boots
    px(11, 24, 4, 2, P.leather),    // left boot
    px(17, 24, 4, 2, P.leather),    // right boot
    px(11, 26, 5, 1, P.leather),    // left sole
    px(17, 26, 5, 1, P.leather),    // right sole

    // Sword (right side)
    px(24, 4, 2, 1, P.steelL),      // pommel
    px(24, 5, 2, 2, P.leather),     // grip
    px(23, 7, 4, 1, P.gold),        // cross guard
    px(24, 8, 2, 10, P.steelL),     // blade
    px(24, 8, 1, 10, P.steel),      // blade shadow
    p1(25, 8, P.ember),             // ember edge top
    p1(25, 10, P.ember),            // ember edge
    p1(25, 12, P.flame),            // ember edge
    p1(25, 14, P.ember),            // ember edge
    p1(25, 16, P.ember),            // ember edge bottom
    p1(25, 18, P.steelL),           // blade tip

    // Shield (left side)
    px(5, 13, 3, 6, P.steelD),      // shield body
    px(6, 12, 2, 8, P.steel),       // shield center
    p1(6, 15, P.gold),              // shield boss
    p1(6, 16, P.gold),              // shield boss
  ],

  // ---- FRAME 1: Breathe up (shift torso up 1px) ----
  [
    // Helmet (up 1)
    px(12, 3, 8, 1, P.steelD),
    px(11, 4, 10, 1, P.steel),
    px(11, 5, 10, 1, P.steelD),
    px(12, 6, 8, 1, P.steel),
    p1(12, 4, P.steelL),

    // Visor
    px(13, 6, 6, 1, P.eye),

    // Face (up 1)
    px(13, 7, 6, 1, P.skin),
    px(12, 8, 8, 1, P.skin),
    p1(14, 8, P.eye),
    p1(17, 8, P.eye),
    px(13, 9, 6, 1, P.skinS),

    // Neck
    px(14, 10, 4, 1, P.skin),

    // Shoulders (up 1)
    px(8, 11, 4, 3, P.steelD),
    px(20, 11, 4, 3, P.steelD),
    p1(9, 11, P.steelL),
    p1(21, 11, P.steelL),

    // Chest (up 1)
    px(12, 11, 8, 2, P.steel),
    px(12, 13, 8, 3, P.steelD),
    px(14, 11, 4, 2, P.steelL),
    px(15, 13, 2, 2, P.steelL),

    // Belt (up 1)
    px(11, 16, 10, 1, P.leather),
    p1(16, 16, P.gold),

    // Tabard
    px(12, 17, 3, 2, P.steelD),
    px(17, 17, 3, 2, P.steelD),

    // Legs (same position)
    px(12, 20, 3, 4, P.steelD),
    px(17, 20, 3, 4, P.steelD),
    p1(13, 20, P.steel),
    p1(18, 20, P.steel),

    // Boots (same)
    px(11, 24, 4, 2, P.leather),
    px(17, 24, 4, 2, P.leather),
    px(11, 26, 5, 1, P.leather),
    px(17, 26, 5, 1, P.leather),

    // Sword (up 1)
    px(24, 3, 2, 1, P.steelL),
    px(24, 4, 2, 2, P.leather),
    px(23, 6, 4, 1, P.gold),
    px(24, 7, 2, 10, P.steelL),
    px(24, 7, 1, 10, P.steel),
    p1(25, 7, P.ember),
    p1(25, 9, P.ember),
    p1(25, 11, P.flame),
    p1(25, 13, P.ember),
    p1(25, 15, P.ember),
    p1(25, 17, P.steelL),

    // Shield (up 1)
    px(5, 12, 3, 6, P.steelD),
    px(6, 11, 2, 8, P.steel),
    p1(6, 14, P.gold),
    p1(6, 15, P.gold),
  ],

  // ---- FRAME 2: Base pose (same as frame 0) ----
  [
    // Helmet
    px(12, 4, 8, 1, P.steelD),
    px(11, 5, 10, 1, P.steel),
    px(11, 6, 10, 1, P.steelD),
    px(12, 7, 8, 1, P.steel),
    p1(12, 5, P.steelL),
    px(13, 7, 6, 1, P.eye),
    px(13, 8, 6, 1, P.skin),
    px(12, 9, 8, 1, P.skin),
    p1(14, 9, P.eye),
    p1(17, 9, P.eye),
    px(13, 10, 6, 1, P.skinS),
    px(14, 11, 4, 1, P.skin),
    px(8, 12, 4, 3, P.steelD),
    px(20, 12, 4, 3, P.steelD),
    p1(9, 12, P.steelL),
    p1(21, 12, P.steelL),
    px(12, 12, 8, 2, P.steel),
    px(12, 14, 8, 3, P.steelD),
    px(14, 12, 4, 2, P.steelL),
    px(15, 14, 2, 2, P.steelL),
    px(11, 17, 10, 1, P.leather),
    p1(16, 17, P.gold),
    px(12, 18, 3, 2, P.steelD),
    px(17, 18, 3, 2, P.steelD),
    px(12, 20, 3, 4, P.steelD),
    px(17, 20, 3, 4, P.steelD),
    p1(13, 20, P.steel),
    p1(18, 20, P.steel),
    px(11, 24, 4, 2, P.leather),
    px(17, 24, 4, 2, P.leather),
    px(11, 26, 5, 1, P.leather),
    px(17, 26, 5, 1, P.leather),
    px(24, 4, 2, 1, P.steelL),
    px(24, 5, 2, 2, P.leather),
    px(23, 7, 4, 1, P.gold),
    px(24, 8, 2, 10, P.steelL),
    px(24, 8, 1, 10, P.steel),
    p1(25, 8, P.ember),
    p1(25, 10, P.ember),
    p1(25, 12, P.flame),
    p1(25, 14, P.ember),
    p1(25, 16, P.ember),
    p1(25, 18, P.steelL),
    px(5, 13, 3, 6, P.steelD),
    px(6, 12, 2, 8, P.steel),
    p1(6, 15, P.gold),
    p1(6, 16, P.gold),
  ],

  // ---- FRAME 3: Breathe down (shift torso down 1px) ----
  [
    // Helmet (down 1)
    px(12, 5, 8, 1, P.steelD),
    px(11, 6, 10, 1, P.steel),
    px(11, 7, 10, 1, P.steelD),
    px(12, 8, 8, 1, P.steel),
    p1(12, 6, P.steelL),

    // Visor
    px(13, 8, 6, 1, P.eye),

    // Face (down 1)
    px(13, 9, 6, 1, P.skin),
    px(12, 10, 8, 1, P.skin),
    p1(14, 10, P.eye),
    p1(17, 10, P.eye),
    px(13, 11, 6, 1, P.skinS),

    // Neck
    px(14, 12, 4, 1, P.skin),

    // Shoulders (down 1)
    px(8, 13, 4, 3, P.steelD),
    px(20, 13, 4, 3, P.steelD),
    p1(9, 13, P.steelL),
    p1(21, 13, P.steelL),

    // Chest (down 1)
    px(12, 13, 8, 2, P.steel),
    px(12, 15, 8, 3, P.steelD),
    px(14, 13, 4, 2, P.steelL),
    px(15, 15, 2, 2, P.steelL),

    // Belt (down 1)
    px(11, 18, 10, 1, P.leather),
    p1(16, 18, P.gold),

    // Tabard
    px(12, 19, 3, 1, P.steelD),
    px(17, 19, 3, 1, P.steelD),

    // Legs (same)
    px(12, 20, 3, 4, P.steelD),
    px(17, 20, 3, 4, P.steelD),
    p1(13, 20, P.steel),
    p1(18, 20, P.steel),

    // Boots
    px(11, 24, 4, 2, P.leather),
    px(17, 24, 4, 2, P.leather),
    px(11, 26, 5, 1, P.leather),
    px(17, 26, 5, 1, P.leather),

    // Sword (down 1)
    px(24, 5, 2, 1, P.steelL),
    px(24, 6, 2, 2, P.leather),
    px(23, 8, 4, 1, P.gold),
    px(24, 9, 2, 10, P.steelL),
    px(24, 9, 1, 10, P.steel),
    p1(25, 9, P.ember),
    p1(25, 11, P.ember),
    p1(25, 13, P.flame),
    p1(25, 15, P.ember),
    p1(25, 17, P.ember),
    p1(25, 19, P.steelL),

    // Shield (down 1)
    px(5, 14, 3, 6, P.steelD),
    px(6, 13, 2, 8, P.steel),
    p1(6, 16, P.gold),
    p1(6, 17, P.gold),
  ],
];
