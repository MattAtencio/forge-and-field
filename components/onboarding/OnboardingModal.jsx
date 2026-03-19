"use client";

import { useState } from "react";
import Sprite from "@/components/sprites/Sprite";
import styles from "./OnboardingModal.module.css";

const SLIDES = [
  {
    icon: "forge",
    title: "Welcome to Forge & Field",
    text: "Collect resources, craft powerful gear, and send heroes on epic expeditions.",
  },
  {
    icon: "wood",
    title: "Gather Resources",
    text: "Resources generate passively over time — even while you're away. Check back to collect your stockpile.",
  },
  {
    icon: "barracks",
    title: "Craft & Equip",
    text: "Use resources to craft weapons, armor, and accessories. Each item rolls a rarity — Common, Uncommon, Rare, or Epic.",
  },
  {
    icon: "map",
    title: "Send Expeditions",
    text: "Assign heroes to missions for bonus resources and rare loot. Stronger heroes earn better rewards.",
  },
  {
    icon: "season",
    title: "Seasonal Events",
    text: "Every week brings a new season with bonus resources and an XP reward track. Level up to unlock new features!",
  },
];

export default function OnboardingModal({ onComplete }) {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.slideContent}>
          <span className={styles.icon}>
            <Sprite name={current.icon} size={48} />
          </span>
          <h2 className={styles.title}>{current.title}</h2>
          <p className={styles.text}>{current.text}</p>
        </div>

        <div className={styles.dots}>
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`}
            />
          ))}
        </div>

        <div className={styles.actions}>
          {slide > 0 && (
            <button className={styles.backBtn} onClick={() => setSlide(slide - 1)}>
              Back
            </button>
          )}
          <button
            className={styles.nextBtn}
            onClick={() => {
              if (isLast) {
                onComplete();
              } else {
                setSlide(slide + 1);
              }
            }}
          >
            {isLast ? "Start Playing" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
