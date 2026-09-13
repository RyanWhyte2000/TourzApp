import PageShell from "../PageShell";
import Transport from "../Transport";

export const metadata = {
  title: "Local Drivers | Tourz",
  description: "Find available local drivers and vehicles in Jamaica.",
};

export default async function LocalDriverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;
  return <PageShell><Transport search={search} mode="driver" /></PageShell>;
}
