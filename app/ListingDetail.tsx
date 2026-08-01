import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  Share2,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import type { ListingCategory, ListingItem } from "./ListingLayout";

const categoryNames: Record<ListingCategory, string> = {
  airbnb: "Airbnb",
  hotel: "Hotel",
  food: "Restaurant",
  transport: "Transport",
};

const actionLabels: Record<ListingCategory, string> = {
  airbnb: "Reserve stay",
  hotel: "Reserve room",
  food: "Reserve table",
  transport: "Reserve vehicle",
};

export default function ListingDetail({
  category,
  item,
}: {
  category: ListingCategory;
  item: ListingItem;
}) {
  const location = item.subtitle ?? "Montego Bay, Jamaica";
  const features = [...new Set(item.filterTags ?? [])].slice(0, 8);

  return (
    <div className="border-t border-slate-200/80 px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/${category}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to {categoryNames[category]}
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium">
              <Share2 className="size-4" /> Share
            </button>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium">
              <Heart className="size-4" /> Save
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div
              role="img"
              aria-label={item.title}
              className="aspect-[16/9] rounded-2xl bg-slate-100 bg-cover bg-center shadow-sm sm:aspect-[2/1]"
              style={{ backgroundImage: `url(${item.image})` }}
            />

            <div className="mt-7 flex flex-col gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet-700">
                  {categoryNames[category]}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {item.title}
                </h1>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="size-4" /> {location}
                </p>
              </div>
              <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-50 px-4 py-2 font-semibold text-slate-900">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                {item.rating}
              </div>
            </div>

            {item.meta && item.meta.length > 0 && (
              <div className="grid gap-3 border-b border-slate-100 py-6 sm:grid-cols-2">
                {item.meta.map((meta) => (
                  <div key={meta.label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    {meta.icon}
                    {meta.label}
                  </div>
                ))}
              </div>
            )}

            <section className="py-7">
              <h2 className="text-xl font-semibold">About this listing</h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Discover {item.title}, a highly rated {categoryNames[category].toLocaleLowerCase()} option near {location}.
                Review the highlights below, confirm your travel details, and reserve when you are ready.
              </p>

              {features.length > 0 && (
                <>
                  <h2 className="mt-8 text-xl font-semibold">Highlights</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="size-5 text-violet-600" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:sticky lg:top-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-2xl font-bold">{item.price}</span>
                <span className="text-sm font-medium text-slate-500">{item.priceSuffix ?? "/night"}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold">
                <Star className="size-4 fill-amber-400 text-amber-400" /> {item.rating}
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Estimated total</span>
                <span className="font-semibold">{item.totalPrice ?? item.price}</span>
              </div>
              <div className="mt-3 flex justify-between gap-4 border-t border-slate-100 pt-3">
                <span className="text-slate-500">Cancellation</span>
                <span className="font-semibold text-emerald-700">Flexible</span>
              </div>
            </div>

            <button type="button" className="mt-5 h-12 w-full rounded-full bg-violet-700 px-5 text-sm font-semibold text-white transition hover:bg-violet-800">
              {actionLabels[category]}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="size-4" /> You won&apos;t be charged yet
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
