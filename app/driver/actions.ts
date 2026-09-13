"use server";

import { revalidatePath } from "next/cache";
import { getDriverAccount } from "@/lib/driver/auth";
import { bookingTransition, parseDriverService, type DriverBooking } from "@/lib/driver/types";

export type DriverActionState = { error?: string; success?: string } | undefined;

function refreshDriver() {
  revalidatePath("/driver");
  revalidatePath("/host/profiles/driver");
  revalidatePath("/transport");
}

export async function saveDriverService(_: DriverActionState, form: FormData): Promise<DriverActionState> {
  const { supabase, user, profile, error } = await getDriverAccount();
  if (error || !user || profile?.provider_type !== "driver") return { error: "Sign in with a Driver profile to manage services." };
  const parsed = parseDriverService(form);
  if (parsed.error) return { error: parsed.error };
  const id = String(form.get("service_id") ?? "");
  const { data: existing, error: lookupError } = await supabase.from("listings").select("filter_values").eq("id", id).eq("owner_id", user.id).eq("provider_profile_id", profile.id).eq("category", "transport").maybeSingle();
  if (lookupError || !existing) return { error: "This service is not available to edit." };
  const { seats, luggage, ...fields } = parsed.data;
  const { error: updateError } = await supabase.from("listings").update({ ...fields, location_search: fields.subtitle, filter_values: { ...existing.filter_values, seats, luggage }, meta: [{ label: `${seats} seats` }, { label: `${luggage} luggage` }], updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).eq("provider_profile_id", profile.id).select("id").single();
  if (updateError) return { error: "Unable to save the service. Please try again." };
  refreshDriver();
  revalidatePath(`/host/listings/${id}`);
  revalidatePath(`/transport/${id}`);
  return { success: "Service updated." };
}

export async function setDriverServiceStatus(_: DriverActionState, form: FormData): Promise<DriverActionState> {
  const { supabase, user, profile, error } = await getDriverAccount();
  if (error || !user || profile?.provider_type !== "driver") return { error: "Sign in with a Driver profile to manage services." };
  const id = String(form.get("service_id") ?? "");
  const status = String(form.get("status") ?? "");
  if (status !== "published" && status !== "archived") return { error: "Choose a valid service status." };
  const { error: updateError } = await supabase.from("listings").update({ status, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).eq("provider_profile_id", profile.id).eq("category", "transport").select("id").single();
  if (updateError) return { error: "Unable to update service availability." };
  refreshDriver();
  revalidatePath(`/transport/${id}`);
  revalidatePath(`/host/listings/${id}`);
  return { success: status === "published" ? "Service is live and available to book." : "Service paused. Existing bookings are unchanged." };
}

export async function updateDriverBooking(_: DriverActionState, form: FormData): Promise<DriverActionState> {
  const { supabase, user, profile, error } = await getDriverAccount();
  if (error || !user || profile?.provider_type !== "driver") return { error: "Sign in with a Driver profile to manage bookings." };
  const id = String(form.get("booking_id") ?? "");
  const { data, error: lookupError } = await supabase.from("reservations").select("id, listing_id, status, driver_status, listings!inner(provider_profile_id)").eq("id", id).eq("listings.provider_profile_id", profile.id).maybeSingle();
  if (lookupError || !data) return { error: "This booking is not available to manage." };
  const updates = bookingTransition(data as unknown as DriverBooking, String(form.get("action") ?? ""));
  if (!updates) return { error: "This action is no longer available for the booking. Refresh and try again." };
  const { error: updateError } = await supabase.from("reservations").update(updates).eq("id", id).eq("listing_id", data.listing_id).eq("status", data.status).eq("driver_status", data.driver_status).select("id").single();
  if (updateError) return { error: "Unable to update this booking. It may have changed; refresh and try again." };
  refreshDriver();
  revalidatePath("/profile");
  revalidatePath(`/reservations/${id}`);
  return { success: "Booking updated." };
}
