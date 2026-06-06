import { describe, it, expect, beforeEach } from "vitest";
import {
  UserStore,
  UserStoreError,
  createUserStore,
  isValidEmail,
} from "@/lib/userStore";

describe("userStore.isValidEmail", () => {
  it("accepts plausible addresses and rejects junk", () => {
    expect(isValidEmail("a@b.com")).toBe(true);
    expect(isValidEmail("  spaced@viprasol.dev  ")).toBe(true);
    expect(isValidEmail("nope")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("UserStore CRUD", () => {
  let store: UserStore;

  beforeEach(() => {
    store = createUserStore();
  });

  it("seeds from the default user list", () => {
    expect(store.count()).toBeGreaterThan(0);
    expect(store.list().length).toBe(store.count());
  });

  it("returns defensive copies from list()", () => {
    const a = store.list();
    a[0].name = "mutated";
    expect(store.list()[0].name).not.toBe("mutated");
  });

  it("creates a user with generated id and defaults", () => {
    const before = store.count();
    const u = store.create({
      name: "New Person",
      email: "new@viprasol.dev",
      role: "member",
    });
    expect(u.id).toMatch(/^u_\d{3}$/);
    expect(u.status).toBe("invited");
    expect(u.seatMrr).toBe(0);
    expect(store.count()).toBe(before + 1);
  });

  it("rejects blank names", () => {
    expect(() =>
      store.create({ name: "   ", email: "x@y.com", role: "member" }),
    ).toThrow(UserStoreError);
  });

  it("rejects invalid emails", () => {
    expect(() =>
      store.create({ name: "X", email: "bad", role: "member" }),
    ).toThrow(/Invalid email/);
  });

  it("rejects duplicate emails case-insensitively", () => {
    store.create({ name: "A", email: "dup@viprasol.dev", role: "member" });
    expect(() =>
      store.create({ name: "B", email: "DUP@viprasol.dev", role: "viewer" }),
    ).toThrow(/already in use/);
  });

  it("gets by id and returns undefined for misses", () => {
    const first = store.list()[0];
    expect(store.get(first.id)?.id).toBe(first.id);
    expect(store.get("nope")).toBeUndefined();
  });

  it("updates a user and trims fields", () => {
    const first = store.list()[0];
    const updated = store.update(first.id, { name: "  Renamed  " });
    expect(updated.name).toBe("Renamed");
    expect(updated.id).toBe(first.id);
  });

  it("throws updating a missing user", () => {
    expect(() => store.update("nope", { name: "X" })).toThrow(/No such user/);
  });

  it("prevents email collisions on update", () => {
    const [a, b] = store.list();
    expect(() => store.update(a.id, { email: b.email })).toThrow(
      /already in use/,
    );
  });

  it("allows keeping the same email on update", () => {
    const a = store.list()[0];
    const updated = store.update(a.id, { email: a.email, name: "Same Email" });
    expect(updated.name).toBe("Same Email");
  });

  it("removes a user and reports success", () => {
    const first = store.list()[0];
    expect(store.remove(first.id)).toBe(true);
    expect(store.get(first.id)).toBeUndefined();
    expect(store.remove("nope")).toBe(false);
  });

  it("setStatus flips a single user's status", () => {
    const first = store.list()[0];
    expect(store.setStatus(first.id, "suspended").status).toBe("suspended");
  });
});

describe("UserStore bulk actions", () => {
  let store: UserStore;

  beforeEach(() => {
    store = createUserStore();
  });

  it("bulkRemove deletes many and returns the count", () => {
    const ids = store.list().slice(0, 2).map((u) => u.id);
    const before = store.count();
    expect(store.bulkRemove(ids)).toBe(2);
    expect(store.count()).toBe(before - 2);
  });

  it("bulkRemove ignores unknown ids", () => {
    expect(store.bulkRemove(["nope1", "nope2"])).toBe(0);
  });

  it("bulkSetStatus updates many and returns the count", () => {
    const ids = store.list().slice(0, 3).map((u) => u.id);
    expect(store.bulkSetStatus(ids, "active")).toBe(3);
    for (const id of ids) expect(store.get(id)?.status).toBe("active");
  });

  it("bulkSetRole assigns a role to many", () => {
    const ids = store.list().slice(0, 2).map((u) => u.id);
    expect(store.bulkSetRole(ids, "viewer")).toBe(2);
    for (const id of ids) expect(store.get(id)?.role).toBe("viewer");
  });
});
