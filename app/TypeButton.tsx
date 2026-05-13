import React from 'react'

function TypeButton({
  active,
  icon,
  label,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className={`flex h-20 flex-col items-start justify-center gap-2 rounded-xl border px-4 text-left text-sm font-semibold ${
        active
          ? "border-violet-600 bg-violet-50 text-violet-700"
          : "border-slate-200 bg-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default TypeButton
