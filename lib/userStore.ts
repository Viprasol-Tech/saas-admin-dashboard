/**
 * In-memory user CRUD store.
 *
 * A small, deterministic store that wraps the seed users with create / read /
 * update / delete operations plus bulk actions. It is intentionally framework
 * agnostic (no React) so it can be unit-tested in isolation and reused on a
 * server. IDs are generated sequentially so tests stay deterministic.
 */

import { getUsers, type User, type UserStatus } from "./users";
import { isRole, type Role } from "./rbac";

export interface CreateUserInput {
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  seatMrr?: number;
  createdAt?: string;
}

export type UpdateUserInput = Partial<Omit<User, "id">>;

export class UserStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserStoreError";
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns true for a syntactically plausible email address. */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export class UserStore {
  private users: User[];
  private seq: number;

  constructor(seed: readonly User[] = getUsers()) {
    this.users = seed.map((u) => ({ ...u }));
    this.seq = this.users.length;
  }

  /** Snapshot of all users (defensive copy). */
  list(): User[] {
    return this.users.map((u) => ({ ...u }));
  }

  /** Number of users currently in the store. */
  count(): number {
    return this.users.length;
  }

  /** Find a user by id, or `undefined`. */
  get(id: string): User | undefined {
    const found = this.users.find((u) => u.id === id);
    return found ? { ...found } : undefined;
  }

  /** True when an active user already has this (case-insensitive) email. */
  hasEmail(email: string): boolean {
    const e = email.trim().toLowerCase();
    return this.users.some((u) => u.email.toLowerCase() === e);
  }

  /**
   * Creates a new user. Throws `UserStoreError` on invalid input or a
   * duplicate email.
   */
  create(input: CreateUserInput): User {
    const name = input.name.trim();
    const email = input.email.trim();
    if (name === "") throw new UserStoreError("Name is required.");
    if (!isValidEmail(email)) throw new UserStoreError("Invalid email address.");
    if (!isRole(input.role)) throw new UserStoreError("Invalid role.");
    if (this.hasEmail(email))
      throw new UserStoreError(`Email already in use: ${email}`);

    this.seq += 1;
    const user: User = {
      id: `u_${String(this.seq).padStart(3, "0")}`,
      name,
      email,
      role: input.role,
      status: input.status ?? "invited",
      createdAt: input.createdAt ?? "2025-01-01",
      seatMrr: input.seatMrr ?? 0,
    };
    this.users.push(user);
    return { ...user };
  }

  /**
   * Updates an existing user. Throws `UserStoreError` if the user does not
   * exist or an update would collide with another user's email.
   */
  update(id: string, patch: UpdateUserInput): User {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new UserStoreError(`No such user: ${id}`);

    if (patch.email !== undefined) {
      const email = patch.email.trim();
      if (!isValidEmail(email))
        throw new UserStoreError("Invalid email address.");
      const collision = this.users.some(
        (u) => u.id !== id && u.email.toLowerCase() === email.toLowerCase(),
      );
      if (collision)
        throw new UserStoreError(`Email already in use: ${email}`);
    }
    if (patch.role !== undefined && !isRole(patch.role))
      throw new UserStoreError("Invalid role.");

    const next: User = { ...this.users[idx], ...patch, id };
    next.name = next.name.trim();
    next.email = next.email.trim();
    this.users[idx] = next;
    return { ...next };
  }

  /** Removes a user by id. Returns true when something was removed. */
  remove(id: string): boolean {
    const before = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < before;
  }

  /** Convenience helper to flip a user's status. */
  setStatus(id: string, status: UserStatus): User {
    return this.update(id, { status });
  }

  // ---- Bulk actions -------------------------------------------------------

  /** Removes many users at once; returns the count actually removed. */
  bulkRemove(ids: readonly string[]): number {
    const set = new Set(ids);
    const before = this.users.length;
    this.users = this.users.filter((u) => !set.has(u.id));
    return before - this.users.length;
  }

  /** Sets the status on many users at once; returns the count updated. */
  bulkSetStatus(ids: readonly string[], status: UserStatus): number {
    const set = new Set(ids);
    let updated = 0;
    this.users = this.users.map((u) => {
      if (set.has(u.id)) {
        updated += 1;
        return { ...u, status };
      }
      return u;
    });
    return updated;
  }

  /** Assigns a role to many users at once; returns the count updated. */
  bulkSetRole(ids: readonly string[], role: Role): number {
    if (!isRole(role)) throw new UserStoreError("Invalid role.");
    const set = new Set(ids);
    let updated = 0;
    this.users = this.users.map((u) => {
      if (set.has(u.id)) {
        updated += 1;
        return { ...u, role };
      }
      return u;
    });
    return updated;
  }
}

/** Factory for a store seeded with the default users. */
export function createUserStore(seed?: readonly User[]): UserStore {
  return new UserStore(seed);
}
