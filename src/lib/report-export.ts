import "server-only";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { NOTHING, REPORT_SECTIONS, type DatedItem, type ReportContent } from "./report-schema";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function reportToHtml(title: string, c: ReportContent): string {
  const parts = [`<h1>${esc(title)}</h1>`];
  for (const s of REPORT_SECTIONS) {
    parts.push(`<h2>${esc(s.title)}</h2>`);
    if (s.kind === "text") {
      parts.push(`<p>${esc((c[s.key] as string) || NOTHING)}</p>`);
    } else if (s.kind === "list") {
      const items = c[s.key] as string[];
      parts.push(items.length
        ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
        : `<p><em>${NOTHING}</em></p>`);
    } else {
      const items = c[s.key] as DatedItem[];
      parts.push(items.length
        ? `<ul>${items.map((i) => `<li><strong>${esc(i.date)}</strong> ${esc(i.text)}</li>`).join("")}</ul>`
        : `<p><em>${NOTHING}</em></p>`);
    }
  }
  return parts.join("\n");
}

export function reportToText(title: string, c: ReportContent): string {
  const lines = [title, ""];
  for (const s of REPORT_SECTIONS) {
    lines.push(s.title.toUpperCase());
    if (s.kind === "text") {
      lines.push((c[s.key] as string) || NOTHING);
    } else if (s.kind === "list") {
      const items = c[s.key] as string[];
      lines.push(...(items.length ? items.map((i) => `- ${i}`) : [NOTHING]));
    } else {
      const items = c[s.key] as DatedItem[];
      lines.push(...(items.length ? items.map((i) => `- ${i.date}: ${i.text}`) : [NOTHING]));
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}

export async function reportToDocx(title: string, c: ReportContent): Promise<Buffer> {
  const children: Paragraph[] = [new Paragraph({ heading: HeadingLevel.TITLE, text: title })];
  for (const s of REPORT_SECTIONS) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, text: s.title }));
    if (s.kind === "text") {
      children.push(new Paragraph({ text: (c[s.key] as string) || NOTHING }));
    } else if (s.kind === "list") {
      const items = c[s.key] as string[];
      if (!items.length) children.push(new Paragraph({ text: NOTHING }));
      for (const i of items) children.push(new Paragraph({ text: i, bullet: { level: 0 } }));
    } else {
      const items = c[s.key] as DatedItem[];
      if (!items.length) children.push(new Paragraph({ text: NOTHING }));
      for (const i of items) {
        children.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: `${i.date}: `, bold: true }), new TextRun(i.text)],
        }));
      }
    }
  }
  return Packer.toBuffer(new Document({ sections: [{ children }] }));
}