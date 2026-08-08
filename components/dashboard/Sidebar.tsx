"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  onNavigate?: () => void;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Disease Map",
    href: "/disease-map",
  },
  {
    label: "Reports",
    href: "/reports",
  },
  {
    label: "ASHA Workers",
    href: "/asha-workers",
  },
  {
    label: "Resources",
    href: "/resources",
  },
  {
    label: "Alerts",
    href: "/alerts",
  },
  {
    label: "AI Insights",
    href: "/ai-insights",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-1000
        flex
        h-screen
        w-90
        flex-col
        overflow-hidden
        border-r-2
        border-slate-300
        bg-white
        shadow-2xl
      "
    >
      {/* ================================================= */}
      {/* BRAND */}
      {/* ================================================= */}

      <div className="shrink-0 border-b-2 border-slate-300 px-7 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-950">
              SURAKSHA SAARTHI
            </div>

            <div className="mt-1 text-sm font-bold uppercase tracking-wide text-slate-600">
              Emergency Response Platform
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close navigation"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-md
              border-2
              border-slate-300
              bg-white
              text-xl
              font-extrabold
              text-slate-950
              transition
              hover:bg-slate-100
            "
          >
            ×
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        <p className="mb-5 px-2 text-base font-extrabold uppercase tracking-wider text-slate-700">
          Navigation
        </p>

        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard' && item.label === 'Dashboard'
              : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className={`
                  flex
                  min-h-14
                  items-center
                  rounded-md
                  border-2
                  px-5
                  text-lg
                  font-bold
                  transition-colors
                  ${
                    isActive
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-transparent text-slate-900 hover:border-slate-300 hover:bg-slate-100"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <div className="shrink-0 border-t-2 border-slate-300 p-5">
        <div className="rounded-md border-2 border-slate-300 bg-slate-50 p-5">
          <div className="text-base font-extrabold text-slate-950">
            Operations Console
          </div>

          <div className="mt-1 text-sm font-semibold text-slate-700">
            Northeast India
          </div>
        </div>
      </div>
    </aside>
  );
}