"use client";

import Link from "next/link";
import { Bell, Bot, Menu, Search, ShieldCheck, UserRound } from "lucide-react";

export default function NavigationMenuDemo() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8 lg:px-10">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-[-0.04em]">
        <span className="flex size-7 items-center justify-center rounded-md bg-slate-950 text-white">
          <ShieldCheck className="size-4 fill-white/10" />
        </span>
        Tourz
      </Link>

      <nav className="hidden items-center gap-9 text-sm font-medium text-slate-700 md:flex">
        <Link className="transition hover:text-slate-950" href="#">
          Home
        </Link>
        <Link className="transition hover:text-slate-950" href="#">
          About Us
        </Link>
        <Link className="transition hover:text-slate-950" href="#">
          Become a Host
        </Link>
        <Link className="transition hover:text-slate-950" href="#">
          Help Center
        </Link>
      </nav>

      <div className="hidden items-center gap-4 md:flex">
        <button className="inline-flex h-10 items-center gap-2 rounded-full border border-violet-200 bg-white px-3 text-sm font-semibold shadow-sm">
          <span className="flex size-7 items-center justify-center rounded-full bg-violet-600 text-white">
            <Bot className="size-4" />
          </span>
          Ask A.I
        </button>
        <button className="flex size-10 items-center justify-center rounded-full transition hover:bg-slate-100">
          <Bell className="size-5" />
        </button>
        <button className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          <UserRound className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <button className="flex size-10 items-center justify-center rounded-full border border-slate-200">
          <Search className="size-5" />
        </button>
        <button className="flex size-10 items-center justify-center rounded-full border border-slate-200">
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}
