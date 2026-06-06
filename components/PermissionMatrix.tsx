import {
  ROLES,
  ACTIONS,
  ROLE_LABELS,
  ACTION_LABELS,
  permissionMatrix,
} from "@/lib/rbac";

/**
 * Renders the full RBAC permission grid as a table: rows are actions, columns
 * are roles, cells show whether the role may perform the action.
 */
export function PermissionMatrix() {
  const cells = permissionMatrix();
  const allowed = (role: string, action: string) =>
    cells.find((c) => c.role === role && c.action === action)?.allowed ?? false;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Permission</th>
            {ROLES.map((role) => (
              <th key={role} className="px-4 py-3 text-center">
                {ROLE_LABELS[role]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ACTIONS.map((action) => (
            <tr
              key={action}
              data-testid="matrix-row"
              className="border-b border-gray-100 last:border-0 dark:border-gray-800"
            >
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                {ACTION_LABELS[action]}
              </td>
              {ROLES.map((role) => {
                const ok = allowed(role, action);
                return (
                  <td
                    key={`${role}:${action}`}
                    data-testid="matrix-cell"
                    data-allowed={ok}
                    className="px-4 py-3 text-center"
                  >
                    <span
                      aria-label={ok ? "allowed" : "denied"}
                      className={
                        ok
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    >
                      {ok ? "✓" : "—"}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PermissionMatrix;
