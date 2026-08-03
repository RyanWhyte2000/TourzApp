import type { Metadata } from "next";
import { CalendarDays, ChevronRight, Heart, Mail, MapPin, ReceiptText, Settings, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageShell from "../PageShell";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import type { ListingCategory } from "../ListingLayout";

type ProfileReservation = {
  id: string;
  listing_id: string;
  category: ListingCategory;
  starts_at: string;
  ends_at: string | null;
  party_size: number;
  total: number | string;
  status: "pending" | "confirmed" | "cancelled";
  payment_status: "not_charged" | "paid" | "refunded";
  listings: { title: string; image_url: string; subtitle: string | null } | null;
};

export const metadata: Metadata = { title: "Profile | Tourz" };

export default async function ProfilePage() {
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : "Traveler";
  const joined = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(user.created_at));
  const { data: reservationData, error: reservationsError } = await supabase
    .from("reservations")
    .select("id, listing_id, category, starts_at, ends_at, party_size, total, status, payment_status, listings(title, image_url, subtitle)")
    .eq("user_id", user.id)
    .order("starts_at", { ascending: true });
  const reservations = (reservationData ?? []) as unknown as ProfileReservation[];
  const date = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  const money = (value: number | string) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));

  return <PageShell>
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-10 text-white sm:px-10">
          <span className="flex size-16 items-center justify-center rounded-full bg-white/20"><UserRound className="size-8" /></span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">{name}</h1>
          <p className="mt-1 text-violet-100">Your Tourz traveler profile</p>
        </div>
        <div className="grid gap-5 p-7 sm:grid-cols-2 sm:p-10">
          <div className="rounded-2xl bg-slate-50 p-5">
            <Mail className="size-5 text-violet-600" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Email</p>
            <p className="mt-1 break-all font-medium">{user.email}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <CalendarDays className="size-5 text-violet-600" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Member since</p>
            <p className="mt-1 font-medium">{joined}</p>
          </div>
          <Link href="/wishlist" className="flex items-center justify-between rounded-2xl border border-violet-200 p-5 transition hover:bg-violet-50 sm:col-span-2">
            <span><span className="font-semibold">Your wishlist</span><span className="mt-1 block text-sm text-slate-500">View the places and experiences you saved.</span></span>
            <Heart className="size-5 text-violet-600" />
          </Link>
          <Link href="/settings" className="flex items-center justify-between rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50 sm:col-span-2"><span><span className="font-semibold">Account settings</span><span className="mt-1 block text-sm text-slate-500">Manage preferences, notifications, privacy, and host options.</span></span><Settings className="size-5 text-violet-600" /></Link>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">Your trips</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Bookings and reservations</h2></div>
          {!reservationsError && reservations.length > 0 && <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">{reservations.length} {reservations.length === 1 ? "booking" : "bookings"}</span>}
        </div>

        {reservationsError ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><p className="font-semibold">Bookings are not available yet.</p><p className="mt-1">Apply the reservations database migration to display your confirmed trips here.</p></div>
        ) : reservations.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center"><CalendarDays className="mx-auto size-9 text-slate-400" /><h3 className="mt-4 font-bold">No bookings yet</h3><p className="mt-1 text-sm text-slate-500">Your confirmed stays, meals, and rides will appear here.</p><Link href="/airbnb" className="mt-5 inline-flex rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white">Explore listings</Link></div>
        ) : (
          <div className="mt-5 grid gap-5">
            {reservations.map((reservation) => {
              const listing = reservation.listings;
              const statusLabel = reservation.status === "cancelled" ? "Cancelled" : reservation.status === "confirmed" ? "Confirmed" : "Pending";
              const statusClass = reservation.status === "cancelled" ? "bg-rose-50 text-rose-700" : reservation.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700";
              return <article key={reservation.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid sm:grid-cols-[190px_minmax(0,1fr)]">
                  <Link href={`/${reservation.category}/${reservation.listing_id}`} aria-label={`View ${listing?.title ?? "listing"}`} className="min-h-44 bg-slate-100 bg-cover bg-center" style={listing?.image_url ? { backgroundImage: `url(${listing.image_url})` } : undefined} />
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-violet-600">{reservation.category}</p><h3 className="mt-1 text-xl font-bold">{listing?.title ?? "Reserved listing"}</h3>{listing?.subtitle && <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500"><MapPin className="size-4" />{listing.subtitle}</p>}</div><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{statusLabel}</span></div>
                    <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3"><span className="inline-flex items-start gap-2"><CalendarDays className="mt-0.5 size-4 text-slate-400" /><span><span className="block text-xs text-slate-400">Starts</span>{date(reservation.starts_at)}</span></span><span className="inline-flex items-start gap-2"><Users className="mt-0.5 size-4 text-slate-400" /><span><span className="block text-xs text-slate-400">Guests</span>{reservation.party_size}</span></span><span className="inline-flex items-start gap-2"><ReceiptText className="mt-0.5 size-4 text-slate-400" /><span><span className="block text-xs text-slate-400">Total due</span>{money(reservation.total)}</span></span></div>
                    <Link href={`/reservations/${reservation.id}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900">View confirmation <ChevronRight className="size-4" /></Link>
                  </div>
                </div>
              </article>;
            })}
          </div>
        )}
      </section>
    </section>
  </PageShell>;
}
