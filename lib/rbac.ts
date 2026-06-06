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
  | "user:create"
  | "user:update"
  | "user:delete"
  | "user:suspend"
  | "billing:read"
  | "billing:manage"
  | "audit:read"
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
  "user:create",
  "user:update",
  "user:delete",
  "user:suspend",
  "billing:read",
  "billing:manage",
  "audit:read",
  "settings:manage",
] as const;

/** Human-readable labels for each role, for use in UI. */
export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};

/** Human-readable labels for each action, for the permission matrix UI. */
export const ACTION_LABELS: Record<Action, string> = {
  "user:read": "View users",
  "user:invite": "Invite users",
  "user:create": "Create users",
  "user:update": "Edit users",
  "user:delete": "Delete users",
  "user:suspend": "Suspend users",
  "billing:read": "View billing",
  "billing:manage": "Manage billing",
  "audit:read": "View audit log",
  "settings:manage": "Manage settings",
};

/**
 * The permission matrix. Each role lists exactly the actions it may perform.
 * `owner` is a superset of `admin`, which is a superset of `member`, etc., but
 * we spell each role out explicitly so the matrix is auditable at a glance.
 */
const PERMISSIONS: Record<Role, ReadonlySet<Action>> = {
  owner: new Set<Action>([
    "user:read",
    "user:invite",
    "user:create",
    "user:update",
    "user:delete",
    "user:suspend",
    "billing:read",
    "billing:manage",
    "audit:read",
    "settings:manage",
  ]),
  admin: new Set<Action>([
    "user:read",
    "user:invite",
    "user:create",
    "user:update",
    "user:delete",
    "user:suspend",
    "billing:read",
    "audit:read",
    "settings:manage",
  ]),
  member: new Set<Action>(["user:read", "billing:read"]),
  viewer: new Set<Action>(["user:read"]),
};

/** Returns true when `role` is permitted to perform `action`. */
export function can(role: Role, action: Action): boolean {
  return PERMISSIONS[role]?.has(action) ?? false;
}

/** True when `role` may perform *all* of the supplied actions. */
export function canAll(role: Role, actions: readonly Action[]): boolean {
  return actions.every((a) => can(role, a));
}

/** True when `role` may perform *any* of the supplied actions. */
export function canAny(role: Role, actions: readonly Action[]): boolean {
  return actions.some((a) => can(role, a));
}

/** Returns the sorted list of actions a role can perform. */
export function allowedActions(role: Role): Action[] {
  return [...(PERMISSIONS[role] ?? new Set<Action>())].sort();
}

/** Type guard for validating untrusted strings as roles. */
export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

/** Type guard for validating untrusted strings as actions. */
export function isAction(value: string): value is Action {
  return (ACTIONS as readonly string[]).includes(value);
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

/** Numeric privilege rank for a role (owner highest, viewer lowest). */
export function roleRank(role: Role): number {
  return ROLE_RANK[role];
}

/** True when `actor` is strictly more privileged than `target`. */
export function outranks(actor: Role, target: Role): boolean {
  return ROLE_RANK[actor] > ROLE_RANK[target];
}

/**
 * Whether `actor` may manage (edit/delete/suspend) `target`.
 * An actor needs the relevant permission AND must strictly outrank the target,
 * except an owner can always manage other owners is *not* allowed — owners are
 * peers, so they cannot delete each other through this guard.
 */
export function canManageUser(
  actor: Role,
  target: Role,
  action: Extract<Action, "user:update" | "user:delete" | "user:suspend">,
): boolean {
  if (!can(actor, action)) return false;
  return outranks(actor, target);
}

export interface PermissionCell {
  role: Role;
  action: Action;
  allowed: boolean;
}

/**
 * Builds the full role x action grid as a flat, render-friendly list of cells.
 * Used to drive the permission-matrix table in the UI and to snapshot-test the
 * matrix as a whole.
 */
export function permissionMatrix(): PermissionCell[] {
  const cells: PermissionCell[] = [];
  for (const role of ROLES) {
    for (const action of ACTIONS) {
      cells.push({ role, action, allowed: can(role, action) });
    }
  }
  return cells;
}
