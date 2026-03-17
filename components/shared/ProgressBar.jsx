"use client";

export default function ProgressBar({ value, max, color = "#f97316", height = 6, label }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div
          style={{
            fontSize: "0.65rem",
            color: "#8888a0",
            marginBottom: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{label}</span>
          <span>
            {Math.floor(value)} / {max}
          </span>
        </div>
      )}
      <div
        style={{
          width: "100%",
          height,
          background: "rgba(255,255,255,0.06)",
          borderRadius: height / 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: height / 2,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
