"use server";

import { revalidatePath } from "next/cache";
import { isProviderType, providerDefinitions, type ProviderType } from "@/lib/providers/types";
import { getProviderAccount } from "@/lib/providers/account";
import { bookingTransition, parseProviderListing, dashboardDefinitions, dashboardHref, type DashboardBooking } from "@/lib/providers/dashboard";

export type ProviderActionState = { error?: string; success?: string } | undefined;

function refreshProvider(type: ProviderType) {
  revalidatePath(dashboardHref(type));
  revalidatePath(`/host/profiles/${type}`);
  revalidatePath(`/${providerDefinitions[type].category}`);
}

export async function saveProviderListing(_: ProviderActionState, form: FormData): Promise<ProviderActionState> {
  const { supabase, user, profile, error } = await getProviderAccount();
  if (error || !user || !profile || !isProviderType(profile.provider_type)) return { error: "Sign in with a provider profile to manage listings." };
  const parsed = parseProviderListing(form, profile.provider_type);
  if (parsed.error) return { error: parsed.error };
  const id = String(form.get("service_id") ?? "");
  const { data: existing, error: lookupError } = await supabase.from("listings").select("filter_values").eq("id", id).eq("owner_id", user.id).eq("provider_profile_id", profile.id).eq("category", providerDefinitions[profile.provider_type].category).maybeSingle();
  if (lookupError || !existing) return { error: "This listing is not available to edit." };
  const { filter_values, ...fields } = parsed.data;
  const meta = dashboardDefinitions[profile.provider_type].fields.map((field) => ({ label: `${filter_values[field.name]} ${field.label.toLowerCase()}` }));
  const { error: updateError } = await supabase.from("listings").update({ ...fields, location_search: fields.subtitle, filter_values: { ...existing.filter_values, ...filter_values }, meta, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).eq("provider_profile_id", profile.id).select("id").single();
  if (updateError) return { error: "Unable to save the listing. Please try again." };
  refreshProvider(profile.provider_type);
  revalidatePath(`/host/listings/${id}`);
  revalidatePath(`/${providerDefinitions[profile.provider_type].category}/${id}`);
  return { success: "Listing updated." };
}

export async function setProviderListingStatus(_: ProviderActionState, form: FormData): Promise<ProviderActionState> {
  const { supabase, user, profile, error } = await getProviderAccount();
  if (error || !user || !profile || !isProviderType(profile.provider_type)) return { error: "Sign in with a provider profile to manage listings." };
  const id = String(form.get("service_id") ?? "");
  const status = String(form.get("status") ?? "");
  if (status !== "published" && status !== "archived") return { error: "Choose a valid service status." };
  const { error: updateError } = await supabase.from("listings").update({ status, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).eq("provider_profile_id", profile.id).eq("category", providerDefinitions[profile.provider_type].category).select("id").single();
  if (updateError) return { error: "Unable to update listing availability." };
  refreshProvider(profile.provider_type);
  revalidatePath(`/${providerDefinitions[profile.provider_type].category}/${id}`);
  revalidatePath(`/host/listings/${id}`);
  return { success: status === "published" ? "Listing is live and available to book." : "Listing paused. Existing bookings are unchanged." };
}

export async function updateProviderBooking(_: ProviderActionState, form: FormData): Promise<ProviderActionState> {
  const { supabase, user, profile, error } = await getProviderAccount();
  if (error || !user || !profile || !isProviderType(profile.provider_type)) return { error: "Sign in with a provider profile to manage bookings." };
  const id = String(form.get("booking_id") ?? "");
  const { data, error: lookupError } = await supabase.from("reservations").select("id, listing_id, status, driver_status, listings!inner(provider_profile_id)").eq("id", id).eq("listings.provider_profile_id", profile.id).maybeSingle();
  if (lookupError || !data) return { error: "This booking is not available to manage." };
  const updates = bookingTransition(data as unknown as DashboardBooking, String(form.get("action") ?? ""));
  if (!updates) return { error: "This action is no longer available for the booking. Refresh and try again." };
  const { error: updateError } = await supabase.from("reservations").update(updates).eq("id", id).eq("listing_id", data.listing_id).eq("status", data.status).eq("driver_status", data.driver_status).select("id").single();
  if (updateError) return { error: "Unable to update this booking. It may have changed; refresh and try again." };
  refreshProvider(profile.provider_type);
  revalidatePath("/profile");
  revalidatePath(`/reservations/${id}`);
  return { success: "Booking updated." };
}
