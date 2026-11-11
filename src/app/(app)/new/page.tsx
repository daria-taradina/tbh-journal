import Container from "@/components/Container/Container";
import NewEntryForm from "@/components/NewEntryForm/NewEntryForm";
import PageHeader from "@/components/PageHeader/PageHeader";
import { requireSession } from "@/lib/session";

export default async function NewEntryPage() {
  await requireSession();
  return (
    <Container>
      <PageHeader title="New entry" />
      <NewEntryForm />
    </Container>
  );
}