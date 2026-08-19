"use client";

import type { Incident } from "@/lib/operational-store";

export type { Incident } from "@/lib/operational-store";

type IncidentFeedProps = {
  incidents: Incident[];
  onCreateResourceRequest: (incident: Incident) => void;
};

export default function IncidentFeed({
  incidents,
  onCreateResourceRequest,
}: IncidentFeedProps) {
  return (
    <section className="overflow-hidden rounded-lg border-2 border-slate-400 bg-white shadow-sm">
      
      {/* HEADER */}
      <div className="border-b-2 border-slate-300 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-950">
          Live Incident Feed
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-600">
          Active incidents requiring operational attention
        </p>
      </div>

      {/* INCIDENT LIST */}
      <div className="space-y-3 p-4">
        {incidents.map((incident) => {
          const isHigh = incident.severity === "High";

          return (
            <div
              key={incident.id}
              className={`rounded-md border-2 p-4 ${
                isHigh
                  ? "border-red-300 bg-red-50"
                  : "border-amber-300 bg-amber-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-bold text-slate-950">
                  {incident.title}
                </h3>

                <span
                  className={`shrink-0 text-sm font-extrabold ${
                    isHigh
                      ? "text-red-700"
                      : "text-amber-700"
                  }`}
                >
                  {incident.severity}
                </span>
              </div>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                {incident.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  {incident.reported}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onCreateResourceRequest(incident)
                  }
                  className="text-xs font-extrabold text-slate-950 underline underline-offset-2 hover:text-blue-700"
                >
                  CREATE RESOURCE REQUEST →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
