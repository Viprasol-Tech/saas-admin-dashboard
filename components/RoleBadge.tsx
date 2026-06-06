import type { Role } from "@/lib/rbac";

const ROLE_STYLES: Record<Role, string> = {
  owner: "bg-indigo-100 text-indigo-800",
  admin: "bg-blue-100 text-blue-800",
  member: "bg-emerald-100 text-emerald-800",
  viewer: "bg-gray-100 text-gray-700",
};

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
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
