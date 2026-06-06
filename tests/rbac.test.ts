import { describe, it, expect } from "vitest";
import {
  can,
  allowedActions,
  isRole,
  outranks,
  ROLES,
  ACTIONS,
  type Role,
} from "@/lib/rbac";

describe("rbac.can", () => {
  it("grants owners every action", () => {
    expect(can("owner", "user:delete")).toBe(true);
    expect(can("owner", "billing:manage")).toBe(true);
    expect(can("owner", "settings:manage")).toBe(true);
  });

  it("lets admins manage users and settings but not billing", () => {
    expect(can("admin", "user:delete")).toBe(true);
    expect(can("admin", "settings:manage")).toBe(true);
    expect(can("admin", "billing:manage")).toBe(false);
  });

  it("limits members to reading", () => {
    expect(can("member", "user:read")).toBe(true);
    expect(can("member", "billing:read")).toBe(true);
    expect(can("member", "user:invite")).toBe(false);
    expect(can("member", "user:delete")).toBe(false);
  });

  it("limits viewers to user:read only", () => {
    expect(can("viewer", "user:read")).toBe(true);
    expect(can("viewer", "billing:read")).toBe(false);
    expect(can("viewer", "settings:manage")).toBe(false);
  });

  it("every role can read users", () => {
    for (const role of ROLES) {
      expect(can(role as Role, "user:read")).toBe(true);
    }
  });
});

describe("rbac.allowedActions", () => {
  it("returns a sorted, complete list for owner", () => {
    const actions = allowedActions("owner");
    expect(actions).toHaveLength(ACTIONS.length);
    expect(actions).toEqual([...actions].sort());
  });

  it("returns exactly one action for viewer", () => {
    expect(allowedActions("viewer")).toEqual(["user:read"]);
  });
});

describe("rbac.isRole", () => {
  it("accepts valid roles and rejects junk", () => {
    expect(isRole("admin")).toBe(true);
    expect(isRole("owner")).toBe(true);
    expect(isRole("superuser")).toBe(false);
    expect(isRole("")).toBe(false);
  });
});

describe("rbac.outranks", () => {
  it("respects the hierarchy", () => {
    expect(outranks("owner", "admin")).toBe(true);
    expect(outranks("admin", "member")).toBe(true);
    expect(outranks("member", "viewer")).toBe(true);
    expect(outranks("viewer", "member")).toBe(false);
    expect(outranks("admin", "admin")).toBe(false);
  });
});
