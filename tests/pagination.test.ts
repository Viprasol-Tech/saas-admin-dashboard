import { describe, it, expect } from "vitest";
import {
  paginate,
  totalPages,
  clampPage,
  pageRange,
} from "@/lib/pagination";

const items = Array.from({ length: 23 }, (_, i) => i + 1);

describe("pagination.totalPages", () => {
  it("rounds up and never goes below 1", () => {
    expect(totalPages(23, 10)).toBe(3);
    expect(totalPages(20, 10)).toBe(2);
    expect(totalPages(0, 10)).toBe(1);
    expect(totalPages(5, 0)).toBe(1);
  });
});

describe("pagination.clampPage", () => {
  it("clamps into the valid range", () => {
    expect(clampPage(0, 23, 10)).toBe(1);
    expect(clampPage(99, 23, 10)).toBe(3);
    expect(clampPage(2, 23, 10)).toBe(2);
    expect(clampPage(Number.NaN, 23, 10)).toBe(1);
  });
});

describe("pagination.paginate", () => {
  it("returns the first page with correct bounds", () => {
    const p = paginate(items, 1, 10);
    expect(p.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(p.page).toBe(1);
    expect(p.totalPages).toBe(3);
    expect(p.hasPrev).toBe(false);
    expect(p.hasNext).toBe(true);
    expect(p.from).toBe(1);
    expect(p.to).toBe(10);
  });

  it("returns a partial last page", () => {
    const p = paginate(items, 3, 10);
    expect(p.items).toEqual([21, 22, 23]);
    expect(p.hasNext).toBe(false);
    expect(p.from).toBe(21);
    expect(p.to).toBe(23);
  });

  it("clamps out-of-range pages", () => {
    expect(paginate(items, 99, 10).page).toBe(3);
    expect(paginate(items, -5, 10).page).toBe(1);
  });

  it("handles an empty list", () => {
    const p = paginate([], 1, 10);
    expect(p.items).toEqual([]);
    expect(p.total).toBe(0);
    expect(p.totalPages).toBe(1);
    expect(p.from).toBe(0);
    expect(p.to).toBe(0);
  });

  it("does not mutate the input", () => {
    const copy = [...items];
    paginate(items, 2, 5);
    expect(items).toEqual(copy);
  });
});

describe("pagination.pageRange", () => {
  it("returns a single token for tiny totals", () => {
    expect(pageRange(1, 1)).toEqual([1]);
  });

  it("inserts ellipses around a windowed current page", () => {
    expect(pageRange(5, 10, 1)).toEqual([1, "…", 4, 5, 6, "…", 10]);
  });

  it("omits the left ellipsis near the start", () => {
    expect(pageRange(2, 10, 1)).toEqual([1, 2, 3, "…", 10]);
  });

  it("omits the right ellipsis near the end", () => {
    expect(pageRange(9, 10, 1)).toEqual([1, "…", 8, 9, 10]);
  });
});
