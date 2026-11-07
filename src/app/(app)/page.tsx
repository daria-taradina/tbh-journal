import { requireSession } from "@/lib/session";
import Container from "@/components/Container/Container";
import PageHeader from "@/components/PageHeader/PageHeader";
import ButtonLink from "@/components/Button/ButtonLink";
import EmptyState from "@/components/EmptyState/EmptyState";

export default async function HomePage() {
  await requireSession();

  return (
    <Container>
      <PageHeader title="Entries">
        <ButtonLink href="/new">+ New entry</ButtonLink>
      </PageHeader>
      <EmptyState>Nothing here yet. Your first entry will show up here.</EmptyState>
    </Container>
  );
}