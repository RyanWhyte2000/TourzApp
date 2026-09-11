"use server";

import { revalidatePath } from "next/cache";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import { isProviderType, providerDefinitions } from "@/lib/providers/types";
import { parseProviderProfile } from "@/lib/providers/validation";

export type ProviderState = { error?: string; success?: string } | undefined;

export async function saveProviderProfile(_: ProviderState, form: FormData): Promise<ProviderState> {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to save your provider profile." };
  const parsed = parseProviderProfile(form);
  if (parsed.error) return { error: parsed.error };
  const { provider_type, ...fields } = parsed.data;
  const { data: existing, error: lookupError } = await supabase.from("provider_profiles").select("id, provider_type").eq("user_id", user.id).maybeSingle();
  if (lookupError) return { error: "Unable to load your profile. Please try again." };
  if (existing && existing.provider_type !== provider_type) return { error: "Your account already has a provider type. You can only manage that profile." };
  const result = existing
    ? await supabase.from("provider_profiles").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", existing.id).eq("user_id", user.id).select("id").single()
    : await supabase.from("provider_profiles").insert({ ...fields, provider_type, user_id: user.id }).select("id").single();
  if (result.error) return { error: "Unable to save your profile. Please try again." };
  revalidatePath("/host/profiles");
  revalidatePath(`/host/profiles/${provider_type}`);
  revalidatePath("/profile");
  return { success: "Provider profile saved." };
}

export async function assignProviderListing(_: ProviderState, form: FormData): Promise<ProviderState> {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to manage listings." };
  const type = form.get("provider_type");
  if (!isProviderType(type)) return { error: "Choose a valid provider profile." };
  const { data: profile, error } = await supabase.from("provider_profiles").select("id").eq("user_id", user.id).eq("provider_type", type).maybeSingle();
  if (error || !profile) return { error: "Save your provider profile first." };
  const result = await supabase.from("listings").update({ provider_profile_id: profile.id }).eq("id", String(form.get("listing_id") ?? "")).eq("owner_id", user.id).eq("category", providerDefinitions[type].category).is("provider_profile_id", null).select("id").single();
  if (result.error) return { error: "Unable to assign this listing. It may already belong to a profile." };
  revalidatePath("/host/profiles", "layout");
  return { success: "Listing added to this profile." };
}
