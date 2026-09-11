import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "../../../PageShell";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import { isProviderType, providerDefinitions, type ProviderListing, type ProviderProfile } from "@/lib/providers/types";
import ProviderIcon from "../ProviderIcon";
import ProviderProfileForm from "../ProviderProfileForm";
import AssignListingForm from "../AssignListingForm";

export default async function ProviderProfilePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isProviderType(type)) notFound();
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/host/profiles/${type}`)}`);
  const { data, error } = await supabase.from("provider_profiles").select("*").eq("user_id", user.id).maybeSingle();
  if (error) throw new Error("Unable to load your provider profile. Please try again.");
  const profile = data as ProviderProfile | null;
  if (profile && profile.provider_type !== type) redirect(`/host/profiles/${profile.provider_type}`);
  const definition = providerDefinitions[type];
  const { data: listingData, error: listingError } = await supabase.from("listings").select("id, title, category, status, price, price_suffix, provider_profile_id").eq("owner_id", user.id).order("created_at", { ascending: false });
  const listings = (listingData ?? []) as ProviderListing[];
  const assigned = profile ? listings.filter((listing) => listing.provider_profile_id === profile.id) : [];
  const unassigned = listings.filter((listing) => !listing.provider_profile_id && listing.category === definition.category);
  const otherListings = listings.filter((listing) => !listing.provider_profile_id && listing.category !== definition.category);
  return <PageShell><main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
    <Link href={profile ? "/profile" : "/host/profiles"} className="text-sm font-semibold text-violet-700">← {profile ? "Your account" : "Choose a different type"}</Link>
    <header className="my-8 flex flex-wrap items-center justify-between gap-5">
      <div className="flex items-center gap-4"><span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><ProviderIcon type={type} /></span><div><p className="text-sm font-semibold text-violet-600">{definition.label} profile</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{profile?.display_name ?? definition.label}</h1></div></div>
      {profile && <Link href="/host/onboarding" className="rounded-full bg-violet-700 px-5 py-3 text-sm font-semibold text-white">{definition.listingLabel}</Link>}
    </header>
    <ProviderProfileForm key={profile?.id ?? type} type={type} profile={profile} />
    {profile && <section className="mt-10">
      <h2 className="text-2xl font-bold">Your listings</h2>
      {listingError ? <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-5 text-amber-900">Unable to load listings. Please refresh to try again.</p> : <>
        <p className="mt-2 text-sm text-slate-500">{assigned.length} {assigned.length === 1 ? "listing" : "listings"} linked to your {definition.label.toLowerCase()} profile.</p>
        {assigned.length === 0 && <p className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">Your listings will appear here. Create your first listing using the button above.</p>}
        <div className="mt-5 grid items-start gap-4 sm:grid-cols-2">{assigned.map((listing) => <article key={listing.id} className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-xs font-semibold uppercase text-violet-600">{listing.status}</span><h3 className="mt-2 font-bold">{listing.title}</h3><p className="mt-2 text-sm text-slate-500">${Number(listing.price).toFixed(2)}{listing.price_suffix}</p><Link href={`/host/listings/${listing.id}`} className="mt-4 inline-block text-sm font-semibold text-violet-700">View listing →</Link></article>)}</div>
        {unassigned.length > 0 && <div className="mt-8"><h3 className="text-lg font-bold">Existing listings</h3><p className="mt-2 text-sm text-slate-500">Add your earlier {definition.category === "transport" ? "transport" : "business"} listings to this profile.</p><div className="mt-4 space-y-3">{unassigned.map((listing) => <div key={listing.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"><Link href={`/host/listings/${listing.id}`} className="font-medium">{listing.title}</Link><AssignListingForm type={type} listingId={listing.id} /></div>)}</div></div>}
        {otherListings.length > 0 && <div className="mt-8"><h3 className="text-lg font-bold">Other earlier listings</h3><p className="mt-2 text-sm text-slate-500">These are still available to view, but belong to a different service category.</p>{otherListings.map((listing) => <Link key={listing.id} href={`/host/listings/${listing.id}`} className="mt-3 block text-sm font-semibold text-violet-700">{listing.title} →</Link>)}</div>}
      </>}
    </section>}
  </main></PageShell>;
}
