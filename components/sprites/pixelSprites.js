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

// ============================================================
// ENEMY SPRITES — Cold palette only, NO ember/flame
// Enemies lack the forge-touch. Bosses get P.gold eyes only.
// ============================================================

/**
 * Goblin — Small, hunched, green-tinged, dagger
 * Greenwood Forest regular enemy
 * Colors: P.forest, P.steelD
 * 2 frames: subtle sway left/right
 */
export const goblin_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Head (small, round)
    px(14, 8, 4, 1, P.forest),        // head top
    px(13, 9, 6, 1, P.forest),        // head mid
    px(13, 10, 6, 1, P.forest),       // head lower
    p1(14, 9, P.eye),                 // left eye
    p1(17, 9, P.eye),                 // right eye
    px(15, 10, 2, 1, P.steelD),       // mouth

    // Ears (pointed)
    p1(12, 8, P.forest),              // left ear
    p1(19, 8, P.forest),              // right ear
    p1(11, 7, P.forest),              // left ear tip
    p1(20, 7, P.forest),              // right ear tip

    // Neck
    px(14, 11, 4, 1, P.forest),

    // Body (hunched, small)
    px(13, 12, 6, 2, P.steelD),       // torso upper
    px(12, 14, 8, 2, P.steelD),       // torso lower (hunched wider)
    px(14, 12, 2, 2, P.steel),        // chest highlight

    // Belt
    px(12, 16, 8, 1, P.leather),
    p1(16, 16, P.steelD),             // buckle

    // Arms (hunched forward)
    px(10, 13, 2, 3, P.forest),       // left arm
    px(20, 13, 2, 3, P.forest),       // right arm

    // Legs (short)
    px(13, 17, 3, 3, P.steelD),       // left leg
    px(17, 17, 3, 3, P.steelD),       // right leg

    // Feet
    px(12, 20, 4, 1, P.leather),      // left foot
    px(17, 20, 4, 1, P.leather),      // right foot

    // Dagger (right hand)
    p1(22, 12, P.steelD),             // handle
    p1(22, 11, P.steel),              // blade
    p1(22, 10, P.steelL),             // blade tip
  ],

  // ---- FRAME 1: Sway right ----
  [
    // Head (shifted right 1px)
    px(15, 8, 4, 1, P.forest),
    px(14, 9, 6, 1, P.forest),
    px(14, 10, 6, 1, P.forest),
    p1(15, 9, P.eye),
    p1(18, 9, P.eye),
    px(16, 10, 2, 1, P.steelD),

    // Ears
    p1(13, 8, P.forest),
    p1(20, 8, P.forest),
    p1(12, 7, P.forest),
    p1(21, 7, P.forest),

    // Neck
    px(15, 11, 4, 1, P.forest),

    // Body (shifted right 1px)
    px(14, 12, 6, 2, P.steelD),
    px(13, 14, 8, 2, P.steelD),
    px(15, 12, 2, 2, P.steel),

    // Belt
    px(13, 16, 8, 1, P.leather),
    p1(17, 16, P.steelD),

    // Arms
    px(11, 13, 2, 3, P.forest),
    px(21, 13, 2, 3, P.forest),

    // Legs (same position)
    px(13, 17, 3, 3, P.steelD),
    px(17, 17, 3, 3, P.steelD),

    // Feet
    px(12, 20, 4, 1, P.leather),
    px(17, 20, 4, 1, P.leather),

    // Dagger (shifted right 1px)
    p1(23, 12, P.steelD),
    p1(23, 11, P.steel),
    p1(23, 10, P.steelL),
  ],
];

/**
 * Wolf (Dire Wolf) — Low, prowling, grey
 * Greenwood Forest regular enemy
 * Colors: P.steelD, P.steel, P.eye
 * 2 frames: prowl sway (head bob)
 */
export const wolf_pixel = [
  // ---- FRAME 0: Base prowl ----
  [
    // Head
    px(6, 13, 4, 1, P.steel),         // snout top
    px(5, 14, 6, 2, P.steelD),        // head body
    px(5, 14, 2, 1, P.steel),         // snout
    p1(4, 14, P.steelD),              // nose
    p1(8, 14, P.eye),                 // eye
    p1(4, 15, P.danger),              // open mouth hint

    // Ears
    p1(7, 12, P.steelD),              // left ear
    p1(9, 12, P.steelD),              // right ear
    p1(7, 11, P.steel),               // left ear tip
    p1(9, 11, P.steel),               // right ear tip

    // Neck
    px(10, 14, 3, 2, P.steelD),       // neck

    // Body (long, low)
    px(13, 13, 10, 1, P.steel),       // back highlight
    px(12, 14, 12, 3, P.steelD),      // body main
    px(14, 14, 6, 1, P.steel),        // back sheen
    px(13, 17, 8, 1, P.steelD),       // belly

    // Tail
    px(24, 12, 2, 1, P.steelD),       // tail base
    px(25, 11, 2, 1, P.steel),        // tail mid
    p1(27, 10, P.steel),              // tail tip

    // Front legs
    px(13, 17, 2, 4, P.steelD),       // front left leg
    px(16, 17, 2, 4, P.steelD),       // front right leg
    px(13, 21, 2, 1, P.steel),        // front left paw
    px(16, 21, 2, 1, P.steel),        // front right paw

    // Back legs
    px(20, 17, 2, 4, P.steelD),       // back left leg
    px(23, 17, 2, 3, P.steelD),       // back right leg
    px(20, 21, 2, 1, P.steel),        // back left paw
    px(23, 20, 2, 1, P.steel),        // back right paw
  ],

  // ---- FRAME 1: Head lower (prowl bob) ----
  [
    // Head (down 1px)
    px(6, 14, 4, 1, P.steel),
    px(5, 15, 6, 2, P.steelD),
    px(5, 15, 2, 1, P.steel),
    p1(4, 15, P.steelD),
    p1(8, 15, P.eye),
    p1(4, 16, P.danger),

    // Ears (down 1px)
    p1(7, 13, P.steelD),
    p1(9, 13, P.steelD),
    p1(7, 12, P.steel),
    p1(9, 12, P.steel),

    // Neck
    px(10, 15, 3, 2, P.steelD),

    // Body (same)
    px(13, 13, 10, 1, P.steel),
    px(12, 14, 12, 3, P.steelD),
    px(14, 14, 6, 1, P.steel),
    px(13, 17, 8, 1, P.steelD),

    // Tail (up 1px — counterbalance)
    px(24, 11, 2, 1, P.steelD),
    px(25, 10, 2, 1, P.steel),
    p1(27, 9, P.steel),

    // Front legs (same)
    px(13, 17, 2, 4, P.steelD),
    px(16, 17, 2, 4, P.steelD),
    px(13, 21, 2, 1, P.steel),
    px(16, 21, 2, 1, P.steel),

    // Back legs (same)
    px(20, 17, 2, 4, P.steelD),
    px(23, 17, 2, 3, P.steelD),
    px(20, 21, 2, 1, P.steel),
    px(23, 20, 2, 1, P.steel),
  ],
];

/**
 * Forest Spider — Wide, dark, 4 visible legs per side
 * Greenwood Forest regular enemy
 * Colors: P.steelD, P.danger, P.eye
 * 2 frames: leg twitch sway
 */
export const forest_spider_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Body (wide, low)
    px(12, 13, 8, 2, P.steelD),       // abdomen
    px(11, 15, 10, 3, P.steelD),      // thorax (wider)
    px(13, 14, 6, 1, P.steel),        // abdomen highlight
    px(13, 16, 4, 1, P.steel),        // thorax highlight

    // Eyes (multiple, menacing)
    p1(13, 13, P.danger),             // eye left outer
    p1(14, 12, P.eye),                // eye left inner
    p1(17, 12, P.eye),                // eye right inner
    p1(18, 13, P.danger),             // eye right outer

    // Fangs
    p1(14, 18, P.steelD),             // left fang
    p1(17, 18, P.steelD),             // right fang

    // Legs — left side (4 legs)
    px(8, 14, 3, 1, P.steelD),        // leg 1
    p1(7, 13, P.steelD),              // leg 1 end
    px(7, 16, 4, 1, P.steelD),        // leg 2
    p1(6, 15, P.steelD),              // leg 2 end
    px(7, 17, 4, 1, P.steelD),        // leg 3
    p1(6, 18, P.steelD),              // leg 3 end
    px(9, 18, 2, 1, P.steelD),        // leg 4
    p1(8, 19, P.steelD),              // leg 4 end

    // Legs — right side (4 legs)
    px(21, 14, 3, 1, P.steelD),       // leg 1
    p1(24, 13, P.steelD),             // leg 1 end
    px(21, 16, 4, 1, P.steelD),       // leg 2
    p1(25, 15, P.steelD),             // leg 2 end
    px(21, 17, 4, 1, P.steelD),       // leg 3
    p1(25, 18, P.steelD),             // leg 3 end
    px(21, 18, 2, 1, P.steelD),       // leg 4
    p1(23, 19, P.steelD),             // leg 4 end

    // Danger markings on abdomen
    p1(14, 14, P.danger),             // marking left
    p1(17, 14, P.danger),             // marking right
    p1(15, 13, P.danger),             // marking center top
  ],

  // ---- FRAME 1: Legs twitch outward ----
  [
    // Body (same)
    px(12, 13, 8, 2, P.steelD),
    px(11, 15, 10, 3, P.steelD),
    px(13, 14, 6, 1, P.steel),
    px(13, 16, 4, 1, P.steel),

    // Eyes
    p1(13, 13, P.danger),
    p1(14, 12, P.eye),
    p1(17, 12, P.eye),
    p1(18, 13, P.danger),

    // Fangs
    p1(14, 18, P.steelD),
    p1(17, 18, P.steelD),

    // Legs — left side (spread wider by 1px)
    px(7, 14, 4, 1, P.steelD),
    p1(6, 13, P.steelD),
    px(6, 16, 5, 1, P.steelD),
    p1(5, 15, P.steelD),
    px(6, 17, 5, 1, P.steelD),
    p1(5, 18, P.steelD),
    px(8, 18, 3, 1, P.steelD),
    p1(7, 19, P.steelD),

    // Legs — right side (spread wider by 1px)
    px(21, 14, 4, 1, P.steelD),
    p1(25, 13, P.steelD),
    px(21, 16, 5, 1, P.steelD),
    p1(26, 15, P.steelD),
    px(21, 17, 5, 1, P.steelD),
    p1(26, 18, P.steelD),
    px(21, 18, 3, 1, P.steelD),
    p1(24, 19, P.steelD),

    // Danger markings
    p1(14, 14, P.danger),
    p1(17, 14, P.danger),
    p1(15, 13, P.danger),
  ],
];

/**
 * Treant Elder (BOSS) — Large gnarled tree-being, golden eyes
 * Greenwood Forest boss
 * Colors: P.leather, P.forest, P.gold (eyes only)
 * 2 frames: slow sway, branches shift
 */
export const treant_elder_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Crown / canopy (wide, fills upper area)
    px(8, 2, 16, 2, P.forest),        // canopy top
    px(6, 4, 20, 2, P.forest),        // canopy mid (wide)
    px(7, 6, 18, 1, P.forest),        // canopy lower
    p1(10, 3, P.steelD),              // shadow in canopy
    p1(20, 3, P.steelD),              // shadow in canopy
    p1(12, 5, P.steelD),              // shadow detail
    p1(18, 5, P.steelD),              // shadow detail

    // Face (in trunk)
    px(12, 7, 8, 1, P.leather),       // brow ridge
    p1(13, 8, P.gold),                // left eye (BOSS golden)
    p1(18, 8, P.gold),                // right eye (BOSS golden)
    p1(12, 8, P.leather),             // left brow
    p1(19, 8, P.leather),             // right brow
    px(14, 9, 4, 1, P.steelD),        // mouth/hollow
    p1(15, 10, P.steelD),             // mouth lower

    // Trunk (main body — gnarled)
    px(11, 7, 10, 3, P.leather),      // upper trunk
    px(10, 10, 12, 4, P.leather),     // mid trunk (wider, gnarled)
    px(11, 14, 10, 4, P.leather),     // lower trunk
    px(13, 10, 6, 2, P.steelD),       // bark shadow center
    p1(11, 12, P.steelD),             // knot left
    p1(20, 12, P.steelD),             // knot right
    p1(13, 15, P.steelD),             // bark line
    p1(18, 15, P.steelD),             // bark line

    // Branch arms
    px(5, 8, 6, 2, P.leather),        // left branch arm
    px(3, 7, 3, 1, P.leather),        // left branch tip
    p1(3, 6, P.forest),               // left leaf tuft
    p1(4, 6, P.forest),
    px(21, 8, 6, 2, P.leather),       // right branch arm
    px(26, 7, 3, 1, P.leather),       // right branch tip
    p1(27, 6, P.forest),              // right leaf tuft
    p1(28, 6, P.forest),

    // Roots (feet)
    px(9, 18, 4, 2, P.leather),       // left root
    px(19, 18, 4, 2, P.leather),      // right root
    px(8, 20, 6, 2, P.leather),       // left root spread
    px(18, 20, 6, 2, P.leather),      // right root spread
    px(7, 22, 3, 1, P.leather),       // left root tip
    px(22, 22, 3, 1, P.leather),      // right root tip
    p1(14, 18, P.leather),            // center root
    p1(17, 18, P.leather),            // center root
    px(13, 19, 6, 1, P.leather),      // center root base

    // Moss/lichen accents
    p1(10, 11, P.forest),             // moss on bark
    p1(21, 11, P.forest),             // moss on bark
    p1(12, 16, P.forest),             // moss lower
    p1(19, 16, P.forest),             // moss lower
  ],

  // ---- FRAME 1: Sway left, branches shift ----
  [
    // Crown (shifted left 1px)
    px(7, 2, 16, 2, P.forest),
    px(5, 4, 20, 2, P.forest),
    px(6, 6, 18, 1, P.forest),
    p1(9, 3, P.steelD),
    p1(19, 3, P.steelD),
    p1(11, 5, P.steelD),
    p1(17, 5, P.steelD),

    // Face (shifted left 1px)
    px(11, 7, 8, 1, P.leather),
    p1(12, 8, P.gold),                // BOSS golden eye
    p1(17, 8, P.gold),                // BOSS golden eye
    p1(11, 8, P.leather),
    p1(18, 8, P.leather),
    px(13, 9, 4, 1, P.steelD),
    p1(14, 10, P.steelD),

    // Trunk (shifted left 1px)
    px(10, 7, 10, 3, P.leather),
    px(9, 10, 12, 4, P.leather),
    px(10, 14, 10, 4, P.leather),
    px(12, 10, 6, 2, P.steelD),
    p1(10, 12, P.steelD),
    p1(19, 12, P.steelD),
    p1(12, 15, P.steelD),
    p1(17, 15, P.steelD),

    // Branch arms (sway)
    px(4, 9, 6, 2, P.leather),        // left branch lower
    px(2, 8, 3, 1, P.leather),
    p1(2, 7, P.forest),
    p1(3, 7, P.forest),
    px(21, 7, 6, 2, P.leather),       // right branch higher
    px(26, 6, 3, 1, P.leather),
    p1(27, 5, P.forest),
    p1(28, 5, P.forest),

    // Roots (same — rooted)
    px(9, 18, 4, 2, P.leather),
    px(19, 18, 4, 2, P.leather),
    px(8, 20, 6, 2, P.leather),
    px(18, 20, 6, 2, P.leather),
    px(7, 22, 3, 1, P.leather),
    px(22, 22, 3, 1, P.leather),
    p1(14, 18, P.leather),
    p1(17, 18, P.leather),
    px(13, 19, 6, 1, P.leather),

    // Moss
    p1(9, 11, P.forest),
    p1(20, 11, P.forest),
    p1(11, 16, P.forest),
    p1(18, 16, P.forest),
  ],
];

/**
 * Mountain Goat — Stocky, horned, grey-white
 * Stormridge Mountains regular enemy
 * Colors: P.steelL, P.steel, P.steelD
 * 2 frames: head bob
 */
export const mountain_goat_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Horns (curved)
    p1(8, 8, P.steelL),               // left horn tip
    p1(9, 9, P.steelL),               // left horn
    p1(19, 8, P.steelL),              // right horn tip
    p1(18, 9, P.steelL),              // right horn

    // Head
    px(10, 10, 8, 2, P.steelL),       // head top
    px(11, 12, 6, 1, P.steelL),       // head lower
    p1(12, 11, P.eye),                // left eye
    p1(15, 11, P.eye),                // right eye
    px(13, 12, 2, 1, P.steel),        // nose

    // Beard
    p1(13, 13, P.steelL),             // beard
    p1(14, 13, P.steelL),
    p1(13, 14, P.steel),              // beard tip

    // Neck
    px(12, 13, 4, 1, P.steel),

    // Body (stocky, wide)
    px(9, 14, 12, 2, P.steel),        // body top
    px(8, 16, 14, 3, P.steelD),       // body main
    px(10, 16, 8, 1, P.steel),        // back highlight
    px(9, 19, 12, 1, P.steelD),       // belly

    // Front legs
    px(10, 20, 2, 4, P.steelD),       // front left leg
    px(14, 20, 2, 4, P.steelD),       // front right leg
    px(10, 24, 2, 1, P.steelL),       // front left hoof
    px(14, 24, 2, 1, P.steelL),       // front right hoof

    // Back legs
    px(18, 20, 2, 4, P.steelD),       // back left leg
    px(21, 20, 2, 3, P.steelD),       // back right leg
    px(18, 24, 2, 1, P.steelL),       // back left hoof
    px(21, 23, 2, 1, P.steelL),       // back right hoof

    // Tail
    p1(22, 15, P.steel),              // tail
    p1(23, 14, P.steelL),             // tail tip
  ],

  // ---- FRAME 1: Head down (charging stance) ----
  [
    // Horns (lower, more forward)
    p1(7, 10, P.steelL),
    p1(8, 11, P.steelL),
    p1(20, 10, P.steelL),
    p1(19, 11, P.steelL),

    // Head (down 1px, forward)
    px(10, 11, 8, 2, P.steelL),
    px(11, 13, 6, 1, P.steelL),
    p1(12, 12, P.eye),
    p1(15, 12, P.eye),
    px(13, 13, 2, 1, P.steel),

    // Beard
    p1(13, 14, P.steelL),
    p1(14, 14, P.steelL),
    p1(13, 15, P.steel),

    // Neck (angled down)
    px(12, 14, 4, 1, P.steel),

    // Body (same)
    px(9, 14, 12, 2, P.steel),
    px(8, 16, 14, 3, P.steelD),
    px(10, 16, 8, 1, P.steel),
    px(9, 19, 12, 1, P.steelD),

    // Front legs (same)
    px(10, 20, 2, 4, P.steelD),
    px(14, 20, 2, 4, P.steelD),
    px(10, 24, 2, 1, P.steelL),
    px(14, 24, 2, 1, P.steelL),

    // Back legs
    px(18, 20, 2, 4, P.steelD),
    px(21, 20, 2, 3, P.steelD),
    px(18, 24, 2, 1, P.steelL),
    px(21, 23, 2, 1, P.steelL),

    // Tail (up)
    p1(22, 14, P.steel),
    p1(23, 13, P.steelL),
  ],
];

/**
 * Rock Golem — Blocky, heavy, stone-colored
 * Stormridge Mountains regular enemy
 * Colors: P.steelD, P.steel, P.steelL
 * 2 frames: slow sway
 */
export const rock_golem_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Head (blocky, angular)
    px(12, 6, 8, 3, P.steelD),        // head block
    px(13, 6, 6, 1, P.steel),         // head top highlight
    p1(13, 8, P.eye),                 // left eye
    p1(18, 8, P.eye),                 // right eye
    px(14, 9, 4, 1, P.steelD),        // jaw line

    // Neck (thick)
    px(13, 9, 6, 1, P.steel),

    // Shoulders (massive, blocky)
    px(6, 10, 8, 3, P.steelD),        // left shoulder block
    px(18, 10, 8, 3, P.steelD),       // right shoulder block
    px(7, 10, 4, 1, P.steelL),        // left shoulder highlight
    px(19, 10, 4, 1, P.steelL),       // right shoulder highlight

    // Torso (wide, blocky)
    px(10, 10, 12, 5, P.steel),       // chest
    px(11, 10, 4, 2, P.steelL),       // chest highlight left
    px(17, 10, 4, 2, P.steelL),       // chest highlight right
    px(10, 15, 12, 3, P.steelD),      // lower torso

    // Cracks/detail
    p1(12, 12, P.steelD),             // crack
    p1(19, 13, P.steelD),             // crack
    p1(15, 16, P.steelL),             // stone vein

    // Arms (thick, blocky)
    px(5, 13, 5, 5, P.steelD),        // left arm
    px(6, 14, 2, 2, P.steel),         // left arm detail
    px(22, 13, 5, 5, P.steelD),       // right arm
    px(23, 14, 2, 2, P.steel),        // right arm detail

    // Fists
    px(5, 18, 4, 2, P.steel),         // left fist
    px(23, 18, 4, 2, P.steel),        // right fist

    // Legs (thick columns)
    px(11, 18, 4, 5, P.steelD),       // left leg
    px(17, 18, 4, 5, P.steelD),       // right leg
    p1(12, 19, P.steel),              // left leg highlight
    p1(18, 19, P.steel),              // right leg highlight

    // Feet (wide, flat)
    px(10, 23, 6, 2, P.steel),        // left foot
    px(16, 23, 6, 2, P.steel),        // right foot
  ],

  // ---- FRAME 1: Sway right, arms shift ----
  [
    // Head (shifted right 1px)
    px(13, 6, 8, 3, P.steelD),
    px(14, 6, 6, 1, P.steel),
    p1(14, 8, P.eye),
    p1(19, 8, P.eye),
    px(15, 9, 4, 1, P.steelD),

    // Neck
    px(14, 9, 6, 1, P.steel),

    // Shoulders (shifted)
    px(7, 10, 8, 3, P.steelD),
    px(19, 10, 8, 3, P.steelD),
    px(8, 10, 4, 1, P.steelL),
    px(20, 10, 4, 1, P.steelL),

    // Torso
    px(11, 10, 12, 5, P.steel),
    px(12, 10, 4, 2, P.steelL),
    px(18, 10, 4, 2, P.steelL),
    px(11, 15, 12, 3, P.steelD),

    // Cracks
    p1(13, 12, P.steelD),
    p1(20, 13, P.steelD),
    p1(16, 16, P.steelL),

    // Arms (shifted)
    px(6, 13, 5, 5, P.steelD),
    px(7, 14, 2, 2, P.steel),
    px(23, 13, 5, 5, P.steelD),
    px(24, 14, 2, 2, P.steel),

    // Fists (shifted)
    px(6, 18, 4, 2, P.steel),
    px(24, 18, 4, 2, P.steel),

    // Legs (same — heavy, grounded)
    px(11, 18, 4, 5, P.steelD),
    px(17, 18, 4, 5, P.steelD),
    p1(12, 19, P.steel),
    p1(18, 19, P.steel),

    // Feet (same)
    px(10, 23, 6, 2, P.steel),
    px(16, 23, 6, 2, P.steel),
  ],
];

/**
 * Harpy — Winged, angular, threatening
 * Stormridge Mountains regular enemy
 * Colors: P.steelD, P.arcane, P.steelL
 * 2 frames: wing flap
 */
export const harpy_pixel = [
  // ---- FRAME 0: Wings up ----
  [
    // Head (angular, bird-like)
    px(14, 6, 4, 1, P.steelL),        // head top
    px(13, 7, 6, 2, P.steelD),        // head body
    p1(14, 7, P.eye),                 // left eye
    p1(17, 7, P.eye),                 // right eye
    px(12, 8, 2, 1, P.steelD),        // beak
    p1(11, 8, P.steel),               // beak tip

    // Hair/crest
    p1(15, 5, P.arcane),              // crest
    p1(16, 5, P.arcane),
    p1(17, 6, P.arcane),

    // Neck
    px(14, 9, 4, 1, P.steelD),

    // Body (narrow, angular)
    px(13, 10, 6, 3, P.steelD),       // torso
    px(14, 10, 4, 1, P.steel),        // chest highlight
    px(13, 13, 6, 2, P.steelD),       // lower body
    p1(14, 11, P.arcane),             // arcane marking
    p1(17, 11, P.arcane),             // arcane marking

    // Wings — left (raised)
    px(6, 4, 7, 2, P.steelD),         // wing upper
    px(4, 6, 9, 1, P.steelD),         // wing mid
    px(5, 7, 8, 1, P.steel),          // wing lower edge
    p1(4, 5, P.arcane),               // wing tip accent
    p1(5, 5, P.arcane),
    p1(6, 3, P.steelL),               // wing highlight

    // Wings — right (raised)
    px(19, 4, 7, 2, P.steelD),
    px(19, 6, 9, 1, P.steelD),
    px(19, 7, 8, 1, P.steel),
    p1(27, 5, P.arcane),
    p1(26, 5, P.arcane),
    p1(25, 3, P.steelL),

    // Talons/legs
    px(13, 15, 2, 4, P.steelD),       // left leg
    px(17, 15, 2, 4, P.steelD),       // right leg
    px(12, 19, 3, 1, P.steel),        // left talons
    px(17, 19, 3, 1, P.steel),        // right talons
    p1(12, 20, P.steelL),             // talon tip
    p1(14, 20, P.steelL),             // talon tip
    p1(17, 20, P.steelL),             // talon tip
    p1(19, 20, P.steelL),             // talon tip
  ],

  // ---- FRAME 1: Wings down ----
  [
    // Head (same)
    px(14, 6, 4, 1, P.steelL),
    px(13, 7, 6, 2, P.steelD),
    p1(14, 7, P.eye),
    p1(17, 7, P.eye),
    px(12, 8, 2, 1, P.steelD),
    p1(11, 8, P.steel),

    // Hair/crest
    p1(15, 5, P.arcane),
    p1(16, 5, P.arcane),
    p1(17, 6, P.arcane),

    // Neck
    px(14, 9, 4, 1, P.steelD),

    // Body (same)
    px(13, 10, 6, 3, P.steelD),
    px(14, 10, 4, 1, P.steel),
    px(13, 13, 6, 2, P.steelD),
    p1(14, 11, P.arcane),
    p1(17, 11, P.arcane),

    // Wings — left (lowered)
    px(6, 8, 7, 2, P.steelD),         // wing upper (lower)
    px(4, 10, 9, 1, P.steelD),        // wing mid
    px(5, 11, 8, 1, P.steel),         // wing lower edge
    p1(4, 9, P.arcane),               // wing tip accent
    p1(5, 9, P.arcane),
    p1(6, 7, P.steelL),               // wing highlight

    // Wings — right (lowered)
    px(19, 8, 7, 2, P.steelD),
    px(19, 10, 9, 1, P.steelD),
    px(19, 11, 8, 1, P.steel),
    p1(27, 9, P.arcane),
    p1(26, 9, P.arcane),
    p1(25, 7, P.steelL),

    // Talons (same)
    px(13, 15, 2, 4, P.steelD),
    px(17, 15, 2, 4, P.steelD),
    px(12, 19, 3, 1, P.steel),
    px(17, 19, 3, 1, P.steel),
    p1(12, 20, P.steelL),
    p1(14, 20, P.steelL),
    p1(17, 20, P.steelL),
    p1(19, 20, P.steelL),
  ],
];

/**
 * Stone Colossus (BOSS) — Massive blocky presence, golden eyes
 * Stormridge Mountains boss
 * Colors: P.steelD, P.steel, P.gold (eyes only)
 * 2 frames: slow menacing sway
 */
export const stone_colossus_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Head (massive, angular)
    px(10, 2, 12, 2, P.steelD),       // head top
    px(9, 4, 14, 3, P.steel),         // head main
    px(10, 4, 4, 1, P.steelL),        // head highlight
    p1(12, 5, P.gold),                // left eye (BOSS golden)
    p1(19, 5, P.gold),                // right eye (BOSS golden)
    p1(12, 6, P.gold),                // left eye glow
    p1(19, 6, P.gold),                // right eye glow
    px(14, 6, 4, 1, P.steelD),        // mouth slit

    // Neck (thick pillar)
    px(12, 7, 8, 1, P.steelD),

    // Shoulders (enormous, extending to edges)
    px(2, 8, 10, 3, P.steelD),        // left shoulder
    px(20, 8, 10, 3, P.steelD),       // right shoulder
    px(3, 8, 4, 1, P.steelL),         // left shoulder highlight
    px(21, 8, 4, 1, P.steelL),        // right shoulder highlight
    px(4, 9, 3, 1, P.steel),          // left shoulder detail
    px(23, 9, 3, 1, P.steel),         // right shoulder detail

    // Torso (massive, fills center)
    px(8, 8, 16, 5, P.steel),         // chest
    px(10, 8, 6, 2, P.steelL),        // chest plate left
    px(16, 8, 6, 2, P.steelL),        // chest plate right
    px(8, 13, 16, 5, P.steelD),       // lower torso
    px(12, 14, 8, 2, P.steel),        // core detail

    // Cracks and stone texture
    p1(10, 10, P.steelD),             // crack
    p1(11, 11, P.steelD),             // crack
    p1(20, 10, P.steelD),             // crack
    p1(14, 15, P.steelL),             // stone vein
    p1(18, 16, P.steelL),             // stone vein

    // Arms (massive pillars)
    px(2, 11, 6, 8, P.steelD),        // left arm
    px(3, 12, 3, 4, P.steel),         // left arm highlight
    px(24, 11, 6, 8, P.steelD),       // right arm
    px(25, 12, 3, 4, P.steel),        // right arm highlight

    // Fists (huge)
    px(1, 19, 7, 3, P.steel),         // left fist
    px(2, 19, 3, 1, P.steelL),        // left fist highlight
    px(24, 19, 7, 3, P.steel),        // right fist
    px(25, 19, 3, 1, P.steelL),       // right fist highlight

    // Legs (thick columns)
    px(9, 18, 5, 5, P.steelD),        // left leg
    px(18, 18, 5, 5, P.steelD),       // right leg
    p1(10, 19, P.steel),              // left leg highlight
    p1(19, 19, P.steel),              // right leg highlight

    // Feet (wide, heavy)
    px(7, 23, 8, 3, P.steel),         // left foot
    px(17, 23, 8, 3, P.steel),        // right foot
    px(8, 23, 4, 1, P.steelL),        // left foot highlight
    px(18, 23, 4, 1, P.steelL),       // right foot highlight
  ],

  // ---- FRAME 1: Lean right, fists shift ----
  [
    // Head (shifted right 1px)
    px(11, 2, 12, 2, P.steelD),
    px(10, 4, 14, 3, P.steel),
    px(11, 4, 4, 1, P.steelL),
    p1(13, 5, P.gold),                // BOSS golden eye
    p1(20, 5, P.gold),                // BOSS golden eye
    p1(13, 6, P.gold),                // eye glow
    p1(20, 6, P.gold),                // eye glow
    px(15, 6, 4, 1, P.steelD),

    // Neck
    px(13, 7, 8, 1, P.steelD),

    // Shoulders (shifted)
    px(3, 8, 10, 3, P.steelD),
    px(21, 8, 9, 3, P.steelD),
    px(4, 8, 4, 1, P.steelL),
    px(22, 8, 4, 1, P.steelL),
    px(5, 9, 3, 1, P.steel),
    px(24, 9, 3, 1, P.steel),

    // Torso (shifted right 1px)
    px(9, 8, 16, 5, P.steel),
    px(11, 8, 6, 2, P.steelL),
    px(17, 8, 6, 2, P.steelL),
    px(9, 13, 16, 5, P.steelD),
    px(13, 14, 8, 2, P.steel),

    // Cracks
    p1(11, 10, P.steelD),
    p1(12, 11, P.steelD),
    p1(21, 10, P.steelD),
    p1(15, 15, P.steelL),
    p1(19, 16, P.steelL),

    // Arms (right arm raised slightly)
    px(3, 11, 6, 8, P.steelD),
    px(4, 12, 3, 4, P.steel),
    px(25, 10, 6, 8, P.steelD),       // right arm raised 1px
    px(26, 11, 3, 4, P.steel),

    // Fists
    px(2, 19, 7, 3, P.steel),
    px(3, 19, 3, 1, P.steelL),
    px(25, 18, 7, 3, P.steel),        // right fist raised 1px
    px(26, 18, 3, 1, P.steelL),

    // Legs (same — grounded)
    px(9, 18, 5, 5, P.steelD),
    px(18, 18, 5, 5, P.steelD),
    p1(10, 19, P.steel),
    p1(19, 19, P.steel),

    // Feet (same)
    px(7, 23, 8, 3, P.steel),
    px(17, 23, 8, 3, P.steel),
    px(8, 23, 4, 1, P.steelL),
    px(18, 23, 4, 1, P.steelL),
  ],
];

// ============================================================
// ENEMY PIXEL SPRITES — Dragon's Reach
// ============================================================

/**
 * Fire Imp — Small, fiery, mischievous
 * Colors: P.danger (body), P.steelD (dark accents), P.ember (flame details)
 * 2 idle frames (flickering)
 */
export const fire_imp_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Horns
    p1(12, 4, P.steelD),
    p1(19, 4, P.steelD),
    p1(12, 3, P.steelD),
    p1(19, 3, P.steelD),

    // Head
    px(13, 5, 6, 3, P.danger),
    p1(14, 6, P.eye),
    p1(17, 6, P.eye),
    p1(14, 6, P.ember),
    p1(17, 6, P.ember),
    px(14, 7, 4, 1, P.steelD),

    // Body
    px(13, 8, 6, 2, P.danger),
    px(12, 10, 8, 4, P.danger),
    p1(15, 11, P.ember),
    p1(16, 11, P.ember),

    // Arms
    px(10, 10, 2, 4, P.danger),
    px(20, 10, 2, 4, P.danger),
    p1(10, 14, P.steelD),
    p1(21, 14, P.steelD),

    // Legs
    px(12, 14, 3, 4, P.danger),
    px(17, 14, 3, 4, P.danger),
    p1(13, 14, P.steelD),
    p1(18, 14, P.steelD),

    // Feet
    px(11, 18, 4, 1, P.steelD),
    px(17, 18, 4, 1, P.steelD),

    // Tail
    px(18, 13, 2, 1, P.danger),
    px(20, 14, 2, 1, P.danger),
    p1(22, 15, P.ember),

    // Flame aura
    p1(11, 5, P.ember),
    p1(20, 5, P.ember),
    p1(15, 4, P.flame),
  ],

  // ---- FRAME 1: Flicker ----
  [
    // Horns
    p1(12, 4, P.steelD),
    p1(19, 4, P.steelD),
    p1(12, 3, P.steelD),
    p1(19, 3, P.steelD),

    // Head (up 1)
    px(13, 4, 6, 3, P.danger),
    p1(14, 5, P.eye),
    p1(17, 5, P.eye),
    p1(14, 5, P.ember),
    p1(17, 5, P.ember),
    px(14, 6, 4, 1, P.steelD),

    // Body (up 1)
    px(13, 7, 6, 2, P.danger),
    px(12, 9, 8, 4, P.danger),
    p1(15, 10, P.ember),
    p1(16, 10, P.ember),

    // Arms
    px(10, 9, 2, 4, P.danger),
    px(20, 9, 2, 4, P.danger),
    p1(10, 13, P.steelD),
    p1(21, 13, P.steelD),

    // Legs
    px(12, 13, 3, 5, P.danger),
    px(17, 13, 3, 5, P.danger),
    p1(13, 13, P.steelD),
    p1(18, 13, P.steelD),

    // Feet
    px(11, 18, 4, 1, P.steelD),
    px(17, 18, 4, 1, P.steelD),

    // Tail
    px(18, 12, 2, 1, P.danger),
    px(20, 13, 2, 1, P.danger),
    p1(22, 14, P.ember),

    // Flame aura (shifted for flicker)
    p1(12, 4, P.ember),
    p1(19, 4, P.ember),
    p1(16, 3, P.flame),
    p1(14, 3, P.flame),
  ],
];

/**
 * Drake — Winged reptilian, dark and menacing
 * Colors: P.steelD (body), P.danger (accents/claws), P.steel (highlights)
 * 2 idle frames (menacing sway)
 */
export const drake_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Head
    px(14, 4, 5, 1, P.steelD),
    px(13, 5, 7, 2, P.steelD),
    px(12, 7, 8, 1, P.steelD),
    p1(14, 6, P.danger),
    p1(18, 6, P.danger),
    px(11, 8, 3, 1, P.steelD),
    px(18, 8, 3, 1, P.steelD),
    p1(11, 8, P.danger),
    p1(20, 8, P.danger),
    px(14, 3, 2, 1, P.steel),
    px(17, 3, 2, 1, P.steel),
    p1(15, 2, P.steel),
    p1(17, 2, P.steel),

    // Neck
    px(14, 9, 4, 2, P.steelD),
    p1(15, 9, P.steel),

    // Wings (left)
    px(4, 8, 3, 1, P.steelD),
    px(5, 9, 4, 1, P.steelD),
    px(7, 10, 5, 1, P.steelD),
    px(8, 11, 4, 1, P.steelD),
    px(9, 12, 3, 1, P.steel),
    p1(4, 8, P.steel),

    // Wings (right)
    px(25, 8, 3, 1, P.steelD),
    px(23, 9, 4, 1, P.steelD),
    px(20, 10, 5, 1, P.steelD),
    px(20, 11, 4, 1, P.steelD),
    px(20, 12, 3, 1, P.steel),
    p1(27, 8, P.steel),

    // Body
    px(12, 11, 8, 3, P.steelD),
    px(11, 14, 10, 3, P.steelD),
    px(12, 17, 8, 2, P.steelD),
    px(13, 11, 6, 2, P.steel),
    p1(14, 14, P.steel),
    p1(17, 14, P.steel),

    // Legs
    px(11, 19, 3, 3, P.steelD),
    px(18, 19, 3, 3, P.steelD),
    p1(12, 19, P.steel),
    p1(19, 19, P.steel),

    // Claws
    px(10, 22, 4, 1, P.danger),
    px(18, 22, 4, 1, P.danger),

    // Tail
    px(13, 19, 2, 1, P.steelD),
    px(12, 20, 2, 1, P.steelD),
    px(11, 21, 2, 1, P.steelD),
    px(10, 22, 2, 1, P.steelD),
    p1(9, 23, P.danger),
  ],

  // ---- FRAME 1: Sway right ----
  [
    // Head (shifted right 1)
    px(15, 4, 5, 1, P.steelD),
    px(14, 5, 7, 2, P.steelD),
    px(13, 7, 8, 1, P.steelD),
    p1(15, 6, P.danger),
    p1(19, 6, P.danger),
    px(12, 8, 3, 1, P.steelD),
    px(19, 8, 3, 1, P.steelD),
    p1(12, 8, P.danger),
    p1(21, 8, P.danger),
    px(15, 3, 2, 1, P.steel),
    px(18, 3, 2, 1, P.steel),
    p1(16, 2, P.steel),
    p1(18, 2, P.steel),

    // Neck
    px(15, 9, 4, 2, P.steelD),
    p1(16, 9, P.steel),

    // Wings (left, slightly raised)
    px(4, 7, 3, 1, P.steelD),
    px(5, 8, 4, 1, P.steelD),
    px(7, 9, 5, 1, P.steelD),
    px(8, 10, 4, 1, P.steelD),
    px(9, 11, 3, 1, P.steel),
    p1(4, 7, P.steel),

    // Wings (right, slightly raised)
    px(25, 7, 3, 1, P.steelD),
    px(23, 8, 4, 1, P.steelD),
    px(20, 9, 5, 1, P.steelD),
    px(20, 10, 4, 1, P.steelD),
    px(20, 11, 3, 1, P.steel),
    p1(27, 7, P.steel),

    // Body
    px(12, 11, 8, 3, P.steelD),
    px(11, 14, 10, 3, P.steelD),
    px(12, 17, 8, 2, P.steelD),
    px(13, 11, 6, 2, P.steel),
    p1(14, 14, P.steel),
    p1(17, 14, P.steel),

    // Legs
    px(11, 19, 3, 3, P.steelD),
    px(18, 19, 3, 3, P.steelD),
    p1(12, 19, P.steel),
    p1(19, 19, P.steel),

    // Claws
    px(10, 22, 4, 1, P.danger),
    px(18, 22, 4, 1, P.danger),

    // Tail (sway right)
    px(14, 19, 2, 1, P.steelD),
    px(15, 20, 2, 1, P.steelD),
    px(16, 21, 2, 1, P.steelD),
    px(17, 22, 2, 1, P.steelD),
    p1(18, 23, P.danger),
  ],
];

/**
 * Lava Serpent — Sinuous, fiery cracks on dark body
 * Colors: P.steelD (body), P.danger (cracks, NOT ember), P.eye (dark accents)
 * 2 idle frames (slithering sway)
 */
export const lava_serpent_pixel = [
  // ---- FRAME 0: S-curve left ----
  [
    // Head
    px(12, 3, 6, 2, P.steelD),
    px(11, 5, 8, 2, P.steelD),
    p1(13, 4, P.danger),
    p1(16, 4, P.danger),
    p1(11, 6, P.eye),
    p1(18, 6, P.eye),
    px(13, 3, 4, 1, P.eye),

    // Neck curve
    px(13, 7, 4, 2, P.steelD),
    px(12, 9, 3, 2, P.steelD),
    p1(13, 8, P.danger),

    // Body curve left
    px(10, 11, 4, 2, P.steelD),
    px(9, 13, 4, 2, P.steelD),
    px(10, 15, 4, 2, P.steelD),
    p1(11, 12, P.danger),
    p1(10, 14, P.danger),

    // Body curve right
    px(13, 17, 4, 2, P.steelD),
    px(15, 19, 4, 2, P.steelD),
    px(17, 21, 4, 2, P.steelD),
    p1(14, 18, P.danger),
    p1(16, 20, P.danger),
    p1(18, 22, P.danger),

    // Tail
    px(19, 23, 3, 1, P.steelD),
    px(21, 24, 2, 1, P.steelD),
    p1(22, 25, P.eye),

    // Underbelly highlights
    p1(12, 8, P.steel),
    p1(11, 12, P.steel),
    p1(14, 18, P.steel),
  ],

  // ---- FRAME 1: S-curve right ----
  [
    // Head (shifted right 1)
    px(14, 3, 6, 2, P.steelD),
    px(13, 5, 8, 2, P.steelD),
    p1(15, 4, P.danger),
    p1(18, 4, P.danger),
    p1(13, 6, P.eye),
    p1(20, 6, P.eye),
    px(15, 3, 4, 1, P.eye),

    // Neck curve
    px(15, 7, 4, 2, P.steelD),
    px(17, 9, 3, 2, P.steelD),
    p1(16, 8, P.danger),

    // Body curve right
    px(18, 11, 4, 2, P.steelD),
    px(19, 13, 4, 2, P.steelD),
    px(18, 15, 4, 2, P.steelD),
    p1(19, 12, P.danger),
    p1(20, 14, P.danger),

    // Body curve left
    px(15, 17, 4, 2, P.steelD),
    px(13, 19, 4, 2, P.steelD),
    px(11, 21, 4, 2, P.steelD),
    p1(16, 18, P.danger),
    p1(14, 20, P.danger),
    p1(12, 22, P.danger),

    // Tail
    px(10, 23, 3, 1, P.steelD),
    px(9, 24, 2, 1, P.steelD),
    p1(9, 25, P.eye),

    // Underbelly highlights
    p1(18, 8, P.steel),
    p1(19, 12, P.steel),
    p1(16, 18, P.steel),
  ],
];

/**
 * Obsidian Guardian — Armored golem, dark glass-like surface
 * Colors: P.eye (dark body), P.steelD (armor plates), P.steel (highlights/edges)
 * 2 idle frames (heavy breathing sway)
 */
export const obsidian_guardian_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Head
    px(13, 3, 6, 2, P.eye),
    px(12, 5, 8, 2, P.eye),
    p1(14, 5, P.steel),
    p1(17, 5, P.steel),
    px(13, 3, 6, 1, P.steelD),

    // Neck
    px(14, 7, 4, 1, P.eye),

    // Shoulders
    px(7, 8, 5, 3, P.steelD),
    px(20, 8, 5, 3, P.steelD),
    p1(8, 8, P.steel),
    p1(21, 8, P.steel),

    // Arms
    px(6, 11, 3, 6, P.eye),
    px(23, 11, 3, 6, P.eye),
    p1(7, 11, P.steelD),
    p1(24, 11, P.steelD),

    // Fists
    px(5, 17, 4, 2, P.steelD),
    px(23, 17, 4, 2, P.steelD),
    p1(6, 17, P.steel),
    p1(25, 17, P.steel),

    // Torso
    px(11, 8, 10, 4, P.eye),
    px(10, 12, 12, 4, P.eye),
    px(12, 9, 8, 2, P.steelD),
    p1(15, 10, P.steel),
    p1(16, 10, P.steel),

    // Waist
    px(11, 16, 10, 2, P.steelD),
    p1(16, 16, P.steel),

    // Legs
    px(11, 18, 4, 5, P.eye),
    px(17, 18, 4, 5, P.eye),
    px(12, 18, 2, 4, P.steelD),
    px(18, 18, 2, 4, P.steelD),

    // Feet
    px(10, 23, 5, 2, P.steelD),
    px(17, 23, 5, 2, P.steelD),
    p1(11, 23, P.steel),
    p1(18, 23, P.steel),

    // Obsidian sheen
    p1(13, 13, P.steelD),
    p1(18, 13, P.steelD),
    p1(15, 15, P.steel),
  ],

  // ---- FRAME 1: Breathing down ----
  [
    // Head (down 1)
    px(13, 4, 6, 2, P.eye),
    px(12, 6, 8, 2, P.eye),
    p1(14, 6, P.steel),
    p1(17, 6, P.steel),
    px(13, 4, 6, 1, P.steelD),

    // Neck
    px(14, 8, 4, 1, P.eye),

    // Shoulders (down 1)
    px(7, 9, 5, 3, P.steelD),
    px(20, 9, 5, 3, P.steelD),
    p1(8, 9, P.steel),
    p1(21, 9, P.steel),

    // Arms
    px(6, 12, 3, 6, P.eye),
    px(23, 12, 3, 6, P.eye),
    p1(7, 12, P.steelD),
    p1(24, 12, P.steelD),

    // Fists (down 1)
    px(5, 18, 4, 2, P.steelD),
    px(23, 18, 4, 2, P.steelD),
    p1(6, 18, P.steel),
    p1(25, 18, P.steel),

    // Torso (down 1)
    px(11, 9, 10, 4, P.eye),
    px(10, 13, 12, 4, P.eye),
    px(12, 10, 8, 2, P.steelD),
    p1(15, 11, P.steel),
    p1(16, 11, P.steel),

    // Waist (down 1)
    px(11, 17, 10, 2, P.steelD),
    p1(16, 17, P.steel),

    // Legs
    px(11, 19, 4, 4, P.eye),
    px(17, 19, 4, 4, P.eye),
    px(12, 19, 2, 3, P.steelD),
    px(18, 19, 2, 3, P.steelD),

    // Feet
    px(10, 23, 5, 2, P.steelD),
    px(17, 23, 5, 2, P.steelD),
    p1(11, 23, P.steel),
    p1(18, 23, P.steel),

    // Obsidian sheen
    p1(13, 14, P.steelD),
    p1(18, 14, P.steelD),
    p1(15, 16, P.steel),
  ],
];

/**
 * Elder Dragon (BOSS) — Massive presence, wings spread, golden glowing eyes
 * Colors: P.eye (dark body), P.steelD (armor scales), P.danger (vein glow), P.gold (eyes only)
 * 2 idle frames (powerful breathing)
 */
export const elder_dragon_pixel = [
  // ---- FRAME 0: Wings spread ----
  [
    // Horns
    px(12, 1, 2, 2, P.steelD),
    px(18, 1, 2, 2, P.steelD),
    p1(12, 0, P.steelD),
    p1(19, 0, P.steelD),

    // Head
    px(13, 3, 6, 2, P.eye),
    px(12, 5, 8, 2, P.eye),
    p1(14, 4, P.gold),
    p1(17, 4, P.gold),
    px(12, 7, 3, 1, P.eye),
    px(17, 7, 3, 1, P.eye),
    p1(12, 7, P.steelD),
    p1(19, 7, P.steelD),
    px(14, 3, 4, 1, P.steelD),

    // Neck
    px(14, 8, 4, 2, P.eye),
    p1(15, 8, P.danger),
    p1(16, 9, P.danger),

    // Wings (left)
    px(1, 5, 3, 1, P.steelD),
    px(2, 6, 4, 1, P.eye),
    px(4, 7, 4, 1, P.eye),
    px(5, 8, 4, 1, P.eye),
    px(7, 9, 5, 1, P.eye),
    px(9, 10, 3, 1, P.steelD),
    p1(1, 5, P.steelD),
    p1(3, 6, P.danger),
    p1(6, 8, P.danger),

    // Wings (right)
    px(28, 5, 3, 1, P.steelD),
    px(26, 6, 4, 1, P.eye),
    px(24, 7, 4, 1, P.eye),
    px(23, 8, 4, 1, P.eye),
    px(20, 9, 5, 1, P.eye),
    px(20, 10, 3, 1, P.steelD),
    p1(30, 5, P.steelD),
    p1(28, 6, P.danger),
    p1(25, 8, P.danger),

    // Body
    px(10, 10, 12, 4, P.eye),
    px(9, 14, 14, 4, P.eye),
    px(10, 18, 12, 2, P.eye),
    px(12, 11, 8, 2, P.steelD),
    p1(15, 12, P.danger),
    p1(16, 12, P.danger),
    p1(14, 15, P.danger),
    p1(17, 15, P.danger),
    p1(15, 17, P.danger),

    // Legs
    px(10, 20, 4, 4, P.eye),
    px(18, 20, 4, 4, P.eye),
    px(11, 20, 2, 3, P.steelD),
    px(19, 20, 2, 3, P.steelD),

    // Claws
    px(9, 24, 5, 1, P.steelD),
    px(18, 24, 5, 1, P.steelD),
    p1(9, 24, P.danger),
    p1(22, 24, P.danger),

    // Tail
    px(15, 20, 2, 1, P.eye),
    px(16, 21, 2, 1, P.eye),
    px(17, 22, 2, 1, P.eye),
    px(18, 23, 2, 1, P.eye),
    px(19, 24, 2, 1, P.steelD),
    p1(20, 25, P.danger),
  ],

  // ---- FRAME 1: Wings down slightly, breathing ----
  [
    // Horns
    px(12, 2, 2, 2, P.steelD),
    px(18, 2, 2, 2, P.steelD),
    p1(12, 1, P.steelD),
    p1(19, 1, P.steelD),

    // Head (down 1)
    px(13, 4, 6, 2, P.eye),
    px(12, 6, 8, 2, P.eye),
    p1(14, 5, P.gold),
    p1(17, 5, P.gold),
    px(12, 8, 3, 1, P.eye),
    px(17, 8, 3, 1, P.eye),
    p1(12, 8, P.steelD),
    p1(19, 8, P.steelD),
    px(14, 4, 4, 1, P.steelD),

    // Neck (down 1)
    px(14, 9, 4, 2, P.eye),
    p1(15, 9, P.danger),
    p1(16, 10, P.danger),

    // Wings (left, lower)
    px(3, 8, 3, 1, P.steelD),
    px(4, 9, 4, 1, P.eye),
    px(5, 10, 4, 1, P.eye),
    px(7, 11, 4, 1, P.eye),
    px(9, 12, 3, 1, P.steelD),
    p1(3, 8, P.steelD),
    p1(5, 9, P.danger),
    p1(7, 11, P.danger),

    // Wings (right, lower)
    px(26, 8, 3, 1, P.steelD),
    px(24, 9, 4, 1, P.eye),
    px(23, 10, 4, 1, P.eye),
    px(21, 11, 4, 1, P.eye),
    px(20, 12, 3, 1, P.steelD),
    p1(28, 8, P.steelD),
    p1(26, 9, P.danger),
    p1(23, 11, P.danger),

    // Body (down 1)
    px(10, 11, 12, 4, P.eye),
    px(9, 15, 14, 4, P.eye),
    px(10, 19, 12, 2, P.eye),
    px(12, 12, 8, 2, P.steelD),
    p1(15, 13, P.danger),
    p1(16, 13, P.danger),
    p1(14, 16, P.danger),
    p1(17, 16, P.danger),
    p1(15, 18, P.danger),

    // Legs
    px(10, 21, 4, 3, P.eye),
    px(18, 21, 4, 3, P.eye),
    px(11, 21, 2, 2, P.steelD),
    px(19, 21, 2, 2, P.steelD),

    // Claws
    px(9, 24, 5, 1, P.steelD),
    px(18, 24, 5, 1, P.steelD),
    p1(9, 24, P.danger),
    p1(22, 24, P.danger),

    // Tail (shifted)
    px(14, 21, 2, 1, P.eye),
    px(13, 22, 2, 1, P.eye),
    px(12, 23, 2, 1, P.eye),
    px(11, 24, 2, 1, P.eye),
    px(10, 25, 2, 1, P.steelD),
    p1(10, 26, P.danger),
  ],
];

// ============================================================
// ENEMY PIXEL SPRITES — Dusthaven Wastes
// ============================================================

/**
 * Sand Scorpion — Low, wide, segmented tail curving overhead
 * Colors: P.leather (shell), P.gold (shell highlights), P.steelD (stinger)
 * 2 idle frames: pincers open/close, tail sway
 */
export const sand_scorpion_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Body — low, wide carapace
    px(11, 17, 10, 1, P.leather),    // carapace top edge
    px(10, 18, 12, 3, P.leather),    // main carapace
    px(12, 18, 8, 1, P.gold),        // shell highlight stripe
    px(9, 20, 2, 1, P.leather),      // left front segment
    px(21, 20, 2, 1, P.leather),     // right front segment

    // Head
    px(12, 21, 8, 2, P.leather),     // head plate
    px(13, 21, 2, 1, P.steelD),      // left eye
    px(17, 21, 2, 1, P.steelD),      // right eye
    px(14, 23, 4, 1, P.leather),     // mandibles

    // Left pincer
    px(7, 20, 2, 1, P.leather),      // pincer arm
    px(5, 19, 2, 2, P.leather),      // pincer claw top
    p1(5, 21, P.leather),            // pincer claw tip

    // Right pincer
    px(23, 20, 2, 1, P.leather),     // pincer arm
    px(25, 19, 2, 2, P.leather),     // pincer claw top
    p1(27, 21, P.leather),           // pincer claw tip

    // Tail — segmented, curving up and forward
    px(15, 16, 2, 1, P.leather),     // tail base
    px(15, 14, 2, 2, P.leather),     // segment 2
    px(16, 12, 2, 2, P.leather),     // segment 3
    px(17, 10, 2, 2, P.leather),     // segment 4
    px(18, 8, 2, 2, P.leather),      // segment 5
    p1(19, 7, P.steelD),             // stinger tip
    p1(18, 7, P.steelD),             // stinger base

    // Legs (3 pairs)
    p1(10, 22, P.leather),           // left leg 1
    p1(12, 23, P.leather),           // left leg 2
    p1(14, 24, P.leather),           // left leg 3
    p1(21, 22, P.leather),           // right leg 1
    p1(19, 23, P.leather),           // right leg 2
    p1(17, 24, P.leather),           // right leg 3
  ],

  // ---- FRAME 1: Pincers wider, tail shifted ----
  [
    // Body — same
    px(11, 17, 10, 1, P.leather),
    px(10, 18, 12, 3, P.leather),
    px(12, 18, 8, 1, P.gold),
    px(9, 20, 2, 1, P.leather),
    px(21, 20, 2, 1, P.leather),

    // Head — same
    px(12, 21, 8, 2, P.leather),
    px(13, 21, 2, 1, P.steelD),
    px(17, 21, 2, 1, P.steelD),
    px(14, 23, 4, 1, P.leather),

    // Left pincer — wider
    px(6, 20, 2, 1, P.leather),
    px(4, 19, 2, 2, P.leather),
    p1(4, 21, P.leather),

    // Right pincer — wider
    px(24, 20, 2, 1, P.leather),
    px(26, 19, 2, 2, P.leather),
    p1(28, 21, P.leather),

    // Tail — shifted 1px left
    px(14, 16, 2, 1, P.leather),
    px(14, 14, 2, 2, P.leather),
    px(15, 12, 2, 2, P.leather),
    px(16, 10, 2, 2, P.leather),
    px(17, 8, 2, 2, P.leather),
    p1(18, 7, P.steelD),
    p1(17, 7, P.steelD),

    // Legs — same
    p1(10, 22, P.leather),
    p1(12, 23, P.leather),
    p1(14, 24, P.leather),
    p1(21, 22, P.leather),
    p1(19, 23, P.leather),
    p1(17, 24, P.leather),
  ],
];

/**
 * Bandit — Humanoid, hooded, menacing with dagger
 * Colors: P.leather (cloak/hood), P.steelD (armor), P.danger (bandana)
 * 2 idle frames: subtle lean sway
 */
export const bandit_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Hood
    px(12, 5, 8, 1, P.leather),      // hood top
    px(11, 6, 10, 2, P.leather),     // hood body
    px(12, 8, 8, 1, P.leather),      // hood lower rim

    // Bandana
    px(13, 8, 6, 1, P.danger),       // bandana across face

    // Face
    px(13, 9, 6, 1, P.skin),         // face
    p1(14, 9, P.eye),                // left eye
    p1(17, 9, P.eye),                // right eye
    px(14, 10, 4, 1, P.skinS),       // chin shadow

    // Neck
    px(14, 11, 4, 1, P.skin),

    // Shoulders
    px(8, 12, 4, 2, P.leather),      // left shoulder pad
    px(20, 12, 4, 2, P.leather),     // right shoulder pad

    // Torso
    px(12, 12, 8, 3, P.steelD),      // chest armor
    px(13, 12, 6, 1, P.steel),       // chest highlight
    px(12, 15, 8, 2, P.leather),     // lower tunic

    // Belt
    px(11, 17, 10, 1, P.steelD),
    p1(16, 17, P.steel),             // buckle

    // Arms
    px(8, 14, 3, 4, P.leather),      // left arm
    px(21, 14, 3, 4, P.leather),     // right arm
    px(9, 18, 2, 1, P.skin),         // left hand
    px(21, 18, 2, 1, P.skin),        // right hand

    // Legs
    px(12, 18, 3, 4, P.steelD),      // left leg
    px(17, 18, 3, 4, P.steelD),      // right leg

    // Boots
    px(11, 22, 4, 2, P.leather),     // left boot
    px(17, 22, 4, 2, P.leather),     // right boot
    px(11, 24, 5, 1, P.leather),     // left sole
    px(17, 24, 5, 1, P.leather),     // right sole

    // Dagger (right hand)
    px(24, 14, 1, 5, P.steelL),      // blade
    p1(24, 13, P.steelD),            // cross guard
    p1(24, 12, P.leather),           // grip
  ],

  // ---- FRAME 1: Lean right ----
  [
    // Hood (shift right 1)
    px(13, 5, 8, 1, P.leather),
    px(12, 6, 10, 2, P.leather),
    px(13, 8, 8, 1, P.leather),

    // Bandana
    px(14, 8, 6, 1, P.danger),

    // Face
    px(14, 9, 6, 1, P.skin),
    p1(15, 9, P.eye),
    p1(18, 9, P.eye),
    px(15, 10, 4, 1, P.skinS),

    // Neck
    px(15, 11, 4, 1, P.skin),

    // Shoulders
    px(9, 12, 4, 2, P.leather),
    px(21, 12, 4, 2, P.leather),

    // Torso
    px(13, 12, 8, 3, P.steelD),
    px(14, 12, 6, 1, P.steel),
    px(13, 15, 8, 2, P.leather),

    // Belt
    px(12, 17, 10, 1, P.steelD),
    p1(17, 17, P.steel),

    // Arms
    px(9, 14, 3, 4, P.leather),
    px(22, 14, 3, 4, P.leather),
    px(10, 18, 2, 1, P.skin),
    px(22, 18, 2, 1, P.skin),

    // Legs (same position)
    px(12, 18, 3, 4, P.steelD),
    px(17, 18, 3, 4, P.steelD),

    // Boots
    px(11, 22, 4, 2, P.leather),
    px(17, 22, 4, 2, P.leather),
    px(11, 24, 5, 1, P.leather),
    px(17, 24, 5, 1, P.leather),

    // Dagger (shifted right 1)
    px(25, 14, 1, 5, P.steelL),
    p1(25, 13, P.steelD),
    p1(25, 12, P.leather),
  ],
];

/**
 * Dust Wraith — Ghostly, flowing, ethereal desert spirit
 * Colors: P.steelD (core shadow), P.steel (mid body), P.parchment (faded glow)
 * 2 idle frames: floating drift, wisps shift
 */
export const dust_wraith_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Head — spectral hood
    px(13, 6, 6, 1, P.steel),        // hood top
    px(12, 7, 8, 2, P.steelD),       // hood body
    px(13, 7, 6, 1, P.steel),        // hood highlight

    // Eyes — hollow glow
    p1(14, 8, P.parchment),          // left eye
    p1(17, 8, P.parchment),          // right eye

    // Upper body — wispy
    px(11, 9, 10, 1, P.steelD),      // shoulders
    px(12, 10, 8, 2, P.steel),       // torso
    px(13, 10, 6, 1, P.steelD),      // torso shadow

    // Arms — ethereal wisps
    px(8, 10, 3, 1, P.steel),        // left arm
    px(7, 11, 2, 1, P.parchment),    // left wisp end
    px(21, 10, 3, 1, P.steel),       // right arm
    px(23, 11, 2, 1, P.parchment),   // right wisp end

    // Lower body — dissolving robes
    px(11, 12, 10, 2, P.steelD),     // mid robe
    px(10, 14, 12, 2, P.steel),      // lower robe
    px(9, 16, 14, 1, P.steelD),      // robe fringe

    // Trailing wisps
    px(10, 17, 3, 1, P.parchment),   // left wisp
    px(15, 17, 2, 1, P.steel),       // center wisp
    px(19, 17, 3, 1, P.parchment),   // right wisp
    px(8, 18, 2, 1, P.parchment),    // far left fade
    px(12, 18, 2, 2, P.steel),       // left trail
    px(18, 18, 2, 2, P.steel),       // right trail
    px(22, 18, 2, 1, P.parchment),   // far right fade
    p1(13, 20, P.parchment),         // fade dot left
    p1(19, 20, P.parchment),         // fade dot right
  ],

  // ---- FRAME 1: Drift right and up, wisps shift ----
  [
    // Head (right 1, up 1)
    px(14, 5, 6, 1, P.steel),
    px(13, 6, 8, 2, P.steelD),
    px(14, 6, 6, 1, P.steel),

    // Eyes
    p1(15, 7, P.parchment),
    p1(18, 7, P.parchment),

    // Upper body (up 1)
    px(12, 8, 10, 1, P.steelD),
    px(13, 9, 8, 2, P.steel),
    px(14, 9, 6, 1, P.steelD),

    // Arms (shifted)
    px(9, 9, 3, 1, P.steel),
    px(8, 10, 2, 1, P.parchment),
    px(22, 9, 3, 1, P.steel),
    px(24, 10, 2, 1, P.parchment),

    // Lower body
    px(12, 11, 10, 2, P.steelD),
    px(11, 13, 12, 2, P.steel),
    px(10, 15, 14, 1, P.steelD),

    // Trailing wisps — shifted
    px(11, 16, 3, 1, P.parchment),
    px(16, 16, 2, 1, P.steel),
    px(20, 16, 3, 1, P.parchment),
    px(9, 17, 2, 1, P.parchment),
    px(13, 17, 2, 2, P.steel),
    px(19, 17, 2, 2, P.steel),
    px(23, 17, 2, 1, P.parchment),
    p1(14, 19, P.parchment),
    p1(20, 19, P.parchment),
  ],
];

/**
 * Bandit King (BOSS) — Armored bandit lord, crown, golden glowing eyes
 * Colors: P.leather (cloak), P.steelD (heavy armor), P.gold (eyes + crown ONLY)
 * Boss: imposing within 32x32, wider pauldrons, cape
 * 2 idle frames: menacing cape billow
 */
export const bandit_king_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Crown
    p1(13, 3, P.gold),               // left crown spike
    p1(16, 3, P.gold),               // center crown spike
    p1(19, 3, P.gold),               // right crown spike
    px(12, 4, 9, 1, P.gold),         // crown band

    // Hood over crown
    px(11, 5, 11, 1, P.leather),     // hood top
    px(10, 6, 13, 2, P.leather),     // hood body (wide, imposing)

    // Face
    px(12, 8, 9, 1, P.skin),         // face upper
    px(13, 9, 7, 1, P.skin),         // face lower
    p1(14, 8, P.gold),               // left eye — GOLDEN GLOW
    p1(18, 8, P.gold),               // right eye — GOLDEN GLOW
    px(14, 10, 5, 1, P.skinS),       // chin shadow
    px(14, 11, 5, 1, P.leather),     // beard

    // Neck
    px(14, 12, 5, 1, P.skin),

    // Heavy pauldrons (wider than regular bandit)
    px(6, 13, 6, 3, P.steelD),       // left pauldron
    px(21, 13, 6, 3, P.steelD),      // right pauldron
    px(7, 13, 4, 1, P.steel),        // left highlight
    px(22, 13, 4, 1, P.steel),       // right highlight
    p1(8, 14, P.steelL),             // left rivet
    p1(24, 14, P.steelL),            // right rivet

    // Chest plate — heavy
    px(12, 13, 9, 3, P.steelD),      // chest plate
    px(14, 13, 5, 2, P.steel),       // plate highlight
    px(15, 15, 3, 1, P.steelL),      // center crest

    // Belt
    px(11, 16, 11, 1, P.leather),
    p1(16, 16, P.gold),              // gold buckle

    // Cape draping
    px(8, 16, 3, 6, P.leather),      // left cape
    px(22, 16, 3, 6, P.leather),     // right cape

    // Arms
    px(9, 16, 2, 4, P.steelD),       // left arm armor
    px(22, 16, 2, 4, P.steelD),      // right arm armor
    px(9, 20, 2, 1, P.skin),         // left hand
    px(22, 20, 2, 1, P.skin),        // right hand

    // Legs
    px(12, 17, 4, 5, P.steelD),      // left leg
    px(17, 17, 4, 5, P.steelD),      // right leg
    p1(13, 17, P.steel),             // left leg highlight
    p1(18, 17, P.steel),             // right leg highlight

    // Boots
    px(11, 22, 5, 2, P.leather),     // left boot
    px(17, 22, 5, 2, P.leather),     // right boot
    px(11, 24, 6, 1, P.leather),     // left sole
    px(17, 24, 6, 1, P.leather),     // right sole

    // Heavy sword (right side)
    px(26, 8, 2, 1, P.steelL),       // pommel
    px(26, 9, 2, 2, P.leather),      // grip
    px(25, 11, 4, 1, P.gold),        // cross guard (gold)
    px(26, 12, 2, 10, P.steelL),     // blade
    px(26, 12, 1, 10, P.steel),      // blade shadow
  ],

  // ---- FRAME 1: Cape billow, sword weight shift ----
  [
    // Crown — same
    p1(13, 3, P.gold),
    p1(16, 3, P.gold),
    p1(19, 3, P.gold),
    px(12, 4, 9, 1, P.gold),

    // Hood
    px(11, 5, 11, 1, P.leather),
    px(10, 6, 13, 2, P.leather),

    // Face
    px(12, 8, 9, 1, P.skin),
    px(13, 9, 7, 1, P.skin),
    p1(14, 8, P.gold),               // golden eye
    p1(18, 8, P.gold),               // golden eye
    px(14, 10, 5, 1, P.skinS),
    px(14, 11, 5, 1, P.leather),

    // Neck
    px(14, 12, 5, 1, P.skin),

    // Pauldrons
    px(6, 13, 6, 3, P.steelD),
    px(21, 13, 6, 3, P.steelD),
    px(7, 13, 4, 1, P.steel),
    px(22, 13, 4, 1, P.steel),
    p1(8, 14, P.steelL),
    p1(24, 14, P.steelL),

    // Chest
    px(12, 13, 9, 3, P.steelD),
    px(14, 13, 5, 2, P.steel),
    px(15, 15, 3, 1, P.steelL),

    // Belt
    px(11, 16, 11, 1, P.leather),
    p1(16, 16, P.gold),

    // Cape — billowing wider
    px(7, 16, 3, 7, P.leather),      // wider left
    px(23, 16, 3, 7, P.leather),     // wider right

    // Arms
    px(9, 16, 2, 4, P.steelD),
    px(22, 16, 2, 4, P.steelD),
    px(9, 20, 2, 1, P.skin),
    px(22, 20, 2, 1, P.skin),

    // Legs
    px(12, 17, 4, 5, P.steelD),
    px(17, 17, 4, 5, P.steelD),
    p1(13, 17, P.steel),
    p1(18, 17, P.steel),

    // Boots
    px(11, 22, 5, 2, P.leather),
    px(17, 22, 5, 2, P.leather),
    px(11, 24, 6, 1, P.leather),
    px(17, 24, 6, 1, P.leather),

    // Sword (down 1 — weight shift)
    px(26, 9, 2, 1, P.steelL),
    px(26, 10, 2, 2, P.leather),
    px(25, 12, 4, 1, P.gold),
    px(26, 13, 2, 10, P.steelL),
    px(26, 13, 1, 10, P.steel),
  ],
];

// ============================================================
// ENEMY PIXEL SPRITES — Frostpeak Tundra
// ============================================================

/**
 * Ice Wolf — Frost-blue wolf, larger than dire wolf
 * Colors: P.steelL (fur highlights), P.parchment (belly/frost), P.steel (main fur)
 * 2 idle frames: head bob, tail shift
 */
export const ice_wolf_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Ears
    p1(10, 10, P.steelL),            // left ear
    p1(11, 10, P.steel),             // left ear inner
    p1(13, 10, P.steel),             // right ear inner
    p1(14, 10, P.steelL),            // right ear

    // Head
    px(10, 11, 6, 2, P.steel),       // head top
    px(11, 11, 4, 1, P.steelL),      // head highlight
    px(9, 13, 8, 2, P.steel),        // head lower/snout area
    p1(11, 12, P.steelD),            // left eye
    p1(14, 12, P.steelD),            // right eye

    // Snout
    px(8, 14, 3, 1, P.steelL),       // snout bridge
    p1(8, 15, P.steelD),             // nose
    px(9, 15, 2, 1, P.parchment),    // mouth line

    // Mane — frost-white ruff
    px(14, 13, 4, 3, P.steelL),      // frost mane
    px(13, 14, 2, 2, P.steel),       // neck

    // Body — broad
    px(15, 14, 8, 3, P.steel),       // upper body
    px(16, 14, 6, 1, P.steelL),      // back frost highlight
    px(15, 17, 8, 2, P.steel),       // lower body
    px(16, 17, 6, 2, P.parchment),   // belly

    // Tail — frost-tipped
    px(23, 13, 2, 1, P.steelL),      // tail base
    px(24, 14, 2, 1, P.steel),       // tail mid
    px(25, 15, 2, 1, P.parchment),   // tail tip (frost)

    // Front legs
    px(14, 19, 2, 4, P.steel),       // front left
    px(16, 19, 2, 4, P.steel),       // front right
    px(14, 23, 2, 1, P.steelL),      // left paw
    px(16, 23, 2, 1, P.steelL),      // right paw

    // Back legs
    px(20, 19, 2, 3, P.steel),       // back left
    px(22, 19, 2, 3, P.steel),       // back right
    px(20, 22, 2, 1, P.steelL),      // left paw
    px(22, 22, 3, 1, P.steelL),      // right paw
  ],

  // ---- FRAME 1: Head dip, tail raised ----
  [
    // Ears (down 1)
    p1(10, 11, P.steelL),
    p1(11, 11, P.steel),
    p1(13, 11, P.steel),
    p1(14, 11, P.steelL),

    // Head (down 1)
    px(10, 12, 6, 2, P.steel),
    px(11, 12, 4, 1, P.steelL),
    px(9, 14, 8, 2, P.steel),
    p1(11, 13, P.steelD),
    p1(14, 13, P.steelD),

    // Snout (down 1)
    px(8, 15, 3, 1, P.steelL),
    p1(8, 16, P.steelD),
    px(9, 16, 2, 1, P.parchment),

    // Mane
    px(14, 14, 4, 3, P.steelL),
    px(13, 15, 2, 2, P.steel),

    // Body — same
    px(15, 14, 8, 3, P.steel),
    px(16, 14, 6, 1, P.steelL),
    px(15, 17, 8, 2, P.steel),
    px(16, 17, 6, 2, P.parchment),

    // Tail — raised (up 1)
    px(23, 12, 2, 1, P.steelL),
    px(24, 13, 2, 1, P.steel),
    px(25, 14, 3, 1, P.parchment),

    // Front legs — same
    px(14, 19, 2, 4, P.steel),
    px(16, 19, 2, 4, P.steel),
    px(14, 23, 2, 1, P.steelL),
    px(16, 23, 2, 1, P.steelL),

    // Back legs — same
    px(20, 19, 2, 3, P.steel),
    px(22, 19, 2, 3, P.steel),
    px(20, 22, 2, 1, P.steelL),
    px(22, 22, 3, 1, P.steelL),
  ],
];

/**
 * Frost Elemental — Crystalline, angular, floating entity
 * Colors: P.steelL (crystal body), P.parchment (inner glow), P.steel (core)
 * 2 idle frames: float bob with particle shift
 */
export const frost_elemental_pixel = [
  // ---- FRAME 0: Floating base ----
  [
    // Crystal crown spikes
    p1(14, 5, P.steelL),             // left spike
    p1(16, 4, P.parchment),          // center spike (brightest)
    p1(18, 5, P.steelL),             // right spike

    // Head — angular faceted
    px(13, 6, 6, 1, P.steelL),       // head top facet
    px(12, 7, 8, 2, P.steel),        // head body
    px(13, 7, 6, 1, P.steelL),       // facet highlight
    p1(14, 8, P.parchment),          // left eye (ice glow)
    p1(18, 8, P.parchment),          // right eye (ice glow)

    // Neck crystal
    px(15, 9, 2, 1, P.steelL),

    // Torso — geometric crystal
    px(12, 10, 8, 1, P.steelL),      // shoulder facet
    px(11, 11, 10, 2, P.steel),      // upper torso
    px(13, 11, 6, 2, P.steelL),      // torso highlight facet
    px(12, 13, 8, 2, P.steel),       // lower torso
    px(14, 13, 4, 1, P.parchment),   // core glow

    // Arms — angular crystal shards
    px(8, 11, 3, 1, P.steelL),       // left upper arm
    px(7, 12, 2, 2, P.steel),        // left forearm
    p1(6, 14, P.parchment),          // left shard tip
    px(21, 11, 3, 1, P.steelL),      // right upper arm
    px(23, 12, 2, 2, P.steel),       // right forearm
    p1(25, 14, P.parchment),         // right shard tip

    // Lower body — tapering crystal point
    px(13, 15, 6, 2, P.steelL),      // mid taper
    px(14, 17, 4, 2, P.steel),       // lower taper
    px(15, 19, 2, 1, P.steelL),      // crystal point

    // Floating particles (no legs)
    p1(10, 20, P.parchment),         // left particle
    p1(22, 19, P.parchment),         // right particle
    p1(16, 21, P.steelL),            // center particle
  ],

  // ---- FRAME 1: Float up, particles drift ----
  [
    // Crown (up 1)
    p1(14, 4, P.steelL),
    p1(16, 3, P.parchment),
    p1(18, 4, P.steelL),

    // Head (up 1)
    px(13, 5, 6, 1, P.steelL),
    px(12, 6, 8, 2, P.steel),
    px(13, 6, 6, 1, P.steelL),
    p1(14, 7, P.parchment),
    p1(18, 7, P.parchment),

    // Neck
    px(15, 8, 2, 1, P.steelL),

    // Torso (up 1)
    px(12, 9, 8, 1, P.steelL),
    px(11, 10, 10, 2, P.steel),
    px(13, 10, 6, 2, P.steelL),
    px(12, 12, 8, 2, P.steel),
    px(14, 12, 4, 1, P.parchment),

    // Arms (up 1)
    px(8, 10, 3, 1, P.steelL),
    px(7, 11, 2, 2, P.steel),
    p1(6, 13, P.parchment),
    px(21, 10, 3, 1, P.steelL),
    px(23, 11, 2, 2, P.steel),
    p1(25, 13, P.parchment),

    // Lower body (up 1)
    px(13, 14, 6, 2, P.steelL),
    px(14, 16, 4, 2, P.steel),
    px(15, 18, 2, 1, P.steelL),

    // Particles — shifted
    p1(9, 19, P.parchment),
    p1(23, 20, P.parchment),
    p1(15, 20, P.steelL),
  ],
];

/**
 * Snow Troll — Large, hulking, white-grey brute
 * Colors: P.parchment (skin/fur), P.steelL (fur highlights), P.steelD (shadows)
 * 2 idle frames: menacing lean sway
 */
export const snow_troll_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Head — small relative to massive body
    px(13, 6, 6, 2, P.parchment),    // head
    px(14, 6, 4, 1, P.steelL),       // brow ridge
    p1(14, 7, P.steelD),             // left eye
    p1(17, 7, P.steelD),             // right eye
    px(14, 8, 4, 1, P.parchment),    // lower face
    px(15, 8, 2, 1, P.steelD),       // mouth

    // Thick neck
    px(13, 9, 6, 1, P.parchment),

    // Massive shoulders
    px(6, 10, 8, 3, P.parchment),    // left shoulder
    px(18, 10, 8, 3, P.parchment),   // right shoulder
    px(7, 10, 6, 1, P.steelL),       // left fur
    px(19, 10, 6, 1, P.steelL),      // right fur

    // Barrel chest
    px(10, 10, 12, 4, P.parchment),  // chest
    px(12, 10, 8, 2, P.steelL),      // chest fur highlight
    px(11, 14, 10, 3, P.parchment),  // belly
    px(13, 14, 6, 2, P.steelD),      // belly shadow

    // Arms — thick, hanging low
    px(5, 13, 4, 6, P.parchment),    // left arm
    px(6, 13, 2, 4, P.steelL),       // left highlight
    px(23, 13, 4, 6, P.parchment),   // right arm
    px(24, 13, 2, 4, P.steelL),      // right highlight
    px(4, 19, 4, 2, P.parchment),    // left fist
    px(24, 19, 4, 2, P.parchment),   // right fist
    p1(5, 19, P.steelD),             // left knuckle
    p1(26, 19, P.steelD),            // right knuckle

    // Loincloth
    px(11, 17, 10, 1, P.steelD),     // waist band
    px(12, 18, 8, 1, P.leather),     // loincloth

    // Legs — short, stout
    px(11, 19, 4, 4, P.parchment),   // left leg
    px(17, 19, 4, 4, P.parchment),   // right leg
    p1(12, 19, P.steelL),            // left highlight
    p1(18, 19, P.steelL),            // right highlight

    // Feet — big, flat
    px(10, 23, 5, 2, P.steelD),      // left foot
    px(17, 23, 5, 2, P.steelD),      // right foot
  ],

  // ---- FRAME 1: Lean left, fists shift outward ----
  [
    // Head (left 1)
    px(12, 6, 6, 2, P.parchment),
    px(13, 6, 4, 1, P.steelL),
    p1(13, 7, P.steelD),
    p1(16, 7, P.steelD),
    px(13, 8, 4, 1, P.parchment),
    px(14, 8, 2, 1, P.steelD),

    // Neck
    px(12, 9, 6, 1, P.parchment),

    // Shoulders
    px(5, 10, 8, 3, P.parchment),
    px(18, 10, 8, 3, P.parchment),
    px(6, 10, 6, 1, P.steelL),
    px(19, 10, 6, 1, P.steelL),

    // Chest
    px(10, 10, 12, 4, P.parchment),
    px(12, 10, 8, 2, P.steelL),
    px(11, 14, 10, 3, P.parchment),
    px(13, 14, 6, 2, P.steelD),

    // Arms — shifted outward
    px(4, 13, 4, 6, P.parchment),
    px(5, 13, 2, 4, P.steelL),
    px(24, 13, 4, 6, P.parchment),
    px(25, 13, 2, 4, P.steelL),
    px(3, 19, 4, 2, P.parchment),    // fists wider
    px(25, 19, 4, 2, P.parchment),
    p1(4, 19, P.steelD),
    p1(27, 19, P.steelD),

    // Loincloth
    px(11, 17, 10, 1, P.steelD),
    px(12, 18, 8, 1, P.leather),

    // Legs
    px(11, 19, 4, 4, P.parchment),
    px(17, 19, 4, 4, P.parchment),
    p1(12, 19, P.steelL),
    p1(18, 19, P.steelL),

    // Feet
    px(10, 23, 5, 2, P.steelD),
    px(17, 23, 5, 2, P.steelD),
  ],
];

/**
 * Frost Wyrm (BOSS) — Serpentine ice dragon, golden glowing eyes
 * Colors: P.steelL (scales), P.parchment (belly/frost), P.gold (eyes ONLY)
 * Boss: imposing serpentine form filling 32x32
 * 2 idle frames: head raised, wings flex
 */
export const frost_wyrm_pixel = [
  // ---- FRAME 0: Base pose ----
  [
    // Horns
    p1(10, 4, P.steelL),             // left horn base
    p1(9, 3, P.parchment),           // left horn tip
    p1(20, 4, P.steelL),             // right horn base
    p1(21, 3, P.parchment),          // right horn tip

    // Head — draconic, angular
    px(11, 5, 10, 2, P.steelL),      // skull top
    px(12, 5, 8, 1, P.parchment),    // skull frost highlight
    px(10, 7, 12, 2, P.steel),       // head body
    p1(12, 7, P.gold),               // left eye — GOLDEN GLOW
    p1(19, 7, P.gold),               // right eye — GOLDEN GLOW
    px(9, 9, 6, 1, P.steelL),        // snout
    p1(9, 9, P.parchment),           // nostril
    px(9, 10, 4, 1, P.steelD),       // jaw
    p1(10, 10, P.parchment),         // teeth

    // Neck — serpentine curve
    px(14, 9, 6, 2, P.steelL),       // neck upper
    px(16, 11, 4, 2, P.steel),       // neck bend
    px(15, 11, 2, 1, P.parchment),   // neck belly

    // Body — coiled serpentine
    px(14, 13, 8, 3, P.steelL),      // upper body
    px(15, 13, 6, 1, P.parchment),   // dorsal highlight
    px(14, 14, 6, 2, P.parchment),   // belly scales
    px(12, 16, 10, 2, P.steel),      // mid body
    px(13, 16, 8, 1, P.steelL),      // scale ridge
    px(13, 18, 8, 2, P.steelL),      // lower body

    // Wings — folded
    px(6, 10, 4, 1, P.steelL),       // left wing bone
    px(5, 11, 3, 3, P.steel),        // left wing membrane
    p1(5, 11, P.parchment),          // left wing highlight
    px(22, 10, 4, 1, P.steelL),      // right wing bone
    px(25, 11, 3, 3, P.steel),       // right wing membrane
    p1(27, 11, P.parchment),         // right wing highlight

    // Dorsal spines
    p1(16, 12, P.steelL),            // spine 1
    p1(18, 15, P.steelL),            // spine 2
    p1(15, 17, P.steelL),            // spine 3

    // Tail — curving down and left
    px(12, 20, 6, 1, P.steelL),      // tail base
    px(10, 21, 4, 1, P.steel),       // tail mid
    px(8, 22, 3, 1, P.steelL),       // tail lower
    px(6, 23, 2, 1, P.steel),        // tail end
    p1(5, 23, P.parchment),          // tail tip

    // Claws
    px(14, 20, 2, 2, P.steelD),      // front left claw
    px(19, 20, 2, 2, P.steelD),      // front right claw
    p1(14, 22, P.parchment),         // left claw tip
    p1(20, 22, P.parchment),         // right claw tip
  ],

  // ---- FRAME 1: Head raised, wings spread ----
  [
    // Horns (up 1)
    p1(10, 3, P.steelL),
    p1(9, 2, P.parchment),
    p1(20, 3, P.steelL),
    p1(21, 2, P.parchment),

    // Head (up 1)
    px(11, 4, 10, 2, P.steelL),
    px(12, 4, 8, 1, P.parchment),
    px(10, 6, 12, 2, P.steel),
    p1(12, 6, P.gold),               // golden eye
    p1(19, 6, P.gold),               // golden eye
    px(9, 8, 6, 1, P.steelL),
    p1(9, 8, P.parchment),
    px(9, 9, 4, 1, P.steelD),
    p1(10, 9, P.parchment),

    // Neck
    px(14, 8, 6, 2, P.steelL),
    px(16, 10, 4, 2, P.steel),
    px(15, 10, 2, 1, P.parchment),

    // Body — same
    px(14, 13, 8, 3, P.steelL),
    px(15, 13, 6, 1, P.parchment),
    px(14, 14, 6, 2, P.parchment),
    px(12, 16, 10, 2, P.steel),
    px(13, 16, 8, 1, P.steelL),
    px(13, 18, 8, 2, P.steelL),

    // Wings — extended wider
    px(5, 9, 5, 1, P.steelL),        // left wing wider
    px(4, 10, 4, 3, P.steel),        // left membrane wider
    p1(4, 10, P.parchment),
    px(22, 9, 5, 1, P.steelL),       // right wing wider
    px(25, 10, 4, 3, P.steel),       // right membrane wider
    p1(28, 10, P.parchment),

    // Dorsal spines
    p1(16, 11, P.steelL),
    p1(18, 15, P.steelL),
    p1(15, 17, P.steelL),

    // Tail — same
    px(12, 20, 6, 1, P.steelL),
    px(10, 21, 4, 1, P.steel),
    px(8, 22, 3, 1, P.steelL),
    px(6, 23, 2, 1, P.steel),
    p1(5, 23, P.parchment),

    // Claws
    px(14, 20, 2, 2, P.steelD),
    px(19, 20, 2, 2, P.steelD),
    p1(14, 22, P.parchment),
    p1(20, 22, P.parchment),
  ],
];
