import { Home, Trees, Building2, Hotel, TentTree, Waves } from 'lucide-react';
import React from 'react'
const categories = [
  { label: "Cabin", count: 12, icon: Home, active: true },
  { label: "Country Side", count: 17, icon: Trees },
  { label: "Tiny Homes", count: 12, icon: Building2 },
  { label: "Farm Houses", count: 9, icon: Hotel },
  { label: "Camping", count: 8, icon: TentTree },
  { label: "Iconic Cities", count: 6, icon: Building2 },
  { label: "Lake Front", count: 5, icon: Waves },
];
function CategoryRail() {
  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <button
            key={category.label}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm ${
              category.active
                ? "border-slate-200 bg-slate-100 font-semibold"
                : "border-slate-200 bg-white text-slate-600"
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

export default CategoryRail
