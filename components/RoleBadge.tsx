import { ROLE_LABELS, type Role } from "@/lib/rbac";

const ROLE_STYLES: Record<Role, string> = {
  owner:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  member:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export interface RoleBadgeProps {
  role: Role;
}

/** A small pill that visually encodes a user's role. */
export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      data-testid="role-badge"
      data-role={role}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export default RoleBadge;
