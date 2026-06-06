/**
 * SaaS metric calculations.
 *
 * Pure functions for the metric cards shown on the dashboard: MRR, ARR,
 * active-user count, ARPU and churn. All functions are unit-tested.
 */

import type { User } from "./users";

/** Sum of seat MRR across all users. */
export function calcMrr(users: readonly User[]): number {
  return users.reduce((sum, u) => sum + u.seatMrr, 0);
}

/** Annual recurring revenue derived from MRR. */
export function calcArr(users: readonly User[]): number {
  return calcMrr(users) * 12;
}

/** Count of users with status "active". */
export function countActiveUsers(users: readonly User[]): number {
  return users.filter((u) => u.status === "active").length;
}

/**
 * Average revenue per (active) user. Returns 0 when there are no active users
 * to avoid division by zero. Rounded to 2 decimal places.
 */
export function calcArpu(users: readonly User[]): number {
  const active = countActiveUsers(users);
  if (active === 0) return 0;
  return round2(calcMrr(users) / active);
}

/**
 * Monthly churn rate as a fraction (0..1): suspended / total.
 * Returns 0 for an empty user list.
 */
export function calcChurnRate(users: readonly User[]): number {
  if (users.length === 0) return 0;
  const suspended = users.filter((u) => u.status === "suspended").length;
  return round2(suspended / users.length);
}

export interface MetricsSummary {
  mrr: number;
  arr: number;
  activeUsers: number;
  arpu: number;
  churnRate: number;
}

/** Convenience aggregator returning every headline metric at once. */
export function summarize(users: readonly User[]): MetricsSummary {
  return {
    mrr: calcMrr(users),
    arr: calcArr(users),
    activeUsers: countActiveUsers(users),
    arpu: calcArpu(users),
    churnRate: calcChurnRate(users),
  };
}

/** Formats a USD amount with no decimals, e.g. 1234 -> "$1,234". */
export function formatUsd(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

/** Formats a fraction as a percentage, e.g. 0.17 -> "17%". */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
