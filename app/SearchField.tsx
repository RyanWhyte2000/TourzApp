import React from "react";

function SearchField({
  label,
  value,
  onChange,
  icon,
  type = "text",
  placeholder,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  type?: "text" | "date" | "time" | "number";
  placeholder?: string;
  min?: number;
}) {
  return (
    <div className="min-h-20 min-w-0 px-5 py-4">
      <label className="block text-xs leading-4 text-slate-500">{label}</label>
      <div className="mt-1 flex min-w-0 items-center gap-3">
        <span className="flex size-4 shrink-0 items-center justify-center text-slate-900" aria-hidden="true">{icon}</span>
        <input
          type={type}
          value={value}
          min={min}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

export default SearchField;
