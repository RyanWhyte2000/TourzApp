import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "../../PageShell";
import HostOnboardingForm from "./HostOnboardingForm";
import { getProviderAccount } from "@/lib/providers/account";
import { isProviderType, providerDefinitions } from "@/lib/providers/types";

export const metadata: Metadata = { title: "Create a Listing | Tourz" };
export default async function HostOnboardingPage({ searchParams }: { searchParams: Promise<{ provider_type?: string | string[] }> }) {
  const search = await searchParams;
  const requested = Array.isArray(search.provider_type) ? search.provider_type[0] : search.provider_type;
  if (requested !== undefined && !isProviderType(requested)) notFound();
  const type = isProviderType(requested) ? requested : undefined;
  const { user, profile, profiles, error } = await getProviderAccount(type);
  const path = type ? `/host/onboarding?provider_type=${type}` : "/host/onboarding";
  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  if (error) throw new Error("Unable to load your provider profiles. Please try again.");
  if (type && !profile) redirect(`/host/profiles/${type}`);
  if (profiles.length === 0) redirect("/host/profiles");
  return <PageShell showSearch={false}><main className="px-5 py-10 sm:px-8"><div className="mx-auto max-w-3xl">
    <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">Host onboarding</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight">{profile ? "Create your Tourz listing" : "Choose a category for your listing"}</h1>
    <p className="mb-8 mt-2 text-slate-500">{profile ? "Tell us what you offer. Your first version is saved privately as a draft." : "Choose which business will own this listing."}</p>
    {profile ? <HostOnboardingForm key={profile.id} profile={profile} /> : <div className="grid gap-4 sm:grid-cols-2">{profiles.map((item) => <Link key={item.id} href={`/host/onboarding?provider_type=${item.provider_type}`} className="rounded-2xl border border-slate-200 p-5 hover:bg-emerald-50"><p className="font-semibold">{providerDefinitions[item.provider_type].label}</p><p className="mt-2 text-sm text-slate-500">{item.display_name}</p></Link>)}</div>}
    <Link href="/host/profiles" className="mt-6 inline-block text-sm font-semibold text-emerald-700">Manage categories →</Link>
  </div></main></PageShell>;
}
