import type { CategoryRailItem } from "./CategoryRail";
import ListingLayout, { ListingSearchParams, searchLocation } from "./ListingLayout";
import { getCategoryCounts, getListings } from "@/lib/listings/queries";

const categoryOptions: Omit<CategoryRailItem, "count">[] = [
  { label: "Jamaican", icon: "flame" },
  { label: "Seafood", icon: "fish" },
  { label: "Italian", icon: "pizza" },
  { label: "Street Food", icon: "utensils" },
  { label: "Fine Dining", icon: "wine" },
  { label: "Vegetarian", icon: "utensils" },
];

async function Food({ search = {} }: { search?: ListingSearchParams }) {
  const labels = categoryOptions.map(({ label }) => label);
  const [result, counts] = await Promise.all([
    getListings({ category: "food", search }),
    getCategoryCounts("food", labels),
  ]);
  const categories = categoryOptions.map((option) => ({ ...option, count: counts[option.label] ?? 0 }));

  return (
    <ListingLayout
      category="food"
      resultCount={result.totalCount}
      location={searchLocation(search)}
      categories={categories}
      items={result.items}
      currentPage={result.page}
      pageSize={result.pageSize}
    />
  );
}

export default Food;
