/**
 * PAGINATION COMPONENT
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-between pt-4 border-t border-[#EAECEF]" aria-label="Pagination">
      <p className="text-xs text-[#6B7280] tabular-nums">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#DEE2E6] rounded bg-white text-[#0B2545] disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[#DEE2E6] rounded bg-white text-[#0B2545] disabled:opacity-40"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
}
