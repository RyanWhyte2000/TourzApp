"use client";

import { useState } from "react";

export default function PlanActions({ path }: { path: string }) {
  const [message, setMessage] = useState("");
  const [manualLink, setManualLink] = useState("");
  const button = "rounded-full border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100";
  async function copy() {
    const url = new URL(path, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Plan link copied. Suggestions and prices may change when reopened.");
    } catch {
      setManualLink(url);
      setMessage("Copy the link below to share your plan.");
    }
  }
  return <div className="mt-6">
    <div className="flex flex-wrap gap-2">
      <button type="button" className={button} onClick={copy}>Copy plan link</button>
      <button type="button" className={button} onClick={() => {
        const url = new URL(path, window.location.origin).href;
        window.open(`https://wa.me/?text=${encodeURIComponent(`Plan a trip with me on Tourz: ${url}`)}`, "_blank", "noopener,noreferrer");
      }}>Share on WhatsApp</button>
      <button type="button" className={button} onClick={() => window.print()}>Print / save PDF</button>
    </div>
    <p role="status" className="mt-2 text-sm text-slate-600">{message}</p>
    {manualLink && <input aria-label="Shareable plan link" readOnly value={manualLink} onFocus={(event) => event.target.select()} className="mt-2 w-full rounded-lg border p-3" />}
  </div>;
}
