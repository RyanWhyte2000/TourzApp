import type { Metadata } from "next";
import { ArrowLeft, Compass, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Page Not Found | Tourz" };

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-[#dfe2f0] px-4 py-10"><section className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white text-center shadow-[0_24px_70px_rgba(31,41,55,0.14)]"><div className="bg-slate-950 px-8 py-10 text-white"><div className="flex items-center justify-center gap-2 text-xl font-bold"><ShieldCheck className="size-6" />Tourz</div><p className="mt-7 text-7xl font-black tracking-[-0.08em] text-violet-300">404</p><h1 className="mt-2 text-3xl font-bold">This destination isn’t on the map</h1><p className="mx-auto mt-3 max-w-md text-slate-300">The page may have moved, the listing may no longer be available, or the address may be incorrect.</p></div><div className="p-8"><div className="flex flex-wrap justify-center gap-3"><Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800"><Compass className="size-4" />Explore Tourz</Link><Link href="/airbnb" className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-5 text-sm font-semibold hover:bg-slate-50"><Search className="size-4" />Browse listings</Link></div><Link href="/help" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-violet-700"><ArrowLeft className="size-4" />Visit the Help Center</Link></div></section></main>;
}
