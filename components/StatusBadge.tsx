import type { UserStatus } from "@/lib/users";

const STATUS_STYLES: Record<UserStatus, string> = {
  active:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  invited:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  suspended:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

export interface StatusBadgeProps {
  status: UserStatus;
}

/** A small pill encoding a user's account status. */
export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      data-testid="status-badge"
      data-status={status}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
