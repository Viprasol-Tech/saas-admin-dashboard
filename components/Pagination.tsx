"use client";

import { pageRange } from "@/lib/pagination";

export interface PaginationProps {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
}

/** A compact pager with prev/next and windowed page buttons. */
export function Pagination({
  page,
  totalPages,
  from,
  to,
  total,
  onPageChange,
}: PaginationProps) {
  const tokens = pageRange(page, totalPages, 1);

  return (
    <div
      data-testid="pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 text-sm dark:border-gray-700 sm:flex-row"
    >
      <span className="text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium">{from}</span>–
        <span className="font-medium">{to}</span> of{" "}
        <span className="font-medium">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-gray-300 px-2.5 py-1 text-gray-600 enabled:hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:enabled:hover:bg-gray-800"
        >
          Prev
        </button>
        {tokens.map((t, i) =>
          t === "…" ? (
            <span
              key={`gap-${i}`}
              className="px-2 text-gray-400 dark:text-gray-500"
            >
              …
            </span>
          ) : (
            <button
              key={t}
              type="button"
              aria-current={t === page ? "page" : undefined}
              onClick={() => onPageChange(t)}
              className={
                t === page
                  ? "rounded-md bg-brand px-3 py-1 font-medium text-white"
                  : "rounded-md border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              }
            >
              {t}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-gray-300 px-2.5 py-1 text-gray-600 enabled:hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:enabled:hover:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
