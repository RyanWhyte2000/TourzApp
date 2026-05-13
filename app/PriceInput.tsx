import { CircleDollarSign } from 'lucide-react';
import React from 'react'

function PriceInput({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="mt-2 flex h-11 items-center gap-2 rounded-full border border-slate-200 px-4">
        <CircleDollarSign className="size-4" />
        <span className="text-sm font-medium">{value}</span>
      </span>
    </label>
  );
}

export default PriceInput
