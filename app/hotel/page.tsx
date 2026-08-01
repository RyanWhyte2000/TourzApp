import PageShell from "../PageShell";
import HotelListings from "../HotelListings";

export default async function HotelPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;

  return (
    <PageShell>
      <HotelListings search={search} />
    </PageShell>
  );
}
