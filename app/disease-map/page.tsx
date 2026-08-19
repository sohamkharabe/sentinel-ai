"use client";

import { useMemo, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import MapPanel from "@/components/dashboard/MapPanel";
import { useOperationalStore } from "@/lib/operational-store";

const DISTRICT_OPTIONS = [
  "Lakhimpur",
  "Tinsukia",
  "Dibrugarh",
  "Jorhat",
  "Sivasagar",
  "Sonitpur",
] as const;

const districtName = (district: string) => district.split(",")[0].trim();
const activeAlert = (status: string) => !["RESOLVED", "CLOSED"].includes(status);

export default function DiseaseMapPage() {
  const { incidents, alerts, resourceRequests, dispatches } = useOperationalStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<(typeof DISTRICT_OPTIONS)[number]>("Lakhimpur");

  const districtContext = useMemo(() => {
    const selectedIncidents = incidents.filter(
      (incident) => districtName(incident.district) === selectedDistrict && incident.status === "ACTIVE",
    );
    const selectedAlerts = alerts.filter(
      (alert) => districtName(alert.district) === selectedDistrict && activeAlert(alert.status),
    );
    const selectedRequests = resourceRequests.filter(
      (request) => districtName(request.district) === selectedDistrict && request.status === "PENDING",
    );
    const selectedDispatches = dispatches.filter(
      (dispatch) => districtName(dispatch.district) === selectedDistrict && dispatch.status !== "COMPLETED",
    );
    const hasHighRiskAlert = selectedAlerts.some((alert) => alert.severity === "CRITICAL" || alert.severity === "HIGH");
    const hasOperationalEvents = selectedAlerts.length + selectedIncidents.length + selectedRequests.length + selectedDispatches.length > 0;

    return {
      alerts: selectedAlerts.length,
      incidents: selectedIncidents.length,
      requests: selectedRequests.length,
      dispatches: selectedDispatches.length,
      risk: hasHighRiskAlert || selectedIncidents.some((incident) => incident.severity === "High")
        ? "HIGH RISK"
        : hasOperationalEvents
          ? "MODERATE"
          : "SAFE",
      hasOperationalEvents,
    };
  }, [alerts, dispatches, incidents, resourceRequests, selectedDistrict]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      {isSidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-900 cursor-default bg-slate-950/40"
          />

          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
        </>
      )}

      <div className="min-h-screen">

        {/* HEADER */}
        <header className="sticky top-0 z-800 flex h-20 items-center justify-between border-b-2 border-slate-300 bg-white px-5 lg:px-8">

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
              className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-slate-300 bg-white text-xl font-extrabold text-slate-950 transition hover:bg-slate-100"
            >
              ☰
            </button>

            <div>
              <h1 className="text-xl font-extrabold text-slate-950">SURAKSHA SAARTHI</h1>
              <p className="text-sm font-semibold text-slate-600">Emergency Response Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="rounded-md border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100">Search</button>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-100 text-sm font-extrabold text-slate-950">SS</div>
          </div>

        </header>

        <main className="p-5 lg:p-8">

          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-950">Disease Risk Map</h2>
            <p className="mt-1 text-base font-medium text-slate-600">District-level disease and operational risk monitoring across Northeast India.</p>
          </div>

          <div className="rounded border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">DISTRICT RISK OVERVIEW</div>
                <div className="mt-1 text-xs text-slate-600">Green = Safe • Yellow = Moderate • Red = High Risk</div>
              </div>
            </div>

            <div className="mt-4">
              <MapPanel heightClass="relative h-[650px] w-full overflow-hidden" />
            </div>

            <section className="mt-6 border-t-2 border-slate-300 pt-5" aria-labelledby="district-operational-context">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 id="district-operational-context" className="text-lg font-extrabold tracking-tight text-slate-950">
                    DISTRICT OPERATIONAL CONTEXT
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600">{selectedDistrict.toUpperCase()}, ASSAM</p>
                </div>

                <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  District:
                  <select
                    value={selectedDistrict}
                    onChange={(event) => setSelectedDistrict(event.target.value as (typeof DISTRICT_OPTIONS)[number])}
                    className="rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-slate-600"
                  >
                    {DISTRICT_OPTIONS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Risk Level</p>
                  <p className="mt-2 text-base font-extrabold text-slate-950">{districtContext.risk}</p>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Active Alerts</p>
                  <p className="mt-2 text-xl font-extrabold text-slate-950">{districtContext.alerts}</p>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Active Incidents</p>
                  <p className="mt-2 text-xl font-extrabold text-slate-950">{districtContext.incidents}</p>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Pending Requests</p>
                  <p className="mt-2 text-xl font-extrabold text-slate-950">{districtContext.requests}</p>
                </div>
                <div className="rounded-md border-2 border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-600">Active Dispatches</p>
                  <p className="mt-2 text-xl font-extrabold text-slate-950">{districtContext.dispatches}</p>
                </div>
              </div>

              {!districtContext.hasOperationalEvents && (
                <p className="mt-4 border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold text-slate-700">
                  NO ACTIVE OPERATIONAL EVENTS
                </p>
              )}
            </section>
          </div>

        </main>

      </div>

    </div>
  );
}
