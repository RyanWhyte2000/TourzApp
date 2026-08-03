"use client";

import { ListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "rating", label: "Top rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSort = searchParams.get("sort") ?? "latest";

  function changeSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "latest") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <label className="relative inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white pl-4 shadow-sm focus-within:border-violet-500">
      <ListFilter className="size-4 shrink-0" />
      <span className="sr-only">Sort listings</span>
      <select
        value={selectedSort}
        onChange={(event) => changeSort(event.target.value)}
        className="h-full appearance-none rounded-r-full bg-transparent py-0 pl-0 pr-8 text-sm font-medium outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute right-3 text-xs text-slate-500">⌄</span>
    </label>
  );
}
