import PageShell from "../PageShell";
import Transport from "../Transport";

export default async function TransportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;

  return (
    <PageShell>
      <Transport search={search} />
    </PageShell>
  );
}
