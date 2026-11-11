"use client";

import styles from "./DeleteButton.module.css";

type Props = {
  action: () => Promise<void>;
  confirmMessage: string;
  label?: string;
};

export default function DeleteButton({ action, confirmMessage, label = "Delete" }: Props) {
  return (
    <form
      action={action}
      data-print="hide"
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button type="submit" className={styles.delete}>{label}</button>
    </form>
  );
}