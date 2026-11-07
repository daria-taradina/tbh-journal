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
    <div className={styles.menu} ref={ref}>
      <button
        className={styles.burger}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <nav className={styles.dropdown}>
          <Link href="/reports" className={styles.item} onClick={() => setOpen(false)}>
            Reports
          </Link>
          <form action={logout} onSubmit={clearDraft}>
            <button type="submit" className={styles.item}>Log out</button>
          </form>
        </nav>
      )}
    </div>
  );
}