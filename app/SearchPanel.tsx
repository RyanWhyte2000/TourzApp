"use client";

import {
  CarFront,
  Home,
  Hamburger,
  Hotel,
  CalendarDays,
  UserRound,
  Search,
  Map,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchField from "./SearchField";

const tabs = [
  { href: "/transport", label: "Transport", icon: CarFront },
  { href: "/airbnb", label: "AirBnb", icon: Home },
  { href: "/food", label: "Food", icon: Hamburger },
  { href: "/hotel", label: "Hotel", icon: Hotel },
];

function SearchPanel() {
  const pathname = usePathname();

  const activeTab =
    tabs.find((tab) => pathname === tab.href || (pathname === "/" && tab.href === "/airbnb"))
      ?.href ?? "/airbnb";

  return (
    <section className="bg-slate-50 px-4 py-6 sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl rounded-[1.3rem] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
        <div className="grid grid-cols-4 border-b border-slate-100 text-sm font-medium sm:w-105">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex h-12 items-center justify-center gap-2 border-r border-slate-100 last:border-r-0 ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-700"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="grid divide-y divide-slate-100 lg:grid-cols-[1.35fr_0.75fr_0.75fr_0.85fr_auto] lg:divide-x lg:divide-y-0">
          <SearchField label="Where" value="Montego Bay, Jamaica" icon={<Map className="size-4" />} />
          <SearchField
            label="Check-in"
            value="Jan. 5, 2024"
            icon={<CalendarDays className="size-4" />}
          />
          <SearchField
            label="Check-out"
            value="Jan. 25, 2024"
            icon={<CalendarDays className="size-4" />}
          />
          <SearchField label="Guests" value="4 Adults" icon={<UserRound className="size-4" />} />
          <button className="m-3 inline-flex h-14 items-center justify-center gap-2 rounded-r-[1rem] bg-violet-700 px-7 text-sm font-semibold text-white transition hover:bg-violet-800 lg:m-0 lg:h-auto lg:rounded-r-[1.3rem]">
            <Search className="size-4" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

export default SearchPanel;
