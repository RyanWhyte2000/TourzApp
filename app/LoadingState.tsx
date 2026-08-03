import { ShieldCheck } from "lucide-react";

export default function LoadingState({ compact = false }: { compact?: boolean }) {
  return (
    <main className="min-h-screen bg-[#dfe2f0] px-3 py-4 text-slate-950 sm:px-6 lg:px-10" aria-busy="true" aria-label="Loading Tourz">
      <section className="mx-auto max-w-[1460px] overflow-hidden rounded-[1.6rem] bg-white shadow-[0_24px_70px_rgba(31,41,55,0.12)]">
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 text-xl font-bold"><span className="flex size-7 items-center justify-center rounded-md bg-slate-950 text-white"><ShieldCheck className="size-4" /></span>Tourz</div>
          <div className="h-10 w-28 animate-pulse rounded-full bg-slate-100" />
        </header>
        {!compact && <div className="hidden border-b border-slate-100 p-7 md:block"><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /></div>}
        <div className="px-5 py-10 sm:px-8 lg:px-10">
          <div className="h-4 w-28 animate-pulse rounded bg-violet-100" />
          <div className="mt-4 h-9 w-64 max-w-full animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="overflow-hidden rounded-2xl border border-slate-100"><div className="aspect-[1.75/1] animate-pulse bg-slate-100" /><div className="space-y-3 p-4"><div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" /><div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" /></div></div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
