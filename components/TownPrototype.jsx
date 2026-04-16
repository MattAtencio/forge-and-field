"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./TownPrototype.module.css";

// Iter 1 placeholder scene — hand-painted assets land in Iter 2.
// Scene size targets art-lock: 2.5x viewport wide, 1.5x tall (viewport ~430px).
const SCENE_W = 1075;
const SCENE_H = 645;

const BUILDINGS = [
  {
    id: "forge",
    name: "The Forge",
    // Tall asymmetric silhouette with a chimney lean — placeholder expresses the lock.
    x: 110, y: 200, w: 180, h: 220,
    emissive: true,
  },
  { id: "barracks", name: "Barracks", x: 360, y: 300, w: 240, h: 140 },
  { id: "market", name: "Market", x: 480, y: 470, w: 140, h: 100 },
  { id: "gate", name: "World Map Gate", x: 800, y: 260, w: 160, h: 200, isArch: true },
];

function BuildingHotspot({ b }) {
  return (
    <button
      type="button"
      className={`${styles.hotspot} ${b.emissive ? styles.emissive : ""} ${b.isArch ? styles.arch : ""}`}
      style={{
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
      }}
      onClick={() => console.log(`would enter ${b.id}`)}
      aria-label={b.name}
    >
      <span className={styles.hotspotLabel}>{b.name}</span>
    </button>
  );
}

export default function TownPrototype() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Forge & Field — Town Prototype (Iter 1)</h1>
        <p className={styles.caption}>
          Drag to pan · Scroll / pinch to zoom (0.5× – 2×) · Click a building to log intent · No game state wired
        </p>
      </header>
      <div className={styles.viewport}>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={2}
          limitToBounds={true}
          centerZoomedOut={true}
          wheel={{ step: 0.12, smoothStep: 0.005 }}
          pinch={{ step: 8 }}
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: false }}
        >
          <TransformComponent
            wrapperClass={styles.wrapper}
            contentClass={styles.content}
          >
            <div
              className={styles.scene}
              style={{ width: SCENE_W, height: SCENE_H }}
            >
              <div className={styles.sky} />
              <div className={styles.ground} />
              <div className={styles.siloCluster} aria-hidden="true" />
              {BUILDINGS.map((b) => (
                <BuildingHotspot key={b.id} b={b} />
              ))}
              <div className={styles.chimneySmoke} aria-hidden="true" />
              <div className={styles.emberGlow} aria-hidden="true" />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
