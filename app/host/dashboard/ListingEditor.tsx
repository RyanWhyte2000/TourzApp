"use client";

import { useActionState } from "react";
import type { ProviderType } from "@/lib/providers/types";
import { dashboardDefinitions, type DashboardListing } from "@/lib/providers/dashboard";
import { saveProviderListing, setProviderListingStatus } from "./actions";

const inputClass = "mt-1.5 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500";

export default function ListingEditor({ service, type }: { service: DashboardListing; type: ProviderType }) {
  const definition = dashboardDefinitions[type];
  const [saveState, saveAction, saving] = useActionState(saveProviderListing, undefined);
  const [statusState, statusAction, updating] = useActionState(setProviderListingStatus, undefined);
  return <div className="mt-5 border-t border-slate-100 pt-4">
    <form action={statusAction}>
      <input type="hidden" name="provider_type" value={type} />
      <input type="hidden" name="service_id" value={service.id} />
      <input type="hidden" name="status" value={service.status === "published" ? "archived" : "published"} />
      <button disabled={updating} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">{updating ? "Updating…" : service.status === "published" ? "Pause bookings" : service.status === "draft" ? "Publish listing" : "Resume bookings"}</button>
      {statusState?.error && <p role="alert" className="mt-2 text-sm text-rose-700">{statusState.error}</p>}
      {statusState?.success && <p role="status" className="mt-2 text-sm text-emerald-700">{statusState.success}</p>}
    </form>
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-semibold text-emerald-700">Edit listing details</summary>
      <form action={saveAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="provider_type" value={type} />
      <input type="hidden" name="service_id" value={service.id} />
        <label className="text-sm font-medium sm:col-span-2">Title<input name="title" required minLength={5} maxLength={160} defaultValue={service.title} className={inputClass} /></label>
        <label className="text-sm font-medium sm:col-span-2">Description<textarea name="description" required minLength={30} maxLength={3000} rows={4} defaultValue={service.description ?? ""} className={inputClass} /></label>
        <label className="text-sm font-medium sm:col-span-2">Location<input name="subtitle" required minLength={3} maxLength={200} defaultValue={service.subtitle ?? ""} className={inputClass} /></label>
        <label className="text-sm font-medium sm:col-span-2">Cover image URL<input name="image_url" type="url" required maxLength={1000} defaultValue={service.image_url} className={inputClass} /></label>
        {type !== "restaurant_owner" && <label className="text-sm font-medium">{definition.priceLabel}<input name="price" type="number" min="0.01" max="1000000" step="0.01" required defaultValue={service.price} className={inputClass} /></label>}
        {definition.fields.map((field) => <label key={field.name} className="text-sm font-medium">{field.label}<input name={field.name} type="number" min={field.min} max={field.max} step="1" required defaultValue={service.filter_values[field.name] ?? field.initial} className={inputClass} /></label>)}
        {saveState?.error && <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{saveState.error}</p>}
        {saveState?.success && <p role="status" className="text-sm text-emerald-700 sm:col-span-2">{saveState.success}</p>}
        <button disabled={saving} className="rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">{saving ? "Saving…" : "Save changes"}</button>
      </form>
    </details>
  </div>;
}
