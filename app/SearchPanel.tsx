"use client";

import {
  BedDouble,
  CalendarDays,
  CarFront,
  Clock,
  Hamburger,
  Home,
  Hotel,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete";
import SearchField from "./SearchField";

const tabs = [
  { href: "/transport", label: "Transport", icon: CarFront },
  { href: "/airbnb", label: "AirBnb", icon: Home },
  { href: "/food", label: "Food", icon: Hamburger },
  { href: "/hotel", label: "Hotel", icon: Hotel },
] as const;

type Category = "transport" | "airbnb" | "food" | "hotel";

const categoryByPath: Record<string, Category> = {
  "/": "airbnb",
  "/airbnb": "airbnb",
  "/food": "food",
  "/hotel": "hotel",
  "/transport": "transport",
};

const categoryParams = [
  "where",
  "pickup",
  "dropoff",
  "checkIn",
  "checkOut",
  "date",
  "time",
  "pickupDate",
  "returnDate",
  "guests",
  "rooms",
  "partySize",
];

function SearchPanel({ onSearchComplete }: { onSearchComplete?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = categoryByPath[pathname] ?? "airbnb";

  return (
    <section className="bg-slate-50 px-4 py-6 sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl rounded-[1.3rem] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
        <div className="grid grid-cols-4 border-b border-slate-100 text-sm font-medium sm:w-105">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.href === `/${category}`;
            const location = searchParams.get("where") ?? searchParams.get("pickup");
            const href = location
              ? `${tab.href}?${new URLSearchParams({ where: location })}`
              : tab.href;

            return (
              <Link
                key={tab.href}
                href={href}
                className={`flex h-12 items-center justify-center gap-2 border-r border-slate-100 last:border-r-0 ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-700"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>

        <CategorySearchForm
          key={`${category}-${searchParams.toString()}`}
          category={category}
          onSearchComplete={onSearchComplete}
        />
      </div>
    </section>
  );
}

function CategorySearchForm({
  category,
  onSearchComplete,
}: {
  category: Category;
  onSearchComplete?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultLocation = searchParams.get("where") ?? "Montego Bay, Jamaica";
  const [where, setWhere] = useState(defaultLocation);
  const [pickup, setPickup] = useState(
    searchParams.get("pickup") ?? defaultLocation,
  );
  const [dropoff, setDropoff] = useState(searchParams.get("dropoff") ?? "");
  const [start, setStart] = useState(
    searchParams.get("checkIn") ??
      searchParams.get("date") ??
      searchParams.get("pickupDate") ??
      "",
  );
  const [end, setEnd] = useState(
    searchParams.get("checkOut") ?? searchParams.get("returnDate") ?? "",
  );
  const [time, setTime] = useState(searchParams.get("time") ?? "");
  const [quantity, setQuantity] = useState(
    searchParams.get("guests") ??
      searchParams.get("rooms") ??
      searchParams.get("partySize") ??
      "1",
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    categoryParams.forEach((name) => params.delete(name));

    const values =
      category === "transport"
        ? { pickup: pickup.trim(), dropoff: dropoff.trim(), pickupDate: start, returnDate: end }
        : category === "food"
          ? { where: where.trim(), date: start, time, partySize: quantity }
          : category === "hotel"
            ? { where: where.trim(), checkIn: start, checkOut: end, rooms: quantity }
            : { where: where.trim(), checkIn: start, checkOut: end, guests: quantity };

    Object.entries(values).forEach(([name, value]) => {
      if (value) params.set(name, value);
    });

    router.push(`${pathname}?${params.toString()}`);
    onSearchComplete?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid divide-y divide-slate-100 lg:grid-cols-[1.35fr_0.75fr_0.75fr_0.85fr_auto] lg:divide-x lg:divide-y-0"
    >
      {category === "transport" ? (
        <>
          <LocationAutocomplete
            label="Pickup"
            placeholder="Pickup location"
            value={pickup}
            onChange={setPickup}
          />
          <LocationAutocomplete
            label="Drop-off"
            placeholder="Drop-off location"
            value={dropoff}
            onChange={setDropoff}
          />
          <SearchField
            label="Pickup date"
            type="date"
            value={start}
            onChange={setStart}
            icon={<CalendarDays className="size-4" />}
          />
          <SearchField
            label="Return date"
            type="date"
            value={end}
            onChange={setEnd}
            icon={<CalendarDays className="size-4" />}
          />
        </>
      ) : (
        <>
          <LocationAutocomplete
            label={category === "food" ? "Dining area" : "Destination"}
            placeholder={category === "food" ? "Search dining areas" : "Search destinations"}
            value={where}
            onChange={setWhere}
          />
          <SearchField
            label={category === "food" ? "Date" : "Check-in"}
            type="date"
            value={start}
            onChange={setStart}
            icon={<CalendarDays className="size-4" />}
          />
          {category === "food" ? (
            <SearchField
              label="Time"
              type="time"
              value={time}
              onChange={setTime}
              icon={<Clock className="size-4" />}
            />
          ) : (
            <SearchField
              label="Check-out"
              type="date"
              value={end}
              onChange={setEnd}
              icon={<CalendarDays className="size-4" />}
            />
          )}
          <SearchField
            label={category === "food" ? "Party size" : category === "hotel" ? "Rooms" : "Guests"}
            type="number"
            value={quantity}
            onChange={setQuantity}
            min={1}
            icon={category === "hotel" ? <BedDouble className="size-4" /> : <UserRound className="size-4" />}
            placeholder={category === "food" ? "Number of diners" : undefined}
          />
        </>
      )}

      <button
        type="submit"
        className="m-3 inline-flex h-14 items-center justify-center gap-2 rounded-r-[1rem] bg-violet-700 px-7 text-sm font-semibold text-white transition hover:bg-violet-800 lg:m-0 lg:h-auto lg:rounded-r-[1.3rem]"
      >
        {category === "transport" ? <MapPin className="size-4" /> : <Search className="size-4" />}
        Search
      </button>
    </form>
  );
}

export default SearchPanel;
