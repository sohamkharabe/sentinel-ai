export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-64 flex-col border-r border-slate-200 bg-white px-4 py-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-semibold">SA</div>
            <div>
              <div className="text-sm font-semibold">SentinelAI</div>
              <div className="text-xs text-slate-500">Government Dashboard</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 text-sm">
            <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#">Dashboard</a>
            <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#map">Disease Map</a>
            <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#reports">Health Reports</a>
            <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#asha">ASHA Workers</a>
            <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#resources">Resources</a>
            <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#alerts">Alerts</a>
            <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#ai">AI Insights</a>
            <a className="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50" href="#settings">Settings</a>
          </nav>

          <div className="mt-6 text-xs text-slate-500">v1.0 • SentinelAI</div>
        </aside>

        <div className="flex-1">
          {/* Top header */}
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-200 text-slate-600">☰</button>
              <div>
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <div className="text-xs text-slate-500">Northeast India Operations</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:inline-flex items-center rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">Search</div>
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">GI</div>
            </div>
          </header>

          <main className="p-4 lg:p-8">
            {/* Statistics cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded border border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Active Cases</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">1,234</div>
                </div>
                <div className="flex flex-col items-end">
                  <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>
                  <div className="text-xs text-red-600">+8.4%</div>
                </div>
              </div>

              <div className="rounded border border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">High Risk Districts</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">12</div>
                </div>
                <div className="flex flex-col items-end">
                  <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  <div className="text-xs text-yellow-600">+2</div>
                </div>
              </div>

              <div className="rounded border border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Flood Alerts</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">3</div>
                </div>
                <div className="flex flex-col items-end">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4l3 10h4l3-16h4"/></svg>
                  <div className="text-xs text-blue-600">-1</div>
                </div>
              </div>

              <div className="rounded border border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Resources Pending</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">27</div>
                </div>
                <div className="flex flex-col items-end">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l5 5L20 7"/></svg>
                  <div className="text-xs text-green-600">+5%</div>
                </div>
              </div>
            </section>

            {/* Main grid */}
            <section className="mt-6 grid gap-6 lg:grid-cols-3 lg:grid-rows-[auto,1fr]">
              <div className="lg:col-span-2 lg:row-span-2 rounded border border-slate-100 p-4 bg-white">
                <h2 className="text-sm font-medium text-slate-900 mb-3">Northeast India Map</h2>
                <div id="map" className="h-64 md:h-80 rounded border border-slate-50 bg-slate-50 flex items-center justify-center text-slate-500">Map placeholder (no charts)</div>
              </div>

              <div className="rounded border border-slate-100 p-4 bg-white">
                <h3 className="text-sm font-medium text-slate-900">Live Incident Feed</h3>
                <div id="alerts" className="mt-3 space-y-3 text-sm text-slate-600">
                  <div className="rounded p-3 border border-slate-100 bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">Flooding reported — Lakhimpur, Assam</div>
                        <div className="text-xs text-slate-500 mt-1">Water levels rising near riverbank; low-lying areas advised to evacuate. Reported 5 minutes ago.</div>
                      </div>
                      <div className="text-xs text-red-600 font-semibold">High</div>
                    </div>
                  </div>

                  <div className="rounded p-3 border border-slate-100 bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">Febrile illness cluster — Tinsukia District</div>
                        <div className="text-xs text-slate-500 mt-1">12 patients with fever and respiratory symptoms; samples pending. Reported 1 hour ago.</div>
                      </div>
                      <div className="text-xs text-yellow-600 font-semibold">Medium</div>
                    </div>
                  </div>

                  <div className="rounded p-3 border border-slate-100 bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">Bridge damage — NH-37 near Dibrugarh</div>
                        <div className="text-xs text-slate-500 mt-1">Structural damage reported; route closed for heavy vehicles. Reported 2 hours ago.</div>
                      </div>
                      <div className="text-xs text-red-600 font-semibold">High</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded border border-slate-100 p-4 bg-white">
                <h3 className="text-sm font-medium text-slate-900">AI Recommendations</h3>
                <div id="ai" className="mt-3 space-y-3 text-sm text-slate-600">
                  <div className="rounded p-3 border border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Deploy 2 mobile medical units to Dibrugarh</div>
                        <div className="text-xs text-slate-500 mt-1">Predicted 72% probability of febrile outbreak in next 48 hours. Priority: High.</div>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold">Confidence: 72%</div>
                    </div>
                  </div>

                  <div className="rounded p-3 border border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Preposition sandbags and pumps in Lakhimpur</div>
                        <div className="text-xs text-slate-500 mt-1">Hydrological model indicates 68% chance of flooding in 24–36 hours. Coordinate with district administration.</div>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold">Confidence: 68%</div>
                    </div>
                  </div>

                  <div className="rounded p-3 border border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Prioritise sample testing in Tinsukia</div>
                        <div className="text-xs text-slate-500 mt-1">Anomaly detection flags rising febrile cases; recommend rapid diagnostic testing and contact tracing.</div>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold">Confidence: 75%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 rounded border border-slate-100 p-4 bg-white">
                <h3 className="text-sm font-medium text-slate-900">Resource Requests</h3>
                <div id="resources" className="mt-3 text-sm text-slate-600">No active requests</div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
