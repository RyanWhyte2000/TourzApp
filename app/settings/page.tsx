import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageShell from "../PageShell";
import SettingsForm from "./SettingsForm";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export const metadata: Metadata = { title: "Settings | Tourz" };

export default async function SettingsPage() {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");
  const [profileResult, settingsResult, hostResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("host_settings").select("*").eq("user_id", user.id).maybeSingle(),
  ]);
  const fallbackProfile = { full_name: typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : "Traveler", preferred_language: "en", profile_visibility: "private" };
  const providers = [...new Set((user.identities ?? []).map((identity) => identity.provider))];
  const setupWarning = Boolean(profileResult.error || settingsResult.error || hostResult.error);

  return <PageShell><main className="px-5 py-10 sm:px-8 lg:px-10"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">Your account</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1><p className="mt-2 text-slate-500">Personalize Tourz, manage privacy, and configure traveler or host defaults.</p><div className="mt-8"><SettingsForm profile={(profileResult.data as Record<string, unknown> | null) ?? fallbackProfile} settings={(settingsResult.data as Record<string, unknown> | null) ?? {}} host={(hostResult.data as Record<string, unknown> | null) ?? {}} email={user.email ?? ""} providers={providers} setupWarning={setupWarning} /></div></div></main></PageShell>;
}
