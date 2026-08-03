"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export type SettingsState = { error?: string; success?: string } | undefined;
const text = (form: FormData, name: string, max = 1000) => String(form.get(name) ?? "").trim().slice(0, max) || null;
const checked = (form: FormData, name: string) => form.get(name) === "on";

export async function saveSettings(_: SettingsState, formData: FormData): Promise<SettingsState> {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to update settings." };
  const fullName = text(formData, "full_name", 120) ?? "Traveler";
  const profile = { user_id: user.id, full_name: fullName, phone: text(formData, "phone", 40), avatar_url: text(formData, "avatar_url", 500), date_of_birth: text(formData, "date_of_birth", 10), preferred_language: text(formData, "preferred_language", 10) ?? "en", country: text(formData, "country", 80), emergency_contact_name: text(formData, "emergency_contact_name", 120), emergency_contact_phone: text(formData, "emergency_contact_phone", 40), profile_visibility: text(formData, "profile_visibility", 20) ?? "private", updated_at: new Date().toISOString() };
  const settings = { user_id: user.id, currency: text(formData, "currency", 3) ?? "USD", default_destination: text(formData, "default_destination", 160), default_travelers: Math.min(30, Math.max(1, Number(formData.get("default_travelers")) || 1)), accessibility_needs: text(formData, "accessibility_needs"), accommodation_preferences: text(formData, "accommodation_preferences"), dietary_restrictions: text(formData, "dietary_restrictions"), preferred_vehicle_type: text(formData, "preferred_vehicle_type", 80), smoking_preference: text(formData, "smoking_preference", 30) ?? "non-smoking", default_guest_count: Math.min(30, Math.max(1, Number(formData.get("default_guest_count")) || 1)), default_checkin_requirements: text(formData, "default_checkin_requirements"), special_requests: text(formData, "special_requests"), preferred_payment_option: "pay_later", billing_address: text(formData, "billing_address"), receipt_email: text(formData, "receipt_email", 254), invoice_details: text(formData, "invoice_details"), notify_booking_confirmations: checked(formData, "notify_booking_confirmations"), notify_booking_reminders: checked(formData, "notify_booking_reminders"), notify_reservation_changes: checked(formData, "notify_reservation_changes"), notify_price_drops: checked(formData, "notify_price_drops"), notify_wishlist_availability: checked(formData, "notify_wishlist_availability"), notify_promotions: checked(formData, "notify_promotions"), notify_support_replies: checked(formData, "notify_support_replies"), notify_email: checked(formData, "notify_email"), notify_push: checked(formData, "notify_push"), marketing_consent: checked(formData, "marketing_consent"), updated_at: new Date().toISOString() };
  const categories = formData.getAll("service_categories").map(String).filter((value) => ["airbnb","hotel","food","transport"].includes(value));
  const host = { user_id: user.id, host_enabled: checked(formData, "host_enabled"), business_name: text(formData, "business_name", 160), service_categories: categories, payout_provider: null, payout_status: "not_connected", tax_country: text(formData, "tax_country", 80), tax_status: "not_submitted", booking_approval: text(formData, "booking_approval", 20) ?? "manual", cancellation_policy: text(formData, "cancellation_policy", 30) ?? "flexible", availability_preferences: text(formData, "availability_preferences"), auto_confirm: checked(formData, "auto_confirm"), notify_new_bookings: checked(formData, "notify_new_bookings"), notify_cancellations: checked(formData, "notify_cancellations"), updated_at: new Date().toISOString() };
  const results = await Promise.all([supabase.from("profiles").upsert(profile), supabase.from("user_settings").upsert(settings), supabase.from("host_settings").upsert(host), supabase.auth.updateUser({ data: { full_name: fullName } })]);
  const failure = results.find((result) => result.error);
  if (failure?.error) return { error: "Unable to save settings. Apply the user settings migration and try again." };
  revalidatePath("/settings"); revalidatePath("/profile");
  return { success: "Settings saved." };
}

export async function changeSettingsPassword(_: SettingsState, formData: FormData): Promise<SettingsState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmation) return { error: "Passwords do not match." };
  const supabase = await createAuthSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { error: error.message } : { success: "Password updated." };
}

export async function signOutEverywhere() {
  const supabase = await createAuthSupabaseClient();
  await supabase.auth.signOut({ scope: "global" });
  redirect("/login");
}

export async function requestAccountDeletion(_: SettingsState, formData: FormData): Promise<SettingsState> {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to manage your account." };
  const confirmation = String(formData.get("confirmation") ?? "");
  if (confirmation !== "DELETE") return { error: "Type DELETE to confirm your request." };
  const { error } = await supabase.from("account_deletion_requests").insert({ user_id: user.id, reason: text(formData, "reason") });
  return error ? { error: "Unable to submit deletion request." } : { success: "Deletion request submitted. Your account remains active while it is reviewed." };
}
