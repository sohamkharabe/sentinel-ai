type StatCardProps = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: string;
  trendColor?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendColor = "text-slate-700",
}: StatCardProps) {
  return (
    <div className="rounded-lg border-2 border-slate-300 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-base font-bold text-slate-700">
            {title}
          </p>

          <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center">
            {icon}
          </div>
        )}

      </div>

      {trend && (
        <div className={`mt-4 text-sm font-extrabold ${trendColor}`}>
          {trend}
        </div>
      )}

    </div>
  );
}