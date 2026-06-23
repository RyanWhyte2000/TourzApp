import React from "react";

type Category = {
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

function CategoryRail({ categories }: { categories: Category[] }) {
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

export default CategoryRail;
