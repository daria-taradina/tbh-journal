import ButtonLink from "@/components/Button/ButtonLink";
import PlusIcon from "@/components/Icons/PlusIcon";
import Logo from "@/components/Logo/Logo";
import NavMenu from "./NavMenu";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.glass}>
        <Logo />
        <div className={styles.actions}>
          <ButtonLink href="/new" className={styles.newButton}>
            <PlusIcon />
            <span className={styles.newLabel}>New entry</span>
          </ButtonLink>
          <NavMenu />
        </div>
      </div>
    </header>
  );
}