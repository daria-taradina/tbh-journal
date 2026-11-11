import Link from "next/link";
import styles from "./Button.module.css";
import type { Variant } from "./Button";

type Props = {
  href: string;
  variant?: Variant;
  className?: string;
  download?: boolean;
  children: React.ReactNode;
};

export default function ButtonLink({ href, variant = "primary", className = "", download, children }: Props) {
  const cls = `${styles.button} ${styles[variant]} ${className}`;
  if (download) {
    return <a href={href} download className={cls}>{children}</a>;
  }
  return <Link href={href} className={cls}>{children}</Link>;
}