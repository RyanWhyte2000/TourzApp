import React from "react";
import CategoryRail from "./CategoryRail";
import type { CategoryRailItem } from "./CategoryRail";
import Filters from "./Filters";
import ListingCard from "./ListingCard";
import MobileFilters from "./MobileFilters";
import Pagination from "./Pagination";
import SortSelect from "./SortSelect";
import ListingMap from "./ListingMap";
import ViewSwitcher from "./ViewSwitcher";
import type { MapListing } from "@/lib/listings/types";

export type ListingItem = {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: string;
  subtitle?: string;
  meta?: { icon: React.ReactNode; label: string }[];
  priceSuffix?: string;
  totalPrice?: string;
  filterTags?: string[];
  filterValues?: Record<string, number>;
};

export type ListingSearchParams = {
  where?: string | string[];
  pickup?: string | string[];
  dropoff?: string | string[];
  checkIn?: string | string[];
  checkOut?: string | string[];
  guests?: string | string[];
  tag?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  bedrooms?: string | string[];
  beds?: string | string[];
  bathrooms?: string | string[];
  starRating?: string | string[];
  rooms?: string | string[];
  minRating?: string | string[];
  seats?: string | string[];
  luggage?: string | string[];
  rail?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
  sort?: string | string[];
  view?: string | string[];
};

export type ListingCategory = "airbnb" | "hotel" | "food" | "transport";

export function filterListings(
  items: ListingItem[],
  search: ListingSearchParams,
  area = "Montego Bay, Jamaica",
) {
  const locationParam = search.where ?? search.pickup;
  const rawWhere = Array.isArray(locationParam) ? locationParam[0] : locationParam;
  const destination = rawWhere?.split(",")[0].trim().toLocaleLowerCase() ?? "";

  const value = (param?: string | string[]) => Array.isArray(param) ? param[0] : param;
  const tags = search.tag ? (Array.isArray(search.tag) ? search.tag : [search.tag]) : [];
  const rail = value(search.rail)?.toLocaleLowerCase();
  const minimumPrice = Number(value(search.minPrice) ?? 0);
  const maximumPrice = Number(value(search.maxPrice) ?? Number.POSITIVE_INFINITY);
  const numericFilters = [
    ["bedrooms", "bed", value(search.bedrooms)],
    ["beds", "bed", value(search.beds)],
    ["bathrooms", "bath", value(search.bathrooms)],
    ["starRating", "star", value(search.starRating)],
    ["rooms", "room", value(search.rooms)],
    ["seats", "seat", value(search.seats)],
    ["luggage", "luggage", value(search.luggage)],
  ] as const;

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.subtitle,
      area,
      ...(item.meta ?? []).map(({ label }) => label),
      ...(item.filterTags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    const price = Number(item.price.replace(/[^0-9.]/g, ""));
    const rating = Number(item.rating);

    if (destination && !haystack.includes(destination)) return false;
    if (price < minimumPrice || price > maximumPrice) return false;
    if (tags.some((tag) => !haystack.includes(tag.toLocaleLowerCase()))) return false;
    if (rail && !haystack.includes(rail)) return false;

    const minRating = Number.parseFloat(value(search.minRating) ?? "0");
    if (rating < minRating) return false;

    for (const [param, label, selected] of numericFilters) {
      if (!selected || selected === "Any") continue;
      const required = Number.parseFloat(selected);
      const matchingMeta = item.meta?.find(({ label: metaLabel }) =>
        metaLabel.toLocaleLowerCase().includes(label),
      );
      const available = item.filterValues?.[param] ?? Number.parseFloat(matchingMeta?.label ?? "0");
      if (available < required) return false;
    }

    return true;
  });
}

export function searchLocation(search: ListingSearchParams) {
  const locationParam = search.where ?? search.pickup;
  const where = Array.isArray(locationParam) ? locationParam[0] : locationParam;
  return where?.trim() || "Montego Bay, Jamaica";
}

export function searchView(search: ListingSearchParams): "card" | "map" {
  const view = Array.isArray(search.view) ? search.view[0] : search.view;
  return view === "map" ? "map" : "card";
}

type ListingLayoutProps = {
  category: ListingCategory;
  resultCount: number;
  location: string;
  categories: CategoryRailItem[];
  items: ListingItem[];
  currentPage: number;
  pageSize: number;
  mapItems: MapListing[];
  view?: "card" | "map";
};

export default function ListingLayout({
  category,
  resultCount,
  location,
  categories,
  items,
  currentPage,
  pageSize,
  mapItems,
  view = "card",
}: ListingLayoutProps) {
  return (
    <div className="border-t border-slate-200/80 px-4 py-5 sm:px-7 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-lg font-medium tracking-[-0.03em] sm:text-xl">
          Found {resultCount} results near{" "}
          <span className="font-semibold">{location}</span>
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <MobileFilters category={category} resultCount={resultCount} />
          <SortSelect />
          <ViewSwitcher view={view} />
        </div>
      </div>

      <CategoryRail categories={categories} />

      <div className={`mt-5 grid gap-7 ${view === "map" ? "lg:grid-cols-[minmax(320px,0.72fr)_1.28fr]" : "lg:grid-cols-[1fr_360px]"}`}>
        <section className={`grid gap-5 sm:grid-cols-2 ${view === "map" ? "order-2 lg:order-1 lg:max-h-[72vh] lg:grid-cols-1 lg:overflow-y-auto lg:pr-2" : ""}`}>
          {items.length > 0 ? (
            items.map((item) => (
              <ListingCard
                key={item.id}
                {...item}
                href={`/${category}/${item.id}`}
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-slate-900">No results found</h2>
              <p className="mt-2 text-sm text-slate-500">
                Try another destination or clear the location field.
              </p>
            </div>
          )}
        </section>
        {view === "map" ? (
          <div className="order-1 lg:order-2">
            <ListingMap category={category} items={mapItems} />
          </div>
        ) : (
          <Filters category={category} />
        )}
      </div>

      {view === "card" && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={resultCount}
        />
      )}
    </div>
  );
}
