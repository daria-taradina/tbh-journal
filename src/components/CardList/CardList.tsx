import styles from "./CardList.module.css";

export default function CardList({ children }: { children: React.ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}