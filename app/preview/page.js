"use client";

import Sprite from "../../components/sprites/Sprite";

export default function PreviewPage() {
  return (
    <div style={{
      background: "#0f0e17",
      minHeight: "100vh",
      padding: "40px",
      color: "#e8e0d4",
      fontFamily: "monospace",
    }}>
      <h1 style={{ fontSize: "24px", marginBottom: "32px", color: "#f97316" }}>
        Forge & Field — Sprite Preview
      </h1>

      <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
        {/* Old SVG Warrior */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "14px", marginBottom: "16px", color: "#94a3b8" }}>
            Current SVG (warrior)
          </h2>
          <div style={{ display: "flex", gap: "16px", alignItems: "end" }}>
            <div>
              <Sprite name="warrior" size={32} />
              <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>32px</p>
            </div>
            <div>
              <Sprite name="warrior" size={48} />
              <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>48px</p>
            </div>
            <div>
              <Sprite name="warrior" size={64} />
              <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>64px</p>
            </div>
            <div>
              <Sprite name="warrior" size={96} />
              <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>96px</p>
            </div>
          </div>
        </div>

        {/* Pixel Art Heroes */}
        {[
          { name: "warrior_pixel", label: "Aldric (Warrior)" },
          { name: "ranger_pixel", label: "Lyra (Ranger)" },
          { name: "mage_pixel", label: "Theron (Mage)" },
          { name: "paladin_pixel", label: "Sera (Paladin)" },
        ].map((hero) => (
          <div key={hero.name} style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "14px", marginBottom: "16px", color: "#f97316" }}>
              {hero.label} — Pixel Art
            </h2>
            <div style={{ display: "flex", gap: "16px", alignItems: "end" }}>
              {[32, 48, 64, 96].map((size) => (
                <div key={size}>
                  <Sprite name={hero.name} size={size} />
                  <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>{size}px</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* All heroes comparison */}
      <div style={{ marginTop: "48px" }}>
        <h2 style={{ fontSize: "14px", marginBottom: "16px", color: "#94a3b8" }}>
          All Heroes (current SVG) at 64px
        </h2>
        <div style={{ display: "flex", gap: "24px" }}>
          {["warrior", "ranger", "mage", "paladin"].map((name) => (
            <div key={name} style={{ textAlign: "center" }}>
              <Sprite name={name} size={64} />
              <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* All pixel art heroes comparison */}
      <div style={{ marginTop: "48px" }}>
        <h2 style={{ fontSize: "14px", marginBottom: "16px", color: "#f97316" }}>
          All Heroes (Pixel Art) at 64px
        </h2>
        <div style={{ display: "flex", gap: "24px" }}>
          {[
            { name: "warrior_pixel", label: "Aldric" },
            { name: "ranger_pixel", label: "Lyra" },
            { name: "mage_pixel", label: "Theron" },
            { name: "paladin_pixel", label: "Sera" },
          ].map((hero) => (
            <div key={hero.name} style={{ textAlign: "center" }}>
              <Sprite name={hero.name} size={64} />
              <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{hero.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ ENEMIES ============ */}
      <div style={{ marginTop: "48px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "24px", color: "#ef4444" }}>
          Enemy Pixel Sprites
        </h2>

        {/* Greenwood */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "12px", color: "#22c55e" }}>
            Greenwood
          </h3>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { name: "goblin_pixel", label: "Goblin" },
              { name: "wolf_pixel", label: "Dire Wolf" },
              { name: "forest_spider_pixel", label: "Forest Spider" },
              { name: "treant_elder_pixel", label: "Treant Elder (Boss)" },
            ].map((enemy) => (
              <div key={enemy.name} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "end" }}>
                  <div>
                    <Sprite name={enemy.name} size={48} />
                    <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>48px</p>
                  </div>
                  <div>
                    <Sprite name={enemy.name} size={64} />
                    <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>64px</p>
                  </div>
                </div>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{enemy.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stormridge */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "12px", color: "#94a3b8" }}>
            Stormridge
          </h3>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { name: "mountain_goat_pixel", label: "Mountain Goat" },
              { name: "rock_golem_pixel", label: "Rock Golem" },
              { name: "harpy_pixel", label: "Harpy" },
              { name: "stone_colossus_pixel", label: "Stone Colossus (Boss)" },
            ].map((enemy) => (
              <div key={enemy.name} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "end" }}>
                  <div>
                    <Sprite name={enemy.name} size={48} />
                    <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>48px</p>
                  </div>
                  <div>
                    <Sprite name={enemy.name} size={64} />
                    <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>64px</p>
                  </div>
                </div>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{enemy.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dusthaven (pending) */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "12px", color: "#fbbf24" }}>
            Dusthaven (sprites pending)
          </h3>
          <p style={{ fontSize: "11px", color: "#4a4a5a" }}>
            bandit, bandit_leader, sandworm, sandworm_queen
          </p>
        </div>

        {/* Frostpeak (pending) */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "12px", color: "#38bdf8" }}>
            Frostpeak (sprites pending)
          </h3>
          <p style={{ fontSize: "11px", color: "#4a4a5a" }}>
            ice_wraith, frost_bear, frost_dragon
          </p>
        </div>

        {/* Dragon's Reach */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "12px", color: "#ef4444" }}>
            Dragon&apos;s Reach
          </h3>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { name: "fire_imp_pixel", label: "Fire Imp" },
              { name: "drake_pixel", label: "Drake" },
              { name: "lava_serpent_pixel", label: "Lava Serpent" },
              { name: "obsidian_guardian_pixel", label: "Obsidian Guardian" },
              { name: "elder_dragon_pixel", label: "Elder Dragon (Boss)" },
            ].map((enemy) => (
              <div key={enemy.name} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "end" }}>
                  <div>
                    <Sprite name={enemy.name} size={48} />
                    <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>48px</p>
                  </div>
                  <div>
                    <Sprite name={enemy.name} size={64} />
                    <p style={{ fontSize: "9px", color: "#64748b", marginTop: "2px" }}>64px</p>
                  </div>
                </div>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{enemy.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ember Glow palette swatch */}
      <div style={{ marginTop: "48px" }}>
        <h2 style={{ fontSize: "14px", marginBottom: "16px", color: "#94a3b8" }}>
          Ember Glow Palette (14 colors)
        </h2>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
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
      </div>

      <p style={{ marginTop: "48px", fontSize: "12px", color: "#4a4a5a" }}>
        Visit /preview to compare sprites. The pixel art version uses SVG rects for v1 —
        replace with real Aseprite sprite sheets later using the dual-mode Sprite component.
      </p>
    </div>
  );
}
