import CardList from "@/components/CardList/CardList";
import Container from "@/components/Container/Container";
import EmptyState from "@/components/EmptyState/EmptyState";
import GenerateReportDialog from "@/components/GenerateReportDialog/GenerateReportDialog";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import ReportCard from "@/components/ReportCard/ReportCard";
import { redirect } from "next/navigation";
import { addDays, todayISO } from "@/lib/dates";
import { parsePage } from "@/lib/pagination";
import { getLastReportEnd, getReportsPage } from "@/lib/queries";
import { requireSession } from "@/lib/session";

export const maxDuration = 60; // Gemini can take a while; raises Vercel's function limit

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireSession();
  const page = parsePage((await searchParams).page);
  const { rows, totalPages } = await getReportsPage(page);
  if (page > totalPages) redirect("/reports");

  // default range: from the day after the last report until today
  const today = todayISO();
  const lastEnd = await getLastReportEnd();
  let defaultStart = lastEnd ? addDays(lastEnd, 1) : addDays(today, -13);
  if (defaultStart > today) defaultStart = today;

  return (
    <Container>
      <PageHeader title="Reports">
        <GenerateReportDialog defaultStart={defaultStart} defaultEnd={today} />
      </PageHeader>
      {rows.length === 0 ? (
        <EmptyState>No reports yet. Generate one from your entries.</EmptyState>
      ) : (
        <>
          <CardList>
            {rows.map((report) => <ReportCard key={report.id} report={report} />)}
          </CardList>
          <Pagination page={page} totalPages={totalPages} basePath="/reports" />
        </>
      )}
    </Container>
  );
}