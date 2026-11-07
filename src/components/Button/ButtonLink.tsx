import Link from "next/link";
import styles from "./Button.module.css";
import type { Variant } from "./Button";

type Props = {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export default function ButtonLink({ href, variant = "primary", className = "", children }: Props) {
  return (
    <Link href={href} className={`${styles.button} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}