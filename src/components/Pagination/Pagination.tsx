import ButtonLink from "@/components/Button/ButtonLink";
import styles from "./Pagination.module.css";

type Props = { page: number; totalPages: number; basePath: string };

export default function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;
  const href = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav className={styles.pagination} aria-label="Pagination" data-print="hide">
      <span>
        {page > 1 && <ButtonLink href={href(page - 1)} variant="ghost">← Newer</ButtonLink>}
      </span>
      <span className={styles.status}>Page {page} of {totalPages}</span>
      <span className={styles.next}>
        {page < totalPages && <ButtonLink href={href(page + 1)} variant="ghost">Older →</ButtonLink>}
      </span>
    </nav>
  );
}