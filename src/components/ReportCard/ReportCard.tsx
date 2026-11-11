import Link from "next/link";
import { formatEntryDate, formatRange } from "@/lib/dates";
import { normalizeReport } from "@/lib/report-schema";
import type { Report } from "@/lib/schema";
import styles from "./ReportCard.module.css";

export default function ReportCard({ report }: { report: Report }) {
  const overview = normalizeReport(report.content).overview as string;
  const snippet = overview.length > 160 ? `${overview.slice(0, 160)}…` : overview;

  return (
    <Link href={`/reports/${report.id}`} className={styles.card}>
      <span className={styles.range}>{formatRange(report.rangeStart, report.rangeEnd)}</span>
      <span className={styles.meta}>Generated {formatEntryDate(report.createdAt)}</span>
      {snippet && <p className={styles.snippet}>{snippet}</p>}
    </Link>
  );
}