"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ListingCategory } from "./ListingLayout";
import ListingCard from "./ListingCard";
import { useWishlist } from "@/lib/wishlist/store";

type WishlistItem = {
  id: string;
  category: ListingCategory;
  title: string;
  image: string;
  price: string;
  rating: string;
  subtitle?: string;
  priceSuffix?: string;
  totalPrice?: string;
};

export default function WishlistGrid() {
  const { ids } = useWishlist();
  const idsKey = ids.join("|");
  const [result, setResult] = useState<{ key: string; items: WishlistItem[]; error?: string; syncWarning?: string }>({
    key: "",
    items: [],
  });

  useEffect(() => {
    if (!idsKey) return;
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load your saved listings.");
        const data = (await response.json()) as { items: WishlistItem[]; syncWarning?: string };
        setResult({ key: idsKey, items: data.items, syncWarning: data.syncWarning });
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({ key: idsKey, items: [], error: error instanceof Error ? error.message : "Unable to load wishlist." });
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [ids, idsKey]);

  const visibleItems = useMemo(
    () => result.items.filter((item) => ids.includes(item.id)),
    [ids, result.items],
  );
  const loading = Boolean(idsKey) && result.key !== idsKey;

  if (ids.length === 0) {
    return (
      <section className="px-5 py-16 text-center sm:px-8 lg:px-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <Heart className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mx-auto mt-2 max-w-md text-slate-500">Tap the heart on any stay, hotel, restaurant, or ride to save it here.</p>
        <Link href="/airbnb" className="mt-6 inline-flex rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
          Explore listings
        </Link>
      </section>
    );
  }

  return (
    <section className="px-5 py-10 sm:px-8 lg:px-10">
      <div className="mb-7">
        <p className="text-sm font-semibold text-violet-600">{ids.length} saved {ids.length === 1 ? "listing" : "listings"}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Your wishlist</h1>
      </div>

      {result.error && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p>}
      {result.syncWarning && <p className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{result.syncWarning}</p>}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ids.map((id) => <div key={id} className="h-80 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <ListingCard key={item.id} {...item} href={`/${item.category}/${item.id}`} />
          ))}
        </div>
      )}
    </section>
  );
}
