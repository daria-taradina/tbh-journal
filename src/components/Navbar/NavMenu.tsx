"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/login/actions";
import { DRAFT_KEY } from "@/lib/constants";
import styles from "./Navbar.module.css";

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside tap or Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  }

  return (
    <div className={`${styles.menu} ${open ? styles.open : ""}`} ref={ref}>
      <button
        type="button"
        className={styles.burger}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <nav className={styles.dropdown}>
          <Link href="/reports" className={styles.item} onClick={() => setOpen(false)}>
            Reports
          </Link>
          <a href="/api/export" download className={styles.item}>Export data</a>
          <form action={logout} onSubmit={clearDraft}>
            <button type="submit" className={styles.item}>Log out</button>
          </form>
        </nav>
      )}
    </div>
  );
}