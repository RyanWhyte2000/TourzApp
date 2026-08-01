"use client";

import { Drawer } from "@base-ui/react/drawer";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Filters from "./Filters";
import type { ListingCategory } from "./ListingLayout";

const filterParamNames = [
  "minPrice",
  "maxPrice",
  "bedrooms",
  "beds",
  "bathrooms",
  "starRating",
  "rooms",
  "minRating",
  "seats",
  "luggage",
];

export default function MobileFilters({
  category,
  resultCount,
}: {
  category: ListingCategory;
  resultCount: number;
}) {
  const searchParams = useSearchParams();
  const activeCount = searchParams.getAll("tag").length +
    filterParamNames.filter((name) => searchParams.has(name)).length;

  return (
    <Drawer.Root>
      <Drawer.Trigger className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm lg:hidden">
        <SlidersHorizontal className="size-4" />
        Filters
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-violet-700 text-xs font-semibold text-white">
            {activeCount}
          </span>
        )}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-slate-950/45 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end lg:hidden">
          <Drawer.Popup className="flex max-h-[92dvh] w-full flex-col rounded-t-[1.75rem] bg-white shadow-2xl transition-transform duration-300 data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full">
            <Drawer.Title className="sr-only">Filter results</Drawer.Title>
            <div className="overflow-y-auto">
              <Filters
                category={category}
                variant="drawer"
                headerAction={
                  <Drawer.Close
                    aria-label="Close filters"
                    className="flex size-9 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
                  >
                    <X className="size-4" />
                  </Drawer.Close>
                }
              />
            </div>
            <div className="border-t border-slate-100 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <Drawer.Close className="h-12 w-full rounded-full bg-violet-700 px-5 text-sm font-semibold text-white transition hover:bg-violet-800">
                Show {resultCount} {resultCount === 1 ? "result" : "results"}
              </Drawer.Close>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
