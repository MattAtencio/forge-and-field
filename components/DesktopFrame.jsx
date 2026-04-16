"use client";

import styles from "./DesktopFrame.module.css";

export default function DesktopFrame({ children }) {
  return (
    <div className={styles.frame}>
      <div className={styles.vignetteLeft} aria-hidden="true" />
      <div className={styles.vignetteRight} aria-hidden="true" />
      <div className={styles.viewport}>{children}</div>
    </div>
  );
}
