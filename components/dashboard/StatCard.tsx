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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(30,55,45,0.05)]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-600">
            {title}
          </p>

          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            {icon}
          </div>
        )}

      </div>

      {trend && (
        <div className={`mt-4 text-xs font-bold ${trendColor}`}>
          {trend}
        </div>
      )}

    </div>
  );
}