import {
  Bath,
  BedDouble,
  Bus,
  CarFront,
  CircleGauge,
  Fish,
  Gauge,
  Info,
  Pizza,
  Star,
  Truck,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";
import { cache } from "react";
import type { ListingItem, ListingSearchParams } from "@/app/ListingLayout";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ListingQuery, ListingRow } from "./types";

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function numberFrom(value?: string | string[]) {
  const parsed = Number.parseFloat(first(value) ?? "");
  return Number.isFinite(parsed) ? parsed : undefined;
}

function iconForMeta(label: string) {
  const value = label.toLocaleLowerCase();
  if (value.includes("bath")) return <Bath className="size-4" />;
  if (value.includes("bed") || value.includes("room")) return <BedDouble className="size-4" />;
  if (value.includes("star")) return <Star className="size-4" />;
  if (value.includes("wifi") || value.includes("inclusive")) return <Wifi className="size-4" />;
  if (value.includes("pool") || value.includes("beach")) return <Waves className="size-4" />;
  if (value.includes("seat")) return <Users className="size-4" />;
  if (value.includes("suv") || value.includes("4x4")) return <Truck className="size-4" />;
  if (value.includes("van")) return <Bus className="size-4" />;
  if (value.includes("sedan")) return <CarFront className="size-4" />;
  if (value.includes("auto")) return <Gauge className="size-4" />;
  if (value.includes("seafood")) return <Fish className="size-4" />;
  if (value.includes("italian")) return <Pizza className="size-4" />;
  if (value.includes("meal") || value.includes("jerk")) return <UtensilsCrossed className="size-4" />;
  if (value.includes("min")) return <CircleGauge className="size-4" />;
  return <Info className="size-4" />;
}

function toListingItem(row: ListingRow): ListingItem {
  const price = Number(row.price);
  const rating = Number(row.rating);

  return {
    id: row.id,
    title: row.title,
    image: row.image_url,
    price: `$${Number.isInteger(price) ? price : price.toFixed(2)}`,
    rating: rating.toFixed(1),
    subtitle: row.subtitle ?? undefined,
    priceSuffix: row.price_suffix,
    totalPrice: row.total_price ?? undefined,
    filterTags: row.filter_tags ?? [],
    filterValues: row.filter_values ?? {},
    meta: (row.meta ?? []).map(({ label }) => ({ label, icon: iconForMeta(label) })),
  };
}

export async function getListings({ category, search = {} }: ListingQuery) {
  const supabase = createServerSupabaseClient();
  const location = first(search.where ?? search.pickup)?.split(",")[0].trim() || null;
  const tags = search.tag ? (Array.isArray(search.tag) ? search.tag : [search.tag]) : [];
  const rail = first(search.rail);
  if (rail) tags.push(rail);
  const pageSize = [6, 9, 12, 18].includes(numberFrom(search.pageSize) ?? 9)
    ? (numberFrom(search.pageSize) ?? 9)
    : 9;
  const page = Math.max(1, Math.floor(numberFrom(search.page) ?? 1));
  const requestedSort = first(search.sort) ?? "latest";
  const sort = ["latest", "oldest", "rating", "price_asc", "price_desc"].includes(requestedSort)
    ? requestedSort
    : "latest";
  const includeMap = first(search.view) === "map";

  const numericFilters = Object.fromEntries(
    ["bedrooms", "beds", "bathrooms", "starRating", "rooms", "seats", "luggage"]
      .map((name) => [name, numberFrom(search[name as keyof ListingSearchParams])])
      .filter((entry): entry is [string, number] => entry[1] !== undefined),
  );

  const { data, error } = await supabase.rpc("search_listings", {
    p_category: category,
    p_destination: location,
    p_tags: tags,
    p_min_price: numberFrom(search.minPrice) ?? null,
    p_max_price: numberFrom(search.maxPrice) ?? null,
    p_min_rating: numberFrom(search.minRating) ?? null,
    p_numeric_filters: numericFilters,
    p_limit: pageSize,
    p_offset: (page - 1) * pageSize,
    p_sort: sort,
    p_include_map: includeMap,
  });

  if (error) throw new Error(`Unable to load ${category} listings: ${error.message}`);
  const result = data as {
    items?: ListingRow[];
    mapItems?: import("./types").MapListing[];
    totalCount?: number;
  } | null;
  return {
    items: (result?.items ?? []).map(toListingItem),
    totalCount: Number(result?.totalCount ?? 0),
    page,
    pageSize,
    mapItems: result?.mapItems ?? [],
  };
}

export const getListing = cache(async (category: ListingRow["category"], id: string) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("category", category)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Unable to load listing ${id}: ${error.message}`);
  return data ? toListingItem(data as ListingRow) : null;
});

export async function getCategoryCounts(category: ListingRow["category"], labels: string[]) {
  const supabase = createServerSupabaseClient();
  const counts = await Promise.all(labels.map(async (label) => {
    const { count, error } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("category", category)
      .eq("status", "published")
      .contains("filter_tags", [label]);
    if (error) throw new Error(`Unable to count ${label}: ${error.message}`);
    return [label, count ?? 0] as const;
  }));
  return Object.fromEntries(counts) as Record<string, number>;
}
