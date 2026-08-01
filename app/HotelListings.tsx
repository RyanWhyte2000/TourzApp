import type { CategoryRailItem } from "./CategoryRail";
import ListingLayout, { ListingSearchParams, searchLocation } from "./ListingLayout";
import { getCategoryCounts, getListings } from "@/lib/listings/queries";

const categoryOptions: Omit<CategoryRailItem, "count">[] = [
  { label: "Luxury", icon: "star" },
  { label: "Resort", icon: "waves" },
  { label: "Boutique", icon: "building" },
  { label: "Beachfront", icon: "waves" },
  { label: "Budget", icon: "hotel" },
  { label: "All-Inclusive", icon: "hotel" },
];

async function HotelListings({ search = {} }: { search?: ListingSearchParams }) {
  const labels = categoryOptions.map(({ label }) => label);
  const [result, counts] = await Promise.all([
    getListings({ category: "hotel", search }),
    getCategoryCounts("hotel", labels),
  ]);
  const categories = categoryOptions.map((option) => ({ ...option, count: counts[option.label] ?? 0 }));

  return (
    <ListingLayout
      category="hotel"
      resultCount={result.totalCount}
      location={searchLocation(search)}
      categories={categories}
      items={result.items}
      currentPage={result.page}
      pageSize={result.pageSize}
    />
  );
}

export default HotelListings;
