import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { getUsers } from "@/lib/users";
import {
  summarize,
  formatUsd,
  formatPercent,
} from "@/lib/metrics";

export default function HomePage() {
  const users = getUsers();
  const metrics = summarize(users);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
      <p className="mt-1 text-gray-500">
        Headline metrics for your workspace.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="MRR" value={formatUsd(metrics.mrr)} hint="Monthly recurring revenue" />
        <MetricCard label="ARR" value={formatUsd(metrics.arr)} hint="Annual run rate" />
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

      <div className="mt-8">
        <Link
          href="/users"
          className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Manage users
        </Link>
      </div>
    </div>
  );
}
