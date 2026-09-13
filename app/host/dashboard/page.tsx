import { redirect } from "next/navigation";
import { getProviderAccount } from "@/lib/providers/account";
import { dashboardHref } from "@/lib/providers/dashboard";

export default async function DashboardEntry() {
  const { user, profile, error } = await getProviderAccount();
  if (!user) redirect("/login?next=/host/dashboard");
  if (error) throw new Error("Unable to load your provider profile.");
  if (!profile) redirect("/host/profiles");
  redirect(dashboardHref(profile.provider_type));
}
