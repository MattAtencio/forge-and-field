"use client";

import Modal from "./shared/Modal";
import Sprite from "@/components/sprites/Sprite";
import styles from "./HeroUnlockModal.module.css";

export default function HeroUnlockModal({ heroes, onDismiss }) {
  const multiple = heroes.length > 1;

  return (
    <Modal
      title={multiple ? "Heroes Recruited!" : "New Hero Recruited!"}
      onClose={onDismiss}
    >
      <div className={styles.content}>
        <div className={styles.heroList}>
          {heroes.map((hero) => (
            <div key={hero.id} className={styles.heroCard}>
              <div className={styles.spriteWrap}>
                <Sprite name={hero.templateId} size={48} />
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

        <p className={styles.hint}>
          {multiple
            ? "Visit the Barracks to equip and manage your new heroes!"
            : "Visit the Barracks to equip your new hero!"}
        </p>

        <button className={styles.dismissBtn} onClick={onDismiss}>
          Continue
        </button>
      </div>
    </Modal>
  );
}
