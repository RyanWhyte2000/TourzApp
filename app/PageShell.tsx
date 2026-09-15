import React, { Suspense } from "react";
import NavigationMenuDemo from "./navigationMenu";
import SearchPanel from "./SearchPanel";
import AuthHeaderControl from "./AuthHeaderControl";
import SupportChat from "./SupportChat";

export default function PageShell({ children, showSearch = true }: { children: React.ReactNode; showSearch?: boolean }) {
  return (
    <main className="min-h-screen bg-[#eeeadd] px-3 py-4 text-slate-950 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-[1460px] overflow-hidden rounded-[1.6rem] bg-white shadow-[0_24px_70px_rgba(31,41,55,0.12)]">
        <NavigationMenuDemo authControl={<Suspense fallback={<div className="h-10 w-20 animate-pulse rounded-full bg-slate-100" />}><AuthHeaderControl /></Suspense>} />
        {showSearch && <div className="hidden md:block">
          <Suspense fallback={<div className="h-44 bg-slate-50" />}>
            <SearchPanel />
          </Suspense>
        </div>}
        {children}
      </section>
      <SupportChat variant="floating" />
    </main>
  );
}
