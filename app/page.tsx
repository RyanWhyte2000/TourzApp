import PageShell from "./PageShell";
import AirBnb from "./AirBnb";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;

  return (
    <PageShell>
      <section className="mx-5 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-violet-50 p-5 sm:mx-8 lg:mx-10">
        <div><h2 className="text-lg font-bold">Your next trip starts with a plan.</h2><p className="mt-1 text-sm text-slate-600">Daily ideas, a simple budget, and a plan to share with friends.</p></div>
        <Link href="/plan" className="rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700">Plan your trip for free</Link>
      </section>
      <AirBnb search={search} />
    </PageShell>
  );
}
