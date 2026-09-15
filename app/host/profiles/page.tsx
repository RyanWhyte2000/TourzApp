import Link from "next/link";
import { redirect } from "next/navigation";
import PageShell from "../../PageShell";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import { providerDefinitions, providerTypes } from "@/lib/providers/types";
import { dashboardHref } from "@/lib/providers/dashboard";
import ProviderIcon from "./ProviderIcon";

export const metadata = { title: "Your Businesses | Tourz" };

export default async function ProviderProfilesPage() {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/host/profiles");
  const { data: profiles, error } = await supabase.from("provider_profiles").select("id, provider_type, display_name").eq("user_id", user.id);
  if (error) throw new Error("Unable to load your provider profiles. Please try again.");
  return <PageShell showSearch={false}><main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
    <Link href="/profile" className="text-sm font-semibold text-emerald-700">← Your account</Link>
    <p className="mt-8 text-sm font-bold uppercase tracking-wider text-emerald-600">Work with Tourz</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight">Your businesses</h1>
    <p className="mt-3 text-slate-500">Manage multiple categories from one account, with multiple listings in each. Add a profile to get started in a new category.</p>
    <div className="mt-8 grid items-start gap-5 sm:grid-cols-2">
      {providerTypes.map((type) => {
        const profile = profiles?.find((item) => item.provider_type === type);
        return <article key={type} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><ProviderIcon type={type} /></span>
          <h2 className="mt-5 text-xl font-bold">{providerDefinitions[type].label}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{profile?.display_name ?? providerDefinitions[type].description}</p>
          {profile ? <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link href={dashboardHref(type)} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Open dashboard</Link>
            <Link href={`/host/onboarding?provider_type=${type}`} className="text-sm font-semibold text-emerald-700">Add listing</Link>
            <Link href={`/host/profiles/${type}`} className="text-sm text-slate-500">Edit profile</Link>
          </div> : <Link href={`/host/profiles/${type}`} className="mt-5 inline-block text-sm font-semibold text-emerald-700">Add this category →</Link>}
        </article>;
      })}
    </div>
  </main></PageShell>;
}
