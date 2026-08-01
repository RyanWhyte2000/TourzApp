import { CarFront, Bus, Truck, Gauge, Users } from "lucide-react";
import type { CategoryRailItem } from "./CategoryRail";
import ListingLayout, {
  filterListings,
  ListingSearchParams,
  searchLocation,
} from "./ListingLayout";

const categories: CategoryRailItem[] = [
  { label: "Sedan", count: 3, icon: "car" },
  { label: "SUV", count: 2, icon: "truck" },
  { label: "Van", count: 1, icon: "bus" },
  { label: "Luxury", count: 1, icon: "car" },
  { label: "Economy", count: 1, icon: "car" },
  { label: "Motorcycle", count: 0, icon: "bike" },
];

export const vehicles = [
  {
    id: "toyota-corolla-2024",
    title: "Toyota Corolla 2024",
    filterTags: ["Sedan", "Automatic", "Air conditioning", "Unlimited mileage", "Airport pickup"],
    filterValues: { seats: 5, luggage: 2 },
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
    price: "$45",
    rating: "4.9",
    subtitle: "Sangster Intl Airport, Montego Bay",
    meta: [
      { icon: <CarFront className="size-4" />, label: "Sedan" },
      { icon: <Users className="size-4" />, label: "5 seats" },
    ],
    priceSuffix: "/day",
    totalPrice: "$900/total",
  },
  {
    id: "honda-crv-suv",
    title: "Honda CR-V SUV",
    filterTags: ["SUV", "Automatic", "Air conditioning", "Unlimited mileage"],
    filterValues: { seats: 7, luggage: 4 },
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    price: "$65",
    rating: "4.7",
    subtitle: "Rose Hall, Montego Bay",
    meta: [
      { icon: <Truck className="size-4" />, label: "SUV" },
      { icon: <Users className="size-4" />, label: "7 seats" },
    ],
    priceSuffix: "/day",
    totalPrice: "$1,300/total",
  },
  {
    id: "mercedes-benz-e-class",
    title: "Mercedes-Benz E-Class",
    filterTags: ["Sedan", "Automatic", "Air conditioning", "Airport pickup"],
    filterValues: { seats: 5, luggage: 3 },
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
    price: "$120",
    rating: "4.9",
    subtitle: "Ironshore, Montego Bay",
    meta: [
      { icon: <CarFront className="size-4" />, label: "Luxury" },
      { icon: <Gauge className="size-4" />, label: "Auto" },
    ],
    priceSuffix: "/day",
    totalPrice: "$2,400/total",
  },
  {
    id: "toyota-hiace-van",
    title: "Toyota Hiace Van",
    filterTags: ["Van", "Automatic", "Air conditioning", "Airport pickup"],
    filterValues: { seats: 12, luggage: 6 },
    image:
      "https://images.unsplash.com/photo-1544627669-8a4e3e4a4b4e?auto=format&fit=crop&w=900&q=80",
    price: "$85",
    rating: "4.6",
    subtitle: "Downtown Montego Bay",
    meta: [
      { icon: <Bus className="size-4" />, label: "Van" },
      { icon: <Users className="size-4" />, label: "12 seats" },
    ],
    priceSuffix: "/day",
    totalPrice: "$1,700/total",
  },
  {
    id: "nissan-sentra",
    title: "Nissan Sentra",
    filterTags: ["Sedan", "Automatic", "Air conditioning", "Unlimited mileage"],
    filterValues: { seats: 5, luggage: 2 },
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058498ceb8?auto=format&fit=crop&w=900&q=80",
    price: "$38",
    rating: "4.5",
    subtitle: "Freeport, Montego Bay",
    meta: [
      { icon: <CarFront className="size-4" />, label: "Economy" },
      { icon: <Users className="size-4" />, label: "5 seats" },
    ],
    priceSuffix: "/day",
    totalPrice: "$760/total",
  },
  {
    id: "jeep-wrangler-4x4",
    title: "Jeep Wrangler 4x4",
    filterTags: ["SUV", "Automatic", "Air conditioning", "Unlimited mileage"],
    filterValues: { seats: 4, luggage: 2 },
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
    price: "$95",
    rating: "4.8",
    subtitle: "Falmouth Road, Montego Bay",
    meta: [
      { icon: <Truck className="size-4" />, label: "4x4" },
      { icon: <Users className="size-4" />, label: "4 seats" },
    ],
    priceSuffix: "/day",
    totalPrice: "$1,900/total",
  },
];

function Transport({ search = {} }: { search?: ListingSearchParams }) {
  const items = filterListings(vehicles, search);

  return (
    <ListingLayout
      category="transport"
      resultCount={items.length}
      location={searchLocation(search)}
      categories={categories}
      items={items}
    />
  );
}

export default Transport;
