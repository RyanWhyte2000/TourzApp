import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#dfe2f0] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_24px_70px_rgba(31,41,55,0.14)] sm:p-9">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-slate-950 text-white"><ShieldCheck className="size-4" /></span>
          Tourz
        </Link>
        <h1 className="text-center text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mb-7 mt-2 text-center text-sm text-slate-500">{description}</p>
        {children}
      </section>
    </main>
  );
}
