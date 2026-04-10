import styles from "./PixelFrame.module.css";

export default function PixelFrame({
  variant = "parchment",
  active = false,
  glow = false,
  className,
  children,
}) {
  const classes = [
    styles.frame,
    styles[variant],
    active && styles.active,
    glow && styles.glow,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <span className={styles.cornerTR} aria-hidden="true" />
      <span className={styles.cornerBL} aria-hidden="true" />
      {children}
    </div>
  );
}
