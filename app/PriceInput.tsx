import { CircleDollarSign } from "lucide-react";

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="mt-2 flex h-11 items-center gap-2 rounded-full border border-slate-200 px-4 focus-within:border-violet-500">
        <CircleDollarSign className="size-4 shrink-0" />
        <input
          type="number"
          min="0"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
        />
      </span>
    </label>
  );
}

export default PriceInput;
