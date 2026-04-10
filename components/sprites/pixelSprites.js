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

/**
 * Lyra (Ranger) — Pixel Art, 32x32
 * Silhouette: Triangle (narrow, agile, hooded)
 * Forge-touched: Ember glow on arrow tips
 *
 * 4 idle animation frames (same breathing pattern as Aldric)
 */
export const ranger_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Hood
    px(14, 4, 4, 1, P.forest),         // hood peak
    px(13, 5, 6, 1, P.forest),         // hood upper
    px(12, 6, 8, 1, P.forest),         // hood mid
    p1(13, 5, P.leather),              // hood shadow

    // Face (visible under hood)
    px(13, 7, 6, 1, P.skin),           // face upper
    px(14, 8, 4, 1, P.skin),           // face lower
    p1(14, 7, P.eye),                  // left eye
    p1(17, 7, P.eye),                  // right eye
    px(14, 9, 4, 1, P.skinS),          // chin shadow

    // Neck
    px(15, 10, 2, 1, P.skin),

    // Cloak (triangle silhouette — wide shoulders, narrow waist)
    px(10, 11, 12, 1, P.forest),       // cloak top / shoulders
    px(10, 12, 12, 1, P.forest),       // cloak upper
    p1(10, 11, P.leather),             // left cloak edge shadow
    p1(21, 11, P.leather),             // right cloak edge shadow

    // Torso (under cloak)
    px(12, 13, 8, 1, P.leather),       // tunic upper
    px(13, 14, 6, 1, P.leather),       // tunic mid
    px(13, 15, 6, 1, P.leather),       // tunic lower
    p1(15, 13, P.forest),              // tunic detail
    p1(16, 13, P.forest),              // tunic detail

    // Belt
    px(13, 16, 6, 1, P.leather),       // belt
    p1(16, 16, P.gold),                // belt buckle

    // Quiver on back (right side)
    px(21, 8, 2, 8, P.leather),        // quiver body
    p1(21, 8, P.leather),              // quiver top
    p1(22, 9, P.steelL),               // arrow fletching 1
    p1(22, 10, P.steelL),              // arrow fletching 2
    p1(22, 11, P.steelL),              // arrow fletching 3

    // Legs (narrow, agile)
    px(13, 17, 3, 4, P.leather),       // left leg
    px(16, 17, 3, 4, P.leather),       // right leg
    p1(14, 17, P.forest),              // left leg detail
    p1(17, 17, P.forest),              // right leg detail

    // Boots
    px(12, 21, 4, 2, P.leather),       // left boot
    px(16, 21, 4, 2, P.leather),       // right boot
    px(12, 23, 4, 1, P.leather),       // left sole
    px(16, 23, 4, 1, P.leather),       // right sole

    // Longbow (left side)
    p1(7, 7, P.leather),               // bow top
    p1(8, 8, P.leather),               // bow upper curve
    p1(8, 9, P.leather),               // bow
    p1(9, 10, P.leather),              // bow
    p1(9, 11, P.leather),              // bow grip
    p1(9, 12, P.leather),              // bow grip
    p1(9, 13, P.leather),              // bow
    p1(8, 14, P.leather),              // bow
    p1(8, 15, P.leather),              // bow lower curve
    p1(7, 16, P.leather),              // bow bottom
    p1(7, 8, P.steelD),               // bowstring top
    p1(9, 11, P.steelD),              // bowstring mid
    p1(7, 15, P.steelD),              // bowstring bottom

    // Arrow (nocked, with ember tip)
    px(5, 11, 4, 1, P.steelL),         // arrow shaft
    p1(4, 11, P.ember),                // ember arrow tip
    p1(3, 11, P.flame),                // ember glow
  ],

  // ---- FRAME 1: Breathe up (shift torso up 1px) ----
  [
    // Hood (up 1)
    px(14, 3, 4, 1, P.forest),
    px(13, 4, 6, 1, P.forest),
    px(12, 5, 8, 1, P.forest),
    p1(13, 4, P.leather),

    // Face (up 1)
    px(13, 6, 6, 1, P.skin),
    px(14, 7, 4, 1, P.skin),
    p1(14, 6, P.eye),
    p1(17, 6, P.eye),
    px(14, 8, 4, 1, P.skinS),

    // Neck
    px(15, 9, 2, 1, P.skin),

    // Cloak (up 1)
    px(10, 10, 12, 1, P.forest),
    px(10, 11, 12, 1, P.forest),
    p1(10, 10, P.leather),
    p1(21, 10, P.leather),

    // Torso (up 1)
    px(12, 12, 8, 1, P.leather),
    px(13, 13, 6, 1, P.leather),
    px(13, 14, 6, 1, P.leather),
    p1(15, 12, P.forest),
    p1(16, 12, P.forest),

    // Belt (up 1)
    px(13, 15, 6, 1, P.leather),
    p1(16, 15, P.gold),

    // Quiver (up 1)
    px(21, 7, 2, 8, P.leather),
    p1(21, 7, P.leather),
    p1(22, 8, P.steelL),
    p1(22, 9, P.steelL),
    p1(22, 10, P.steelL),

    // Legs (same)
    px(13, 17, 3, 4, P.leather),
    px(16, 17, 3, 4, P.leather),
    p1(14, 17, P.forest),
    p1(17, 17, P.forest),

    // Boots (same)
    px(12, 21, 4, 2, P.leather),
    px(16, 21, 4, 2, P.leather),
    px(12, 23, 4, 1, P.leather),
    px(16, 23, 4, 1, P.leather),

    // Longbow (up 1)
    p1(7, 6, P.leather),
    p1(8, 7, P.leather),
    p1(8, 8, P.leather),
    p1(9, 9, P.leather),
    p1(9, 10, P.leather),
    p1(9, 11, P.leather),
    p1(9, 12, P.leather),
    p1(8, 13, P.leather),
    p1(8, 14, P.leather),
    p1(7, 15, P.leather),
    p1(7, 7, P.steelD),
    p1(9, 10, P.steelD),
    p1(7, 14, P.steelD),

    // Arrow (up 1)
    px(5, 10, 4, 1, P.steelL),
    p1(4, 10, P.ember),
    p1(3, 10, P.flame),
  ],

  // ---- FRAME 2: Base pose (same as frame 0) ----
  [
    px(14, 4, 4, 1, P.forest),
    px(13, 5, 6, 1, P.forest),
    px(12, 6, 8, 1, P.forest),
    p1(13, 5, P.leather),
    px(13, 7, 6, 1, P.skin),
    px(14, 8, 4, 1, P.skin),
    p1(14, 7, P.eye),
    p1(17, 7, P.eye),
    px(14, 9, 4, 1, P.skinS),
    px(15, 10, 2, 1, P.skin),
    px(10, 11, 12, 1, P.forest),
    px(10, 12, 12, 1, P.forest),
    p1(10, 11, P.leather),
    p1(21, 11, P.leather),
    px(12, 13, 8, 1, P.leather),
    px(13, 14, 6, 1, P.leather),
    px(13, 15, 6, 1, P.leather),
    p1(15, 13, P.forest),
    p1(16, 13, P.forest),
    px(13, 16, 6, 1, P.leather),
    p1(16, 16, P.gold),
    px(21, 8, 2, 8, P.leather),
    p1(21, 8, P.leather),
    p1(22, 9, P.steelL),
    p1(22, 10, P.steelL),
    p1(22, 11, P.steelL),
    px(13, 17, 3, 4, P.leather),
    px(16, 17, 3, 4, P.leather),
    p1(14, 17, P.forest),
    p1(17, 17, P.forest),
    px(12, 21, 4, 2, P.leather),
    px(16, 21, 4, 2, P.leather),
    px(12, 23, 4, 1, P.leather),
    px(16, 23, 4, 1, P.leather),
    p1(7, 7, P.leather),
    p1(8, 8, P.leather),
    p1(8, 9, P.leather),
    p1(9, 10, P.leather),
    p1(9, 11, P.leather),
    p1(9, 12, P.leather),
    p1(9, 13, P.leather),
    p1(8, 14, P.leather),
    p1(8, 15, P.leather),
    p1(7, 16, P.leather),
    p1(7, 8, P.steelD),
    p1(9, 11, P.steelD),
    p1(7, 15, P.steelD),
    px(5, 11, 4, 1, P.steelL),
    p1(4, 11, P.ember),
    p1(3, 11, P.flame),
  ],

  // ---- FRAME 3: Breathe down (shift torso down 1px) ----
  [
    // Hood (down 1)
    px(14, 5, 4, 1, P.forest),
    px(13, 6, 6, 1, P.forest),
    px(12, 7, 8, 1, P.forest),
    p1(13, 6, P.leather),

    // Face (down 1)
    px(13, 8, 6, 1, P.skin),
    px(14, 9, 4, 1, P.skin),
    p1(14, 8, P.eye),
    p1(17, 8, P.eye),
    px(14, 10, 4, 1, P.skinS),

    // Neck
    px(15, 11, 2, 1, P.skin),

    // Cloak (down 1)
    px(10, 12, 12, 1, P.forest),
    px(10, 13, 12, 1, P.forest),
    p1(10, 12, P.leather),
    p1(21, 12, P.leather),

    // Torso (down 1)
    px(12, 14, 8, 1, P.leather),
    px(13, 15, 6, 1, P.leather),
    px(13, 16, 6, 1, P.leather),
    p1(15, 14, P.forest),
    p1(16, 14, P.forest),

    // Belt (down 1)
    px(13, 17, 6, 1, P.leather),
    p1(16, 17, P.gold),

    // Quiver (down 1)
    px(21, 9, 2, 8, P.leather),
    p1(21, 9, P.leather),
    p1(22, 10, P.steelL),
    p1(22, 11, P.steelL),
    p1(22, 12, P.steelL),

    // Legs (same)
    px(13, 18, 3, 3, P.leather),
    px(16, 18, 3, 3, P.leather),
    p1(14, 18, P.forest),
    p1(17, 18, P.forest),

    // Boots (same)
    px(12, 21, 4, 2, P.leather),
    px(16, 21, 4, 2, P.leather),
    px(12, 23, 4, 1, P.leather),
    px(16, 23, 4, 1, P.leather),

    // Longbow (down 1)
    p1(7, 8, P.leather),
    p1(8, 9, P.leather),
    p1(8, 10, P.leather),
    p1(9, 11, P.leather),
    p1(9, 12, P.leather),
    p1(9, 13, P.leather),
    p1(9, 14, P.leather),
    p1(8, 15, P.leather),
    p1(8, 16, P.leather),
    p1(7, 17, P.leather),
    p1(7, 9, P.steelD),
    p1(9, 12, P.steelD),
    p1(7, 16, P.steelD),

    // Arrow (down 1)
    px(5, 12, 4, 1, P.steelL),
    p1(4, 12, P.ember),
    p1(3, 12, P.flame),
  ],
];

/**
 * Theron (Mage) — Pixel Art, 32x32
 * Silhouette: Inverted Triangle (narrow shoulders, wide robes at base)
 * Forge-touched: Ember glow on staff crystal
 *
 * 4 idle animation frames
 */
export const mage_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Staff crystal (glowing, left side)
    p1(6, 2, P.flame),                 // crystal top glow
    px(5, 3, 3, 1, P.ember),           // crystal body
    p1(6, 4, P.flame),                 // crystal bottom glow
    p1(6, 3, P.gold),                  // crystal center highlight

    // Staff shaft
    p1(6, 5, P.leather),               // staff upper
    p1(6, 6, P.leather),
    p1(6, 7, P.leather),
    p1(6, 8, P.leather),
    p1(6, 9, P.leather),
    p1(6, 10, P.leather),
    p1(6, 11, P.leather),
    p1(6, 12, P.leather),
    p1(6, 13, P.leather),
    p1(6, 14, P.leather),
    p1(6, 15, P.leather),
    p1(6, 16, P.leather),
    p1(6, 17, P.leather),
    p1(6, 18, P.leather),              // staff base

    // Hat/hood
    px(15, 3, 2, 1, P.arcane),         // hat peak
    px(14, 4, 4, 1, P.arcane),         // hat upper
    px(13, 5, 6, 1, P.arcane),         // hat mid
    px(12, 6, 8, 1, P.arcane),         // hat brim
    p1(15, 3, P.flame),                // hat star accent

    // Face
    px(13, 7, 6, 1, P.skin),           // face upper
    px(14, 8, 4, 1, P.skin),           // face lower
    p1(14, 7, P.eye),                  // left eye
    p1(17, 7, P.eye),                  // right eye
    px(14, 9, 4, 1, P.skinS),          // chin / beard shadow

    // Neck
    px(15, 10, 2, 1, P.skin),

    // Shoulders (narrow — inverted triangle starts narrow)
    px(12, 11, 8, 1, P.arcane),        // shoulder line

    // Robes upper (gradually widening)
    px(12, 12, 8, 1, P.arcane),        // robe upper
    px(11, 13, 10, 1, P.arcane),       // robe widening
    px(11, 14, 10, 1, P.arcane),       // robe mid
    p1(15, 12, P.steelL),              // robe clasp
    p1(16, 12, P.steelL),              // robe clasp

    // Belt / sash
    px(11, 15, 10, 1, P.leather),      // belt
    p1(16, 15, P.gold),                // belt gem

    // Robes lower (widest — inverted triangle base)
    px(10, 16, 12, 1, P.arcane),       // robe expanding
    px(9, 17, 14, 1, P.arcane),        // robe wider
    px(9, 18, 14, 1, P.arcane),        // robe wide
    px(8, 19, 16, 1, P.arcane),        // robe widest
    px(8, 20, 16, 1, P.arcane),        // robe base
    px(8, 21, 16, 1, P.arcane),        // robe hem

    // Robe shadow details
    p1(12, 17, P.steelD),              // left fold shadow
    p1(19, 17, P.steelD),              // right fold shadow
    p1(11, 19, P.steelD),              // left deep fold
    p1(20, 19, P.steelD),              // right deep fold

    // Feet (barely visible under robes)
    px(11, 22, 4, 1, P.leather),       // left foot
    px(17, 22, 4, 1, P.leather),       // right foot

    // Hand holding staff (left arm extended)
    px(8, 11, 2, 1, P.skin),           // left hand on staff
    p1(7, 11, P.arcane),               // sleeve edge
  ],

  // ---- FRAME 1: Breathe up (shift torso up 1px) ----
  [
    // Staff crystal (up 1)
    p1(6, 1, P.flame),
    px(5, 2, 3, 1, P.ember),
    p1(6, 3, P.flame),
    p1(6, 2, P.gold),

    // Staff shaft (up 1)
    p1(6, 4, P.leather),
    p1(6, 5, P.leather),
    p1(6, 6, P.leather),
    p1(6, 7, P.leather),
    p1(6, 8, P.leather),
    p1(6, 9, P.leather),
    p1(6, 10, P.leather),
    p1(6, 11, P.leather),
    p1(6, 12, P.leather),
    p1(6, 13, P.leather),
    p1(6, 14, P.leather),
    p1(6, 15, P.leather),
    p1(6, 16, P.leather),
    p1(6, 17, P.leather),

    // Hat (up 1)
    px(15, 2, 2, 1, P.arcane),
    px(14, 3, 4, 1, P.arcane),
    px(13, 4, 6, 1, P.arcane),
    px(12, 5, 8, 1, P.arcane),
    p1(15, 2, P.flame),

    // Face (up 1)
    px(13, 6, 6, 1, P.skin),
    px(14, 7, 4, 1, P.skin),
    p1(14, 6, P.eye),
    p1(17, 6, P.eye),
    px(14, 8, 4, 1, P.skinS),

    // Neck
    px(15, 9, 2, 1, P.skin),

    // Shoulders (up 1)
    px(12, 10, 8, 1, P.arcane),

    // Robes upper (up 1)
    px(12, 11, 8, 1, P.arcane),
    px(11, 12, 10, 1, P.arcane),
    px(11, 13, 10, 1, P.arcane),
    p1(15, 11, P.steelL),
    p1(16, 11, P.steelL),

    // Belt (up 1)
    px(11, 14, 10, 1, P.leather),
    p1(16, 14, P.gold),

    // Robes lower (same — grounded)
    px(10, 16, 12, 1, P.arcane),
    px(9, 17, 14, 1, P.arcane),
    px(9, 18, 14, 1, P.arcane),
    px(8, 19, 16, 1, P.arcane),
    px(8, 20, 16, 1, P.arcane),
    px(8, 21, 16, 1, P.arcane),
    p1(12, 17, P.steelD),
    p1(19, 17, P.steelD),
    p1(11, 19, P.steelD),
    p1(20, 19, P.steelD),

    // Feet (same)
    px(11, 22, 4, 1, P.leather),
    px(17, 22, 4, 1, P.leather),

    // Hand (up 1)
    px(8, 10, 2, 1, P.skin),
    p1(7, 10, P.arcane),
  ],

  // ---- FRAME 2: Base pose (same as frame 0) ----
  [
    p1(6, 2, P.flame),
    px(5, 3, 3, 1, P.ember),
    p1(6, 4, P.flame),
    p1(6, 3, P.gold),
    p1(6, 5, P.leather),
    p1(6, 6, P.leather),
    p1(6, 7, P.leather),
    p1(6, 8, P.leather),
    p1(6, 9, P.leather),
    p1(6, 10, P.leather),
    p1(6, 11, P.leather),
    p1(6, 12, P.leather),
    p1(6, 13, P.leather),
    p1(6, 14, P.leather),
    p1(6, 15, P.leather),
    p1(6, 16, P.leather),
    p1(6, 17, P.leather),
    p1(6, 18, P.leather),
    px(15, 3, 2, 1, P.arcane),
    px(14, 4, 4, 1, P.arcane),
    px(13, 5, 6, 1, P.arcane),
    px(12, 6, 8, 1, P.arcane),
    p1(15, 3, P.flame),
    px(13, 7, 6, 1, P.skin),
    px(14, 8, 4, 1, P.skin),
    p1(14, 7, P.eye),
    p1(17, 7, P.eye),
    px(14, 9, 4, 1, P.skinS),
    px(15, 10, 2, 1, P.skin),
    px(12, 11, 8, 1, P.arcane),
    px(12, 12, 8, 1, P.arcane),
    px(11, 13, 10, 1, P.arcane),
    px(11, 14, 10, 1, P.arcane),
    p1(15, 12, P.steelL),
    p1(16, 12, P.steelL),
    px(11, 15, 10, 1, P.leather),
    p1(16, 15, P.gold),
    px(10, 16, 12, 1, P.arcane),
    px(9, 17, 14, 1, P.arcane),
    px(9, 18, 14, 1, P.arcane),
    px(8, 19, 16, 1, P.arcane),
    px(8, 20, 16, 1, P.arcane),
    px(8, 21, 16, 1, P.arcane),
    p1(12, 17, P.steelD),
    p1(19, 17, P.steelD),
    p1(11, 19, P.steelD),
    p1(20, 19, P.steelD),
    px(11, 22, 4, 1, P.leather),
    px(17, 22, 4, 1, P.leather),
    px(8, 11, 2, 1, P.skin),
    p1(7, 11, P.arcane),
  ],

  // ---- FRAME 3: Breathe down (shift torso down 1px) ----
  [
    // Staff crystal (down 1)
    p1(6, 3, P.flame),
    px(5, 4, 3, 1, P.ember),
    p1(6, 5, P.flame),
    p1(6, 4, P.gold),

    // Staff shaft (down 1)
    p1(6, 6, P.leather),
    p1(6, 7, P.leather),
    p1(6, 8, P.leather),
    p1(6, 9, P.leather),
    p1(6, 10, P.leather),
    p1(6, 11, P.leather),
    p1(6, 12, P.leather),
    p1(6, 13, P.leather),
    p1(6, 14, P.leather),
    p1(6, 15, P.leather),
    p1(6, 16, P.leather),
    p1(6, 17, P.leather),
    p1(6, 18, P.leather),
    p1(6, 19, P.leather),

    // Hat (down 1)
    px(15, 4, 2, 1, P.arcane),
    px(14, 5, 4, 1, P.arcane),
    px(13, 6, 6, 1, P.arcane),
    px(12, 7, 8, 1, P.arcane),
    p1(15, 4, P.flame),

    // Face (down 1)
    px(13, 8, 6, 1, P.skin),
    px(14, 9, 4, 1, P.skin),
    p1(14, 8, P.eye),
    p1(17, 8, P.eye),
    px(14, 10, 4, 1, P.skinS),

    // Neck
    px(15, 11, 2, 1, P.skin),

    // Shoulders (down 1)
    px(12, 12, 8, 1, P.arcane),

    // Robes upper (down 1)
    px(12, 13, 8, 1, P.arcane),
    px(11, 14, 10, 1, P.arcane),
    px(11, 15, 10, 1, P.arcane),
    p1(15, 13, P.steelL),
    p1(16, 13, P.steelL),

    // Belt (down 1)
    px(11, 16, 10, 1, P.leather),
    p1(16, 16, P.gold),

    // Robes lower (same — grounded)
    px(10, 17, 12, 1, P.arcane),
    px(9, 18, 14, 1, P.arcane),
    px(9, 19, 14, 1, P.arcane),
    px(8, 20, 16, 1, P.arcane),
    px(8, 21, 16, 1, P.arcane),
    p1(12, 18, P.steelD),
    p1(19, 18, P.steelD),
    p1(11, 20, P.steelD),
    p1(20, 20, P.steelD),

    // Feet (same)
    px(11, 22, 4, 1, P.leather),
    px(17, 22, 4, 1, P.leather),

    // Hand (down 1)
    px(8, 12, 2, 1, P.skin),
    p1(7, 12, P.arcane),
  ],
];

/**
 * Sera (Paladin) — Pixel Art, 32x32
 * Silhouette: Cross/Shield (wide at shield, structured)
 * Forge-touched: Ember glow on shield emblem
 *
 * 4 idle animation frames
 */
export const paladin_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Helmet (golden crown-like)
    px(13, 4, 6, 1, P.gold),           // helmet crown
    px(12, 5, 8, 1, P.gold),           // helmet upper
    px(12, 6, 8, 1, P.steelD),         // helmet band
    px(13, 7, 6, 1, P.gold),           // helmet lower
    p1(15, 4, P.ember),                // crown gem center
    p1(13, 5, P.steelL),               // highlight

    // Face
    px(13, 7, 6, 1, P.eye),            // visor slit
    px(13, 8, 6, 1, P.skin),           // face upper
    px(13, 9, 6, 1, P.skin),           // face mid
    p1(14, 9, P.eye),                  // left eye
    p1(17, 9, P.eye),                  // right eye
    px(14, 10, 4, 1, P.skinS),         // chin

    // Neck
    px(14, 11, 4, 1, P.skin),

    // Shoulder pauldrons (gold)
    px(8, 12, 4, 2, P.gold),           // left pauldron
    px(20, 12, 4, 2, P.gold),          // right pauldron
    p1(9, 12, P.steelL),               // left highlight
    p1(21, 12, P.steelL),              // right highlight
    px(8, 14, 4, 1, P.steelD),         // left pauldron shadow
    px(20, 14, 4, 1, P.steelD),        // right pauldron shadow

    // Chest plate (golden armor)
    px(12, 12, 8, 2, P.gold),          // upper chest
    px(12, 14, 8, 3, P.steelD),        // lower chest
    px(14, 12, 4, 2, P.steelL),        // chest plate center
    p1(15, 14, P.gold),                // cross detail vertical
    p1(16, 14, P.gold),                // cross detail vertical
    p1(14, 15, P.gold),                // cross detail horizontal
    p1(17, 15, P.gold),                // cross detail horizontal

    // Belt
    px(11, 17, 10, 1, P.leather),      // belt
    p1(16, 17, P.gold),                // belt buckle

    // Tabard
    px(12, 18, 3, 2, P.gold),          // left tabard
    px(17, 18, 3, 2, P.gold),          // right tabard
    p1(13, 18, P.steelL),              // tabard highlight left
    p1(18, 18, P.steelL),              // tabard highlight right

    // Legs (heavy armored)
    px(12, 20, 3, 4, P.steelD),        // left leg
    px(17, 20, 3, 4, P.steelD),        // right leg
    p1(13, 20, P.steel),               // left leg highlight
    p1(18, 20, P.steel),               // right leg highlight

    // Boots
    px(11, 24, 4, 2, P.steelD),        // left boot
    px(17, 24, 4, 2, P.steelD),        // right boot
    px(11, 26, 5, 1, P.steelD),        // left sole
    px(17, 26, 5, 1, P.steelD),        // right sole

    // Shield (left side — large, defining cross silhouette)
    px(3, 10, 5, 10, P.gold),          // shield body
    px(4, 9, 3, 12, P.gold),           // shield center column
    p1(4, 10, P.steelL),               // shield highlight
    p1(4, 11, P.steelL),               // shield highlight
    px(3, 14, 5, 1, P.steelD),         // shield horizontal bar
    px(5, 11, 1, 6, P.steelD),         // shield vertical bar

    // Shield emblem (ember glow center)
    p1(5, 14, P.ember),                // emblem center
    p1(5, 13, P.flame),                // emblem glow up
    p1(5, 15, P.flame),                // emblem glow down
    p1(4, 14, P.flame),                // emblem glow left
    p1(6, 14, P.flame),                // emblem glow right

    // Sword (right side, shorter than warrior — paladin focuses on defense)
    px(24, 8, 2, 1, P.gold),           // pommel
    px(24, 9, 2, 2, P.leather),        // grip
    px(23, 11, 4, 1, P.gold),          // cross guard
    px(24, 12, 2, 6, P.steelL),        // blade
    px(24, 12, 1, 6, P.steel),         // blade shadow
    p1(24, 18, P.steelL),              // blade tip
  ],

  // ---- FRAME 1: Breathe up (shift torso up 1px) ----
  [
    // Helmet (up 1)
    px(13, 3, 6, 1, P.gold),
    px(12, 4, 8, 1, P.gold),
    px(12, 5, 8, 1, P.steelD),
    px(13, 6, 6, 1, P.gold),
    p1(15, 3, P.ember),
    p1(13, 4, P.steelL),

    // Face (up 1)
    px(13, 6, 6, 1, P.eye),
    px(13, 7, 6, 1, P.skin),
    px(13, 8, 6, 1, P.skin),
    p1(14, 8, P.eye),
    p1(17, 8, P.eye),
    px(14, 9, 4, 1, P.skinS),

    // Neck
    px(14, 10, 4, 1, P.skin),

    // Shoulders (up 1)
    px(8, 11, 4, 2, P.gold),
    px(20, 11, 4, 2, P.gold),
    p1(9, 11, P.steelL),
    p1(21, 11, P.steelL),
    px(8, 13, 4, 1, P.steelD),
    px(20, 13, 4, 1, P.steelD),

    // Chest (up 1)
    px(12, 11, 8, 2, P.gold),
    px(12, 13, 8, 3, P.steelD),
    px(14, 11, 4, 2, P.steelL),
    p1(15, 13, P.gold),
    p1(16, 13, P.gold),
    p1(14, 14, P.gold),
    p1(17, 14, P.gold),

    // Belt (up 1)
    px(11, 16, 10, 1, P.leather),
    p1(16, 16, P.gold),

    // Tabard (up 1)
    px(12, 17, 3, 2, P.gold),
    px(17, 17, 3, 2, P.gold),
    p1(13, 17, P.steelL),
    p1(18, 17, P.steelL),

    // Legs (same)
    px(12, 20, 3, 4, P.steelD),
    px(17, 20, 3, 4, P.steelD),
    p1(13, 20, P.steel),
    p1(18, 20, P.steel),

    // Boots (same)
    px(11, 24, 4, 2, P.steelD),
    px(17, 24, 4, 2, P.steelD),
    px(11, 26, 5, 1, P.steelD),
    px(17, 26, 5, 1, P.steelD),

    // Shield (up 1)
    px(3, 9, 5, 10, P.gold),
    px(4, 8, 3, 12, P.gold),
    p1(4, 9, P.steelL),
    p1(4, 10, P.steelL),
    px(3, 13, 5, 1, P.steelD),
    px(5, 10, 1, 6, P.steelD),
    p1(5, 13, P.ember),
    p1(5, 12, P.flame),
    p1(5, 14, P.flame),
    p1(4, 13, P.flame),
    p1(6, 13, P.flame),

    // Sword (up 1)
    px(24, 7, 2, 1, P.gold),
    px(24, 8, 2, 2, P.leather),
    px(23, 10, 4, 1, P.gold),
    px(24, 11, 2, 6, P.steelL),
    px(24, 11, 1, 6, P.steel),
    p1(24, 17, P.steelL),
  ],

  // ---- FRAME 2: Base pose (same as frame 0) ----
  [
    px(13, 4, 6, 1, P.gold),
    px(12, 5, 8, 1, P.gold),
    px(12, 6, 8, 1, P.steelD),
    px(13, 7, 6, 1, P.gold),
    p1(15, 4, P.ember),
    p1(13, 5, P.steelL),
    px(13, 7, 6, 1, P.eye),
    px(13, 8, 6, 1, P.skin),
    px(13, 9, 6, 1, P.skin),
    p1(14, 9, P.eye),
    p1(17, 9, P.eye),
    px(14, 10, 4, 1, P.skinS),
    px(14, 11, 4, 1, P.skin),
    px(8, 12, 4, 2, P.gold),
    px(20, 12, 4, 2, P.gold),
    p1(9, 12, P.steelL),
    p1(21, 12, P.steelL),
    px(8, 14, 4, 1, P.steelD),
    px(20, 14, 4, 1, P.steelD),
    px(12, 12, 8, 2, P.gold),
    px(12, 14, 8, 3, P.steelD),
    px(14, 12, 4, 2, P.steelL),
    p1(15, 14, P.gold),
    p1(16, 14, P.gold),
    p1(14, 15, P.gold),
    p1(17, 15, P.gold),
    px(11, 17, 10, 1, P.leather),
    p1(16, 17, P.gold),
    px(12, 18, 3, 2, P.gold),
    px(17, 18, 3, 2, P.gold),
    p1(13, 18, P.steelL),
    p1(18, 18, P.steelL),
    px(12, 20, 3, 4, P.steelD),
    px(17, 20, 3, 4, P.steelD),
    p1(13, 20, P.steel),
    p1(18, 20, P.steel),
    px(11, 24, 4, 2, P.steelD),
    px(17, 24, 4, 2, P.steelD),
    px(11, 26, 5, 1, P.steelD),
    px(17, 26, 5, 1, P.steelD),
    px(3, 10, 5, 10, P.gold),
    px(4, 9, 3, 12, P.gold),
    p1(4, 10, P.steelL),
    p1(4, 11, P.steelL),
    px(3, 14, 5, 1, P.steelD),
    px(5, 11, 1, 6, P.steelD),
    p1(5, 14, P.ember),
    p1(5, 13, P.flame),
    p1(5, 15, P.flame),
    p1(4, 14, P.flame),
    p1(6, 14, P.flame),
    px(24, 8, 2, 1, P.gold),
    px(24, 9, 2, 2, P.leather),
    px(23, 11, 4, 1, P.gold),
    px(24, 12, 2, 6, P.steelL),
    px(24, 12, 1, 6, P.steel),
    p1(24, 18, P.steelL),
  ],

  // ---- FRAME 3: Breathe down (shift torso down 1px) ----
  [
    // Helmet (down 1)
    px(13, 5, 6, 1, P.gold),
    px(12, 6, 8, 1, P.gold),
    px(12, 7, 8, 1, P.steelD),
    px(13, 8, 6, 1, P.gold),
    p1(15, 5, P.ember),
    p1(13, 6, P.steelL),

    // Face (down 1)
    px(13, 8, 6, 1, P.eye),
    px(13, 9, 6, 1, P.skin),
    px(13, 10, 6, 1, P.skin),
    p1(14, 10, P.eye),
    p1(17, 10, P.eye),
    px(14, 11, 4, 1, P.skinS),

    // Neck
    px(14, 12, 4, 1, P.skin),

    // Shoulders (down 1)
    px(8, 13, 4, 2, P.gold),
    px(20, 13, 4, 2, P.gold),
    p1(9, 13, P.steelL),
    p1(21, 13, P.steelL),
    px(8, 15, 4, 1, P.steelD),
    px(20, 15, 4, 1, P.steelD),

    // Chest (down 1)
    px(12, 13, 8, 2, P.gold),
    px(12, 15, 8, 3, P.steelD),
    px(14, 13, 4, 2, P.steelL),
    p1(15, 15, P.gold),
    p1(16, 15, P.gold),
    p1(14, 16, P.gold),
    p1(17, 16, P.gold),

    // Belt (down 1)
    px(11, 18, 10, 1, P.leather),
    p1(16, 18, P.gold),

    // Tabard (down 1)
    px(12, 19, 3, 1, P.gold),
    px(17, 19, 3, 1, P.gold),

    // Legs (same)
    px(12, 20, 3, 4, P.steelD),
    px(17, 20, 3, 4, P.steelD),
    p1(13, 20, P.steel),
    p1(18, 20, P.steel),

    // Boots (same)
    px(11, 24, 4, 2, P.steelD),
    px(17, 24, 4, 2, P.steelD),
    px(11, 26, 5, 1, P.steelD),
    px(17, 26, 5, 1, P.steelD),

    // Shield (down 1)
    px(3, 11, 5, 10, P.gold),
    px(4, 10, 3, 12, P.gold),
    p1(4, 11, P.steelL),
    p1(4, 12, P.steelL),
    px(3, 15, 5, 1, P.steelD),
    px(5, 12, 1, 6, P.steelD),
    p1(5, 15, P.ember),
    p1(5, 14, P.flame),
    p1(5, 16, P.flame),
    p1(4, 15, P.flame),
    p1(6, 15, P.flame),

    // Sword (down 1)
    px(24, 9, 2, 1, P.gold),
    px(24, 10, 2, 2, P.leather),
    px(23, 12, 4, 1, P.gold),
    px(24, 13, 2, 6, P.steelL),
    px(24, 13, 1, 6, P.steel),
    p1(24, 19, P.steelL),
  ],
];
