"use client";

import { LayoutGrid, Map } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ViewSwitcher({ view }: { view: "card" | "map" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setView(nextView: "card" | "map") {
    const params = new URLSearchParams(searchParams.toString());
    if (nextView === "card") params.delete("view");
    else params.set("view", "map");
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm" aria-label="Results view">
      <button
        type="button"
        aria-pressed={view === "map"}
        onClick={() => setView("map")}
        className={`inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm font-medium transition ${view === "map" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
      >
        <Map className="size-4" /> Map
      </button>
      <button
        type="button"
        aria-pressed={view === "card"}
        onClick={() => setView("card")}
        className={`inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm font-medium transition ${view === "card" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
      >
        <LayoutGrid className="size-4" /> Cards
      </button>
    </div>
  );
}
