import type { CategoryRailItem } from "./CategoryRail";
import ListingLayout, { ListingSearchParams, searchLocation, searchView } from "./ListingLayout";
import { getCategoryCounts, getListings } from "@/lib/listings/queries";

const categoryOptions: Omit<CategoryRailItem, "count">[] = [
  { label: "Cabin", icon: "home" },
  { label: "Country Side", icon: "trees" },
  { label: "Tiny Homes", icon: "building" },
  { label: "Farm Houses", icon: "hotel" },
  { label: "Camping", icon: "tent" },
  { label: "Iconic Cities", icon: "building" },
  { label: "Lake Front", icon: "waves" },
];

async function AirBnb({ search = {} }: { search?: ListingSearchParams }) {
  const labels = categoryOptions.map(({ label }) => label);
  const [result, counts] = await Promise.all([
    getListings({ category: "airbnb", search }),
    getCategoryCounts("airbnb", labels),
  ]);
  const categories = categoryOptions.map((option) => ({ ...option, count: counts[option.label] ?? 0 }));

  return (
    <ListingLayout
      category="airbnb"
      resultCount={result.totalCount}
      location={searchLocation(search)}
      categories={categories}
      items={result.items}
      currentPage={result.page}
      pageSize={result.pageSize}
      mapItems={result.mapItems}
      view={searchView(search)}
    />
  );
}

export default AirBnb;
