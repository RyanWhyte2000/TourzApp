import type { CategoryRailItem } from "./CategoryRail";
import ListingLayout, { ListingSearchParams, searchLocation } from "./ListingLayout";
import { getCategoryCounts, getListings } from "@/lib/listings/queries";

const categoryOptions: Omit<CategoryRailItem, "count">[] = [
  { label: "Sedan", icon: "car" },
  { label: "SUV", icon: "truck" },
  { label: "Van", icon: "bus" },
  { label: "Luxury", icon: "car" },
  { label: "Economy", icon: "car" },
  { label: "Motorcycle", icon: "bike" },
];

async function Transport({ search = {} }: { search?: ListingSearchParams }) {
  const labels = categoryOptions.map(({ label }) => label);
  const [result, counts] = await Promise.all([
    getListings({ category: "transport", search }),
    getCategoryCounts("transport", labels),
  ]);
  const categories = categoryOptions.map((option) => ({ ...option, count: counts[option.label] ?? 0 }));

  return (
    <ListingLayout
      category="transport"
      resultCount={result.totalCount}
      location={searchLocation(search)}
      categories={categories}
      items={result.items}
      currentPage={result.page}
      pageSize={result.pageSize}
    />
  );
}

export default Transport;
