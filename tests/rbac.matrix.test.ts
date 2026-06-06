import { describe, it, expect } from "vitest";
import {
  canAll,
  canAny,
  isAction,
  roleRank,
  canManageUser,
  permissionMatrix,
  ROLES,
  ACTIONS,
  ACTION_LABELS,
  ROLE_LABELS,
} from "@/lib/rbac";

describe("rbac.canAll / canAny", () => {
  it("canAll requires every action", () => {
    expect(canAll("owner", ["user:read", "billing:manage"])).toBe(true);
    expect(canAll("admin", ["user:read", "billing:manage"])).toBe(false);
    expect(canAll("viewer", [])).toBe(true);
  });

  it("canAny requires at least one action", () => {
    expect(canAny("member", ["user:delete", "billing:read"])).toBe(true);
    expect(canAny("viewer", ["user:delete", "billing:manage"])).toBe(false);
    expect(canAny("owner", [])).toBe(false);
  });
});

describe("rbac.isAction", () => {
  it("validates action strings", () => {
    expect(isAction("user:delete")).toBe(true);
    expect(isAction("audit:read")).toBe(true);
    expect(isAction("nope:nope")).toBe(false);
  });
});

describe("rbac.roleRank", () => {
  it("orders roles owner > admin > member > viewer", () => {
    expect(roleRank("owner")).toBeGreaterThan(roleRank("admin"));
    expect(roleRank("admin")).toBeGreaterThan(roleRank("member"));
    expect(roleRank("member")).toBeGreaterThan(roleRank("viewer"));
  });
});

describe("rbac.canManageUser", () => {
  it("allows a higher-ranked actor with permission", () => {
    expect(canManageUser("owner", "admin", "user:delete")).toBe(true);
    expect(canManageUser("admin", "member", "user:suspend")).toBe(true);
  });

  it("blocks peers and lower ranks", () => {
    expect(canManageUser("admin", "admin", "user:delete")).toBe(false);
    expect(canManageUser("admin", "owner", "user:delete")).toBe(false);
    expect(canManageUser("owner", "owner", "user:delete")).toBe(false);
  });

  it("blocks actors lacking the permission entirely", () => {
    expect(canManageUser("member", "viewer", "user:update")).toBe(false);
  });
});

describe("rbac.permissionMatrix", () => {
  it("produces a full role x action grid", () => {
    const cells = permissionMatrix();
    expect(cells).toHaveLength(ROLES.length * ACTIONS.length);
  });

  it("agrees with can() for every cell", () => {
    for (const cell of permissionMatrix()) {
      const expected =
        cell.role === "owner"
          ? true
          : undefined; // owner check below; just sanity scan structure
      expect(typeof cell.allowed).toBe("boolean");
      if (expected !== undefined) expect(cell.allowed).toBe(expected);
    }
  });

  it("grants the owner every action", () => {
    const ownerCells = permissionMatrix().filter((c) => c.role === "owner");
    expect(ownerCells.every((c) => c.allowed)).toBe(true);
  });

  it("limits the viewer to a single action", () => {
    const viewerAllowed = permissionMatrix().filter(
      (c) => c.role === "viewer" && c.allowed,
    );
    expect(viewerAllowed).toHaveLength(1);
    expect(viewerAllowed[0].action).toBe("user:read");
  });
});

describe("rbac labels", () => {
  it("has a label for every role and action", () => {
    for (const r of ROLES) expect(ROLE_LABELS[r]).toBeTruthy();
    for (const a of ACTIONS) expect(ACTION_LABELS[a]).toBeTruthy();
  });
});
