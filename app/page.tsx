import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { getUsers } from "@/lib/users";
import {
  summarize,
  formatUsd,
  formatPercent,
  calcRetentionRate,
  calcLtv,
  statusBreakdown,
} from "@/lib/metrics";

export default function HomePage() {
  const users = getUsers();
  const metrics = summarize(users);
  const retention = calcRetentionRate(users);
  const ltv = calcLtv(users);
  const status = statusBreakdown(users);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Overview
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Headline metrics for your workspace.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="MRR"
          value={formatUsd(metrics.mrr)}
          hint="Monthly recurring revenue"
        />
        <MetricCard
          label="ARR"
          value={formatUsd(metrics.arr)}
          hint="Annual run rate"
        />
        <MetricCard
          label="Active users"
          value={String(metrics.activeUsers)}
          hint={`${users.length} total`}
        />
        <MetricCard
          label="Churn"
          value={formatPercent(metrics.churnRate)}
          hint={`ARPU ${formatUsd(metrics.arpu)}`}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Retention"
          value={formatPercent(retention)}
          hint="1 − churn"
        />
        <MetricCard label="Est. LTV" value={formatUsd(ltv)} hint="ARPU ÷ churn" />
        <MetricCard
          label="Invited"
          value={String(status.invited)}
          hint="Pending activation"
        />
        <MetricCard
          label="Suspended"
          value={String(status.suspended)}
          hint="Inactive accounts"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/users"
          className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Manage users
        </Link>
        <Link
          href="/roles"
          className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          View roles
        </Link>
        <Link
          href="/audit"
          className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Audit log
        </Link>
      </div>
    </div>
  );
}
