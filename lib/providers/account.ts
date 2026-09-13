import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import type { ProviderProfile } from "./types";

export async function getProviderAccount() {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null, error: null, loadedAt: Date.now() };
  const { data, error } = await supabase.from("provider_profiles").select("*").eq("user_id", user.id).maybeSingle();
  return { supabase, user, profile: data as ProviderProfile | null, error, loadedAt: Date.now() };
}
