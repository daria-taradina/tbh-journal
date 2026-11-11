import { redirect } from "next/navigation";
import CardList from "@/components/CardList/CardList";
import Container from "@/components/Container/Container";
import EmptyState from "@/components/EmptyState/EmptyState";
import EntryCard from "@/components/EntryCard/EntryCard";
import PageHeader from "@/components/PageHeader/PageHeader";
import Pagination from "@/components/Pagination/Pagination";
import { parsePage } from "@/lib/pagination";
import { getEntriesPage } from "@/lib/queries";
import { requireSession } from "@/lib/session";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireSession();
  const page = parsePage((await searchParams).page);
  const { rows, totalPages } = await getEntriesPage(page);
  if (page > totalPages) redirect("/");

  return (
    <Container>
      <PageHeader title="Entries" />
      {rows.length === 0 ? (
        <EmptyState>Nothing here yet. Tap + to write your first entry.</EmptyState>
      ) : (
        <>
          <CardList>
            {rows.map((entry) => <EntryCard key={entry.id} entry={entry} />)}
          </CardList>
          <Pagination page={page} totalPages={totalPages} basePath="/" />
        </>
      )}
    </Container>
  );
}