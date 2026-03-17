"use client";

import { useState } from "react";
import styles from "./OnboardingModal.module.css";

const SLIDES = [
  {
    icon: "\u{1F525}",
    title: "Welcome to Forge & Field",
    text: "Collect resources, craft powerful gear, and send heroes on epic expeditions.",
  },
  {
    icon: "\u{1FAB5}",
    title: "Gather Resources",
    text: "Resources generate passively over time — even while you're away. Check back to collect your stockpile.",
  },
  {
    icon: "\u2694\uFE0F",
    title: "Craft & Equip",
    text: "Use resources to craft weapons, armor, and accessories. Each item rolls a rarity — Common, Uncommon, Rare, or Epic.",
  },
  {
    icon: "\u{1F5FA}\uFE0F",
    title: "Send Expeditions",
    text: "Assign heroes to missions for bonus resources and rare loot. Stronger heroes earn better rewards.",
  },
  {
    icon: "\u{1F31F}",
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
          <span className={styles.icon}>{current.icon}</span>
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
