import React from 'react'

function CheckRow({
  checked,
  title,
  copy,
}: {
  checked?: boolean;
  title: string;
  copy: string;
}) {
  return (
    <label className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex size-5 items-center justify-center rounded border ${
          checked ? "border-violet-600 bg-violet-50 text-violet-700" : "border-slate-200"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="text-xs leading-5 text-slate-500">{copy}</span>
      </span>
    </label>
  );
}

export default CheckRow
