"use client";

import { Drawer } from "@base-ui/react/drawer";
import Link from "next/link";
import { Bell, Bot, Menu, Search, ShieldCheck, UserRound, X } from "lucide-react";
import { useState } from "react";
import SearchPanel from "./SearchPanel";

export default function NavigationMenuDemo() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          
          Support
        </button>
        <button className="flex size-10 items-center justify-center rounded-full transition hover:bg-slate-100">
          <Bell className="size-5" />
        </button>
        <button className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
          <UserRound className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <Drawer.Root open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <Drawer.Trigger
            aria-label="Open search"
            className="flex size-10 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50"
          >
            <Search className="size-5" />
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Backdrop className="fixed inset-0 z-50 bg-slate-950/45 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
            <Drawer.Viewport className="fixed inset-0 z-50 flex items-end">
              <Drawer.Popup className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-300 data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full">
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
                  <Drawer.Title className="text-lg font-semibold">Search Tourz</Drawer.Title>
                  <Drawer.Close
                    aria-label="Close search"
                    className="flex size-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
                  >
                    <X className="size-5" />
                  </Drawer.Close>
                </div>
                <SearchPanel onSearchComplete={() => setIsSearchOpen(false)} />
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
        <button className="flex size-10 items-center justify-center rounded-full border border-slate-200">
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}
