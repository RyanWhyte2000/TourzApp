"use client";

import { useActionState } from "react";
import type { DriverService } from "@/lib/driver/types";
import { saveDriverService, setDriverServiceStatus } from "./actions";

const inputClass = "mt-1.5 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500";

export default function ServiceEditor({ service }: { service: DriverService }) {
  const [saveState, saveAction, saving] = useActionState(saveDriverService, undefined);
  const [statusState, statusAction, updating] = useActionState(setDriverServiceStatus, undefined);
  return <div className="mt-5 border-t border-slate-100 pt-4">
    <form action={statusAction}>
      <input type="hidden" name="service_id" value={service.id} />
      <input type="hidden" name="status" value={service.status === "published" ? "archived" : "published"} />
      <button disabled={updating} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">{updating ? "Updating…" : service.status === "published" ? "Pause bookings" : service.status === "draft" ? "Publish service" : "Resume bookings"}</button>
      {statusState?.error && <p role="alert" className="mt-2 text-sm text-rose-700">{statusState.error}</p>}
      {statusState?.success && <p role="status" className="mt-2 text-sm text-emerald-700">{statusState.success}</p>}
    </form>
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-semibold text-emerald-700">Edit service details</summary>
      <form action={saveAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="service_id" value={service.id} />
        <label className="text-sm font-medium sm:col-span-2">Title<input name="title" required minLength={5} maxLength={160} defaultValue={service.title} className={inputClass} /></label>
        <label className="text-sm font-medium sm:col-span-2">Description<textarea name="description" required minLength={30} maxLength={3000} rows={4} defaultValue={service.description ?? ""} className={inputClass} /></label>
        <label className="text-sm font-medium sm:col-span-2">Service area<input name="subtitle" required minLength={3} maxLength={200} defaultValue={service.subtitle ?? ""} className={inputClass} /></label>
        <label className="text-sm font-medium sm:col-span-2">Cover image URL<input name="image_url" type="url" required maxLength={1000} defaultValue={service.image_url} className={inputClass} /></label>
        <label className="text-sm font-medium">Daily price (USD)<input name="price" type="number" min="0.01" max="1000000" step="0.01" required defaultValue={service.price} className={inputClass} /></label>
        <label className="text-sm font-medium">Passenger seats<input name="seats" type="number" min="1" max="30" required defaultValue={service.filter_values.seats ?? 1} className={inputClass} /></label>
        <label className="text-sm font-medium">Luggage capacity<input name="luggage" type="number" min="0" max="30" required defaultValue={service.filter_values.luggage ?? 0} className={inputClass} /></label>
        {saveState?.error && <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{saveState.error}</p>}
        {saveState?.success && <p role="status" className="text-sm text-emerald-700 sm:col-span-2">{saveState.success}</p>}
        <button disabled={saving} className="rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">{saving ? "Saving…" : "Save changes"}</button>
      </form>
    </details>
  </div>;
}
