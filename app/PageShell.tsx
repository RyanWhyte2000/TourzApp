import React, { Suspense } from "react";
import NavigationMenuDemo from "./navigationMenu";
import SearchPanel from "./SearchPanel";
import AuthHeaderControl from "./AuthHeaderControl";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#dfe2f0] px-3 py-4 text-slate-950 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-[1460px] overflow-hidden rounded-[1.6rem] bg-white shadow-[0_24px_70px_rgba(31,41,55,0.12)]">
        <NavigationMenuDemo authControl={<Suspense fallback={<div className="h-10 w-20 animate-pulse rounded-full bg-slate-100" />}><AuthHeaderControl /></Suspense>} />
        <div className="hidden md:block">
          <Suspense fallback={<div className="h-44 bg-slate-50" />}>
            <SearchPanel />
          </Suspense>
        </div>
        {children}
      </section>
    </main>
  );
}
