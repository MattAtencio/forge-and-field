"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Sprite.module.css";

/**
 * Renders a single sprite from a pixel art sprite sheet using canvas.
 * Handles frame animation for multi-frame sprites.
 *
 * @param {Object} props
 * @param {string} props.sheet - path to the sprite sheet image (e.g. '/sprites/heroes.png')
 * @param {number} props.x - x offset of the first frame on the sheet (px)
 * @param {number} props.y - y offset on the sheet (px)
 * @param {number} props.width - width of a single frame (px)
 * @param {number} props.height - height of a single frame (px)
 * @param {number} [props.frames=1] - number of animation frames (laid out horizontally)
 * @param {number} [props.fps=4] - animation speed in frames per second
 * @param {number} [props.size=24] - rendered size (square)
 * @param {boolean} [props.animated=true] - whether to cycle frames
 * @param {boolean} [props.muted=false] - dim/desaturate the sprite
 * @param {string} [props.animate=''] - CSS animation class name (float, glow, shake, etc.)
 * @param {string} [props.className=''] - additional CSS class
 */
export default function SpriteSheet({
  sheet,
  x,
  y,
  width,
  height,
  frames = 1,
  fps = 4,
  size = 24,
  animated = true,
  muted = false,
  animate = "",
  className = "",
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(0);

  // Load the sprite sheet image once
  useEffect(() => {
    const img = new Image();
    img.src = sheet;
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
  }, [sheet]);

  // Draw the current frame and animate
  useEffect(() => {
    if (!loaded || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    // For single-frame or non-animated sprites, draw once
    if (frames <= 1 || !animated) {
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
      return;
    }

    // Animate through frames
    frameRef.current = 0;
    let animId;
    let lastTime = 0;
    const interval = 1000 / fps;

    function tick(time) {
      const delta = time - lastTime;
      if (delta >= interval) {
        lastTime = time - (delta % interval);
        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = false;
        const frameX = x + frameRef.current * width;
        ctx.drawImage(img, frameX, y, width, height, 0, 0, width, height);
        frameRef.current = (frameRef.current + 1) % frames;
      }
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [loaded, x, y, width, height, frames, fps, animated]);

  const animClass = animate ? styles[animate] || "" : "";

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`${styles.sprite} ${muted ? styles.muted : ""} ${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    />
  );
}
