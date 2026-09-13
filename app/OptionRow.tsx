const defaultOptions = ["Any", "1", "2", "3", "4", "5"];

function OptionRow({
  label,
  options = defaultOptions,
  value = "Any",
  onChange,
}: {
  label: string;
  options?: string[];
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={`min-w-9 rounded-full border px-2 py-2 text-sm ${
              value === option
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-slate-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OptionRow;
