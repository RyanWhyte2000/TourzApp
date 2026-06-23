import { BedDouble, Bath, Home, Trees, Building2, Hotel, TentTree, Waves } from "lucide-react";
import ListingLayout from "./ListingLayout";

const categories = [
  { label: "Cabin", count: 12, icon: Home, active: true },
  { label: "Country Side", count: 17, icon: Trees },
  { label: "Tiny Homes", count: 12, icon: Building2 },
  { label: "Farm Houses", count: 9, icon: Hotel },
  { label: "Camping", count: 8, icon: TentTree },
  { label: "Iconic Cities", count: 6, icon: Building2 },
  { label: "Lake Front", count: 5, icon: Waves },
];

const properties = [
  {
    title: "Beautiful Ironshore Mansion",
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
    title: "Starlit Summit Cabin",
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
    title: "Moonlit Timber Haven",
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
    title: "Crystal Lake Hideout",
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
    title: "Sunset Valley Retreat",
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
    title: "Oceanview Villa",
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

function AirBnb() {
  return (
    <ListingLayout
      resultCount={1024}
      location="Montego Bay, Jamaica"
      categories={categories}
      items={properties}
    />
  );
}

export default AirBnb;
