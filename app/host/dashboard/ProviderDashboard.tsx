"use client";

import { BedDouble, Building2, KeyRound, UtensilsCrossed, CalendarDays, CarFront, CheckCircle2, ChevronRight, CircleDollarSign, Clock3, LayoutDashboard, MapPin, Plus, Search, Settings2, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { providerDefinitions, type ProviderType, type ProviderProfile } from "@/lib/providers/types";
import { dashboardSummary, dashboardDefinitions, bookingLabel, bookingStage, type DashboardBooking, type DashboardListing } from "@/lib/providers/dashboard";
import BookingControls from "./BookingControls";
import ListingEditor from "./ListingEditor";

const icons = { driver: CarFront, hotel_owner: Building2, car_rental: KeyRound, airbnb_owner: BedDouble, restaurant_owner: UtensilsCrossed };

const money = (value: number | string) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(value));
const date = (value: string) => new Intl.DateTimeFormat("en", { timeZone: "America/Jamaica", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
const day = (value: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Jamaica", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));

export function BookingCard({ booking, type }: { booking: DashboardBooking; type: ProviderType }) {
  const definition = dashboardDefinitions[type];
  const label = bookingLabel(booking, type);
  return <article className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Booking #{booking.id.slice(0, 8)}</p><h3 className="mt-1 font-bold">{booking.listings?.title ?? definition.singular}</h3></div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${label === "Cancelled" ? "bg-rose-50 text-rose-700" : bookingStage(booking) === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-emerald-50 text-emerald-700"}`}>{label}</span>
    </div>
    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
      <p className="flex gap-2 text-slate-600"><CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" /><span><span className="block text-xs text-slate-400">{definition.start}</span>{date(booking.starts_at)}</span></p>
      {definition.end && <p className="flex gap-2 text-slate-600"><Clock3 className="mt-0.5 size-4 shrink-0 text-slate-400" /><span><span className="block text-xs text-slate-400">{definition.end}</span>{booking.ends_at ? date(booking.ends_at) : "—"}</span></p>}
      <p className="flex items-center gap-2 text-slate-600"><Users className="size-4 text-slate-400" />{booking.party_size} {booking.party_size === 1 ? definition.party : definition.parties}</p>
      <p className="font-semibold">{money(booking.subtotal)} <span className="font-normal text-slate-400">service amount</span></p>
    </div>
    <p className="mt-3 text-xs text-slate-500">Payment: {booking.payment_status === "paid" ? "recorded as paid" : booking.payment_status === "refunded" ? "refunded" : "not collected online"}</p>
    {booking.notes && <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600"><p className="mb-1 text-xs font-semibold text-slate-400">Traveler notes</p><p className="whitespace-pre-wrap break-words">{booking.notes}</p></div>}
    <BookingControls booking={booking} type={type} />
  </article>;
}

export default function ProviderDashboard({ profile, services, bookings, now }: { profile: ProviderProfile; services: DashboardListing[]; bookings: DashboardBooking[]; now: number }) {
  const type = profile.provider_type;
  const definition = dashboardDefinitions[type];
  const BusinessIcon = icons[type];
  const profileHref = `/host/profiles/${type}`;
  const [tab, setTab] = useState<"overview" | "bookings" | "services">("overview");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const stats = dashboardSummary(bookings, now);
  const upcoming = bookings.filter((booking) => booking.status !== "cancelled" && booking.driver_status !== "completed" && (booking.driver_status === "in_progress" || Date.parse(booking.ends_at ?? booking.starts_at) >= now)).slice(0, 3);
  const filtered = bookings.filter((booking) =>
    (filter === "all" || bookingStage(booking) === filter)
    && (!selectedDate || day(booking.starts_at) === selectedDate)
    && `${booking.id} ${booking.listings?.title ?? ""}`.toLowerCase().includes(query.toLowerCase().trim()),
  );
  const liveServices = services.filter((service) => service.status === "published").length;
  const tabs = [{ id: "overview" as const, label: "Overview", icon: LayoutDashboard }, { id: "bookings" as const, label: "Bookings", icon: CalendarDays }, { id: "services" as const, label: definition.listings, icon: BusinessIcon }];
  return <div className="grid min-h-[75vh] lg:grid-cols-[220px_minmax(0,1fr)]">
    <aside className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white"><BusinessIcon className="size-5" /></span><div><p className="font-bold">{definition.title} workspace</p><p className="text-xs text-slate-500">Your business. Your schedule.</p></div></div>
      <nav aria-label={`${definition.title} dashboard`} className="mt-6 flex flex-wrap gap-2 lg:flex-col">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === id ? "bg-emerald-100 text-emerald-800" : "text-slate-500 hover:bg-white"}`}><Icon className="size-4" />{label}</button>)}
        <Link href={profileHref} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-white"><Settings2 className="size-4" />Business profile</Link>
      </nav>
      <div className="mt-8 hidden rounded-2xl border border-slate-200 bg-white p-4 lg:block"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your base</p><p className="mt-2 flex items-start gap-2 text-sm font-medium"><MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />{profile.location}</p><p className="mt-3 text-xs text-slate-500">{liveServices} live {liveServices === 1 ? "listing" : "listings"}</p></div>
    </aside>
    <main className="min-w-0 bg-[#fafbfe] p-5 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">{providerDefinitions[type].label} dashboard</p><h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{tab === "overview" ? `Welcome, ${profile.display_name}` : tab === "bookings" ? "Your bookings" : definition.listings}</h1><p className="mt-2 text-sm text-slate-500">{tab === "services" ? "Manage listing details and availability for new bookings." : "Manage your work in one place. Times shown in Jamaica (UTC−5)."}</p></div><Link href="/host/onboarding" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"><Plus className="size-4" />{definition.add}</Link></header>

      {tab === "overview" && <>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
          { label: definition.upcomingLabel, value: stats.upcoming, icon: CalendarDays, detail: "Scheduled and still active" },
          { label: definition.activeLabel, value: stats.inProgress, icon: BusinessIcon, detail: "Currently under way" },
          { label: definition.completedLabel, value: stats.completed, icon: CheckCircle2, detail: "Marked complete by you" },
          { label: "Booked service value", value: money(stats.bookedValue), icon: CircleDollarSign, detail: "All non-cancelled bookings; not payouts" },
        ].map(({ label, value, icon: Icon, detail }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className="size-5 shrink-0 text-emerald-500" /></div><p className="mt-4 text-3xl font-bold tracking-tight">{value}</p><p className="mt-2 text-xs text-slate-400">{detail}</p></div>)}</div>
        <section className="mt-9"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Next on your schedule</h2><button onClick={() => setTab("bookings")} className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">All bookings<ChevronRight className="size-4" /></button></div><div className="mt-5 space-y-4">{upcoming.length ? upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} type={type} />) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><CalendarDays className="mx-auto size-8 text-slate-300" /><h3 className="mt-4 font-bold">No upcoming bookings</h3><p className="mt-2 text-sm text-slate-500">Bookings for your published listings will appear here.</p><button onClick={() => setTab("services")} className="mt-5 text-sm font-semibold text-emerald-700">{definition.listings} →</button></div>}</div></section>
        <div className="mt-6 rounded-2xl bg-emerald-50 p-5"><h2 className="font-bold text-emerald-950">Keep your business profile current</h2><p className="mt-2 text-sm text-emerald-700">Update your business information, location, and contact details from your profile.</p><Link href={profileHref} className="mt-4 inline-block text-sm font-semibold text-emerald-800">Edit profile →</Link></div>
      </>}

      {tab === "bookings" && <section className="mt-7">
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <label className="min-w-48 flex-1 text-xs font-semibold text-slate-500">Find booking<span className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Booking ID or listing name" className="h-10 min-w-0 w-full bg-transparent text-sm font-normal outline-none" /></span></label>
          <label className="text-xs font-semibold text-slate-500">Status<select value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-2 block h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal"><option value="all">All bookings</option><option value="pending">Pending</option><option value="scheduled">Scheduled</option><option value="in_progress">{definition.activeLabel}</option><option value="completed">{definition.completedLabel}</option><option value="cancelled">Cancelled</option></select></label>
          <label className="text-xs font-semibold text-slate-500">{definition.start} date<input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="mt-2 block h-10 rounded-xl border border-slate-200 px-3 text-sm font-normal" /></label>
          {(query || selectedDate || filter !== "all") && <button onClick={() => { setQuery(""); setSelectedDate(""); setFilter("all"); }} className="h-10 text-sm font-semibold text-emerald-700">Clear</button>}
        </div>
        <p className="mt-5 text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? "booking" : "bookings"}</p>
        <div className="mt-4 space-y-4">{filtered.map((booking) => <BookingCard key={booking.id} booking={booking} type={type} />)}{!filtered.length && <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">{bookings.length ? "No bookings match these filters." : "You have no bookings yet."}</p>}</div>
      </section>}

      {tab === "services" && <section className="mt-7">
        <div className="flex flex-wrap gap-3 text-sm text-slate-500"><span>{services.length} total</span><span>·</span><span>{liveServices} live</span><span>·</span><span>{services.filter((service) => service.status === "draft").length} drafts</span></div>
        <div className="mt-5 grid auto-rows-max items-start gap-5 xl:grid-cols-2">{services.map((service) => <article key={service.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="aspect-[2.5/1] bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url(${service.image_url})` }} /><div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-lg font-bold">{service.title}</h2><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${service.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{service.status === "published" ? "Live" : service.status === "archived" ? "Paused" : "Draft"}</span></div><p className="mt-2 text-sm text-slate-500">{service.subtitle}</p><div className="mt-4 flex items-center justify-between gap-3"><p className="font-bold">{money(service.price)}<span className="text-sm font-normal text-slate-400">{service.price_suffix}</span></p><p className="text-sm text-slate-500">{definition.fields.slice(0, 2).map((field) => `${service.filter_values[field.name] ?? field.initial} ${field.label.toLowerCase()}`).join(" · ")}</p></div>{service.status === "published" && <Link href={`/${providerDefinitions[type].category}/${service.id}`} className="mt-4 inline-block text-sm font-semibold text-emerald-700">View public listing →</Link>}<ListingEditor service={service} type={type} /></div></article>)}</div>
        {!services.length && <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><BusinessIcon className="mx-auto size-8 text-slate-300" /><h2 className="mt-4 font-bold">Create your first {definition.singular}</h2><p className="mt-2 text-sm text-slate-500">Add your listing, pricing, and details, then publish when ready.</p><Link href="/host/onboarding" className="mt-5 inline-block rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">{definition.add}</Link></div>}
        <Link href={profileHref} className="mt-6 inline-block text-sm font-semibold text-emerald-700">Link an earlier listing from your profile →</Link>
      </section>}
    </main>
  </div>;
}
