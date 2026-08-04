import * as React from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  trendColor?: string;
};

export default function StatCard({ title, value, icon, trend, trendColor = 'text-slate-700' }: StatCardProps) {
  return (
    <div className="rounded border border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      </div>

      <div className="flex flex-col items-end">
        <div className="h-8 w-8">{icon}</div>
        <div className={`text-xs ${trendColor}`}>{trend}</div>
      </div>
    </div>
  );
}
