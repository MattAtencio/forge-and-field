"use client";

import Modal from "./shared/Modal";
import PixelFrame from "./shared/PixelFrame";
import Sprite from "@/components/sprites/Sprite";
import styles from "./HeroUnlockModal.module.css";

export default function HeroUnlockModal({ heroes, onDismiss }) {
  const multiple = heroes.length > 1;

  return (
    <Modal
      title={multiple ? "New Arrivals" : "A New Champion"}
      onClose={onDismiss}
    >
      {/* Parchment frame lives INSIDE shared Modal so the champion reveal reads as a scroll */}
      <PixelFrame variant="parchment" className={styles.frame}>
        <div className={styles.content}>
          <div className={styles.heroList}>
            {heroes.map((hero) => (
              <div key={hero.id} className={styles.heroCard}>
                <div className={styles.spriteWrap}>
                  {/* emberGlow is a pure-CSS layer keyed to the silhouette reveal timeline */}
                  <span className={styles.emberGlow} aria-hidden="true" />
                  <span className={styles.spriteReveal}>
                    <Sprite name={hero.templateId} size={48} />
                  </span>
                </div>
                <div className={styles.heroInfo}>
                  <span className={styles.heroName}>{hero.name}</span>
                  <span className={styles.heroTitle}>{hero.title}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.stat}>
                    <Sprite name="heart" size={14} /> {hero.stats.hp}
                  </span>
                  <span className={styles.stat}>
                    <Sprite name="attack" size={14} /> {hero.stats.atk}
                  </span>
                  <span className={styles.stat}>
                    <Sprite name="defense" size={14} /> {hero.stats.def}
                  </span>
                  <span className={styles.stat}>
                    <Sprite name="speed" size={14} /> {hero.stats.spd}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* In-voice subtitle sits ABOVE the practical hint — flavor first, direction second */}
          <p className={styles.subtitle}>The forge remembers their name.</p>

          <p className={styles.hint}>They await your craft in the Barracks.</p>

          <button className={styles.dismissBtn} onClick={onDismiss}>
            Continue
          </button>
        </div>
      </PixelFrame>
    </Modal>
  );
}
