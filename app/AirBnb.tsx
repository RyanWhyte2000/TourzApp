import { BedDouble, Bath } from "lucide-react";
import type { CategoryRailItem } from "./CategoryRail";
import ListingLayout, {
  filterListings,
  ListingSearchParams,
  searchLocation,
} from "./ListingLayout";

const categories: CategoryRailItem[] = [
  { label: "Cabin", count: 2, icon: "home" },
  { label: "Country Side", count: 2, icon: "trees" },
  { label: "Tiny Homes", count: 1, icon: "building" },
  { label: "Farm Houses", count: 1, icon: "hotel" },
  { label: "Camping", count: 0, icon: "tent" },
  { label: "Iconic Cities", count: 1, icon: "building" },
  { label: "Lake Front", count: 1, icon: "waves" },
];

export const properties = [
  {
    id: "ironshore-mansion",
    title: "Beautiful Ironshore Mansion",
    filterTags: ["Entire place", "House", "Iconic Cities"],
    filterValues: { bedrooms: 3, beds: 3, bathrooms: 1 },
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    meta: [
      { icon: <BedDouble className="size-4" />, label: "3 bed" },
      { icon: <Bath className="size-4" />, label: "1 bath" },
    ],
  },
  {
    id: "starlit-summit-cabin",
    title: "Starlit Summit Cabin",
    filterTags: ["Entire place", "Cabin", "Country Side"],
    filterValues: { bedrooms: 3, beds: 3, bathrooms: 1 },
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    price: "$520",
    rating: "4.8",
    meta: [
      { icon: <BedDouble className="size-4" />, label: "3 bed" },
      { icon: <Bath className="size-4" />, label: "1 bath" },
    ],
  },
  {
    id: "moonlit-timber-haven",
    title: "Moonlit Timber Haven",
    filterTags: ["Entire place", "Cabin", "Country Side"],
    filterValues: { bedrooms: 3, beds: 3, bathrooms: 2 },
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
    price: "$540",
    rating: "4.8",
    meta: [
      { icon: <BedDouble className="size-4" />, label: "3 bed" },
      { icon: <Bath className="size-4" />, label: "2 bath" },
    ],
  },
  {
    id: "crystal-lake-hideout",
    title: "Crystal Lake Hideout",
    filterTags: ["Entire place", "House", "Lake Front"],
    filterValues: { bedrooms: 4, beds: 4, bathrooms: 2 },
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    meta: [
      { icon: <BedDouble className="size-4" />, label: "4 bed" },
      { icon: <Bath className="size-4" />, label: "2 bath" },
    ],
  },
  {
    id: "sunset-valley-retreat",
    title: "Sunset Valley Retreat",
    filterTags: ["Entire place", "House", "Farm Houses"],
    filterValues: { bedrooms: 3, beds: 3, bathrooms: 1 },
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
    price: "$510",
    rating: "4.8",
    meta: [
      { icon: <BedDouble className="size-4" />, label: "3 bed" },
      { icon: <Bath className="size-4" />, label: "1 bath" },
    ],
  },
  {
    id: "oceanview-villa",
    title: "Oceanview Villa",
    filterTags: ["Entire place", "Villa", "Tiny Homes"],
    filterValues: { bedrooms: 3, beds: 3, bathrooms: 1 },
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    meta: [
      { icon: <BedDouble className="size-4" />, label: "3 bed" },
      { icon: <Bath className="size-4" />, label: "1 bath" },
    ],
  },
];

function AirBnb({ search = {} }: { search?: ListingSearchParams }) {
  const items = filterListings(properties, search);

  return (
    <ListingLayout
      category="airbnb"
      resultCount={items.length}
      location={searchLocation(search)}
      categories={categories}
      items={items}
    />
  );
}

export default AirBnb;
