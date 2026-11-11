"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports } from "@/lib/schema";
import { requireSession } from "@/lib/session";
import { getEntriesInRange } from "@/lib/queries";
import { friendlyError, generateReportContent } from "@/lib/gemini";
import { daysBetween } from "@/lib/dates";
import { MAX_REPORT_DAYS } from "@/lib/constants";

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const MAX_CHARS = 300_000; // roughly 75k tokens

export async function generateReport(
  start: string,
  end: string
): Promise<{ id?: number; error?: string }> {
  await requireSession();

  if (!ISO.test(start) || !ISO.test(end)) return { error: "Pick a valid date range." };
  if (start > end) return { error: "The start date must be before the end date." };
  if (daysBetween(start, end) > MAX_REPORT_DAYS)
    return { error: `Pick ${MAX_REPORT_DAYS} days or fewer.` };

  const rows = await getEntriesInRange(start, end);
  if (rows.length === 0) return { error: "No entries in that range." };
  if (rows.reduce((n, r) => n + r.content.length, 0) > MAX_CHARS)
    return { error: "That's a lot of text. Try a shorter range." };

  try {
    const content = await generateReportContent(rows, start, end);
    const [saved] = await db
      .insert(reports)
      .values({ rangeStart: start, rangeEnd: end, content })
      .returning({ id: reports.id });
    revalidatePath("/reports");
    return { id: saved.id };
  } catch (err) {
    // log the error only, never the entries
    console.error("Report generation failed:", err instanceof Error ? err.message : err);
    return { error: friendlyError(err) };
  }
}

export async function deleteReport(id: number) {
  await requireSession();
  await db.delete(reports).where(eq(reports.id, id));
  revalidatePath("/reports");
  redirect("/reports");
}