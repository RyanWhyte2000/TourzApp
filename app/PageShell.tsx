import React from "react";
import NavigationMenuDemo from "./navigtionMenu";
import SearchPanel from "./SearchPanel";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#dfe2f0] px-3 py-4 text-slate-950 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-[1460px] overflow-hidden rounded-[1.6rem] bg-white shadow-[0_24px_70px_rgba(31,41,55,0.12)]">
        <NavigationMenuDemo />
        <SearchPanel />
        {children}
      </section>
    </main>
  );
}
