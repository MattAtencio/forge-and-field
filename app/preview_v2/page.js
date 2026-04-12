/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Sprite from "../../components/sprites/Sprite";

const V2_HEROES = [
  { name: "warrior_aldric", label: "Aldric (Warrior)", svgName: "warrior", pixelName: "warrior_pixel" },
  { name: "ranger_lyra", label: "Lyra (Ranger)", svgName: "ranger", pixelName: "ranger_pixel" },
  { name: "mage_theron", label: "Theron (Mage)", svgName: "mage", pixelName: "mage_pixel" },
  { name: "paladin_sera", label: "Sera (Paladin)", svgName: "paladin", pixelName: "paladin_pixel" },
];

const SIZES = [48, 64, 96];

const ENEMY_REGIONS = [
  {
    region: "Greenwood", color: "#22c55e",
    enemies: [
      { name: "goblin", label: "Goblin" },
      { name: "dire_wolf", label: "Dire Wolf" },
      { name: "forest_spider", label: "Forest Spider" },
      { name: "treant_elder", label: "Treant Elder (Boss)" },
    ],
  },
  {
    region: "Stormridge", color: "#94a3b8",
    enemies: [
      { name: "mountain_goat", label: "Mountain Goat" },
      { name: "rock_golem", label: "Rock Golem" },
      { name: "harpy", label: "Harpy" },
      { name: "stone_colossus", label: "Stone Colossus (Boss)" },
    ],
  },
  {
    region: "Dusthaven", color: "#fbbf24",
    enemies: [
      { name: "sand_scorpion", label: "Sand Scorpion" },
      { name: "bandit", label: "Bandit" },
      { name: "dust_wraith", label: "Dust Wraith" },
      { name: "bandit_king", label: "Bandit King (Boss)" },
    ],
  },
  {
    region: "Frostpeak", color: "#38bdf8",
    enemies: [
      { name: "ice_wolf", label: "Ice Wolf" },
      { name: "frost_elemental", label: "Frost Elemental" },
      { name: "snow_troll", label: "Snow Troll" },
      { name: "frost_wyrm", label: "Frost Wyrm (Boss)" },
    ],
  },
  {
    region: "Dragon's Reach", color: "#ef4444",
    enemies: [
      { name: "fire_imp", label: "Fire Imp" },
      { name: "drake", label: "Drake" },
      { name: "lava_serpent", label: "Lava Serpent" },
      { name: "obsidian_guardian", label: "Obsidian Guardian" },
      { name: "elder_dragon", label: "Elder Dragon (Boss)" },
    ],
  },
];

function EnemySprite({ name, label }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{
      background: "#1a1824",
      borderRadius: "8px",
      padding: "12px",
      textAlign: "center",
    }}>
      {failed ? (
        <div style={{
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4a4a5a",
          fontSize: "11px",
          border: "1px dashed #2a2838",
          borderRadius: "4px",
        }}>
          Pending
        </div>
      ) : (
        <img
          src={`/sprites/v2/enemies/${name}.png`}
          alt={label}
          loading="lazy"
          style={{
            imageRendering: "auto",
            borderRadius: "4px",
            border: "1px solid #2a2838",
            width: "100%",
            height: "auto",
          }}
          onError={() => setFailed(true)}
        />
      )}
      <p style={{
        fontSize: "11px",
        color: "#e8e0d4",
        marginTop: "6px",
        fontWeight: label.includes("Boss") ? "bold" : "normal",
      }}>
        {label}
      </p>
    </div>
  );
}

function EnemyRegions() {
  return ENEMY_REGIONS.map((region) => (
    <div key={region.region} style={{ marginBottom: "32px" }}>
      <h3 style={{ fontSize: "14px", color: region.color, marginBottom: "12px" }}>
        {region.region}
      </h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${region.enemies.length}, 1fr)`,
        gap: "16px",
      }}>
        {region.enemies.map((enemy) => (
          <EnemySprite key={enemy.name} name={enemy.name} label={enemy.label} />
        ))}
      </div>
    </div>
  ));
}

function SectionTitle({ children, color = "#94a3b8" }) {
  return (
    <h2 style={{
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "2px",
      color,
      marginBottom: "16px",
      borderBottom: `1px solid ${color}33`,
      paddingBottom: "8px",
    }}>
      {children}
    </h2>
  );
}

function VersionLabel({ children, color }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: "10px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#0f0e17",
      background: color,
      padding: "2px 8px",
      borderRadius: "3px",
      marginBottom: "8px",
    }}>
      {children}
    </span>
  );
}

export default function PreviewV2Page() {
  return (
    <div style={{
      background: "#0f0e17",
      minHeight: "100vh",
      padding: "40px",
      color: "#e8e0d4",
      fontFamily: "'Crimson Pro', Georgia, serif",
      position: "fixed",
      inset: 0,
      overflow: "auto",
      zIndex: 9999,
    }}>
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{
          fontSize: "28px",
          color: "#f97316",
          marginBottom: "8px",
          fontFamily: "'DM Serif Display', Georgia, serif",
        }}>
          Forge & Field — Sprite Evolution
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", fontFamily: "monospace" }}>
          Original SVG → V1 Pixel Art (code) → V2 AI-Generated (DALL-E 3)
        </p>
      </div>

      {/* === HERO COMPARISON GRID === */}
      <SectionTitle color="#f97316">Hero Comparison — Original → V1 → V2</SectionTitle>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "32px",
        marginBottom: "64px",
      }}>
        {V2_HEROES.map((hero) => (
          <div key={hero.name} style={{
            background: "#1a1824",
            borderRadius: "8px",
            padding: "20px",
            border: "1px solid #2a2838",
          }}>
            <h3 style={{
              fontSize: "14px",
              color: "#e8e0d4",
              marginBottom: "20px",
              textAlign: "center",
            }}>
              {hero.label}
            </h3>

            {/* Original SVG */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <VersionLabel color="#64748b">Original</VersionLabel>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
                gap: "8px",
                minHeight: "100px",
              }}>
                <Sprite name={hero.svgName} size={48} />
                <Sprite name={hero.svgName} size={64} />
              </div>
              <p style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "4px" }}>
                SVG shape arrays
              </p>
            </div>

            {/* V1 Pixel Art */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <VersionLabel color="#94a3b8">V1 Pixel</VersionLabel>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
                gap: "8px",
                minHeight: "100px",
              }}>
                <Sprite name={hero.pixelName} size={48} />
                <Sprite name={hero.pixelName} size={64} />
              </div>
              <p style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "4px" }}>
                Code-based pixel rects
              </p>
            </div>

            {/* V2 AI-Generated */}
            <div style={{ textAlign: "center" }}>
              <VersionLabel color="#f97316">V2 AI</VersionLabel>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}>
                <img
                  src={`/sprites/v2/${hero.name}.png`}
                  alt={hero.label}
                  width={200}
                  height={200}
                  style={{
                    imageRendering: "pixelated",
                    borderRadius: "4px",
                    border: "1px solid #2a2838",
                  }}
                />
              </div>
              <p style={{ fontSize: "10px", color: "#4a4a5a", marginTop: "4px" }}>
                DALL-E 3 Aseprite-style
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* === SIDE BY SIDE AT GAME SIZE === */}
      <SectionTitle color="#94a3b8">All Heroes at Game Size (64px)</SectionTitle>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "24px",
        marginBottom: "64px",
      }}>
        {/* Original row */}
        <div style={{
          background: "#1a1824",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
        }}>
          <VersionLabel color="#64748b">Original SVG</VersionLabel>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
            {V2_HEROES.map((h) => (
              <div key={h.svgName} style={{ textAlign: "center" }}>
                <Sprite name={h.svgName} size={64} />
                <p style={{ fontSize: "9px", color: "#4a4a5a", marginTop: "4px" }}>
                  {h.svgName}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* V1 row */}
        <div style={{
          background: "#1a1824",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
        }}>
          <VersionLabel color="#94a3b8">V1 Pixel Art</VersionLabel>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
            {V2_HEROES.map((h) => (
              <div key={h.pixelName} style={{ textAlign: "center" }}>
                <Sprite name={h.pixelName} size={64} />
                <p style={{ fontSize: "9px", color: "#4a4a5a", marginTop: "4px" }}>
                  {h.pixelName.replace("_pixel", "")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* V2 row */}
        <div style={{
          background: "#1a1824",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
        }}>
          <VersionLabel color="#f97316">V2 AI-Generated</VersionLabel>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
            {V2_HEROES.map((h) => (
              <div key={h.name} style={{ textAlign: "center" }}>
                <img
                  src={`/sprites/v2/${h.name}.png`}
                  alt={h.label}
                  width={64}
                  height={64}
                  style={{ imageRendering: "pixelated", borderRadius: "2px" }}
                />
                <p style={{ fontSize: "9px", color: "#4a4a5a", marginTop: "4px" }}>
                  {h.name.split("_")[0]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === V2 HERO DETAIL === */}
      <SectionTitle color="#f97316">V2 Hero Detail — Full Size</SectionTitle>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "24px",
        marginBottom: "48px",
      }}>
        {V2_HEROES.map((hero) => (
          <div key={hero.name} style={{
            background: "#1a1824",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
          }}>
            <img
              src={`/sprites/v2/${hero.name}.png`}
              alt={hero.label}
              width={280}
              height={280}
              style={{
                imageRendering: "auto",
                borderRadius: "4px",
                border: "1px solid #2a2838",
                width: "100%",
                height: "auto",
              }}
            />
            <p style={{
              fontSize: "13px",
              color: "#e8e0d4",
              marginTop: "8px",
              fontWeight: "bold",
            }}>
              {hero.label}
            </p>
          </div>
        ))}
      </div>

      {/* === GROUP SHOT === */}
      <SectionTitle color="#fbbf24">Party Lineup — V2</SectionTitle>

      <div style={{
        background: "#1a1824",
        borderRadius: "8px",
        padding: "24px",
        textAlign: "center",
        marginBottom: "48px",
      }}>
        <img
          src="/sprites/v2/heroes_group.png"
          alt="All four heroes"
          width={600}
          height={600}
          style={{
            imageRendering: "auto",
            borderRadius: "4px",
            border: "1px solid #2a2838",
            maxWidth: "600px",
            width: "100%",
            height: "auto",
          }}
        />
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
          Warrior &middot; Ranger &middot; Mage &middot; Paladin — unified Ember Glow aesthetic
        </p>
      </div>

      {/* === PIXELLAB PRODUCTION SPRITES === */}
      <SectionTitle color="#22c55e">PixelLab Sprites (True Pixel Art — Game Ready)</SectionTitle>

      <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "20px" }}>
        Generated natively at 32x32 via PixelLab AI. Every pixel intentionally placed.
        Rendered here with <code style={{ color: "#f97316" }}>image-rendering: pixelated</code>.
      </p>

      {/* PixelLab Heroes */}
      <h3 style={{ fontSize: "14px", color: "#f97316", marginBottom: "12px" }}>Heroes (4 directions)</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "32px",
      }}>
        {[
          { name: "aldric", label: "Aldric (Warrior)" },
          { name: "lyra", label: "Lyra (Ranger)" },
          { name: "theron", label: "Theron (Mage)" },
          { name: "sera", label: "Sera (Paladin)" },
        ].map((hero) => (
          <div key={hero.name} style={{
            background: "#1a1824",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "11px", color: "#e8e0d4", marginBottom: "12px", fontWeight: "bold" }}>
              {hero.label}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
              {["south", "east", "north", "west"].map((dir) => (
                <div key={dir} style={{ textAlign: "center" }}>
                  <img
                    src={`/sprites/pixellab/${hero.name}-${dir}.png`}
                    alt={`${hero.label} ${dir}`}
                    width={64}
                    height={64}
                    style={{ imageRendering: "pixelated" }}
                    onError={(e) => { e.target.style.opacity = "0.2"; }}
                  />
                  <p style={{ fontSize: "7px", color: "#4a4a5a" }}>{dir}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <div>
                <img
                  src={`/sprites/pixellab/${hero.name}-south.png`}
                  alt={hero.label}
                  width={96}
                  height={96}
                  style={{ imageRendering: "pixelated" }}
                  onError={(e) => { e.target.style.opacity = "0.2"; }}
                />
                <p style={{ fontSize: "8px", color: "#4a4a5a" }}>96px</p>
              </div>
              <div>
                <img
                  src={`/sprites/pixellab/${hero.name}-south.png`}
                  alt={hero.label}
                  width={128}
                  height={128}
                  style={{ imageRendering: "pixelated" }}
                  onError={(e) => { e.target.style.opacity = "0.2"; }}
                />
                <p style={{ fontSize: "8px", color: "#4a4a5a" }}>128px</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PixelLab Enemies */}
      {[
        {
          region: "Greenwood", color: "#22c55e",
          enemies: [
            { name: "goblin", label: "Goblin" },
            { name: "dire-wolf", label: "Dire Wolf" },
            { name: "forest-spider", label: "Forest Spider" },
            { name: "treant-elder", label: "Treant Elder (Boss)" },
          ],
        },
        {
          region: "Stormridge", color: "#94a3b8",
          enemies: [
            { name: "mountain-goat", label: "Mountain Goat" },
            { name: "rock-golem", label: "Rock Golem" },
            { name: "harpy", label: "Harpy" },
            { name: "stone-colossus", label: "Stone Colossus (Boss)" },
          ],
        },
      ].map((region) => (
        <div key={region.region} style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "14px", color: region.color, marginBottom: "12px" }}>
            {region.region} — Enemies
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}>
            {region.enemies.map((enemy) => (
              <div key={enemy.name} style={{
                background: "#1a1824",
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center",
              }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "12px", alignItems: "end" }}>
                  {[48, 64, 96].map((sz) => (
                    <div key={sz}>
                      <img
                        src={`/sprites/pixellab/${enemy.name}-south.png`}
                        alt={enemy.label}
                        width={sz}
                        height={sz}
                        style={{ imageRendering: "pixelated" }}
                        onError={(e) => { e.target.style.opacity = "0.2"; }}
                      />
                      <p style={{ fontSize: "8px", color: "#4a4a5a" }}>{sz}px</p>
                    </div>
                  ))}
                </div>
                <p style={{
                  fontSize: "11px",
                  color: "#e8e0d4",
                  marginTop: "8px",
                  fontWeight: enemy.label.includes("Boss") ? "bold" : "normal",
                }}>{enemy.label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* === DALL-E CONCEPTS (reference only) === */}
      <SectionTitle color="#64748b">DALL-E Concepts (Reference Art Only)</SectionTitle>

      <EnemyRegions />

      {/* === PRODUCTION SPRITES === */}
      <SectionTitle color="#22c55e">Production Sprites (32x32 Aseprite — Game Ready)</SectionTitle>

      <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "20px" }}>
        These are the final palette-locked 32x32 sprites rendered at game sizes.
        Use <code style={{ color: "#f97316" }}>imageRendering: pixelated</code> for crisp scaling.
      </p>

      {/* Production Heroes */}
      <h3 style={{ fontSize: "14px", color: "#f97316", marginBottom: "12px" }}>Heroes</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "32px",
      }}>
        {[
          { file: "heroes/warrior", label: "Aldric (Warrior)" },
          { file: "heroes/ranger", label: "Lyra (Ranger)" },
          { file: "heroes/mage", label: "Theron (Mage)" },
          { file: "heroes/paladin", label: "Sera (Paladin)" },
        ].map((s) => (
          <div key={s.file} style={{
            background: "#1a1824",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", alignItems: "end" }}>
              {[48, 64, 96, 128].map((sz) => (
                <div key={sz}>
                  <img
                    src={sz === 128 ? `/sprites/production/${s.file}-128px.png` : `/sprites/production/${s.file}.png`}
                    alt={s.label}
                    width={sz}
                    height={sz}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <p style={{ fontSize: "8px", color: "#4a4a5a", marginTop: "2px" }}>{sz}px</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "11px", color: "#e8e0d4", marginTop: "8px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Production Enemies */}
      {[
        {
          region: "Greenwood", color: "#22c55e",
          sprites: [
            { file: "enemies/greenwood/goblin", label: "Goblin" },
            { file: "enemies/greenwood/dire-wolf", label: "Dire Wolf" },
            { file: "enemies/greenwood/forest-spider", label: "Forest Spider" },
            { file: "enemies/greenwood/treant-elder", label: "Treant Elder (Boss)" },
          ],
        },
        {
          region: "Stormridge", color: "#94a3b8",
          sprites: [
            { file: "enemies/stormridge/mountain-goat", label: "Mountain Goat" },
            { file: "enemies/stormridge/rock-golem", label: "Rock Golem" },
            { file: "enemies/stormridge/harpy", label: "Harpy" },
            { file: "enemies/stormridge/stone-colossus", label: "Stone Colossus (Boss)" },
          ],
        },
      ].map((region) => (
        <div key={region.region} style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "14px", color: region.color, marginBottom: "12px" }}>
            {region.region}
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${region.sprites.length}, 1fr)`,
            gap: "16px",
          }}>
            {region.sprites.map((s) => (
              <div key={s.file} style={{
                background: "#1a1824",
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center",
              }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "end" }}>
                  {[48, 64, 96].map((sz) => (
                    <div key={sz}>
                      <img
                        src={`/sprites/production/${s.file}.png`}
                        alt={s.label}
                        width={sz}
                        height={sz}
                        style={{ imageRendering: "pixelated" }}
                      />
                      <p style={{ fontSize: "8px", color: "#4a4a5a", marginTop: "2px" }}>{sz}px</p>
                    </div>
                  ))}
                </div>
                <p style={{
                  fontSize: "11px",
                  color: "#e8e0d4",
                  marginTop: "6px",
                  fontWeight: s.label.includes("Boss") ? "bold" : "normal",
                }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* === PALETTE === */}
      <SectionTitle color="#94a3b8">Ember Glow Palette (14 colors)</SectionTitle>

      <div style={{
        display: "flex",
        gap: "4px",
        flexWrap: "wrap",
        marginBottom: "48px",
      }}>
        {[
          { name: "Void", hex: "#0f0e17" },
          { name: "Dark", hex: "#1a1824" },
          { name: "Parchment", hex: "#e8e0d4" },
          { name: "Ember", hex: "#f97316" },
          { name: "Flame", hex: "#fb923c" },
          { name: "Gold", hex: "#fbbf24" },
          { name: "Leather", hex: "#92400e" },
          { name: "Steel L", hex: "#cbd5e1" },
          { name: "Steel", hex: "#94a3b8" },
          { name: "Steel D", hex: "#64748b" },
          { name: "Forest", hex: "#22c55e" },
          { name: "Arcane", hex: "#a855f7" },
          { name: "Skin", hex: "#fcd5b0" },
          { name: "Danger", hex: "#ef4444" },
        ].map((c) => (
          <div key={c.name} style={{ textAlign: "center" }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: c.hex,
              border: "1px solid #333",
              borderRadius: "4px",
            }} />
            <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>{c.name}</p>
            <p style={{ fontSize: "8px", color: "#4a4a5a" }}>{c.hex}</p>
          </div>
        ))}
      </div>

      {/* === NOTES === */}
      <div style={{
        background: "#1a1824",
        borderRadius: "8px",
        padding: "20px",
        border: "1px solid #2a2838",
      }}>
        <SectionTitle color="#64748b">Art Direction Notes</SectionTitle>
        <ul style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.8", paddingLeft: "20px" }}>
          <li><strong>Original:</strong> SVG shape arrays — functional but flat, &ldquo;SaaS dashboard&rdquo; feel</li>
          <li><strong>V1:</strong> Code-based pixel rects — better identity but still crude, lacks depth and detail</li>
          <li><strong>V2:</strong> DALL-E 3 generated — proper pixel art aesthetic with depth, lighting, and character</li>
          <li><strong>Next step:</strong> Use V2 as reference art, then hand-refine in Aseprite at 32x32 with strict 14-color palette for final game sprites</li>
          <li><strong>Forge-touched accent:</strong> Every hero carries the ember-orange glow — sword edge, arrow tips, staff crystal, shield emblem</li>
        </ul>
      </div>

      <p style={{
        marginTop: "32px",
        fontSize: "11px",
        color: "#4a4a5a",
        fontFamily: "monospace",
      }}>
        /preview — original | /preview_v2 — this page | Generated {new Date().toISOString().split("T")[0]}
      </p>
    </div>
  );
}
