"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { generateReport } from "@/lib/actions/reports";
import { MAX_REPORT_DAYS } from "@/lib/constants";
import styles from "./GenerateReportDialog.module.css";

type Props = { defaultStart: string; defaultEnd: string };

export default function GenerateReportDialog({ defaultStart, defaultEnd }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function open() {
    setError(null);
    dialogRef.current?.showModal();
  }
  function close() {
    if (!pending) dialogRef.current?.close();
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await generateReport(start, end);
      if (result.error) {
        setError(result.error);
        return;
      }
      dialogRef.current?.close();
      router.push(`/reports/${result.id}`);
    });
  }

  return (
    <>
      <Button onClick={open}>Generate report</Button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }} // click on the backdrop
      >
        <form onSubmit={onSubmit} className={styles.form}>
          <h2>Generate report</h2>
          <p className={styles.hint}>
            Pick the period the notes should cover (up to {MAX_REPORT_DAYS} days).
          </p>

          <label>
            From
            <input type="date" value={start} max={end} required onChange={(e) => setStart(e.target.value)} />
          </label>
          <label>
            To
            <input type="date" value={end} min={start} max={defaultEnd} required onChange={(e) => setEnd(e.target.value)} />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={close} disabled={pending}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Generating…" : "Generate"}</Button>
          </div>
        </form>
      </dialog>
    </>
  );
}