"use client";

import { useState } from "react";
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
  const { incidents, ensureAlertForIncident } = useOperationalStore();

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
            >
              ☰
            </button>

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
            >
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
              title="Active Cases"
              value={1234}
              icon={
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              }
              trend="+8.4%"
              trendColor="text-red-600"
            />


            {/* HIGH RISK DISTRICTS */}

            <StatCard
              title="High Risk Districts"
              value={12}
              icon={
                <svg
                  className="h-8 w-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
              trend="+2"
              trendColor="text-orange-600"
            />


            {/* FLOOD ALERTS */}

            <StatCard
              title="Flood Alerts"
              value={3}
              icon={
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h4l3 10h4l3-16h4"
                  />
                </svg>
              }
              trend="-1"
              trendColor="text-blue-600"
            />


            {/* RESOURCES PENDING */}

            <StatCard
              title="Resources Pending"
              value={27}
              icon={
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12l5 5L20 7"
                  />
                </svg>
              }
              trend="+5%"
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
