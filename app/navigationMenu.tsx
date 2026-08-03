"use client";

import { Drawer } from "@base-ui/react/drawer";
import Link from "next/link";
import { BedDouble, Building2, CarFront, Heart, Home, Info, LifeBuoy, Menu, Search, ShieldCheck, Store, UserRound, UsersRound, UtensilsCrossed, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import SearchPanel from "./SearchPanel";
import NotificationBell from "./NotificationBell";
import SupportChat from "./SupportChat";

export default function NavigationMenuDemo({ authControl }: { authControl?: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const navigation = [
    { label: "Home", href: "/", icon: Home },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "About Us", href: "/about", icon: Info },
    { label: "Become a Host", href: "/become-a-host", icon: UsersRound },
    { label: "Help Center", href: "/help", icon: LifeBuoy },
  ];
  const categories = [
    { label: "Stays", href: "/airbnb", icon: BedDouble },
    { label: "Hotels", href: "/hotel", icon: Building2 },
    { label: "Food", href: "/food", icon: UtensilsCrossed },
    { label: "Transport", href: "/transport", icon: CarFront },
  ];

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8 lg:px-10">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-[-0.04em]">
        <span className="flex size-7 items-center justify-center rounded-md bg-slate-950 text-white">
          <ShieldCheck className="size-4 fill-white/10" />
        </span>
        Tourz
      </Link>

      <nav className="hidden items-center gap-9 text-sm font-medium text-slate-700 md:flex">
        {navigation.map((item) => <Link key={item.href} className="transition hover:text-slate-950" href={item.href}>{item.label}</Link>)}
      </nav>

      <div className="hidden items-center gap-4 md:flex">
        <SupportChat />
        <NotificationBell />
        {authControl ?? <Link href="/login" className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-100"><UserRound className="size-5" /></Link>}
      </div>

      <div className="flex items-center gap-2 md:hidden">
        {authControl ?? <Link href="/login" aria-label="Account" className="flex size-10 items-center justify-center rounded-full border border-slate-200"><UserRound className="size-5" /></Link>}
        <Link
          href="/wishlist"
          aria-label="Open wishlist"
          className="flex size-10 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50"
        >
          <Heart className="size-5" />
        </Link>
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
        <Drawer.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <Drawer.Trigger aria-label="Open navigation" className="flex size-10 items-center justify-center rounded-full border border-slate-200">
            <Menu className="size-5" />
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Backdrop className="fixed inset-0 z-50 bg-slate-950/45 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
            <Drawer.Viewport className="fixed inset-0 z-50 flex items-end">
              <Drawer.Popup className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-white px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl transition-transform duration-300 data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <Drawer.Title className="text-lg font-semibold">Explore Tourz</Drawer.Title>
                  <Drawer.Close aria-label="Close navigation" className="flex size-10 items-center justify-center rounded-full bg-slate-100"><X className="size-5" /></Drawer.Close>
                </div>
                <nav className="grid py-3">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return <Drawer.Close key={item.href} render={<Link href={item.href} />} className={`flex items-center gap-3 rounded-xl px-3 py-3.5 font-medium transition ${active ? "bg-violet-50 text-violet-700" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"}`}><Icon className="size-5" />{item.label}{active && <span className="ml-auto size-2 rounded-full bg-violet-600" />}</Drawer.Close>;
                  })}
                </nav>
                <div className="border-t border-slate-100 pt-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Browse categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((item) => {
                      const Icon = item.icon;
                      return <Drawer.Close key={item.href} render={<Link href={item.href} />} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700"><Icon className="size-4" />{item.label}</Drawer.Close>;
                    })}
                  </div>
                </div>
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <SupportChat variant="menu" />
                  <p className="mt-2 text-center text-xs text-slate-400"><Store className="mr-1 inline size-3" />Travel support, right when you need it</p>
                </div>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </header>
  );
}
