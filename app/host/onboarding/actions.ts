"use server";

import { redirect } from "next/navigation";
import type { ListingCategory } from "../../ListingLayout";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export type OnboardingState = { error?: string } | undefined;
const categories: ListingCategory[] = ["airbnb", "hotel", "food", "transport"];
const string = (form: FormData, name: string, max = 1000) => String(form.get(name) ?? "").trim().slice(0, max);

export async function createHostListing(_: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to create a listing." };
  const category = string(formData, "category", 20) as ListingCategory;
  const title = string(formData, "title", 160);
  const description = string(formData, "description", 3000);
  const location = string(formData, "location", 200);
  const imageUrl = string(formData, "image_url", 1000);
  const price = Number(formData.get("price"));
  if (!categories.includes(category) || title.length < 5 || description.length < 30 || location.length < 3) return { error: "Complete the required listing details." };
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000) return { error: "Enter a valid price." };
  try { new URL(imageUrl); } catch { return { error: "Enter a valid image URL." }; }

  const slug = `${title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70)}-${crypto.randomUUID().slice(0, 8)}`;
  const capacity = Math.min(100, Math.max(1, Number(formData.get("capacity")) || 1));
  const bedrooms = Math.max(0, Number(formData.get("bedrooms")) || 0);
  const bathrooms = Math.max(0, Number(formData.get("bathrooms")) || 0);
  const tags = string(formData, "amenities", 1000).split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 20);
  const filterValues: Record<string, number> = category === "airbnb" ? { bedrooms, beds: bedrooms, bathrooms } : category === "hotel" ? { rooms: capacity, starRating: Math.min(5, Math.max(1, Number(formData.get("star_rating")) || 3)) } : category === "transport" ? { seats: capacity, luggage: Math.max(0, Number(formData.get("luggage")) || 0) } : { partySize: capacity };
  const meta = Object.entries(filterValues).filter(([, amount]) => amount > 0).map(([key, amount]) => ({ label: `${amount} ${key.replace(/([A-Z])/g, " $1").toLowerCase()}` }));
  const suffix: Record<ListingCategory, string> = { airbnb: "/night", hotel: "/night", food: "/person", transport: "/day" };
  const { data, error } = await supabase.from("listings").insert({ id: slug, owner_id: user.id, category, title, description, image_url: imageUrl, price, rating: 0, subtitle: location, location_search: location, price_suffix: suffix[category], total_price: null, filter_tags: tags, filter_values: filterValues, meta, status: "draft" }).select("id").single();
  if (error) return { error: "Unable to create the draft. Apply the host listing migration and try again." };
  const businessName = string(formData, "business_name", 160) || title;
  await supabase.from("host_settings").upsert({ user_id: user.id, host_enabled: true, business_name: businessName, service_categories: [category], updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  redirect(`/host/listings/${data.id}`);
}
