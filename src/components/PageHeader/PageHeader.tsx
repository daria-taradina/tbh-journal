import styles from "./PageHeader.module.css";

type Props = { title: string; children?: React.ReactNode };

export default function PageHeader({ title, children }: Props) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}