"use client";

import { getSpriteData } from "./spriteRegistry";
import SpriteSheet from "./SpriteSheet";
import AnimatedPixelSprite from "./AnimatedPixelSprite";
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

export default function Sprite({ name, size = 24, className = "", muted = false, animate = "", animated = true }) {
  let data = getSpriteData(name);

  // Some recipe icons carry a rarity prefix (e.g. "star_iron_shield") that the
  // registry doesn't have a sheet for; fall back to the base icon before going to text.
  if (!data && typeof name === "string" && name.startsWith("star_")) {
    data = getSpriteData(name.slice(5));
  }

  // Fallback: render as text if sprite not found (handles emoji or unknown names)
  if (!data) {
    return (
      <span
        className={`${styles.fallback} ${className}`}
        style={{ fontSize: size * 0.8, width: size, height: size }}
      >
        {name}
      </span>
    );
  }

  // SVG-based animated pixel art
  if (data.type === "animated_pixel") {
    return (
      <AnimatedPixelSprite
        frames={data.frames}
        fps={data.fps || 3}
        size={size}
        animated={animated}
        muted={muted}
        animate={animate}
        className={className}
      />
    );
  }

  // PixelLab PNG sprite (true pixel art)
  if (data.type === "image") {
    const animClass = animate ? styles[animate] || "" : "";
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.src}
        alt={name}
        width={size}
        height={size}
        className={`${styles.sprite} ${muted ? styles.muted : ""} ${animClass} ${className}`}
        style={{ imageRendering: "pixelated" }}
        aria-hidden="true"
      />
    );
  }

  // Pixel art sprite sheet
  if (data.type === "sprite") {
    return (
      <SpriteSheet
        sheet={data.sheet}
        x={data.x}
        y={data.y}
        width={data.width}
        height={data.height}
        frames={data.frames || 1}
        fps={data.fps || 4}
        size={size}
        animated={animated}
        muted={muted}
        animate={animate}
        className={className}
      />
    );
  }

  // SVG sprite (default)
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
      {data.shapes.map(renderShape)}
    </svg>
  );
}
