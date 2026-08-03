import { ArrowLeft, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageShell from "../../../PageShell";
import type { ListingCategory } from "../../../ListingLayout";
import CheckoutForm from "../../CheckoutForm";
import { getListing } from "@/lib/listings/queries";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";

const categories: ListingCategory[] = ["airbnb", "hotel", "food", "transport"];

export default async function CheckoutPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category: rawCategory, id } = await params;
  if (!categories.includes(rawCategory as ListingCategory)) notFound();
  const category = rawCategory as ListingCategory;
  const supabase = await createAuthSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/checkout/${category}/${id}`)}`);
  const item = await getListing(category, id);
  if (!item) notFound();
  const price = Number(item.price.replace(/[^0-9.]/g, ""));

  return <PageShell><main className="px-5 py-10 sm:px-8 lg:px-10"><div className="mx-auto max-w-6xl"><Link href={`/${category}/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft className="size-4" />Back to listing</Link><div className="my-7 flex gap-4 rounded-2xl bg-slate-50 p-4"><div className="size-24 shrink-0 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} /><div><p className="text-xs font-bold uppercase tracking-wider text-violet-600">Checkout</p><h1 className="mt-1 text-2xl font-bold">{item.title}</h1><p className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500"><span className="inline-flex items-center gap-1"><MapPin className="size-4" />{item.subtitle}</span><span className="inline-flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" />{item.rating}</span></p></div></div><CheckoutForm listing={{ id, category, title: item.title, price, priceSuffix: item.priceSuffix ?? "" }} /></div></main></PageShell>;
}
