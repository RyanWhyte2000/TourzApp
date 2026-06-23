import { UtensilsCrossed, Fish, Pizza, Flame, Wine, Clock } from "lucide-react";
import ListingLayout from "./ListingLayout";

const categories = [
  { label: "Jamaican", count: 42, icon: Flame, active: true },
  { label: "Seafood", count: 28, icon: Fish },
  { label: "Italian", count: 15, icon: Pizza },
  { label: "Street Food", count: 36, icon: UtensilsCrossed },
  { label: "Fine Dining", count: 12, icon: Wine },
  { label: "Vegetarian", count: 18, icon: UtensilsCrossed },
];

const restaurants = [
  {
    title: "Scotchies Jerk Centre",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
    price: "$18",
    rating: "4.9",
    subtitle: "Drumblair Rd, Montego Bay",
    meta: [
      { icon: <Flame className="size-4" />, label: "Jerk" },
      { icon: <Clock className="size-4" />, label: "30 min" },
    ],
    priceSuffix: "/meal",
    totalPrice: "$360/total",
  },
  {
    title: "The Pelican Grill",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    price: "$45",
    rating: "4.8",
    subtitle: "Gloucester Ave, Montego Bay",
    meta: [
      { icon: <Fish className="size-4" />, label: "Seafood" },
      { icon: <Clock className="size-4" />, label: "45 min" },
    ],
    priceSuffix: "/meal",
    totalPrice: "$900/total",
  },
  {
    title: "Margaritaville Montego Bay",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    price: "$32",
    rating: "4.6",
    subtitle: "Hip Strip, Montego Bay",
    meta: [
      { icon: <UtensilsCrossed className="size-4" />, label: "American" },
      { icon: <Clock className="size-4" />, label: "40 min" },
    ],
    priceSuffix: "/meal",
    totalPrice: "$640/total",
  },
  {
    title: "Pier One Seafood",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
    price: "$55",
    rating: "4.7",
    subtitle: "Howard Cooke Blvd, Montego Bay",
    meta: [
      { icon: <Fish className="size-4" />, label: "Seafood" },
      { icon: <Wine className="size-4" />, label: "Fine dining" },
    ],
    priceSuffix: "/meal",
    totalPrice: "$1,100/total",
  },
  {
    title: "Juici Patties",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
    price: "$8",
    rating: "4.5",
    subtitle: "Fairview, Montego Bay",
    meta: [
      { icon: <UtensilsCrossed className="size-4" />, label: "Street food" },
      { icon: <Clock className="size-4" />, label: "15 min" },
    ],
    priceSuffix: "/meal",
    totalPrice: "$160/total",
  },
  {
    title: "Evita's Italian Restaurant",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    price: "$38",
    rating: "4.8",
    subtitle: "Edgewater Dr, Montego Bay",
    meta: [
      { icon: <Pizza className="size-4" />, label: "Italian" },
      { icon: <Clock className="size-4" />, label: "50 min" },
    ],
    priceSuffix: "/meal",
    totalPrice: "$760/total",
  },
];

function Food() {
  return (
    <ListingLayout
      resultCount={312}
      location="Montego Bay, Jamaica"
      categories={categories}
      items={restaurants}
    />
  );
}

export default Food;
