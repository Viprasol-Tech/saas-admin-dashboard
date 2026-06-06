import { describe, it, expect } from "vitest";
import {
  calcMrr,
  calcArr,
  countActiveUsers,
  calcArpu,
  calcChurnRate,
  summarize,
  formatUsd,
  formatPercent,
} from "@/lib/metrics";
import type { User } from "@/lib/users";

function user(partial: Partial<User>): User {
  return {
    id: "x",
    name: "Test",
    email: "t@example.com",
    role: "member",
    status: "active",
    createdAt: "2024-01-01",
    seatMrr: 0,
    ...partial,
  };
}

const sample: User[] = [
  user({ id: "1", status: "active", seatMrr: 100 }),
  user({ id: "2", status: "active", seatMrr: 50 }),
  user({ id: "3", status: "invited", seatMrr: 0 }),
  user({ id: "4", status: "suspended", seatMrr: 0 }),
];

describe("metrics.calcMrr / calcArr", () => {
  it("sums seat MRR and derives ARR", () => {
    expect(calcMrr(sample)).toBe(150);
    expect(calcArr(sample)).toBe(1800);
  });

  it("handles empty input", () => {
    expect(calcMrr([])).toBe(0);
    expect(calcArr([])).toBe(0);
  });
});

describe("metrics.countActiveUsers", () => {
  it("counts only active", () => {
    expect(countActiveUsers(sample)).toBe(2);
  });
});

describe("metrics.calcArpu", () => {
  it("divides MRR by active users", () => {
    expect(calcArpu(sample)).toBe(75);
  });

  it("returns 0 when no active users", () => {
    expect(calcArpu([user({ status: "suspended", seatMrr: 99 })])).toBe(0);
  });
});

describe("metrics.calcChurnRate", () => {
  it("is suspended over total", () => {
    expect(calcChurnRate(sample)).toBe(0.25);
  });

  it("returns 0 for empty list", () => {
    expect(calcChurnRate([])).toBe(0);
  });
});

describe("metrics.summarize", () => {
  it("aggregates everything", () => {
    expect(summarize(sample)).toEqual({
      mrr: 150,
      arr: 1800,
      activeUsers: 2,
      arpu: 75,
      churnRate: 0.25,
    });
  });
});

describe("metrics formatting", () => {
  it("formats USD with thousands separators", () => {
    expect(formatUsd(1234)).toBe("$1,234");
    expect(formatUsd(0)).toBe("$0");
  });

  it("formats percentages", () => {
    expect(formatPercent(0.25)).toBe("25%");
    expect(formatPercent(0.171)).toBe("17%");
  });
});
