import type { User, UserStatus } from "@/lib/users";
import { formatUsd } from "@/lib/metrics";
import { RoleBadge } from "./RoleBadge";

const STATUS_STYLES: Record<UserStatus, string> = {
  active: "bg-emerald-100 text-emerald-800",
  invited: "bg-amber-100 text-amber-800",
  suspended: "bg-rose-100 text-rose-800",
};

export interface UserRowProps {
  user: User;
}

/** A single table row describing one user. */
export function UserRow({ user }: UserRowProps) {
  return (
    <tr data-testid="user-row" className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{user.name}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </td>
      <td className="px-4 py-3">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[user.status]}`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-gray-700">
        {formatUsd(user.seatMrr)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{user.createdAt}</td>
    </tr>
  );
}

export default UserRow;
