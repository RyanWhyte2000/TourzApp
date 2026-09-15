import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import { selectProviderProfile, type ProviderProfile, type ProviderType } from "./types";

export async function getProviderAccount(type?: ProviderType) {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null, profiles: [] as ProviderProfile[], error: null, loadedAt: Date.now() };
  const { data, error } = await supabase.from("provider_profiles").select("*").eq("user_id", user.id).order("created_at");
  const profiles = (data ?? []) as ProviderProfile[];
  return { supabase, user, profile: selectProviderProfile(profiles, type), profiles, error, loadedAt: Date.now() };
}
