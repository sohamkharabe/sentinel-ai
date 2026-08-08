"use client";

import dynamic from "next/dynamic";

const LeafletDistrictMap = dynamic(
  () => import("./LeafletDistrictMap"),
  {
    ssr: false,

    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <span className="text-sm text-slate-500">
          Loading district map...
        </span>
      </div>
    ),
  }
);

export default function MapPanel() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-lg font-medium text-slate-900">
            Operational Risk Map
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Northeast India • District Risk Monitoring
          </p>
        </div>

        {/* Legend */}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-600">
              Safe
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="text-xs text-slate-600">
              Moderate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-600" />
            <span className="text-xs text-slate-600">
              High Risk
            </span>
          </div>
        </div>
      </div>

      {/* Map */}

      <div className="relative h-64 overflow-hidden rounded-b-lg border-t border-slate-100 md:h-80">
        <LeafletDistrictMap />

        {/* Compass */}

        <div className="pointer-events-none absolute left-4 top-4 z-[1000]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
            🧭
          </div>
        </div>

        {/* Last updated */}

        <div className="pointer-events-none absolute bottom-3 left-3 z-[1000]">
          <div className="rounded bg-white/90 px-3 py-1 text-xs text-slate-500 shadow-sm">
            Last Updated: Just now
          </div>
        </div>
      </div>
    </div>
  );
}