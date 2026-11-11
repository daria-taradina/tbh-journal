"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import ButtonLink from "@/components/Button/ButtonLink";
import { useDraft } from "@/hooks/useDraft";
import { createEntry } from "@/lib/actions/entries";
import { DRAFT_KEY } from "@/lib/constants";
import styles from "./NewEntryForm.module.css";

export default function NewEntryForm() {
  const router = useRouter();
  const { text, update, clear } = useDraft(DRAFT_KEY);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createEntry(text);
      if (result.error) {
        setError(result.error);
        return; // the draft stays
      }
      clear(); // only after the server confirmed
      router.push("/");
    });
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => update(e.target.value)}
        placeholder="What's on your mind?"
        autoFocus
      />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <ButtonLink href="/" variant="ghost">Cancel</ButtonLink>
        <Button type="submit" disabled={pending || !text.trim()}>
          {pending ? "Saving…" : "Save entry"}
        </Button>
      </div>
    </form>
  );
}