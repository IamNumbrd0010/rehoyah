/**
 * REUSABLE SEARCH INPUT
 */

import { Search, X } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  label = 'Search',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <label className="sr-only">{label}</label>
      <Search
        className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rehoyah-input pl-9 pr-8"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0B2545]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
