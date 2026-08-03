import { NextResponse } from "next/server";
import type { ListingCategory } from "@/app/ListingLayout";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

type WishlistRow = {
  id: string;
  category: ListingCategory;
  title: string;
  image_url: string;
  price: number | string;
  rating: number | string;
  subtitle: string | null;
  price_suffix: string;
  total_price: string | null;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawIds = (body as { ids?: unknown } | null)?.ids;
  if (!Array.isArray(rawIds)) {
    return NextResponse.json({ error: "ids must be an array." }, { status: 400 });
  }

  const ids = [...new Set(rawIds)].filter(
    (id): id is string => typeof id === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(id),
  ).slice(0, 100);

  const authSupabase = await createAuthSupabaseClient();
  const { data: { user } } = await authSupabase.auth.getUser();
  let resolvedIds = ids;
  let syncWarning: string | undefined;

  if (user) {
    if (ids.length > 0) {
      const { error: mergeError } = await authSupabase.from("favorites").upsert(
        ids.map((listingId) => ({ user_id: user.id, listing_id: listingId })),
        { onConflict: "user_id,listing_id" },
      );
      if (mergeError) {
        syncWarning = "Your saved listings are available on this device, but account sync is not ready yet.";
      }
    }

    if (!syncWarning) {
      const { data: favorites, error: favoritesError } = await authSupabase
        .from("favorites")
        .select("listing_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (favoritesError) {
        syncWarning = "Your saved listings are available on this device, but account sync is not ready yet.";
      } else {
        resolvedIds = (favorites ?? []).map(({ listing_id }) => listing_id);
      }
    }
  }

  if (resolvedIds.length === 0) return NextResponse.json({ items: [], ids: [], authenticated: Boolean(user), syncWarning });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id, category, title, image_url, price, rating, subtitle, price_suffix, total_price")
    .in("id", resolvedIds)
    .eq("status", "published");

  if (error) {
    return NextResponse.json({ error: "Unable to load wishlist." }, { status: 500 });
  }

  const rows = (data ?? []) as WishlistRow[];
  const byId = new Map(rows.map((row) => [row.id, row]));
  const items = resolvedIds.flatMap((id) => {
    const row = byId.get(id);
    if (!row) return [];
    const price = Number(row.price);
    return [{
      id: row.id,
      category: row.category,
      title: row.title,
      image: row.image_url,
      price: `$${Number.isInteger(price) ? price : price.toFixed(2)}`,
      rating: Number(row.rating).toFixed(1),
      subtitle: row.subtitle ?? undefined,
      priceSuffix: row.price_suffix,
      totalPrice: row.total_price ?? undefined,
    }];
  });

  return NextResponse.json({ items, ids: resolvedIds, authenticated: Boolean(user), syncWarning });
}

export async function PATCH(request: Request) {
  let body: { listingId?: unknown; favorite?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const listingId = body.listingId;
  if (typeof listingId !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(listingId) || typeof body.favorite !== "boolean") {
    return NextResponse.json({ error: "Invalid wishlist update." }, { status: 400 });
  }

  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const operation = body.favorite
    ? supabase.from("favorites").upsert({ user_id: user.id, listing_id: listingId }, { onConflict: "user_id,listing_id" })
    : supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);
  const { error } = await operation;
  if (error) return NextResponse.json({ error: "Unable to update wishlist." }, { status: 500 });
  return NextResponse.json({ favorite: body.favorite });
}
