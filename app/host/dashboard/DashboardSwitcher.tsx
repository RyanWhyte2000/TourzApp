import Link from "next/link";
import { providerDefinitions, type ProviderProfile, type ProviderType } from "@/lib/providers/types";
import { dashboardHref } from "@/lib/providers/dashboard";

export default function DashboardSwitcher({ profiles, current }: { profiles: ProviderProfile[]; current: ProviderType }) {
  return <nav aria-label="Business dashboards" className="mb-6 flex flex-wrap items-center gap-2">
    {profiles.map((profile) => <Link key={profile.id} href={dashboardHref(profile.provider_type)} aria-current={profile.provider_type === current ? "page" : undefined} title={profile.display_name} className={`rounded-full border px-3 py-2 text-sm font-semibold ${profile.provider_type === current ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{providerDefinitions[profile.provider_type].label}</Link>)}
    <Link href="/host/profiles" className="px-3 py-2 text-sm font-semibold text-emerald-700">Manage categories</Link>
  </nav>;
}
