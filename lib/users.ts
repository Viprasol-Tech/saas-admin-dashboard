/**
 * In-memory user store plus search/filter helpers.
 *
 * This is a deterministic fake data layer so the dashboard renders something
 * realistic without a database. The helpers (`searchUsers`, `filterByRole`,
 * `sortUsers`) are pure functions and are unit-tested.
 */

import type { Role } from "./rbac";

export type UserStatus = "active" | "invited" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  /** ISO date string of when the account was created. */
  createdAt: string;
  /** Monthly recurring revenue contributed by this user's seat, in USD. */
  seatMrr: number;
}

export const USERS: readonly User[] = [
  {
    id: "u_001",
    name: "Ada Lovelace",
    email: "ada@viprasol.dev",
    role: "owner",
    status: "active",
    createdAt: "2024-01-12",
    seatMrr: 99,
  },
  {
    id: "u_002",
    name: "Grace Hopper",
    email: "grace@viprasol.dev",
    role: "admin",
    status: "active",
    createdAt: "2024-02-03",
    seatMrr: 49,
  },
  {
    id: "u_003",
    name: "Alan Turing",
    email: "alan@viprasol.dev",
    role: "member",
    status: "active",
    createdAt: "2024-03-21",
    seatMrr: 29,
  },
  {
    id: "u_004",
    name: "Katherine Johnson",
    email: "katherine@viprasol.dev",
    role: "member",
    status: "invited",
    createdAt: "2024-05-09",
    seatMrr: 0,
  },
  {
    id: "u_005",
    name: "Linus Torvalds",
    email: "linus@viprasol.dev",
    role: "viewer",
    status: "suspended",
    createdAt: "2024-06-18",
    seatMrr: 0,
  },
  {
    id: "u_006",
    name: "Margaret Hamilton",
    email: "margaret@viprasol.dev",
    role: "admin",
    status: "active",
    createdAt: "2024-07-30",
    seatMrr: 49,
  },
];

/** Returns a fresh copy of the seed users. */
export function getUsers(): User[] {
  return USERS.map((u) => ({ ...u }));
}

/**
 * Case-insensitive search across name and email.
 * An empty or whitespace-only query returns all users unchanged.
 */
export function searchUsers(users: readonly User[], query: string): User[] {
  const q = query.trim().toLowerCase();
  if (q === "") return [...users];
  return users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
  );
}

/** Filters by a single role, or returns all users when `role` is "all". */
export function filterByRole(
  users: readonly User[],
  role: Role | "all",
): User[] {
  if (role === "all") return [...users];
  return users.filter((u) => u.role === role);
}

/** Filters by status, or returns all users when `status` is "all". */
export function filterByStatus(
  users: readonly User[],
  status: UserStatus | "all",
): User[] {
  if (status === "all") return [...users];
  return users.filter((u) => u.status === status);
}

export type SortKey = "name" | "createdAt" | "seatMrr";

/** Stable sort by the given key. Strings ascending, numbers descending. */
export function sortUsers(users: readonly User[], key: SortKey): User[] {
  const copy = [...users];
  copy.sort((a, b) => {
    if (key === "seatMrr") return b.seatMrr - a.seatMrr;
    if (key === "createdAt") return a.createdAt.localeCompare(b.createdAt);
    return a.name.localeCompare(b.name);
  });
  return copy;
}
