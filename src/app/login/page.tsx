"use client";

import Image from "next/image";
import { useActionState } from "react";
import Button from "@/components/Button/Button";
import { login } from "./actions";
import styles from "./login.module.css";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <main className={styles.wrap}>
      <form action={formAction} className={styles.card}>
        <Image src="/logo.png" alt="" width={88} height={88} priority className={styles.logo} />
        <h1 className={styles.title}>TBH Journal</h1>
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          autoFocus
        />
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={pending}>{pending ? "…" : "Enter"}</Button>
      </form>
    </main>
  );
}