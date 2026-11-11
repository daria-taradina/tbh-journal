import { NOTHING, REPORT_SECTIONS, type DatedItem, type ReportContent, type SectionDef } from "@/lib/report-schema";
import styles from "./ReportView.module.css";

function SectionBody({ def, value }: { def: SectionDef; value: ReportContent[string] }) {
  if (def.kind === "text") {
    const text = value as string;
    return text ? <p>{text}</p> : <p className={styles.empty}>{NOTHING}</p>;
  }
  const items = value as (string | DatedItem)[];
  if (!items.length) return <p className={styles.empty}>{NOTHING}</p>;
  return (
    <ul>
      {items.map((item, i) =>
        typeof item === "string" ? (
          <li key={i}>{item}</li>
        ) : (
          <li key={i}><span className={styles.date}>{item.date}</span>{item.text}</li>
        )
      )}
    </ul>
  );
}

export default function ReportView({ content }: { content: ReportContent }) {
  return (
    <div className={styles.report}>
      {REPORT_SECTIONS.map((def) => (
        <section key={def.key} className={`${styles.section} ${def.highlight ? styles.highlight : ""}`}>
          <h2>{def.title}</h2>
          <SectionBody def={def} value={content[def.key]} />
        </section>
      ))}
    </div>
  );
}