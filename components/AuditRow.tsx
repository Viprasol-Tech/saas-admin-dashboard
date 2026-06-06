import type { AuditEvent, AuditSeverity } from "@/lib/audit";
import { RoleBadge } from "./RoleBadge";

const SEVERITY_STYLES: Record<AuditSeverity, string> = {
  info: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  critical:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

export interface AuditRowProps {
  event: AuditEvent;
}

/** A single row in the audit-log table. */
export function AuditRow({ event }: AuditRowProps) {
  return (
    <tr
      data-testid="audit-row"
      className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
    >
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        {event.at.replace("T", " ").replace(".000Z", " UTC")}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {event.actor}
        </div>
        <div className="mt-0.5">
          <RoleBadge role={event.actorRole} />
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
        {event.action}
      </td>
      <td className="px-4 py-3">
        <span
          data-testid="severity-badge"
          data-severity={event.severity}
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${SEVERITY_STYLES[event.severity]}`}
        >
          {event.severity}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        {event.message}
      </td>
    </tr>
  );
}

export default AuditRow;
