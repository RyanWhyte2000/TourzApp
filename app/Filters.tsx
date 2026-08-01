"use client";

import {
  Bike,
  Building2,
  Bus,
  CarFront,
  Fish,
  Flame,
  Home,
  Hotel,
  Pizza,
  Star,
  TentTree,
  Truck,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CheckRow from "./CheckRow";
import OptionRow from "./OptionRow";
import PriceInput from "./PriceInput";
import TypeButton from "./TypeButton";
import type { ListingCategory } from "./ListingLayout";

type CheckOption = {
  title: string;
  copy: string;
};

type TypeOption = {
  label: string;
  icon: React.ReactNode;
};

type FilterSection =
  | { kind: "checks"; title: string; options: CheckOption[] }
  | { kind: "options"; title: string; rows: { label: string; param: string; options?: string[] }[] }
  | { kind: "types"; title: string; options: TypeOption[] };

type FilterConfig = {
  priceTitle: string;
  priceCopy: string;
  minPrice: string;
  maxPrice: string;
  sections: FilterSection[];
};

const filterConfigs: Record<ListingCategory, FilterConfig> = {
  airbnb: {
    priceTitle: "Price per night",
    priceCopy: "Set the nightly price range for your stay",
    minPrice: "120",
    maxPrice: "700",
    sections: [
      {
        kind: "checks",
        title: "Type of place",
        options: [
          { title: "Entire place", copy: "A place all to yourself" },
          { title: "Private room", copy: "Your own room with shared spaces" },
          { title: "Shared room", copy: "A shared sleeping and living space" },
        ],
      },
      {
        kind: "options",
        title: "Rooms and beds",
        rows: [
          { label: "Bedrooms", param: "bedrooms" },
          { label: "Beds", param: "beds" },
          { label: "Bathrooms", param: "bathrooms" },
        ],
      },
      {
        kind: "types",
        title: "Property type",
        options: [
          { label: "House", icon: <Home className="size-5" /> },
          { label: "Apartment", icon: <Building2 className="size-5" /> },
          { label: "Villa", icon: <Hotel className="size-5" /> },
          { label: "Cabin", icon: <TentTree className="size-5" /> },
        ],
      },
    ],
  },
  hotel: {
    priceTitle: "Price per night",
    priceCopy: "Choose a nightly hotel rate",
    minPrice: "150",
    maxPrice: "600",
    sections: [
      {
        kind: "types",
        title: "Hotel type",
        options: [
          { label: "Hotel", icon: <Hotel className="size-5" /> },
          { label: "Resort", icon: <Waves className="size-5" /> },
          { label: "Boutique", icon: <Building2 className="size-5" /> },
          { label: "All-inclusive", icon: <Star className="size-5" /> },
        ],
      },
      {
        kind: "options",
        title: "Rating and rooms",
        rows: [
          { label: "Star rating", param: "starRating", options: ["Any", "3+", "4+", "5"] },
          { label: "Rooms", param: "rooms", options: ["Any", "1", "2", "3", "4+"] },
        ],
      },
      {
        kind: "checks",
        title: "Amenities",
        options: [
          { title: "Breakfast included", copy: "Breakfast is part of the rate" },
          { title: "Swimming pool", copy: "Indoor or outdoor pool access" },
          { title: "Airport shuttle", copy: "Transport to or from the airport" },
        ],
      },
    ],
  },
  food: {
    priceTitle: "Price per meal",
    priceCopy: "Set the average spend per person",
    minPrice: "8",
    maxPrice: "80",
    sections: [
      {
        kind: "types",
        title: "Cuisine",
        options: [
          { label: "Jamaican", icon: <Flame className="size-5" /> },
          { label: "Seafood", icon: <Fish className="size-5" /> },
          { label: "Italian", icon: <Pizza className="size-5" /> },
          { label: "Street food", icon: <UtensilsCrossed className="size-5" /> },
        ],
      },
      {
        kind: "checks",
        title: "Dietary needs",
        options: [
          { title: "Vegetarian", copy: "Meat-free dishes available" },
          { title: "Vegan", copy: "Plant-based dishes available" },
          { title: "Gluten-free", copy: "Gluten-free choices available" },
        ],
      },
      {
        kind: "options",
        title: "Dining preferences",
        rows: [
          { label: "Minimum rating", param: "minRating", options: ["Any", "3+", "4+", "4.5+"] },
        ],
      },
      {
        kind: "checks",
        title: "Availability",
        options: [
          { title: "Open now", copy: "Only show restaurants currently open" },
          { title: "Accepts reservations", copy: "Reserve a table in advance" },
        ],
      },
    ],
  },
  transport: {
    priceTitle: "Price per day",
    priceCopy: "Choose your daily rental budget",
    minPrice: "35",
    maxPrice: "150",
    sections: [
      {
        kind: "types",
        title: "Vehicle type",
        options: [
          { label: "Sedan", icon: <CarFront className="size-5" /> },
          { label: "SUV", icon: <Truck className="size-5" /> },
          { label: "Van", icon: <Bus className="size-5" /> },
          { label: "Motorcycle", icon: <Bike className="size-5" /> },
        ],
      },
      {
        kind: "options",
        title: "Capacity",
        rows: [
          { label: "Seats", param: "seats", options: ["Any", "2", "4", "5", "7+"] },
          { label: "Luggage", param: "luggage", options: ["Any", "1", "2", "3", "4+"] },
        ],
      },
      {
        kind: "checks",
        title: "Vehicle features",
        options: [
          { title: "Automatic", copy: "Automatic transmission" },
          { title: "Air conditioning", copy: "Climate-controlled interior" },
          { title: "Unlimited mileage", copy: "No daily distance limit" },
          { title: "Airport pickup", copy: "Collect the vehicle at the airport" },
        ],
      },
    ],
  },
};

function Filters({
  category,
  variant = "sidebar",
  headerAction,
}: {
  category: ListingCategory;
  variant?: "sidebar" | "drawer";
  headerAction?: React.ReactNode;
}) {
  const config = filterConfigs[category];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTags = searchParams.getAll("tag");
  const numericParams = config.sections
    .filter((section) => section.kind === "options")
    .flatMap((section) => section.kind === "options" ? section.rows.map((row) => row.param) : []);
  const activeCount = selectedTags.length + ["minPrice", "maxPrice", ...numericParams]
    .filter((name) => searchParams.has(name)).length;

  function navigate(params: URLSearchParams) {
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function setParam(name: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "Any") params.delete(name);
    else params.set(name, value);
    navigate(params);
  }

  function toggleTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    const tags = params.getAll("tag");
    params.delete("tag");
    const nextTags = tags.includes(tag) ? tags.filter((value) => value !== tag) : [...tags, tag];
    nextTags.forEach((value) => params.append("tag", value));
    navigate(params);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    ["tag", "minPrice", "maxPrice", ...numericParams].forEach((name) => params.delete(name));
    navigate(params);
  }

  return (
    <aside
      className={
        variant === "sidebar"
          ? "hidden rounded-xl border border-slate-200 bg-white lg:block"
          : "bg-white"
      }
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearFilters}
            disabled={activeCount === 0}
            className="text-sm font-medium disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Clear all{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          {headerAction}
        </div>
      </div>

      <div className="space-y-6 p-5">
        <section>
          <h3 className="font-semibold">{config.priceTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">{config.priceCopy}</p>
          <DebouncedPriceRange
            key={`${category}-${searchParams.get("minPrice")}-${searchParams.get("maxPrice")}`}
            defaultMin={config.minPrice}
            defaultMax={config.maxPrice}
            min={searchParams.get("minPrice")}
            max={searchParams.get("maxPrice")}
            onCommit={(min, max) => {
              const params = new URLSearchParams(searchParams.toString());
              if (min === config.minPrice) params.delete("minPrice");
              else params.set("minPrice", min);
              if (max === config.maxPrice) params.delete("maxPrice");
              else params.set("maxPrice", max);
              navigate(params);
            }}
          />
        </section>

        {config.sections.map((section) => (
          <section key={section.title} className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold">{section.title}</h3>
            {section.kind === "checks" && (
              <div className="mt-4 space-y-4">
                {section.options.map((option) => (
                  <CheckRow
                    key={option.title}
                    {...option}
                    checked={selectedTags.includes(option.title)}
                    onChange={() => toggleTag(option.title)}
                  />
                ))}
              </div>
            )}
            {section.kind === "options" && section.rows.map((row) => (
              <OptionRow
                key={row.label}
                label={row.label}
                options={row.options}
                value={searchParams.get(row.param) ?? "Any"}
                onChange={(value) => setParam(row.param, value)}
              />
            ))}
            {section.kind === "types" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {section.options.map((option) => (
                  <TypeButton
                    key={option.label}
                    {...option}
                    active={selectedTags.includes(option.label)}
                    onClick={() => toggleTag(option.label)}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </aside>
  );
}

function DebouncedPriceRange({
  defaultMin,
  defaultMax,
  min,
  max,
  onCommit,
}: {
  defaultMin: string;
  defaultMax: string;
  min: string | null;
  max: string | null;
  onCommit: (min: string, max: string) => void;
}) {
  const [minimum, setMinimum] = useState(min ?? defaultMin);
  const [maximum, setMaximum] = useState(max ?? defaultMax);

  useEffect(() => {
    if (minimum === (min ?? defaultMin) && maximum === (max ?? defaultMax)) return;
    const timer = window.setTimeout(() => onCommit(minimum, maximum), 400);
    return () => window.clearTimeout(timer);
  }, [defaultMax, defaultMin, max, maximum, min, minimum, onCommit]);

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <PriceInput label="Minimum" value={minimum} onChange={setMinimum} />
      <PriceInput label="Maximum" value={maximum} onChange={setMaximum} />
    </div>
  );
}

export default Filters;
