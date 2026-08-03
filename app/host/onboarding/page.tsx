import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageShell from "../../PageShell";
import HostOnboardingForm from "./HostOnboardingForm";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export const metadata: Metadata = { title: "Create a Listing | Tourz" };
export default async function HostOnboardingPage() {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/host/onboarding");
  return <PageShell><main className="px-5 py-10 sm:px-8"><div className="mx-auto max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">Host onboarding</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Create your Tourz listing</h1><p className="mb-8 mt-2 text-slate-500">Tell us what you offer. Your first version is saved privately as a draft.</p><HostOnboardingForm /></div></main></PageShell>;
}
