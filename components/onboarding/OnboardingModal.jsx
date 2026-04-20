"use client";

import { useRef, useState } from "react";
import Sprite from "@/components/sprites/Sprite";
import PixelFrame from "@/components/shared/PixelFrame";
import styles from "./OnboardingModal.module.css";

const SLIDES = [
  {
    icon: "forge",
    title: "Welcome to Forge & Field",
    text: "The forge is yours. Raise heroes, shape gear, and push the field further each season.",
  },
  {
    icon: "wood",
    title: "Gather Resources",
    text: "The forge fills its own coffers in your absence. When you return, the stockpile waits.",
  },
  {
    icon: "barracks",
    title: "Craft & Equip",
    text: "Spend what you gather on weapons, armor, and trinkets. Every piece rolls its own rarity — Common to Epic.",
  },
  {
    icon: "map",
    title: "Send Expeditions",
    text: "Send heroes afield for loot and resources. The stronger the hero, the richer the return.",
  },
  {
    icon: "season",
    title: "Seasonal Events",
    text: "Each week a new season opens — fresh bounties, a reward track, and levels that unlock what comes next.",
  },
];

export default function OnboardingModal({ onComplete }) {
  const [slide, setSlide] = useState(0);
  // Track direction so CSS can animate next→right, back→left.
  const [direction, setDirection] = useState("next");
  const prevSlide = useRef(0);
  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  const goTo = (nextIndex) => {
    setDirection(nextIndex > prevSlide.current ? "next" : "back");
    prevSlide.current = nextIndex;
    setSlide(nextIndex);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <PixelFrame variant="parchment" className={styles.frame}>
          {/* key forces remount so @keyframes entrance fires on every slide change */}
          <div
            key={slide}
            className={`${styles.slideContent} ${
              direction === "back" ? styles.slideBack : styles.slideNext
            }`}
          >
            <span className={styles.iconWrap}>
              <span className={styles.iconGlow} aria-hidden="true" />
              <span className={styles.icon}>
                <Sprite name={current.icon} size={48} />
              </span>
            </span>
            <h2 className={styles.title}>{current.title}</h2>
            <p className={styles.text}>{current.text}</p>
          </div>

          <div className={styles.dotTrack} aria-hidden="true">
            <span className={styles.dotLine} />
            <div className={styles.dots}>
              {SLIDES.map((_, i) => {
                const state =
                  i === slide
                    ? styles.dotActive
                    : i < slide
                    ? styles.dotPassed
                    : styles.dotFuture;
                return <span key={i} className={`${styles.dot} ${state}`} />;
              })}
            </div>
          </div>

          <div className={styles.actions}>
            {slide > 0 && (
              <button
                className={styles.backBtn}
                onClick={() => goTo(slide - 1)}
              >
                Back
              </button>
            )}
            <button
              className={`${styles.nextBtn} ${isLast ? styles.nextBtnFinal : ""}`}
              onClick={() => {
                if (isLast) {
                  onComplete();
                } else {
                  goTo(slide + 1);
                }
              }}
            >
              {isLast ? "Start Playing" : "Next"}
            </button>
          </div>
        </PixelFrame>
      </div>
    </div>
  );
}
