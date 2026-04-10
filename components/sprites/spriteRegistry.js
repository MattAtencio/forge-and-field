/**
 * Forgelight Sprite Registry
 *
 * Each sprite is defined as an array of SVG shape descriptors.
 * Shape types: path (d, fill), rect (x, y, w, h, fill, rx), circle (cx, cy, r, fill), ellipse (cx, cy, rx, ry, fill)
 * All sprites use viewBox "0 0 32 32".
 */

// -- Palette shortcuts --
const S = {
  steelL: "#cbd5e1", steel: "#94a3b8", steelD: "#64748b",
  gold: "#fbbf24", goldD: "#d97706",
  leather: "#92400e", leatherL: "#b45309",
  wood: "#a16207", woodD: "#78350f",
  skin: "#fcd5b0", skinS: "#d4a574",
  green: "#22c55e", greenD: "#15803d",
  purple: "#a855f7", purpleD: "#7c3aed",
  ice: "#38bdf8", iceL: "#7dd3fc",
  red: "#ef4444", redD: "#b91c1c",
  orange: "#fb923c", orangeD: "#f97316",
  stone: "#9ca3af", stoneD: "#6b7280",
  white: "#f1f5f9", black: "#1e293b",
};

// Helper: create shape descriptor
const p = (d, fill) => ({ t: "path", d, fill });
const r = (x, y, w, h, fill, rx = 0) => ({ t: "rect", x, y, w, h, fill, rx });
const c = (cx, cy, radius, fill) => ({ t: "circle", cx, cy, r: radius, fill });
const e = (cx, cy, rx, ry, fill) => ({ t: "ellipse", cx, cy, rx, ry, fill });

const SPRITES = {
  // ============ HEROES ============
  warrior: [
    // Helmet
    r(10, 3, 12, 4, S.steelD, 2),
    r(11, 2, 10, 3, S.steel, 2),
    r(13, 5, 6, 2, S.black), // visor slit
    // Face
    r(12, 7, 8, 4, S.skin, 1),
    // Armor body
    r(9, 11, 14, 10, S.steelD, 2),
    r(10, 12, 12, 8, S.steel, 1),
    // Chest detail
    r(14, 13, 4, 6, S.steelL),
    // Shoulders
    r(7, 11, 4, 4, S.steelD, 2),
    r(21, 11, 4, 4, S.steelD, 2),
    // Sword (right side)
    r(24, 6, 2, 16, S.steelL, 1),
    r(23, 5, 4, 2, S.leather, 1),
    r(24, 22, 2, 3, S.gold),
    // Belt
    r(10, 19, 12, 2, S.leather),
    c(16, 20, 1.5, S.gold),
    // Legs
    r(11, 21, 4, 6, S.steelD, 1),
    r(17, 21, 4, 6, S.steelD, 1),
    // Boots
    r(10, 26, 5, 3, S.leather, 1),
    r(17, 26, 5, 3, S.leather, 1),
  ],
  ranger: [
    // Hood
    p("M11 4 L16 1 L21 4 L21 8 L11 8 Z", S.greenD),
    p("M12 4 L16 2 L20 4 L20 7 L12 7 Z", S.green),
    // Face
    r(13, 7, 6, 4, S.skin, 1),
    c(14.5, 9, 0.7, S.black), // eye
    c(17.5, 9, 0.7, S.black), // eye
    // Body (leather)
    r(10, 11, 12, 9, S.leather, 2),
    r(11, 12, 10, 7, S.leatherL, 1),
    // Cloak sides
    p("M8 11 L10 11 L9 22 L7 22 Z", S.greenD),
    p("M22 11 L24 11 L25 22 L23 22 Z", S.greenD),
    // Belt
    r(10, 18, 12, 2, S.woodD),
    // Quiver (back)
    r(22, 5, 3, 12, S.woodD, 1),
    r(22, 4, 1, 2, S.steelL),
    r(24, 4, 1, 2, S.steelL),
    // Legs
    r(11, 20, 4, 6, S.leather, 1),
    r(17, 20, 4, 6, S.leather, 1),
    // Boots
    r(10, 25, 5, 3, S.woodD, 1),
    r(17, 25, 5, 3, S.woodD, 1),
  ],
  mage: [
    // Hat
    p("M10 8 L16 0 L22 8 Z", S.purpleD),
    p("M11 8 L16 1.5 L21 8 Z", S.purple),
    r(8, 7, 16, 3, S.purpleD, 1),
    // Hat brim star
    c(16, 4, 1.2, S.gold),
    // Face
    r(12, 10, 8, 4, S.skin, 1),
    c(14, 12, 0.8, S.purple), // eye (magical)
    c(18, 12, 0.8, S.purple), // eye
    // Robe body
    p("M10 14 L22 14 L24 29 L8 29 Z", S.purpleD),
    p("M11 15 L21 15 L23 28 L9 28 Z", S.purple),
    // Robe trim
    r(9, 28, 14, 2, S.gold, 1),
    // Collar
    p("M12 14 L16 17 L20 14 Z", S.purpleD),
    // Staff (left side)
    r(5, 4, 2, 24, S.wood, 1),
    c(6, 3, 2.5, S.ice),
    c(6, 3, 1.5, S.iceL),
    // Sleeves
    r(7, 16, 4, 3, S.purple, 1),
    r(21, 16, 4, 3, S.purple, 1),
  ],
  paladin: [
    // Crown helm
    r(10, 3, 12, 5, S.gold, 2),
    r(11, 2, 10, 3, S.goldD, 2),
    // Crown points
    p("M11 2 L12 0 L13 2 Z", S.gold),
    p("M15 2 L16 0 L17 2 Z", S.gold),
    p("M19 2 L20 0 L21 2 Z", S.gold),
    // Face
    r(12, 7, 8, 4, S.skin, 1),
    r(13, 7, 6, 2, S.gold), // visor band
    // Armor (heavy, white/gold)
    r(8, 11, 16, 10, S.steelL, 2),
    r(9, 12, 14, 8, S.white, 1),
    // Cross emblem
    r(15, 13, 2, 6, S.gold),
    r(13, 15, 6, 2, S.gold),
    // Shoulders (gold)
    r(6, 11, 4, 5, S.gold, 2),
    r(22, 11, 4, 5, S.gold, 2),
    // Shield (left arm)
    r(3, 13, 5, 8, S.gold, 2),
    r(4, 14, 3, 6, S.white, 1),
    c(5.5, 17, 1, S.gold),
    // Legs
    r(10, 21, 5, 6, S.steelL, 1),
    r(17, 21, 5, 6, S.steelL, 1),
    // Boots
    r(9, 26, 6, 3, S.gold, 1),
    r(17, 26, 6, 3, S.gold, 1),
  ],

  // ============ RESOURCES ============
  wood: [
    // Log body
    e(16, 18, 10, 6, S.woodD),
    e(16, 17, 10, 6, S.wood),
    // Log end (cross section)
    c(16, 17, 5, S.leatherL),
    c(16, 17, 3, S.wood),
    c(16, 17, 1.2, S.woodD),
    // Second log
    e(12, 24, 8, 4, S.woodD),
    e(12, 23, 8, 4, S.wood),
    // Bark lines
    p("M8 15 Q10 14 12 15", S.woodD),
    p("M20 15 Q22 14 24 15", S.woodD),
  ],
  stone: [
    // Main boulder
    p("M6 24 L4 16 L8 10 L16 7 L24 10 L28 16 L26 24 Z", S.stoneD),
    p("M7 23 L5 16 L9 11 L16 8 L23 11 L27 16 L25 23 Z", S.stone),
    // Highlight facet
    p("M10 12 L16 9 L20 12 L16 15 Z", S.steelL),
    // Small stone
    p("M20 24 L18 20 L22 18 L26 20 L25 24 Z", S.stoneD),
    p("M21 23 L19 20 L22 19 L25 20 L24 23 Z", S.stone),
    // Shadow
    e(16, 27, 11, 2, "rgba(0,0,0,0.2)"),
  ],
  iron: [
    // Ingot body
    p("M6 22 L10 12 L22 12 L26 22 Z", S.steelD),
    p("M10 12 L14 8 L26 8 L22 12 Z", S.steelL),
    p("M22 12 L26 8 L30 18 L26 22 Z", S.steel),
    // Shine
    p("M12 11 L15 9 L22 9 L19 11 Z", S.white),
    // Shadow
    e(16, 25, 10, 2, "rgba(0,0,0,0.2)"),
  ],
  herbs: [
    // Stem
    r(15, 14, 2, 14, S.greenD),
    // Leaves
    p("M16 8 Q22 4 24 8 Q22 12 16 10 Z", S.green),
    p("M16 8 Q10 4 8 8 Q10 12 16 10 Z", S.green),
    p("M16 14 Q22 10 24 14 Q22 18 16 16 Z", S.greenD),
    p("M16 14 Q10 10 8 14 Q10 18 16 16 Z", S.greenD),
    // Top leaves (small)
    p("M16 4 Q20 1 21 4 Q19 7 16 6 Z", S.green),
    p("M16 4 Q12 1 11 4 Q13 7 16 6 Z", S.green),
    // Berry
    c(20, 6, 1.5, S.red),
    c(12, 6, 1.5, S.red),
  ],
  gems: [
    // Gem body (diamond shape)
    p("M16 3 L26 14 L16 28 L6 14 Z", S.purpleD),
    // Facets
    p("M16 3 L20 14 L16 28 Z", S.purple),
    p("M16 3 L12 14 L16 28 Z", S.purpleD),
    p("M16 3 L20 14 L26 14 Z", S.purple),
    p("M6 14 L12 14 L16 3 Z", S.purpleD),
    // Center highlight
    p("M13 12 L16 7 L19 12 L16 16 Z", "rgba(255,255,255,0.3)"),
    // Sparkle
    c(19, 9, 1, S.white),
    c(20, 10, 0.5, S.white),
  ],
  gold: [
    // Coin body
    c(16, 16, 10, S.goldD),
    c(16, 15, 10, S.gold),
    // Inner ring
    c(16, 15, 7, S.goldD),
    c(16, 15, 6, S.gold),
    // Emblem (G)
    p("M18 11 Q21 11 21 15 Q21 19 18 19 L14 19 Q11 19 11 15 Q11 11 14 11 L18 11 M17 15 L20 15", S.goldD),
    // Shine
    p("M10 10 Q12 8 14 9", S.white),
  ],

  // ============ ITEMS ============
  item_sword: [
    // Blade
    p("M15 2 L17 2 L18 18 L14 18 Z", S.steelL),
    p("M16 2 L17 2 L18 18 L16 18 Z", S.steel),
    // Edge highlight
    p("M15 4 L15.5 2 L16 4 Z", S.white),
    // Guard
    r(11, 18, 10, 3, S.gold, 1),
    // Grip
    r(14, 21, 4, 6, S.leather, 1),
    // Pommel
    c(16, 29, 2.5, S.gold),
  ],
  item_hammer: [
    // Handle
    r(15, 12, 2, 18, S.wood, 1),
    // Head
    r(8, 4, 16, 10, S.steelD, 2),
    r(9, 5, 14, 8, S.steel, 1),
    // Face highlight
    r(10, 6, 5, 6, S.steelL, 1),
    // Band
    r(13, 11, 6, 2, S.gold),
  ],
  item_axe: [
    // Handle
    r(15, 8, 2, 22, S.wood, 1),
    // Axe head
    p("M8 4 L17 4 L17 16 L8 16 Q4 10 8 4 Z", S.steelD),
    p("M9 5 L16 5 L16 15 L9 15 Q5 10 9 5 Z", S.steel),
    // Edge
    p("M8 5 Q4 10 8 15 Q6 10 8 5 Z", S.steelL),
    // Band
    r(13, 6, 6, 2, S.leather),
  ],
  item_staff: [
    // Shaft
    r(15, 6, 2.5, 24, S.wood, 1),
    r(15.5, 8, 1.5, 20, S.woodD),
    // Orb
    c(16, 5, 4.5, S.purple),
    c(16, 5, 3, S.purpleD),
    c(16, 4, 1.5, S.white),
    // Wrap
    r(14, 18, 4, 2, S.leather),
    r(14, 22, 4, 2, S.leather),
    // Base
    c(16, 30, 2, S.steelD),
  ],
  item_bow: [
    // Bow limb
    p("M12 4 Q6 16 12 28", S.wood),
    p("M13 5 Q8 16 13 27", S.woodD),
    // String
    p("M12 4 L18 16 L12 28", "none"),
    p("M12 4 L18 16 L12 28", S.steelL),
    // Arrow
    r(17, 10, 12, 1.5, S.wood),
    p("M29 8 L32 11 L29 13 Z", S.steelL),
    // Fletching
    p("M17 9 L14 7 L17 10 Z", S.red),
    p("M17 11 L14 14 L17 12 Z", S.red),
    // Grip
    r(10, 14, 4, 5, S.leather, 1),
  ],
  item_wand: [
    // Shaft (thin)
    r(15, 10, 2, 20, S.woodD, 1),
    // Crystal top
    p("M16 2 L20 8 L16 12 L12 8 Z", S.ice),
    p("M16 2 L18 8 L16 12 Z", S.iceL),
    c(16, 7, 1.5, S.white),
    // Grip wrap
    r(14, 20, 4, 2, S.purple),
    r(14, 24, 4, 2, S.purple),
  ],
  item_vest: [
    // Body
    p("M8 8 L24 8 L26 28 L6 28 Z", S.leather),
    p("M9 9 L23 9 L25 27 L7 27 Z", S.leatherL),
    // Collar
    p("M12 8 L16 12 L20 8 Z", S.leather),
    // Center seam
    r(15, 10, 2, 16, S.leather),
    // Stitching
    r(10, 12, 1, 1, S.woodD),
    r(10, 16, 1, 1, S.woodD),
    r(10, 20, 1, 1, S.woodD),
    r(21, 12, 1, 1, S.woodD),
    r(21, 16, 1, 1, S.woodD),
    r(21, 20, 1, 1, S.woodD),
  ],
  item_mail: [
    // Body
    r(7, 6, 18, 22, S.steelD, 2),
    r(8, 7, 16, 20, S.steel, 1),
    // Chain pattern (dots)
    ...Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 4 }, (_, col) =>
        c(11 + col * 3, 10 + row * 4, 0.8, S.steelL)
      )
    ).flat(),
    // Collar
    r(10, 6, 12, 3, S.steelL, 1),
    // Hem
    r(8, 25, 16, 2, S.steelD),
  ],
  item_plate: [
    // Body
    r(6, 6, 20, 22, S.steelD, 3),
    r(7, 7, 18, 20, S.steelL, 2),
    // Chest plate segments
    r(9, 9, 14, 8, S.white),
    r(15, 9, 1.5, 16, S.steelD),
    // Shoulder guards
    r(4, 6, 6, 5, S.steelD, 2),
    r(22, 6, 6, 5, S.steelD, 2),
    // Emblem
    c(16, 14, 2.5, S.gold),
    c(16, 14, 1.5, S.goldD),
    // Belt
    r(8, 20, 16, 2.5, S.leather),
    c(16, 21, 1.5, S.gold),
  ],
  item_shield: [
    // Shield body
    p("M16 2 L28 10 L28 22 L16 30 L4 22 L4 10 Z", S.steelD),
    p("M16 3 L27 10 L27 21 L16 29 L5 21 L5 10 Z", S.steel),
    // Inner field
    p("M16 6 L24 12 L24 20 L16 26 L8 20 L8 12 Z", S.steelL),
    // Cross emblem
    r(14.5, 10, 3, 12, S.gold),
    r(10, 15, 12, 3, S.gold),
    // Boss (center)
    c(16, 17, 2.5, S.goldD),
    c(16, 16.5, 2, S.gold),
    // Rim highlight
    p("M16 3 L27 10 L24 12 L16 6 Z", S.white),
  ],
  item_ring: [
    // Ring band
    e(16, 18, 8, 6, S.gold),
    e(16, 18, 5.5, 3.5, S.black),
    // Band highlight
    p("M10 15 Q12 12 16 12 Q20 12 22 15", S.goldD),
    // Gem setting
    c(16, 11, 3.5, S.steelL),
    // Gem
    c(16, 10.5, 2.5, S.purple),
    c(16, 10, 1, "rgba(255,255,255,0.5)"),
  ],
  item_pouch: [
    // Body
    p("M8 12 Q8 28 16 28 Q24 28 24 12 Z", S.leather),
    p("M9 13 Q9 27 16 27 Q23 27 23 13 Z", S.leatherL),
    // Flap
    p("M7 12 L25 12 Q25 8 16 6 Q7 8 7 12 Z", S.leather),
    // String tie
    r(14, 10, 4, 3, S.woodD, 1),
    c(16, 10, 1, S.gold),
    // Stitching
    r(12, 18, 1, 1, S.woodD),
    r(16, 18, 1, 1, S.woodD),
    r(20, 18, 1, 1, S.woodD),
  ],
  item_charm: [
    // Chain
    c(16, 4, 1, S.gold),
    c(14, 6, 1, S.goldD),
    c(16, 8, 1, S.gold),
    c(18, 6, 1, S.goldD),
    // Pendant body
    p("M16 10 L22 16 L16 26 L10 16 Z", S.gold),
    p("M16 11 L21 16 L16 25 L11 16 Z", S.goldD),
    // Inner glow
    c(16, 17, 3, S.ice),
    c(16, 16, 1.5, S.iceL),
    c(16, 15.5, 0.8, S.white),
  ],
  item_amulet: [
    // Chain
    p("M8 4 Q8 2 16 2 Q24 2 24 4", S.gold),
    r(7, 4, 2, 6, S.goldD, 1),
    r(23, 4, 2, 6, S.goldD, 1),
    // Amulet body
    c(16, 18, 8, S.gold),
    c(16, 18, 6.5, S.goldD),
    // Gem
    c(16, 18, 4, S.purple),
    c(16, 17, 2, S.purpleD),
    c(15, 16, 1, "rgba(255,255,255,0.4)"),
    // Filigree
    c(10, 14, 1, S.gold),
    c(22, 14, 1, S.gold),
    c(10, 22, 1, S.gold),
    c(22, 22, 1, S.gold),
  ],
  item_tome: [
    // Book body
    r(6, 4, 20, 24, S.purpleD, 2),
    r(7, 5, 18, 22, S.purple, 1),
    // Spine
    r(6, 4, 3, 24, S.leatherL, 1),
    // Pages (visible edge)
    r(9, 6, 15, 20, S.white, 1),
    r(9, 6, 15, 20, "rgba(255,255,255,0.8)", 1),
    // Cover design
    c(18, 16, 4, S.gold),
    c(18, 16, 2.5, S.goldD),
    c(18, 16, 1, S.gold),
    // Corner accents
    r(22, 4, 3, 3, S.gold, 1),
    r(22, 25, 3, 3, S.gold, 1),
  ],

  // ============ ENEMIES ============
  goblin: [
    // Ears
    p("M8 8 L4 4 L8 10 Z", S.green),
    p("M24 8 L28 4 L24 10 Z", S.green),
    // Head
    c(16, 10, 6, S.green),
    c(16, 10, 5, S.greenD),
    // Eyes (big, yellow)
    c(13, 9, 2, S.gold),
    c(19, 9, 2, S.gold),
    c(13, 9, 1, S.black),
    c(19, 9, 1, S.black),
    // Mouth
    p("M13 13 L16 15 L19 13", S.black),
    // Body
    r(11, 16, 10, 8, S.greenD, 2),
    r(12, 17, 8, 6, S.green),
    // Crude weapon
    r(23, 10, 2, 14, S.woodD),
    r(22, 8, 4, 3, S.stoneD),
    // Legs
    r(12, 24, 3, 5, S.greenD, 1),
    r(17, 24, 3, 5, S.greenD, 1),
  ],
  wolf: [
    // Body
    e(16, 18, 10, 6, S.stoneD),
    e(16, 17, 10, 6, S.stone),
    // Head
    p("M4 12 L10 6 L18 6 L18 16 L4 16 Z", S.stone),
    p("M5 13 L10 7 L17 7 L17 15 L5 15 Z", S.stoneD),
    // Ear
    p("M10 6 L8 2 L12 5 Z", S.stoneD),
    p("M14 6 L13 2 L16 5 Z", S.stoneD),
    // Eye
    c(8, 11, 1.5, S.gold),
    c(8, 11, 0.7, S.black),
    // Snout
    r(3, 13, 3, 2, S.black, 1),
    // Teeth
    r(4, 14.5, 1, 1.5, S.white),
    r(6, 14.5, 1, 1.5, S.white),
    // Tail
    p("M26 14 Q30 10 28 8", S.stone),
    p("M26 15 Q31 11 29 8", S.stoneD),
    // Legs
    r(10, 22, 2, 6, S.stone),
    r(14, 22, 2, 6, S.stone),
    r(18, 22, 2, 6, S.stone),
    r(22, 22, 2, 6, S.stone),
  ],
  treant: [
    // Trunk body
    r(10, 10, 12, 16, S.woodD, 2),
    r(11, 11, 10, 14, S.wood, 1),
    // Crown (leaves)
    c(16, 7, 8, S.greenD),
    c(14, 5, 5, S.green),
    c(19, 6, 4, S.green),
    c(16, 3, 3, S.greenD),
    // Face
    c(13, 14, 1.5, S.gold), // eye
    c(19, 14, 1.5, S.gold),
    c(13, 14, 0.6, S.black),
    c(19, 14, 0.6, S.black),
    p("M14 18 Q16 20 18 18", S.woodD), // mouth
    // Branch arms
    p("M10 14 L4 10 L3 8", S.woodD),
    p("M10 16 L4 18 L2 16", S.woodD),
    p("M22 14 L28 10 L29 8", S.woodD),
    p("M22 16 L28 18 L30 16", S.woodD),
    // Roots
    p("M10 26 L8 30 L12 30 Z", S.woodD),
    p("M22 26 L20 30 L24 30 Z", S.woodD),
  ],
  rock_golem: [
    // Body
    r(8, 10, 16, 14, S.stoneD, 3),
    r(9, 11, 14, 12, S.stone, 2),
    // Head
    r(10, 3, 12, 9, S.stoneD, 3),
    r(11, 4, 10, 7, S.stone, 2),
    // Eyes (glowing)
    c(13, 7, 1.5, S.orange),
    c(19, 7, 1.5, S.orange),
    // Cracks
    p("M14 5 L15 8 L13 10", S.stoneD),
    p("M20 6 L19 9", S.stoneD),
    // Arms (boulder-like)
    r(3, 12, 6, 8, S.stoneD, 3),
    r(23, 12, 6, 8, S.stoneD, 3),
    // Crystal embedded
    p("M14 14 L16 12 L18 14 L16 18 Z", S.ice),
    // Legs
    r(10, 24, 5, 5, S.stoneD, 2),
    r(17, 24, 5, 5, S.stoneD, 2),
  ],
  harpy: [
    // Wings
    p("M4 8 L0 4 L2 12 L8 16 Z", S.steelL),
    p("M28 8 L32 4 L30 12 L24 16 Z", S.steelL),
    p("M6 10 L2 6 L4 14 L10 18 Z", S.steel),
    p("M26 10 L30 6 L28 14 L22 18 Z", S.steel),
    // Body
    e(16, 16, 6, 8, S.steel),
    e(16, 15, 6, 8, S.steelL),
    // Head
    c(16, 7, 4, S.skin),
    // Hair
    p("M12 5 L10 2 L14 4 Z", S.purple),
    p("M18 5 L22 2 L20 4 Z", S.purple),
    // Eyes
    c(14, 7, 1, S.red),
    c(18, 7, 1, S.red),
    // Talons
    p("M12 24 L10 28 L14 28 Z", S.goldD),
    p("M20 24 L18 28 L22 28 Z", S.goldD),
  ],
  bandit: [
    // Hood/mask
    r(10, 3, 12, 8, S.stoneD, 2),
    r(11, 4, 10, 6, S.black, 1),
    // Eyes (visible through mask)
    c(13, 7, 1.2, S.white),
    c(19, 7, 1.2, S.white),
    c(13, 7, 0.5, S.black),
    c(19, 7, 0.5, S.black),
    // Scarf
    p("M10 10 L22 10 L20 14 L12 14 Z", S.red),
    // Body
    r(9, 14, 14, 10, S.stoneD, 2),
    r(10, 15, 12, 8, S.black),
    // Belt with pouches
    r(9, 21, 14, 2, S.leather),
    r(10, 20, 3, 3, S.leatherL, 1),
    r(19, 20, 3, 3, S.leatherL, 1),
    // Dagger
    r(24, 12, 1.5, 8, S.steelL),
    r(23, 11, 4, 2, S.leather, 1),
    // Legs
    r(11, 24, 4, 5, S.stoneD, 1),
    r(17, 24, 4, 5, S.stoneD, 1),
  ],
  bandit_leader: [
    // Helm with plume
    r(10, 4, 12, 6, S.steelD, 2),
    r(11, 3, 10, 5, S.steel, 2),
    p("M16 2 L18 0 L20 2 L18 4 Z", S.red),
    // Face (visible)
    r(12, 8, 8, 3, S.skin),
    // Scar
    p("M18 8 L20 11", S.redD),
    // Body (armored)
    r(8, 11, 16, 11, S.steelD, 2),
    r(9, 12, 14, 9, S.steel),
    // Cape
    p("M8 11 L4 11 L2 26 L8 24 Z", S.redD),
    // Sword
    r(24, 6, 2, 16, S.steelL),
    r(23, 5, 4, 2, S.gold),
    // Belt
    r(9, 20, 14, 2, S.leather),
    c(16, 21, 1.5, S.gold),
    // Legs
    r(10, 23, 5, 6, S.steelD, 1),
    r(17, 23, 5, 6, S.steelD, 1),
  ],
  sandworm: [
    // Body segments (curved)
    c(10, 22, 5, S.leatherL),
    c(14, 18, 5.5, S.leather),
    c(18, 14, 5.5, S.leatherL),
    c(22, 10, 5, S.leather),
    // Head
    c(24, 6, 5, S.leatherL),
    // Mouth
    p("M22 3 L28 3 L28 9 L22 9 Z", S.redD),
    p("M23 4 L27 4 L27 8 L23 8 Z", S.black),
    // Teeth
    p("M23 4 L24 6 L25 4", S.white),
    p("M25 4 L26 6 L27 4", S.white),
    p("M23 8 L24 6 L25 8", S.white),
    // Eyes
    c(22, 5, 1, S.gold),
    // Segments texture
    p("M8 20 Q10 18 12 20", S.leather),
    p("M12 16 Q14 14 16 16", S.leatherL),
  ],
  ice_wraith: [
    // Ghost body (ethereal)
    p("M16 4 Q24 4 26 12 Q28 22 22 28 L16 24 L10 28 Q4 22 6 12 Q8 4 16 4 Z", S.iceL),
    p("M16 5 Q23 5 25 12 Q27 21 21 27 L16 23 L11 27 Q5 21 7 12 Q9 5 16 5 Z", S.ice),
    // Eyes (glowing)
    c(13, 12, 2, S.white),
    c(19, 12, 2, S.white),
    c(13, 12, 1, S.ice),
    c(19, 12, 1, S.ice),
    // Mouth
    p("M14 17 Q16 19 18 17", S.iceL),
    // Wispy trails
    p("M10 26 Q8 30 6 29", S.iceL),
    p("M22 26 Q24 30 26 29", S.iceL),
    p("M16 24 Q16 30 14 31", S.iceL),
  ],
  frost_bear: [
    // Body
    e(16, 18, 11, 7, S.white),
    e(16, 17, 11, 7, S.steelL),
    // Head
    c(16, 8, 7, S.white),
    c(16, 7, 6, S.steelL),
    // Ears
    c(10, 3, 2.5, S.white),
    c(22, 3, 2.5, S.white),
    c(10, 3, 1.2, S.iceL),
    c(22, 3, 1.2, S.iceL),
    // Eyes
    c(13, 7, 1.5, S.ice),
    c(19, 7, 1.5, S.ice),
    c(13, 7, 0.6, S.black),
    c(19, 7, 0.6, S.black),
    // Nose
    c(16, 10, 1.5, S.black),
    // Ice crystals on back
    p("M12 14 L14 10 L16 14 Z", S.ice),
    p("M18 13 L20 9 L22 13 Z", S.iceL),
    // Legs
    r(8, 22, 4, 6, S.white, 1),
    r(14, 22, 4, 6, S.white, 1),
    r(20, 22, 4, 6, S.white, 1),
  ],
  fire_imp: [
    // Body (small, fiery)
    e(16, 18, 6, 7, S.red),
    e(16, 17, 6, 7, S.redD),
    // Head
    c(16, 9, 5, S.red),
    c(16, 8, 4, S.orange),
    // Horns
    p("M11 6 L9 1 L13 5 Z", S.redD),
    p("M21 6 L23 1 L19 5 Z", S.redD),
    // Eyes (glowing)
    c(14, 8, 1.5, S.gold),
    c(18, 8, 1.5, S.gold),
    // Grin
    p("M13 11 L16 13 L19 11", S.goldD),
    // Flames (top)
    p("M14 5 Q12 1 14 2 Q16 0 16 3 Q18 0 18 2 Q20 1 18 5 Z", S.orange),
    // Tail
    p("M22 18 Q26 16 28 18 Q30 20 28 22", S.red),
    c(28, 22, 1.5, S.orange),
    // Arms
    r(8, 14, 3, 2, S.red, 1),
    r(21, 14, 3, 2, S.red, 1),
  ],
  drake: [
    // Body
    e(16, 18, 9, 7, S.greenD),
    e(16, 17, 9, 7, S.green),
    // Neck
    r(14, 8, 6, 8, S.greenD),
    // Head
    p("M10 4 L22 4 L24 10 L8 10 Z", S.greenD),
    p("M11 5 L21 5 L23 9 L9 9 Z", S.green),
    // Eyes
    c(13, 7, 1.5, S.gold),
    c(19, 7, 1.5, S.gold),
    c(13, 7, 0.6, S.redD),
    c(19, 7, 0.6, S.redD),
    // Snout
    r(9, 7, 3, 2, S.greenD, 1),
    // Horns
    p("M10 4 L8 0 L12 3 Z", S.stoneD),
    p("M22 4 L24 0 L20 3 Z", S.stoneD),
    // Wings (folded)
    p("M6 10 L2 6 L4 16 L10 14 Z", S.green),
    p("M26 10 L30 6 L28 16 L22 14 Z", S.green),
    // Tail
    p("M22 20 Q28 22 28 18 Q30 14 28 16", S.greenD),
    p("M28 16 L30 14 L30 18 Z", S.green),
    // Legs
    r(10, 22, 4, 6, S.greenD, 1),
    r(18, 22, 4, 6, S.greenD, 1),
  ],
  // Boss variants (bigger/more detailed versions)
  treant_elder: [
    // Massive trunk
    r(8, 8, 16, 18, S.woodD, 3),
    r(9, 9, 14, 16, S.wood, 2),
    // Huge crown
    c(16, 6, 10, S.greenD),
    c(12, 4, 6, S.green),
    c(20, 4, 6, S.green),
    c(16, 2, 5, S.greenD),
    c(8, 6, 4, S.green),
    c(24, 6, 4, S.green),
    // Glowing eyes
    c(13, 14, 2, S.gold),
    c(19, 14, 2, S.gold),
    c(13, 14, 1, S.orange),
    c(19, 14, 1, S.orange),
    // Ancient face
    p("M14 18 Q16 21 18 18", S.woodD),
    // Massive branch arms
    p("M8 12 L2 6 L0 4", S.woodD),
    p("M8 14 L0 12 L-2 10", S.wood),
    p("M24 12 L30 6 L32 4", S.woodD),
    p("M24 14 L32 12 L34 10", S.wood),
    // Roots
    p("M8 26 L4 30 L10 30 Z", S.woodD),
    p("M16 26 L14 30 L18 30 Z", S.woodD),
    p("M24 26 L22 30 L28 30 Z", S.woodD),
    // Moss
    c(12, 12, 1.5, S.green),
    c(20, 16, 1, S.green),
  ],
  stone_golem: [
    // Massive body
    r(6, 8, 20, 16, S.stoneD, 4),
    r(7, 9, 18, 14, S.stone, 3),
    // Head
    r(8, 1, 16, 10, S.stoneD, 4),
    r(9, 2, 14, 8, S.stone, 3),
    // Glowing eyes
    c(12, 6, 2, S.orange),
    c(20, 6, 2, S.orange),
    c(12, 6, 1, S.gold),
    c(20, 6, 1, S.gold),
    // Rune markings
    p("M14 13 L16 11 L18 13 L16 17 Z", S.orange),
    p("M12 16 L14 16", S.orange),
    p("M18 16 L20 16", S.orange),
    // Massive arms
    r(1, 10, 7, 10, S.stoneD, 3),
    r(24, 10, 7, 10, S.stoneD, 3),
    // Fists
    r(0, 18, 6, 5, S.stone, 2),
    r(26, 18, 6, 5, S.stone, 2),
    // Legs
    r(8, 24, 6, 6, S.stoneD, 2),
    r(18, 24, 6, 6, S.stoneD, 2),
    // Crystals
    p("M13 4 L14 0 L15 4 Z", S.ice),
    p("M17 4 L18 0 L19 4 Z", S.iceL),
  ],
  sandworm_queen: [
    // Massive body segments
    c(8, 24, 6, S.leatherL),
    c(12, 20, 7, S.leather),
    c(16, 15, 7.5, S.leatherL),
    c(20, 10, 7, S.leather),
    // Head
    c(22, 5, 7, S.leatherL),
    // Crown spines
    p("M18 0 L20 -3 L22 0 Z", S.gold),
    p("M22 0 L24 -3 L26 0 Z", S.gold),
    p("M20 -1 L22 -4 L24 -1 Z", S.goldD),
    // Massive jaws
    p("M18 2 L28 2 L30 10 L18 10 Z", S.redD),
    p("M19 3 L27 3 L29 9 L19 9 Z", S.black),
    // Teeth (larger)
    p("M19 3 L20 6 L21 3", S.white),
    p("M23 3 L24 6 L25 3", S.white),
    p("M19 9 L20 6 L21 9", S.white),
    p("M23 9 L24 6 L25 9", S.white),
    // Eyes (4 eyes)
    c(19, 4, 1.2, S.red),
    c(25, 4, 1.2, S.red),
    c(20, 7, 1, S.red),
    c(24, 7, 1, S.red),
    // Armor plates
    p("M10 18 Q12 16 14 18", S.goldD),
    p("M14 14 Q16 12 18 14", S.goldD),
  ],
  frost_dragon: [
    // Body
    e(16, 20, 10, 6, S.iceL),
    // Neck
    r(13, 10, 8, 8, S.iceL),
    // Head
    p("M10 4 L24 4 L26 12 L8 12 Z", S.iceL),
    p("M11 5 L23 5 L25 11 L9 11 Z", S.ice),
    // Eyes
    c(13, 8, 2, S.white),
    c(21, 8, 2, S.white),
    c(13, 8, 1, S.ice),
    c(21, 8, 1, S.ice),
    // Ice horns
    p("M10 4 L6 -2 L12 3 Z", S.white),
    p("M22 4 L26 -2 L20 3 Z", S.white),
    // Wings (large)
    p("M4 8 L-2 0 L0 16 L10 14 Z", S.iceL),
    p("M28 8 L34 0 L32 16 L22 14 Z", S.iceL),
    p("M6 10 L0 2 L2 14 L10 12 Z", S.ice),
    p("M26 10 L32 2 L30 14 L22 12 Z", S.ice),
    // Ice breath particles
    c(8, 10, 1, S.white),
    c(24, 10, 1, S.white),
    // Tail
    p("M24 22 Q30 24 30 20 Q32 16 30 14", S.iceL),
    p("M30 14 L32 12 L32 16 Z", S.ice),
    // Legs
    r(10, 24, 4, 5, S.iceL, 1),
    r(18, 24, 4, 5, S.iceL, 1),
    // Crystal belly
    p("M13 18 L16 16 L19 18 L16 22 Z", S.white),
  ],
  elder_dragon: [
    // Body
    e(16, 20, 10, 6, S.redD),
    e(16, 19, 10, 6, S.red),
    // Neck
    r(12, 10, 8, 8, S.redD),
    // Head
    p("M8 4 L24 4 L26 12 L6 12 Z", S.redD),
    p("M9 5 L23 5 L25 11 L7 11 Z", S.red),
    // Eyes (fierce)
    c(12, 8, 2, S.gold),
    c(20, 8, 2, S.gold),
    c(12, 8, 1, S.orange),
    c(20, 8, 1, S.orange),
    // Horns (majestic)
    p("M8 4 L4 -2 L6 0 L10 3 Z", S.goldD),
    p("M24 4 L28 -2 L26 0 L22 3 Z", S.goldD),
    // Wings (massive)
    p("M2 6 L-4 -2 L-2 18 L10 14 Z", S.redD),
    p("M30 6 L36 -2 L34 18 L22 14 Z", S.redD),
    p("M4 8 L-2 0 L0 16 L10 12 Z", S.red),
    p("M28 8 L34 0 L32 16 L22 12 Z", S.red),
    // Fire breath
    c(6, 10, 1.5, S.orange),
    c(4, 9, 1, S.gold),
    c(26, 10, 1.5, S.orange),
    c(28, 9, 1, S.gold),
    // Chest scales
    p("M13 17 L16 15 L19 17 L16 21 Z", S.gold),
    // Tail
    p("M24 22 Q30 26 32 22 Q34 18 32 14", S.redD),
    p("M32 14 L34 12 L34 16 Z", S.orange),
    // Legs
    r(9, 24, 5, 5, S.redD, 1),
    r(18, 24, 5, 5, S.redD, 1),
    // Claws
    p("M8 29 L7 31 L10 29", S.goldD),
    p("M23 29 L24 31 L22 29", S.goldD),
  ],

  // ============ BUILDINGS ============
  storehouse: [
    // Base
    r(4, 16, 24, 12, S.woodD, 2),
    r(5, 17, 22, 10, S.wood),
    // Roof
    p("M2 16 L16 4 L30 16 Z", S.redD),
    p("M3 16 L16 5 L29 16 Z", S.red),
    // Door
    r(13, 20, 6, 8, S.woodD, 1),
    r(14, 21, 4, 6, S.leather),
    c(16.5, 24, 0.7, S.gold),
    // Crates visible through window
    r(6, 20, 5, 4, S.woodD, 1),
    r(21, 20, 5, 4, S.woodD, 1),
    // Chimney
    r(22, 4, 4, 8, S.stoneD, 1),
  ],
  war_camp: [
    // Tent body
    p("M4 28 L16 6 L28 28 Z", S.leather),
    p("M5 27 L16 7 L27 27 Z", S.leatherL),
    // Tent opening
    p("M12 28 L16 14 L20 28 Z", S.woodD),
    p("M13 27 L16 15 L19 27 Z", S.black),
    // Flag pole
    r(15.5, 2, 1.5, 6, S.wood),
    // Flag
    p("M17 2 L26 5 L17 8 Z", S.red),
    p("M17 3 L24 5 L17 7 Z", S.redD),
    // Crossed swords at entrance
    p("M14 22 L12 18", S.steelL),
    p("M18 22 L20 18", S.steelL),
    // Ground stakes
    r(4, 27, 1.5, 3, S.wood),
    r(27, 27, 1.5, 3, S.wood),
  ],
  apothecary: [
    // Building
    r(6, 12, 20, 16, S.woodD, 2),
    r(7, 13, 18, 14, S.wood),
    // Roof
    p("M4 12 L16 4 L28 12 Z", S.greenD),
    p("M5 12 L16 5 L27 12 Z", S.green),
    // Window
    r(8, 16, 5, 5, S.iceL, 1),
    r(19, 16, 5, 5, S.iceL, 1),
    // Door
    r(13, 20, 6, 8, S.woodD, 1),
    // Potion sign
    c(16, 9, 3, S.green),
    c(16, 9, 1.5, S.greenD),
    // Herbs hanging
    p("M8 12 L8 15", S.greenD),
    p("M10, 12 L10 14", S.green),
    p("M22 12 L22 15", S.greenD),
    p("M24 12 L24 14", S.green),
  ],
  smithy: [
    // Building
    r(4, 14, 24, 14, S.stoneD, 2),
    r(5, 15, 22, 12, S.stone),
    // Roof
    p("M2 14 L16 4 L30 14 Z", S.steelD),
    p("M3 14 L16 5 L29 14 Z", S.steel),
    // Forge opening (glowing)
    r(10, 18, 12, 10, S.black, 2),
    r(11, 19, 10, 8, S.redD),
    r(12, 20, 8, 6, S.orange),
    // Anvil silhouette
    p("M13 24 L19 24 L20 26 L12 26 Z", S.black),
    // Chimney with smoke
    r(22, 2, 5, 12, S.stoneD, 1),
    c(24, 1, 2, S.stoneD),
    c(25, -1, 1.5, S.stone),
    // Hammer sign
    r(3, 16, 3, 6, S.woodD),
    r(2, 15, 5, 2, S.steelL),
  ],

  // ============ NAVIGATION ============
  hub: [
    // Castle base
    r(6, 14, 20, 14, S.stoneD, 2),
    r(7, 15, 18, 12, S.stone),
    // Towers
    r(4, 8, 6, 20, S.stoneD, 1),
    r(22, 8, 6, 20, S.stoneD, 1),
    // Tower tops
    p("M3 8 L7 2 L11 8 Z", S.redD),
    p("M21 8 L25 2 L29 8 Z", S.redD),
    // Gate
    r(12, 18, 8, 10, S.woodD, 1),
    r(13, 19, 6, 8, S.leather),
    // Flags
    r(6.5, 1, 1, 3, S.wood),
    p("M8 1 L12 2.5 L8 4 Z", S.orange),
    r(24.5, 1, 1, 3, S.wood),
    p("M26 1 L30 2.5 L26 4 Z", S.orange),
    // Windows
    r(8, 16, 3, 3, S.iceL, 1),
    r(21, 16, 3, 3, S.iceL, 1),
    // Battlement
    r(12, 13, 2, 2, S.stoneD),
    r(16, 13, 2, 2, S.stoneD),
  ],
  forge: [
    // Anvil
    r(8, 16, 16, 4, S.steelD, 1),
    r(6, 14, 20, 4, S.steel, 1),
    r(10, 20, 4, 8, S.steelD, 1),
    r(18, 20, 4, 8, S.steelD, 1),
    // Hammer
    p("M20 4 L24 4 L24 10 L20 10 Z", S.steelD),
    r(21, 10, 2, 10, S.wood),
    // Sparks
    c(14, 10, 1.5, S.orange),
    c(11, 8, 1, S.gold),
    c(17, 7, 1, S.orange),
    c(9, 12, 0.8, S.gold),
    c(19, 9, 0.8, S.gold),
    // Fire underneath
    p("M12 26 Q14 22 16 26 Q18 22 20 26", S.orange),
    p("M14 27 Q16 23 18 27", S.gold),
  ],
  barracks: [
    // Crossed swords
    p("M4 28 L24 4", S.steelL),
    p("M3 27 L23 3", S.steel),
    p("M28 28 L8 4", S.steelL),
    p("M29 27 L9 3", S.steel),
    // Sword guards
    r(2, 24, 6, 3, S.gold, 1),
    r(24, 24, 6, 3, S.gold, 1),
    // Pommel
    c(5, 28, 2, S.goldD),
    c(27, 28, 2, S.goldD),
    // Tips
    p("M23 2 L24 0 L25 2 L24 4 Z", S.white),
    p("M7 2 L8 0 L9 2 L8 4 Z", S.white),
    // Shield (center)
    p("M16 10 L22 14 L22 22 L16 26 L10 22 L10 14 Z", S.steelD),
    p("M16 11 L21 14 L21 21 L16 25 L11 21 L11 14 Z", S.steel),
    c(16, 18, 3, S.orange),
    c(16, 18, 1.5, S.orangeD),
  ],
  map: [
    // Scroll body
    r(6, 6, 20, 20, S.gold),
    r(7, 7, 18, 18, "#fef3c7"),
    // Top roll
    e(16, 6, 11, 3, S.goldD),
    e(16, 5, 11, 3, S.gold),
    // Bottom roll
    e(16, 26, 11, 3, S.goldD),
    e(16, 27, 11, 3, S.gold),
    // Map markings
    p("M10 12 L13 10 L16 14 L20 11 L23 13", S.greenD),
    c(12, 16, 1.5, S.red),
    c(18, 14, 1, S.red),
    // Dotted path
    c(13, 18, 0.5, S.leather),
    c(15, 19, 0.5, S.leather),
    c(17, 18, 0.5, S.leather),
    c(19, 19, 0.5, S.leather),
    // X marks the spot
    p("M20 18 L22 20", S.red),
    p("M22 18 L20 20", S.red),
  ],
  season: [
    // Star body
    p("M16 2 L19 12 L28 12 L21 18 L24 28 L16 22 L8 28 L11 18 L4 12 L13 12 Z", S.gold),
    p("M16 4 L18.5 12.5 L27 12.5 L20.5 17.5 L23 27 L16 21.5 L9 27 L11.5 17.5 L5 12.5 L13.5 12.5 Z", S.goldD),
    // Center glow
    c(16, 15, 3, S.gold),
    c(16, 14.5, 2, S.white),
    // Sparkles
    c(10, 8, 0.8, S.white),
    c(22, 8, 0.8, S.white),
    c(8, 20, 0.8, S.white),
    c(24, 20, 0.8, S.white),
  ],
  village: [
    // House 1 (left)
    r(2, 16, 10, 12, S.woodD, 1),
    r(3, 17, 8, 10, S.wood),
    p("M1 16 L7 10 L13 16 Z", S.redD),
    // House 2 (right, taller)
    r(16, 12, 12, 16, S.stoneD, 1),
    r(17, 13, 10, 14, S.stone),
    p("M15 12 L22 4 L29 12 Z", S.steelD),
    // Door 1
    r(5, 22, 4, 6, S.woodD, 1),
    // Door 2
    r(20, 22, 4, 6, S.leather, 1),
    // Windows
    r(4, 18, 2.5, 2.5, S.iceL, 1),
    r(23, 16, 3, 3, S.iceL, 1),
    // Chimney smoke
    r(24, 2, 3, 6, S.stoneD, 1),
    c(25, 1, 1.5, S.stoneD),
    // Path
    r(12, 26, 5, 2, S.stoneD, 1),
  ],
  lock: [
    // Lock body
    r(8, 14, 16, 14, S.steelD, 3),
    r(9, 15, 14, 12, S.steel, 2),
    // Shackle
    p("M10 14 L10 8 Q10 4 16 4 Q22 4 22 8 L22 14", "none"),
    r(10, 6, 3, 8, S.steelD, 1),
    r(19, 6, 3, 8, S.steelD, 1),
    r(12, 4, 8, 4, S.steelD, 2),
    r(13, 4, 6, 3, S.steel, 2),
    // Keyhole
    c(16, 20, 2.5, S.black),
    r(15, 21, 2, 5, S.black),
  ],
  settings: [
    // Gear teeth
    p("M14 2 L18 2 L18 5 L14 5 Z", S.steel),
    p("M14 27 L18 27 L18 30 L14 30 Z", S.steel),
    p("M2 14 L2 18 L5 18 L5 14 Z", S.steel),
    p("M27 14 L27 18 L30 18 L30 14 Z", S.steel),
    p("M5 5 L8 5 L10 8 L7 10 Z", S.steel),
    p("M24 5 L27 5 L25 8 L22 10 Z", S.steel),
    p("M5 27 L8 27 L10 24 L7 22 Z", S.steel),
    p("M24 27 L27 27 L25 24 L22 22 Z", S.steel),
    // Gear body
    c(16, 16, 9, S.steelD),
    c(16, 16, 7, S.steel),
    // Center
    c(16, 16, 3, S.steelD),
    c(16, 16, 1.5, S.stoneD),
  ],

  // ============ UI ICONS ============
  heart: [
    p("M16 28 Q4 20 4 12 Q4 6 10 6 Q14 6 16 10 Q18 6 22 6 Q28 6 28 12 Q28 20 16 28 Z", S.red),
    p("M16 26 Q6 20 6 12 Q6 8 10 8 Q14 8 16 12 Q18 8 22 8 Q26 8 26 12 Q26 20 16 26 Z", S.redD),
    // Shine
    c(11, 11, 2, "rgba(255,255,255,0.3)"),
  ],
  attack: [
    // Crossed swords (compact)
    p("M6 26 L22 6", S.steelL),
    p("M5 25 L21 5", S.steel),
    p("M26 26 L10 6", S.steelL),
    p("M27 25 L11 5", S.steel),
    r(3, 22, 6, 3, S.gold, 1),
    r(23, 22, 6, 3, S.gold, 1),
    p("M21 4 L22 2 L23 4", S.white),
    p("M9 4 L10 2 L11 4", S.white),
  ],
  defense: [
    // Shield
    p("M16 4 L26 10 L26 20 L16 28 L6 20 L6 10 Z", S.steelD),
    p("M16 5 L25 10 L25 19 L16 27 L7 19 L7 10 Z", S.steel),
    p("M16 8 L22 12 L22 18 L16 24 L10 18 L10 12 Z", S.steelL),
    // Center emblem
    r(14.5, 12, 3, 8, S.orange),
    r(12, 15, 8, 3, S.orange),
  ],
  speed: [
    // Lightning bolt
    p("M18 2 L10 16 L16 16 L14 30 L24 14 L18 14 Z", S.gold),
    p("M17 4 L11 16 L16 16 L15 28 L23 14 L18 14 Z", S.goldD),
    // Glow
    c(16, 16, 1.5, S.white),
  ],
  chest_common: [
    // Chest body
    r(4, 14, 24, 14, S.woodD, 2),
    r(5, 15, 22, 12, S.wood),
    // Lid
    p("M4 14 Q4 8 16 8 Q28 8 28 14 Z", S.woodD),
    p("M5 14 Q5 9 16 9 Q27 9 27 14 Z", S.wood),
    // Lock
    r(14, 12, 4, 4, S.steelD, 1),
    c(16, 14, 1, S.steel),
    // Bands
    r(4, 16, 24, 2, S.steelD),
    r(4, 22, 24, 2, S.steelD),
  ],
  chest_uncommon: [
    // Chest body
    r(4, 14, 24, 14, S.greenD, 2),
    r(5, 15, 22, 12, S.green),
    // Lid
    p("M4 14 Q4 8 16 8 Q28 8 28 14 Z", S.greenD),
    p("M5 14 Q5 9 16 9 Q27 9 27 14 Z", S.green),
    // Lock (gold)
    r(14, 12, 4, 4, S.gold, 1),
    c(16, 14, 1, S.goldD),
    // Bands
    r(4, 16, 24, 2, S.gold),
    r(4, 22, 24, 2, S.gold),
    // Gem accent
    c(16, 19, 2, S.goldD),
  ],
  chest_rare: [
    // Chest body
    r(4, 14, 24, 14, "#1e3a5f", 2),
    r(5, 15, 22, 12, "#2563eb"),
    // Lid
    p("M4 14 Q4 8 16 8 Q28 8 28 14 Z", "#1e3a5f"),
    p("M5 14 Q5 9 16 9 Q27 9 27 14 Z", "#2563eb"),
    // Lock (ornate gold)
    r(13, 11, 6, 5, S.gold, 2),
    c(16, 14, 1.5, S.goldD),
    // Bands (gold)
    r(4, 16, 24, 2, S.gold),
    r(4, 22, 24, 2, S.gold),
    // Gems
    c(9, 19, 1.5, S.purple),
    c(16, 19, 1.5, S.ice),
    c(23, 19, 1.5, S.purple),
    // Glow
    c(16, 14, 3, "rgba(59, 130, 246, 0.3)"),
  ],
  chest_epic: [
    // Chest body
    r(4, 14, 24, 14, S.purpleD, 2),
    r(5, 15, 22, 12, S.purple),
    // Lid
    p("M4 14 Q4 8 16 8 Q28 8 28 14 Z", S.purpleD),
    p("M5 14 Q5 9 16 9 Q27 9 27 14 Z", S.purple),
    // Lock (ornate gold)
    r(13, 11, 6, 5, S.gold, 2),
    c(16, 14, 1.5, S.goldD),
    // Bands (gold)
    r(4, 16, 24, 2, S.gold),
    r(4, 22, 24, 2, S.gold),
    // Gems
    c(9, 19, 1.5, S.orange),
    c(16, 19, 2, S.gold),
    c(23, 19, 1.5, S.orange),
    // Glow
    c(16, 14, 3, "rgba(168, 85, 247, 0.3)"),
  ],

  // ============ STATUS ============
  idle: [
    // Standing figure silhouette
    c(16, 8, 4, S.steelL),
    r(12, 12, 8, 10, S.steel, 2),
    r(11, 22, 4, 6, S.steelD, 1),
    r(17, 22, 4, 6, S.steelD, 1),
    // Sparkle (ready)
    c(24, 6, 1.5, S.green),
    c(22, 4, 1, S.green),
  ],
  expedition: [
    // Walking figure
    c(16, 7, 4, S.steelL),
    r(12, 11, 8, 10, S.steel, 2),
    // Walking legs
    p("M13 21 L10 28", S.steelD),
    p("M19 21 L22 28", S.steelD),
    // Arm with pack
    p("M12 13 L8 18", S.steelD),
    // Backpack
    r(19, 12, 5, 7, S.leather, 1),
    // Motion lines
    p("M6 14 L3 14", S.stoneD),
    p("M6 17 L2 17", S.stoneD),
    p("M6 20 L4 20", S.stoneD),
  ],
  resting: [
    // Sleeping figure
    c(16, 14, 4, S.steelL),
    e(16, 22, 8, 5, S.steel),
    // Blanket
    e(16, 23, 9, 4, S.purpleD),
    // Zzz
    p("M22 6 L26 6 L22 10 L26 10", S.iceL),
    p("M25 3 L28 3 L25 6 L28 6", S.ice),
  ],
};

// Recipe icon mapping: recipe ID → sprite name
const RECIPE_SPRITE_MAP = {
  wooden_sword: "item_sword",
  stone_hammer: "item_hammer",
  leather_vest: "item_vest",
  herb_pouch: "item_pouch",
  apprentice_staff: "item_staff",
  iron_sword: "item_sword",
  iron_shield: "item_shield",
  chain_mail: "item_mail",
  scouts_ring: "item_ring",
  battle_axe: "item_axe",
  healers_charm: "item_charm",
  crystal_wand: "item_wand",
  arcane_tome: "item_tome",
  mithril_blade: "item_sword",
  dragonscale_armor: "item_plate",
  mystic_amulet: "item_amulet",
  warhammer: "item_hammer",
  void_staff: "item_staff",
  guardian_plate: "item_plate",
};

// Pixel art sprite imports (SVG-based animated pixel sprites)
import { warrior_pixel, ranger_pixel, mage_pixel, paladin_pixel } from "./pixelSprites";

// Register pixel art sprites (these override the flat SVG versions)
const PIXEL_SPRITES = {
  warrior_pixel: { type: "animated_pixel", frames: warrior_pixel, fps: 3 },
  ranger_pixel: { type: "animated_pixel", frames: ranger_pixel, fps: 3 },
  mage_pixel: { type: "animated_pixel", frames: mage_pixel, fps: 3 },
  paladin_pixel: { type: "animated_pixel", frames: paladin_pixel, fps: 3 },
};

/**
 * Get sprite data by name.
 * Returns a structured object with a `type` field:
 *   - { type: 'svg', shapes: [...] } for SVG sprites (current default)
 *   - { type: 'sprite', sheet, x, y, width, height, frames, fps } for sprite sheet entries
 *   - { type: 'animated_pixel', frames: [...], fps } for SVG-based pixel art with animation
 * Returns null if not found.
 */
export function getSpriteData(name) {
  // Check pixel art overrides first
  if (PIXEL_SPRITES[name]) return PIXEL_SPRITES[name];

  const entry = SPRITES[name] || (RECIPE_SPRITE_MAP[name] && SPRITES[RECIPE_SPRITE_MAP[name]]);
  if (!entry) return null;

  // New format: entry is an object with an explicit type
  if (entry && !Array.isArray(entry) && entry.type) {
    return entry;
  }

  // Legacy format: entry is an array of SVG shape descriptors
  return { type: "svg", shapes: entry };
}

/**
 * Get SVG shape array by name (legacy API, backwards compatible).
 * Returns the raw shape array for SVG sprites, or null for sprite-sheet entries.
 */
export function getSprite(name) {
  const data = getSpriteData(name);
  if (!data) return null;
  if (data.type === "svg") return data.shapes;
  // Non-SVG sprites don't return shape arrays
  return null;
}

export function getSpriteNames() {
  return Object.keys(SPRITES);
}

export default SPRITES;
