import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <Link href="/" className={styles.logo}>
      <Image src="/logo.png" alt="" width={36} height={36} priority />
      <span className={styles.name}>TBH Journal</span>
    </Link>
  );
}