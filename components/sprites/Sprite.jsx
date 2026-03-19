"use client";

import { getSprite } from "./spriteRegistry";
import styles from "./Sprite.module.css";

function renderShape(shape, i) {
  switch (shape.t) {
    case "path":
      return <path key={i} d={shape.d} fill={shape.fill || "none"} />;
    case "rect":
      return (
        <rect
          key={i}
          x={shape.x}
          y={shape.y}
          width={shape.w}
          height={shape.h}
          fill={shape.fill}
          rx={shape.rx || 0}
        />
      );
    case "circle":
      return <circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill} />;
    case "ellipse":
      return (
        <ellipse key={i} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill={shape.fill} />
      );
    default:
      return null;
  }
}

export default function Sprite({ name, size = 24, className = "", muted = false, animate = "" }) {
  const shapes = getSprite(name);

  // Fallback: render as text if sprite not found (handles emoji or unknown names)
  if (!shapes) {
    return (
      <span
        className={`${styles.fallback} ${className}`}
        style={{ fontSize: size * 0.8, width: size, height: size }}
      >
        {name}
      </span>
    );
  }

  const animClass = animate ? styles[animate] || "" : "";

  return (
    <svg
      className={`${styles.sprite} ${muted ? styles.muted : ""} ${animClass} ${className}`}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {shapes.map(renderShape)}
    </svg>
  );
}
