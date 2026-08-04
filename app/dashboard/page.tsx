import Sidebar from '../../components/dashboard/Sidebar';
import StatCard from '../../components/dashboard/StatCard';
import MapPanel from '../../components/dashboard/MapPanel';
import IncidentFeed from '../../components/dashboard/IncidentFeed';
import AIRecommendations from '../../components/dashboard/AIRecommendations';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="flex">
        {/* Sidebar */}
        {/* Reusable Sidebar component */}
        <Sidebar />

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
              <StatCard
                title="Active Cases"
                value={1234}
                icon={<svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>}
                trend="+8.4%"
                trendColor="text-red-600"
              />

              <StatCard
                title="High Risk Districts"
                value={12}
                icon={<svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>}
                trend="+2"
                trendColor="text-yellow-600"
              />

              <StatCard
                title="Flood Alerts"
                value={3}
                icon={<svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4l3 10h4l3-16h4"/></svg>}
                trend="-1"
                trendColor="text-blue-600"
              />

              <StatCard
                title="Resources Pending"
                value={27}
                icon={<svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l5 5L20 7"/></svg>}
                trend="+5%"
                trendColor="text-green-600"
              />
            </section>

            {/* Main grid */}
            <section className="mt-6 grid gap-6 lg:grid-cols-3 lg:grid-rows-[auto,1fr]">
              <MapPanel />

              <IncidentFeed />

              <AIRecommendations />

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
