"use client";

import { CalendarDays, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import type { ListingCategory } from "../ListingLayout";
import { createReservation } from "./actions";

const today = new Date().toISOString().slice(0, 10);

export default function CheckoutForm({ listing }: { listing: { id: string; category: ListingCategory; title: string; price: number; priceSuffix: string } }) {
  const [state, action, pending] = useActionState(createReservation, undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [partySize, setPartySize] = useState(1);
  const isFood = listing.category === "food";
  const needsEnd = listing.category !== "food";
  const units = useMemo(() => {
    if (isFood) return partySize;
    if (!startDate || !endDate) return 1;
    return Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000));
  }, [endDate, isFood, partySize, startDate]);
  const subtotal = listing.price * units;
  const fee = subtotal * 0.08;
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return <form action={action} className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
    <input type="hidden" name="listingId" value={listing.id} /><input type="hidden" name="category" value={listing.category} />
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><CalendarDays className="size-5 text-violet-600" /> Reservation details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">{isFood ? "Reservation date" : listing.category === "transport" ? "Pickup date" : "Check-in"}<input required min={today} name="startDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3" /></label>
          {needsEnd ? <label className="text-sm font-medium">{listing.category === "transport" ? "Return date" : "Check-out"}<input required min={startDate || today} name="endDate" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3" /></label> : <label className="text-sm font-medium">Time<input required name="time" type="time" defaultValue="19:00" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3" /></label>}
          <label className="text-sm font-medium sm:col-span-2"><span className="inline-flex items-center gap-2"><Users className="size-4" />{isFood ? "Party size" : "Guests / passengers"}</span><input required min="1" max="30" name="partySize" type="number" value={partySize} onChange={(event) => setPartySize(Number(event.target.value))} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3" /></label>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">Payment</h2>
        <label className="mt-4 flex items-start gap-3 rounded-xl border-2 border-violet-500 bg-violet-50 p-4"><input type="radio" name="paymentMethod" value="pay_later" defaultChecked className="mt-1" /><span><span className="font-semibold">Pay later</span><span className="mt-1 block text-sm text-slate-600">No card is collected or charged. Payment is arranged with the provider.</span></span></label>
        <label className="mt-5 block text-sm font-medium">Special requests (optional)<textarea name="notes" maxLength={1000} rows={4} className="mt-2 w-full rounded-xl border border-slate-200 p-3" placeholder="Arrival details, accessibility needs, or other requests" /></label>
      </section>
    </div>
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-lg lg:sticky lg:top-6">
      <h2 className="text-lg font-bold">Price details</h2>
      <div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>{money(listing.price)} × {units} {isFood ? (units === 1 ? "guest" : "guests") : (units === 1 ? "day/night" : "days/nights")}</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span>Service fee</span><span>{money(fee)}</span></div><div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold"><span>Total</span><span>{money(subtotal + fee)}</span></div></div>
      {state?.error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{state.error}</p>}
      <button disabled={pending} className="mt-5 h-12 w-full rounded-full bg-violet-700 font-semibold text-white hover:bg-violet-800 disabled:opacity-60">{pending ? "Confirming…" : "Confirm reservation"}</button>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck className="size-4" />No payment is taken today</p>
      <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800"><CheckCircle2 className="mt-0.5 size-4 shrink-0" />Flexible cancellation; confirm final terms with the provider.</p>
    </aside>
  </form>;
}
