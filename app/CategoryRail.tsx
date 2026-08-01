"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  Trees,
  Truck,
  UtensilsCrossed,
  Waves,
  Wine,
} from "lucide-react";

const categoryIcons = {
  bike: Bike,
  building: Building2,
  bus: Bus,
  car: CarFront,
  fish: Fish,
  flame: Flame,
  home: Home,
  hotel: Hotel,
  pizza: Pizza,
  star: Star,
  tent: TentTree,
  trees: Trees,
  truck: Truck,
  utensils: UtensilsCrossed,
  waves: Waves,
  wine: Wine,
};

export type CategoryIconName = keyof typeof categoryIcons;

export type CategoryRailItem = {
  label: string;
  count: number;
  icon: CategoryIconName;
};

function CategoryRail({ categories }: { categories: CategoryRailItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("rail");

  function selectCategory(label: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory?.toLocaleLowerCase() === label.toLocaleLowerCase()) {
      params.delete("rail");
    } else {
      params.set("rail", label);
    }

    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Listing categories">
      {categories.map((category) => {
        const Icon = categoryIcons[category.icon];
        const isActive = selectedCategory?.toLocaleLowerCase() === category.label.toLocaleLowerCase();

        return (
          <button
            type="button"
            key={category.label}
            aria-pressed={isActive}
            onClick={() => selectCategory(category.label)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              isActive
                ? "border-violet-300 bg-violet-50 font-semibold text-violet-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon className="size-4" />
            {category.label} ({category.count})
          </button>
        );
      })}
    </div>
  );
}

export default CategoryRail;
