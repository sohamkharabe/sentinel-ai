"use client";

import dynamic from "next/dynamic";

const LeafletDistrictMap = dynamic(
  () =>
    import("./LeafletDistrictMap").then(
      (mod) => mod.default
    ),
  {
    ssr: false,

    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-100">
        <span className="text-base font-bold text-slate-700">
          Loading district map...
        </span>
      </div>
    ),
  }
);

type Props = {
  heightClass?: string;
};

export default function MapPanel({ heightClass = 'relative h-[420px] w-full overflow-hidden' }: Props) {
  return (
    <div className="w-full bg-white">

      {/* =====================================================
          MAP HEADER
      ====================================================== */}

      <div className="border-b-2 border-slate-300 px-6 py-5">

        <div className="flex items-start justify-between gap-6">

          {/* Title */}

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
              Operational Risk Map
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              Northeast India • District Risk Monitoring
            </p>
          </div>


          {/* Risk Legend */}

          <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-slate-900">

            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-green-600" />
              <span>Safe</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-yellow-500" />
              <span>Moderate</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-red-700" />
              <span>High Risk</span>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ACTUAL DISTRICT MAP
      ====================================================== */}

      <div className={heightClass}>

        <LeafletDistrictMap />

      </div>

    </div>
  );
}