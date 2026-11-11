import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { entries, reports } from "@/lib/schema";
import { isLoggedIn } from "@/lib/session";

export async function GET() {
  if (!(await isLoggedIn())) return new NextResponse("Unauthorized", { status: 401 });

  const [allEntries, allReports] = await Promise.all([
    db.select().from(entries).orderBy(asc(entries.createdAt)),
    db.select().from(reports).orderBy(asc(reports.createdAt)),
  ]);

  const day = new Date().toISOString().slice(0, 10);
  return new NextResponse(
    JSON.stringify({ exportedAt: new Date().toISOString(), entries: allEntries, reports: allReports }, null, 2),
    {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="tbh-journal-export-${day}.json"`,
      },
    }
  );
}