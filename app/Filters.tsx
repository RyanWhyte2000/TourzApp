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
import CheckRow from "./CheckRow";
import OptionRow from "./OptionRow";
import PriceInput from "./PriceInput";
import TypeButton from "./TypeButton";
import type { ListingCategory } from "./ListingLayout";

type CheckOption = {
  title: string;
  copy: string;
  checked?: boolean;
};

type TypeOption = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

type FilterSection =
  | { kind: "checks"; title: string; options: CheckOption[] }
  | { kind: "options"; title: string; rows: { label: string; options?: string[] }[] }
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
          { title: "Entire place", copy: "A place all to yourself", checked: true },
          { title: "Private room", copy: "Your own room with shared spaces" },
          { title: "Shared room", copy: "A shared sleeping and living space" },
        ],
      },
      {
        kind: "options",
        title: "Rooms and beds",
        rows: [{ label: "Bedrooms" }, { label: "Beds" }, { label: "Bathrooms" }],
      },
      {
        kind: "types",
        title: "Property type",
        options: [
          { label: "House", icon: <Home className="size-5" />, active: true },
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
          { label: "Hotel", icon: <Hotel className="size-5" />, active: true },
          { label: "Resort", icon: <Waves className="size-5" /> },
          { label: "Boutique", icon: <Building2 className="size-5" /> },
          { label: "All-inclusive", icon: <Star className="size-5" /> },
        ],
      },
      {
        kind: "options",
        title: "Rating and rooms",
        rows: [
          { label: "Star rating", options: ["Any", "3+", "4+", "5"] },
          { label: "Rooms", options: ["Any", "1", "2", "3", "4+"] },
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
          { label: "Jamaican", icon: <Flame className="size-5" />, active: true },
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
          { label: "Minimum rating", options: ["Any", "3+", "4+", "4.5+"] },
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
          { label: "Sedan", icon: <CarFront className="size-5" />, active: true },
          { label: "SUV", icon: <Truck className="size-5" /> },
          { label: "Van", icon: <Bus className="size-5" /> },
          { label: "Motorcycle", icon: <Bike className="size-5" /> },
        ],
      },
      {
        kind: "options",
        title: "Capacity",
        rows: [
          { label: "Seats", options: ["Any", "2", "4", "5", "7+"] },
          { label: "Luggage", options: ["Any", "1", "2", "3", "4+"] },
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

function Filters({ category }: { category: ListingCategory }) {
  const config = filterConfigs[category];

  return (
    <aside className="hidden rounded-xl border border-slate-200 bg-white lg:block">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button type="button" className="text-sm font-medium">Clear all</button>
      </div>

      <div className="space-y-6 p-5">
        <section>
          <h3 className="font-semibold">{config.priceTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">{config.priceCopy}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <PriceInput label="Minimum" value={config.minPrice} />
            <PriceInput label="Maximum" value={config.maxPrice} />
          </div>
        </section>

        {config.sections.map((section) => (
          <section key={section.title} className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold">{section.title}</h3>
            {section.kind === "checks" && (
              <div className="mt-4 space-y-4">
                {section.options.map((option) => <CheckRow key={option.title} {...option} />)}
              </div>
            )}
            {section.kind === "options" && section.rows.map((row) => (
              <OptionRow key={row.label} label={row.label} options={row.options} />
            ))}
            {section.kind === "types" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {section.options.map((option) => <TypeButton key={option.label} {...option} />)}
              </div>
            )}
          </section>
        ))}
      </div>
    </aside>
  );
}

export default Filters;
