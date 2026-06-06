"use client";

import { useMemo, useState } from "react";
import { UserRow } from "@/components/UserRow";
import { MetricCard } from "@/components/MetricCard";
import { Pagination } from "@/components/Pagination";
import { createUserStore, type UserStore } from "@/lib/userStore";
import {
  searchUsers,
  filterByRole,
  filterByStatus,
  sortUsers,
  type UserStatus,
} from "@/lib/users";
import { summarize, formatUsd, formatPercent } from "@/lib/metrics";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/rbac";

const PAGE_SIZE = 4;
const STATUSES: readonly UserStatus[] = ["active", "invited", "suspended"];

export default function UsersPage() {
  // The store is a stable instance for the life of the page so bulk actions
  // mutate real state; we bump `version` to force re-derivation after writes.
  const [store] = useState<UserStore>(() => createUserStore());
  const [version, setVersion] = useState(0);

  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "all">("all");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allUsers = useMemo(() => store.list(), [store, version]);

  const filtered = useMemo(() => {
    const byRole = filterByRole(allUsers, role);
    const byStatus = filterByStatus(byRole, status);
    const bySearch = searchUsers(byStatus, query);
    return sortUsers(bySearch, "name");
  }, [allUsers, role, status, query]);

  const metrics = useMemo(() => summarize(allUsers), [allUsers]);

  const pageData = useMemo(() => {
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const current = Math.min(Math.max(1, page), totalPages);
    const start = (current - 1) * PAGE_SIZE;
    const items = filtered.slice(start, start + PAGE_SIZE);
    return {
      items,
      page: current,
      totalPages,
      total,
      from: total === 0 ? 0 : start + 1,
      to: total === 0 ? 0 : start + items.length,
    };
  }, [filtered, page]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function refresh() {
    setSelected(new Set());
    setVersion((v) => v + 1);
  }

  function bulkSuspend() {
    store.bulkSetStatus([...selected], "suspended");
    refresh();
  }

  function bulkActivate() {
    store.bulkSetStatus([...selected], "active");
    refresh();
  }

  function bulkDelete() {
    store.bulkRemove([...selected]);
    refresh();
  }

  const selectedCount = selected.size;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Users
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
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
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-gray-600 dark:bg-gray-900 sm:max-w-xs"
        />
        <select
          aria-label="Filter by role"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as Role | "all");
            setPage(1);
          }}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none dark:border-gray-600 dark:bg-gray-900"
        >
          <option value="all">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as UserStatus | "all");
            setPage(1);
          }}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm capitalize focus:border-brand focus:outline-none dark:border-gray-600 dark:bg-gray-900"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {selectedCount > 0 ? (
        <div
          data-testid="bulk-bar"
          className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-brand/30 bg-brand/5 px-4 py-2 text-sm dark:border-brand/40 dark:bg-brand/10"
        >
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {selectedCount} selected
          </span>
          <button
            type="button"
            onClick={bulkActivate}
            className="rounded-md border border-gray-300 px-2.5 py-1 hover:bg-white dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Activate
          </button>
          <button
            type="button"
            onClick={bulkSuspend}
            className="rounded-md border border-gray-300 px-2.5 py-1 hover:bg-white dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Suspend
          </button>
          <button
            type="button"
            onClick={bulkDelete}
            className="rounded-md border border-rose-300 px-2.5 py-1 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/30"
          >
            Delete
          </button>
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Seat MRR</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {pageData.items.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                selectable
                selected={selected.has(user.id)}
                onToggle={toggle}
              />
            ))}
            {pageData.items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500"
                >
                  No users match your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        {pageData.total > 0 ? (
          <Pagination
            page={pageData.page}
            totalPages={pageData.totalPages}
            from={pageData.from}
            to={pageData.to}
            total={pageData.total}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </div>
  );
}
