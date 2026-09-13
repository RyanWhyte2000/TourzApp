import type { CategoryRailItem } from "./CategoryRail";
import ListingLayout, { ListingSearchParams, searchLocation, searchView } from "./ListingLayout";
import { getCategoryCounts, getListings } from "@/lib/listings/queries";

const categoryOptions: Omit<CategoryRailItem, "count">[] = [
  { label: "Sedan", icon: "car" },
  { label: "SUV", icon: "truck" },
  { label: "Van", icon: "bus" },
  { label: "Luxury", icon: "car" },
  { label: "Economy", icon: "car" },
  { label: "Motorcycle", icon: "bike" },
];

const localDriverListings = [
  { id: "local-andre-campbell", title: "Andre Campbell", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80", price: "$85", rating: "4.9", subtitle: "Toyota Noah · 7 seats · Montego Bay & Negril", priceSuffix: "/day", providerName: "Campbell Island Tours", providerLabel: "Driver company" },
  { id: "local-shanice-williams", title: "Shanice Williams", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80", price: "$70", rating: "4.8", subtitle: "Honda CR-V · 5 seats · Kingston & Ocho Rios", priceSuffix: "/day", providerName: "Shanice Jamaica Rides", providerLabel: "Driver company" },
  { id: "local-dwayne-thompson", title: "Dwayne Thompson", image: "https://images.unsplash.com/photo-1544627669-8a4e3e4a4b4e?auto=format&fit=crop&w=900&q=80", price: "$110", rating: "5.0", subtitle: "Toyota Hiace · 12 seats · Airport transfers", priceSuffix: "/day", providerName: "Dwayne's Island Transfers", providerLabel: "Driver company" },
];

async function Transport({ search = {}, mode = "rental" }: { search?: ListingSearchParams; mode?: "rental" | "driver" }) {
  const labels = categoryOptions.map(({ label }) => label);
  const [result, counts] = await Promise.all([
    getListings({ category: "transport", search }),
    getCategoryCounts("transport", labels),
  ]);
  if (mode === "driver") {
    return <ListingLayout category="transport" resultCount={localDriverListings.length} location={searchLocation(search)} categories={[]} items={localDriverListings} currentPage={1} pageSize={localDriverListings.length} mapItems={[]} view="card" heading="Available Local Drivers near " />;
  }
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
      mapItems={result.mapItems}
      view={searchView(search)}
    />
  );
}

export default Transport;
