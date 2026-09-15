import { redirect } from "next/navigation";
import PageShell from "../PageShell";
import { getDriverAccount } from "@/lib/driver/auth";
import type { DriverBooking, DriverService } from "@/lib/driver/types";
import DriverDashboard from "./DriverDashboard";

export const metadata = { title: "Driver Dashboard | Tourz" };

export default async function DriverDashboardPage() {
  const { supabase, user, profile, profiles, error, loadedAt } = await getDriverAccount();
  if (!user) redirect("/login?next=/driver");
  if (error) throw new Error("Unable to load your driver profile. Please try again.");
  if (!profile) redirect("/host/profiles/driver");
  if (profile.provider_type !== "driver") redirect("/host/profiles");
  const [servicesResult, bookingsResult] = await Promise.all([
    supabase.from("listings").select("id, title, description, subtitle, image_url, price, price_suffix, status, filter_values").eq("owner_id", user.id).eq("provider_profile_id", profile.id).eq("category", "transport").order("created_at", { ascending: false }),
    supabase.from("reservations").select("id, listing_id, starts_at, ends_at, party_size, subtotal, status, payment_status, driver_status, notes, listings!inner(title, provider_profile_id)").eq("listings.provider_profile_id", profile.id).order("starts_at", { ascending: true }),
  ]);
  if (servicesResult.error || bookingsResult.error) throw new Error("Unable to load your driver dashboard. Please try again.");
  return <PageShell showSearch={false}><DriverDashboard profiles={profiles} profile={profile} services={(servicesResult.data ?? []) as DriverService[]} bookings={(bookingsResult.data ?? []) as unknown as DriverBooking[]} now={loadedAt} /></PageShell>;
}
