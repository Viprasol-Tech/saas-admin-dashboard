/**
 * Role-based access control (RBAC).
 *
 * A small, fully-typed permission matrix that maps each role to the set of
 * actions it is allowed to perform. `can()` is the single entry point used by
 * pages and components to gate UI and operations.
 */

export type Role = "owner" | "admin" | "member" | "viewer";

export type Action =
  | "user:read"
  | "user:invite"
  | "user:update"
  | "user:delete"
  | "billing:read"
  | "billing:manage"
  | "settings:manage";

export const ROLES: readonly Role[] = [
  "owner",
  "admin",
  "member",
  "viewer",
] as const;

export const ACTIONS: readonly Action[] = [
  "user:read",
  "user:invite",
  "user:update",
  "user:delete",
  "billing:read",
  "billing:manage",
  "settings:manage",
] as const;

/**
 * The permission matrix. Each role lists exactly the actions it may perform.
 * `owner` is a superset of `admin`, which is a superset of `member`, etc., but
 * we spell each role out explicitly so the matrix is auditable at a glance.
 */
const PERMISSIONS: Record<Role, ReadonlySet<Action>> = {
  owner: new Set<Action>([
    "user:read",
    "user:invite",
    "user:update",
    "user:delete",
    "billing:read",
    "billing:manage",
    "settings:manage",
  ]),
  admin: new Set<Action>([
    "user:read",
    "user:invite",
    "user:update",
    "user:delete",
    "billing:read",
    "settings:manage",
  ]),
  member: new Set<Action>(["user:read", "billing:read"]),
  viewer: new Set<Action>(["user:read"]),
};

/** Returns true when `role` is permitted to perform `action`. */
export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[role]?.has(action) ?? false;
}

/** Returns the sorted list of actions a role can perform. */
export function allowedActions(role: Role): Action[] {
  return [...(PERMISSIONS[role] ?? new Set<Action>())].sort();
}

/** Type guard for validating untrusted strings as roles. */
export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

/**
 * Rank used for hierarchy comparisons (higher = more privileged).
 * Useful for "you cannot edit a user more privileged than you" rules.
 */
const ROLE_RANK: Record<Role, number> = {
  owner: 3,
  admin: 2,
  member: 1,
  viewer: 0,
};

/** True when `actor` is strictly more privileged than `target`. */
export function outranks(actor: Role, target: Role): boolean {
  return ROLE_RANK[actor] > ROLE_RANK[target];
}
