/**
 * Pure pagination helpers.
 *
 * Framework-agnostic slicing + page-math used by the users table and any other
 * list view. Page numbers are 1-based and always clamped into range so the UI
 * can never request an out-of-bounds page.
 */

export interface Page<T> {
  /** The items on the current page. */
  items: T[];
  /** The 1-based current page number (clamped into range). */
  page: number;
  /** Items per page. */
  pageSize: number;
  /** Total number of items across all pages. */
  total: number;
  /** Total number of pages (at least 1). */
  totalPages: number;
  /** Whether a previous page exists. */
  hasPrev: boolean;
  /** Whether a next page exists. */
  hasNext: boolean;
  /** 1-based index of the first item shown (0 when empty). */
  from: number;
  /** 1-based index of the last item shown (0 when empty). */
  to: number;
}

/** Total number of pages for `total` items at `pageSize` (never below 1). */
export function totalPages(total: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Clamps a requested page into the valid 1..totalPages range. */
export function clampPage(page: number, total: number, pageSize: number): number {
  const max = totalPages(total, pageSize);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(Math.floor(page), max);
}

/**
 * Slices `items` into a page. Out-of-range pages and non-positive page sizes
 * are clamped rather than throwing, so callers can pass user input directly.
 */
export function paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): Page<T> {
  const size = pageSize > 0 ? Math.floor(pageSize) : items.length || 1;
  const total = items.length;
  const pages = totalPages(total, size);
  const current = clampPage(page, total, size);
  const start = (current - 1) * size;
  const slice = items.slice(start, start + size);

  return {
    items: [...slice],
    page: current,
    pageSize: size,
    total,
    totalPages: pages,
    hasPrev: current > 1,
    hasNext: current < pages,
    from: total === 0 ? 0 : start + 1,
    to: total === 0 ? 0 : start + slice.length,
  };
}

/**
 * Returns a compact list of page tokens for a pager UI, e.g.
 * `[1, "…", 4, 5, 6, "…", 20]`. Always includes the first and last page and a
 * window of `siblings` pages either side of the current page.
 */
export function pageRange(
  current: number,
  total: number,
  siblings = 1,
): (number | "…")[] {
  if (total <= 1) return [1];
  const first = 1;
  const last = total;
  const start = Math.max(first, current - siblings);
  const end = Math.min(last, current + siblings);

  const out: (number | "…")[] = [];
  if (start > first) {
    out.push(first);
    if (start > first + 1) out.push("…");
  }
  for (let p = start; p <= end; p++) out.push(p);
  if (end < last) {
    if (end < last - 1) out.push("…");
    out.push(last);
  }
  return out;
}
