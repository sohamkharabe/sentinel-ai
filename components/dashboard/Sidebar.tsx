"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FileBarChart,
  HeartPulse,
  LayoutDashboard,
  Map,
  Package,
  Settings,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

type SidebarProps = { onNavigate?: () => void; desktop?: boolean };

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Disease Map", href: "/disease-map", icon: Map },
  { label: "Reports", href: "/reports", icon: FileBarChart },
  { label: "ASHA Workers", href: "/asha-workers", icon: UsersRound },
  { label: "Resources", href: "/resources", icon: Package },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "AI Insights", href: "/ai-insights", icon: Sparkles },
];

export default function Sidebar({ onNavigate, desktop = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${desktop ? "hidden lg:flex" : "flex"} fixed inset-y-0 left-0 z-1000 h-screen w-[280px] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-xl shadow-slate-900/5`}>
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-slate-950">SURAKSHA SAARTHI</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Emergency Response</div>
          </div>
        </div>
        <button type="button" onClick={onNavigate} aria-label="Close navigation" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Main</p>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} onClick={onNavigate} className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${isActive ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
                {isActive && <span className="absolute left-0 h-6 w-1 rounded-r-full bg-emerald-600" />}
                <Icon className={`h-[18px] w-[18px] ${isActive ? "text-emerald-700" : "text-slate-400 group-hover:text-slate-600"}`} strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <p className="mb-3 mt-8 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Management</p>
        <Link href="/settings" onClick={onNavigate} className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${pathname === "/settings" ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
          <Settings className="h-[18px] w-[18px] text-slate-400" strokeWidth={1.8} />
          Settings
        </Link>
      </nav>

      <div className="shrink-0 space-y-4 border-t border-slate-100 p-4">
        <div className="rounded-2xl bg-emerald-900 p-4 text-white">
          <div className="flex items-center gap-2 text-sm font-bold"><HeartPulse className="h-4 w-4 text-emerald-300" /> Stay prepared</div>
          <p className="mt-2 text-xs leading-5 text-emerald-100">Real-time monitoring for a safer Northeast India.</p>
          <p className="mt-3 text-xs font-bold text-emerald-200">Operational readiness</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-xs font-extrabold text-white">SS</div>
          <div className="min-w-0"><p className="truncate text-xs font-bold text-slate-900">Soham Sharma</p><p className="truncate text-[11px] text-slate-500">Operations Admin</p></div>
        </div>
      </div>
    </aside>
  );
}
