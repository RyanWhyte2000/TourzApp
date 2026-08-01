import PageShell from "../PageShell";
import Food from "../Food";

export default async function FoodPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;

  return (
    <PageShell>
      <Food search={search} />
    </PageShell>
  );
}
