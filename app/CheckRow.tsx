import { Check } from "lucide-react";

function CheckRow({
  checked = false,
  title,
  copy,
  onChange,
}: {
  checked?: boolean;
  title: string;
  copy: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={`mt-0.5 flex size-5 items-center justify-center rounded border ${
          checked ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200"
        }`}
      >
        {checked && <Check className="size-3.5" />}
      </span>
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="text-xs leading-5 text-slate-500">{copy}</span>
      </span>
    </label>
  );
}

export default CheckRow;
