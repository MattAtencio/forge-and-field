"use client";

import { getSkillTier } from "@/lib/skills";
import styles from "./SkillBadge.module.css";

export default function SkillBadge({ skill, unlocked, heroLevel }) {
  const { tier, tierData } = unlocked && heroLevel
    ? getSkillTier(skill, heroLevel)
    : { tier: 1, tierData: null };
  const tierLabel = tierData?.label || skill.description;

  return (
    <div className={`${styles.badge} ${unlocked ? styles.unlocked : styles.locked}`}>
      <span className={styles.icon}>{skill.icon}</span>
      <div className={styles.info}>
        <span className={styles.name}>
          {skill.name}
          {unlocked && tier > 1 && (
            <span className={styles.tierBadge}>T{tier}</span>
          )}
        </span>
        <span className={styles.desc}>{unlocked ? tierLabel : skill.description}</span>
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
