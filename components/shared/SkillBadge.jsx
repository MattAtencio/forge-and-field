"use client";

import styles from "./SkillBadge.module.css";

export default function SkillBadge({ skill, unlocked }) {
  return (
    <div className={`${styles.badge} ${unlocked ? styles.unlocked : styles.locked}`}>
      <span className={styles.icon}>{skill.icon}</span>
      <div className={styles.info}>
        <span className={styles.name}>{skill.name}</span>
        <span className={styles.desc}>{skill.description}</span>
      </div>
      {!unlocked && (
        <span className={styles.lockLabel}>Lv.{skill.unlockHeroLevel}</span>
      )}
      {unlocked && skill.type === "active" && (
        <span className={styles.activeTag}>Active</span>
      )}
    </div>
  );
}
