export interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
}

/** A headline metric card used on the dashboard. */
export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export default MetricCard;
