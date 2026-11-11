export type SectionKind = "text" | "list" | "dated";

export type SectionDef = {
  key: string;
  title: string;
  kind: SectionKind;
  hint: string;        // tells Gemini what belongs here
  highlight?: boolean; // visually emphasized
};

export type DatedItem = { date: string; text: string };
export type ReportContent = Record<string, string | string[] | DatedItem[]>;

export const REPORT_SECTIONS: SectionDef[] = [
  { key: "overview", title: "Overview", kind: "text",
    hint: "3-4 sentences summarizing the period." },
  { key: "mood", title: "Mood and emotional patterns", kind: "text",
    hint: "How my mood moved over the period, using my own words for feelings. Mention dates for notable shifts." },
  { key: "events", title: "Key events", kind: "dated",
    hint: "Notable things that happened, in order, each with its date." },
  { key: "themes", title: "Recurring themes and thoughts", kind: "list",
    hint: "Things that kept coming up." },
  { key: "helped", title: "What helped", kind: "list",
    hint: "Things I noted helped or felt good." },
  { key: "hard", title: "Hard moments and triggers", kind: "list",
    hint: "Things that were difficult or set me off." },
  { key: "bringUp", title: "Things to bring up", kind: "list", highlight: true,
    hint: "Topics or questions worth raising in the session, based only on what the entries show." },
  { key: "quotes", title: "In my own words", kind: "dated",
    hint: "2-3 short verbatim lines from my entries that capture something important, each with its date." },
];

export const NOTHING = "Nothing mentioned.";

export function buildJsonSchema() {
  const datedItem = {
    type: "object",
    properties: {
      date: { type: "string", description: "YYYY-MM-DD, from the entry header" },
      text: { type: "string" },
    },
    required: ["date", "text"],
  };
  const properties: Record<string, unknown> = {};
  for (const s of REPORT_SECTIONS) {
    properties[s.key] =
      s.kind === "text" ? { type: "string", description: s.hint }
      : s.kind === "list" ? { type: "array", items: { type: "string" }, description: s.hint }
      : { type: "array", items: datedItem, description: s.hint };
  }
  return { type: "object", properties, required: REPORT_SECTIONS.map((s) => s.key) };
}

/** Make whatever the model (or the DB) gives us safe to render. */
export function normalizeReport(raw: unknown): ReportContent {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: ReportContent = {};
  for (const s of REPORT_SECTIONS) {
    const v = src[s.key];
    if (s.kind === "text") {
      out[s.key] = typeof v === "string" ? v : "";
    } else if (s.kind === "list") {
      out[s.key] = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
    } else {
      out[s.key] = Array.isArray(v)
        ? v.flatMap((x) => {
            const item = x as { date?: unknown; text?: unknown } | null;
            return item && typeof item.text === "string"
              ? [{ date: String(item.date ?? ""), text: item.text }]
              : [];
          })
        : [];
    }
  }
  return out;
}