"use server";

import { redirect } from "next/navigation";
import type { ListingCategory } from "../ListingLayout";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export type ReservationState = { error?: string } | undefined;
const categories: ListingCategory[] = ["airbnb", "hotel", "food", "transport"];

export async function createReservation(_: ReservationState, formData: FormData): Promise<ReservationState> {
  const listingId = String(formData.get("listingId") ?? "");
  const category = String(formData.get("category") ?? "") as ListingCategory;
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const time = String(formData.get("time") ?? "12:00");
  const partySize = Number(formData.get("partySize"));
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 1000);
  if (!categories.includes(category) || !/^[a-zA-Z0-9_-]{1,100}$/.test(listingId)) return { error: "Invalid listing." };
  if (!startDate || !Number.isInteger(partySize) || partySize < 1 || partySize > 30) return { error: "Check your reservation details." };

  const startsAt = new Date(`${startDate}T${category === "food" ? time : "15:00"}:00`);
  const endsAt = endDate ? new Date(`${endDate}T${category === "transport" ? "10:00" : "11:00"}:00`) : null;
  if (!Number.isFinite(startsAt.getTime()) || (endsAt && endsAt <= startsAt)) return { error: "The end date must be after the start date." };
  if (startsAt.getTime() < Date.now() - 86_400_000) return { error: "Choose a future date." };

  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in before completing your reservation." };
  const { data: listing, error: listingError } = await supabase.from("listings").select("id, price").eq("id", listingId).eq("category", category).eq("status", "published").maybeSingle();
  if (listingError || !listing) return { error: "This listing is no longer available." };

  const millisecondsPerDay = 86_400_000;
  const units = category === "food" ? partySize : Math.max(1, endsAt ? Math.ceil((endsAt.getTime() - startsAt.getTime()) / millisecondsPerDay) : 1);
  const subtotal = Number(listing.price) * units;
  const serviceFee = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + serviceFee;
  const { data, error } = await supabase.from("reservations").insert({
    user_id: user.id, listing_id: listingId, category, starts_at: startsAt.toISOString(), ends_at: endsAt?.toISOString() ?? null,
    party_size: partySize, unit_count: units, subtotal, service_fee: serviceFee, total, payment_method: "pay_later", notes: notes || null,
  }).select("id").single();
  if (error) return { error: "Unable to complete the reservation. Confirm that the reservations migration has been applied." };
  redirect(`/reservations/${data.id}`);
}
