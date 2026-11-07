import Logo from "@/components/Logo/Logo";
import NavMenu from "./NavMenu";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Logo />
        <NavMenu />
      </div>
    </header>
  );
}