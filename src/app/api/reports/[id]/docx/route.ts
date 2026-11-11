import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/session";
import { getReport } from "@/lib/queries";
import { normalizeReport } from "@/lib/report-schema";
import { reportToDocx } from "@/lib/report-export";
import { reportTitle } from "@/lib/dates";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isLoggedIn())) return new NextResponse("Unauthorized", { status: 401 });

  const id = Number((await ctx.params).id);
  const report = Number.isInteger(id) ? await getReport(id) : undefined;
  if (!report) return new NextResponse("Not found", { status: 404 });

  const buffer = await reportToDocx(
    reportTitle(report.rangeStart, report.rangeEnd),
    normalizeReport(report.content)
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="tbh-notes-${report.rangeStart}_${report.rangeEnd}.docx"`,
    },
  });
}