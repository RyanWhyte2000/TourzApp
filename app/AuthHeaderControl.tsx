import Link from "next/link";
import { ChevronDown, Heart, HousePlus, LogOut, Settings, UserRound } from "lucide-react";
import { logout } from "./auth/actions";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

export default async function AuthHeaderControl() {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <Link href="/login" aria-label="Sign in" title="Sign in" className="flex size-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800"><UserRound className="size-5" /></Link>;

  const name = typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : "Traveler";
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return <details className="group relative">
    <summary aria-label="Open profile menu" className="flex cursor-pointer list-none items-center gap-1 rounded-full outline-none ring-violet-200 focus-visible:ring-4 [&::-webkit-details-marker]:hidden">
      <span title={user.email} className="flex size-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">{initials || <UserRound className="size-5" />}</span>
      <ChevronDown className="hidden size-4 text-slate-500 transition group-open:rotate-180 lg:block" />
    </summary>
    <div className="absolute right-0 z-40 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-slate-500">{user.email}</p>
      </div>
      <nav className="p-2 text-sm">
        <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50"><UserRound className="size-4" />Profile</Link>
        <Link href="/wishlist" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50"><Heart className="size-4" />Wishlist</Link>
        <Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50"><Settings className="size-4" />Settings</Link>
        <Link href="/host/onboarding" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50"><HousePlus className="size-4" />Create a listing</Link>
        <form action={logout}><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-rose-600 hover:bg-rose-50"><LogOut className="size-4" />Sign out</button></form>
      </nav>
    </div>
  </details>;
}
