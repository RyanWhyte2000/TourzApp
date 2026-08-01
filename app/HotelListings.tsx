import { Building2, Waves, Star, BedDouble, Wifi } from "lucide-react";
import type { CategoryRailItem } from "./CategoryRail";
import ListingLayout, {
  filterListings,
  ListingSearchParams,
  searchLocation,
} from "./ListingLayout";

const categories: CategoryRailItem[] = [
  { label: "Luxury", count: 3, icon: "star" },
  { label: "Resort", count: 5, icon: "waves" },
  { label: "Boutique", count: 1, icon: "building" },
  { label: "Beachfront", count: 1, icon: "waves" },
  { label: "Budget", count: 2, icon: "hotel" },
  { label: "All-Inclusive", count: 2, icon: "hotel" },
];

export const hotels = [
  {
    id: "half-moon-resort",
    title: "Half Moon Resort",
    filterTags: ["Hotel", "Resort", "Luxury", "Swimming pool", "Breakfast included"],
    filterValues: { starRating: 5, rooms: 2 },
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    price: "$420",
    rating: "4.9",
    subtitle: "Rose Hall, Montego Bay",
    meta: [
      { icon: <Star className="size-4" />, label: "5 star" },
      { icon: <BedDouble className="size-4" />, label: "2 rooms" },
    ],
    priceSuffix: "/night",
    totalPrice: "$8,400/total",
  },
  {
    id: "secrets-st-james",
    title: "Secrets St. James",
    filterTags: ["Hotel", "Resort", "Luxury", "All-inclusive", "Swimming pool"],
    filterValues: { starRating: 5, rooms: 2 },
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    price: "$380",
    rating: "4.8",
    subtitle: "Freeport, Montego Bay",
    meta: [
      { icon: <Star className="size-4" />, label: "5 star" },
      { icon: <Wifi className="size-4" />, label: "All-inclusive" },
    ],
    priceSuffix: "/night",
    totalPrice: "$7,600/total",
  },
  {
    id: "riu-montego-bay",
    title: "Riu Montego Bay",
    filterTags: ["Hotel", "Resort", "Beachfront", "All-inclusive", "Swimming pool", "Airport shuttle"],
    filterValues: { starRating: 4, rooms: 2 },
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
    price: "$290",
    rating: "4.6",
    subtitle: "Ironshore, Montego Bay",
    meta: [
      { icon: <Star className="size-4" />, label: "4 star" },
      { icon: <Waves className="size-4" />, label: "Beachfront" },
    ],
    priceSuffix: "/night",
    totalPrice: "$5,800/total",
  },
  {
    id: "deja-resort",
    title: "Deja Resort",
    filterTags: ["Hotel", "Resort", "Budget", "Breakfast included"],
    filterValues: { starRating: 3, rooms: 1 },
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    price: "$185",
    rating: "4.5",
    subtitle: "Gloucester Ave, Montego Bay",
    meta: [
      { icon: <Star className="size-4" />, label: "3 star" },
      { icon: <BedDouble className="size-4" />, label: "1 room" },
    ],
    priceSuffix: "/night",
    totalPrice: "$3,700/total",
  },
  {
    id: "s-hotel-montego-bay",
    title: "S Hotel Montego Bay",
    filterTags: ["Hotel", "Boutique", "Luxury", "Airport shuttle"],
    filterValues: { starRating: 4, rooms: 1 },
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
    price: "$310",
    rating: "4.7",
    subtitle: "Jimmy Cliff Blvd, Montego Bay",
    meta: [
      { icon: <Star className="size-4" />, label: "4 star" },
      { icon: <Building2 className="size-4" />, label: "Boutique" },
    ],
    priceSuffix: "/night",
    totalPrice: "$6,200/total",
  },
  {
    id: "holiday-inn-resort",
    title: "Holiday Inn Resort",
    filterTags: ["Hotel", "Resort", "Budget", "Swimming pool", "Breakfast included"],
    filterValues: { starRating: 4, rooms: 2 },
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    price: "$220",
    rating: "4.4",
    subtitle: "Rose Hall, Montego Bay",
    meta: [
      { icon: <Star className="size-4" />, label: "4 star" },
      { icon: <Waves className="size-4" />, label: "Pool" },
    ],
    priceSuffix: "/night",
    totalPrice: "$4,400/total",
  },
];

function HotelListings({ search = {} }: { search?: ListingSearchParams }) {
  const items = filterListings(hotels, search);

  return (
    <ListingLayout
      category="hotel"
      resultCount={items.length}
      location={searchLocation(search)}
      categories={categories}
      items={items}
    />
  );
}

export default HotelListings;
