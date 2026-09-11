import Link from "next/link";
import { redirect } from "next/navigation";
import PageShell from "../../PageShell";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import { isProviderType, providerDefinitions, providerTypes } from "@/lib/providers/types";
import ProviderIcon from "./ProviderIcon";

export const metadata = { title: "Provider Profile | Tourz" };

export default async function ProviderProfilesPage() {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/host/profiles");
  const { data: profile, error } = await supabase.from("provider_profiles").select("provider_type").eq("user_id", user.id).maybeSingle();
  if (error) throw new Error("Unable to load your provider profile. Please try again.");
  if (profile && isProviderType(profile.provider_type)) redirect(`/host/profiles/${profile.provider_type}`);
  return <PageShell><main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
    <Link href="/profile" className="text-sm font-semibold text-violet-700">← Your account</Link>
    <p className="mt-8 text-sm font-bold uppercase tracking-wider text-violet-600">Work with Tourz</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight">Choose your provider profile</h1>
    <p className="mt-3 text-slate-500">Select the type that matches your business. Each account has one provider type.</p>
    <div className="mt-8 grid items-start gap-5 sm:grid-cols-2">
      {providerTypes.map((type) => <Link key={type} href={`/host/profiles/${type}`} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-400 hover:bg-violet-50 focus-visible:outline-violet-600">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><ProviderIcon type={type} /></span>
        <h2 className="mt-5 text-xl font-bold">{providerDefinitions[type].label}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{providerDefinitions[type].description}</p>
        <span className="mt-5 block text-sm font-semibold text-violet-700">Set up profile →</span>
      </Link>)}
    </div>
  </main></PageShell>;
}
