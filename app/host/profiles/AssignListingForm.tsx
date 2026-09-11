"use client";

import { useActionState } from "react";
import type { ProviderType } from "@/lib/providers/types";
import { assignProviderListing } from "./actions";

export default function AssignListingForm({ type, listingId }: { type: ProviderType; listingId: string }) {
  const [state, action, pending] = useActionState(assignProviderListing, undefined);
  return <form action={action}>
    <input type="hidden" name="provider_type" value={type} />
    <input type="hidden" name="listing_id" value={listingId} />
    <button disabled={pending} className="text-sm font-semibold text-violet-700 disabled:opacity-50">{pending ? "Adding…" : "Add to this profile"}</button>
    {state?.error && <p role="alert" className="mt-2 text-sm text-rose-700">{state.error}</p>}
  </form>;
}
