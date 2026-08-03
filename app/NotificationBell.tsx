"use client";

import { Bell, CheckCheck, Heart, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const notifications = [
  {
    id: "wishlist-ready",
    title: "Your wishlist is ready",
    description: "Keep your favorite stays, dining, and rides together.",
    time: "Just now",
    href: "/wishlist",
    icon: Heart,
  },
  {
    id: "complete-profile",
    title: "Complete your traveler profile",
    description: "Review your account information before planning your next trip.",
    time: "Today",
    href: "/profile",
    icon: UserRound,
  },
  {
    id: "explore-tourz",
    title: "Discover more with Tourz",
    description: "Explore stays, hotels, local food, and transportation in one place.",
    time: "This week",
    href: "/about",
    icon: Sparkles,
  },
] as const;

const storageKey = "tourz:read-notifications";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(({ id }) => !readIds.includes(id)).length;

  useEffect(() => {
    let active = true;
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      const ids = Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : [];
      queueMicrotask(() => {
        if (active) setReadIds(ids);
      });
    } catch {
      // Invalid saved state is equivalent to no notifications having been read.
    }
    return () => { active = false; };
  }, []);

  useEffect(() => {
    function dismiss(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  function saveRead(next: string[]) {
    setReadIds(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function markRead(id: string) {
    if (!readIds.includes(id)) saveRead([...readIds, id]);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-10 items-center justify-center rounded-full transition hover:bg-slate-100"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-4 text-white">{unreadCount}</span>}
      </button>

      {open && (
        <section className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold">Notifications</h2>
              <p className="text-xs text-slate-500">{unreadCount ? `${unreadCount} unread` : "You’re all caught up"}</p>
            </div>
            {unreadCount > 0 && (
              <button type="button" onClick={() => saveRead(notifications.map(({ id }) => id))} className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900">
                <CheckCheck className="size-4" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {notifications.map(({ id, title, description, time, href, icon: Icon }) => {
              const unread = !readIds.includes(id);
              return (
                <Link key={id} href={href} onClick={() => { markRead(id); setOpen(false); }} className={`flex gap-3 rounded-xl p-3 transition hover:bg-slate-50 ${unread ? "bg-violet-50/60" : ""}`}>
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-violet-700 shadow-sm"><Icon className="size-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start gap-2"><span className="flex-1 text-sm font-semibold">{title}</span>{unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-violet-600" />}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span>
                    <span className="mt-1 block text-[11px] font-medium text-slate-400">{time}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
