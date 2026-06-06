"use client";

import { useMemo, useState } from "react";
import { UserRow } from "@/components/UserRow";
import { MetricCard } from "@/components/MetricCard";
import { getUsers, searchUsers, filterByRole, sortUsers } from "@/lib/users";
import { summarize, formatUsd, formatPercent } from "@/lib/metrics";
import { ROLES, type Role } from "@/lib/rbac";

export default function UsersPage() {
  const allUsers = useMemo(() => getUsers(), []);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "all">("all");

  const visible = useMemo(() => {
    const byRole = filterByRole(allUsers, role);
    const bySearch = searchUsers(byRole, query);
    return sortUsers(bySearch, "name");
  }, [allUsers, role, query]);

  const metrics = summarize(allUsers);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
      <p className="mt-1 text-gray-500">
        Manage team members, roles, and access.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="MRR" value={formatUsd(metrics.mrr)} />
        <MetricCard label="Active users" value={String(metrics.activeUsers)} />
        <MetricCard label="ARPU" value={formatUsd(metrics.arpu)} />
        <MetricCard label="Churn" value={formatPercent(metrics.churnRate)} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          aria-label="Search users"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none sm:max-w-xs"
        />
        <select
          aria-label="Filter by role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role | "all")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        >
          <option value="all">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Seat MRR</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No users match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
