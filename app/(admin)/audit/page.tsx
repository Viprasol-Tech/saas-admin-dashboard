"use client";

import { useMemo, useState } from "react";
import { AuditRow } from "@/components/AuditRow";
import { MetricCard } from "@/components/MetricCard";
import {
  seedAuditEvents,
  filterBySeverity,
  searchAudit,
  countBySeverity,
  type AuditSeverity,
} from "@/lib/audit";

const SEVERITIES: readonly AuditSeverity[] = ["info", "warning", "critical"];

export default function AuditPage() {
  const events = useMemo(() => seedAuditEvents(), []);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<AuditSeverity | "all">("all");

  const visible = useMemo(() => {
    const bySeverity = filterBySeverity(events, severity);
    return searchAudit(bySeverity, query);
  }, [events, severity, query]);

  const counts = useMemo(() => countBySeverity(events), [events]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Audit log
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        An append-only record of administrative activity.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <MetricCard label="Info" value={String(counts.info)} />
        <MetricCard label="Warnings" value={String(counts.warning)} />
        <MetricCard label="Critical" value={String(counts.critical)} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          aria-label="Search audit log"
          placeholder="Search by actor, target or message..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-gray-600 dark:bg-gray-900 sm:max-w-xs"
        />
        <select
          aria-label="Filter by severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as AuditSeverity | "all")}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm capitalize focus:border-brand focus:outline-none dark:border-gray-600 dark:bg-gray-900"
        >
          <option value="all">All severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((event) => (
              <AuditRow key={event.id} event={event} />
            ))}
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500"
                >
                  No events match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
