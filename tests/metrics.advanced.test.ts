import { describe, it, expect } from "vitest";
import {
  roleDistribution,
  statusBreakdown,
  calcActivationRate,
  calcRetentionRate,
  calcLtv,
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
  user({ id: "1", role: "owner", status: "active", seatMrr: 100 }),
  user({ id: "2", role: "admin", status: "active", seatMrr: 50 }),
  user({ id: "3", role: "member", status: "invited", seatMrr: 0 }),
  user({ id: "4", role: "viewer", status: "suspended", seatMrr: 0 }),
];

describe("metrics.roleDistribution", () => {
  it("counts each role and zero-fills the rest", () => {
    const d = roleDistribution(sample);
    expect(d.owner).toBe(1);
    expect(d.admin).toBe(1);
    expect(d.member).toBe(1);
    expect(d.viewer).toBe(1);
  });

  it("zero-fills for an empty list", () => {
    const d = roleDistribution([]);
    expect(d.owner).toBe(0);
    expect(d.viewer).toBe(0);
  });
});

describe("metrics.statusBreakdown", () => {
  it("counts active, invited and suspended", () => {
    const s = statusBreakdown(sample);
    expect(s.active).toBe(2);
    expect(s.invited).toBe(1);
    expect(s.suspended).toBe(1);
  });
});

describe("metrics.calcActivationRate", () => {
  it("is active over (active + invited)", () => {
    // 2 active, 1 invited -> 2/3 = 0.67
    expect(calcActivationRate(sample)).toBe(0.67);
  });

  it("returns 0 when nobody is activatable", () => {
    expect(calcActivationRate([user({ status: "suspended" })])).toBe(0);
  });
});

describe("metrics.calcRetentionRate", () => {
  it("is the complement of churn", () => {
    // churn = 1/4 = 0.25 -> retention 0.75
    expect(calcRetentionRate(sample)).toBe(0.75);
  });

  it("is 1 for an empty list", () => {
    expect(calcRetentionRate([])).toBe(1);
  });
});

describe("metrics.calcLtv", () => {
  it("is ARPU / churn when churn is non-zero", () => {
    // ARPU = 150/2 = 75, churn = 0.25 -> 300
    expect(calcLtv(sample)).toBe(300);
  });

  it("falls back to a 36-month estimate when churn is 0", () => {
    const noChurn: User[] = [
      user({ status: "active", seatMrr: 100 }),
      user({ status: "active", seatMrr: 100 }),
    ];
    // ARPU = 100, churn 0 -> 100 * 36
    expect(calcLtv(noChurn)).toBe(3600);
  });

  it("is 0 when there is no revenue and no churn", () => {
    expect(calcLtv([user({ status: "active", seatMrr: 0 })])).toBe(0);
  });
});
