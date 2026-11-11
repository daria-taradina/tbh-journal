import "server-only";
import { and, asc, count, desc, eq, max, sql } from "drizzle-orm";
import { db } from "./db";
import { entries, reports } from "./schema";
import { PAGE_SIZE } from "./constants";
import { TIMEZONE } from "./dates";

export async function getEntriesPage(page: number) {
  const [rows, [{ total }]] = await Promise.all([
    db.select().from(entries).orderBy(desc(entries.createdAt))
      .limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(entries),
  ]);
  return { rows, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getReportsPage(page: number) {
  const [rows, [{ total }]] = await Promise.all([
    db.select().from(reports).orderBy(desc(reports.createdAt))
      .limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(reports),
  ]);
  return { rows, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

/** entries whose local date (in APP_TIMEZONE) falls in [start, end] */
export async function getEntriesInRange(start: string, end: string) {
  const localDate = sql`(${entries.createdAt} AT TIME ZONE ${TIMEZONE})::date`;
  return db.select().from(entries)
    .where(and(sql`${localDate} >= ${start}::date`, sql`${localDate} <= ${end}::date`))
    .orderBy(asc(entries.createdAt));
}

export async function getReport(id: number) {
  const [row] = await db.select().from(reports).where(eq(reports.id, id));
  return row;
}

export async function getLastReportEnd() {
  const [row] = await db.select({ end: max(reports.rangeEnd) }).from(reports);
  return row?.end ?? null;
}