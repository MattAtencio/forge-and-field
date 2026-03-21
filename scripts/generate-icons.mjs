/**
 * Generate PWA icons from SVG template using sharp.
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// Forgelight palette
const P = {
  bg: "#07070f",
  orange: "#f97316",
  orangeD: "#ea580c",
  gold: "#fbbf24",
  goldD: "#d97706",
  steel: "#94a3b8",
  steelD: "#64748b",
  steelL: "#cbd5e1",
  wood: "#a16207",
  woodD: "#78350f",
};

// App icon SVG — anvil, hammer, sparks on dark background with rounded corners
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="96" ry="96" fill="${P.bg}"/>

  <!-- Subtle radial glow behind anvil -->
  <defs>
    <radialGradient id="glow" cx="50%" cy="55%" r="35%">
      <stop offset="0%" stop-color="${P.orange}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${P.orange}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="256" cy="300" rx="180" ry="140" fill="url(#glow)"/>

  <!-- Fire underneath anvil -->
  <path d="M180 390 Q210 350 240 390 Q260 340 280 390 Q310 350 340 390"
        fill="none" stroke="${P.orange}" stroke-width="10" stroke-linecap="round"/>
  <path d="M200 400 Q230 365 260 400 Q285 360 310 400"
        fill="none" stroke="${P.gold}" stroke-width="8" stroke-linecap="round"/>

  <!-- Anvil body -->
  <rect x="150" y="280" width="220" height="50" rx="6" fill="${P.steelD}"/>
  <rect x="130" y="260" width="260" height="40" rx="8" fill="${P.steel}"/>
  <!-- Anvil highlight -->
  <rect x="140" y="262" width="240" height="8" rx="4" fill="${P.steelL}" opacity="0.4"/>
  <!-- Anvil legs -->
  <rect x="170" y="330" width="40" height="70" rx="4" fill="${P.steelD}"/>
  <rect x="310" y="330" width="40" height="70" rx="4" fill="${P.steelD}"/>

  <!-- Hammer handle -->
  <rect x="330" y="130" width="16" height="130" rx="4" fill="${P.wood}"
        transform="rotate(-20, 338, 195)"/>
  <rect x="332" y="130" width="8" height="130" rx="3" fill="${P.woodD}" opacity="0.4"
        transform="rotate(-20, 338, 195)"/>

  <!-- Hammer head -->
  <rect x="300" y="90" width="80" height="55" rx="8" fill="${P.steelD}"
        transform="rotate(-20, 340, 117)"/>
  <rect x="305" y="95" width="70" height="20" rx="4" fill="${P.steel}"
        transform="rotate(-20, 340, 105)"/>

  <!-- Sparks -->
  <circle cx="240" cy="220" r="10" fill="${P.orange}"/>
  <circle cx="200" cy="195" r="7" fill="${P.gold}"/>
  <circle cx="280" cy="190" r="8" fill="${P.orange}"/>
  <circle cx="170" cy="215" r="5" fill="${P.gold}"/>
  <circle cx="305" cy="200" r="6" fill="${P.gold}"/>
  <circle cx="220" cy="180" r="5" fill="${P.orangeD}"/>
  <circle cx="260" cy="175" r="4" fill="${P.gold}"/>

  <!-- Small spark trails -->
  <circle cx="185" cy="175" r="3" fill="${P.gold}" opacity="0.7"/>
  <circle cx="295" cy="170" r="3" fill="${P.orange}" opacity="0.7"/>
  <circle cx="230" cy="160" r="2.5" fill="${P.gold}" opacity="0.5"/>
</svg>`;

const sizes = [192, 512];

for (const size of sizes) {
  const outPath = join(publicDir, `icon-${size}.png`);
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
  console.log(`Created ${outPath}`);
}

// Also generate apple-touch-icon (180x180)
const applePath = join(publicDir, "apple-touch-icon.png");
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(applePath);
console.log(`Created ${applePath}`);

// Generate favicon (32x32)
const faviconPath = join(publicDir, "favicon.png");
await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(faviconPath);
console.log(`Created ${faviconPath}`);

console.log("\nDone! PWA icons generated.");
