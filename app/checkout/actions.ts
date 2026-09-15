"use server";

import { findReservationAttempt, isReservationAttempt } from "@/lib/reservations/attempt";
import { redirect } from "next/navigation";
import { reservationDates } from "@/lib/reservations/dates";
import type { ListingCategory } from "../ListingLayout";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export type ReservationState = { error?: string } | undefined;
const categories: ListingCategory[] = ["airbnb", "hotel", "food", "transport"];

export async function createReservation(_: ReservationState, formData: FormData): Promise<ReservationState> {
  const attemptId = formData.get("attemptId");
  if (!isReservationAttempt(attemptId)) return { error: "Reload checkout before reserving." };
  const paymentMethod = String(formData.get("paymentMethod") ?? "pay_later");
  if (paymentMethod !== "pay_later") return { error: "Choose a payment method." };
  const listingId = String(formData.get("listingId") ?? "");
  const category = String(formData.get("category") ?? "") as ListingCategory;
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const time = String(formData.get("time") ?? "12:00");
  const partySize = Number(formData.get("partySize"));
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 1000);
  if (!categories.includes(category) || !/^[a-zA-Z0-9_-]{1,100}$/.test(listingId)) return { error: "Invalid listing." };
  if (!startDate || (category !== "food" && !endDate) || !Number.isInteger(partySize) || partySize < 1 || partySize > 30) return { error: "Check your reservation details." };

  const dates = reservationDates(category, startDate, endDate, time);
  if (!dates) return { error: "Check your reservation dates and time." };
  const { startsAt, endsAt } = dates;
  if (startsAt.getTime() < Date.now() - 86_400_000) return { error: "Choose a future date." };

  let reservationId: string | undefined;
  try {
    const supabase = await createAuthSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Sign in before completing your reservation." };
    const existingId = await findReservationAttempt(supabase, attemptId, user.id, listingId);
    if (existingId) {
      reservationId = existingId;
    } else {
      const { data: listing, error: listingError } = await supabase.from("listings").select("id, price").eq("id", listingId).eq("category", category).eq("status", "published").maybeSingle();
      if (listingError) return { error: "Unable to verify listing availability. Please try again when connected." };
      if (!listing) return { error: "This listing is no longer available." };

      const millisecondsPerDay = 86_400_000;
      const units = category === "food" ? partySize : Math.max(1, endsAt ? Math.ceil((endsAt.getTime() - startsAt.getTime()) / millisecondsPerDay) : 1);
      if (units > 365) return { error: "Reservations cannot exceed 365 days." };
      const subtotal = category === "food" ? 0 : Math.round(Number(listing.price) * units * 100) / 100;
      const serviceFee = category === "food" ? 0 : Math.round(subtotal * 0.08 * 100) / 100;
      const total = Math.round((subtotal + serviceFee) * 100) / 100;
      if (!Number.isFinite(total) || total < 0) return { error: "Invalid reservation total." };
      const { data, error } = await supabase.from("reservations").insert({
        id: attemptId, user_id: user.id, listing_id: listingId, category, starts_at: startsAt.toISOString(), ends_at: endsAt?.toISOString() ?? null,
        party_size: partySize, unit_count: units, subtotal, service_fee: serviceFee, total, payment_method: "pay_later", payment_status: "not_charged", status: "confirmed", notes: notes || null,
      }).select("id").single();
      // A lost response can hide a committed insert. The primary key also protects
      // concurrent retries; never upsert or overwrite the original reservation.
      reservationId = !error && data?.id ? data.id : await findReservationAttempt(supabase, attemptId, user.id, listingId);
    }
  } catch {
    // Network errors cannot establish whether a write committed.
  }
  if (!reservationId) return { error: "We could not confirm the reservation outcome. Retry from this checkout page to safely check or complete the same reservation, or check My reservations before starting a new checkout." };
  redirect(`/reservations/${reservationId}`);
}
