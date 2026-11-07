"use client";

import { useActionState } from "react";
import { login } from "./actions";
import styles from "./login.module.css";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <main className={styles.wrap}>
      <form action={formAction} className={styles.card}>
        <h1>TBH Journal</h1>
        <input type="password" name="password" autoComplete="current-password" required autoFocus />
        {error && <p className={styles.error}>{error}</p>}
        <button disabled={pending}>{pending ? "…" : "Enter"}</button>
      </form>
    </main>
  );
}