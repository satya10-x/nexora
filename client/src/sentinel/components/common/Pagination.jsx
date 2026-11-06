import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1 && total <= limit) {
    return null;
  }

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/45 py-3 ${className}`}>
      <div>
        Showing <span className="font-medium text-white/85">{startItem}</span> to{' '}
        <span className="font-medium text-white/85">{endItem}</span> of{' '}
        <span className="font-medium text-white/85">{total}</span> items
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        <span className="px-2 font-medium text-white/70">
          Page {page} of {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

