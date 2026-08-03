"use client";

import { AlertTriangle, Home, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="flex min-h-screen items-center justify-center bg-[#dfe2f0] px-4 py-10"><section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-[0_24px_70px_rgba(31,41,55,0.14)] sm:p-10"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle className="size-7" /></div><div className="mt-5 flex items-center justify-center gap-2 text-lg font-bold"><ShieldCheck className="size-5" />Tourz</div><h1 className="mt-5 text-3xl font-bold tracking-tight">Something interrupted your trip</h1><p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">We couldn’t load this page. The issue may be temporary, so try the request again.</p>{error.digest && <p className="mt-3 text-xs text-slate-400">Reference: {error.digest}</p>}<div className="mt-7 flex flex-wrap justify-center gap-3"><button onClick={() => unstable_retry()} className="inline-flex h-11 items-center gap-2 rounded-full bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800"><RotateCcw className="size-4" />Try again</button><Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-5 text-sm font-semibold hover:bg-slate-50"><Home className="size-4" />Return home</Link></div></section></main>;
}
