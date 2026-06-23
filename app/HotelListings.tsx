import { Hotel, Building2, Waves, Star, BedDouble, Wifi } from "lucide-react";
import ListingLayout from "./ListingLayout";

const categories = [
  { label: "Luxury", count: 14, icon: Star, active: true },
  { label: "Resort", count: 22, icon: Waves },
  { label: "Boutique", count: 18, icon: Building2 },
  { label: "Beachfront", count: 16, icon: Waves },
  { label: "Budget", count: 34, icon: Hotel },
  { label: "All-Inclusive", count: 11, icon: Hotel },
];

const hotels = [
  {
    title: "Half Moon Resort",
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
    title: "Secrets St. James",
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
    title: "Riu Montego Bay",
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
    title: "Deja Resort",
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
    title: "S Hotel Montego Bay",
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
    title: "Holiday Inn Resort",
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

function HotelListings() {
  return (
    <ListingLayout
      resultCount={648}
      location="Montego Bay, Jamaica"
      categories={categories}
      items={hotels}
    />
  );
}

export default HotelListings;
