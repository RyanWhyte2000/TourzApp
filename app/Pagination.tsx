"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const pageSizes = [6, 9, 12, 18];

function visiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [1];
  if (currentPage > 4) pages.push("ellipsis-start");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) pages.push(page);

  if (currentPage < totalPages - 3) pages.push("ellipsis-end");
  pages.push(totalPages);
  return pages;
}

export default function Pagination({
  currentPage,
  pageSize,
  totalCount,
}: {
  currentPage: number;
  pageSize: number;
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  function navigate(page: number, nextPageSize = pageSize) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    if (nextPageSize === 9) params.delete("pageSize");
    else params.set("pageSize", String(nextPageSize));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const firstVisible = totalCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastVisible = Math.min(safePage * pageSize, totalCount);

  return (
    <nav
      aria-label="Listing pagination"
      className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-500">
        Showing {firstVisible}–{lastVisible} of {totalCount}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={safePage <= 1}
          onClick={() => navigate(safePage - 1)}
          className="flex size-9 items-center justify-center rounded-full border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        {visiblePages(safePage, totalPages).map((page) =>
          typeof page === "number" ? (
            <button
              type="button"
              key={page}
              aria-label={`Page ${page}`}
              aria-current={safePage === page ? "page" : undefined}
              onClick={() => navigate(page)}
              className={`size-9 rounded-full text-sm ${
                safePage === page
                  ? "bg-violet-700 font-semibold text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={page} className="px-1 text-slate-400">…</span>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={safePage >= totalPages}
          onClick={() => navigate(safePage + 1)}
          className="flex size-9 items-center justify-center rounded-full border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        Show:
        <select
          value={pageSize}
          onChange={(event) => navigate(1, Number(event.target.value))}
          className="h-9 rounded-full border border-slate-200 bg-white px-3 font-medium outline-none focus:border-violet-500"
        >
          {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
    </nav>
  );
}
