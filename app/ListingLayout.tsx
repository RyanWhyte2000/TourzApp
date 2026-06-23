import { ChevronDown, LayoutGrid, ListFilter, Map } from "lucide-react";
import React from "react";
import CategoryRail from "./CategoryRail";
import Filters from "./Filters";
import ListingCard from "./ListingCard";

export type ListingItem = {
  title: string;
  image: string;
  price: string;
  rating: string;
  subtitle?: string;
  meta?: { icon: React.ReactNode; label: string }[];
  priceSuffix?: string;
  totalPrice?: string;
};

type Category = {
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

type ListingLayoutProps = {
  resultCount: number;
  location: string;
  categories: Category[];
  items: ListingItem[];
};

export default function ListingLayout({
  resultCount,
  location,
  categories,
  items,
}: ListingLayoutProps) {
  return (
    <div className="border-t border-slate-200/80 px-4 py-5 sm:px-7 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-lg font-medium tracking-[-0.03em] sm:text-xl">
          Found {resultCount} results near{" "}
          <span className="font-semibold">{location}</span>
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm">
            <ListFilter className="size-4" />
            Latest
            <ChevronDown className="size-4" />
          </button>
          <button className="hidden h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm sm:inline-flex">
            <Map className="size-4" />
            Map View
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 text-sm font-semibold shadow-sm">
            <LayoutGrid className="size-4" />
            Card View
          </button>
        </div>
      </div>

      <CategoryRail categories={categories} />

      <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <ListingCard key={`${item.title}-${item.image}`} {...item} />
          ))}
        </section>
        <Filters />
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {["1", "2", "3", "...", "8", "9", "10"].map((page) => (
            <button
              key={page}
              className={`size-8 rounded-full ${
                page === "2" ? "bg-slate-100 font-semibold" : "text-slate-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-2 text-slate-700">
          Show: 9 <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  );
}
