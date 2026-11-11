import DeleteButton from "@/components/DeleteButton/DeleteButton";
import { deleteEntry } from "@/lib/actions/entries";
import { formatEntryDate, formatTime } from "@/lib/dates";
import type { Entry } from "@/lib/schema";
import styles from "./EntryCard.module.css";

export default function EntryCard({ entry }: { entry: Entry }) {
  return (
    <article className={styles.card}>
      <header className={styles.meta}>
        <time dateTime={entry.createdAt.toISOString()}>
          {formatEntryDate(entry.createdAt)} · {formatTime(entry.createdAt)}
        </time>
        <DeleteButton
          action={deleteEntry.bind(null, entry.id)}
          confirmMessage="Delete this entry? This can't be undone."
        />
      </header>
      <p className={styles.content}>{entry.content}</p>
    </article>
  );
}