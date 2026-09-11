"use client";

import { useActionState } from "react";
import { providerDefinitions, type ProviderProfile, type ProviderType } from "@/lib/providers/types";
import { saveProviderProfile } from "./actions";

const inputClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

export default function ProviderProfileForm({ type, profile }: { type: ProviderType; profile: ProviderProfile | null }) {
  const [state, action, pending] = useActionState(saveProviderProfile, undefined);
  const definition = providerDefinitions[type];
  return <form action={action} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <input type="hidden" name="provider_type" value={type} />
    <h2 className="text-xl font-bold">{profile ? "Profile details" : "Set up your profile"}</h2>
    <p className="mt-2 text-sm text-slate-500">{profile ? "Update your business information below." : "Your account can have one provider type. Saving this profile sets your account’s provider type."}</p>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">{definition.nameLabel}<input name="display_name" required minLength={2} maxLength={160} defaultValue={profile?.display_name} className={inputClass} /></label>
      <label className="text-sm font-medium">Location or service area<input name="location" required minLength={2} maxLength={200} defaultValue={profile?.location} placeholder="Montego Bay, Jamaica" className={inputClass} /></label>
      <label className="text-sm font-medium sm:col-span-2">About your business<textarea name="description" rows={4} maxLength={2000} defaultValue={profile?.description} placeholder={definition.description} className="mt-2 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100" /></label>
      {definition.fields.map((field) => <label key={field.name} className="text-sm font-medium">{field.label}<input name={field.name} maxLength={300} defaultValue={profile?.details[field.name] ?? ""} placeholder={field.placeholder} className={inputClass} /></label>)}
      <label className="text-sm font-medium">Contact email<input name="contact_email" type="email" maxLength={254} defaultValue={profile?.contact_email} className={inputClass} /></label>
      <label className="text-sm font-medium">Phone<input name="phone" type="tel" maxLength={40} defaultValue={profile?.phone} className={inputClass} /></label>
      <label className="text-sm font-medium sm:col-span-2">Website (optional)<input name="website" type="url" maxLength={500} defaultValue={profile?.website} placeholder="https://" className={inputClass} /></label>
    </div>
    {state?.error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{state.error}</p>}
    {state?.success && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{state.success}</p>}
    <button disabled={pending} className="mt-6 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-50">{pending ? "Saving…" : profile ? "Save profile" : "Create provider profile"}</button>
  </form>;
}
