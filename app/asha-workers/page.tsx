"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function AshaWorkersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {isSidebarOpen && (
        <>
          <button className="fixed inset-0 z-900 bg-slate-950/40" onClick={() => setIsSidebarOpen(false)} />
          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
        </>
      )}

      <div className="min-h-screen">
        <header className="sticky top-0 z-800 flex h-20 items-center justify-between border-b-2 border-slate-300 bg-white px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-slate-300 bg-white text-xl font-extrabold text-slate-950">☰</button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-950">SURAKSHA SAARTHI</h1>
              <p className="text-sm font-semibold text-slate-600">Emergency Response Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-md border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-950">Search</button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-100 text-sm font-extrabold text-slate-950">SS</div>
          </div>
        </header>

        <main className="p-5 lg:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-950">ASHA Workers</h2>
            <p className="mt-1 text-base font-medium text-slate-600">Manage ASHA worker assignments, statuses, and field reports.</p>
          </div>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded border-2 border-slate-300 bg-white p-6">
              <h3 className="text-lg font-bold text-slate-900">Active ASHA Workers</h3>
              <p className="mt-2 text-sm text-slate-600">List of currently active workers and contact details.</p>
            </div>

            <div className="rounded border-2 border-slate-300 bg-white p-6">
              <h3 className="text-lg font-bold text-slate-900">Assigned Districts</h3>
              <p className="mt-2 text-sm text-slate-600">Districts and villages assigned to each ASHA worker.</p>
            </div>

            <div className="rounded border-2 border-slate-300 bg-white p-6">
              <h3 className="text-lg font-bold text-slate-900">Field Reports</h3>
              <p className="mt-2 text-sm text-slate-600">Recent patient and community reports submitted by ASHA workers.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
