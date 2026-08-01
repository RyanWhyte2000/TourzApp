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
    <div className="flex min-h-20 items-center gap-3 px-5 py-4">
      <span className="text-slate-900">{icon}</span>
      <div className="min-w-0 flex-1">
        <label className="text-xs text-slate-500">{label}</label>
        <input
          type={type}
          value={value}
          min={min}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

export default SearchField;
