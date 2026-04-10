"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Sprite.module.css";

/**
 * Renders SVG-based pixel art with frame animation.
 * Each frame is an array of SVG shape descriptors (same format as spriteRegistry).
 * Cycles through frames at the given fps for idle breathing animation.
 */

function renderShape(shape, i) {
  switch (shape.t) {
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
    case "path":
      return <path key={i} d={shape.d} fill={shape.fill || "none"} />;
    default:
      return null;
  }
}

export default function AnimatedPixelSprite({
  frames,
  fps = 3,
  size = 48,
  animated = true,
  muted = false,
  animate = "",
  className = "",
}) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!animated || !frames || frames.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 1000 / fps);

    return () => clearInterval(intervalRef.current);
  }, [animated, frames, fps]);

  if (!frames || frames.length === 0) return null;

  const shapes = frames[currentFrame] || frames[0];
  const animClass = animate ? styles[animate] || "" : "";

  return (
    <svg
      className={`${styles.sprite} ${muted ? styles.muted : ""} ${animClass} ${className}`}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ imageRendering: "pixelated" }}
    >
      {shapes.map(renderShape)}
    </svg>
  );
}
