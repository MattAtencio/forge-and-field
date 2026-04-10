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

        {/* New Pixel Art Warrior */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "14px", marginBottom: "16px", color: "#f97316" }}>
            Pixel Art v1 (warrior_pixel) — Animated
          </h2>
          <div style={{ display: "flex", gap: "16px", alignItems: "end" }}>
            <div>
              <Sprite name="warrior_pixel" size={32} />
              <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>32px</p>
            </div>
            <div>
              <Sprite name="warrior_pixel" size={48} />
              <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>48px</p>
            </div>
            <div>
              <Sprite name="warrior_pixel" size={64} />
              <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>64px</p>
            </div>
            <div>
              <Sprite name="warrior_pixel" size={96} />
              <p style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>96px</p>
            </div>
          </div>
        </div>
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
