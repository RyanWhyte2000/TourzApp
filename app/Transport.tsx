import { CarFront, Bus, Truck, Bike, Gauge, Users } from "lucide-react";
import ListingLayout from "./ListingLayout";

const categories = [
  { label: "Sedan", count: 24, icon: CarFront, active: true },
  { label: "SUV", count: 18, icon: Truck },
  { label: "Van", count: 12, icon: Bus },
  { label: "Luxury", count: 8, icon: CarFront },
  { label: "Economy", count: 31, icon: CarFront },
  { label: "Motorcycle", count: 6, icon: Bike },
];

const vehicles = [
  {
    title: "Toyota Corolla 2024",
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
    title: "Honda CR-V SUV",
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
    title: "Mercedes-Benz E-Class",
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
    title: "Toyota Hiace Van",
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
    title: "Nissan Sentra",
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
    title: "Jeep Wrangler 4x4",
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

function Transport() {
  return (
    <ListingLayout
      resultCount={486}
      location="Montego Bay, Jamaica"
      categories={categories}
      items={vehicles}
    />
  );
}

export default Transport;
