/**
 * QUANTITY CONTROL COMPONENT
 */

import { Minus, Plus } from 'lucide-react';

export default function QuantityControl({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="inline-flex items-center border border-[#DEE2E6] rounded bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="p-2 text-[#0B2545] hover:bg-[#F8F9FA] disabled:opacity-40 cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="px-3 text-sm font-semibold text-[#0B2545] tabular-nums min-w-[2.25rem] text-center">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="p-2 text-[#0B2545] hover:bg-[#F8F9FA] disabled:opacity-40 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
