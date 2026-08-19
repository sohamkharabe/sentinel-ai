"use client";

import { useState } from "react";
import { Bell, ClipboardClock, FileWarning, Menu, Search, ShieldAlert } from "lucide-react";
import { useOperationalStore, type Alert, type Incident } from "@/lib/operational-store";

import Sidebar from "@/components/dashboard/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import MapPanel from "@/components/dashboard/MapPanel";
import IncidentFeed from "@/components/dashboard/IncidentFeed";
import AIRecommendations from "@/components/dashboard/AIRecommendations";
import ResourceRequestBuilder from "@/components/dashboard/ResourceRequestBuilder";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const { incidents, alerts, resourceRequests, dispatches, ensureAlertForIncident } = useOperationalStore();
  const activeAlerts = alerts.filter((alert) => !["RESOLVED", "CLOSED"].includes(alert.status));
  const highRiskDistricts = new Set(activeAlerts.filter((alert) => ["CRITICAL", "HIGH"].includes(alert.severity)).map((alert) => alert.district)).size;
  const pendingRequests = resourceRequests.filter((request) => request.status === "PENDING").length;
  const activeDispatches = dispatches.filter((dispatch) => dispatch.status !== "COMPLETED").length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      {isSidebarOpen && (
        <>
          {/* BACKDROP */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsSidebarOpen(false)}
            className="
              fixed
              inset-0
              z-900
              cursor-default
              bg-slate-950/40
            "
          />

          <Sidebar
            onNavigate={() => setIsSidebarOpen(false)}
          />
        </>
      )}

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="min-h-screen">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header
          className="
            sticky
            top-0
            z-800
            flex
            h-20
            items-center
            justify-between
            border-b-2
            border-slate-300
            bg-white
            px-5
            lg:px-8
          "
        >

          {/* LEFT */}

          <div className="flex items-center gap-4">

            {/* MENU */}

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
              className="
                flex
                h-11
                w-11
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
            ><span className="sr-only">Open navigation</span><Menu className="h-5 w-5" /></button>

            <div>
              <h1 className="text-xl font-extrabold text-slate-950">
                SURAKSHA SAARTHI
              </h1>

              <p className="text-sm font-semibold text-slate-600">
                Emergency Response Platform
              </p>
            </div>

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="
                rounded-md
                border-2
                border-slate-300
                bg-white
                px-5
                py-2.5
                text-sm
                font-bold
                text-slate-950
                transition
                hover:bg-slate-100
              "
            ><Search className="mr-2 inline h-4 w-4" />
              Search
            </button>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border-2
                border-slate-300
                bg-slate-100
                text-sm
                font-extrabold
                text-slate-950
              "
            >
              SS
            </div>

          </div>

        </header>


        {/* ================================================= */}
        {/* MAIN DASHBOARD */}
        {/* ================================================= */}

        <main className="p-5 lg:p-8">

          {/* PAGE TITLE */}

          <div className="mb-6">

            <h2 className="text-2xl font-extrabold text-slate-950">
              Dashboard
            </h2>

            <p className="mt-1 text-base font-medium text-slate-600">
              Northeast India Operations
            </p>

          </div>


          {/* ================================================= */}
          {/* OVERALL REPORTS */}
          {/* ================================================= */}

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* ACTIVE CASES */}

            <StatCard
              title="Active Alerts"
              value={activeAlerts.length}
              icon={<Bell className="h-5 w-5 text-red-600" />}
              trend="Live operational state"
              trendColor="text-emerald-700"
            />


            {/* HIGH RISK DISTRICTS */}

            <StatCard
              title="High Risk Districts"
              value={highRiskDistricts}
              icon={<ShieldAlert className="h-5 w-5 text-orange-600" />}
              trend="Active alerts"
              trendColor="text-orange-600"
            />


            {/* FLOOD ALERTS */}

            <StatCard
              title="Active Incidents"
              value={incidents.length}
              icon={<FileWarning className="h-5 w-5 text-blue-600" />}
              trend="Field operations"
              trendColor="text-blue-600"
            />


            {/* RESOURCES PENDING */}

            <StatCard
              title="Pending Requests"
              value={pendingRequests}
              icon={<ClipboardClock className="h-5 w-5 text-emerald-600" />}
              trend={`${activeDispatches} active dispatches`}
              trendColor="text-green-600"
            />

          </section>


          {/* ================================================= */}
          {/* MAP + INCIDENT FEED */}
          {/* ================================================= */}

          <section
            className="
              mt-6
              grid
              gap-6
              lg:grid-cols-[65%_35%]
            "
          >

            {/* MAP */}

            <MapPanel />


            {/* INCIDENT FEED */}

            <IncidentFeed
              incidents={incidents}
              onCreateResourceRequest={(incident) => {
                setSelectedIncident(incident);
                setSelectedAlert(ensureAlertForIncident(incident.id) ?? null);
              }}
            />

          </section>


          {/* ================================================= */}
          {/* DISPATCH + AI */}
          {/* ================================================= */}

          <section
            className="
              mt-6
              grid
              gap-6
              lg:grid-cols-[65%_35%]
            "
          >

            {/* EMERGENCY DISPATCH */}

            <div id="dispatch-section">
              <ResourceRequestBuilder incident={selectedIncident} alertId={selectedAlert?.id} />
            </div>


            {/* AI RECOMMENDATIONS */}

            <AIRecommendations />

          </section>

        </main>

      </div>

    </div>
  );
}
