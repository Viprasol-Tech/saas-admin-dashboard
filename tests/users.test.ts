import { describe, it, expect } from "vitest";
import {
  getUsers,
  searchUsers,
  filterByRole,
  filterByStatus,
  sortUsers,
} from "@/lib/users";

describe("users.getUsers", () => {
  it("returns a non-empty defensive copy", () => {
    const a = getUsers();
    const b = getUsers();
    expect(a.length).toBeGreaterThan(0);
    a[0].name = "mutated";
    expect(b[0].name).not.toBe("mutated");
  });
});

describe("users.searchUsers", () => {
  const users = getUsers();

  it("returns all users for an empty query", () => {
    expect(searchUsers(users, "")).toHaveLength(users.length);
    expect(searchUsers(users, "   ")).toHaveLength(users.length);
  });

  it("matches on name case-insensitively", () => {
    const result = searchUsers(users, "ada");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Ada Lovelace");
  });

  it("matches on email", () => {
    const result = searchUsers(users, "grace@viprasol.dev");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("u_002");
  });

  it("returns empty for no match", () => {
    expect(searchUsers(users, "zzzznotreal")).toHaveLength(0);
  });
});

describe("users.filterByRole", () => {
  const users = getUsers();

  it("returns all for 'all'", () => {
    expect(filterByRole(users, "all")).toHaveLength(users.length);
  });

  it("filters to a single role", () => {
    const admins = filterByRole(users, "admin");
    expect(admins.length).toBeGreaterThan(0);
    expect(admins.every((u) => u.role === "admin")).toBe(true);
  });
});

describe("users.filterByStatus", () => {
  const users = getUsers();

  it("filters suspended users", () => {
    const suspended = filterByStatus(users, "suspended");
    expect(suspended.every((u) => u.status === "suspended")).toBe(true);
  });
});

describe("users.sortUsers", () => {
  const users = getUsers();

  it("sorts by name ascending", () => {
    const sorted = sortUsers(users, "name");
    const names = sorted.map((u) => u.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("sorts by seatMrr descending", () => {
    const sorted = sortUsers(users, "seatMrr");
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].seatMrr).toBeGreaterThanOrEqual(sorted[i].seatMrr);
    }
  });

  it("does not mutate the input", () => {
    const before = users.map((u) => u.id);
    sortUsers(users, "name");
    expect(users.map((u) => u.id)).toEqual(before);
  });
});
