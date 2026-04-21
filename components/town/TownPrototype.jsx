"use client";

// Track B Iter 1 — sealed-from-game-state town diorama. See:
//   docs/specs/46-town-prototype-scaffold.md
//   docs/TWO_TRACK_PLAN.md (Camera/Input Locks + Visual Locks sections)
// Placeholder rectangles only; the camera feel is what we're judging this round.

import { useCallback, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./TownPrototype.module.css";

// Integer-only zoom levels per Visual Lock. Non-integer zoom on pixel art is a
// visual crime in this genre per the art review.
const ZOOM_LEVELS = [0.5, 1, 2];
const DEFAULT_ZOOM = 1;

// 5px movement hysteresis per Camera/Input Lock — distance, not time.
const CLICK_DRAG_THRESHOLD_PX = 5;

const BUILDINGS = [
  { id: "forge", name: "Forge" },
  { id: "barracks", name: "Barracks" },
  { id: "gate", name: "Gate" },
  { id: "market", name: "Market" },
];

// Snap a continuous scale produced by the lib's wheel/double-click into the
// nearest allowed integer level. Required because the lib doesn't natively
// constrain to a discrete set.
function snapToLevel(scale) {
  let nearest = ZOOM_LEVELS[0];
  let bestDelta = Math.abs(scale - nearest);
  for (const level of ZOOM_LEVELS) {
    const d = Math.abs(scale - level);
    if (d < bestDelta) {
      nearest = level;
      bestDelta = d;
    }
  }
  return nearest;
}

export default function TownPrototype() {
  const transformRef = useRef(null);
  const pointerDownRef = useRef(null); // { x, y, target } for click-vs-drag
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);

  // After every wheel zoom, snap to the nearest integer level. The lib's wheel
  // step produces continuous scales, so we correct on stop. We jump to the
  // snapped scale with a short animation so the user perceives the snap.
  const handleWheelStop = useCallback((ref) => {
    const snapped = snapToLevel(ref.state.scale);
    if (Math.abs(snapped - ref.state.scale) > 0.001) {
      ref.setTransform(ref.state.positionX, ref.state.positionY, snapped, 120);
    }
    setCurrentZoom(snapped);
  }, []);

  const handleZoomStop = useCallback((ref) => {
    setCurrentZoom(snapToLevel(ref.state.scale));
  }, []);

  const handleTransform = useCallback((_ref, state) => {
    setCurrentZoom(snapToLevel(state.scale));
  }, []);

  // Click-vs-drag uses pointer position delta. We capture pointerdown on the
  // scene and only allow the click handler to fire if movement < threshold.
  const handlePointerDown = useCallback((e) => {
    pointerDownRef.current = {
      x: e.clientX,
      y: e.clientY,
      target: e.target,
    };
  }, []);

  const handleBuildingClick = useCallback((buildingName, e) => {
    const start = pointerDownRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dist = Math.hypot(dx, dy);
    if (dist >= CLICK_DRAG_THRESHOLD_PX) return; // dragged, not clicked
    // Iter 1 deliberately logs only — no real navigation per spec.
    console.log(`would enter ${buildingName}`);
  }, []);

  const setZoomLevel = useCallback((level) => {
    if (!transformRef.current) return;
    const ref = transformRef.current;
    // centerView preserves the scene center while changing scale, so the
    // dev-affordance buttons feel like a clean snap rather than a teleport.
    ref.centerView(level, 220);
  }, []);

  // Rubber-band assist: react-zoom-pan-pinch's hard bounds clamp can feel
  // mechanical at the edge. We can't easily inject overpan, but we can ensure
  // that on panning stop the lib re-centers smoothly via velocityAnimation
  // (300ms inertia decay below). The "spring back" cue comes from the inertia
  // tail clamping into bounds.
  useEffect(() => {
    // Surface the integer-zoom contract in dev only. WHY: helps the founder
    // verify wheel behavior at Iter 1 review without cracking open devtools.
    if (typeof window !== "undefined") {
      window.__townPrototypeZoomLevels = ZOOM_LEVELS;
    }
  }, []);

  return (
    <div className={styles.root}>
      <TransformWrapper
        ref={transformRef}
        initialScale={DEFAULT_ZOOM}
        minScale={ZOOM_LEVELS[0]}
        maxScale={ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
        limitToBounds={true}
        centerOnInit={true}
        smooth={true}
        wheel={{
          step: 0.2,
          // Cursor-anchored zoom is the lib default for wheel. Kept explicit
          // here as a comment: do NOT enable centerZoomedOut, that flips it.
        }}
        doubleClick={{ disabled: true }}
        panning={{
          velocityDisabled: false,
          allowLeftClickPan: true,
        }}
        velocityAnimation={{
          // ~300ms inertia decay per Camera/Input Locks.
          animationTime: 300,
          sensitivityMouse: 1,
        }}
        autoAlignment={{
          // Spring-back into bounds after rubber-band overshoot. Short enough
          // to feel responsive, long enough to read as "spring."
          sizeX: 60,
          sizeY: 60,
          animationTime: 220,
        }}
        onWheelStop={handleWheelStop}
        onZoomStop={handleZoomStop}
        onTransform={handleTransform}
      >
        {() => (
          <>
            <TransformComponent
              wrapperClass={styles.transformWrapper}
              contentClass={styles.transformComponent}
            >
              <div
                className={styles.scene}
                onPointerDown={handlePointerDown}
              >
                {/* Background silhouette cluster — non-interactive. */}
                <div className={styles.bgCluster}>
                  <div className={`${styles.bgRoof} ${styles.bgRoof1}`} />
                  <div className={`${styles.bgRoof} ${styles.bgRoof2}`} />
                  <div className={`${styles.bgRoof} ${styles.bgRoof3}`} />
                  <div className={`${styles.bgRoof} ${styles.bgRoof4}`} />
                  <div className={`${styles.bgRoof} ${styles.bgRoof5}`} />
                </div>

                {/* Gate — archway with negative space cutout. */}
                <div
                  className={`${styles.building} ${styles.gate}`}
                  onClick={(e) => handleBuildingClick("Gate", e)}
                >
                  <span className={styles.label}>Gate</span>
                </div>

                {/* Forge — sole warm emissive in the scene. */}
                <div
                  className={`${styles.building} ${styles.forge}`}
                  onClick={(e) => handleBuildingClick("Forge", e)}
                >
                  <div className={styles.forgeGlow} />
                  <div className={styles.forgeBase} />
                  <div className={styles.forgeChimney} />
                  <div className={styles.forgeDoor} />
                  <div className={styles.smoke} />
                  <div className={styles.ember} />
                  <span className={styles.label}>Forge</span>
                </div>

                {/* Barracks — long low + pennants. */}
                <div
                  className={`${styles.building} ${styles.barracks}`}
                  onClick={(e) => handleBuildingClick("Barracks", e)}
                >
                  <div className={styles.barracksRoof} />
                  <div className={`${styles.barracksPennant} ${styles.barracksPennant1}`} />
                  <div className={`${styles.barracksPennant} ${styles.barracksPennant2}`} />
                  <div className={`${styles.barracksPennant} ${styles.barracksPennant3}`} />
                  <span className={styles.label}>Barracks</span>
                </div>

                {/* Market — striped awning color-pop. */}
                <div
                  className={`${styles.building} ${styles.market}`}
                  onClick={(e) => handleBuildingClick("Market", e)}
                >
                  <div className={styles.marketAwning} />
                  <span className={styles.label}>Market</span>
                </div>

                {/* ~10 prop placeholders — non-interactive uniform squares. */}
                <div className={styles.prop} style={{ left: "12%", bottom: "30%" }} />
                <div className={styles.prop} style={{ left: "22%", bottom: "31%" }} />
                <div className={styles.prop} style={{ left: "26%", bottom: "30%" }} />
                <div className={styles.prop} style={{ left: "38%", bottom: "30%" }} />
                <div className={styles.prop} style={{ left: "44%", bottom: "31%" }} />
                <div className={styles.prop} style={{ left: "57%", bottom: "30%" }} />
                <div className={styles.prop} style={{ left: "62%", bottom: "31%" }} />
                <div className={styles.prop} style={{ left: "68%", bottom: "30%" }} />
                <div className={styles.prop} style={{ left: "76%", bottom: "31%" }} />
                <div className={styles.prop} style={{ left: "85%", bottom: "30%" }} />
              </div>
            </TransformComponent>

            {/* Dev affordances — live OUTSIDE the TransformComponent so they
                stay anchored to the viewport during pan/zoom. */}
            <div className={styles.zoomIndicator}>
              ZOOM {currentZoom}×
            </div>
            <div className={styles.zoomButtons}>
              {ZOOM_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`${styles.zoomBtn} ${
                    currentZoom === level ? styles.zoomBtnActive : ""
                  }`}
                  onClick={() => setZoomLevel(level)}
                >
                  {level}×
                </button>
              ))}
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
