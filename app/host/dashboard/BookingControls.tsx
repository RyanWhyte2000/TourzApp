"use client";

import { useActionState, useState } from "react";
import type { ProviderType } from "@/lib/providers/types";
import { bookingTransition, dashboardDefinitions, type DashboardBooking } from "@/lib/providers/dashboard";
import { updateProviderBooking } from "./actions";

export default function BookingControls({ booking, type }: { booking: DashboardBooking; type: ProviderType }) {
  const [state, action, pending] = useActionState(updateProviderBooking, undefined);
  const [cancelling, setCancelling] = useState(false);
  const next = booking.status === "pending" ? "confirm" : booking.driver_status === "scheduled" ? "start" : "complete";
  const definition = dashboardDefinitions[type];
  const label = next === "confirm" ? "Confirm booking" : next === "start" ? definition.startAction : definition.completeAction;
  const canAdvance = Boolean(bookingTransition(booking, next));
  const canCancel = Boolean(bookingTransition(booking, "cancel"));
  if (!canAdvance && !canCancel) return null;
  return <form action={action} className="mt-4 border-t border-slate-100 pt-4">
    <input type="hidden" name="booking_id" value={booking.id} />
    <div className="flex flex-wrap items-center gap-3">
      {canAdvance && <button name="action" value={next} disabled={pending} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "Updating…" : label}</button>}
      {canCancel && !cancelling && <button type="button" onClick={() => setCancelling(true)} className="text-sm font-medium text-slate-500">Cancel booking</button>}
    </div>
    {canCancel && cancelling && <div className="mt-3 rounded-xl bg-rose-50 p-4"><p className="text-sm text-rose-800">Cancel this booking? The traveler’s reservation will be marked cancelled. This does not issue a refund.</p><div className="mt-3 flex gap-4"><button name="action" value="cancel" disabled={pending} className="text-sm font-semibold text-rose-700 disabled:opacity-50">Confirm cancellation</button><button type="button" onClick={() => setCancelling(false)} className="text-sm text-slate-600">Keep booking</button></div></div>}
    {state?.error && <p role="alert" className="mt-3 text-sm text-rose-700">{state.error}</p>}
    {state?.success && <p role="status" className="mt-3 text-sm text-emerald-700">{state.success}</p>}
  </form>;
}
