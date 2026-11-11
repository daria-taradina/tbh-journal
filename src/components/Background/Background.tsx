import styles from "./Background.module.css";

export default function Background() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.grain} />
    </div>
  );
}