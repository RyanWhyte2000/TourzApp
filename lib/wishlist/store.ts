"use client";

import { useEffect, useSyncExternalStore } from "react";

const storageKey = "tourz:wishlist";
const changeEvent = "tourz:wishlist-change";
const emptyIds: readonly string[] = [];
let cachedRaw: string | null = null;
let cachedIds: readonly string[] = emptyIds;
let authenticated = false;
let syncPromise: Promise<void> | null = null;

function getSnapshot(): readonly string[] {
  const raw = window.localStorage.getItem(storageKey) ?? "[]";
  if (raw === cachedRaw) return cachedIds;

  cachedRaw = raw;
  try {
    const parsed: unknown = JSON.parse(raw);
    cachedIds = Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))]
      : emptyIds;
  } catch {
    cachedIds = emptyIds;
  }
  return cachedIds;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

function write(ids: readonly string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(ids));
  window.dispatchEvent(new Event(changeEvent));
}

function syncWithAccount() {
  if (syncPromise) return syncPromise;
  const initialIds = getSnapshot();
  syncPromise = fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: initialIds }),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error("Wishlist sync failed");
      const data = await response.json() as { ids?: string[]; authenticated?: boolean };
      authenticated = Boolean(data.authenticated);
      if (authenticated && Array.isArray(data.ids) && getSnapshot() === initialIds) write(data.ids);
    })
    .catch(() => {
      authenticated = false;
    })
    .finally(() => {
      syncPromise = null;
    });
  return syncPromise;
}

export function useWishlist() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, () => emptyIds);
  useEffect(() => {
    void syncWithAccount();
  }, []);

  return {
    ids,
    isFavorite: (listingId: string) => ids.includes(listingId),
    toggle: (listingId: string) => {
      const current = getSnapshot();
      const favorite = !current.includes(listingId);
      write(
        !favorite
          ? current.filter((id) => id !== listingId)
          : [...current, listingId],
      );
      void syncWithAccount().then(async () => {
        // A sync can return the server's old value while this toggle is pending.
        const latest = getSnapshot();
        if (latest.includes(listingId) !== favorite) {
          write(favorite ? [...latest, listingId] : latest.filter((id) => id !== listingId));
        }
        if (!authenticated) return;
        const response = await fetch("/api/wishlist", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, favorite }),
        });
        if (!response.ok) {
          write(favorite ? getSnapshot().filter((id) => id !== listingId) : [...getSnapshot(), listingId]);
        }
      }).catch(() => {
        write(favorite ? getSnapshot().filter((id) => id !== listingId) : [...new Set([...getSnapshot(), listingId])]);
      });
    },
  };
}
