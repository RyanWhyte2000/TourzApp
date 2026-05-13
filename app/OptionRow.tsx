import React from 'react'
const bedroomOptions = ["Any", "1", "2", "3", "4", "5"];

function  OptionRow({ label }: { label: string }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {bedroomOptions.map((option) => (
          <button
            key={option}
            className={`size-9 rounded-full border text-sm ${
              option === "Any"
                ? "border-violet-600 bg-violet-50 text-violet-700"
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

export default OptionRow
