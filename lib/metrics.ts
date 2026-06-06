/**
 * SaaS metric calculations.
 *
 * Pure functions for the metric cards shown on the dashboard: MRR, ARR,
 * active-user count, ARPU and churn. All functions are unit-tested.
 */

import type { User, UserStatus } from "./users";
import { ROLES, type Role } from "./rbac";

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

// ---- Distribution / breakdown metrics -------------------------------------

/** Count of users grouped by role (every role present, zero-filled). */
export function roleDistribution(
  users: readonly User[],
): Record<Role, number> {
  const out = {} as Record<Role, number>;
  for (const r of ROLES) out[r] = 0;
  for (const u of users) out[u.role] += 1;
  return out;
}

/** Count of users grouped by status (every status present, zero-filled). */
export function statusBreakdown(
  users: readonly User[],
): Record<UserStatus, number> {
  const out: Record<UserStatus, number> = {
    active: 0,
    invited: 0,
    suspended: 0,
  };
  for (const u of users) out[u.status] += 1;
  return out;
}

/**
 * Activation rate: active / (active + invited), as a fraction (0..1).
 * Suspended users are excluded from the denominator. Returns 0 when there are
 * no activatable users.
 */
export function calcActivationRate(users: readonly User[]): number {
  const active = countActiveUsers(users);
  const invited = users.filter((u) => u.status === "invited").length;
  const denom = active + invited;
  if (denom === 0) return 0;
  return round2(active / denom);
}

/**
 * Retention rate: 1 - churnRate. Always within [0, 1].
 */
export function calcRetentionRate(users: readonly User[]): number {
  return round2(1 - calcChurnRate(users));
}

/** Lifetime value estimate: ARPU / churnRate, capped when churn is 0. */
export function calcLtv(users: readonly User[]): number {
  const churn = calcChurnRate(users);
  const arpu = calcArpu(users);
  if (churn === 0) return arpu === 0 ? 0 : round2(arpu * 36);
  return round2(arpu / churn);
}
