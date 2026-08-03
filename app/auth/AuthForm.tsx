"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "./actions";

type Field = { name: string; label: string; type?: string; autoComplete?: string };

export default function AuthForm({
  action,
  fields,
  submitLabel,
  footer,
  hiddenFields,
}: {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  fields: Field[];
  submitLabel: string;
  footer?: { text: string; label: string; href: string };
  hiddenFields?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-4">
      {Object.entries(hiddenFields ?? {}).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      {fields.map((field) => (
        <label key={field.name} className="block text-sm font-medium text-slate-700">
          {field.label}
          <input
            name={field.name}
            type={field.type ?? "text"}
            autoComplete={field.autoComplete}
            required
            className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
        </label>
      ))}
      {state?.error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{state.error}</p>}
      {state?.success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</p>}
      <button disabled={pending} className="h-12 w-full rounded-xl bg-violet-600 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60">
        {pending ? "Please wait…" : submitLabel}
      </button>
      {footer && <p className="text-center text-sm text-slate-500">{footer.text} <Link className="font-semibold text-violet-700" href={footer.href}>{footer.label}</Link></p>}
    </form>
  );
}
