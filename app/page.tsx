import PageShell from "./PageShell";
import AirBnb from "./AirBnb";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;

  return (
    <PageShell>
      <AirBnb search={search} />
    </PageShell>
  );
}
