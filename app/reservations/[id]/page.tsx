import { CalendarDays, CheckCircle2, MapPin, ReceiptText, Users } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "../../PageShell";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

type Reservation = {
  id: string; starts_at: string; ends_at: string | null; party_size: number; total: number | string; status: string; payment_status: string;
  listings: { title: string; image_url: string; subtitle: string | null } | null;
};

export default async function ReservationConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/reservations/${id}`)}`);
  const { data, error } = await supabase.from("reservations").select("id, starts_at, ends_at, party_size, total, status, payment_status, listings(title, image_url, subtitle)").eq("id", id).maybeSingle();
  if (error || !data) notFound();
  const reservation = data as unknown as Reservation;
  const date = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(reservation.total));

  return <PageShell><main className="px-5 py-12 sm:px-8"><section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"><div className="bg-emerald-600 px-7 py-9 text-center text-white"><CheckCircle2 className="mx-auto size-14" /><h1 className="mt-4 text-3xl font-bold">Reservation confirmed</h1><p className="mt-2 text-emerald-50">No payment was collected. Pay directly according to the provider’s terms.</p></div>{reservation.listings && <div className="flex gap-4 border-b border-slate-100 p-6"><div className="size-24 shrink-0 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${reservation.listings.image_url})` }} /><div><h2 className="text-xl font-bold">{reservation.listings.title}</h2><p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-500"><MapPin className="size-4" />{reservation.listings.subtitle}</p><p className="mt-2 text-xs text-slate-400">Confirmation #{reservation.id.slice(0, 8).toUpperCase()}</p></div></div>}<div className="grid gap-4 p-6 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><CalendarDays className="size-5 text-violet-600" /><p className="mt-2 text-xs uppercase text-slate-400">Starts</p><p className="mt-1 font-semibold">{date(reservation.starts_at)}</p></div><div className="rounded-xl bg-slate-50 p-4"><Users className="size-5 text-violet-600" /><p className="mt-2 text-xs uppercase text-slate-400">Guests / passengers</p><p className="mt-1 font-semibold">{reservation.party_size}</p></div><div className="rounded-xl bg-slate-50 p-4 sm:col-span-2"><ReceiptText className="size-5 text-violet-600" /><div className="mt-2 flex items-center justify-between"><span className="font-semibold">Total due later</span><span className="text-xl font-bold">{money}</span></div></div><Link href="/" className="flex h-12 items-center justify-center rounded-full border border-slate-200 font-semibold hover:bg-slate-50">Continue exploring</Link><Link href="/profile" className="flex h-12 items-center justify-center rounded-full bg-violet-700 font-semibold text-white hover:bg-violet-800">View profile</Link></div></section></main></PageShell>;
}
