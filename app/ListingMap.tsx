"use client";

import dynamic from "next/dynamic";
import type { ListingCategory } from "./ListingLayout";
import type { MapListing } from "@/lib/listings/types";

const ListingMapClient = dynamic(() => import("./ListingMapClient"), {
  ssr: false,
  loading: () => <div className="h-[65dvh] animate-pulse rounded-2xl bg-slate-100 lg:h-[72vh]" />,
});

export default function ListingMap({
  category,
  items,
}: {
  category: ListingCategory;
  items: MapListing[];
}) {
  return <ListingMapClient category={category} items={items} />;
}
