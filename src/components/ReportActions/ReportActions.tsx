"use client";

import { useState } from "react";
import Button from "@/components/Button/Button";
import ButtonLink from "@/components/Button/ButtonLink";
import styles from "./ReportActions.module.css";

type Props = { id: number; html: string; text: string };

export default function ReportActions({ id, html, text }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      // rich text: pastes with headings and bullets into Notes, Word, Docs
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
    } catch {
      try { await navigator.clipboard.writeText(text); } catch { return; }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.actions} data-print="hide">
      <Button variant="ghost" onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
      <ButtonLink href={`/api/reports/${id}/docx`} variant="ghost" download>Word</ButtonLink>
      <Button variant="ghost" onClick={() => window.print()}>Print / PDF</Button>
    </div>
  );
}