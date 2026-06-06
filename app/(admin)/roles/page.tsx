import { PermissionMatrix } from "@/components/PermissionMatrix";
import { MetricCard } from "@/components/MetricCard";
import { getUsers } from "@/lib/users";
import { roleDistribution } from "@/lib/metrics";
import { ROLES, ROLE_LABELS, allowedActions } from "@/lib/rbac";

export default function RolesPage() {
  const dist = roleDistribution(getUsers());

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Roles &amp; permissions
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Every role and exactly what it is allowed to do.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ROLES.map((role) => (
          <MetricCard
            key={role}
            label={ROLE_LABELS[role]}
            value={String(dist[role])}
            hint={`${allowedActions(role).length} permissions`}
          />
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Permission matrix
      </h2>
      <div className="mt-4">
        <PermissionMatrix />
      </div>
    </div>
  );
}
