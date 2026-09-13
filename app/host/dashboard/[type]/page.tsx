import { notFound, redirect } from "next/navigation";
import PageShell from "../../../PageShell";
import { getProviderAccount } from "@/lib/providers/account";
import { isProviderType, providerDefinitions } from "@/lib/providers/types";
import { dashboardHref, type DashboardBooking, type DashboardListing } from "@/lib/providers/dashboard";
import ProviderDashboard from "../ProviderDashboard";

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return { title: isProviderType(type) ? `${providerDefinitions[type].label} Dashboard | Tourz` : "Dashboard | Tourz" };
}

export default async function ProviderDashboardPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isProviderType(type)) notFound();
  const { supabase, user, profile, error, loadedAt } = await getProviderAccount();
  if (!user) redirect(`/login?next=${encodeURIComponent(dashboardHref(type))}`);
  if (error) throw new Error("Unable to load your provider profile.");
  if (!profile) redirect(`/host/profiles/${type}`);
  if (profile.provider_type !== type || type === "driver") redirect(dashboardHref(profile.provider_type));
  const [listingsResult, bookingsResult] = await Promise.all([
    supabase.from("listings").select("id, title, description, subtitle, image_url, price, price_suffix, status, filter_values").eq("owner_id", user.id).eq("provider_profile_id", profile.id).eq("category", providerDefinitions[type].category).order("created_at", { ascending: false }),
    supabase.from("reservations").select("id, listing_id, starts_at, ends_at, party_size, subtotal, status, payment_status, driver_status, notes, listings!inner(title, provider_profile_id)").eq("listings.provider_profile_id", profile.id).order("starts_at", { ascending: true }),
  ]);
  if (listingsResult.error || bookingsResult.error) throw new Error("Unable to load your dashboard. Please try again.");
  return <PageShell showSearch={false}><ProviderDashboard profile={profile} services={(listingsResult.data ?? []) as DashboardListing[]} bookings={(bookingsResult.data ?? []) as unknown as DashboardBooking[]} now={loadedAt} /></PageShell>;
}
