"use client";

import type { Incident } from "@/lib/operational-store";
import { MapPin, Siren, TriangleAlert } from "lucide-react";

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
    <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(30,55,45,0.05)]">
      
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-950">
          Live Incident Feed
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-600">
          Active incidents requiring operational attention
        </p></div><span className="text-xs font-bold text-slate-400">Live</span></div>
      </div>

      {/* INCIDENT LIST */}
      <div className="space-y-1 pt-3">
        {incidents.map((incident) => {
          const isHigh = incident.severity === "High";

          return (
            <div key={incident.id} className="border-b border-slate-200 py-4 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3"><div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isHigh ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>{isHigh ? <Siren className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}</div><div><h3 className="text-sm font-semibold text-slate-950">{incident.title}</h3><p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500"><MapPin className="h-3 w-3" />{incident.district}</p></div></div>

                <span
                  className={`shrink-0 text-sm font-extrabold ${
                    isHigh
                      ? "text-red-700"
                      : "text-amber-700"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${isHigh ? "bg-red-500" : "bg-amber-500"}`} /> {incident.severity}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
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
                  className="text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-900"
                >
                  CREATE RESOURCE REQUEST <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
