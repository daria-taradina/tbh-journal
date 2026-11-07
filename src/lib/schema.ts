import { pgTable, serial, text, timestamp, date, jsonb, index } from "drizzle-orm/pg-core";

export const entries = pgTable(
  "entries",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("entries_created_at_idx").on(t.createdAt)]
);

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  rangeStart: date("range_start").notNull(),
  rangeEnd: date("range_end").notNull(),
  content: jsonb("content").notNull(), // the structured report JSON
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});