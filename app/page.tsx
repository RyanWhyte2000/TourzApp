import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CarFront,
  ChevronDown,
  CircleDollarSign,
  Hamburger,
  Heart,
  Home,
  Hotel,
  LayoutGrid,
  ListFilter,
  Map,
  Menu,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TentTree,
  Trees,
  UserRound,
  Waves,
} from "lucide-react";

import NavigationMenuDemo from "@/app/navigtionMenu";
import PropertyCard from "./propertycard";
import SearchPanel from "./SearchPanel";
import CategoryRail from "./CategoryRail";
import Filters from "./Filters";



const properties = [
  {
    title: "Beautiful Malibu Mansion",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    beds: 3,
    baths: 1,
  },
  {
    title: "Starlit Summit Cabin",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    price: "$520",
    rating: "4.8",
    beds: 3,
    baths: 1,
  },
  {
    title: "Moonlit Timber Haven",
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=80",
    price: "$540",
    rating: "4.8",
    beds: 3,
    baths: 2,
  },
  {
    title: "Crystal Lake Hideout",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    beds: 4,
    baths: 2,
  },
  {
    title: "Sunset Valley Retreat",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
    price: "$510",
    rating: "4.8",
    beds: 3,
    baths: 1,
  },
  {
    title: "Beautiful Malibu Mansion",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    price: "$620",
    rating: "4.8",
    beds: 3,
    baths: 1,
  },
];


export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#dfe2f0] px-3 py-4 text-slate-950 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-[1460px] overflow-hidden rounded-[1.6rem] bg-white shadow-[0_24px_70px_rgba(31,41,55,0.12)]">
        <NavigationMenuDemo />
        <SearchPanel />

        <div className="border-t border-slate-200/80 px-4 py-5 sm:px-7 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-lg font-medium tracking-[-0.03em] sm:text-xl">
              Found 1024 results near{" "}
              <span className="font-semibold"> Montego Bay, Jamaica</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm">
                <ListFilter className="size-4" />
                Latest
                <ChevronDown className="size-4" />
              </button>
              <button className="hidden h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium shadow-sm sm:inline-flex">
                <Map className="size-4" />
                Map View
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 text-sm font-semibold shadow-sm">
                <LayoutGrid className="size-4" />
                Card View
              </button>
            </div>
          </div>

          <CategoryRail />

          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_360px]">
            <section className="grid gap-5 sm:grid-cols-2">
              {properties.map((property) => (
                <PropertyCard key={`${property.title}-${property.image}`} {...property} />
              ))}
            </section>
            <Filters />
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {["1", "2", "3", "...", "8", "9", "10"].map((page) => (
                <button
                  key={page}
                  className={`size-8 rounded-full ${
                    page === "2" ? "bg-slate-100 font-semibold" : "text-slate-600"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 text-slate-700">
              Show: 9 <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}







