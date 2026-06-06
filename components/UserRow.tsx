import type { User } from "@/lib/users";
import { formatUsd } from "@/lib/metrics";
import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";

export interface UserRowProps {
  user: User;
  /** When provided, renders a selection checkbox in the first column. */
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
}

/** A single table row describing one user. */
export function UserRow({
  user,
  selectable = false,
  selected = false,
  onToggle,
}: UserRowProps) {
  return (
    <tr
      data-testid="user-row"
      data-selected={selectable ? selected : undefined}
      className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
    >
      {selectable ? (
        <td className="px-4 py-3">
          <input
            type="checkbox"
            aria-label={`Select ${user.name}`}
            checked={selected}
            onChange={() => onToggle?.(user.id)}
            className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
          />
        </td>
      ) : null}
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {user.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {user.email}
        </div>
      </td>
      <td className="px-4 py-3">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
        {formatUsd(user.seatMrr)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        {user.createdAt}
      </td>
    </tr>
  );
}

export default UserRow;
